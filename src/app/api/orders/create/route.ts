import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

interface CartItem {
  productId: string;
  name?: string;
  quantity: number;
  size: string;
  colour: string;
  unitPrice: number;
}

export async function POST(req: NextRequest) {
  try {
    // Risk #2 Fix: Rate Limiting to prevent inventory denial-of-service
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = checkRateLimit(`order:${clientIp}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 }); // 5 orders per hour per IP
    
    if (!rateCheck.allowed) {
      logger.warn({ action: 'rate_limited', metadata: { ip: clientIp, resetInMs: rateCheck.resetInMs } });
      return NextResponse.json(
        { success: false, message: "Too many orders. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { items, deliveryZone, paymentMethod, deliveryFee } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      logger.warn({ action: 'checkout_failed', metadata: { reason: 'Empty cart' } });
      return NextResponse.json(
        { success: false, message: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!deliveryZone || !['addis', 'nationwide'].includes(deliveryZone)) {
      return NextResponse.json(
        { success: false, message: "Valid delivery zone is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['chapa', 'cod'].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Valid payment method is required" },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `KS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Secure Price & Stock Validation
    const productIds = items.map((i: CartItem) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, inStock: true }
    });

    let secureServerTotal = 0;
    const secureItemsToCreate = [];

    for (const item of items) {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      
      if (!dbProduct) {
        return NextResponse.json({ success: false, message: `Product ${item.productId} not found` }, { status: 400 });
      }
      
      // Stock Validation Edge Case
      if (!dbProduct.inStock) {
        return NextResponse.json({ success: false, message: `Product ${item.name || item.productId} is out of stock` }, { status: 400 });
      }

      secureServerTotal += dbProduct.price * item.quantity;
      secureItemsToCreate.push({
        productId: item.productId,
        name: item.name || "Product",
        quantity: item.quantity,
        price: dbProduct.price, // USE DB PRICE, NOT CLIENT PRICE
        size: item.size,
        colour: item.colour
      });
    }

    // Add fees
    secureServerTotal += (deliveryFee || 0) + (paymentMethod === 'cod' ? 100 : 0);

    // Save to production database via Prisma in an Atomic Transaction
    const order = await prisma.$transaction(async (tx: TxClient) => {
      // 1. Double check stock inside the transaction lock
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stockQuantity: true, inStock: true }
        });

        if (!product || !product.inStock || product.stockQuantity < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK: ${item.name}`);
        }

        // 2. Decrement stock atomically
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            inStock: product.stockQuantity - item.quantity > 0
          }
        });
      }

      // 3. Create the order
      return await tx.order.create({
        data: {
          orderNumber: orderId,
          total: secureServerTotal,
          deliveryZone,
          deliveryFee,
          paymentMethod,
          customerName: body.customerName || "Guest Customer",
          customerPhone: body.customerPhone || "N/A",
          customerEmail: body.customerEmail,
          items: {
            create: secureItemsToCreate
          }
        }
      });
    });

    const serverTotal = secureServerTotal; // map for the rest of the file

    logger.info({ action: 'order_created_db', orderId, metadata: { total: serverTotal, paymentMethod } });

    let checkoutUrl = null;

    if (paymentMethod === 'chapa') {
      let retries = 3;
      while (retries > 0 && !checkoutUrl) {
        try {
          const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-mock'}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: serverTotal,
              currency: 'ETB',
              email: body.customerEmail || 'customer@example.com',
              first_name: body.customerName?.split(' ')[0] || 'Guest',
              last_name: body.customerName?.split(' ')[1] || 'Customer',
              tx_ref: orderId,
              callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chapa/callback`,
              return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?order=${orderId}`,
              customization: {
                title: 'Kalsuq Order',
                description: `Payment for order ${orderId}`
              }
            }),
            signal: AbortSignal.timeout(5000) // 5 second timeout per attempt
          });

          const chapaData = await chapaRes.json();
          if (chapaData.status === 'success') {
            checkoutUrl = chapaData.data.checkout_url;
            logger.info({ action: 'chapa_init_success', orderId });
          } else {
            logger.error({ action: 'chapa_init_failed', orderId, error: new Error(chapaData.message || 'Chapa Init Failed'), metadata: chapaData });
            retries--;
          }
        } catch (err) {
          logger.error({ action: 'chapa_network_error', orderId, error: err instanceof Error ? err : new Error(String(err)), metadata: { retriesLeft: retries - 1 } });
          retries--;
          if (retries > 0) await new Promise(res => setTimeout(res, 1000)); // wait 1s before retry
        }
      }

      // CRITICAL FALLBACK: If Chapa completely fails, we MUST rollback the order so we don't hold stock hostage.
      if (!checkoutUrl) {
        logger.fatal({ action: 'chapa_completely_failed', orderId, error: new Error("Payment Gateway Offline") });
        
        await prisma.$transaction(async (tx: TxClient) => {
          for (const item of items) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity }, inStock: true }
            });
          }
          await tx.order.update({
            where: { orderNumber: orderId },
            data: { orderStatus: 'CANCELLED', paymentStatus: 'FAILED' }
          });
        });

        return NextResponse.json({
          success: false,
          message: "Payment gateway is currently unavailable. Please try again later or select Cash on Delivery.",
        }, { status: 503 });
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderNumber,
      total: serverTotal,
      status: order.orderStatus,
      paymentMethod,
      checkoutUrl,
      message: paymentMethod === 'chapa' 
        ? "Redirecting to secure payment gateway..." 
        : "Order confirmed. You will receive a WhatsApp confirmation shortly.",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message && error.message.includes("INSUFFICIENT_STOCK")) {
      logger.warn({ action: 'oversell_prevented', metadata: { details: error.message } });
      return NextResponse.json(
        { success: false, message: `Oversell prevented. ${error.message.split(":")[1].trim()} is out of stock.` },
        { status: 409 } // Conflict
      );
    }
    
    logger.error({ action: 'checkout_fatal_error', error: error instanceof Error ? error : new Error(String(error)) });
    return NextResponse.json(
      { success: false, message: "Invalid request body or server error" },
      { status: 400 }
    );
  }
}
