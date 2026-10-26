/**
 * Finds every media file the site uses, as paths relative to wp-content/uploads
 * (or "ext/..." keys from src/lib/external-assets.json). Shared by
 * download-media.mjs and optimize-assets.mjs so both see the same list.
 *
 * Files are found by scanning src/ for media("...") calls and plain upload paths
 * in data arrays, so new assets added the same way are picked up automatically.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, extname } from "node:path";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if ([".ts", ".tsx"].includes(extname(e.name))) out.push(p);
  }
  return out;
}

/** Returns { paths: string[] (sorted), external: { "ext/...": url } }. */
export async function findMediaPaths(root) {
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
    for (const m of src.matchAll(/["'`]((?:20\d\d\/\d\d|elementor\/thumbs)\/[^"'`\s$]+\.(?:webp|png|jpe?g|gif|svg|mp4|webm|glb|gltf|woff2?))["'`]/g)) paths.add(m[1]);
  }

  return { paths: [...paths].sort(), external };
}
