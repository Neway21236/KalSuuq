'use client'
 
import Link from 'next/link'
import { TrendingUp, DollarSign, Share2 } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'
 
export default function PartnerTeaser() {
  const { language } = useLanguageStore()
 
  const benefits = [
    { 
      icon: Share2, 
      text: language === 'en' 
        ? 'Your referral code + trackable link' 
        : 'የእርስዎ ልዩ ኮድ እና የሚከታተል ሊንክ' 
    },
    { 
      icon: DollarSign, 
      text: language === 'en' 
        ? 'Commission on every confirmed order' 
        : 'ለእያንዳንዱ ትዕዛዝ የሚከፈል ኮሚሽን' 
    },
    { 
      icon: TrendingUp, 
      text: language === 'en' 
        ? 'Monthly payout to your account' 
        : 'ወርሃዊ ክፍያ ወደ ባንክ ሒሳብዎ' 
    }
  ]
 
  return (
    <section className="bg-surface-card border-t border-border-primary py-24 md:py-48 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl space-y-16">
          <div className="space-y-8">
            <span className={cn(
              "text-[10px] tracking-[0.5em] text-accent uppercase font-bold",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}>
              {language === 'en' ? 'Growth Channel' : 'የዕድገት ዕድል'}
            </span>
            <h2 className={cn(
              "font-display text-5xl md:text-8xl text-text-primary leading-[1.1] tracking-tight font-bold",
              language === 'am' && "font-ethiopic text-6xl"
            )}>
              {language === 'en' ? 'Sell Kalsuq.' : 'በቃልሱቅ ይሽጡ።'} <br /> <span className="text-accent">{language === 'en' ? 'Earn Every Month.' : 'በየወሩ ያግኙ።'}</span>
            </h2>
            <p className={cn(
              "text-text-secondary font-body text-lg sm:text-2xl leading-relaxed max-w-3xl",
              language === 'am' && "font-ethiopic"
            )}>
              {language === 'en'
                ? 'Join our exclusive partner program and monetize your influence. Share the brands you love and earn commission on every sale.'
                : 'ልዩ የአጋርነት ፕሮግራማችንን ይቀላቀሉ እና ተፅዕኖዎን ወደ ገቢ ይለውጡ። የሚወዷቸውን ምርቶች ያጋሩ እና በእያንዳንዱ ሽያጭ ላይ ኮሚሽን ያግኙ።'}
            </p>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-8 border-t border-border-primary/40">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start space-x-6 group">
                <div className="w-14 h-14 rounded-none border border-accent/20 bg-accent/5 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
                  <b.icon size={24} strokeWidth={1.5} />
                </div>
                <span className={cn(
                  "text-base text-text-secondary leading-relaxed font-bold pt-1",
                  language === 'am' && "font-ethiopic font-normal"
                )}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>
 
          <div className="flex flex-col sm:flex-row gap-6 pt-12">
            <Link 
              href="/partners" 
              className={cn(
                "bg-accent text-white dark:text-ink px-16 py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-accent-hover text-center shadow-2xl active:scale-95",
                language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
              )}
            >
              {language === 'en' ? 'Join as a Partner' : 'አጋር ይሁኑ'}
            </Link>
            <Link 
              href="/partners" 
              className={cn(
                "border border-border-primary text-text-primary px-16 py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:border-accent hover:text-accent text-center bg-transparent active:scale-95",
                language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
              )}
            >
              {language === 'en' ? 'Learn More' : 'ተጨማሪ መረጃ'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
