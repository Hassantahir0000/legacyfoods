import external from "./external-assets.json";
import optimized from "./optimized-assets.json";

/**
 * Every image, video, font and 3D model goes through `media()`.
 *
 * Images, 3D models and fonts are served from this site as the light copies made by
 * `npm run optimize-assets` (public/img, public/models, public/fonts). Anything
 * without a copy — videos, or a file added since the script last ran — falls back
 * to the original: by default straight from the old WordPress uploads folder; after
 * `npm run download-media` copies everything into public/media, set
 * NEXT_PUBLIC_LOCAL_MEDIA=1 and the site serves its own originals (do this before
 * you switch the domain away from WordPress).
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
  return optimizedMap[path] ?? mediaOriginal(path);
}

/** The untouched original file. Use for social-share images, where WebP isn't always supported. */
export function mediaOriginal(path: string): string {
  if (LOCAL) return `/media/${path}`;
  if (path.startsWith("ext/")) return externalMap[path] ?? `/media/${path}`;
  return `${WP_UPLOADS}/${path}`;
}
