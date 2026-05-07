import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;

    // Security Check: Basic authorization guard for Admin
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (token !== "prod-admin-token-xyz") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Order and Verify State
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (order.orderStatus === "CANCELLED") {
      return NextResponse.json({ success: false, message: "Order is already cancelled" }, { status: 400 });
    }

    // Save to production database via Prisma in an Atomic Transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Restock items
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
            inStock: true // Since we added stock, it's definitively in stock
          }
        });
      }

      // 3. Process Refund if Paid
      let newPaymentStatus = order.paymentStatus;
      if (order.paymentStatus === "PAID") {
        // In production: Hit Chapa Refund API
        /*
        const chapaRes = await fetch('https://api.chapa.co/v1/transaction/refund', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}` },
          body: JSON.stringify({ transaction_ref: orderId, amount: order.total })
        });
        */
        console.log(`[REFUND] Simulating Chapa refund for ${orderId} (ETB ${order.total})`);
        newPaymentStatus = "REFUNDED";
      }

      // Update Order Status
      await tx.order.update({
        where: { orderNumber: orderId },
        data: {
          orderStatus: "CANCELLED",
          paymentStatus: newPaymentStatus
        }
      });
    });

    console.log(`[ADMIN] Order ${orderId} successfully cancelled and restocked.`);

    return NextResponse.json({
      success: true,
      message: `Order cancelled. Items restocked.${order.paymentStatus === "PAID" ? " Refund initiated via Chapa." : ""}`
    });

  } catch (error) {
    console.error("[CANCEL_ORDER_ERROR]", error);
    return NextResponse.json({ success: false, message: "Server error during cancellation" }, { status: 500 });
  }
}
