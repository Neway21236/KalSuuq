import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { referralCode, deviceType } = await req.json();

    if (!referralCode) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const partner = await prisma.partner.findUnique({
      where: { referralCode }
    });

    if (partner) {
      await prisma.referralClick.create({
        data: {
          partnerId: partner.id,
          deviceType: deviceType || 'Unknown',
          ipAddress: req.headers.get('x-forwarded-for') || req.ip || 'Unknown'
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral click tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
