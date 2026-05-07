import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import ShopByCategory from '@/components/home/ShopByCategory'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BundleOfferBanner from '@/components/home/BundleOfferBanner'
import HowKalsuqWorks from '@/components/home/HowKalsuqWorks'
import Testimonials from '@/components/home/Testimonials'
import PartnerTeaser from '@/components/home/PartnerTeaser'
import FAQ from '@/components/home/FAQ'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <ShopByCategory />
      <FeaturedProducts 
        title="Featured Pieces" 
        subtitle="Hand-selected styles for your next occasion."
        className="bg-surface"
      />
      <BundleOfferBanner />
      <FeaturedProducts 
        title="Best Sellers" 
        subtitle="Based on the last 30 days."
        className="bg-surface-card border-t border-border-light"
        showViewAll={false}
      />
      <HowKalsuqWorks />
      <Testimonials />
      <PartnerTeaser />
      <FAQ />
    </div>
  )
}
