'use client'

import { useEffect, useState } from 'react'
import ShopFilters from '@/components/shop/ShopFilters'
import ProductCard, { Product } from '@/components/product/ProductCard'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function ShopPage() {
  const { language } = useLanguageStore()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activePrice, setActivePrice] = useState<string | null>(null)
  const [activeSort, setActiveSort] = useState('Newest')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
          setFilteredProducts(data.products)
        }
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]

    // Filter by Category
    if (activeCategory !== 'All' && activeCategory !== 'ሁሉም') {
      result = result.filter(p => p.category === activeCategory || p.categoryAm === activeCategory)
    }

    // Filter by Price
    if (activePrice) {
      if (activePrice.includes('3,000') && activePrice.includes('Under')) {
        result = result.filter(p => p.price < 3000)
      } else if (activePrice.includes('3,000') && activePrice.includes('6,000')) {
        result = result.filter(p => p.price >= 3000 && p.price <= 6000)
      } else if (activePrice.includes('Over 6,000')) {
        result = result.filter(p => p.price > 6000)
      }
    }

    // Sort
    if (activeSort.includes('Price: Low to High') || activeSort.includes('ከዝቅተኛ')) {
      result.sort((a, b) => a.price - b.price)
    } else if (activeSort.includes('Price: High to Low') || activeSort.includes('ከከፍተኛ')) {
      result.sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(result)
  }, [activeCategory, activePrice, activeSort, products])

  return (
    <div className="bg-surface min-h-screen pb-32 transition-colors duration-300">
      {/* Hero Strip */}
      <header className="bg-surface border-b border-border-primary py-24 md:py-48 text-center relative overflow-hidden">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-rgb),0.05)_0%,transparent_70%)] pointer-events-none" />
      </header>

      {/* Filters */}
      <ShopFilters 
        onCategoryChange={setActiveCategory}
        onPriceChange={setActivePrice}
        onSortChange={setActiveSort}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        {/* Category Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-32">
          {[
            { name: 'Shoes', nameAm: 'ጫማዎች', sub: 'The Foundation', subAm: 'መሠረቱ', img: '/cat-shoes.png' },
            { name: 'Clothes', nameAm: 'ልብሶች', sub: 'Editorial Fit', subAm: 'ምርጥ ልብስ', img: '/cat-clothes.png' },
            { name: 'Accessories', nameAm: 'መለዋወጫዎች', sub: 'The Accents', subAm: 'ማሟያዎች', img: '/cat-accessories.png' }
          ].map((banner) => (
            <Link 
              key={banner.name}
              href={`/shop?category=${banner.name.toLowerCase()}`}
              className="group relative aspect-[16/10] overflow-hidden bg-surface-card border border-border-primary shadow-sm hover:shadow-2xl transition-all duration-700"
            >
              <Image 
                src={banner.img}
                alt={banner.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className={cn(
                  "font-display text-4xl text-text-primary mb-2 tracking-tight font-bold group-hover:text-accent transition-colors",
                  language === 'am' && "font-ethiopic text-3xl"
                )}>
                  {language === 'en' ? banner.name : banner.nameAm}
                </h3>
                <span className={cn(
                  "text-[10px] tracking-[0.4em] text-accent uppercase font-bold",
                  language === 'am' && "font-ethiopic tracking-normal text-xs"
                )}>
                  {language === 'en' ? banner.sub : banner.subAm}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Product Grid Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10 border-b border-border-primary pb-10">
          <div className="space-y-4">
            <h2 className={cn(
              "text-[10px] uppercase tracking-[0.6em] text-accent font-bold",
              language === 'am' && "font-ethiopic tracking-normal text-xs"
            )}>
              {language === 'en' ? 'Available Pieces' : 'የሚገኙ ዕቃዎች'}
            </h2>
            <p className={cn(
              "text-5xl md:text-7xl font-display text-text-primary tracking-tight font-bold",
              language === 'am' && "font-ethiopic text-4xl md:text-6xl"
            )}>
              {language === 'en' ? 'Curated Selection' : 'የተመረጡ ስብስቦች'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-bold">
              {language === 'en' ? `Showing ${filteredProducts.length} products` : `${filteredProducts.length} ዕቃዎችን በማሳየት ላይ`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-24">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[3/4] bg-surface-card animate-pulse border border-border-primary" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-12 md:gap-y-24">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <p className={cn(
              "text-4xl font-display text-text-primary font-bold",
              language === 'am' && "font-ethiopic"
            )}>
              {language === 'en' ? 'No items match your filters' : 'ከምርጫዎ ጋር የሚዛመድ ዕቃ አልተገኘም'}
            </p>
            <button 
              onClick={() => {
                setActiveCategory('All')
                setActivePrice(null)
              }}
              className="text-accent uppercase tracking-widest text-[10px] font-bold border-b border-accent pb-1"
            >
              {language === 'en' ? 'Clear All Filters' : 'ሁሉንም ማጣሪያዎች አጽዳ'}
            </button>
          </div>
        )}

        {/* Load More */}
        <div className="mt-40 text-center">
          <button className={cn(
            "border border-border-primary bg-surface-card text-text-primary px-24 py-7 text-[10px] font-bold tracking-[0.5em] uppercase transition-all hover:bg-accent hover:text-white dark:hover:text-ink hover:border-accent shadow-2xl active:scale-95",
            language === 'am' && "font-ethiopic tracking-normal text-sm py-5 px-16"
          )}>
            {language === 'en' ? 'Load More Pieces' : 'ተጨማሪ ዕቃዎችን ይመልከቱ'}
          </button>
        </div>
      </div>
    </div>
  )
}
