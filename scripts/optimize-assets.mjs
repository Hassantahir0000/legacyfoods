#!/usr/bin/env node
/**
 * Makes the site's images, 3D models and brand font light and serves them from
 * this site instead of WordPress.
 *
 *   npm run optimize-assets
 *
 * The originals are far larger than they're ever shown: 2000px ingredient cut-outs
 * displayed at ~108px, 2048×2560 posters shown at ~600px, a 5 MB PNG banner, and
 * 3D packs carrying a single 4700px texture (11 MB for one pack). This writes:
 *
 *   public/img/…webp     images resized to fit their largest on-screen size (×2 for sharp screens)
 *   public/models/…glb   3D models with textures capped at 2048px
 *   public/fonts/…       the brand font, copied so it loads from this domain
 *
 * and lists them in src/lib/optimized-assets.json. `media()` in src/lib/media.ts
 * serves the optimized copy whenever there is one, so pages need no changes.
 *
 * Files are found the same way as `npm run download-media` (scanning src/), so rerun
 * this after adding images. Sources come from public/media/ if you've downloaded
 * them, otherwise from WordPress / the Lovable hosts. Already-converted files are
 * skipped; delete public/img, public/models or public/fonts to redo them.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { findMediaPaths } from "./lib/media-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const WP = "https://legacyfoods.pk/wp-content/uploads";
const MANIFEST = join(root, "src", "lib", "optimized-assets.json");
const TEXTURE_MAX = 2048;

const { paths, external } = await findMediaPaths(root);

// Product bowls and floating accents have known display sizes (see globals.css).
const products = await readFile(join(root, "src/lib/products.ts"), "utf8");
const kinds = new Map();
for (const kind of ["bowl", "accent"]) {
  for (const m of products.matchAll(new RegExp(`${kind}:\\s*"([^"]+)"`, "g"))) kinds.set(m[1], kind);
}

/** Bounding box (px) an image is resized to fit inside. */
function imageBox(p) {
  if (kinds.get(p) === "bowl") return 800; // ~400px circle
  if (kinds.get(p) === "accent") return 400; // ≤ 9.4vw sprite
  if (/^2026\/07\/\d+-\d+\.png$|coated-element|potato-crips|stick-1|ChatGPT-Image/.test(p)) return 400; // category-tile / accent cut-outs (~108–180px)
  if (/^ext\/(.*element.*|el-.*|nimko-chili-lemon\.png)$/.test(p)) return 800; // The Range garnishes, up to ~416px
  if (/^2026\/09\/(quality|halal-3|hygiene|snack)\.png$/.test(p)) return 440; // trust icons (220px)
  return null; // default: fit inside 1920×1200
}

async function original(p) {
  try {
    return await readFile(join(root, "public", "media", p));
  } catch {}
  const url = p.startsWith("ext/") ? external[p] : `${WP}/${p}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function optimizeImage(p, input) {
  const box = imageBox(p);
  const out = await sharp(input)
    .rotate()
    .resize({ width: box ?? 1920, height: box ?? 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer();
  // An already-small WebP can grow when re-encoded; keep the original then.
  return out.length >= input.length && /\.webp$/i.test(p) ? input : out;
}

/** Re-encodes oversized textures inside a binary glTF, keeping their format. */
async function optimizeModel(input) {
  const jsonLen = input.readUInt32LE(12);
  const json = JSON.parse(input.subarray(20, 20 + jsonLen).toString("utf8"));
  const binStart = 20 + jsonLen + 8;
  const bin = input.subarray(binStart, binStart + input.readUInt32LE(20 + jsonLen));

  const views = (json.bufferViews ?? []).map((v) => bin.subarray(v.byteOffset ?? 0, (v.byteOffset ?? 0) + v.byteLength));
  for (const img of json.images ?? []) {
    if (img.bufferView === undefined) continue;
    const src = views[img.bufferView];
    const meta = await sharp(src).metadata();
    if (Math.max(meta.width, meta.height) <= TEXTURE_MAX && src.length < 1024 * 1024) continue;
    let pipeline = sharp(src).resize({ width: TEXTURE_MAX, height: TEXTURE_MAX, fit: "inside", withoutEnlargement: true });
    pipeline = img.mimeType === "image/png" ? pipeline.png({ compressionLevel: 9, palette: false }) : pipeline.jpeg({ quality: 85, mozjpeg: true });
    const out = await pipeline.toBuffer();
    if (out.length < src.length) views[img.bufferView] = out;
  }

  // Repack the binary chunk with every view 4-byte aligned.
  const parts = [];
  let offset = 0;
  views.forEach((buf, i) => {
    const pad = (4 - (offset % 4)) % 4;
    if (pad) parts.push(Buffer.alloc(pad));
    offset += pad;
    json.bufferViews[i].byteOffset = offset;
    json.bufferViews[i].byteLength = buf.length;
    parts.push(buf);
    offset += buf.length;
  });
  parts.push(Buffer.alloc((4 - (offset % 4)) % 4));
  const newBin = Buffer.concat(parts);
  json.buffers[0].byteLength = offset;

  let jsonBuf = Buffer.from(JSON.stringify(json), "utf8");
  jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20)]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // "glTF"
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + newBin.length, 8);
  const chunk = (len, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(len, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([header, chunk(jsonBuf.length, 0x4e4f534a), jsonBuf, chunk(newBin.length, 0x004e4942), newBin]);
}

const manifest = {};
let made = 0, skipped = 0, failed = 0, before = 0, after = 0;

for (const p of paths) {
  let rel, transform;
  if (/\.(png|jpe?g|webp)$/i.test(p)) {
    rel = `img/${p.replace(/\.[a-z]+$/i, "")}.webp`;
    transform = (input) => optimizeImage(p, input);
  } else if (/\.glb$/i.test(p)) {
    rel = `models/${p}`;
    transform = optimizeModel;
  } else if (/\.woff2?$/i.test(p)) {
    rel = `fonts/${p}`;
    transform = async (input) => input;
  } else {
    continue; // videos, svgs and gifs are left as they are
  }

  const dest = join(root, "public", rel);
  try {
    if ((await stat(dest)).size > 0) {
      manifest[p] = `/${rel}`;
      skipped++;
      continue;
    }
  } catch {}
  try {
    const input = await original(p);
    const output = await transform(input);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, output);
    manifest[p] = `/${rel}`;
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
console.log("Commit public/img/, public/models/, public/fonts/ and src/lib/optimized-assets.json.");
if (failed) process.exitCode = 1;
