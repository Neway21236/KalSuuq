import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Check if any admin already exists
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, message: "Admin account already exists. Setup route disabled." },
        { status: 403 }
      );
    }

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create the first admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password, // In a real app, hash this with bcrypt before saving
        name: name || "Master Admin",
        role: "ADMIN"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully.",
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("[SETUP_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Server error during setup" },
      { status: 500 }
    );
  }
}
