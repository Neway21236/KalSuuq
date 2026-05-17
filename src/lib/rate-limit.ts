/**
 * In-Memory Rate Limiter
 * 
 * Prevents brute-force and spam attacks on critical endpoints.
 * 
 * ⚠️  SERVERLESS NOTE: This is safe for serverless (Vercel) because cleanup
 * is lazy (checked on each access) rather than using setInterval which leaks
 * across cold-start boundaries.
 * 
 * For multi-region scale, replace with Upstash Redis:
 *   import { Ratelimit } from "@upstash/ratelimit"
 *   import { Redis } from "@upstash/redis"
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

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

  // Lazy cleanup: evict this key if its window has expired
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
