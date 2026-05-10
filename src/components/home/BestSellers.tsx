'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'
import { TrendingUp } from 'lucide-react'
import { Product } from '@/components/product/ProductCard'
import ProductCard from '@/components/product/ProductCard'

interface BestSellersProps {
  products: Product[]
}

export default function BestSellers({ products }: BestSellersProps) {
  const { language } = useLanguageStore()

  if (products.length === 0) return null

  return (
    <section className="bg-ink py-24 md:py-48 transition-colors duration-300 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-accent/[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-accent/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/10 border border-accent/20 flex items-center justify-center">
                <TrendingUp size={16} className="text-accent" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-[0.5em] text-accent",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                {language === 'en' ? 'Last 30 Days' : 'ባለፉት 30 ቀናት'}
              </span>
            </div>
            <h2 className={cn(
              "font-display text-5xl md:text-8xl text-white tracking-tight font-bold leading-tight",
              language === 'am' && "font-ethiopic text-4xl md:text-7xl"
            )}>
              {language === 'en' ? 'Best Sellers' : 'ተመራጭ ምርቶች'}
            </h2>
          </div>

          <Link
            href="/shop?sort=best-selling"
            className={cn(
              "text-[10px] font-bold tracking-[0.5em] uppercase text-white/70 hover:text-accent transition-all pb-3 border-b-2 border-white/20 hover:border-accent group flex items-center",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}
          >
            {language === 'en' ? 'View All' : 'ሁሉንም ይመልከቱ'}
            <span className="ml-3 transition-transform group-hover:translate-x-2 text-accent">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, idx) => (
            <div key={product.id} className="relative">
              {/* Rank badge */}
              <div className="absolute -top-4 -left-2 z-20 w-10 h-10 bg-accent text-white text-sm font-bold font-mono flex items-center justify-center shadow-xl shadow-accent/30">
                {idx + 1}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
