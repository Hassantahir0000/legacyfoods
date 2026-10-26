"use client";

import { useEffect, useRef } from "react";

const PATH =
  "M-11 627.781C31.2318 652.606 151.814 698.642 199.05 645.884C264.5 572.781 199.05 472.107 47.547 363.054C-103.956 254 -52.529 150.083 24.5115 108.595C210.583 8.39218 434.763 502.251 720.049 329.362C981.436 170.957 1134 -69.7188 1490 2.78121C1650 62 1500 320 1250 420C950 540 700 480 550 620C380 780 120 700 60 900C0 1080 250 1150 480 1220C750 1300 1050 1120 1300 1280C1500 1400 1420 1600 1250 1750C1050 1930 700 1850 480 2000C280 2130 150 2280 250 2450C350 2600 650 2550 850 2650C1100 2780 700 2950 -11 3100";

/** The thick white ribbon that draws itself down the page as you scroll. */
export default function SwooshLine() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top of the line reaches the bottom of the screen, 1 when its end does.
      const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / r.height));
      path.style.strokeDashoffset = `${len * (1 - p)}`;
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="swoosh" ref={wrapRef} aria-hidden="true">
      <svg viewBox="0 0 1440 3150" preserveAspectRatio="none" fill="none">
        <path ref={pathRef} d={PATH} stroke="#fff" strokeWidth="40" strokeLinecap="round" />
      </svg>
    </div>
  );
}
