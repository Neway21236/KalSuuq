'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check, ShieldCheck, MapPin, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useToast } from '@/components/ui/Toast'

const DeliveryMap = dynamic(() => import('@/components/checkout/DeliveryMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface-card animate-pulse flex items-center justify-center text-xs text-text-muted uppercase tracking-widest">Loading Map...</div>
})

export default function CheckoutPage() {
  const { language } = useLanguageStore()
  const { items, getSubtotal, referralCode } = useCartStore()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [deliveryZone, setDeliveryZone] = useState<'addis' | 'nationwide'>('addis')
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'cod'>('chapa')
  const [isProcessing, setIsProcessing] = useState(false)

  // Form State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [subcity, setSubcity] = useState('Bole')
  const [region, setRegion] = useState('')
  const [town, setTown] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)

  // Risk #10 Fix: Ghost Order Recovery
  // Check if the user returned from a Chapa payment with a pending order
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pendingOrder = params.get('order')
    if (pendingOrder) {
      fetch(`/api/orders/status?orderNumber=${pendingOrder}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order?.paymentStatus === 'PAID') {
            useCartStore.getState().clearCart()
            toast(language === 'en' ? `Order #${pendingOrder} was already paid! Cart cleared.` : `ትዕዛዝ #${pendingOrder} ተከፍሏል! ቅርጫት ተጠርጓል።`, 'success')
          }
        })
        .catch(() => {}) // Silently fail — non-critical
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const deliveryFee = deliveryZone === 'addis' ? (deliveryType === 'express' ? 450 : 250) : 600
  const codFee = paymentMethod === 'cod' ? 100 : 0
  const discount = referralCode ? getSubtotal() * 0.1 : 0
  const total = getSubtotal() + deliveryFee + codFee - discount

  const handlePlaceOrder = async () => {
    // Client-side Validation
    if (!customerName.trim() || !customerPhone.trim()) {
      toast(language === 'en' ? 'Please fill in your name and phone number.' : 'እባክዎ ስምዎን እና ስልክ ቁጥርዎን ያስገቡ።', 'error')
      return;
    }
    if (paymentMethod === 'chapa' && !customerEmail.trim()) {
      toast(language === 'en' ? 'Email is required for Chapa payments.' : 'ለቻፓ ክፍያ ኢሜይል ያስፈልጋል።', 'error')
      return;
    }

    setIsProcessing(true)
    try {
      const address = deliveryZone === 'addis' ? `${subcity}, ${addressLine}` : `${town}, ${region}`
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, slug: i.slug, size: i.size, colour: i.colour, quantity: i.quantity, unitPrice: i.unitPrice })),
          deliveryZone,
          deliveryType,
          paymentMethod,
          deliveryFee,
          total,
          customerName,
          customerPhone: `+251${customerPhone}`,
          customerEmail,
          address,
          referralCode,
        })
      })
      const data = await res.json()
      if (data.success) {
        toast(language === 'en' ? `Order #${data.orderId} placed successfully!` : `ትዕዛዝ #${data.orderId} በተሳካ ሁኔታ ተቀብሏል!`, 'success')
        
        // Handle COD WhatsApp Redirect - FR-CHK-08
        if (paymentMethod === 'cod') {
          const itemList = items.map(i => `- ${i.name} (${i.size}, ${i.colour}) x${i.quantity}`).join('%0A')
          const message = `Hello Kalsuq!%0A%0AI want to confirm my order%0A%0AOrder ID: ${data.orderId}%0AItems:%0A${itemList}%0ATotal: ETB ${total.toLocaleString()}%0ADelivery Address: ${address}%0A%0AThank you!`
          window.location.href = `https://wa.me/251911223344?text=${message}` // Placeholder number
          useCartStore.getState().clearCart()
          return
        }

        // Handle Chapa Redirect
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          // Success page redirect
          window.location.href = `/checkout/success?order=${data.orderId}`
        }
      } else {
        toast(data.error || 'Failed to place order', 'error')
      }
    } catch {
      toast(language === 'en' ? 'Something went wrong. Please try again.' : 'ስህተት ተፈጥሯል። እንደገና ይሞክሩ።', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-surface min-h-screen py-12 md:py-20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center md:justify-between mb-20 border-b border-border-primary pb-10">
          {[
            { id: 1, label: language === 'en' ? 'Delivery' : 'አቅርቦት' },
            { id: 2, label: language === 'en' ? 'Payment' : 'ክፍያ' },
            { id: 3, label: language === 'en' ? 'Review' : 'ክለሳ' }
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center space-x-4 md:space-x-6">
              <div className={cn(
                "w-12 h-12 flex items-center justify-center text-xs font-mono font-bold transition-all duration-500 shadow-lg",
                step >= s.id ? "bg-accent text-white dark:text-ink shadow-accent/20 scale-110" : "bg-surface-card border border-border-primary text-text-secondary opacity-50"
              )}>
                {step > s.id ? <Check size={20} strokeWidth={3} /> : `0${s.id}`}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 hidden sm:block",
                step === s.id ? "text-text-primary" : "text-text-secondary opacity-50",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                {s.label}
              </span>
              {idx < 2 && <ChevronRight size={18} className="text-border-primary opacity-30 hidden md:block" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Step 1: Contact & Delivery Details */}
            {step === 1 && (
              <section className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                <h2 className={cn(
                  "font-display text-4xl md:text-5xl text-text-primary tracking-tight font-bold",
                  language === 'am' && "font-ethiopic text-3xl"
                )}>
                  {language === 'en' ? '1. Contact & Delivery' : '1. አድራሻ እና አቅርቦት'}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                      {language === 'en' ? 'Full Name' : 'ሙሉ ስም'}
                    </label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Abebe Kebede" 
                      className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all text-base"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                      {language === 'en' ? 'Phone Number' : 'ስልክ ቁጥር'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-bold">+251</span>
                      <input 
                        type="tel" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        maxLength={9}
                        placeholder="911 000 000" 
                        className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none pl-16 pr-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all font-mono text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                    {language === 'en' ? 'Email Address' : 'ኢሜይል'}
                  </label>
                  <input 
                    type="email" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@example.com" 
                    className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all text-base"
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                    {language === 'en' ? 'Delivery Location' : 'የአቅርቦት ቦታ'}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setDeliveryZone('addis')} className={cn("py-4 border text-[10px] font-bold uppercase tracking-widest transition-all", deliveryZone === 'addis' ? "border-accent bg-accent/5 text-accent" : "border-border-primary text-text-secondary")}>Addis Ababa</button>
                    <button onClick={() => setDeliveryZone('nationwide')} className={cn("py-4 border text-[10px] font-bold uppercase tracking-widest transition-all", deliveryZone === 'nationwide' ? "border-accent bg-accent/5 text-accent" : "border-border-primary text-text-secondary")}>Nationwide</button>
                  </div>
                </div>

                {deliveryZone === 'addis' ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{language === 'en' ? 'Subcity' : 'ክፍለ ከተማ'}</label>
                      <select value={subcity} onChange={(e) => setSubcity(e.target.value)} className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:outline-none text-base">
                        {['Bole', 'Kirkos', 'Arada', 'Yeka', 'Lideta', 'Nifas Silk-Lafto', 'Kolfe Keranio', 'Gulele', 'Addis Ketema', 'Akaky Kaliti'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{language === 'en' ? 'Street Address / Landmark' : 'የጎዳና አድራሻ / መለያ ቦታ'}</label>
                      <textarea rows={2} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Near Edna Mall, Building X..." className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:outline-none resize-none" />
                    </div>
                    <div className="w-full h-[300px] border border-border-primary bg-surface-card shadow-inner overflow-hidden">
                      <DeliveryMap onLocationSelect={(lat, lng) => console.log(lat, lng)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{language === 'en' ? 'Region' : 'ክልል'}</label>
                      <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Oromia" className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:outline-none" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{language === 'en' ? 'Town / City' : 'ከተማ'}</label>
                      <input type="text" value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Jimma" className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:outline-none" />
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    if (!customerName || !customerPhone) return toast(language === 'en' ? 'Please fill required fields' : 'እባክዎ አስፈላጊ ቦታዎችን ይሙሉ', 'error')
                    setStep(2)
                  }}
                  className="w-full bg-ink text-white dark:bg-white dark:text-ink py-7 text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent hover:text-white"
                >
                  {language === 'en' ? 'Continue to Payment →' : 'ወደ ክፍያ ቀጥል →'}
                </button>
              </section>
            )}

            {/* Step 2: Delivery & Payment Selection */}
            {step === 2 && (
              <section className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-10">
                  <h2 className="font-display text-4xl text-text-primary tracking-tight font-bold">2. Delivery & Payment</h2>
                  
                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{language === 'en' ? 'Delivery Method' : 'የአቅርቦት ዘዴ'}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button onClick={() => setDeliveryType('standard')} className={cn("p-8 border text-left transition-all", deliveryType === 'standard' ? "border-accent bg-accent/5 ring-1 ring-accent/40" : "border-border-primary bg-surface-card")}>
                        <p className="font-bold text-text-primary mb-1">{language === 'en' ? 'Standard Delivery' : 'መደበኛ አቅርቦት'}</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">{deliveryZone === 'addis' ? 'Next Day' : '3-5 Days'}</p>
                        <p className="text-accent font-mono text-sm font-bold mt-4">ETB {deliveryZone === 'addis' ? 250 : 600}</p>
                      </button>
                      {deliveryZone === 'addis' && (
                        <button onClick={() => setDeliveryType('express')} className={cn("p-8 border text-left transition-all", deliveryType === 'express' ? "border-accent bg-accent/5 ring-1 ring-accent/40" : "border-border-primary bg-surface-card")}>
                          <p className="font-bold text-text-primary mb-1">{language === 'en' ? 'Express Delivery' : 'ፈጣን አቅርቦት'}</p>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest">Same Day (Under 4h)</p>
                          <p className="text-accent font-mono text-sm font-bold mt-4">ETB 450</p>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{language === 'en' ? 'Payment Method' : 'የክፍያ አማራጭ'}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button onClick={() => setPaymentMethod('chapa')} className={cn("p-8 border text-left transition-all", paymentMethod === 'chapa' ? "border-accent bg-accent/5 ring-1 ring-accent/40" : "border-border-primary bg-surface-card")}>
                        <p className="font-bold text-text-primary mb-1">Pay with Chapa</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">Telebirr, CBEBirr, Cards</p>
                      </button>
                      <button onClick={() => setPaymentMethod('cod')} className={cn("p-8 border text-left transition-all", paymentMethod === 'cod' ? "border-accent bg-accent/5 ring-1 ring-accent/40" : "border-border-primary bg-surface-card")}>
                        <p className="font-bold text-text-primary mb-1">Cash on Delivery</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">Addis Only · +100 ETB</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-7 border border-border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-surface-card">← Back</button>
                  <button onClick={() => setStep(3)} className="flex-[2] bg-ink text-white dark:bg-white dark:text-ink py-7 text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white">Review Order →</button>
                </div>
              </section>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <section className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
                <h2 className="font-display text-4xl text-text-primary tracking-tight font-bold">3. Review & Confirm</h2>
                
                <div className="bg-surface-card border border-border-primary p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Customer</p>
                      <p className="text-sm font-bold text-text-primary">{customerName}</p>
                      <p className="text-sm text-text-secondary">{customerPhone}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Delivery</p>
                      <p className="text-sm font-bold text-text-primary">{deliveryZone === 'addis' ? `${subcity}, ${addressLine}` : `${town}, ${region}`}</p>
                      <p className="text-[10px] text-accent uppercase font-bold">{deliveryType} delivery</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button onClick={() => setStep(2)} className="flex-1 py-7 border border-border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-surface-card">← Back</button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-[2] bg-accent text-white dark:text-ink py-7 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-accent-hover shadow-2xl active:scale-95 transition-all"
                  >
                    {isProcessing ? 'Processing...' : paymentMethod === 'chapa' ? 'Pay Now →' : 'Confirm via WhatsApp →'}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Order Summary Panel */}
          <div className="lg:col-span-5">
            {/* Mobile Summary Toggle - FR-CHK-10 */}
            <button 
              onClick={() => setShowSummaryMobile(!showSummaryMobile)}
              className="lg:hidden w-full bg-surface-card border border-border-primary p-6 mb-8 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <ShoppingBag size={20} className="text-accent" />
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{items.length}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{language === 'en' ? 'Show Order Summary' : 'የትዕዛዝ ዝርዝር አሳይ'}</span>
              </div>
              <ChevronRight size={20} className={cn("transition-transform duration-300", showSummaryMobile && "rotate-90")} />
            </button>

            <div className={cn(
              "sticky top-24 bg-surface-card border border-border-primary p-10 md:p-12 space-y-12 shadow-2xl transition-all duration-500 lg:block",
              !showSummaryMobile && "hidden lg:block"
            )}>
              <h3 className={cn(
                "font-display text-3xl text-text-primary border-b border-border-primary pb-8 tracking-tight font-bold",
                language === 'am' && "font-ethiopic"
              )}>
                {language === 'en' ? 'Order Summary' : 'የትዕዛዝ ማጠቃለያ'}
              </h3>
              
              <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {items.length > 0 ? items.map((item, idx) => (
                  <div key={idx} className="flex space-x-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="relative w-20 h-28 flex-shrink-0 bg-surface border border-border-primary shadow-md overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
                      <h4 className={cn(
                        "text-base font-bold text-text-primary truncate tracking-tight",
                        language === 'am' && "font-ethiopic"
                      )}>{item.name}</h4>
                      <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold bg-accent/5 w-fit px-2.5 py-1 border border-accent/10">
                        {item.size} · {item.colour} · {language === 'en' ? 'Qty' : 'ብዛት'} {item.quantity}
                      </p>
                      <span className="text-base font-mono font-bold text-text-primary">
                        ETB {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 space-y-6">
                    <p className={cn(
                      "text-sm text-text-secondary uppercase tracking-[0.3em] font-bold",
                      language === 'am' && "font-ethiopic tracking-normal"
                    )}>
                      {language === 'en' ? 'Your bag is empty.' : 'ቦርሳዎ ባዶ ነው።'}
                    </p>
                    <Link href="/shop" className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline">
                      {language === 'en' ? 'Browse Shop →' : 'ሱቅ ያስሱ →'}
                    </Link>
                  </div>
                )}
              </div>

              <div className="space-y-6 pt-10 border-t border-border-primary">
                <div className="flex justify-between text-[10px] text-text-secondary uppercase tracking-[0.3em] font-bold">
                  <span>{language === 'en' ? 'Subtotal' : 'ድምር'}</span>
                  <span className="font-mono text-base text-text-primary">ETB {getSubtotal().toLocaleString()}</span>
                </div>
                {referralCode && (
                  <div className="flex justify-between text-[10px] text-success uppercase tracking-[0.3em] font-bold">
                    <span>{language === 'en' ? 'Discount' : 'ቅናሽ'} ({referralCode})</span>
                    <span className="font-mono text-base">- ETB {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] text-text-secondary uppercase tracking-[0.3em] font-bold">
                  <span>{language === 'en' ? 'Delivery Fee' : 'የአቅርቦት ክፍያ'}</span>
                  <span className="font-mono text-base text-text-primary">ETB {deliveryFee.toLocaleString()}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
                    <span>{language === 'en' ? 'COD Processing' : 'እጅ በእጅ ክፍያ'}</span>
                    <span className="font-mono text-base">ETB 100</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-8 border-t border-border-primary">
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-[0.4em] text-text-primary",
                    language === 'am' && "font-ethiopic tracking-normal text-sm"
                  )}>
                    {language === 'en' ? 'Total' : 'ጠቅላላ'}
                  </span>
                  <span className="text-4xl font-mono font-bold text-accent tracking-tighter">
                    ETB {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                {step < 3 ? (
                  <button 
                    onClick={() => {
                      if (step === 1 && (!customerName || !customerPhone)) {
                        toast(language === 'en' ? 'Please fill required fields' : 'እባክዎ አስፈላጊ ቦታዎችን ይሙሉ', 'error')
                        return
                      }
                      setStep(step + 1)
                    }}
                    className="w-full py-7 text-[10px] font-bold uppercase tracking-[0.4em] bg-ink text-white dark:bg-white dark:text-ink hover:bg-accent hover:text-white transition-all shadow-2xl"
                  >
                    {language === 'en' ? 'Continue →' : 'ቀጥል →'}
                  </button>
                ) : (
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || items.length === 0}
                    className={cn(
                      "w-full py-7 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl active:scale-[0.98] bg-accent text-white dark:text-ink hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
                      language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
                    )}
                  >
                    {isProcessing 
                      ? (language === 'en' ? 'Processing...' : 'በማስኬድ ላይ...')
                      : paymentMethod === 'chapa' 
                        ? (language === 'en' ? "Complete Secure Payment →" : "በደህንነት ይክፈሉ →")
                        : (language === 'en' ? "Confirm via WhatsApp →" : "በዋትስአፕ ያረጋግጡ →")}
                  </button>
                )}
                
                <div className="flex items-center justify-center space-x-4 text-[10px] text-text-secondary uppercase tracking-[0.3em] font-bold opacity-60">
                  <ShieldCheck size={18} className="text-accent" />
                  <span>{language === 'en' ? 'Secure 256-bit SSL Encryption' : 'ደህንነቱ የተጠበቀ ክፍያ'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Order Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/80 backdrop-blur-xl border-t border-border-primary p-6 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-500">
        <div className="flex flex-col">
          <span className={cn(
            "text-[9px] font-bold text-text-secondary uppercase tracking-widest",
            language === 'am' && "font-ethiopic"
          )}>{language === 'en' ? 'Total Amount' : 'ጠቅላላ ክፍያ'}</span>
          <span className="text-2xl font-mono text-accent font-bold">ETB {(getSubtotal() + deliveryFee).toLocaleString()}</span>
        </div>
        <button 
          onClick={handlePlaceOrder}
          disabled={isProcessing || items.length === 0}
          className={cn(
            "bg-accent text-white dark:text-ink px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl active:scale-95 disabled:opacity-50 transition-all",
            language === 'am' && "font-ethiopic text-xs"
          )}
        >
          {isProcessing ? (language === 'en' ? 'Processing...' : 'በማስኬድ ላይ...') : (language === 'en' ? 'Place Order' : 'ትዕዛዝ ይፈጽሙ')}
        </button>
      </div>
    </div>
  )
}
