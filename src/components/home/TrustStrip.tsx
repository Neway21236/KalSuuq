'use client'
 
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'
 
export default function TrustStrip() {
  const { language } = useLanguageStore()
 
  const stats = [
    { 
      number: '24h', 
      label: language === 'en' ? 'Delivery' : 'አቅርቦት', 
      desc: language === 'en' ? 'Addis Ababa' : 'አዲስ አበባ' 
    },
    { 
      number: 'ETB', 
      label: language === 'en' ? 'Currency' : 'የገንዘብ ዓይነት', 
      desc: language === 'en' ? 'Local Pricing' : 'የሀገር ውስጥ ዋጋ' 
    },
    { 
      number: '3×', 
      label: language === 'en' ? 'Quality' : 'ጥራት', 
      desc: language === 'en' ? 'Vetted Partners' : 'የተረጋገጡ አጋሮች' 
    },
    { 
      number: '10k+', 
      label: language === 'en' ? 'Community' : 'ማኅበረሰብ', 
      desc: language === 'en' ? 'Members' : 'ተከታዮች' 
    },
  ]
 
  return (
    <section className="bg-ink border-y border-border-primary py-24 md:py-32 overflow-hidden relative group">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={cn(
                "text-center px-6 flex flex-col items-center justify-center border-border-primary/30 transition-all duration-700",
                idx < stats.length - 1 && "md:border-r"
              )}
            >
              <span className="font-display text-4xl md:text-6xl text-white leading-none font-bold mb-6 tracking-tight">
                {stat.number}
              </span>
              <span className={cn(
                "text-[10px] tracking-[0.3em] text-accent uppercase font-bold mb-2",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                {stat.label}
              </span>
              <span className={cn(
                "text-[10px] text-text-secondary tracking-[0.2em] uppercase font-medium",
                language === 'am' && "font-ethiopic tracking-normal"
              )}>
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </section>
  )
}
