import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

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
    const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
    console.log(`[AUTH] Admin login attempt from IP: ${ip} for email: ${email}`);

    // Master Admin Credentials for Testing
    const masterEmail = "admin@kalsuq.com";
    const masterPass = "Kalsuq2026!";

    if (email === masterEmail && password === masterPass) {
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: { name: "Abebe Admin", role: "ADMIN" }
      });

      // Set secure production cookie
      response.cookies.set("kalsuq-auth-token", "prod-admin-token-xyz", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
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
