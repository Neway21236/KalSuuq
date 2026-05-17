import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kalsuq.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Gracefully degrade: if the DB is unreachable at build time, return static routes only
  try {
    const products = await getProducts()
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    return [...staticRoutes, ...productUrls]
  } catch {
    console.warn('[sitemap] Could not fetch products — returning static routes only.')
    return staticRoutes
  }
}

