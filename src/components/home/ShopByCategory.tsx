'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

const categories = [
  { 
    name: 'Shoes', 
    nameAm: 'ጫማዎች',
    image: '/cat-shoes.png', 
    href: '/shop?category=shoes' 
  },
  { 
    name: 'Clothes', 
    nameAm: 'ልብሶች',
    image: '/cat-clothes.png', 
    href: '/shop?category=clothes' 
  },
  { 
    name: 'Accessories', 
    nameAm: 'መለዋወጫዎች',
    image: '/cat-accessories.png', 
    href: '/shop?category=accessories' 
  },
]

export default function ShopByCategory() {
  const { language } = useLanguageStore()

  return (
    <section className="bg-surface py-24 md:py-48 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="space-y-4">
            <h2 className={cn(
              "font-display text-5xl md:text-8xl text-text-primary tracking-tight font-bold leading-tight",
              language === 'am' && "font-ethiopic text-4xl md:text-7xl"
            )}>
              {language === 'en' ? 'Shop by Category' : 'በምድብ ይግዙ'}
            </h2>
            <p className={cn(
              "text-lg text-text-secondary font-body max-w-xl leading-relaxed",
              language === 'am' && "font-ethiopic"
            )}>
              {language === 'en' 
                ? 'Discover our curated selection of premium fashion essentials.'
                : 'ለእርስዎ የተመረጡ ከፍተኛ ጥራት ያላቸውን የፋሽን ስብስቦች ያስሱ።'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden bg-surface-card border border-border-primary shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
            >
              <Image 
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <h3 className={cn(
                  "font-display text-4xl md:text-5xl text-white mb-4 tracking-tight font-bold",
                  language === 'am' && "font-ethiopic text-3xl"
                )}>
                  {language === 'en' ? cat.name : cat.nameAm}
                </h3>
                <span className={cn(
                  "text-[10px] tracking-[0.4em] text-accent uppercase font-bold flex items-center transition-all group-hover:translate-x-2",
                  language === 'am' && "font-ethiopic tracking-normal text-[11px]"
                )}>
                  {language === 'en' ? 'Discover Collection' : 'ስብስቡን ይመልከቱ'} <span className="ml-2">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
