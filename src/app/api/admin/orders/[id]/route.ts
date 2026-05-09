import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { OrderStatus, Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { orderStatus, internalNotes, trackingLink } = await req.json();
    const id = params.id;

    // Fetch existing order to check previous status and get items
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Logic for FR-ORD-07: Restore stock if cancelled
    if (orderStatus === 'CANCELLED' && existingOrder.orderStatus !== 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } }
            });
          } else {
            await tx.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { increment: item.quantity } }
            });
          }
        }
      });
    }

    interface StatusLog {
      status: string;
      timestamp: string;
      note: string;
    }

    // Prepare status history
    const history = (existingOrder.statusHistory as unknown as StatusLog[]) || [];
    if (orderStatus !== existingOrder.orderStatus) {
      history.push({
        status: orderStatus,
        timestamp: new Date().toISOString(),
        note: `Status changed to ${orderStatus} by Admin`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: orderStatus as OrderStatus,
        internalNotes,
        trackingLink,
        statusHistory: history as unknown as Prisma.InputJsonValue
      },
      include: { items: true }
    });

    // TODO: FR-ORD-03 Trigger WhatsApp/SMS Notification

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
