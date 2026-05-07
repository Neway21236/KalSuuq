import * as Sentry from "@sentry/nextjs";

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

interface LogPayload {
  action: string;
  userId?: string;
  orderId?: string;
  metadata?: Record<string, any>;
  error?: Error | unknown;
}

/**
 * Risk #5 Fix: PII Scrubber
 * Automatically redacts emails, phone numbers, and names from log metadata
 * to prevent GDPR/CCPA violations when logs ship to Sentry/Datadog.
 */
function scrubPII(obj: Record<string, any>): Record<string, any> {
  const scrubbed: Record<string, any> = {};
  const sensitiveKeys = ['email', 'phone', 'name', 'customerName', 'customerPhone', 'customerEmail', 'address', 'password'];
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      scrubbed[key] = '[REDACTED]';
    } else if (typeof value === 'string') {
      // Scrub inline email patterns
      scrubbed[key] = value
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
        .replace(/\+?\d{10,13}/g, '[PHONE_REDACTED]');
    } else if (typeof value === 'object' && value !== null && !(value instanceof Error)) {
      scrubbed[key] = scrubPII(value);
    } else {
      scrubbed[key] = value;
    }
  }
  return scrubbed;
}

/**
 * Structured Logger utility for Production environments.
 * Outputs JSON format optimized for Datadog / ELK Stack.
 * Automatically routes high-severity errors to Sentry.
 * All metadata is PII-scrubbed before output.
 */
export const logger = {
  log: (level: LogLevel, payload: LogPayload) => {
    const safeMetadata = payload.metadata ? scrubPII(payload.metadata) : {};

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      action: payload.action,
      userId: payload.userId || 'anonymous',
      orderId: payload.orderId || null,
      ...safeMetadata,
    };

    // 1. Standard Output (JSON Structured)
    if (level === 'error' || level === 'fatal') {
      console.error(JSON.stringify({ ...logEntry, error: String(payload.error) }));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.info(JSON.stringify(logEntry));
    }

    // 2. Sentry Integration
    if (level === 'error' || level === 'fatal') {
      Sentry.withScope((scope) => {
        if (payload.userId) scope.setUser({ id: payload.userId });
        if (payload.orderId) scope.setTag("order_id", payload.orderId);
        if (safeMetadata) scope.setExtras(safeMetadata);
        
        Sentry.captureException(payload.error || new Error(payload.action));
      });
    }
  },

  info: (payload: LogPayload) => logger.log('info', payload),
  warn: (payload: LogPayload) => logger.log('warn', payload),
  error: (payload: LogPayload) => logger.log('error', payload),
  fatal: (payload: LogPayload) => logger.log('fatal', payload),
};

