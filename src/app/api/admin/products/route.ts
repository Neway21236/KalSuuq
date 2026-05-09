import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      include: {
        variants: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    
    // Auto-generate slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const product = await prisma.product.create({
      data: {
        name: body.name,
        nameAm: body.nameAm || null,
        slug,
        sku: body.sku || null,
        shortDescription: body.shortDescription || null,
        description: body.description,
        descriptionAm: body.descriptionAm || null,
        collection: body.collection || 'General',
        collectionAm: body.collectionAm || null,
        category: body.category,
        categoryAm: body.categoryAm || null,
        tags: body.tags || [],
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        status: body.status || 'DRAFT',
        isFeatured: body.isFeatured || false,
        isBestSeller: body.isBestSeller || false,
        image: body.image,
        images: body.images || [body.image],
        inStock: body.inStock !== undefined ? body.inStock : true,
        stockQuantity: parseInt(body.stockQuantity || '10'),
        lowStockThreshold: parseInt(body.lowStockThreshold || '3'),
        variants: body.variants ? {
          create: body.variants.map((v: { sku?: string; size?: string; colour?: string; colourHex?: string; price?: string | number; stock?: string | number; image?: string }) => ({
            sku: v.sku || null,
            size: v.size || null,
            colour: v.colour || null,
            colourHex: v.colourHex || null,
            price: v.price ? parseFloat(v.price.toString()) : null,
            stock: parseInt(v.stock?.toString() || '0'),
            image: v.image || null,
          }))
        } : undefined,
      },
      include: {
        variants: true
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
