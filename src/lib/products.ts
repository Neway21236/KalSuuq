import prisma from "./db"

export interface Colour {
  name: string
  nameAm?: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  name: string
  nameAm?: string
  collection: string
  collectionAm?: string
  price: number
  originalPrice?: number
  image: string
  category: string
  categoryAm?: string
  label?: 'Best Seller' | 'New Drop' | 'Bundle'
  labelAm?: string
  inStock: boolean
  description: string
  descriptionAm: string
  sizes: string[]
  colours: Colour[]
  images: string[]
}

// Map database product to storefront product interface
const mapProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  slug: dbProduct.slug,
  name: dbProduct.name,
  nameAm: dbProduct.nameAm || undefined,
  collection: dbProduct.collection,
  collectionAm: dbProduct.collectionAm || undefined,
  price: dbProduct.price,
  originalPrice: dbProduct.originalPrice || undefined,
  image: dbProduct.image,
  category: dbProduct.category,
  categoryAm: dbProduct.categoryAm || undefined,
  label: dbProduct.isBestSeller ? 'Best Seller' : dbProduct.isFeatured ? 'New Drop' : undefined,
  inStock: dbProduct.inStock,
  description: dbProduct.description,
  descriptionAm: dbProduct.descriptionAm || '',
  sizes: dbProduct.variants?.map((v: any) => v.size).filter(Boolean) || [],
  colours: dbProduct.variants?.map((v: any) => ({
    name: v.colour,
    hex: v.colourHex || '#000000'
  })).filter((c: any) => c.name) || [],
  images: dbProduct.images || [dbProduct.image]
})

export const getProducts = async () => {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        variants: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return dbProducts.map(mapProduct);
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    return []; // Return empty array on error
  }
}

export const getProductBySlug = async (slug: string) => {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: {
        slug,
        status: 'PUBLISHED'
      },
      include: {
        variants: true
      }
    });
    
    return dbProduct ? mapProduct(dbProduct) : null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}
