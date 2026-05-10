import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("kalsuq-auth-token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { status, commissionRate } = await req.json();

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    // Wrap in transaction if approving
    if (status === 'APPROVED') {
      const result = await prisma.$transaction(async (tx) => {
        const app = await tx.partnerApplication.update({
          where: { id: params.id },
          data: { status }
        });

        const firstName = app.fullName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
        const randomNum = Math.floor(Math.random() * 90) + 10;
        const referralCode = `${firstName}${randomNum}`;
        const tempPassword = `Partner@${randomNum}`;
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        let user = await tx.user.findUnique({ where: { email: app.email } });
        
        if (!user) {
          user = await tx.user.create({
            data: {
              email: app.email,
              password: hashedPassword,
              name: app.fullName,
              role: 'PARTNER'
            }
          });
        } else {
          user = await tx.user.update({
            where: { id: user.id },
            data: { role: 'PARTNER' }
          });
        }

        const partner = await tx.partner.upsert({
          where: { userId: user.id },
          update: { commissionRate: commissionRate || 10.0, status: 'APPROVED' },
          create: {
            userId: user.id,
            referralCode,
            commissionRate: commissionRate || 10.0,
            status: 'APPROVED'
          }
        });

        return { app, partner, tempPassword };
      });

      // TODO: Implement actual WhatsApp/Email notification sending here (FR-PAR-04)
      console.log(`[PARTNER APPROVED] Send email to ${result.app.email} with password: ${result.tempPassword} and code: ${result.partner.referralCode}`);

      return NextResponse.json({ success: true, application: result.app, partner: result.partner });
    } else {
      // Just reject or reset to pending
      const application = await prisma.partnerApplication.update({
        where: { id: params.id },
        data: { status }
      });
      return NextResponse.json({ success: true, application });
    }
  } catch (error) {
    console.error("Update partner error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
