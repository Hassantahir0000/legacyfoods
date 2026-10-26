import external from "./external-assets.json";
import optimized from "./optimized-images.json";

/**
 * Every image, video, font and 3D model goes through `media()`.
 *
 * By default files load straight from the old WordPress uploads folder, so the
 * site works immediately. After `npm run download-media` copies everything into
 * public/media, set NEXT_PUBLIC_LOCAL_MEDIA=1 and the site serves its own copies
 * (do this before you switch the domain away from WordPress).
 *
 * Paths are relative to wp-content/uploads, e.g. media("2026/10/peanut.webp").
 * Paths starting with "ext/" are files the old site loaded from other hosts
 * (see external-assets.json).
 */
const WP_UPLOADS = "https://legacyfoods.pk/wp-content/uploads";
const LOCAL = process.env.NEXT_PUBLIC_LOCAL_MEDIA === "1";

const externalMap = external as Record<string, string>;
const optimizedMap = optimized as Record<string, string>;

export function media(path: string): string {
  if (LOCAL) return `/media/${path}`;
  if (path.startsWith("ext/")) return externalMap[path] ?? `/media/${path}`;
  return `${WP_UPLOADS}/${path}`;
}

/** The resized WebP copy made by `npm run optimize-images` if there is one, else `media(path)`. */
export function image(path: string): string {
  return optimizedMap[path] ?? media(path);
}
