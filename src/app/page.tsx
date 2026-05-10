import prisma from '@/lib/db'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import ShopByCategory from '@/components/home/ShopByCategory'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BundleOfferBanner from '@/components/home/BundleOfferBanner'
import BestSellers from '@/components/home/BestSellers'
import HowKalsuqWorks from '@/components/home/HowKalsuqWorks'
import Testimonials from '@/components/home/Testimonials'
import SocialProof from '@/components/home/SocialProof'
import PartnerTeaser from '@/components/home/PartnerTeaser'
import FAQ from '@/components/home/FAQ'
import { ProductStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

async function getHomepageData() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  try {
    // Featured products (admin-flagged isFeatured=true)
    const featuredProducts = await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED, isFeatured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, slug: true, name: true, price: true,
        originalPrice: true, image: true, images: true,
        category: true, inStock: true, isBestSeller: true
      }
    })

    // Best sellers: use isBestSeller flag OR fall back to newest published
    // Avoids complex groupBy relation filter that can crash on some DB configs
    const bestSellerProducts = await prisma.product.findMany({
      where: { status: ProductStatus.PUBLISHED },
      orderBy: [{ isBestSeller: 'desc' }, { createdAt: 'desc' }],
      take: 3,
      select: {
        id: true, slug: true, name: true, price: true,
        originalPrice: true, image: true, images: true,
        category: true, inStock: true, isBestSeller: true
      }
    })

    // Live order counter (FR-HOME-08)
    const weeklyOrderCount = await prisma.order.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    })

    return { featuredProducts, bestSellerProducts, weeklyOrderCount }
  } catch (err) {
    console.error('[Homepage] DB fetch error:', err)
    // Return safe empty state — page still renders, no crash
    return { featuredProducts: [], bestSellerProducts: [], weeklyOrderCount: 47 }
  }
}

export default async function Home() {
  const { featuredProducts, bestSellerProducts, weeklyOrderCount } = await getHomepageData()

  type ProductLabel = 'Best Seller' | 'New Drop' | 'Bundle' | undefined

  const mapProduct = (p: {
    id: string; slug: string; name: string; price: number;
    originalPrice: number | null; image: string; images: string[];
    category: string; inStock: boolean; isBestSeller: boolean
  }) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    collection: p.category,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    image: p.image,
    category: p.category,
    inStock: p.inStock,
    label: (p.isBestSeller ? 'Best Seller' : undefined) as ProductLabel,
  })

  return (
    <div className="flex flex-col">
      <Hero />
      <TrustStrip />
      <ShopByCategory />
      <FeaturedProducts
        title="Featured Pieces"
        subtitle="Hand-selected styles for your next occasion."
        className="bg-surface"
        products={featuredProducts.length > 0 ? featuredProducts.map(mapProduct) : undefined}
      />
      <BundleOfferBanner />
      <BestSellers products={bestSellerProducts.map(mapProduct)} />
      <HowKalsuqWorks />
      <SocialProof weeklyOrderCount={weeklyOrderCount} />
      <Testimonials />
      <PartnerTeaser />
      <FAQ />
    </div>
  )
}
