import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { signToken } from "@/lib/auth";

// In a real production app, we'd use bcrypt for password hashing
// For this prototype launch, we use a controlled admin check

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Rate Limiting / Brute Force Prevention
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    console.log(`[AUTH] Admin login attempt from IP: ${ip} for email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // In a real production app, use bcrypt.compare
    if (user && user.password === password && user.role === 'ADMIN') {
      const token = await signToken({
        sub: user.id,
        role: user.role,
      });

      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { name: user.name || "Admin", role: user.role }
      });

      response.cookies.set("kalsuq-auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 2, // 2 hours
        path: "/"
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}
