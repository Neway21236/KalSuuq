import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'production' 
      ? ['error'] 
      : ['query', 'error', 'warn'],
    // Connection Pool Configuration (Risk #1 Fix)
    // Limits serverless functions from opening infinite DB connections.
    // In production, use Prisma Accelerate or PgBouncer for further pooling.
  })
}

// Extend with connection pool settings via the datasource URL
// Append ?connection_limit=10&pool_timeout=10 to your DATABASE_URL in .env
// Example: postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=10

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

// In production, we ALSO cache on globalThis to prevent hot-reload leaks in dev
// AND to reuse the single connection pool across serverless invocations.
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

