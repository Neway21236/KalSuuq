import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, slug, size, colour, quantity } = body;

    if (!productId && !slug) {
      return NextResponse.json(
        { success: false, message: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    if (!size || typeof size !== "string") {
      return NextResponse.json(
        { success: false, message: "Size is required" },
        { status: 400 }
      );
    }

    const qty = Number(quantity) || 1;
    if (qty < 1 || qty > 10) {
      return NextResponse.json(
        { success: false, message: "Quantity must be between 1 and 10" },
        { status: 400 }
      );
    }

    // In production: validate product exists, check stock, add to server-side cart/session
    console.log(`[CART] Added: ${slug || productId}, size: ${size}, colour: ${colour}, qty: ${qty}`);

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      item: { productId, slug, size, colour, quantity: qty },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
