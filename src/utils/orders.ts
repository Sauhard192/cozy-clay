import type { Product, ProductPrice } from '../content/products';
import { formatPrice } from '../content/products';
import { getSiteContent } from '../content/site';

export function quantityPrice(price: ProductPrice, quantity: number): ProductPrice {
  return typeof price === 'number' ? price * quantity : { min: price.min * quantity, max: price.max * quantity };
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${getSiteContent().contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(product: Product, quantity: number, note: string) {
  // Follow the deployed domain/base path; local development shares the public site.
  const liveBase = import.meta.env.DEV
    ? getSiteContent().publicUrl
    : new URL(import.meta.env.BASE_URL, window.location.origin).href;
  const photoUrl = new URL(`assets/${product.image}`, liveBase).href;
  return [
    'Hi CozyClay! I’d like to order:',
    '',
    `Product: ${product.name}`,
    `Category: ${product.categoryName}`,
    `Quantity: ${quantity}`,
    `Price per piece: ${formatPrice(product.price)}`,
    `Total: ${formatPrice(quantityPrice(product.price, quantity))}`,
    ...(typeof product.price === 'object' ? ['', 'Please confirm the final price for this order.'] : []),
    ...(note.trim() ? [`Note: ${note.trim()}`] : []),
    '',
    photoUrl,
  ].join('\n');
}

export const customOrderMessage = 'Hi CozyClay! I’d like to discuss a custom order.';
