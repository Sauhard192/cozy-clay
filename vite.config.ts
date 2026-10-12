import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imageOptimizerPlugin } from './scripts/optimize-images.mjs';

export default defineConfig(({ mode }) => ({
  plugins: [imageOptimizerPlugin(), react()],
  base: mode === 'github-pages' ? '/cozy-clay/' : '/',
}));
