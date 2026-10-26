# Legacy Foods — Next.js site

A Next.js 15 (App Router, TypeScript) rebuild of **legacyfoods.pk**, replacing the WordPress + Elementor site. Same pages, same URLs, same look — including the 3D packs, scroll animations and the flavour lineup.

## Pages

| URL | What it is |
| --- | --- |
| `/` | Home: brand film, "Welcome to Legacy Foods" scroll intro, curved marquee, category tiles, 3D "magical flavors" (three.js), The Range lineup with flavour detail view, story slider, "Why Snack Lovers Trust Us", pack slider |
| `/about-us` | Scroll-scrubbed pack video, factory image, promise strips, the five production stages, outro |
| `/nimko` `/snacks` `/popcorn` `/coated-peanut` | Category pages: banner + one band per product (spinning name ring, 3D pack via `<model-viewer>`, Buy Now → Daraz) |
| `/gallery` | Featured posters + photo grid with lightbox |
| `/faqs` | FAQ accordion (with FAQ structured data for Google) |
| `/contact` | Contact info, socials, distributor section, Google Map, message form |

A full page load shows the Legacy Foods preloader (the logo drawing itself in red, then fading out) — same artwork and timing as the WordPress site: at least 1.8 s, at most 3 s. It lives in `src/components/Preloader.tsx`; add `?lfpre=5000` to any URL to preview it longer.

Also included: sitemap.xml, robots.txt, Open Graph tags, a 404 page, and redirects for old URLs (e.g. `/coated-peanuts` → `/coated-peanut`).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Requires Node.js 18.18+ (20+ recommended).

## Before you switch the domain: copy the media

Images, videos, fonts and 3D models currently load from the old WordPress server (`legacyfoods.pk/wp-content/uploads`), plus a few files the old site pulled from Lovable preview hosts. Once WordPress is gone those URLs die, so copy everything in first:

```bash
npm run download-media          # saves ~everything into public/media/
```

Then set `NEXT_PUBLIC_LOCAL_MEDIA=1` in `.env.local` **and** in your host's environment variables, and redeploy. The script lists anything that failed; rerunning it only fetches what's missing.

## Smooth About-page video

The scroll-scrubbed video on `/about-us` is a 4K file with keyframes far apart, so the browser can only redraw it ~10 times a second while you scroll. Make scrub-friendly copies once:

```bash
npm run optimize-video     # writes public/video/about-scroll-1080.mp4 and -720.mp4
```

It uses `ffmpeg` if installed (otherwise fetches a temporary copy), and downloads the source video from WordPress if you haven't run `download-media`. Commit `public/video/` and redeploy; the page uses them automatically and falls back to the original if they're missing. If you replace the video later, rerun the command.

## Contact form

The form posts to `/api/contact`, which emails the message via SMTP (replacing Contact Form 7). Copy `.env.example` to `.env.local` and fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and optionally `CONTACT_TO`. Until these are set, the form shows a friendly error with the email address.

## Editing content

- **Products** (names, colours, 3D models, Daraz links): `src/lib/products.ts` — add/remove entries; pages update automatically.
- **Contact details, socials, menu links**: `src/lib/site.ts`
- **Home page text and slides**: `src/app/page.tsx`; The Range flavours: `src/components/home/TheRange.tsx`
- **About stages**: `src/app/about-us/page.tsx` · **FAQs**: `src/app/faqs/page.tsx` · **Gallery images**: `src/app/gallery/page.tsx`
- **Styles**: `src/app/globals.css` (organised by page/section)

New images: put them in `public/media/…` and reference them with `media("your/path.webp")`.

## Deploy

Easiest is **Vercel**: push this folder to a GitHub repo → "Import project" on vercel.com → add the environment variables → deploy → point `legacyfoods.pk` DNS to Vercel. Any Node host (Netlify, Render, a VPS with `npm start`) works too.

## Notes on differences from the WordPress site

- The YouTube film loads on click (poster + play button) instead of embedding the player up front — much faster first load.
- The Nimko/Snacks/Popcorn hover cut-outs on the home tiles were inline base64 images on the old site; they now use the matching ingredient images from the uploads folder.
- The duplicated paragraph in the About → Infusion section was shown once.
- Coated Peanut "Buy Now" buttons pointed to `#` on the live site; they now go to the contact page until Daraz links are added in `products.ts`.
- GSAP ScrollSmoother is replaced by Lenis for smooth scrolling.
