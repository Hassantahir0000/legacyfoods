"use client";

import { useEffect, useRef } from "react";
import { media } from "@/lib/media";

const TITLE = "Legacy Foods";

/**
 * "Welcome to Legacy Foods": a 240vh scroll track with a sticky frame.
 * As you scroll, the badge fades in and each letter flies in from a random
 * spot, spinning and un-blurring into place (same maths as the original).
 */
export default function CloudHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const badge = badgeRef.current;
    const heading = headingRef.current;
    if (!track || !badge || !heading) return;

    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));

    const letters = Array.from(heading.querySelectorAll<HTMLSpanElement>(".legacy-letter")).map((el) => {
      const angle = rnd(0, Math.PI * 2);
      const dist = rnd(250, 500);
      const winStart = rnd(0.28, 0.65);
      return {
        el,
        startX: Math.cos(angle) * dist,
        startY: Math.sin(angle) * dist,
        startR: rnd(-60, 60),
        startS: rnd(0.1, 0.5),
        winStart,
        winEnd: Math.min(1, winStart + rnd(0.25, 0.4)),
      };
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduce ? 1 : clamp(-rect.top / (track.offsetHeight - vh), 0, 1);
      const b = easeOut(clamp(p / 0.15, 0, 1));
      badge.style.opacity = String(b);
      badge.style.transform = `translateY(${lerp(-20, 0, b)}px)`;
      letters.forEach((l) => {
        const e = easeOut(clamp((p - l.winStart) / (l.winEnd - l.winStart), 0, 1));
        l.el.style.opacity = String(e);
        l.el.style.transform = `translate(${lerp(l.startX, 0, e)}px,${lerp(l.startY, 0, e)}px) rotate(${lerp(l.startR, 0, e)}deg) scale(${lerp(l.startS, 1, e)})`;
        l.el.style.filter = `blur(${lerp(12, 0, e)}px)`;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        tick();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="legacy-scroll-wrapper" ref={trackRef} aria-label="Welcome to Legacy Foods">
      <div className="legacy-cloud-fill" />
      {/* eslint-disable @next/next/no-img-element */}
      <img className="legacy-cloud legacy-cloud--top" src={media("2026/07/oblak1.webp")} alt="" />
      {[0, 1, 2, 3].map((i) => (
        <img key={`l${i}`} className={`legacy-cloud legacy-cloud--left-${i}`} src={media("2026/07/levioblak.webp")} alt="" />
      ))}
      <div className="legacy-sticky-frame">
        <div className="legacy-badge-container" ref={badgeRef}>
          <div className="legacy-pill-box"><span className="legacy-pill-text">WELCOME TO</span></div>
        </div>
        <h1 className="legacy-main-heading" ref={headingRef} aria-label={TITLE}>
          {TITLE.split("").map((ch, i) =>
            ch === " " ? <span key={i} className="legacy-space" /> : <span key={i} className="legacy-letter" aria-hidden="true">{ch}</span>
          )}
        </h1>
      </div>
      {[0, 1, 2].map((i) => (
        <img key={`r${i}`} className={`legacy-cloud legacy-cloud--right-${i}`} src={media("2026/07/desnioblak-3.webp")} alt="" />
      ))}
      {/* eslint-enable @next/next/no-img-element */}
    </section>
  );
}
