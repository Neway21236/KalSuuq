'use client'

import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function HowKalsuqWorks() {
  const { language } = useLanguageStore()

  const steps = [
    {
      number: '01',
      title: language === 'en' ? 'Curated Discovery' : 'የተመረጠ ግኝት',
      desc: language === 'en' ? 'Browse our exclusive collection of high-end fashion, vetted for quality and style.' : 'ለጥራት እና ለፋሽን የተመረጡ ከፍተኛ የፋሽን ስብስቦቻችንን ያስሱ።'
    },
    {
      number: '02',
      title: language === 'en' ? 'Local Commerce' : 'ሀገር በቀል ንግድ',
      desc: language === 'en' ? 'Order in ETB with seamless delivery options across Addis Ababa and beyond.' : 'በኢትዮጵያ ብር ይዘዙ እና አዲስ አበባ ውስጥ ፈጣን አቅርቦት ያግኙ።'
    },
    {
      number: '03',
      title: language === 'en' ? 'Expert Support' : 'የባለሙያ ድጋፍ',
      desc: language === 'en' ? 'Connect via WhatsApp or Telegram for personalized sizing and order assistance.' : 'ለግል የልክ እና የትዕዛዝ እገዛ በዋትስአፕ ወይም በቴሌግራም ያግኙን።'
    }
  ]

  return (
    <section className="bg-surface border-y border-border-primary py-24 md:py-48 transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="space-y-6">
            <span className={cn(
              "text-[10px] tracking-[0.6em] text-accent uppercase font-bold",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}>
              {language === 'en' ? 'The Experience' : 'ልምዱ'}
            </span>
            <h2 className={cn(
              "font-display text-5xl md:text-8xl text-text-primary tracking-tight font-bold leading-tight",
              language === 'am' && "font-ethiopic text-4xl md:text-7xl"
            )}>
              {language === 'en' ? 'How Kalsuq Works' : 'ካልሱቅ እንዴት ይሰራል'}
            </h2>
          </div>
          <p className={cn(
            "text-lg md:text-2xl text-text-secondary font-body max-w-lg leading-relaxed opacity-80",
            language === 'am' && "font-ethiopic"
          )}>
            {language === 'en' 
              ? 'Seamlessly connecting you to the best of Ethiopian and international fashion.'
              : 'ከምርጥ የኢትዮጵያ እና የዓለም አቀፍ ፋሽን ጋር ያለ ምንም እንከን እናገናኝዎታለን።'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-primary divide-y md:divide-y-0 md:divide-x divide-border-primary shadow-2xl">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="bg-surface-card px-12 py-20 space-y-12 group hover:bg-accent/[0.02] transition-colors duration-700 relative overflow-hidden"
            >
              <div className="space-y-10 relative z-10">
                <span className="font-display text-9xl text-accent/5 block leading-none font-bold tracking-tighter transition-all duration-1000 group-hover:text-accent/10 group-hover:scale-110">
                  {step.number}
                </span>
                <div className="space-y-6">
                  <h3 className={cn(
                    "font-display text-3xl md:text-4xl text-text-primary tracking-tight font-bold group-hover:text-accent transition-colors duration-500",
                    language === 'am' && "font-ethiopic text-2xl md:text-3xl"
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-lg text-text-secondary leading-relaxed font-body opacity-80",
                    language === 'am' && "font-ethiopic text-base"
                  )}>
                    {step.desc}
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[120px] pointer-events-none -mb-[25vw] -ml-[15vw]" />
    </section>
  )
}
