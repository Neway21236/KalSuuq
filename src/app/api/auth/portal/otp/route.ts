import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 9) {
      return NextResponse.json(
        { success: false, message: "Valid phone number is required" },
        { status: 400 }
      );
    }

    // Master Testing Bypass
    const isTestNumber = phone === "0900000000";
    
    if (isTestNumber) {
      return NextResponse.json({
        success: true,
        message: "Test number recognized. Use code 123456",
        // DO NOT EXPOSE SECRETS IN RESPONSE
      });
    }

    // In production: Integrate with SMS gateway (e.g., Africa's Talking or Twilio)
    // For now, simulate sending OTP
    console.log(`[AUTH] Sending OTP to ${phone}: 4592`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully"
      // NEVER EXPOSE SECRETS IN RESPONSE, EVEN IN DEV
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
