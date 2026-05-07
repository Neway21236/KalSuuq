'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguageStore()

  useEffect(() => {
    const consent = localStorage.getItem('kalsuq_cookie_consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('kalsuq_cookie_consent', 'accepted')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto bg-surface-card border border-border-primary shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-2 text-text-secondary hover:text-accent transition-colors"
          aria-label="Close cookie banner"
        >
          <X size={16} />
        </button>
        
        <div className="flex-1 pr-6">
          <p className={cn(
            "text-sm text-text-primary leading-relaxed",
            language === 'am' && "font-ethiopic"
          )}>
            {language === 'en' 
              ? "We use strictly necessary cookies to process your checkout, and analytics cookies to improve our platform. By continuing to use Kalsuq, you consent to our data practices as outlined in our "
              : "የክፍያ ሂደትን ለማሳለጥ እና የገጽታችንን አጠቃቀም ለማሻሻል ኩኪዎችን (Cookies) እንጠቀማለን። ካልሱቅን መጠቀሞን ሲቀጥሉ በግላዊነት ፖሊሲያችን መስማማትዎን ያረጋግጣሉ። "
            }
            {language === 'en' && (
              <Link href="/privacy" className="text-accent hover:underline font-bold">Privacy Policy</Link>
            )}
            {language === 'en' && "."}
          </p>
        </div>

        <div className="flex shrink-0 gap-3 w-full md:w-auto">
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none bg-accent text-white dark:text-ink px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent-hover transition-all shadow-lg active:scale-95"
          >
            {language === 'en' ? 'Accept All' : 'ተስማምቻለሁ'}
          </button>
        </div>
      </div>
    </div>
  )
}
