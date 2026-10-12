import type { Plugin } from 'vite';

export function optimizeImages(root?: string): Promise<{ sources: number; generated: number }>;
export function imageOptimizerPlugin(): Plugin;
