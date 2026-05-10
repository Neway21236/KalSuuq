'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/useLanguageStore'

export default function FAQ() {
  const { language } = useLanguageStore()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: language === 'en' ? "Do you deliver outside Addis Ababa?" : "ከአዲስ አበባ ውጪ ታደርሳላችሁ?",
      a: language === 'en'
        ? "Yes, we offer nationwide shipping across Ethiopia. Delivery times range from 3-5 business days for locations outside the capital. Addis Ababa orders are typically fulfilled within 24 hours."
        : "አዎ፣ በመላው ኢትዮጵያ እናደርሳለን። ከአዲስ አበባ ውጪ ላሉ ከተሞች አቅርቦቱ ከ3-5 የሥራ ቀናት ይወስዳል። አዲስ አበባ ውስጥ ያሉ ትዕዛዞች በ24 ሰዓት ውስጥ ይፈጸማሉ።"
    },
    {
      q: language === 'en' ? "What payment methods do you accept?" : "ምን ዓይነት የክፍያ አማራጮች አላችሁ?",
      a: language === 'en'
        ? "We accept digital payments via Chapa (Telebirr, CBEBirr, Cards) and offer Cash on Delivery for confirmed orders in Addis Ababa."
        : "በቻፓ (ቴሌብር፣ ሲቢኢ ብር፣ ካርዶች) ዲጂታል ክፍያዎችን እንቀበላለን፤ እንዲሁም አዲስ አበባ ውስጥ ለተረጋገጡ ትዕዛዞች እጅ በእጅ ክፍያ እንቀበላለን።"
    },
    {
      q: language === 'en' ? "How do I find my size?" : "መጠኔን እንዴት አውቃለሁ?",
      a: language === 'en'
        ? "Every product page includes a Size Guide link that opens a detailed size chart without leaving the page. If you're between sizes, we recommend sizing up. Our team is also available via WhatsApp to help you choose."
        : "እያንዳንዱ ምርት ገጽ ዝርዝር የመጠን ሰንጠረዥ ያሳያል። በሁለት መጠን መካከል ከሆኑ ትልቁን ይምረጡ። ቡድናችን ደግሞ ምርጫዎን ለማገዝ በዋትስአፕ ዝግጁ ነው።"
    },
    {
      q: language === 'en' ? "What is your return and exchange policy?" : "የመመለሻ እና የልውውጥ ፖሊሲዎ ምንድን ነው?",
      a: language === 'en'
        ? "We accept returns and exchanges within 7 days of delivery for unworn items in original condition. To initiate a return, contact us via WhatsApp with your order number. Refunds are processed within 3-5 business days."
        : "ካልለበሱ ዕቃዎች ጋር ከደረሱበት ቀን ጀምሮ ከ7 ቀናት ውስጥ መመለሻ እና ልውውጥ እንቀበላለን። ለመጀመር ከትዕዛዝ ቁጥርዎ ጋር በዋትስአፕ ያግኙን። ተመላሾች ከ3-5 የሥራ ቀናት ውስጥ ይፈጸማሉ።"
    },
    {
      q: language === 'en' ? "Can I order via WhatsApp or Telegram?" : "በዋትስአፕ ወይም በቴሌግራም ማዘዝ እችላለሁ?",
      a: language === 'en'
        ? "Absolutely. We prioritize local communication channels. You can find direct WhatsApp order links on every product page, or reach us via Telegram @KalsuqStore."
        : "በእርግጥ። ለሀገር ውስጥ የመገናኛ ዘዴዎች ቅድሚያ እንሰጣለን። በእያንዳንዱ ምርት ገጽ ቀጥታ የዋትስአፕ ማዘዣ ሊንክ ያገኛሉ፣ ወይም Telegram @KalsuqStore ያግኙን።"
    },
    {
      q: language === 'en' ? "How does the partner program work?" : "የአጋርነት ፕሮግራሙ እንዴት ነው የሚሰራው?",
      a: language === 'en'
        ? "Apply at kalsuq.com/partners. Once approved, you receive a unique referral code and trackable link. Share it on your channels — you earn commission on every confirmed order placed through your link, paid monthly."
        : "kalsuq.com/partners ላይ ያመልክቱ። ከጸደቀ በኋላ ልዩ ኮድ እና ሊንክ ይደርስዎታል። በሚያጋሯቸው ቻናሎቻቸው ያሰራጩ — በሊንክዎ አስተዋጽዖ ለሚደረጉ ግዢዎች ኮሚሽን ያግኛሉ፣ ወርሃዊ ይከፈላል።"
    }
  ]

  return (
    <section className="bg-surface border-t border-border-primary py-24 md:py-48 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h2 className={cn(
          "font-display text-5xl md:text-8xl text-text-primary mb-24 text-center tracking-tight font-bold",
          language === 'am' && "font-ethiopic text-6xl"
        )}>
          {language === 'en' ? 'Common Questions' : 'ተደጋጋሚ ጥያቄዎች'}
        </h2>
        
        <div className="space-y-0 border-t border-border-primary shadow-2xl">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-border-primary bg-surface-card hover:bg-accent/5 transition-colors duration-500">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full py-10 px-8 flex justify-between items-center text-left group"
              >
                <span className={cn(
                  "text-xl md:text-2xl font-bold tracking-tight transition-all duration-300",
                  openIdx === idx ? "text-accent translate-x-2" : "text-text-primary group-hover:text-accent group-hover:translate-x-1",
                  language === 'am' && "font-ethiopic text-xl"
                )}>
                  {faq.q}
                </span>
                <div className="text-accent flex-shrink-0 ml-6 bg-accent/10 p-2 border border-accent/20">
                  {openIdx === idx ? <Minus size={24} strokeWidth={1.5} /> : <Plus size={24} strokeWidth={1.5} />}
                </div>
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out px-8",
                openIdx === idx ? "max-h-96 pb-12 opacity-100" : "max-h-0 opacity-0"
              )}>
                <p className={cn(
                  "text-lg text-text-secondary leading-relaxed max-w-3xl font-medium",
                  language === 'am' && "font-ethiopic"
                )}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
