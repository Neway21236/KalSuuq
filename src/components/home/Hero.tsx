'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'
import en from '@/../messages/en.json'
import am from '@/../messages/am.json'

export default function Hero() {
  const { language } = useLanguageStore()
  const t = language === 'en' ? en.Hero : am.Hero

  return (
    <section className="relative h-[100vh] min-h-[600px] w-full overflow-hidden bg-ink">
      {/* Background Image */}
      <Image
        src="/hero.png"
        alt="Kalsuq Editorial Fashion"
        fill
        priority
        className="object-cover object-[center_top] opacity-90 transition-opacity duration-1000"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

      {/* Content */}
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-end pb-24 md:pb-40">
        <div className="max-w-4xl text-center sm:text-left">
          <span className={cn(
            "text-[10px] sm:text-xs tracking-[0.5em] text-accent uppercase font-bold mb-8 block animate-in fade-in slide-in-from-bottom-4 duration-1000",
            language === 'am' && "font-ethiopic tracking-normal"
          )}>
            {language === 'en' ? 'Spring Edit · Addis Ababa' : 'የፀደይ እትም · አዲስ አበባ'}
          </span>
          <h1 className={cn(
            "font-display font-semibold text-text-primary text-4xl sm:text-7xl lg:text-9xl leading-[1.1] mb-10 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 text-balance",
            language === 'am' && "font-ethiopic leading-[1.2] text-4xl sm:text-6xl md:text-8xl"
          )}>
            {t.title}
          </h1>
          <p className={cn(
            "font-body text-text-secondary text-base sm:text-xl mb-12 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 text-balance",
            language === 'am' && "font-ethiopic"
          )}>
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link 
              href="/shop" 
              className={cn(
                "w-full sm:w-auto bg-accent text-white dark:text-ink px-16 py-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:bg-accent-hover text-center shadow-2xl hover:shadow-accent/40 active:scale-95",
                language === 'am' && "font-ethiopic text-sm py-5 tracking-normal"
              )}
            >
              {t.cta}
            </Link>
            <Link 
              href="/shop?category=bundles" 
              className={cn(
                "w-full sm:w-auto border border-border-primary bg-ink/30 backdrop-blur-md text-text-primary px-12 py-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:border-accent hover:text-accent text-center active:scale-95",
                language === 'am' && "font-ethiopic text-sm py-5 tracking-normal"
              )}
            >
              {language === 'en' ? 'View Bundles' : 'ጥቅሎችን ይመልከቱ'}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-accent animate-bounce">
        <ChevronDown size={32} strokeWidth={1} />
      </div>
    </section>
  )
}
