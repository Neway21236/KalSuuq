import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check Database Health
    const dbStart = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = performance.now() - dbStart;

    // 2. Check Memory Usage (if needed for diagnostics)
    const memoryUsage = process.memoryUsage();
    
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'up',
            latencyMs: Math.round(dbLatency),
          },
          application: {
            status: 'up',
            memoryRssMB: Math.round(memoryUsage.rss / 1024 / 1024),
          }
        }
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'down',
          },
          application: {
            status: 'up',
          }
        }
      },
      { status: 503 }
    );
  }
}
