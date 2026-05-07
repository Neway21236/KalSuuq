import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Security Check: Basic authorization guard
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (token !== "prod-partner-token-abc") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    // For now, return mock data calculated from DB if possible, or robust stubs
    // In a full implementation, we'd query orders where referralCode === partnerCode
    
    return NextResponse.json({
      success: true,
      stats: {
        clicks: 1240,
        orders: 48,
        pendingCommission: 3450,
        confirmedCommission: 12800,
        nextPayout: "15 June 2026",
        referralCode: "MARTHA26"
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
