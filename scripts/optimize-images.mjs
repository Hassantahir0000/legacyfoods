#!/usr/bin/env node
/**
 * Makes the product-page images light enough to load quickly.
 *
 *   npm run optimize-images
 *
 * The originals are far larger than they're ever shown: bowl photos up to 1 MB for
 * a ~400px circle, ingredient PNGs up to 1.2 MB for a ~180px sprite, 1.6 MB banners.
 * This script writes resized WebP copies (2× their largest on-screen size) to
 * public/img/ and lists them in src/lib/optimized-images.json; `image()` in
 * src/lib/media.ts serves the copy when there is one, otherwise the original.
 *
 * Images are found in src/lib/products.ts (banner / bowl / accent fields), so new
 * products are picked up automatically — rerun after adding one. Sources come from
 * public/media/ if you've run `npm run download-media`, otherwise from WordPress.
 * Already-converted files are skipped; delete public/img/ to redo them all.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const WP = "https://legacyfoods.pk/wp-content/uploads";
const OUT = join(root, "public", "img");
const MANIFEST = join(root, "src", "lib", "optimized-images.json");

// Longest side in px, and WebP quality, per kind of image.
const sizes = {
  banner: { max: 1920, quality: 78 },
  bowl: { max: 800, quality: 80 },
  accent: { max: 400, quality: 82 },
  pattern: { max: 1600, quality: 70 },
};

const src = await readFile(join(root, "src/lib/products.ts"), "utf8");
const jobs = new Map(); // path -> kind
for (const kind of ["banner", "bowl", "accent"]) {
  for (const m of src.matchAll(new RegExp(`${kind}:\\s*"([^"]+)"`, "g"))) jobs.set(m[1], kind);
}
jobs.set("2026/09/Untitled-design-35.png", "pattern"); // product-section background texture

async function original(p) {
  try {
    return await readFile(join(root, "public", "media", p));
  } catch {}
  const res = await fetch(`${WP}/${p}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const manifest = {};
let made = 0, skipped = 0, failed = 0, before = 0, after = 0;

for (const [p, kind] of [...jobs].sort()) {
  const rel = p.replace(/\.[a-z]+$/i, "") + ".webp";
  const dest = join(OUT, rel);
  try {
    if ((await stat(dest)).size > 0) {
      manifest[p] = `/img/${rel}`;
      skipped++;
      continue;
    }
  } catch {}
  try {
    const input = await original(p);
    const { max, quality } = sizes[kind];
    const output = await sharp(input)
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, output);
    manifest[p] = `/img/${rel}`;
    made++;
    before += input.length;
    after += output.length;
    console.log(`✓ ${p}  ${(input.length / 1024).toFixed(0)} KB → ${(output.length / 1024).toFixed(0)} KB`);
  } catch (err) {
    failed++;
    console.warn(`✗ ${p} — ${err.message}`);
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nDone: ${made} converted (${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB), ${skipped} already present, ${failed} failed.`);
console.log("Commit public/img/ and src/lib/optimized-images.json.");
if (failed) process.exitCode = 1;
