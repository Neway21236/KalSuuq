import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "orderId query parameter is required" },
      { status: 400 }
    );
  }

  if (!orderId.startsWith("KS-")) {
    return NextResponse.json(
      { success: false, message: "Invalid order ID format" },
      { status: 400 }
    );
  }

  // Sanitize input
  const sanitizedOrderId = orderId.replace(/[^a-zA-Z0-9-]/g, '');

  try {
    // Secure Prisma DB lookup
    const order = await prisma.order.findUnique({
      where: { orderNumber: sanitizedOrderId },
      select: {
        orderNumber: true,
        orderStatus: true,
        paymentStatus: true,
        deliveryZone: true,
        total: true,
        createdAt: true,
        items: {
          select: { name: true, quantity: true, size: true }
        }
        // IMPORTANT: Intentionally excluding customer phone/email to prevent data leaks
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderNumber,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        deliveryZone: order.deliveryZone,
        items: order.items,
        total: order.total,
        createdAt: order.createdAt,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error retrieving order" },
      { status: 500 }
    );
  }
}
