import catalogue from './products.json';

export type ProductPrice = number | { min: number; max: number };
export type ProductTag = 'new' | 'bestseller';
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  image: string;
  price: ProductPrice;
  addedAt: string;
  tag?: ProductTag;
}
export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'newest';

// Local catalogue adapter: replace this boundary when a CMS is introduced.
const products: Product[] = catalogue.products.map((product) => ({
  ...product,
  tag: product.tag === 'new' || product.tag === 'bestseller' ? product.tag : undefined,
}));
export function getProducts() {
  return products;
}
export function getBestsellers() {
  return products.filter((product) => product.tag === 'bestseller');
}
export function formatPrice(price: ProductPrice) {
  const format = (value: number) => value.toLocaleString('en-NP');
  return typeof price === 'number'
    ? `NRs. ${format(price)}`
    : `NRs. ${format(price.min)}–${format(price.max)}`;
}
export function selectProducts(category: string, sort: ProductSort) {
  const selected = products.filter((product) => category === 'all' || product.categoryId === category);
  const minimum = (price: ProductPrice) => typeof price === 'number' ? price : price.min;
  if (sort === 'price-asc') {
    selected.sort((a, b) => minimum(a.price) - minimum(b.price));
  }
  if (sort === 'price-desc') {
    selected.sort((a, b) => minimum(b.price) - minimum(a.price));
  }
  if (sort === 'newest') {
    selected.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }
  return selected;
}
