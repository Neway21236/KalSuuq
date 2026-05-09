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
              className="fixed inset-0 bg-ink/90 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full bg-surface dark:bg-[#0D0B0A] z-[70] md:hidden flex flex-col p-8 sm:p-12 overflow-y-auto overflow-x-hidden"
            >
              {/* Decorative Background Element */}
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between mb-12 sm:mb-20 relative z-10">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-display font-bold text-2xl tracking-[0.4em] text-text-primary uppercase">
                  Kalsuq<span className="text-accent">.</span>
                </Link>
                <button 
                  aria-label="Close mobile menu" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-text-primary hover:text-accent transition-all p-2 rounded-full border border-border-primary/50 bg-surface-card/50 backdrop-blur-sm shadow-xl"
                >
                  <X size={28} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col space-y-2 relative z-10">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "group block py-4 flex items-baseline justify-between transition-all duration-500",
                        pathname === link.href ? "text-accent" : "text-text-primary hover:text-accent"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] text-accent/40 font-bold uppercase tracking-[0.5em] mb-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span className={cn(
                          "text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tighter leading-none transition-transform duration-500 group-hover:translate-x-2",
                          language === 'am' && "font-ethiopic text-3xl sm:text-4xl"
                        )}>
                          {language === 'en' ? link.name : link.nameAm}
                        </span>
                      </div>
                      <ChevronRight 
                        size={32} 
                        className={cn(
                          "transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2",
                          pathname === link.href ? "opacity-100 text-accent" : "text-border-primary"
                        )} 
                        strokeWidth={1}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-12 space-y-8 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                    className={cn(
                      "flex flex-col items-start p-4 border border-border-primary/50 bg-surface-card/30 backdrop-blur-sm transition-all hover:border-accent group",
                      language === 'am' && "font-ethiopic"
                    )}
                  >
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">{language === 'en' ? 'Language' : 'ቋንቋ'}</span>
                    <span className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">{language === 'en' ? 'English' : 'አማርኛ'}</span>
                  </motion.button>

                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex flex-col items-start p-4 border border-border-primary/50 bg-surface-card/30 backdrop-blur-sm transition-all hover:border-accent group"
                  >
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest mb-1">{language === 'en' ? 'Theme' : 'ገጽታ'}</span>
                    <div className="flex items-center space-x-2 text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                      {theme === 'dark' ? (
                        <>
                          <Sun size={14} />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon size={14} />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link 
                    href="/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block w-full bg-accent text-white dark:text-ink text-center py-6 text-[10px] font-bold tracking-[0.5em] uppercase shadow-2xl active:scale-[0.98] transition-all hover:bg-accent-hover",
                      language === 'am' && "font-ethiopic tracking-normal text-sm"
                    )}
                  >
                    {language === 'en' ? 'Explore Collections' : 'አሁኑኑ ይግዙ'}
                  </Link>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-between items-center px-2 text-[9px] text-text-muted uppercase tracking-[0.3em] font-bold"
                >
                  <Link href="/contact" className="hover:text-accent transition-colors">Support</Link>
                  <div className="h-px w-8 bg-border-primary" />
                  <Link href="/partners" className="hover:text-accent transition-colors">Sell</Link>
                  <div className="h-px w-8 bg-border-primary" />
                  <Link href="/about" className="hover:text-accent transition-colors">Story</Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
