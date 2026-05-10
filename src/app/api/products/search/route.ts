import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ProductStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ success: true, products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
        status: ProductStatus.PUBLISHED
      },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
      }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
