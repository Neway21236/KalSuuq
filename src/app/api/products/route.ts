import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const revalidate = 60; // Cache for 60 seconds at the edge

export async function GET() {
  try {
    const products = await getProducts();
    
    // In a real DB scenario, we would selectively query fields to prevent over-fetching
    // const minimalProducts = await prisma.product.findMany({ select: { id: true, name: true, price: true, image: true, slug: true } })

    const response = NextResponse.json({ 
      success: true, 
      count: products.length,
      products,
    });

    // Add HTTP Caching Headers for CDN / Browser
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
    
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
