import { siteUrl } from '../utils/paths';
import variants from './image-variants.json';

type ImageVariant = { src: string; width: number; bytes: number };
const images: Record<string, ImageVariant[]> = variants;

// Keep the preload sizes in index.html aligned with the hero's layout.
export const heroImageSizes = '(min-width: 1024px) 12.24rem, (min-width: 768px) 11.04rem, 34.5vw';
export const cardImageSizes = '(min-width: 768px) 12.5rem, 10rem';

export function getImageProps(filename: string, sizes: string) {
  const candidates = images[filename];
  if (!candidates) return { src: siteUrl(`/assets/${filename}`) };

  return {
    src: siteUrl(candidates[candidates.length - 1].src),
    srcSet: candidates.map(({ src, width }) => `${siteUrl(src)} ${width}w`).join(', '),
    sizes,
  };
}
