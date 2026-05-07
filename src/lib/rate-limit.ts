/**
 * In-Memory Rate Limiter (Risk #2 Fix)
 * 
 * Prevents inventory denial-of-service by limiting order submissions per IP.
 * This is an in-memory implementation suitable for single-server deployments.
 * 
 * For production at scale (multi-region, serverless), replace with Upstash Redis:
 *   import { Ratelimit } from "@upstash/ratelimit"
 *   import { Redis } from "@upstash/redis"
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;   // Max requests allowed
  windowMs: number;      // Time window in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);

  if (!existing || now > existing.resetTime) {
    // First request or window expired — reset
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1, resetInMs: config.windowMs };
  }

  if (existing.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetInMs: existing.resetTime - now };
  }

  existing.count++;
  return { allowed: true, remaining: config.maxRequests - existing.count, resetInMs: existing.resetTime - now };
}
