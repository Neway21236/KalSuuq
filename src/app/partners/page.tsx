'use client'

import { useState } from 'react'
import { TrendingUp, Users, Wallet, Check } from 'lucide-react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export default function PartnersPage() {
  const { language } = useLanguageStore()
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const commissionModels = [
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Performance Based' : 'በውጤት ላይ የተመሠረተ',
      desc: language === 'en' 
        ? 'Earn a percentage on every sale generated through your unique link or code.'
        : 'በእርስዎ ልዩ ሊንክ ወይም ኮድ አማካኝነት በሚደረግ እያንዳንዱ ሽያጭ ላይ ኮሚሽን ያግኙ።'
    },
    {
      icon: Users,
      title: language === 'en' ? 'Community First' : 'ለማኅበረሰቡ ቅድሚያ',
      desc: language === 'en'
        ? 'Access exclusive events and early releases to share with your audience.'
        : 'ልዩ ኩነቶችን እና አዳዲስ ምርቶችን ቀድመው ያግኙ እና ለተከታዮችዎ ያጋሩ።'
    },
    {
      icon: Wallet,
      title: language === 'en' ? 'Fast Payouts' : 'ፈጣን ክፍያ',
      desc: language === 'en'
        ? 'Receive your earnings monthly, directly to your preferred Ethiopian bank account.'
        : 'የሚያገኙትን ገቢ በየወሩ በቀጥታ በመረጡት የኢትዮጵያ ባንክ ሒሳብ ይቀበሉ።'
    }
  ]

  const benefits = language === 'en' ? [
    'Unique referral code & link',
    'Real-time tracking dashboard',
    'High-resolution brand assets',
    'Priority support channel',
    'Monthly performance reports',
    'Tiered commission bonuses'
  ] : [
    'ልዩ የሪፈራል ኮድ እና ሊንክ',
    'ቀጥታ የክትትል ዳሽቦርድ',
    'ጥራት ያላቸው የምርት ምስሎች',
    'ቅድሚያ የሚሰጠው የድጋፍ መስመር',
    'የወርሃዊ የሥራ አፈጻጸም ሪፖርት',
    'ተጨማሪ የኮሚሽን ቦነሶች'
  ]

  const inputClasses = "w-full bg-surface-card border border-border-primary text-text-primary rounded-none px-5 py-4 focus:border-accent focus:ring-0 focus:outline-none transition-all duration-200 text-base"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          platform: formData.get('platform'),
          audienceSize: formData.get('audienceSize'),
          promotionPlan: formData.get('promotionPlan'),
        })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        toast(language === 'en' ? 'Application submitted successfully!' : 'ማመልከቻዎ በተሳካ ሁኔታ ገብቷል!', 'success')
      }
    } catch {
      toast(language === 'en' ? 'Something went wrong. Please try again.' : 'ስህተት ተፈጥሯል። እንደገና ይሞክሩ።', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-surface transition-colors duration-300">
      {/* Hero */}
      <section className="bg-surface border-b border-border-primary py-24 md:py-48 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center relative z-10">
          <span className={cn(
            "text-[10px] md:text-xs tracking-[0.5em] text-accent uppercase font-bold mb-8 block",
            language === 'am' && "font-ethiopic tracking-normal"
          )}>
            {language === 'en' ? 'Partner Program' : 'የአጋርነት ፕሮግራም'}
          </span>
          <h1 className={cn(
            "font-display text-5xl md:text-8xl text-text-primary leading-[1.1] mb-10 tracking-tight font-bold",
            language === 'am' && "font-ethiopic text-4xl md:text-7xl"
          )}>
            {language === 'en' ? 'Sell Kalsuq.' : 'በቃልሱቅ ይሽጡ።'} <br /> <span className="text-accent">{language === 'en' ? 'Earn Monthly.' : 'በየወሩ ያግኙ።'}</span>
          </h1>
          <p className={cn(
            "font-body text-text-secondary text-lg md:text-2xl leading-relaxed mb-14 max-w-3xl mx-auto",
            language === 'am' && "font-ethiopic"
          )}>
            {language === 'en' 
              ? 'Monetize your influence and help grow the modern Ethiopian fashion ecosystem. Join our network of successful partners today.'
              : 'ተፅዕኖዎን ወደ ገቢ ይለውጡ እና ዘመናዊውን የኢትዮጵያ ፋሽን ኢኮሲስተም ለማሳደግ ይርዱ። ዛሬውኑ ስኬታማ አጋሮቻችንን ይቀላቀሉ።'}
          </p>
          <a 
            href="#apply" 
            className={cn(
              "inline-block bg-accent text-white dark:text-ink px-16 py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-95",
              language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
            )}
          >
            {language === 'en' ? 'Apply Now →' : 'አሁኑኑ ያመልክቱ →'}
          </a>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Commission Models */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {commissionModels.map((model, i) => (
              <div key={i} className="bg-surface-card border border-border-primary p-12 space-y-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 border border-accent/20 bg-accent/5 flex items-center justify-center text-accent">
                  <model.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className={cn(
                  "font-display text-3xl text-text-primary tracking-tight font-bold",
                  language === 'am' && "font-ethiopic text-2xl"
                )}>{model.title}</h3>
                <p className={cn(
                  "text-base text-text-secondary leading-relaxed font-body",
                  language === 'am' && "font-ethiopic"
                )}>
                  {model.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface border-y border-border-primary py-24 md:py-40 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={cn(
            "font-display text-5xl md:text-7xl text-text-primary mb-24 text-center tracking-tight font-bold",
            language === 'am' && "font-ethiopic text-4xl md:text-6xl"
          )}>
            {language === 'en' ? 'How It Works' : 'እንዴት እንደሚሰራ'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border-primary divide-y md:divide-y-0 md:divide-x divide-border-primary shadow-2xl">
            {[
              { n: '01', t: language === 'en' ? 'Apply' : 'ማመልከት', d: language === 'en' ? 'Submit your application. We review reach and alignment with our brand aesthetic.' : 'ማመልከቻዎን ያስገቡ። የተከታዮችዎን ብዛት እና ከቃልሱቅ ጋር ያለዎትን ተዛማጅነት እንገመግማለን።' },
              { n: '02', t: language === 'en' ? 'Receive Assets' : 'መረጃዎችን መቀበል', d: language === 'en' ? 'Get your unique code and access our library of professional media assets.' : 'የእርስዎን ልዩ ኮድ እና ጥራት ያላቸውን የምርት ምስሎች እና ቪዲዮዎች ያግኙ።' },
              { n: '03', t: language === 'en' ? 'Get Paid' : 'ክፍያ መቀበል', d: language === 'en' ? 'Track sales in your portal and receive monthly payouts for every confirmed order.' : 'ሽያጭዎን ይከታተሉ እና ለእያንዳንዱ ትዕዛዝ ወርሃዊ ክፍያዎን ይቀበሉ።' }
            ].map((step) => (
              <div key={step.n} className="bg-surface-card px-12 py-24 space-y-10 hover:bg-accent/5 transition-all duration-500 group">
                <span className="font-mono text-8xl text-accent/10 block leading-none font-bold group-hover:text-accent/20 transition-colors">{step.n}</span>
                <h3 className={cn(
                  "font-display text-3xl text-text-primary tracking-tight font-bold",
                  language === 'am' && "font-ethiopic text-2xl"
                )}>{step.t}</h3>
                <p className={cn(
                  "text-base text-text-secondary leading-relaxed font-body",
                  language === 'am' && "font-ethiopic"
                )}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Link Explainer */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-surface-card border border-border-primary p-10 md:p-16 space-y-10 shadow-2xl">
            <div className="space-y-6">
              <span className={cn(
                "text-[10px] text-accent uppercase tracking-[0.4em] font-bold block",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                {language === 'en' ? 'Your Link Format:' : 'የእርስዎ ሊንክ ቅርጸት:'}
              </span>
              <div className="bg-surface border border-border-primary p-6 font-mono text-accent text-lg md:text-2xl break-all shadow-inner">
                kalsuq.com/shop?ref=YOURNAME
              </div>
            </div>
            <div className="space-y-6">
              <p className={cn(
                "text-base text-text-secondary leading-relaxed font-body",
                language === 'am' && "font-ethiopic"
              )}>
                {language === 'en'
                  ? 'Share it on Instagram, TikTok, Telegram, or in person. Every customer who shops through your link is automatically tracked for 30 days.'
                  : 'በInstagram፣ TikTok፣ Telegram ላይ ወይም በአካል ያጋሩ። በእርስዎ ሊንክ አማካኝነት የሚገዙ ደንበኞች ለ30 ቀናት በራስ-ሰር ይከታተላሉ።'}
              </p>
              <div className={cn(
                "flex items-center space-x-3 text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold",
                language === 'am' && "font-ethiopic tracking-normal text-xs"
              )}>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>{language === 'en' ? 'Orders tracked for 30 days after a click' : 'ጠቅ ካደረጉ በኋላ ትዕዛዞች ለ30 ቀናት ይከታተላሉ'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="bg-surface py-24 md:py-40 border-t border-border-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className={cn(
            "font-display text-4xl md:text-6xl text-text-primary mb-16 text-center tracking-tight font-bold",
            language === 'am' && "font-ethiopic text-3xl md:text-5xl"
          )}>
            {language === 'en' ? 'Program Benefits' : 'የፕሮግራሙ ጥቅሞች'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b} className="flex items-center space-x-6 bg-surface-card border border-border-primary p-8 hover:border-accent/40 transition-all shadow-sm">
                <div className="w-8 h-8 flex-shrink-0 bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Check size={16} className="text-accent" />
                </div>
                <span className={cn(
                  "text-base text-text-primary font-bold tracking-tight",
                  language === 'am' && "font-ethiopic"
                )}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="bg-surface border-t border-border-primary py-24 md:py-48 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          {!submitted ? (
            <div className="space-y-16">
              <div className="text-center space-y-6">
                <h2 className={cn(
                  "font-display text-5xl text-text-primary tracking-tight font-bold",
                  language === 'am' && "font-ethiopic text-4xl"
                )}>
                  {language === 'en' ? 'Join the Movement' : 'እንቅስቃሴውን ይቀላቀሉ'}
                </h2>
                <p className={cn(
                  "text-base text-text-secondary max-w-md mx-auto leading-relaxed",
                  language === 'am' && "font-ethiopic"
                )}>
                  {language === 'en'
                    ? "We'll review your application and respond within 24 hours via WhatsApp."
                    : 'ማመልከቻዎን እንገመግማለን እና በ24 ሰዓታት ውስጥ በዋትስአፕ ምላሽ እንሰጣለን።'}
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[10px] font-bold text-accent uppercase tracking-[0.3em]",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Full Name' : 'ሙሉ ስም'}
                    </label>
                    <input name="fullName" type="text" placeholder={language === 'en' ? 'e.g. Martha Haile' : 'ምሳሌ፡ ማርታ ሃይሌ'} className={inputClasses} required />
                  </div>
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[10px] font-bold text-accent uppercase tracking-[0.3em]",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Phone Number' : 'ስልክ ቁጥር'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-bold">+251</span>
                      <input name="phone" type="tel" placeholder="911 000 000" className={`${inputClasses} pl-16 font-mono`} required />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className={cn(
                    "text-[10px] font-bold text-accent uppercase tracking-[0.3em]",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'Email Address' : 'ኢሜይል አድራሻ'}
                  </label>
                  <input name="email" type="email" placeholder="martha@example.com" className={inputClasses} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[10px] font-bold text-accent uppercase tracking-[0.3em]",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Primary Platform' : 'ዋና መድረክ'}
                    </label>
                    <select name="platform" className={`${inputClasses} bg-surface-card`} required>
                      <option value="">{language === 'en' ? 'Select Platform' : 'መድረክ ይምረጡ'}</option>
                      <option>Instagram</option>
                      <option>TikTok</option>
                      <option>Telegram</option>
                      <option>{language === 'en' ? 'Physical Store' : 'አካል ሱቅ'}</option>
                      <option>{language === 'en' ? 'Other' : 'ሌላ'}</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className={cn(
                      "text-[10px] font-bold text-accent uppercase tracking-[0.3em]",
                      language === 'am' && "font-ethiopic tracking-normal text-xs"
                    )}>
                      {language === 'en' ? 'Audience Size' : 'የተከታዮች ብዛት'}
                    </label>
                    <input name="audienceSize" type="text" placeholder={language === 'en' ? 'e.g. 10k+ followers' : 'ምሳሌ: 10ሺ+ ተከታዮች'} className={inputClasses} required />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className={cn(
                    "text-[10px] font-bold text-accent uppercase tracking-[0.3em]",
                    language === 'am' && "font-ethiopic tracking-normal text-xs"
                  )}>
                    {language === 'en' ? 'Promotion Plan' : 'የማስተዋወቂያ ዕቅድ'}
                  </label>
                  <textarea name="promotionPlan" rows={4} placeholder={language === 'en' ? 'How do you plan to showcase Kalsuq to your audience?' : 'ቃልሱቅን ለተከታዮችዎ እንዴት ለማስተዋወቅ ያቅዳሉ?'} className={`${inputClasses} resize-none`} required />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full bg-accent text-white dark:text-ink py-7 text-[10px] font-bold tracking-[0.4em] uppercase transition-all hover:bg-accent-hover shadow-2xl active:scale-95 mt-4 disabled:opacity-50",
                    language === 'am' && "font-ethiopic tracking-normal text-sm py-5"
                  )}
                >
                  {isSubmitting 
                    ? (language === 'en' ? 'Submitting...' : 'በማስገባት ላይ...')
                    : (language === 'en' ? 'Submit My Application →' : 'ማመልከቻዬን ያስገቡ →')}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-10 py-20 animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-accent/10 border border-accent/20 rounded-none flex items-center justify-center mx-auto shadow-inner">
                <Check size={48} className="text-accent" />
              </div>
              <div className="space-y-6">
                <h2 className={cn(
                  "font-display text-5xl text-text-primary tracking-tight font-bold",
                  language === 'am' && "font-ethiopic text-4xl"
                )}>
                  {language === 'en' ? 'Application Received!' : 'ማመልከቻዎ ደርሷል!'}
                </h2>
                <p className={cn(
                  "text-text-secondary text-lg leading-relaxed max-w-lg mx-auto",
                  language === 'am' && "font-ethiopic"
                )}>
                  {language === 'en'
                    ? 'Thank you for your interest in Kalsuq. Our team will review your profile and contact you on WhatsApp within 24 hours.'
                    : 'በቃልሱቅ ያሳዩትን ፍላጎት እናመሰግናለን። ቡድናችን መገለጫዎን ይገመግማል እና በ24 ሰዓታት ውስጥ በዋትስአፕ ያገኝዎታል።'}
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className={cn(
                  "text-[10px] font-bold text-accent uppercase tracking-[0.3em] hover:underline",
                  language === 'am' && "font-ethiopic tracking-normal text-xs"
                )}
              >
                {language === 'en' ? 'Back to Top' : 'ወደ ላይ ተመለስ'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
