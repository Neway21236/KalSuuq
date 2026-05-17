import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { signToken } from "@/lib/auth";
import { compare } from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Brute-force protection: max 10 attempts per IP per 15 minutes
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateCheck = checkRateLimit(`admin-login:${ip}`, { maxRequests: 10, windowMs: 15 * 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Constant-time comparison via bcrypt to prevent timing attacks
    const isValidPassword = user ? await compare(password, user.password) : false;

    if (user && isValidPassword && user.role === 'ADMIN') {
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

    // Generic error — don't reveal whether email exists
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error during login" },
      { status: 500 }
    );
  }
}
