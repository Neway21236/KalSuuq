'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const { language } = useLanguageStore()

  if (!isVisible) return null

  return (
    <div className="bg-accent text-white dark:text-ink h-11 flex items-center justify-center px-4 relative z-[60] shadow-sm">
      <p className={cn(
        "text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold truncate max-w-[85%] text-center",
        language === 'am' && "font-ethiopic tracking-normal text-[10px]"
      )}>
        {language === 'en' 
          ? 'Free premium delivery in Addis on orders over 3,500 ETB' 
          : 'ከ3,500 ብር በላይ ትዕዛዝ ላይ በአዲስ አበባ ነጻ አቅርቦት'}
      </p>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 p-1.5 hover:scale-110 transition-transform active:scale-90"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}
