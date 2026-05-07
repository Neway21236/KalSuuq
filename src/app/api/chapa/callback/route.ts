import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("chapa-signature");
  const secret = process.env.CHAPA_WEBHOOK_SECRET || "your-webhook-secret";

  // 1. Verify Webhook Signature (Security)
  const hash = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (hash !== signature) {
    logger.warn({ action: 'webhook_invalid_signature' });
    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // Risk #3 Fix: Respond 200 OK IMMEDIATELY to prevent Chapa timeout retries.
  // The DB update is fired asynchronously — if it fails, the structured logger
  // captures it for manual reconciliation, but Chapa won't hammer us with retries.
  if (payload.event === "charge.success") {
    const orderId = payload.tx_ref;

    // Fire-and-forget: process asynchronously without blocking the HTTP response
    processPaymentConfirmation(orderId).catch((err) => {
      logger.fatal({ 
        action: 'webhook_async_processing_failed', 
        orderId, 
        error: err,
        metadata: { event: payload.event }
      });
    });
  }

  // Respond immediately — Chapa receives 200 OK within milliseconds
  return NextResponse.json({ success: true });
}

/**
 * Async processor for payment confirmation.
 * Handles idempotency, status updates, and logging.
 */
async function processPaymentConfirmation(orderId: string) {
  // 1. Idempotency Check
  const order = await prisma.order.findUnique({
    where: { orderNumber: orderId },
    select: { paymentStatus: true }
  });

  if (!order) {
    logger.error({ action: 'webhook_order_not_found', orderId, error: new Error(`Order ${orderId} not found`) });
    return;
  }

  if (order.paymentStatus === "PAID") {
    logger.info({ action: 'webhook_duplicate_skipped', orderId });
    return;
  }

  // 2. Update Order Status
  await prisma.order.update({
    where: { orderNumber: orderId },
    data: {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED"
    }
  });

  logger.info({ action: 'payment_confirmed', orderId });
}
