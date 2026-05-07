'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function BundleOfferBanner() {
  const { language } = useLanguageStore()

  const benefits = language === 'en' 
    ? [
        'Three essential items included',
        'Coordinated styling by our experts',
        'Free premium delivery in Addis'
      ]
    : [
        'ሶስት አስፈላጊ ዕቃዎችን ያካተተ',
        'በባለሙያዎቻችን የተቀናጀ ስታይል',
        'አዲስ አበባ ውስጥ በነጻ እናደርሳለን'
      ]

  return (
    <section className="bg-surface border-y border-border-primary py-24 md:py-48 transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 items-center">
          {/* Left: Editorial Image */}
          <div className="relative aspect-[4/5] overflow-hidden order-1 md:order-1 bg-surface-card border border-border-primary shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group">
            <Image 
              src="/hero.png"
              alt="Bundle Offer"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/10 group-hover:bg-transparent transition-colors duration-700" />
            <div className="absolute top-10 right-10 bg-accent text-white dark:text-ink text-[10px] font-bold px-6 py-2 shadow-2xl tracking-[0.2em] uppercase">
              {language === 'en' ? 'Editorial Pack' : 'ልዩ ጥቅል'}
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="order-2 md:order-2 space-y-12">
            <div className="space-y-8">
              <span className={cn(
                "text-[10px] tracking-[0.6em] text-accent uppercase font-bold",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                {language === 'en' ? 'Limited Edition Offer' : 'የተገደበ እትም አቅርቦት'}
              </span>
              <h2 className={cn(
                "font-display text-5xl md:text-8xl text-text-primary leading-[1.1] tracking-tight font-bold",
                language === 'am' && "font-ethiopic text-4xl md:text-7xl"
              )}>
                {language === 'en' ? <>The Full Look. <br /> <span className="text-accent">14% Off.</span></> : <>ሙሉው ስብስብ. <br /> <span className="text-accent">14% ቅናሽ.</span></>}
              </h2>
              <p className={cn(
                "text-text-secondary font-body text-lg sm:text-2xl leading-relaxed max-w-2xl opacity-80",
                language === 'am' && "font-ethiopic"
              )}>
                {language === 'en' 
                  ? 'Elevate your style with our signature bundle. Perfectly paired pieces for a complete editorial aesthetic.'
                  : 'በተለየ ስብስባችን ስታይልዎን ያሳድጉ። ለተሟላ ውበት በጥንቃቄ የተቀናጁ ዕቃዎች።'}
              </p>
            </div>

            <div className="py-10 border-y border-border-primary/40">
              <span className={cn(
                "font-mono text-3xl text-text-primary font-bold tracking-tight",
                language === 'am' && "font-ethiopic text-2xl"
              )}>
                {language === 'en' ? 'Save 700 ETB when you bundle' : 'በጥቅል ሲገዙ 700 ብር ይቆጥቡ'}
              </span>
            </div>

            <ul className="space-y-6">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center space-x-6 text-text-secondary group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-none bg-accent/5 flex items-center justify-center border border-accent/10 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                    <Check size={16} className="transition-transform group-hover:scale-110" />
                  </div>
                  <span className={cn(
                    "text-lg tracking-wide font-medium",
                    language === 'am' && "font-ethiopic"
                  )}>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/shop" 
              className={cn(
                "inline-block bg-accent text-white dark:text-ink px-20 py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-95",
                language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
              )}
            >
              {language === 'en' ? 'Shop the Bundle →' : 'ጥቅሉን አሁኑኑ ይግዙ →'}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[150px] pointer-events-none -mt-[30vw] -ml-[20vw]" />
    </section>
  )
}
