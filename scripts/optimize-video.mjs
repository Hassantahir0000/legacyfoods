#!/usr/bin/env node
/**
 * Makes the About-page scroll video smooth to scrub.
 *
 *   npm run optimize-video
 *
 * The original is a 4K (3840×2160) H.264 file with keyframes far apart, so every
 * jump to a new frame costs the browser 50–160 ms of decoding — scrubbing can't
 * go faster than ~8–10 fps. This script writes two scrub-friendly copies:
 *
 *   public/video/about-scroll-1080.mp4   desktop / tablet
 *   public/video/about-scroll-720.mp4    phones
 *
 * both with every frame a keyframe (the clip is only ~120 frames), so each seek
 * decodes exactly one frame.
 * The About page picks them up automatically (falls back to the original if absent).
 *
 * Source: public/media/2026/08/...mp4 if you've run `npm run download-media`,
 * otherwise it's downloaded from the WordPress site. Uses `ffmpeg` from your PATH,
 * or temporarily installs the `ffmpeg-static` npm package if you don't have one.
 */
import { spawnSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const REL = "2026/08/WEBSITE-SCROLL-EFFECT-COCOTEA-new-updated-.mp4";
const local = join(root, "public", "media", REL);
const outDir = join(root, "public", "video");

async function findFfmpeg() {
  const probe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (probe.status === 0) return "ffmpeg";
  console.log("ffmpeg not found on PATH — installing ffmpeg-static temporarily (one-off, ~80 MB)…");
  execSync("npm install --no-save ffmpeg-static", { cwd: root, stdio: "inherit" });
  const { default: path } = await import(join(root, "node_modules", "ffmpeg-static", "index.js"));
  return path;
}

let source = local;
if (!existsSync(local)) {
  const url = `https://legacyfoods.pk/wp-content/uploads/${REL}`;
  console.log(`Downloading source video from ${url} …`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Couldn't download (HTTP ${res.status}). Put the original at public/media/${REL} and rerun.`);
    process.exit(1);
  }
  mkdirSync(dirname(local), { recursive: true });
  writeFileSync(local, Buffer.from(await res.arrayBuffer()));
  source = local;
}

const ffmpeg = await findFfmpeg();
mkdirSync(outDir, { recursive: true });

const targets = [
  { name: "about-scroll-1080.mp4", width: 1920, crf: 22 },
  { name: "about-scroll-720.mp4", width: 1280, crf: 24 },
];

for (const t of targets) {
  const out = join(outDir, t.name);
  console.log(`Encoding ${t.name} …`);
  const r = spawnSync(
    ffmpeg,
    [
      "-y", "-loglevel", "error", "-i", source, "-an",
      "-vf", `scale=${t.width}:-2:flags=lanczos`,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(t.crf), "-pix_fmt", "yuv420p",
      "-g", "1", "-keyint_min", "1", "-sc_threshold", "0", "-bf", "0",
      "-movflags", "+faststart", out,
    ],
    { stdio: "inherit" }
  );
  if (r.status !== 0) {
    console.error(`ffmpeg failed for ${t.name}`);
    process.exit(1);
  }
  console.log(`  ✓ public/video/${t.name} (${(statSync(out).size / 1048576).toFixed(1)} MB)`);
}

console.log("\nDone. Commit public/video/ and redeploy — the About page uses these automatically.");
