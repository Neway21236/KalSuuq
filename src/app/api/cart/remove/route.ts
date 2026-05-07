import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, slug, size, colour } = body;

    if (!productId && !slug) {
      return NextResponse.json(
        { success: false, message: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    // In production: remove from server-side cart/session
    console.log(`[CART] Removed: ${slug || productId}, size: ${size}, colour: ${colour}`);

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
