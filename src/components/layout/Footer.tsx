'use client'

import Link from 'next/link'
import { Camera, Send, MessageCircle, Phone, Mail, ChevronRight } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function Footer() {
  const { language } = useLanguageStore()

  return (
    <footer className="bg-surface border-t border-border-primary pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 lg:gap-32 mb-24">
          {/* Column 1 — Brand */}
          <div className="flex flex-col space-y-10">
            <Link 
              href="/" 
              className="font-display font-bold text-4xl tracking-[0.5em] text-text-primary uppercase hover:text-accent transition-all w-fit group"
            >
              Kalsuq<span className="text-accent transition-all group-hover:pl-2">.</span>
            </Link>
            <p className={cn(
              "text-lg text-text-secondary font-body leading-relaxed max-w-sm opacity-80",
              language === 'am' && "font-ethiopic"
            )}>
              {language === 'en' 
                ? 'Elevating Ethiopian fashion through premium editorial curation and local craftsmanship.'
                : 'የኢትዮጵያን ፋሽን በከፍተኛ ጥራት እና በሀገር በቀል ጥበብ ወደ ላቀ ደረጃ እናደርሳለን።'}
            </p>
            <div className="flex items-center space-x-8">
              {[
                { icon: Camera, href: 'https://instagram.com/kalsuq' },
                { icon: Send, href: 'https://t.me/kalsuq' },
                { icon: MessageCircle, href: 'https://wa.me/251900000000' }
              ].map((social, idx) => (
                <Link 
                  key={idx}
                  href={social.href} 
                  className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-accent border border-border-primary hover:border-accent bg-surface-card hover:bg-accent/5 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-90"
                >
                  <social.icon size={22} strokeWidth={1.2} />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 — Navigate */}
          <div className="flex flex-col space-y-12">
            <h4 className={cn(
              "text-[10px] tracking-[0.6em] text-accent uppercase font-bold",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}>
              {language === 'en' ? 'Quick Access' : 'ፈጣን ሊንኮች'}
            </h4>
            <nav className="grid grid-cols-1 gap-6">
              {[
                { name: 'The Shop', nameAm: 'ሱቁ', href: '/shop' },
                { name: 'Partnership', nameAm: 'አጋርነት', href: '/partners' },
                { name: 'Our Story', nameAm: 'ስለ እኛ', href: '/about' },
                { name: 'Contact Us', nameAm: 'ያግኙን', href: '/contact' },
                { name: 'FAQ', nameAm: 'ጥያቄዎች', href: '/shop' }
              ].map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={cn(
                    "text-[11px] font-bold tracking-[0.3em] text-text-secondary hover:text-accent uppercase transition-all flex items-center group w-fit",
                    language === 'am' && "font-ethiopic tracking-normal text-sm"
                  )}
                >
                  <ChevronRight size={14} className="mr-3 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                  {language === 'en' ? link.name : link.nameAm}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Contact */}
          <div className="flex flex-col space-y-12">
            <h4 className={cn(
              "text-[10px] tracking-[0.6em] text-accent uppercase font-bold",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}>
              {language === 'en' ? 'Get in Touch' : 'አድራሻ'}
            </h4>
            <div className="flex flex-col space-y-6">
              {[
                { icon: Phone, text: '+251 900 000 000', href: 'tel:+251900000000' },
                { icon: Mail, text: 'hello@kalsuq.com', href: 'mailto:hello@kalsuq.com' },
                { icon: MessageCircle, text: language === 'en' ? 'WhatsApp Support' : 'የዋትስአፕ ድጋፍ', href: 'https://wa.me/251900000000' }
              ].map((item, idx) => (
                <Link 
                  key={idx}
                  href={item.href} 
                  className="flex items-center space-x-6 text-text-secondary hover:text-accent transition-all group py-3 px-4 border border-transparent hover:border-accent/10 hover:bg-accent/5"
                >
                  <div className="w-12 h-12 border border-border-primary flex items-center justify-center group-hover:border-accent transition-all group-hover:bg-accent group-hover:text-white shadow-sm">
                    <item.icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className={cn(
                    "text-base font-bold tracking-tight",
                    language === 'am' && "font-ethiopic text-sm"
                  )}>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-16 border-t border-border-primary flex flex-col lg:flex-row justify-between items-center space-y-10 lg:space-y-0 opacity-80">
          <p className="text-[10px] text-text-secondary tracking-[0.4em] uppercase font-bold">
            © 2026 Kalsuq Fashion · Addis Ababa, Ethiopia
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] text-text-secondary tracking-[0.4em] uppercase font-bold">
            <Link href="/privacy" className="text-text-secondary hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-text-secondary hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-accent transition-all">Shipping</Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[120px] pointer-events-none -mb-[20vw] -mr-[10vw]" />
    </footer>
  )
}
