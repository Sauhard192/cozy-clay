import { getBestsellers } from './products';
export type { Product } from './products';

export type SitePage = 'home' | 'about' | 'say-hello' | 'products';

export interface CategoryCardContent {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  imageAlt: string;
  preparationTime: string;
  categoryIcon: string;
}
export interface Category { id: string; name: string; productId: string }
const products: CategoryCardContent[] = [
  { id: 'miniature-example', categoryId: 'miniature', categoryIcon: 'category-miniature.png', name: 'Miniature', image: 'category-miniature.png', imageAlt: 'Handmade miniature wearing a black top and cream skirt, held against green leaves', preparationTime: '6–7 days' },
  { id: 'earrings-example', categoryId: 'earrings', categoryIcon: 'category-earrings.png', name: 'Earrings', image: 'category-earrings.png', imageAlt: 'A display of tiny clay fruit, flower and mushroom earrings', preparationTime: '6–7 days' },
  { id: 'magnet-example', categoryId: 'fridge-magnet', categoryIcon: 'category-fridge-magnets.png', name: 'Fridge Magnet', image: 'category-fridge-magnets.png', imageAlt: 'Small pastel clay vase magnets arranged on a fridge', preparationTime: '6–7 days' },
  { id: 'keychain-placeholder', categoryId: 'keychain', categoryIcon: 'category-key-chains.png', name: 'Key Chains', image: 'category-keychains.png', imageAlt: 'Smiling clay dumpling hanging from a metal keychain', preparationTime: '6–7 days' },
  { id: 'worry-stone-placeholder', categoryId: 'worry-stone', categoryIcon: 'category-worry-stones.png', name: 'Worry Stone', image: 'category-worry-stones.png', imageAlt: 'Three decorated clay worry stones with spiral thumb indentations', preparationTime: '6–7 days' },
  { id: 'phone-charms-example', categoryId: 'phone-charm', categoryIcon: 'category-phone-charm.png', name: 'Phone Charms', image: 'category-phone-charms.png', imageAlt: 'Pastel handmade clay characters hanging from colorful phone straps', preparationTime: '6–7 days' },
  { id: 'stickers-example', categoryId: 'sticker', categoryIcon: 'category-stickers.png', name: 'Stickers', image: 'category-stickers.png', imageAlt: 'Mini Me outfit sticker sheets beside a decorated phone', preparationTime: '6–7 days' },
];
const categories: Category[] = products.map(p => ({ id: p.categoryId, name: p.name, productId: p.id }));
const site = {
  announcement: 'Use(DASHAINTIME) Dashain Discount: 5% off on all items .',
  navigation: [ { label: 'Home', href: '#home' }, { label: 'The Shelf', href: '/products' }, { label: 'About Me', href: '/about' }, { label: 'Say Hello', href: '/say-hello' } ],
  hero: { eyebrow: 'Hand made • From Bhaktapur', titleFirst: 'Welcome to', titleSecond: 'Cozy Corner.', description: 'Story of creativity and personal expression.' },
  productsHero: { eyebrow: 'The Complete Collection', titleFirst: 'Things for', titleSecond: 'Your Corner.', description: 'Small-batch clay pieces made to bring a little more joy to the everyday.' },
  maker: {
    name: 'Apekshya', image: 'creator.webp', imageAlt: 'Apekshya, the maker behind CozyClay',
    paragraphs: [
      'Cozyclay began with a lump of clay, a quiet afternoon in my small dorm, and a need to make things that feel like a small exhale.',
      "Every piece is shaped, painted, and packed by me. They might have tiny differences, but that’s the lovely bit: no two are quite alike. I’m still figuring it out, still making them with my hands, and very happy that you’re here.",
    ],
  },
  sayHello: {
    eyebrow: 'Come Say Hello',
    titleFirst: 'Let’s Make',
    titleSecond: 'Something Nice.',
    description: 'Have an idea on your mind, have a question about a piece, or just want to share a photo of your cozy corner?',
    instagramHandle: '@cozyclay.np',
  },
  contact: {
    email: 'apekshyashrestha12@gmail.com', whatsapp: 'https://wa.link/mxolfd',
    socials: [
      { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/cozyclay.np/' },
      { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/profile.php?id=61565341070527' },
      { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@cozyclay.np' },
    ],
  },
  copyright: '© 2025 cozyclay.store',
};
// Replace these accessors with a CMS adapter later; components retain the same data shape.
export function getSiteContent() { return site; }
export function getCategories() { return categories; }
export function getCategoryProducts() { return categories.map(c => products.find(p => p.id === c.productId)!); }
export const getFeaturedProducts = getBestsellers;
