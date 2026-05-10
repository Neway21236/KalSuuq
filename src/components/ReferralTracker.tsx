'use client'

import { useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function TrackerInner() {
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')
  const hasTracked = useRef(false)

  useEffect(() => {
    if (refCode && !hasTracked.current) {
      hasTracked.current = true;
      const d = new Date()
      d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000))
      document.cookie = `kalsuq-ref=${refCode}; expires=${d.toUTCString()}; path=/`
      
      fetch('/api/partners/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: refCode,
          deviceType: /Mobile|Android|iP(ad|hone)/.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        })
      }).catch(console.error)
    }
  }, [refCode])

  return null
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  )
}
