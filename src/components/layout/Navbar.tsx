'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { name: 'Shop', nameAm: 'ይግዙ', href: '/shop' },
  { name: 'Partners', nameAm: 'አጋሮች', href: '/partners' },
  { name: 'About', nameAm: 'ስለ እኛ', href: '/about' },
  { name: 'Contact', nameAm: 'ያግኙን', href: '/contact' }
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { getItemCount, openCart } = useCartStore()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguageStore()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (!mounted) return null

  return (
    <>
      <nav 
        className={cn(
          "sticky top-0 z-50 w-full h-16 md:h-20 flex items-center transition-all duration-500",
          "bg-surface/70 dark:bg-surface/80 backdrop-blur-xl border-b border-border-primary",
          scrolled ? "shadow-2xl h-14 md:h-16" : ""
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-display font-bold text-2xl md:text-3xl tracking-[0.4em] text-text-primary uppercase group"
          >
            Kalsuq<span className="text-accent transition-all group-hover:pl-2">.</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:text-accent relative py-2 overflow-hidden",
                  pathname === link.href ? "text-accent" : "text-text-primary",
                  language === 'am' && "font-ethiopic tracking-normal text-sm"
                )}
              >
                {language === 'en' ? link.name : link.nameAm}
                {pathname === link.href && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Cluster */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Language Toggle - Hidden on Mobile */}
            <button 
              aria-label={language === 'en' ? "Switch to Amharic" : "ወደ እንግሊዝኛ ቀይር"}
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className={cn(
                "hidden md:flex text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 border border-border-primary hover:border-accent hover:text-accent transition-all bg-surface-card shadow-sm",
                language === 'am' && "font-ethiopic tracking-normal text-[10px]"
              )}
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>

            {/* Theme Toggle - Hidden on Mobile */}
            <button 
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:flex p-2.5 text-text-primary hover:text-accent transition-all hover:bg-accent/5 rounded-none border border-transparent hover:border-accent/20"
            >
              {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
            </button>
            
            <button 
              aria-label={`Open Cart, ${getItemCount()} items`}
              onClick={openCart}
              className="relative p-2.5 text-text-primary hover:text-accent transition-all hover:bg-accent/5 border border-transparent hover:border-accent/20"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white dark:text-ink text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                  {getItemCount()}
                </span>
              )}
            </button>

            <Link 
              href="/shop" 
              className={cn(
                "hidden md:block bg-accent text-white dark:text-ink text-[10px] font-bold px-8 py-3.5 tracking-[0.3em] uppercase transition-all hover:bg-accent-hover shadow-xl active:scale-95",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}
            >
              {language === 'en' ? 'Shop Now' : 'አሁን ይግዙ'}
            </Link>

            <button 
              aria-label="Open mobile menu"
              className="md:hidden p-2.5 text-text-primary hover:text-accent transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/80 backdrop-blur-xl z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-surface z-[70] md:hidden flex flex-col p-12 border-l border-border-primary shadow-2xl transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-20">
                <span className="font-display font-bold text-3xl tracking-[0.5em] text-text-primary uppercase">
                  Kalsuq
                </span>
                <button aria-label="Close mobile menu" onClick={() => setIsMobileMenuOpen(false)} className="text-text-primary hover:text-accent transition-all p-3 border border-border-primary hover:bg-accent/5">
                  <X size={36} strokeWidth={1} />
                </button>
              </div>

              <div className="flex flex-col space-y-10">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-5xl font-display font-bold py-6 border-b border-border-primary flex items-center justify-between group transition-all",
                        pathname === link.href ? "text-accent" : "text-text-primary",
                        language === 'am' && "font-ethiopic text-4xl"
                      )}
                    >
                      <span>{language === 'en' ? link.name : link.nameAm}</span>
                      <ChevronRight size={32} className="text-border-primary group-hover:text-accent transition-all group-hover:translate-x-3" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-16 space-y-10">
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                    className={cn(
                      "text-[10px] font-bold tracking-[0.3em] uppercase px-6 py-4 border border-border-primary text-text-primary flex flex-col items-center space-y-2 active:scale-95 transition-all bg-surface-card shadow-lg",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}
                  >
                    <span className="opacity-60">{language === 'en' ? 'Language' : 'ቋንቋ'}</span>
                    <span className="text-accent">{language === 'en' ? 'English' : 'አማርኛ'}</span>
                  </button>

                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-6 border border-border-primary text-text-primary active:scale-95 transition-all bg-surface-card shadow-lg flex flex-col items-center space-y-2"
                  >
                    <span className="opacity-60 uppercase text-[10px] tracking-widest font-bold">{language === 'en' ? 'Theme' : 'ገጽታ'}</span>
                    {theme === 'dark' ? <Sun size={24} className="text-accent" /> : <Moon size={24} className="text-accent" />}
                  </button>
                </div>
                
                <Link 
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block w-full bg-accent text-white dark:text-ink text-center py-7 text-[10px] font-bold tracking-[0.5em] uppercase shadow-2xl active:scale-95 transition-all",
                    language === 'am' && "font-ethiopic tracking-normal text-sm"
                  )}
                >
                  {language === 'en' ? 'Shop the Collection' : 'አሁኑኑ ይግዙ'}
                </Link>

                <div className="flex justify-center space-x-12 text-[10px] text-text-secondary uppercase tracking-[0.4em] font-bold opacity-80 pt-6">
                  <Link href="/contact" className="hover:text-accent transition-all">Support</Link>
                  <Link href="/partners" className="hover:text-accent transition-all">Sell</Link>
                  <Link href="/about" className="hover:text-accent transition-all">Story</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
