'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingBag, Minus, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'
import { useHasHydrated } from '@/hooks/useHasHydrated'

export default function CartDrawer() {
  const hydrated = useHasHydrated()
  const { language } = useLanguageStore()
  const { 
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem, 
    getSubtotal,
    referralCode 
  } = useCartStore()
  const [upsellProducts, setUpsellProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchUpsell = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (data.success) {
          // Get 3 random products that are NOT in the cart
          const inCartIds = items.map(i => i.productId)
          const available = data.products.filter((p: any) => !inCartIds.includes(p.id))
          setUpsellProducts(available.slice(0, 3))
        }
      } catch (err) {
        console.error("Upsell fetch failed", err)
      }
    }
    if (isOpen) fetchUpsell()
  }, [isOpen, items])

  const discount = referralCode ? getSubtotal() * 0.1 : 0 // 10% discount for referral codes for now
  const finalTotal = getSubtotal() - discount

  // Risk #4 Fix: Don't render cart contents until client-side hydration is complete
  if (!hydrated) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-surface z-[110] flex flex-col border-l border-border-primary shadow-2xl transition-colors duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 md:p-12 border-b border-border-primary bg-surface shadow-sm">
              <div className="flex items-center space-x-6">
                <h2 className={cn(
                  "font-display text-4xl text-text-primary tracking-tight font-bold",
                  language === 'am' && "font-ethiopic"
                )}>
                  {language === 'en' ? 'Your Bag' : 'የእርስዎ ቦርሳ'}
                </h2>
                <span className="bg-accent text-white dark:text-ink text-[10px] font-bold px-4 py-1.5 shadow-xl uppercase tracking-[0.2em]">
                  {items.length} {language === 'en' ? 'Items' : 'ዕቃዎች'}
                </span>
              </div>
              <button onClick={closeCart} className="text-text-secondary hover:text-accent transition-all p-2 active:scale-75 hover:bg-accent/5">
                <X size={32} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 no-scrollbar bg-surface/50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
                  <div className="w-40 h-40 bg-surface-card border border-border-primary flex items-center justify-center text-accent/20 shadow-2xl relative overflow-hidden group">
                    <ShoppingBag size={72} strokeWidth={0.5} className="transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent pointer-events-none" />
                  </div>
                  <div className="space-y-6">
                    <p className={cn(
                      "text-text-primary font-display text-4xl font-bold tracking-tight",
                      language === 'am' && "font-ethiopic"
                    )}>
                      {language === 'en' ? 'Your bag is empty' : 'ቦርሳዎ ባዶ ነው'}
                    </p>
                    <p className={cn(
                      "text-lg text-text-secondary max-w-[320px] leading-relaxed mx-auto font-medium opacity-80",
                      language === 'am' && "font-ethiopic"
                    )}>
                      {language === 'en' 
                        ? 'Discover our latest collection and find something special for your wardrobe.' 
                        : 'የቅርብ ጊዜ ስብስቦቻችንን ያስሱ እና ለቁም ሳጥንዎ ልዩ የሆነ ነገር ያግኙ።'}
                    </p>
                  </div>
                  <Link 
                    href="/shop" 
                    onClick={closeCart}
                    className={cn(
                      "bg-accent text-white dark:text-ink px-20 py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-95",
                      language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
                    )}
                  >
                    {language === 'en' ? 'Explore Collection' : 'ስብስቡን ያስሱ'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-10">
                  {items.map((item, index) => (
                    <motion.div 
                      key={`${item.productId}-${item.size}-${item.colour}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex space-x-10 group"
                    >
                      <div className="relative w-32 h-44 bg-surface-card overflow-hidden flex-shrink-0 border border-border-primary shadow-xl">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className={cn(
                              "text-xl text-text-primary font-bold tracking-tight leading-tight group-hover:text-accent transition-colors",
                              language === 'am' && "font-ethiopic"
                            )}>{item.name}</h3>
                            <button 
                              onClick={() => removeItem(item.productId, item.size, item.colour)}
                              className="text-text-secondary hover:text-error transition-all p-2 hover:bg-error/10 active:scale-75"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-bold px-3 py-1 border border-accent/20 bg-accent/5 shadow-sm">
                              {item.size}
                            </span>
                            <span className="text-[10px] text-text-secondary uppercase tracking-[0.4em] font-bold">
                              {item.colour}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center border border-border-primary h-14 bg-surface-card shadow-lg">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.size, item.colour, item.quantity - 1)}
                              className="px-5 text-text-secondary hover:text-accent transition-all active:scale-75"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="px-8 text-base font-mono font-bold text-text-primary border-x border-border-primary h-full flex items-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.size, item.colour, item.quantity + 1)}
                              className="px-5 text-text-secondary hover:text-accent transition-all active:scale-75"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          <span className="text-text-primary font-mono text-2xl font-bold tracking-tighter">
                            ETB {(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

              {/* Upsell Row - FR-CART-05 */}
              {items.length > 0 && upsellProducts.length > 0 && (
                <div className="pt-12 border-t border-border-primary/50 mt-12">
                  <h4 className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-8",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'You may also like' : 'እነዚህንም ሊወዱ ይችላሉ'}
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    {upsellProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/shop/${product.slug}`}
                        onClick={closeCart}
                        className="group space-y-4"
                      >
                        <div className="relative aspect-[3/4] bg-surface-card border border-border-primary overflow-hidden shadow-lg transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-accent/10">
                          <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="space-y-1">
                          <h5 className={cn(
                            "text-[10px] font-bold text-text-primary truncate",
                            language === 'am' && "font-ethiopic"
                          )}>{product.name}</h5>
                          <p className="text-[10px] font-mono font-bold text-accent">ETB {product.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-12 border-t border-border-primary space-y-10 bg-surface-card/50 backdrop-blur-2xl shadow-[0_-30px_60px_rgba(0,0,0,0.1)]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-[10px] text-text-secondary uppercase tracking-[0.6em] font-bold",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Subtotal' : 'ድምር'}
                    </span>
                    <span className="text-xl text-text-primary font-mono font-bold">
                      ETB {getSubtotal().toLocaleString()}
                    </span>
                  </div>

                  {referralCode && (
                    <div className="flex justify-between items-center text-success animate-in slide-in-from-right-2 duration-500">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className={cn(
                          "text-[10px] uppercase tracking-[0.4em] font-bold",
                          language === 'am' && "font-ethiopic tracking-normal text-xs"
                        )}>
                          {language === 'en' ? 'Discount' : 'ቅናሽ'} ({referralCode})
                        </span>
                      </div>
                      <span className="text-xl font-mono font-bold">
                        - ETB {discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-border-primary/50">
                    <span className={cn(
                      "text-[10px] text-text-primary uppercase tracking-[0.6em] font-bold",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Total' : 'ጠቅላላ'}
                    </span>
                    <span className="text-4xl text-text-primary font-display font-bold tracking-tighter">
                      ETB {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className={cn(
                      "block w-full bg-accent text-white dark:text-ink text-center py-7 text-[10px] font-bold tracking-[0.5em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-[0.98]",
                      language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
                    )}
                  >
                    {language === 'en' ? 'Continue to Checkout' : 'ወደ ክፍያ ይቀጥሉ'}
                  </Link>
                  <button
                    onClick={closeCart}
                    className={cn(
                      "block w-full text-center text-[10px] text-text-secondary hover:text-accent transition-all py-4 uppercase tracking-[0.4em] font-bold active:scale-95",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}
                  >
                    {language === 'en' ? 'Return to Shopping' : 'ግዢ ይቀጥሉ'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
