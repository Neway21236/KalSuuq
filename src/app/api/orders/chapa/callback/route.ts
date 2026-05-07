import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trx_ref, status, tx_ref } = body;

    // Verify the callback is from Chapa (in production, verify CHAPA_WEBHOOK_SECRET)
    const webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
    const signature = req.headers.get("x-chapa-signature");

    if (webhookSecret && signature !== webhookSecret) {
      console.error("[CHAPA] Invalid webhook signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    if (!trx_ref && !tx_ref) {
      return NextResponse.json(
        { success: false, message: "Transaction reference is required" },
        { status: 400 }
      );
    }

    const ref = trx_ref || tx_ref;

    // In production: verify payment with Chapa API, update order status in DB
    console.log(`[CHAPA] Payment callback — ref: ${ref}, status: ${status}`);

    if (status === "success") {
      // Update order status to "paid" in database
      // Send WhatsApp confirmation to customer
      console.log(`[CHAPA] Payment confirmed for ${ref}`);
    } else {
      console.log(`[CHAPA] Payment failed for ${ref}: ${status}`);
    }

    return NextResponse.json({ success: true, message: "Callback processed" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid callback payload" },
      { status: 400 }
    );
  }
}
