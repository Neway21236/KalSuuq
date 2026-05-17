import * as Sentry from '@sentry/nextjs';

export function register() {
  const isProd = process.env.NODE_ENV === 'production';

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      // 10% of traces in prod — 100% in dev for full visibility
      tracesSampleRate: isProd ? 0.1 : 1.0,
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: isProd ? 0.1 : 1.0,
      debug: false,
    });
  }
}

