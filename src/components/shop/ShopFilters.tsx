'use client'

import { useState } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'

interface ShopFiltersProps {
  onCategoryChange: (category: string) => void
  onPriceChange: (price: string | null) => void
  onSortChange: (sort: string) => void
}

export default function ShopFilters({ onCategoryChange, onPriceChange, onSortChange }: ShopFiltersProps) {
  const { language } = useLanguageStore()
  const [activeCategory, setActiveCategory] = useState(language === 'en' ? 'All' : 'ሁሉም')
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [activeSort, setActiveSort] = useState(language === 'en' ? 'Newest' : 'አዲስ')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat)
    onCategoryChange(cat)
  }

  const handlePriceClick = (range: string) => {
    const newPrice = activePrice === range ? null : range
    setActivePrice(newPrice)
    onPriceChange(newPrice)
  }

  const handleSortClick = (opt: string) => {
    setActiveSort(opt)
    onSortChange(opt)
    setIsMobileFilterOpen(false)
  }

  const categories = language === 'en' 
    ? ['All', 'Shoes', 'Clothes', 'Bundles'] 
    : ['ሁሉም', 'ጫማዎች', 'ልብሶች', 'ጥቅሎች']

  const priceRanges = language === 'en'
    ? ['Under 3,000 ETB', '3,000–6,000 ETB', 'Over 6,000 ETB']
    : ['ከ3,000 ብር በታች', 'ከ3,000–6,000 ብር', 'ከ6,000 ብር በላይ']

  const sortOptions = language === 'en'
    ? ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling']
    : ['አዲስ', 'ዋጋ፡ ከዝቅተኛ ወደ ከፍተኛ', 'ዋጋ፡ ከከፍተኛ ወደ ዝቅተኛ', 'ተመራጭ']

  return (
    <>
      <div className="sticky top-[56px] md:top-[64px] z-30 bg-surface border-b border-border-primary py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="container mx-auto">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Category Pills */}
              <div className="flex items-center space-x-3 border-r border-border-primary pr-6 mr-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      "px-5 py-2.5 text-[10px] uppercase font-bold tracking-[0.2em] transition-all border",
                      activeCategory === cat 
                        ? "bg-accent text-white dark:text-ink border-accent shadow-lg shadow-accent/10" 
                        : "bg-surface-card text-text-primary border-border-primary hover:border-accent/40",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Price Range Pills */}
              <div className="flex items-center space-x-3">
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => handlePriceClick(range)}
                    className={cn(
                      "px-5 py-2.5 text-[10px] uppercase font-bold tracking-[0.2em] transition-all border",
                      activePrice === range 
                        ? "bg-accent text-white dark:text-ink border-accent shadow-lg shadow-accent/10" 
                        : "bg-surface-card text-text-primary border-border-primary hover:border-accent/40",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className={cn(
                "flex items-center space-x-4 px-6 py-2.5 border border-border-primary bg-surface-card text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary hover:border-accent transition-all",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                <span>{language === 'en' ? `Sort: ${activeSort}` : `ቅደም ተከተል፡ ${activeSort}`}</span>
                <ChevronDown size={14} className="text-accent" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border-primary shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-40">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSortClick(opt)}
                    className={cn(
                      "w-full text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent/5 hover:text-accent transition-all border-b border-border-primary last:border-0 text-text-primary active:scale-[0.98]",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters Trigger */}
          <div className="flex md:hidden items-center justify-between">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className={cn(
                "flex items-center space-x-3 px-6 py-2.5 border border-border-primary bg-surface-card text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary active:scale-95 transition-all",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}
            >
              <Filter size={14} className="text-accent" />
              <span>{language === 'en' ? 'Filters' : 'ማጣሪያዎች'}</span>
            </button>
            <div className={cn(
              "flex items-center space-x-3 px-6 py-2.5 border border-border-primary bg-surface-card text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary active:scale-95 transition-all",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}>
              <span>{language === 'en' ? 'Sort' : 'ደርድር'}</span>
              <ChevronDown size={14} className="text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-surface z-[110] md:hidden rounded-t-[2.5rem] border-t border-border-primary max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-300"
            >
              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between border-b border-border-primary pb-6">
                  <h3 className={cn(
                    "font-display text-3xl text-text-primary tracking-tight font-semibold",
                    language === 'am' && "font-ethiopic"
                  )}>{language === 'en' ? 'Filters' : 'ማጣሪያዎች'}</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="text-text-secondary hover:text-accent transition-colors">
                    <X size={28} />
                  </button>
                </div>

                <div className="space-y-6">
                  <h4 className={cn(
                    "text-[10px] tracking-[0.3em] text-accent uppercase font-bold",
                    language === 'am' && "font-ethiopic tracking-normal"
                  )}>{language === 'en' ? 'Category' : 'ምድብ'}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={cn(
                          "py-4 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all",
                          activeCategory === cat 
                            ? "bg-accent text-white dark:text-ink border-accent shadow-lg shadow-accent/10" 
                            : "bg-surface-card text-text-primary border-border-primary",
                          language === 'am' && "font-ethiopic tracking-normal text-xs"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className={cn(
                    "text-[10px] tracking-[0.3em] text-accent uppercase font-bold",
                    language === 'am' && "font-ethiopic tracking-normal"
                  )}>{language === 'en' ? 'Price Range' : 'የዋጋ ክልል'}</h4>
                  <div className="space-y-3">
                    {priceRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => handlePriceClick(range)}
                        className={cn(
                          "w-full py-4 text-left px-6 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all",
                          activePrice === range 
                            ? "bg-accent text-white dark:text-ink border-accent shadow-lg shadow-accent/10" 
                            : "bg-surface-card text-text-primary border-border-primary",
                          language === 'am' && "font-ethiopic tracking-normal text-xs"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className={cn(
                    "w-full bg-accent text-white dark:text-ink py-5 text-xs font-bold uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all active:scale-95",
                    language === 'am' && "font-ethiopic tracking-normal text-sm"
                  )}
                >
                  {language === 'en' ? 'Apply Filters' : 'ማጣሪያዎችን ተግብር'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
