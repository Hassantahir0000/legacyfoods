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
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findMediaPaths } from "./lib/media-paths.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const WP = "https://legacyfoods.pk/wp-content/uploads";
const OUT = join(root, "public", "media");

const { paths: list, external } = await findMediaPaths(root);

let ok = 0, skipped = 0, failed = 0;
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
