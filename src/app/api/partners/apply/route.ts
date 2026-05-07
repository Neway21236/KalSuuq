import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, platform, audienceSize, promotionPlan } = body;

    if (!fullName || !phone || !platform) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to production database via Prisma
    const application = await prisma.partnerApplication.create({
      data: {
        fullName,
        phone,
        email: email || "N/A",
        platform,
        audienceSize: audienceSize || "N/A",
        promotionPlan: promotionPlan || "N/A",
        status: 'PENDING'
      }
    });

    console.log(`[PARTNER_APP] ${application.id} submitted by ${fullName}`);

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully. We'll contact you within 24 hours.",
    });
  } catch (error) {
    console.error("[PARTNER_APPLY_POST]", error);
    return NextResponse.json(
      { success: false, message: "Server error during application" },
      { status: 500 }
    );
  }
}
