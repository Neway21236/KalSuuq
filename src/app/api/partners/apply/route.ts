import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 3 applications per IP per hour
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateCheck = checkRateLimit(`partner-apply:${ip}`, { maxRequests: 3, windowMs: 60 * 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many applications. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fullName, phone, email, platform, audienceSize, promotionPlan } = body;

    // Input validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ success: false, message: "A valid full name is required." }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ success: false, message: "A valid phone number is required." }, { status: 400 });
    }
    if (!platform || typeof platform !== 'string') {
      return NextResponse.json({ success: false, message: "Platform is required." }, { status: 400 });
    }

    const application = await prisma.partnerApplication.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email?.trim() || "N/A",
        platform: platform.trim(),
        audienceSize: audienceSize || "N/A",
        promotionPlan: promotionPlan || "N/A",
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully. We'll contact you within 24 hours.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error during application" },
      { status: 500 }
    );
  }
}
