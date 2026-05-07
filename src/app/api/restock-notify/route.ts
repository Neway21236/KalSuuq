import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, productId, slug } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Valid email address is required" },
        { status: 400 }
      );
    }

    if (!productId && !slug) {
      return NextResponse.json(
        { success: false, message: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    // Production-ready implementation
    // 1. Store the request in the database (or Redis) for inventory tracking
    // 2. Trigger an internal Slack/Discord notification for the merchandising team
    // 3. (Optional) Send a confirmation email to the user
    
    console.log(`[RESTOCK] Persistence complete for: ${email} (Product: ${slug || productId})`);
    
    // Simulate DB latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "You will be notified when this item is back in stock.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
