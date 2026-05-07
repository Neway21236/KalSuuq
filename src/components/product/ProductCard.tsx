'use client'

import CloudImage from '@/components/ui/CloudImage'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCartStore } from '@/store/useCartStore'

export interface Product {
  id: string
  slug: string
  name: string
  nameAm?: string
  collection: string
  collectionAm?: string
  price: number
  originalPrice?: number
  image: string
  category: string
  categoryAm?: string
  label?: 'Best Seller' | 'New Drop' | 'Bundle'
  labelAm?: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { language } = useLanguageStore()
  const { addItem, openCart } = useCartStore()

  return (
    <Link 
      href={`/shop/${product.slug}`}
      className={cn(
        "group block bg-surface-card border border-border-primary rounded-none overflow-hidden transition-all duration-700 hover:border-accent/40 shadow-sm hover:shadow-2xl",
        !product.inStock && "opacity-80",
        className
      )}
    >
      {/* Image Area */}
      <div className="aspect-[3/4] overflow-hidden relative">
        <CloudImage 
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-1000 group-hover:scale-105",
            !product.inStock && "grayscale"
          )}
        />
        
        {/* Badges */}
        <div className="absolute top-5 left-5">
          <span className={cn(
            "text-[9px] bg-ink/80 text-text-primary px-3 py-1.5 uppercase tracking-widest font-bold backdrop-blur-sm border border-white/10",
            language === 'am' && "font-ethiopic tracking-normal text-[10px] py-1"
          )}>
            {language === 'en' ? product.category : (product.categoryAm || product.category)}
          </span>
        </div>

        {(product.label || product.labelAm) && (
          <div className="absolute top-5 right-5">
            <span className={cn(
              "bg-accent text-white dark:text-ink text-[10px] font-bold px-3 py-1.5 font-mono uppercase shadow-xl",
              language === 'am' && "font-ethiopic tracking-normal py-1"
            )}>
              {language === 'en' ? product.label : (product.labelAm || product.label)}
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className={cn(
              "bg-ink/80 text-text-primary text-xs font-bold px-6 py-3 uppercase tracking-[0.2em] border border-border-primary",
              language === 'am' && "font-ethiopic tracking-normal"
            )}>
              {language === 'en' ? 'Out of Stock' : 'ያለቀ'}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-8 space-y-4">
        <div className="space-y-1">
          <span className={cn(
            "text-[9px] md:text-[10px] tracking-[0.4em] text-accent uppercase block font-bold",
            language === 'am' && "font-ethiopic tracking-normal"
          )}>
            {language === 'en' ? product.collection : (product.collectionAm || product.collection)}
          </span>
          <h3 className={cn(
            "font-display text-xl md:text-2xl text-text-primary group-hover:text-accent transition-colors duration-500 tracking-tight font-bold",
            language === 'am' && "font-ethiopic text-lg md:text-xl"
          )}>
            {language === 'en' ? product.name : (product.nameAm || product.name)}
          </h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="font-mono text-lg md:text-xl text-text-primary font-bold">
            ETB {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-mono text-xs md:text-sm text-text-secondary line-through opacity-60">
              ETB {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={(e) => {
              e.preventDefault()
              addItem({
                productId: product.id,
                slug: product.slug,
                name: language === 'en' ? product.name : (product.nameAm || product.name),
                unitPrice: product.price,
                quantity: 1,
                image: product.image,
                size: 'One Size',
                colour: 'Default'
              })
              openCart()
            }}
            className={cn(
              "flex-1 bg-accent text-white dark:text-ink py-3 text-[9px] font-bold tracking-[0.2em] uppercase transition-all hover:bg-accent-hover active:scale-95 shadow-lg",
              language === 'am' && "font-ethiopic tracking-normal text-[10px]"
            )}
          >
            {language === 'en' ? 'Add to Bag' : 'ወደ ቅርጫት'}
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              addItem({
                productId: product.id,
                slug: product.slug,
                name: language === 'en' ? product.name : (product.nameAm || product.name),
                unitPrice: product.price,
                quantity: 1,
                image: product.image,
                size: 'One Size',
                colour: 'Default'
              })
              window.location.href = '/checkout'
            }}
            className={cn(
              "flex-1 border border-border-primary bg-surface text-text-primary py-3 text-[9px] font-bold tracking-[0.2em] uppercase transition-all hover:border-accent hover:text-accent active:scale-95",
              language === 'am' && "font-ethiopic tracking-normal text-[10px]"
            )}
          >
            {language === 'en' ? 'Buy Now' : 'አሁን ይግዙ'}
          </button>
        </div>

        <div className="pt-2 hidden md:block">
          <span className={cn(
            "text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-text-primary border-b-2 border-border-primary group-hover:border-accent group-hover:text-accent transition-all pb-1.5 inline-block",
            language === 'am' && "font-ethiopic tracking-normal text-[10px] md:text-xs pb-1"
          )}>
            {language === 'en' ? 'View Details' : 'ዝርዝር ይመልከቱ'} <span className="ml-1 transition-transform group-hover:translate-x-1 inline-block">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
