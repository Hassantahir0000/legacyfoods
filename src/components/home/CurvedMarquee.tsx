"use client";

import { useEffect, useRef } from "react";

const CURVE = "M-71 371.6C126.3 260 593.5 65.8 934.5 80.8c313 13.8 497 136 572 200";
const PHRASE = "Good Food. Real Legacy.  ✦  ";

/** "Good Food. Real Legacy." running along a curved band; it slides as you scroll. */
export default function CurvedMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tp = textRef.current;
    if (!wrap || !tp) return;
    const speed = 0.03;
    let entry: number | null = null;

    const set = (val: number) => {
      let o = val;
      while (o > 60) o -= 100;
      while (o < -40) o += 100;
      tp.setAttribute("startOffset", `${o}%`);
    };
    const onScroll = () => {
      if (entry === null) return;
      set(-(window.scrollY - entry) * speed);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && entry === null) {
          entry = window.scrollY;
          set(0);
          window.addEventListener("scroll", onScroll, { passive: true });
        }
      });
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="marquee" ref={wrapRef} aria-label="Good Food. Real Legacy.">
      <svg className="marquee-bg-svg" viewBox="0 0 1440 442" fill="none" aria-hidden="true">
        <path stroke="currentColor" d={CURVE} />
      </svg>
      <svg className="marquee-text-svg" viewBox="0 0 1440 442" fill="none" aria-hidden="true">
        <path id="lf-curve" d={CURVE} />
        <text>
          <textPath ref={textRef} href="#lf-curve" dominantBaseline="middle" dy="0.32em" startOffset="0%">
            {PHRASE.repeat(6)}
          </textPath>
        </text>
      </svg>
    </section>
  );
}
