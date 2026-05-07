import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      product,
    });
  } catch (error) {
    console.error(`[PRODUCT_GET_${params.slug}]`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
