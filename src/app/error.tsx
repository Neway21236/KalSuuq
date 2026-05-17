'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguageStore();

  useEffect(() => {
    // Report to Sentry so storefront errors are visible in production
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-card border border-border-primary p-8 md:p-12 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-error/10 text-error flex items-center justify-center rounded-full mb-4">
          <AlertCircle size={32} />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-text-primary tracking-tight">
          {language === 'en' ? 'Something went wrong' : 'ስህተት ተፈጥሯል'}
        </h2>
        
        <p className="text-text-secondary text-sm leading-relaxed pb-4">
          {language === 'en' 
            ? "We've encountered an unexpected error. Our engineering team has been notified. Please try refreshing the page or contact support if the issue persists." 
            : "ያልተጠበቀ ስህተት አጋጥሞናል። ለቴክኒክ ቡድናችን አሳውቀናል። እባክዎ ገጹን እንደገና ለማደስ ይሞክሩ ወይም ችግሩ ከቀጠለ የድጋፍ ቡድናችንን ያግኙ።"}
        </p>

        <div className="flex flex-col w-full space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-accent text-white dark:text-ink px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-all"
          >
            {language === 'en' ? 'Try Again' : 'እንደገና ይሞክሩ'}
          </button>
          <Link
            href="/"
            className="w-full border border-border-primary text-text-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-all"
          >
            {language === 'en' ? 'Return Home' : 'ወደ ዋናው ገጽ ይመለሱ'}
          </Link>
        </div>
      </div>
    </div>
  );
}
