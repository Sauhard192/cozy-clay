import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, readdir, stat, access, mkdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const raster = /\.(jpe?g|png|webp|avif)$/i;
const derivative = /-\d+-[a-f0-9]{10}\.webp$/i;
const widths = [320, 640, 960];
const quality = 82;
const generator = 'cozy-image-optimizer-v1';

async function exists(filename) {
  try { await access(filename); return true; } catch { return false; }
}
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(filename) : entry.isFile() ? [filename] : [];
  }));
  return groups.flat();
}
async function writeJson(filename, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  if (await exists(filename) && await readFile(filename, 'utf8') === text) return;
  const temporary = `${filename}.${randomUUID()}.tmp`;
  await writeFile(temporary, text);
  await rename(temporary, filename);
}

export async function optimizeImages(root = projectRoot) {
  const assetRoot = path.join(root, 'public/assets');
  const mappingPath = path.join(root, 'src/content/image-variants.json');
  const manifestPath = path.join(root, 'asset-manifest.json');
  const mappings = JSON.parse(await readFile(mappingPath, 'utf8'));
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const recordedDerivatives = new Set(Object.entries(manifest)
    .filter(([, value]) => typeof value === 'object' && value?.format === 'webp')
    .map(([filename]) => path.join(root, filename)));
  const sources = (await filesIn(assetRoot)).filter((filename) =>
    raster.test(filename) && !derivative.test(filename) && !recordedDerivatives.has(filename));
  let generated = 0;
  let cursor = 0;
  async function worker() {
    while (cursor < sources.length) {
      const filename = sources[cursor++];
      const relative = path.relative(assetRoot, filename).split(path.sep).join('/');
      const input = await readFile(filename);
      const metadata = await sharp(input).metadata();
      // Preserve animated raster artwork instead of turning it into a still image.
      if ((metadata.pages ?? 1) > 1) continue;
      const sourceWidth = [5, 6, 7, 8].includes(metadata.orientation) ? metadata.height : metadata.width;
      if (!sourceWidth) throw new Error(`Cannot read image dimensions: ${relative}`);
      const hash = createHash('sha256').update(input).update(`${generator}:${quality}:${widths}`).digest('hex').slice(0, 10);
      const sizes = [...new Set(widths.map((width) => Math.min(width, sourceWidth)))].sort((a, b) => a - b);
      const candidates = [];
      for (const width of sizes) {
        const stem = path.basename(filename, path.extname(filename));
        const destination = path.join(path.dirname(filename), `${stem}-${width}-${hash}.webp`);
        if (!await exists(destination)) {
          await mkdir(path.dirname(destination), { recursive: true });
          const output = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, alphaQuality: 100 }).toBuffer();
          await writeFile(destination, output);
          generated++;
        }
        const outputRelative = path.relative(assetRoot, destination).split(path.sep).join('/');
        candidates.push({ src: `/assets/${outputRelative}`, width, bytes: (await stat(destination)).size });
        manifest[`public/assets/${outputRelative}`] = {
          source: `public/assets/${relative}`, width, format: 'webp', quality, alphaQuality: 100, generatedBy: generator,
        };
      }
      mappings[relative] = candidates;
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  // A deleted source must not leave an active mapping to outdated artwork.
  for (const key of Object.keys(mappings)) {
    if (!await exists(path.join(assetRoot, key))) delete mappings[key];
  }
  await writeJson(mappingPath, Object.fromEntries(Object.entries(mappings).sort(([a], [b]) => a.localeCompare(b))));
  await writeJson(manifestPath, manifest);
  return { sources: sources.length, generated };
}

export function imageOptimizerPlugin() {
  let root = projectRoot;
  let pending = Promise.resolve();
  const run = () => {
    const next = pending.then(() => optimizeImages(root));
    pending = next.catch(() => {});
    return next;
  };
  return {
    name: 'cozy-image-optimizer',
    configResolved(config) { root = config.root; },
    async buildStart() { await run(); },
    configureServer(server) {
      let timer;
      const changed = (filename) => {
        const normalized = filename.split(path.sep).join('/');
        const isSource = normalized.includes('/public/assets/') && raster.test(filename) && !derivative.test(filename);
        if (!isSource && !normalized.endsWith('/src/content/products.json')) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          void run().catch((error) => {
            server.config.logger.error(`[image optimizer] ${error.message}`);
            server.ws.send({ type: 'error', err: { message: error.message, stack: error.stack } });
          });
        }, 250);
      };
      server.watcher.add(path.join(root, 'public/assets'));
      for (const event of ['add', 'change', 'unlink']) server.watcher.on(event, changed);
      server.httpServer?.once('close', () => {
        clearTimeout(timer);
        for (const event of ['add', 'change', 'unlink']) server.watcher.off(event, changed);
      });
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await optimizeImages();
  console.log(`Image optimization: ${result.sources} originals checked, ${result.generated} WebP variants generated.`);
}
