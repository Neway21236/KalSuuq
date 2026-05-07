'use client'

import Link from 'next/link'
import { Phone, Mail, MessageCircle, Send, Camera, ChevronRight } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function ContactPage() {
  const { language } = useLanguageStore()
  
  const methods = [
    { icon: Phone, label: 'Phone', value: '+251 900 000 000', cta: language === 'en' ? 'Call Now' : 'አሁኑኑ ይደውሉ', href: 'tel:+251900000000' },
    { icon: Mail, label: 'Email', value: 'hello@kalsuq.com', cta: language === 'en' ? 'Send Email' : 'ኢሜይል ይላኩ', href: 'mailto:hello@kalsuq.com' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+251 900 000 000', cta: language === 'en' ? 'Start Chat' : 'ውይይት ይጀምሩ', href: 'https://wa.me/251900000000' },
    { icon: Send, label: 'Telegram', value: '@kalsuq_support', cta: language === 'en' ? 'Message Us' : 'መልዕክት ይላኩ', href: 'https://t.me/kalsuq' },
    { icon: Camera, label: 'Instagram', value: '@kalsuq_official', cta: language === 'en' ? 'Follow Us' : 'ይከተሉን', href: 'https://instagram.com/kalsuq' }
  ]

  return (
    <div className="bg-surface min-h-screen pb-20 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-surface border-b border-border-primary py-24 md:py-40 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <span className={cn(
            "text-[10px] md:text-xs tracking-[0.5em] text-accent uppercase font-bold mb-8 block",
            language === 'am' && "font-ethiopic tracking-normal"
          )}>
            {language === 'en' ? 'Get in Touch' : 'ያግኙን'}
          </span>
          <h1 className={cn(
            "font-display text-5xl md:text-8xl text-text-primary leading-[1.1] tracking-tight",
            language === 'am' && "font-ethiopic text-6xl"
          )}>
            {language === 'en' ? "We're on Every Channel." : "በሁሉም አማራጭ እንገኛለን።"}
          </h1>
          <p className={cn(
            "text-text-secondary mt-8 font-body text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed",
            language === 'am' && "font-ethiopic"
          )}>
            {language === 'en' 
              ? 'Choose your preferred way to connect. Our team in Addis is ready to assist you with orders, sizing, or partnerships.'
              : 'የሚመርጡትን የመገናኛ ዘዴ ይምረጡ። የአዲስ አበባ ቡድናችን በትዕዛዝ፣ በልክ ወይም በአጋርነት ለመርዳት ዝግጁ ነው።'}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.03)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* Contact Methods */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {methods.map((m, i) => (
              <Link 
                key={i} 
                href={m.href}
                className="group bg-surface-card border border-border-primary p-10 flex items-center gap-8 transition-all hover:border-accent hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="w-16 h-16 flex-shrink-0 border border-accent/20 bg-accent/5 flex items-center justify-center text-accent transition-all group-hover:bg-accent group-hover:text-white dark:group-hover:text-ink shadow-sm">
                  <m.icon size={28} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] tracking-[0.3em] text-accent uppercase font-bold block mb-2">
                    {m.label}
                  </span>
                  <p className="text-sm md:text-base font-bold text-text-primary truncate mb-2 tracking-tight">
                    {m.value}
                  </p>
                  <span className="text-[10px] text-text-secondary group-hover:text-accent uppercase font-bold tracking-[0.2em] flex items-center transition-colors">
                    {m.cta} <ChevronRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Featured Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-surface-card border border-border-primary p-12 md:p-24 text-center space-y-10 shadow-2xl transition-all duration-500 hover:shadow-accent/5">
          <div className="space-y-6">
            <h2 className={cn(
              "font-display text-4xl md:text-6xl text-text-primary leading-tight tracking-tight",
              language === 'am' && "font-ethiopic text-4xl"
            )}>
              {language === 'en' ? 'Prefer to Order Directly?' : 'በቀጥታ ማዘዝ ይፈልጋሉ?'}
            </h2>
            <p className={cn(
              "text-text-secondary font-body text-base md:text-xl max-w-2xl mx-auto leading-relaxed",
              language === 'am' && "font-ethiopic"
            )}>
              {language === 'en' 
                ? 'Skip the checkout and talk to us directly on WhatsApp. Just send a screenshot or link of the item you want, and we\'ll handle the rest.'
                : 'የመክፈያ ሂደቱን ይለፉ እና በቀጥታ በዋትስአፕ ያነጋግሩን። የሚፈልጉትን ዕቃ ምስል ወይም ሊንክ ይላኩልን፣ ቀሪውን እኛ እናከናውናለን።'}
            </p>
          </div>
          
          <Link 
            href="https://wa.me/251900000000"
            className={cn(
              "inline-block bg-accent text-white dark:text-ink px-16 py-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:bg-accent-hover shadow-xl active:scale-95",
              language === 'am' && "font-ethiopic tracking-normal text-sm py-4"
            )}
          >
            {language === 'en' ? 'Start WhatsApp Order →' : 'በዋትስአፕ ትዕዛዝ ይጀምሩ →'}
          </Link>

          <div className={cn(
            "pt-12 flex flex-wrap justify-center gap-8 text-[10px] text-text-secondary uppercase tracking-[0.3em] font-bold opacity-70",
            language === 'am' && "font-ethiopic tracking-normal text-xs opacity-100"
          )}>
            <span>{language === 'en' ? 'Average Response: 15 mins' : 'አማካይ ምላሽ፡ 15 ደቂቃ'}</span>
            <span className="hidden sm:block">·</span>
            <span>{language === 'en' ? 'Addis Delivery: Same Day' : 'አዲስ አበባ አቅርቦት፡ በዕለቱ'}</span>
            <span className="hidden sm:block">·</span>
            <span>Support in EN / አማ</span>
          </div>
        </div>
      </section>
    </div>
  )
}
