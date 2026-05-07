'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, Minus, Plus, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCartStore } from '@/store/useCartStore'
import { useToast } from '@/components/ui/Toast'
import { Product } from '@/components/product/ProductCard'

interface ProductDetail extends Product {
  description: string
  descriptionAm: string
  sizes: string[]
  colours: { name: string; nameAm?: string; hex: string }[]
  images: string[]
  inStock: boolean
}

export default function ProductDetailsPage() {
  const params = useParams()
  const { language } = useLanguageStore()
  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()
  
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColour, setSelectedColour] = useState<{ name: string; nameAm?: string; hex: string } | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.product)
          setMainImage(data.product.image)
          if (data.product.colours && data.product.colours.length > 0) {
            setSelectedColour(data.product.colours[0])
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err)
      } finally {
        setLoading(false)
      }
    }
    if (params.slug) fetchProduct()
  }, [params.slug])

  const handleAddToBag = () => {
    if (!product) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: language === 'en' ? product.name : (product.nameAm || product.name),
      unitPrice: product.price,
      quantity: quantity,
      image: mainImage,
      size: selectedSize || (product.sizes ? product.sizes[0] : 'One Size'),
      colour: selectedColour ? (language === 'en' ? selectedColour.name : (selectedColour.nameAm || selectedColour.name)) : 'Default'
    })
    toast(language === 'en' ? `Added ${product.name} to bag` : `${product.name} ወደ ቅርጫት ገብቷል`, 'success')
    openCart()
  }

  if (loading) {
    return (
      <div className="bg-surface min-h-screen py-20 flex items-center justify-center">
        <div className="text-accent animate-pulse tracking-[0.5em] uppercase text-xs font-bold">Loading Product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-surface min-h-screen py-20 flex flex-col items-center justify-center space-y-8">
        <h1 className="font-display text-4xl text-text-primary">Product Not Found</h1>
        <Link href="/shop" className="text-accent uppercase tracking-widest text-xs font-bold border-b border-accent pb-1">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": [
              `https://kalsuq.com${product.image}`,
              ...product.images.map(img => `https://kalsuq.com${img}`)
            ],
            "description": product.description,
            "sku": product.id,
            "brand": {
              "@type": "Brand",
              "name": "Kalsuq"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://kalsuq.com/shop/${product.slug}`,
              "priceCurrency": "ETB",
              "price": product.price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Kalsuq"
              }
            }
          })
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Breadcrumb */}
        <nav className={cn(
          "flex items-center space-x-2 text-[10px] uppercase tracking-widest text-text-muted mb-8",
          language === 'am' && "font-ethiopic tracking-normal text-[11px]"
        )}>
          <Link href="/shop" className="hover:text-accent">{language === 'en' ? 'Shop' : 'ሱቅ'}</Link>
          <ChevronRight size={10} />
          <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-accent">
            {language === 'en' ? product.category : product.categoryAm}
          </Link>
          <ChevronRight size={10} />
          <span className="text-text-primary font-bold">{language === 'en' ? product.name : product.nameAm}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden bg-surface-card border border-border-primary shadow-inner group">
              <Image 
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover cursor-zoom-in transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
              {[product.image, '/hero.png', product.image].map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "relative w-20 h-24 flex-shrink-0 border transition-all duration-300",
                    mainImage === img ? "border-accent ring-2 ring-accent/20" : "border-border-primary hover:border-accent/40"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className={cn(
                "text-[10px] tracking-[0.5em] text-accent uppercase font-bold",
                language === 'am' && "font-ethiopic tracking-normal"
              )}>
                {language === 'en' ? product.category : product.categoryAm} · {language === 'en' ? product.collection : product.collectionAm}
              </span>
              <h1 className={cn(
                "font-display text-5xl md:text-7xl text-text-primary leading-tight tracking-tight font-bold",
                language === 'am' && "font-ethiopic text-4xl md:text-6xl"
              )}>
                {language === 'en' ? product.name : product.nameAm}
              </h1>
              
              <div className="flex items-center space-x-5 pt-3">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={cn("fill-accent text-accent", i === 4 && "fill-accent/20 text-accent/20")} />
                  ))}
                </div>
                <span className={cn(
                  "text-[10px] uppercase tracking-widest text-text-muted font-bold",
                  language === 'am' && "font-ethiopic tracking-normal"
                )}>
                  4.8 · 24 {language === 'en' ? 'reviews' : 'አስተያየቶች'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-6">
              <span className="font-mono text-5xl text-accent font-bold">
                ETB {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-mono text-xl text-text-muted line-through opacity-60">
                  ETB {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className={cn(
              "text-lg text-text-secondary leading-relaxed font-body border-b border-border-primary pb-12 max-w-lg",
              language === 'am' && "font-ethiopic"
            )}>
              {language === 'en' ? product.description : product.descriptionAm}
            </p>

            {/* Selectors */}
            <div className="space-y-12">
              {/* Size Selector */}
              {product.sizes && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>{language === 'en' ? 'Select Size' : 'ልክ ይምረጡ'}</label>
                    <button className={cn(
                      "text-[9px] text-accent uppercase font-bold tracking-[0.3em] hover:underline",
                      language === 'am' && "font-ethiopic tracking-normal"
                    )}>{language === 'en' ? 'Size Guide →' : 'የልክ መመሪያ →'}</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-16 h-16 flex items-center justify-center text-sm font-mono border transition-all duration-500",
                          selectedSize === size 
                            ? "bg-accent text-white border-accent shadow-xl shadow-accent/20 scale-110" 
                            : "border-border-primary hover:border-accent text-text-primary bg-surface-card"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour Selector */}
              {product.colours && (
                <div className="space-y-6">
                  <label className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'Colour:' : 'ቀለም፡'} <span className="text-accent ml-2 font-bold">{selectedColour ? (language === 'en' ? selectedColour.name : (selectedColour.nameAm || selectedColour.name)) : ''}</span>
                  </label>
                  <div className="flex space-x-5">
                  {product.colours.map((c: { name: string; nameAm?: string; hex: string }) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColour(c)}
                        className={cn(
                          "w-12 h-12 rounded-full border transition-all duration-500 p-1.5",
                          selectedColour?.name === c.name ? "border-accent ring-4 ring-accent/10 scale-110" : "border-border-primary"
                        )}
                      >
                        <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-6">
                <label className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary",
                  language === 'am' && "font-ethiopic tracking-normal text-xs"
                )}>{language === 'en' ? 'Quantity' : 'ብዛት'}</label>
                <div className="flex items-center border border-border-primary w-fit bg-surface-card shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center text-text-primary hover:bg-accent/5 transition-colors border-r border-border-primary"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 h-14 flex items-center justify-center font-mono text-lg font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center text-text-primary hover:bg-accent/5 transition-colors border-l border-border-primary"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <button 
                  onClick={() => {
                    handleAddToBag()
                    window.location.href = '/checkout'
                  }}
                  className={cn(
                    "flex-1 bg-accent text-white dark:text-ink py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-95",
                    language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
                  )}
                >
                  {language === 'en' ? 'Buy Now' : 'አሁን ይግዙ'}
                </button>
                <button 
                  onClick={handleAddToBag}
                  className={cn(
                    "flex-1 border border-border-primary bg-surface-card text-text-primary py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:border-accent hover:text-accent shadow-2xl active:scale-95",
                    language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
                  )}
                >
                  {language === 'en' ? 'Add to Bag' : 'ወደ ቅርጫት'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Accordions */}
        <div className="mt-40 max-w-4xl">
          <div className="space-y-0 border-t border-border-primary shadow-2xl">
            {(language === 'en' 
              ? ['Delivery Information', 'Size & Fit', 'Returns & Exchanges'] 
              : ['የአቅርቦት መረጃ', 'ልክ እና አቀማመጥ', 'መለዋወጥ እና መመለስ']).map((item) => (
              <div key={item} className="border-b border-border-primary bg-surface-card hover:bg-accent/5 transition-colors">
                <button className="w-full py-10 px-8 flex justify-between items-center text-left group transition-all">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.4em] text-text-primary group-hover:text-accent transition-colors",
                    language === 'am' && "font-ethiopic tracking-normal text-sm"
                  )}>
                    {item}
                  </span>
                  <Plus size={20} className="text-accent transition-transform group-hover:rotate-90" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FeaturedProducts 
        title={language === 'en' ? "Complete the Look" : "ስብስቡን ያጠናቅቁ"} 
        subtitle={language === 'en' ? "Styled perfectly with this item." : "ከዚህ ዕቃ ጋር በጥንቃቄ የተቀናጀ።"}
        className="bg-surface-card border-t border-border-primary mt-48"
        showViewAll={false}
      />

      {/* Sticky Mobile Add to Bag Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/80 backdrop-blur-xl border-t border-border-primary p-6 flex items-center gap-8 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] transition-colors duration-300">
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "text-[10px] font-bold text-text-primary truncate uppercase tracking-tight",
            language === 'am' && "font-ethiopic"
          )}>{language === 'en' ? product.name : product.nameAm}</h4>
          <span className="text-lg font-mono text-accent font-bold">ETB {product.price.toLocaleString()}</span>
        </div>
        <button 
          onClick={handleAddToBag}
          className={cn(
            "bg-accent text-white dark:text-ink px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all",
            language === 'am' && "font-ethiopic text-xs"
          )}
        >
          {language === 'en' ? 'Add to Bag' : 'ወደ ቅርጫት'}
        </button>
      </div>
    </div>
  )
}
