'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function NotFound() {
  const { language } = useLanguageStore()

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden relative">
      <div className="container max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="relative inline-block">
            <span className="font-display text-[15rem] md:text-[20rem] text-text-primary/5 font-bold select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className={cn(
                "font-display text-4xl md:text-7xl text-text-primary tracking-tight font-bold",
                language === 'am' && "font-ethiopic"
              )}>
                {language === 'en' ? 'Lost in Addis.' : 'በአዲስ አበባ ጠፉ።'}
              </h1>
            </div>
          </div>

          <p className={cn(
            "text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed",
            language === 'am' && "font-ethiopic"
          )}>
            {language === 'en' 
              ? "The collection you are looking for has moved or no longer exists. Let's get you back to the storefront."
              : "የሚፈልጉት ስብስብ ተቀይሯል ወይም የለም። ወደ መገበያያ ገጹ ይመለሱ።"}
          </p>

          <div className="pt-10">
            <Link 
              href="/shop" 
              className={cn(
                "inline-block bg-accent text-white dark:text-ink px-16 py-6 text-[10px] font-bold tracking-[0.5em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-95",
                language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
              )}
            >
              {language === 'en' ? 'Explore Shop →' : 'ሱቁን ያስሱ →'}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  )
}
