import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

const MAX_IDS = 50;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get('ids');
    
    if (!idsString) {
      return NextResponse.json({ success: true, products: [] });
    }

    // Sanitize and cap the ID list to prevent DB enumeration
    const ids = idsString
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0 && id.length <= 64)
      .slice(0, MAX_IDS);

    if (ids.length === 0) {
      return NextResponse.json({ success: true, products: [] });
    }

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
