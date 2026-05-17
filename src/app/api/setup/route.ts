import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // Guard 1: Require a pre-shared setup secret to prevent unauthorized admin creation
    const setupSecret = process.env.SETUP_SECRET;
    if (!setupSecret) {
      return NextResponse.json(
        { success: false, message: "Setup is not enabled on this server." },
        { status: 403 }
      );
    }

    const authHeader = req.headers.get("x-setup-secret");
    if (authHeader !== setupSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid setup secret." },
        { status: 401 }
      );
    }

    // Guard 2: Block if any admin already exists (idempotency)
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

    if (!email || !password || password.length < 12) {
      return NextResponse.json(
        { success: false, message: "Email and a password of at least 12 characters are required." },
        { status: 400 }
      );
    }

    // Hash the password with bcrypt (cost factor 12)
    const hashedPassword = await hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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

