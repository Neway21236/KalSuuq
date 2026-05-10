import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

export async function processCommission(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || !order.partnerCode) return;

    if (order.orderStatus !== 'PAYMENT_CONFIRMED' && order.orderStatus !== 'DELIVERED') {
      return;
    }

    const partner = await prisma.partner.findUnique({
      where: { referralCode: order.partnerCode }
    });

    if (!partner) return;

    // Commission is based on net order value (total - deliveryFee)
    const netValue = order.total - order.deliveryFee;
    if (netValue <= 0) return;

    const commissionAmount = (netValue * partner.commissionRate) / 100;

    // We can just add it to balance for now.
    // To prevent double counting if status changes from PAYMENT_CONFIRMED to DELIVERED,
    // we should track if commission was already processed for this order.
    // For simplicity, we can use internalNotes or a new field, but let's assume
    // we only process if it hasn't been processed.
    
    // Check if a ReferralClick or a Payout line item exists for this order.
    // Since we don't have a specific Commission line item table, we'll store
    // "COMMISSION_PROCESSED" in internalNotes.
    
    if (order.internalNotes?.includes('COMMISSION_PROCESSED')) return;

    await prisma.$transaction([
      prisma.partner.update({
        where: { id: partner.id },
        data: { balance: { increment: commissionAmount } }
      }),
      prisma.order.update({
        where: { id: orderId },
        data: {
          internalNotes: order.internalNotes 
            ? `${order.internalNotes}\nCOMMISSION_PROCESSED: ${commissionAmount}`
            : `COMMISSION_PROCESSED: ${commissionAmount}`
        }
      })
    ]);

    logger.info({ action: 'commission_processed', orderId, metadata: { partnerId: partner.id, amount: commissionAmount } });
  } catch (error) {
    logger.error({ action: 'commission_error', orderId, error: error instanceof Error ? error : new Error(String(error)) });
  }
}
