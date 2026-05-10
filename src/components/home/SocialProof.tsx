'use client'

import { useEffect, useState, useRef } from 'react'
import { Star, ShoppingBag, Package2 } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

interface SocialProofProps {
  weeklyOrderCount: number
}

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

export default function SocialProof({ weeklyOrderCount }: SocialProofProps) {
  const { language } = useLanguageStore()
  const { count, ref } = useCountUp(weeklyOrderCount > 0 ? weeklyOrderCount : 47)

  const stats = [
    {
      icon: ShoppingBag,
      value: count,
      suffix: '+',
      label: language === 'en' ? 'orders this week' : 'ትዕዛዞች ይህ ሳምንት',
      live: true,
    },
    {
      icon: Star,
      value: 4.9,
      suffix: '/5',
      label: language === 'en' ? 'average rating' : 'አማካይ ደረጃ',
      live: false,
    },
    {
      icon: Package2,
      value: 98,
      suffix: '%',
      label: language === 'en' ? 'on-time delivery rate' : 'የወቅቱ አቅርቦት ምጣኔ',
      live: false,
    },
  ]

  return (
    <section ref={ref} className="bg-surface-card border-y border-border-primary py-20 md:py-28 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border-primary">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center py-4 sm:py-0 space-y-3 group">
              <div className="flex items-center space-x-2 mb-2">
                <stat.icon size={18} className="text-accent" />
                {stat.live && (
                  <span className="flex items-center space-x-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent">
                      {language === 'en' ? 'Live' : 'ቀጥታ'}
                    </span>
                  </span>
                )}
              </div>
              <div className={cn(
                "font-mono text-5xl md:text-6xl font-bold text-text-primary",
              )}>
                {i === 0 ? count : stat.value}{stat.suffix}
              </div>
              <p className={cn(
                "text-xs uppercase tracking-[0.3em] font-bold text-text-muted",
                language === 'am' && "font-ethiopic tracking-normal text-sm"
              )}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
