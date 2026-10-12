import './styles/fonts.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/site.css';
import App from './App';
import { getImageProps, heroImageSizes } from './content/images';
import { routePath } from './utils/paths';

// Start the main photo while fonts prepare, only on the homepage.
if (routePath(location.pathname) === '/') {
  const photo = getImageProps('images/hero/hero-perfect-surprise.png', heroImageSizes);
  const preload = document.createElement('link');
  preload.rel = 'preload';
  preload.as = 'image';
  preload.href = photo.src;
  if ('srcSet' in photo && photo.srcSet) preload.imageSrcset = photo.srcSet;
  preload.imageSizes = heroImageSizes;
  preload.fetchPriority = 'high';
  document.head.append(preload);
}
async function start() {
  // Render with the brand fonts ready; recover if fonts fail or take too long.
  await Promise.race([
    Promise.all([
      document.fonts.load('400 1rem "Cherry Bomb One"'),
      document.fonts.load('500 1rem Quicksand'),
      document.fonts.load('700 1rem Quicksand'),
    ]).catch(() => undefined),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
void start();
