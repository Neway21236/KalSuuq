import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Referral code is required" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // In production: look up code in database
    // Mock: accept any code that starts with "KQ" 
    const isValid = cleanCode.startsWith("KQ") && cleanCode.length >= 4;
    
    if (!isValid) {
      return NextResponse.json({
        success: true,
        valid: false,
        discount: 0,
        message: "Invalid referral code",
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      discount: 10,
      partnerName: "Partner",
      message: `Code ${cleanCode} applied — 10% discount`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
