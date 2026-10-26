"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Candidate files for desktop, best first (e.g. the optimized 1080p copy, then the original). */
  desktop: string[];
  /** Candidate files for phones (≤ 767px), best first. */
  mobile: string[];
};

const FPS = 30;
const SMOOTH = 0.2; // how quickly the playhead catches up with the scroll position
const WATCHDOG_MS = 500;

/**
 * A pack tumbling through the air: the video's playhead follows the scroll position.
 *
 * Smooth scrubbing needs two things:
 *  1. Only one seek in flight at a time. Setting currentTime again before the
 *     previous seek finishes cancels it, so the picture freezes while you scroll.
 *     We wait for `seeked`, then jump straight to the latest scroll position.
 *  2. A video that is cheap to seek: run `npm run optimize-video` to make 1080p/720p
 *     copies where every frame is a keyframe (the original is 4K with sparse keyframes,
 *     so each seek costs 50–160 ms).
 * The file is also loaded fully into memory first, so seeks never wait on the network.
 */
export default function ScrollVideo({ desktop, mobile }: Props) {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    let destroyed = false;
    let blobUrl: string | null = null;
    let loading = false;
    let ready = false;
    let inView = false;
    let duration = 0;
    let target = 0;
    let current = 0;
    let lastSeek = -1;
    let busy = false;
    let pending: number | null = null;
    let raf = 0;
    let lastTs = 0;
    let watchdog: ReturnType<typeof setTimeout> | undefined;

    const computeTarget = () => {
      const range = Math.max(1, track.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / range));
      target = p * Math.max(0, duration - 0.5 / FPS);
    };

    const seekTo = (t: number) => {
      t = Math.max(0, Math.min(t, duration - 0.01));
      busy = true;
      lastSeek = t;
      clearTimeout(watchdog);
      watchdog = setTimeout(() => {
        busy = false;
        kick();
      }, WATCHDOG_MS);
      video.currentTime = t;
    };

    const onSeeked = () => {
      busy = false;
      clearTimeout(watchdog);
      if (pending !== null) {
        const next = pending;
        pending = null;
        if (Math.abs(next - lastSeek) >= 0.005) seekTo(next);
      }
      kick();
    };

    const tick = (ts: number) => {
      raf = 0;
      if (!ready || !inView || destroyed) return;
      computeTarget();
      const dt = lastTs ? Math.min(64, ts - lastTs) : 16.7;
      lastTs = ts;
      current += (target - current) * (1 - Math.pow(1 - SMOOTH, dt / 16.67));
      if (Math.abs(target - current) < 0.015) current = target;

      if (busy) {
        pending = current; // remember only the latest position
      } else if (lastSeek < 0 || Math.abs(current - lastSeek) >= 0.5 / FPS || (current === target && lastSeek !== current)) {
        seekTo(current);
      }
      if (Math.abs(current - target) >= 0.015 || lastSeek !== current || busy) raf = requestAnimationFrame(tick);
    };

    function kick() {
      if (!raf && inView && ready && !destroyed) {
        lastTs = 0;
        raf = requestAnimationFrame(tick);
      }
    }

    const onMeta = () => {
      if (!isFinite(video.duration) || video.duration <= 0) return;
      duration = video.duration;
      ready = true;
      computeTarget();
      current = target;
      kick();
    };

    // Load the first candidate that exists, fully into memory (blob), falling back to streaming.
    const load = async () => {
      if (loading) return;
      loading = true;
      const list = window.matchMedia("(max-width: 767px)").matches ? mobile : desktop;
      for (const url of list) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const blob = await res.blob();
          if (destroyed) return;
          blobUrl = URL.createObjectURL(blob);
          video.src = blobUrl;
          return;
        } catch {
          // Cross-origin without CORS, or offline: try the next one.
        }
      }
      if (!destroyed) video.src = list[list.length - 1]; // stream as a last resort
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("seeked", onSeeked);
    const onScroll = () => kick();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) {
          load();
          computeTarget();
          kick();
        }
      },
      { rootMargin: "150% 0px 150% 0px" }
    );
    io.observe(track);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("seeked", onSeeked);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [desktop, mobile]);

  return (
    <section className="scroll-video" ref={trackRef} aria-label="Cocotea pack in motion">
      <div className="scroll-video__sticky">
        <video ref={videoRef} muted playsInline preload="auto" disablePictureInPicture />
      </div>
    </section>
  );
}
