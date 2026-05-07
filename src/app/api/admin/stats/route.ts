import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Security Check: Basic authorization guard
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (token !== "prod-admin-token-xyz") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const [totalOrders, totalRevenue, pendingPartners, lowStockCount] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
      }),
      prisma.partnerApplication.count({
        where: { status: 'PENDING' }
      }),
      prisma.product.count({
        where: { inStock: true } // Simplified: in real app we check stock < threshold
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        revenueToday: totalRevenue._sum.total || 0,
        pendingPartners,
        lowStockCount
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
