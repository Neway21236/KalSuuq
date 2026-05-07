'use client'

import { Star } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function Testimonials() {
  const { language } = useLanguageStore()

  const testimonials = [
    {
      name: language === 'en' ? 'Sarah M.' : 'ሳራ ኤም.',
      quote: language === 'en' 
        ? "The quality of the linen shirt exceeded my expectations. Delivery in Addis was prompt and the packaging was beautiful."
        : "የጥጥ ሸሚዙ ጥራት ከጠበቅኩት በላይ ነበር። አዲስ አበባ ውስጥ ያደረሱበት ፍጥነት እና የጥቅሉ ውበት ደስ የሚል ነበር።",
      rating: 5,
      status: language === 'en' ? 'Verified Buyer' : 'የተረጋገጠ ደንበኛ'
    },
    {
      name: language === 'en' ? 'Dawit T.' : 'ዳዊት ቲ.',
      quote: language === 'en'
        ? "Finally a platform that understands local context while maintaining global standards. The checkout process was seamless."
        : "በመጨረሻ ዓለም አቀፍ ደረጃውን የጠበቀ እና የሀገር ውስጥ ሁኔታን የሚረዳ መድረክ አገኘን። የክፍያ ሂደቱ በጣም ቀላል ነበር።",
      rating: 5,
      status: language === 'en' ? 'Verified Buyer' : 'የተረጋገጠ ደንበኛ'
    },
    {
      name: language === 'en' ? 'Selam A.' : 'ሰላም ኤ.',
      quote: language === 'en'
        ? "Love the curated editorial feel. It makes shopping for high-end pieces in Ethiopia so much more inspiring."
        : "የተመረጡት ስብስቦች ልዩ ስሜት አላቸው። በኢትዮጵያ ውስጥ ውድ የሆኑ ፋሽኖችን መግዛት ይበልጥ ደስ እንዲል ያደርገዋል።",
      rating: 5,
      status: language === 'en' ? 'Verified Buyer' : 'የተረጋገጠ ደንበኛ'
    }
  ]

  return (
    <section className="bg-surface border-t border-border-primary py-24 md:py-48 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={cn(
          "font-display text-5xl md:text-8xl text-text-primary mb-24 tracking-tight font-bold text-center md:text-left",
          language === 'am' && "font-ethiopic text-6xl"
        )}>
          {language === 'en' ? 'Client Stories' : 'የደንበኞች አስተያየት'}
        </h2>
        
        {/* Mobile: Horizontal Scroll | Desktop: Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-10 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="snap-start min-w-[320px] md:min-w-0 bg-surface-card border border-border-primary p-12 space-y-10 shadow-sm hover:shadow-2xl transition-all duration-700 group hover:-translate-y-2"
            >
              <div className="flex space-x-1.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              
              <blockquote className={cn(
                "font-display text-2xl text-text-primary italic leading-relaxed group-hover:text-accent transition-colors duration-500",
                language === 'am' && "font-ethiopic text-xl"
              )}>
                &quot;{t.quote}&quot;
              </blockquote>

              <div className="flex items-center justify-between pt-8 border-t border-border-primary">
                <span className={cn(
                  "text-base font-bold text-text-primary tracking-wide",
                  language === 'am' && "font-ethiopic"
                )}>
                  {t.name}
                </span>
                <span className={cn(
                  "text-[10px] bg-accent/10 text-accent border border-accent/20 px-3 py-1 font-bold uppercase tracking-[0.3em]",
                  language === 'am' && "font-ethiopic tracking-normal text-[9px] px-2"
                )}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
