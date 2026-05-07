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

export const products: Product[] = [
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
    inStock: true,
    description: 'Expertly crafted from premium Ethiopian leather, these city boots combine heritage craftsmanship with a modern urban aesthetic. Designed for comfort and durability in the streets of Addis.',
    descriptionAm: 'ከከፍተኛ ጥራት ካለው የኢትዮጵያ ቆዳ በጥንቃቄ የተሰሩ እነዚህ የከተማ ጫማዎች የባህል ጥበብን ከዘመናዊ የከተማ ውበት ጋር ያጣምራሉ። በአዲስ አበባ ጎዳናዎች ላይ ለምቾት እና ለጥንካሬ ተብለው የተነደፉ ናቸው።',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colours: [
      { name: 'Espresso', nameAm: 'ኤስፕሬሶ', hex: '#1A120D' },
      { name: 'Taupe', hex: '#BDA792' },
    ],
    images: ['/cat-shoes.png', '/hero.png']
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
    inStock: true,
    description: 'Breathable, lightweight linen sourced from local cooperatives. A timeless silhouette that works perfectly for both formal meetings and weekend gallery visits.',
    descriptionAm: 'ከሀገር ውስጥ የጥጥ ማህበራት የተገኘ አየር የሚያስገባ እና ቀላል ክብደት ያለው የጥጥ ሸሚዝ። ለመደበኛ ስብሰባዎችም ሆነ ለሳምንቱ መጨረሻ የመዝናኛ ጊዜያት የሚሆን ሁልጊዜም የማይረጅ ዲዛይን።',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: [
      { name: 'White', nameAm: 'ነጭ', hex: '#FAFAFA' },
      { name: 'Sand', nameAm: 'አሸዋ', hex: '#D2B48C' },
    ],
    images: ['/cat-clothes.png', '/hero.png']
  },
  {
    id: '3',
    slug: 'heritage-tote-bag',
    name: 'Heritage Tote Bag',
    nameAm: 'የባህል ቶት ቦርሳ',
    collection: 'Accessories',
    collectionAm: 'መለዋወጫዎች',
    price: 4500,
    image: '/cat-accessories.png',
    category: 'Accessories',
    categoryAm: 'መለዋወጫዎች',
    label: 'Bundle',
    labelAm: 'ጥቅል',
    inStock: true,
    description: 'A spacious tote featuring traditional hand-woven accents. Large enough for a laptop and daily essentials, built to last a lifetime.',
    descriptionAm: 'በባህላዊ በእጅ የተሸመኑ ጌጦች ያሉት ሰፊ ቶት ቦርሳ። ላፕቶፕ እና የዕለት ተዕለት ዕቃዎችን ለመያዝ የሚያስችል ሰፊ እና ለረጅም ጊዜ የሚያገለግል።',
    sizes: ['One Size'],
    colours: [
      { name: 'Tan', hex: '#D2B48C' },
    ],
    images: ['/cat-accessories.png', '/hero.png']
  },
  {
    id: '4',
    slug: 'silk-evening-wrap',
    name: 'Silk Evening Wrap',
    nameAm: 'የሐር ምሽት መጠቅለያ',
    collection: 'Addis Edit',
    collectionAm: 'አዲስ እትም',
    price: 7800,
    image: '/cat-clothes.png',
    category: 'Clothes',
    categoryAm: 'ልብሶች',
    inStock: true,
    description: 'Sumptuous local silk with hand-rolled edges. An elegant layer for evening events, featuring subtle geometric patterns inspired by Aksumite architecture.',
    descriptionAm: 'በእጅ የተሰሩ ዳርቻዎች ያሉት ምርጥ የሀገር ውስጥ ሐር። ለአክሱም የስነ-ህንፃ ጥበብ መነሻ የሆኑ ስውር የጂኦሜትሪክ ቅጦች ያሉት ለምሽት ዝግጅቶች የሚሆን ውብ መደረቢያ።',
    sizes: ['S', 'M', 'L'],
    colours: [
      { name: 'Gold', hex: '#D89F69' },
      { name: 'Ivory', hex: '#FFFFF0' },
    ],
    images: ['/cat-clothes.png', '/hero.png']
  },
  {
    id: '5',
    slug: 'nubuck-desert-boots',
    name: 'Nubuck Desert Boots',
    nameAm: 'የኑቡክ ደሴት ጫማ',
    collection: 'Legacy',
    collectionAm: 'ቅርስ',
    price: 6100,
    image: '/cat-shoes.png',
    category: 'Shoes',
    categoryAm: 'ጫማዎች',
    inStock: false,
    description: 'Soft nubuck leather in a classic desert boot silhouette. Natural crepe sole for superior cushioning and a rugged yet refined finish.',
    descriptionAm: 'ለስላሳ የኑቡክ ቆዳ የተሰራ ጥንታዊ የደሴት ጫማ። ለተሻለ ምቾት የተፈጥሮ ክሬፕ ሶል ያለው እና ጠንካራ ግን ደግሞ የተዋበ አጨራረስ ያለው።',
    sizes: ['39', '40', '41', '42', '43'],
    colours: [
      { name: 'Desert', hex: '#C4A882' },
    ],
    images: ['/cat-shoes.png', '/hero.png']
  },
  {
    id: '6',
    slug: 'gold-accent-belt',
    name: 'Gold Accent Belt',
    nameAm: 'የወርቅ አክሰንት ቀበቶ',
    collection: 'Accessories',
    collectionAm: 'መለዋወጫዎች',
    price: 1800,
    image: '/cat-accessories.png',
    category: 'Accessories',
    categoryAm: 'መለዋወጫዎች',
    inStock: true,
    description: 'Hand-burnished leather belt with a custom-cast gold-tone buckle. The perfect finishing touch for any Kalsuq look.',
    descriptionAm: 'በእጅ የተሰራ የቆዳ ቀበቶ ከወርቅ ቀለም ካለው ዘለበት ጋር። ለማንኛውም የካልሱቅ አለባበስ ፍጹም ማጠናቀቂያ።',
    sizes: ['S', 'M', 'L'],
    colours: [
      { name: 'Gold', hex: '#D89F69' },
    ],
    images: ['/cat-accessories.png', '/hero.png']
  },
]

export const getProducts = async () => {
  return products
}

export const getProductBySlug = async (slug: string) => {
  return products.find(p => p.slug === slug)
}
