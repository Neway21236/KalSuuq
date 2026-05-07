'use client'

import Image from 'next/image'
import TrustStrip from '@/components/home/TrustStrip'
import PartnerTeaser from '@/components/home/PartnerTeaser'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export default function AboutPage() {
  const { language } = useLanguageStore()
  
  const values = [
    {
      title: language === 'en' ? 'Mobile-First Commerce' : 'የሞባይል ንግድ',
      desc: language === 'en'
        ? 'Designed for the speed and connectivity of modern Ethiopia. We prioritize performance and ease of use on every screen.'
        : 'ለዘመናዊቷ ኢትዮጵያ ፍጥነት እና ተያያዥነት ተብሎ የተሰራ። በማንኛውም ስክሪን ላይ ለፈጣን አፈጻጸም እና ቀላል አጠቃቀም ቅድሚያ እንሰጣለን።'
    },
    {
      title: language === 'en' ? 'Partner-Powered Growth' : 'በአጋርነት ላይ የተመሠረተ ዕድገት',
      desc: language === 'en'
        ? 'We believe in shared success. Our partner network is at the heart of how we scale and reach new communities.'
        : 'በጋራ ስኬት እናምናለን። የአጋሮቻችን ኔትወርክ ስራችንን ለማስፋፋት እና አዳዲስ ማህበረሰቦችን ለመድረስ ቁልፍ ነው።'
    },
    {
      title: language === 'en' ? 'Ethiopian by Design' : 'በኢትዮጵያዊነት የቀረጸ',
      desc: language === 'en'
        ? 'From our heritage-inspired collections to our local payment integrations, everything we build is for Addis and beyond.'
        : 'ከባህል ካገኘናቸው ስብስቦቻችን ጀምሮ እስከ ሀገር ውስጥ የክፍያ አማራጮቻችን ድረስ የምንገነባው ሁሉ ለአዲስ አበባ እና ከዚያም በላይ ነው።'
    }
  ]

  return (
    <div className="bg-surface min-h-screen transition-colors duration-300">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image 
          src="/hero.png"
          alt="Kalsuq Story"
          fill
          className="object-cover transition-transform duration-[2000ms] scale-105 hover:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" />
        <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-10 flex items-end pb-24">
          <h1 className={cn(
            "font-display text-5xl md:text-8xl text-white leading-[1.1] max-w-4xl tracking-tight font-bold",
            language === 'am' && "font-ethiopic text-6xl"
          )}>
            {language === 'en' ? 'Built for Addis.' : 'ለአዲስ የተገነባ።'} <br /> 
            <span className="text-accent">{language === 'en' ? 'Worn Everywhere.' : 'በሁሉም ቦታ የሚለበስ።'}</span>
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-48">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-card shadow-2xl border border-border-primary group">
              <Image 
                src="/cat-clothes.png"
                alt="Editorial Fashion"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 border-[20px] border-surface/10 pointer-events-none" />
            </div>
            <div className="space-y-12">
              <div className="space-y-6">
                <span className={cn(
                  "text-[10px] tracking-[0.5em] text-accent uppercase font-bold",
                  language === 'am' && "font-ethiopic tracking-normal"
                )}>
                  {language === 'en' ? 'The Story' : 'ታሪኩ'}
                </span>
                <h2 className={cn(
                  "font-display text-5xl md:text-7xl text-text-primary leading-tight font-bold tracking-tight",
                  language === 'am' && "font-ethiopic text-5xl"
                )}>
                  {language === 'en' ? 'Redefining the' : 'ዲጂታል ሱቁን'} <br /> <span className="text-accent">{language === 'en' ? 'Digital Storefront.' : 'እንደገና መግለጽ።'}</span>
                </h2>
              </div>
              <div className={cn(
                "space-y-8 text-text-secondary font-body text-lg leading-relaxed",
                language === 'am' && "font-ethiopic"
              )}>
                <p>
                  {language === 'en' 
                    ? 'Kalsuq was founded in 2026 with a single mission: to build the most elegant and efficient fashion commerce platform in Ethiopia. We saw a gap between local demand for premium style and the technical infrastructure needed to deliver it.'
                    : 'ቃልሱቅ በ2018 (2026) የተመሰረተው አንድ ተልዕኮ ይዞ ነው፡ በኢትዮጵያ ውስጥ እጅግ በጣም ውብ እና ቀልጣፋ የፋሽን ንግድ መድረክን መገንባት። በሀገር ውስጥ ለሚፈለጉ ጥራት ያላቸው ስታይሎች እና እነሱን ለማድረስ በሚያስፈልገው የቴክኒክ መሠረተ ልማት መካከል ክፍተት አይተናል።'}
                </p>
                <p>
                  {language === 'en'
                    ? 'We don\'t just sell clothes; we build pathways for creators, partners, and customers to connect in a way that feels premium, secure, and native to our context.'
                    : 'እኛ ልብስ ብቻ አንሸጥም፤ ለፈጣሪዎች፣ ለአጋሮች እና ለደንበኞች በልዩ ሁኔታ፣ በደህንነት እና ከባህላችን ጋር በሚስማማ መልኩ የሚገናኙበትን መንገድ እንገነባለን።'}
                </p>
                <p>
                  {language === 'en'
                    ? 'Every line of code and every curated collection is a step toward a more vibrant, digitally-empowered Ethiopian fashion ecosystem.'
                    : 'እያንዳንዱ የኮድ መስመር እና እያንዳንዱ የተመረጠ ስብስብ ይበልጥ ደማቅ እና በዲጂታል የለማ የኢትዮጵያ ፋሽን ኢኮሲስተም ለመፍጠር የሚደረግ ጉዞ ነው።'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <TrustStrip />

      {/* Values */}
      <section className="bg-surface-card py-24 md:py-48 border-t border-border-primary transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={cn(
            "font-display text-[10px] text-accent mb-20 text-center uppercase tracking-[0.6em] font-bold",
            language === 'am' && "font-ethiopic tracking-normal text-xs"
          )}>
            {language === 'en' ? 'Our Core Values' : 'መሠረታዊ እሴቶቻችን'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="bg-surface border border-border-primary p-12 space-y-8 hover:shadow-2xl hover:border-accent/30 transition-all duration-500 group">
                <h3 className={cn(
                  "font-display text-3xl text-text-primary tracking-tight font-bold group-hover:text-accent transition-colors",
                  language === 'am' && "font-ethiopic"
                )}>{v.title}</h3>
                <p className={cn(
                  "text-base text-text-secondary leading-relaxed font-body",
                  language === 'am' && "font-ethiopic"
                )}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA Strip */}
      <PartnerTeaser />
    </div>
  )
}
