'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ShopFilters from '@/components/shop/ShopFilters'
import ProductCard, { Product } from '@/components/product/ProductCard'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

const PRODUCTS_PER_PAGE = 12

function ShopPageInner() {
  const { language } = useLanguageStore()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)

  // Read initial state from URL params (FR-SHOP-02, FR-SHOP-03)
  const urlCategory = searchParams.get('category') || 'All'
  const urlSort = searchParams.get('sort') === 'best-selling' ? 'Best Selling' : 'Newest'

  const [activeCategory, setActiveCategory] = useState(() => {
    const c = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
    return c === 'All' ? 'All' : c
  })
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [activeSort, setActiveSort] = useState(urlSort)
  const [stockOnly, setStockOnly] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Apply filters & sort (FR-SHOP-02, FR-SHOP-03)
  useEffect(() => {
    let result = [...products]

    // Category filter
    if (activeCategory !== 'All' && activeCategory !== 'ሁሉም') {
      result = result.filter(p =>
        p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.categoryAm === activeCategory
      )
    }

    // In-stock filter (FR-SHOP-06)
    if (stockOnly) {
      result = result.filter(p => p.inStock)
    }

    // Price filter
    if (activePrice) {
      if (activePrice.includes('Under')) result = result.filter(p => p.price < 3000)
      else if (activePrice.includes('3,000') && activePrice.includes('6,000')) result = result.filter(p => p.price >= 3000 && p.price <= 6000)
      else if (activePrice.includes('Over')) result = result.filter(p => p.price > 6000)
    }

    // Sort
    if (activeSort.includes('Low to High') || activeSort.includes('ዝቅተኛ')) {
      result.sort((a, b) => a.price - b.price)
    } else if (activeSort.includes('High to Low') || activeSort.includes('ከፍተኛ')) {
      result.sort((a, b) => b.price - a.price)
    } else if (activeSort.includes('Best Selling') || activeSort.includes('ተመራጭ')) {
      result.sort((a, b) => (b.label === 'Best Seller' ? 1 : 0) - (a.label === 'Best Seller' ? 1 : 0))
    }

    setFilteredProducts(result)
    setVisibleCount(PRODUCTS_PER_PAGE)
  }, [activeCategory, activePrice, activeSort, stockOnly, products])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  return (
    <div className="bg-surface min-h-screen pb-32 transition-colors duration-300">
      {/* Hero Strip */}
      <header className="bg-surface border-b border-border-primary py-24 md:py-40 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <span className={cn(
            "text-[10px] md:text-xs tracking-[0.6em] text-accent uppercase font-bold mb-8 block",
            language === 'am' && "font-ethiopic tracking-normal"
          )}>
            {language === 'en' ? 'Spring Edit 2026' : 'የፀደይ እትም 2026'}
          </span>
          <h1 className={cn(
            "font-display text-6xl md:text-9xl text-text-primary tracking-tight font-bold leading-tight",
            language === 'am' && "font-ethiopic text-6xl md:text-8xl"
          )}>
            {language === 'en' ? 'The Collection' : 'ስብስቡ'}
          </h1>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,159,105,0.05)_0%,transparent_70%)] pointer-events-none" />
      </header>

      {/* Sticky Filters (FR-SHOP-02, FR-SHOP-04) */}
      <ShopFilters
        initialCategory={activeCategory}
        initialSort={activeSort}
        onCategoryChange={setActiveCategory}
        onPriceChange={setActivePrice}
        onSortChange={setActiveSort}
        onStockOnlyChange={setStockOnly}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Category Banners strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-24">
          {[
            { name: 'Shoes', nameAm: 'ጫማዎች', sub: 'The Foundation', subAm: 'መሠረቱ', img: '/cat-shoes.png' },
            { name: 'Clothes', nameAm: 'ልብሶች', sub: 'Editorial Fit', subAm: 'ምርጥ ልብስ', img: '/cat-clothes.png' },
            { name: 'Bundles', nameAm: 'ጥቅሎች', sub: 'Save 14%', subAm: '14% ቅናሽ', img: '/cat-accessories.png' },
          ].map((banner) => (
            <Link
              key={banner.name}
              href={`/shop?category=${banner.name.toLowerCase()}`}
              onClick={() => setActiveCategory(banner.name)}
              className="group relative aspect-[16/9] overflow-hidden bg-surface-card border border-border-primary shadow-sm hover:shadow-2xl transition-all duration-700"
            >
              <Image src={banner.img} alt={banner.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className={cn(
                  "font-display text-3xl text-white mb-1 tracking-tight font-bold group-hover:text-accent transition-colors",
                  language === 'am' && "font-ethiopic text-2xl"
                )}>
                  {language === 'en' ? banner.name : banner.nameAm}
                </h3>
                <span className={cn(
                  "text-[10px] tracking-[0.4em] text-accent uppercase font-bold group-hover:translate-x-1 transition-transform inline-block",
                  language === 'am' && "font-ethiopic tracking-normal text-xs"
                )}>
                  {language === 'en' ? banner.sub : banner.subAm} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Results count (FR-SHOP-07) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 border-b border-border-primary pb-8">
          <p className={cn(
            "text-[10px] uppercase tracking-[0.4em] font-bold text-text-muted",
            language === 'am' && "font-ethiopic tracking-normal"
          )}>
            {language === 'en'
              ? `Showing ${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products`
              : `${filteredProducts.length} ዕቃዎችን በማሳየት ላይ`}
          </p>
          {activeCategory !== 'All' && (
            <button
              onClick={() => setActiveCategory('All')}
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
            >
              {language === 'en' ? `Showing: ${activeCategory} ×` : `${activeCategory} ×`}
            </button>
          )}
        </div>

        {/* Product Grid (FR-SHOP-01) */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-surface-card animate-pulse border border-border-primary" />
            ))}
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-20">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <p className={cn("text-4xl font-display text-text-primary font-bold", language === 'am' && "font-ethiopic")}>
              {language === 'en' ? 'No items match your filters' : 'ከምርጫዎ ጋር የሚዛመድ ዕቃ አልተገኘም'}
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setActivePrice(null); setStockOnly(false) }}
              className="text-accent uppercase tracking-widest text-[10px] font-bold border-b border-accent pb-1"
            >
              {language === 'en' ? 'Clear All Filters' : 'ሁሉንም ማጣሪያዎች አጽዳ'}
            </button>
          </div>
        )}

        {/* Infinite scroll / Load More (FR-SHOP-08) */}
        {hasMore && (
          <div className="mt-20 text-center">
            <button
              onClick={() => setVisibleCount(c => c + PRODUCTS_PER_PAGE)}
              className={cn(
                "border border-border-primary bg-surface-card text-text-primary px-24 py-7 text-[10px] font-bold tracking-[0.5em] uppercase transition-all hover:bg-accent hover:text-white dark:hover:text-ink hover:border-accent shadow-2xl active:scale-95",
                language === 'am' && "font-ethiopic tracking-normal text-sm py-5 px-16"
              )}
            >
              {language === 'en' ? `Load More (${filteredProducts.length - visibleCount} remaining)` : 'ተጨማሪ ዕቃዎችን ይመልከቱ'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShopPageInner />
    </Suspense>
  )
}
