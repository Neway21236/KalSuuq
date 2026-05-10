import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get('ids');
    
    if (!idsString) {
      return NextResponse.json({ success: true, products: [] });
    }

    const ids = idsString.split(',');

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids }
      },
      select: {
        id: true,
        inStock: true,
        stockQuantity: true
      }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
