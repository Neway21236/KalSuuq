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
import { ProductStatus, OrderStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

async function getHomepageData() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Featured products (admin-flagged)
  const featuredProducts = await prisma.product.findMany({
    where: { status: ProductStatus.PUBLISHED, isFeatured: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, name: true, price: true, originalPrice: true, image: true, images: true, category: true, inStock: true, isBestSeller: true }
  })

  // Best sellers: top 3 by confirmed orders in last 30 days (FR-HOME-06)
  const topOrderItems = await prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: {
        orderStatus: { in: [OrderStatus.PAYMENT_CONFIRMED, OrderStatus.DELIVERED] },
        createdAt: { gte: thirtyDaysAgo }
      }
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 3,
  })

  const bestSellerIds = topOrderItems.map(i => i.productId)

  const bestSellerProducts = bestSellerIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: bestSellerIds }, status: ProductStatus.PUBLISHED },
        select: { id: true, slug: true, name: true, price: true, originalPrice: true, image: true, images: true, category: true, inStock: true, isBestSeller: true }
      })
    : await prisma.product.findMany({
        where: { status: ProductStatus.PUBLISHED, isBestSeller: true },
        take: 3,
        select: { id: true, slug: true, name: true, price: true, originalPrice: true, image: true, images: true, category: true, inStock: true, isBestSeller: true }
      })

  // Live order counter: orders this week (FR-HOME-08)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const weeklyOrderCount = await prisma.order.count({
    where: { orderStatus: { in: ['PAYMENT_CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'] }, createdAt: { gte: sevenDaysAgo } }
  })

  return { featuredProducts, bestSellerProducts, weeklyOrderCount }
}

export default async function Home() {
  const { featuredProducts, bestSellerProducts, weeklyOrderCount } = await getHomepageData()

  // Map DB shape to ProductCard shape
  const mapProduct = (p: typeof featuredProducts[0]) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    collection: p.category, // Use category as collection fallback
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    image: p.image,
    category: p.category,
    inStock: p.inStock,
    label: (p.isBestSeller ? 'Best Seller' : undefined) as 'Best Seller' | 'New Drop' | 'Bundle' | undefined,
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
