'use client'

import Link from 'next/link'
import ProductCard, { Product } from '@/components/product/ProductCard'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  products?: Product[]
  className?: string
  showViewAll?: boolean
}

const defaultProducts: Product[] = [
  {
    id: '1',
    slug: 'city-leather-boots',
    name: 'City Leather Boots',
    nameAm: 'የከተማ የቆዳ ጫማ',
    collection: 'Addis Edit',
    collectionAm: 'አዲስ እትም',
    price: 5400,
    originalPrice: 6200,
    image: '/cat-shoes.png',
    category: 'Shoes',
    categoryAm: 'ጫማዎች',
    label: 'Best Seller',
    labelAm: 'ተመራጭ',
    inStock: true
  },
  {
    id: '2',
    slug: 'minimalist-linen-shirt',
    name: 'Minimalist Linen Shirt',
    nameAm: 'ቀላል የጥጥ ሸሚዝ',
    collection: 'Spring 26',
    collectionAm: 'የፀደይ 26',
    price: 3200,
    image: '/cat-clothes.png',
    category: 'Clothes',
    categoryAm: 'ልብሶች',
    label: 'New Drop',
    labelAm: 'አዲስ',
    inStock: true
  },
  {
    id: '3',
    slug: 'heritage-tote-bag',
    name: 'Heritage Tote Bag',
    nameAm: 'የባህል ቶት ቦርሳ',
    collection: 'Accessories',
    collectionAm: 'መለዋወጫዎች',
    price: 4500,
    image: '/cat-accessories.png',
    category: 'Accessories',
    categoryAm: 'መለዋወጫዎች',
    label: 'Bundle',
    labelAm: 'ጥቅል',
    inStock: true
  },
]

export default function FeaturedProducts({
  title,
  subtitle,
  products = defaultProducts,
  className,
  showViewAll = true
}: FeaturedProductsProps) {
  const { language } = useLanguageStore()

  const displayTitle = title || (language === 'en' ? "Featured Pieces" : "የተመረጡ ዕቃዎች")
  const displaySubtitle = subtitle || (language === 'en' 
    ? "Hand-selected styles for your next occasion." 
    : "ለሚቀጥለው ዝግጅትዎ በጥንቃቄ የተመረጡ ስታይሎች።")

  return (
    <section className={cn("py-24 md:py-48 transition-colors duration-300 relative overflow-hidden", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="space-y-6">
            <h2 className={cn(
              "font-display text-5xl md:text-8xl text-text-primary tracking-tight font-bold leading-tight",
              language === 'am' && "font-ethiopic text-4xl md:text-7xl"
            )}>
              {displayTitle}
            </h2>
            <p className={cn(
              "text-lg md:text-2xl text-text-secondary font-body max-w-2xl leading-relaxed opacity-80",
              language === 'am' && "font-ethiopic"
            )}>
              {displaySubtitle}
            </p>
          </div>
          {showViewAll && (
            <Link 
              href="/shop" 
              className={cn(
                "text-[10px] font-bold tracking-[0.5em] uppercase text-text-primary hover:text-accent transition-all pb-3 border-b-2 border-border-primary hover:border-accent group flex items-center group shadow-sm",
                language === 'am' && "font-ethiopic tracking-normal text-xs pb-2"
              )}
            >
              {language === 'en' ? 'View Full Collection' : 'ሁሉንም ስብስቦች ይመልከቱ'}
              <span className="ml-3 transition-transform group-hover:translate-x-2 text-accent">→</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 md:gap-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/[0.03] rounded-full blur-[120px] pointer-events-none -mt-[25vw] -mr-[15vw]" />
    </section>
  )
}
