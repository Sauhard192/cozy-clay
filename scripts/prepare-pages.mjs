import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Real entry files let GitHub Pages serve direct visits and refreshes without SPA rewrites.
const output = resolve(process.argv[2] || 'dist');
const html = await readFile(resolve(output, 'index.html'), 'utf8');
for (const route of ['about', 'say-hello', 'products']) {
  await mkdir(resolve(output, route), { recursive: true });
  await writeFile(resolve(output, route, 'index.html'), html);
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Prepared direct page entries for GitHub Pages.');
