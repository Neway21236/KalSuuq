import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const products = [
  {
    id: '1',
    slug: 'city-leather-boots',
    name: 'City Leather Boots',
    nameAm: 'የከተማ የቆዳ ጫማ',
    collection: 'Addis Edit',
    collectionAm: 'አዲስ እትም',
    price: 5400,
    originalPrice: 6200,
    image: '/cat-shoes.png',
    category: 'Shoes',
    categoryAm: 'ጫማዎች',
    label: 'Best Seller',
    labelAm: 'ተመራጭ',
    description: "Premium leather boots handcrafted in Addis Ababa. Designed for both style and durability in urban environments.",
    descriptionAm: "በአዲስ አበባ በእጅ የተሰራ ምርጥ የቆዳ ጫማ። ለከተማ ኑሮ በስታይል እና በጥንካሬ ተብሎ የተሰራ።",
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colours: [
      { name: 'Espresso', hex: '#1A120D' },
      { name: 'Taupe', hex: '#BDA792' },
    ],
    inStock: true,
  },
  {
    id: '2',
    slug: 'minimalist-linen-shirt',
    name: 'Minimalist Linen Shirt',
    nameAm: 'ቀላል የጥጥ ሸሚዝ',
    collection: 'Spring 26',
    collectionAm: 'የፀደይ 26',
    price: 3200,
    image: '/cat-clothes.png',
    category: 'Clothes',
    categoryAm: 'ልብሶች',
    label: 'New Drop',
    labelAm: 'አዲስ',
    description: "A breathable, high-quality linen shirt perfect for the warm Addis afternoons.",
    descriptionAm: "ለሞቃታማው አዲስ አበባ ከሰዓት በኋላ የሚሆን ምርጥ የጥጥ ሸሚዝ።",
    sizes: ['S', 'M', 'L', 'XL'],
    colours: [
      { name: 'White', hex: '#FAFAFA' },
      { name: 'Sand', hex: '#D2B48C' },
    ],
    inStock: true,
  },
];

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ 
    success: true, 
    product,
  });
}
