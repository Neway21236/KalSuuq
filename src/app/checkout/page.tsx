'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Check, ShieldCheck, MapPin } from 'lucide-react'
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
  const { items, getSubtotal } = useCartStore()
  const { toast } = useToast()
  const [step] = useState(1)
  const [deliveryZone, setDeliveryZone] = useState<'addis' | 'nationwide'>('addis')
  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'cod'>('chapa')
  const [showReferral, setShowReferral] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
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

  const deliveryFee = deliveryZone === 'addis' ? 250 : 600
  const codFee = paymentMethod === 'cod' ? 100 : 0
  const total = getSubtotal() + deliveryFee + codFee

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
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, slug: i.slug, size: i.size, colour: i.colour, quantity: i.quantity, unitPrice: i.unitPrice })),
          deliveryZone,
          paymentMethod,
          deliveryFee,
          total,
          customerName,
          customerPhone: `+251${customerPhone}`,
          customerEmail,
        })
      })
      const data = await res.json()
      if (data.success) {
        toast(language === 'en' ? `Order #${data.orderId} placed successfully!` : `ትዕዛዝ #${data.orderId} በተሳካ ሁኔታ ተቀብሏል!`, 'success')
        
        // Handle Chapa Redirect
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          // Normal success handling (e.g. clear cart, redirect to success page)
          // router.push(`/checkout/success?order=${data.orderId}`)
        }
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
            
            {/* Delivery Section */}
            <section className="space-y-10">
              <h2 className={cn(
                "font-display text-4xl md:text-5xl text-text-primary tracking-tight font-bold",
                language === 'am' && "font-ethiopic text-3xl"
              )}>
                {language === 'en' ? 'Delivery Details' : 'የአቅርቦት መረጃ'}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.3em] text-accent",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'Full Name' : 'ሙሉ ስም'}
                  </label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Abebe Kebede' : 'ምሳሌ፦ አበበ ከበደ'} 
                    className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200 text-base"
                  />
                </div>
                <div className="space-y-4">
                  <label className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.3em] text-accent",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
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
                      className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none pl-16 pr-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200 font-mono text-base"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                  <label className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.3em] text-accent",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'Email Address (Required for Chapa)' : 'ኢሜይል (ለቻፓ ክፍያ አስፈላጊ)'}
                  </label>
                  <input 
                    type="email" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. customer@example.com' : 'ምሳሌ፦ customer@example.com'} 
                    className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200 text-base"
                  />
              </div>

              {/* Risk #9 Fix: GDPR Marketing Consent */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-accent border-border-primary"
                />
                <span className={cn(
                  "text-sm text-text-secondary leading-relaxed",
                  language === 'am' && "font-ethiopic"
                )}>
                  {language === 'en' 
                    ? "I agree to receive promotional emails and new collection updates from Kalsuq. You can unsubscribe anytime." 
                    : "ከካልሱቅ የማስተዋወቂያ ኢሜይሎችን እና አዳዲስ ስብስቦችን ለመቀበል ተስማምቻለሁ። በማንኛውም ጊዜ ማቋረጥ ይችላሉ።"}
                </span>
              </label>

              <div className="space-y-6">
                <label className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.3em] text-accent",
                  language === 'am' && "font-ethiopic tracking-normal text-xs"
                )}>
                  {language === 'en' ? 'Delivery Zone' : 'የአቅርቦት ክልል'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setDeliveryZone('addis')}
                    className={cn(
                      "p-8 border text-left transition-all duration-500 shadow-sm hover:-translate-y-0.5",
                      deliveryZone === 'addis' ? "border-accent bg-accent/5 ring-1 ring-accent/40 shadow-accent/10" : "border-border-primary hover:border-accent/40 bg-surface-card"
                    )}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={cn(
                        "text-lg font-bold text-text-primary",
                        language === 'am' && "font-ethiopic"
                      )}>
                        {language === 'en' ? 'Addis Ababa' : 'አዲስ አበባ'}
                      </span>
                      {deliveryZone === 'addis' && <div className="bg-accent text-white dark:text-ink p-1.5 shadow-lg"><Check size={16} strokeWidth={3} /></div>}
                    </div>
                    <p className={cn(
                      "text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold opacity-70",
                      language === 'am' && "font-ethiopic tracking-normal"
                    )}>
                      {language === 'en' ? 'Fastest · Same Day' : 'ፈጣን · በዕለቱ'}
                    </p>
                    <p className="text-accent font-mono text-sm font-bold mt-3">ETB 250</p>
                  </button>
                  <button 
                    onClick={() => setDeliveryZone('nationwide')}
                    className={cn(
                      "p-8 border text-left transition-all duration-500 shadow-sm hover:-translate-y-0.5",
                      deliveryZone === 'nationwide' ? "border-accent bg-accent/5 ring-1 ring-accent/40 shadow-accent/10" : "border-border-primary hover:border-accent/40 bg-surface-card"
                    )}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={cn(
                        "text-lg font-bold text-text-primary",
                        language === 'am' && "font-ethiopic"
                      )}>
                        {language === 'en' ? 'Nationwide' : 'በመላው ኢትዮጵያ'}
                      </span>
                      {deliveryZone === 'nationwide' && <div className="bg-accent text-white dark:text-ink p-1.5 shadow-lg"><Check size={16} strokeWidth={3} /></div>}
                    </div>
                    <p className={cn(
                      "text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold opacity-70",
                      language === 'am' && "font-ethiopic tracking-normal"
                    )}>
                      {language === 'en' ? '3–5 Days · Regional' : '3–5 ቀናት · በየክልሉ'}
                    </p>
                    <p className="text-accent font-mono text-sm font-bold mt-3">ETB 600</p>
                  </button>
                </div>
              </div>

              {deliveryZone === 'addis' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-4">
                    <label className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.3em] text-accent",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Subcity' : 'ክፍለ ከተማ'}
                    </label>
                    <select className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200">
                      <option>Bole</option>
                      <option>Kirkos</option>
                      <option>Arada</option>
                      <option>Yeka</option>
                      <option>Lideta</option>
                      <option>Nifas Silk-Lafto</option>
                      <option>Kolfe Keranio</option>
                      <option>Gulele</option>
                      <option>Addis Ketema</option>
                      <option>Akaky Kaliti</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.3em] text-accent",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Street Address / Landmark' : 'የጎዳና አድራሻ / መለያ ቦታ'}
                    </label>
                    <textarea 
                      rows={2} 
                      placeholder={language === 'en' ? 'e.g. Near Edna Mall, Building X, Floor 2' : 'ምሳሌ፡ ከኤድና ሞል አጠገብ፣ ሕንፃ X፣ ፎቅ 2'} 
                      className="w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.3em] text-accent flex items-center space-x-2",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      <MapPin size={14} />
                      <span>{language === 'en' ? 'Pin Location (Optional)' : 'ቦታ ይምረጡ (አማራጭ)'}</span>
                    </label>
                    <div className="w-full h-[300px] border border-border-primary bg-surface-card shadow-inner">
                      <DeliveryMap onLocationSelect={(lat, lng) => console.log(lat, lng)} />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Payment Section */}
            <section className="space-y-10 pt-16 border-t border-border-primary">
              <h2 className={cn(
                "font-display text-4xl md:text-5xl text-text-primary tracking-tight font-bold",
                language === 'am' && "font-ethiopic text-3xl"
              )}>
                {language === 'en' ? 'Payment Method' : 'የክፍያ አማራጭ'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => setPaymentMethod('chapa')}
                  className={cn(
                    "p-8 border text-left transition-all duration-500 relative overflow-hidden group shadow-sm hover:-translate-y-0.5",
                    paymentMethod === 'chapa' ? "border-accent bg-accent/5 ring-1 ring-accent/40 shadow-accent/10" : "border-border-primary hover:border-accent/40 bg-surface-card"
                  )}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={cn(
                      "text-lg font-bold text-text-primary",
                      language === 'am' && "font-ethiopic"
                    )}>
                      {language === 'en' ? 'Digital Payment' : 'ዲጂታል ክፍያ'}
                    </span>
                    {paymentMethod === 'chapa' && <div className="bg-accent text-white dark:text-ink p-1.5 shadow-lg"><Check size={16} strokeWidth={3} /></div>}
                  </div>
                  <p className={cn(
                    "text-[10px] text-text-secondary uppercase tracking-[0.2em] mb-4 font-bold opacity-70",
                    language === 'am' && "font-ethiopic tracking-normal"
                  )}>
                    {language === 'en' ? 'Telebirr · CBEBirr · Card' : 'ቴሌብር · ሲቢኢ ብር · ካርድ'}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-16 bg-accent/10 rounded-sm border border-accent/20" />
                    <div className="h-6 w-12 bg-accent/10 rounded-sm border border-accent/20" />
                    <div className="h-6 w-14 bg-accent/10 rounded-sm border border-accent/20" />
                  </div>
                </button>
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    "p-8 border text-left transition-all duration-500 relative overflow-hidden group shadow-sm hover:-translate-y-0.5",
                    paymentMethod === 'cod' ? "border-accent bg-accent/5 ring-1 ring-accent/40 shadow-accent/10" : "border-border-primary hover:border-accent/40 bg-surface-card"
                  )}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={cn(
                      "text-lg font-bold text-text-primary",
                      language === 'am' && "font-ethiopic"
                    )}>
                      {language === 'en' ? 'Cash on Delivery' : 'እጅ በእጅ ክፍያ'}
                    </span>
                    {paymentMethod === 'cod' && <div className="bg-accent text-white dark:text-ink p-1.5 shadow-lg"><Check size={16} strokeWidth={3} /></div>}
                  </div>
                  <p className={cn(
                    "text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold opacity-70 leading-relaxed",
                    language === 'am' && "font-ethiopic tracking-normal"
                  )}>
                    {language === 'en' ? 'Addis Only · +100 ETB Fee' : 'አዲስ አበባ ብቻ · +100 ብር ክፍያ'}
                  </p>
                </button>
              </div>
            </section>

            {/* Referral Section */}
            <section className="pt-4">
              {!showReferral ? (
                <button 
                  onClick={() => setShowReferral(true)}
                  className={cn(
                    "text-[10px] font-bold text-accent uppercase tracking-[0.3em] hover:underline transition-all",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}
                >
                  {language === 'en' ? 'Have a referral code?' : 'የሪፈራል ኮድ አለዎት?'}
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-500 max-w-sm">
                  <label className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'Referral Code' : 'የሪፈራል ኮድ'}
                  </label>
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      placeholder={language === 'en' ? 'Enter code' : 'ኮድ ያስገቡ'} 
                      className="flex-1 bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200"
                    />
                    <button className={cn(
                      "bg-accent text-white dark:text-ink px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-accent-hover shadow-lg active:scale-95",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Apply' : 'ተግብር'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Order Summary Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-surface-card border border-border-primary p-10 md:p-12 space-y-12 shadow-2xl transition-all duration-500">
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
