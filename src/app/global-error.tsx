'use client'

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-ink text-white p-8 text-center">
          <h1 className="font-display text-4xl mb-6 tracking-tighter uppercase font-bold">Something went wrong</h1>
          <p className="text-text-secondary mb-12 max-w-md mx-auto text-sm tracking-widest uppercase opacity-80">
            We have been notified and are working to resolve the issue.
          </p>
          <button
            onClick={() => reset()}
            className="bg-accent text-white dark:text-ink px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-hover shadow-2xl active:scale-95"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
