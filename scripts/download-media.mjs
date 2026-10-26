#!/usr/bin/env node
/**
 * Copies every image, video, font and 3D model the site uses from the old
 * WordPress server (and the Lovable preview hosts) into public/media/.
 *
 *   npm run download-media
 *
 * Then set NEXT_PUBLIC_LOCAL_MEDIA=1 (in .env.local and on your host) so the
 * site serves its own copies. Run this BEFORE the WordPress server is switched off.
 *
 * It finds files by scanning src/ for media("...") calls, so new assets you add
 * the same way are picked up automatically. Already-downloaded files are skipped.
 */
import { readFile, readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const WP = "https://legacyfoods.pk/wp-content/uploads";
const OUT = join(root, "public", "media");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if ([".ts", ".tsx"].includes(extname(e.name))) out.push(p);
  }
  return out;
}

const external = JSON.parse(await readFile(join(root, "src/lib/external-assets.json"), "utf8"));
delete external._comment;

const paths = new Set(Object.keys(external));
const re = /media\(\s*[`"']([^`"'$]+)[`"']\s*\)/g;
// Template literals with ${} (e.g. pouches-${n}) are expanded from these known lists.
const expansions = [
  ...["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((n) => `2026/10/pouches-${n}.webp`),
  ...["01", "03", "04", "07"].map((n) => `2026/06/cocotea-pouch-all-${n}.webp`),
];
expansions.forEach((p) => paths.add(p));

for (const file of await walk(join(root, "src"))) {
  const src = await readFile(file, "utf8");
  for (const m of src.matchAll(re)) paths.add(m[1]);
  // Plain upload paths in data files (products.ts, site.ts, page data arrays)
  for (const m of src.matchAll(/["'`]((?:20\d\d\/\d\d|elementor\/thumbs)\/[^"'`\s]+\.(?:webp|png|jpe?g|gif|svg|mp4|webm|glb|gltf|woff2?))["'`]/g)) paths.add(m[1]);
}

let ok = 0, skipped = 0, failed = 0;
const list = [...paths].sort();
console.log(`Found ${list.length} media files.`);

for (const p of list) {
  const dest = join(OUT, p);
  try {
    if ((await stat(dest)).size > 0) { skipped++; continue; }
  } catch {}
  const url = p.startsWith("ext/") ? external[p] : `${WP}/${p}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    ok++;
    console.log(`✓ ${p} (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    failed++;
    console.warn(`✗ ${p} — ${err.message} (${url})`);
  }
}

console.log(`\nDone: ${ok} downloaded, ${skipped} already present, ${failed} failed.`);
if (!failed) console.log("Now set NEXT_PUBLIC_LOCAL_MEDIA=1 in .env.local and on your host.");
else process.exitCode = 1;
