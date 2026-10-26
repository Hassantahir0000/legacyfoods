"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { media } from "@/lib/media";

type Flavor = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  onAccent: string;
  image: string;
  elements: [string, string];
  href: string;
};

const flavors: Flavor[] = [
  {
    id: "mix-nimko",
    name: "Crunchy Mix Nimko",
    tagline: "Spicy & crunchy, with fresh peanut",
    description: "An exquisite blend of crunchy sev, chickpeas, roasted peanuts and warm spices. Tangy, savoury and impossible to stop at one handful.",
    accent: "oklch(0.52 0.2 27)",
    onAccent: "oklch(0.98 0.01 60)",
    image: "ext/pack-1.webp",
    elements: ["ext/nimko-element.webp", "ext/nimko-chili-lemon.png"],
    href: "/nimko",
  },
  {
    id: "coated-peanut",
    name: "Coated Peanut",
    tagline: "Bold spice in every crunch",
    description: "A lively masala blend with a satisfying crunch and a warm, spicy finish made for bold snack lovers.",
    accent: "oklch(0.54 0.19 34)",
    onAccent: "oklch(0.98 0.01 60)",
    image: "ext/coated-red-1.webp",
    elements: ["ext/spicy-masala-element.webp", "ext/el-masala-1.webp"],
    href: "/coated-peanut",
  },
  {
    id: "salted-popcorn",
    name: "Salted Popcorn",
    tagline: "Naturally flavoured party pack",
    description: "Fluffy corn popped light and dusted with fine salt. No cholesterol, no additives, no palm oil — just the pure cinema-cart classic.",
    accent: "oklch(0.82 0.08 305)",
    onAccent: "oklch(0.97 0.02 90)",
    image: "ext/pack-3.webp",
    elements: ["ext/el-popcorn-1.webp", "ext/el-popcorn-2.png"],
    href: "/popcorn",
  },
  {
    id: "potato-crisp",
    name: "Potato Crisp",
    tagline: "Salted flavour, crunchy & spicy",
    description: "Farm-fresh potatoes shaped into ridged sticks and lightly salted. A clean, buttery crunch with a gentle peppery lift at the finish.",
    accent: "oklch(0.5 0.16 250)",
    onAccent: "oklch(0.98 0.01 240)",
    image: "ext/pack-4.webp",
    elements: ["ext/crisp-element.webp", "ext/el-crisp-2.webp"],
    href: "/snacks",
  },
  {
    id: "rango-tango",
    name: "Rango Tango",
    tagline: "It's snack o' clock",
    description: "Crunchy corn puffs tumbled in bright red chilli and tangy spice. Loud, fiery and made for sharing straight out of the party pack.",
    accent: "oklch(0.55 0.22 28)",
    onAccent: "oklch(0.99 0.01 40)",
    image: "ext/pack-5.webp",
    elements: ["ext/tango-element.webp", "ext/el-rango-2.webp"],
    href: "/snacks",
  },
];

// Garnish placement in the detail view: [element index, css class]
const garnish = [
  { el: 0, cls: "g1", depth: 1.6 },
  { el: 1, cls: "g2", depth: -1.3 },
  { el: 0, cls: "g3", depth: 2.4 },
] as const;

/** "Our flavours — The Range": five packs; click one to open its full-bleed detail view. */
export default function TheRange() {
  const [active, setActive] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [tick, setTick] = useState(0); // re-triggers entry animations
  const detailRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const open = useCallback((i: number, d = 1) => {
    const n = flavors.length;
    setDir(d);
    setActive(((i % n) + n) % n);
    setTick((t) => t + 1);
  }, []);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") open(active + 1, 1);
      if (e.key === "ArrowLeft") open(active - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, open, close]);

  const f = active !== null ? flavors[active] : null;

  return (
    <section
      className={`range ${f ? "is-detail" : ""}`}
      aria-label="Our flavours — The Range"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
    >
      {/* eslint-disable @next/next/no-img-element */}
      <img className="range__bg" src={media("ext/range-bg.webp")} alt="" loading="lazy" />
      <div className="range__tint" />

      <div className="range__lineup" aria-hidden={!!f}>
        <header className="range__header">
          <p>Our flavours</p>
          <h2 className="brand-font">The Range</h2>
        </header>
        <div className="range__cards">
          {flavors.map((fl, i) => (
            <button
              key={fl.id}
              type="button"
              className={`range__card range__card--${fl.id}`}
              onClick={() => open(i)}
              tabIndex={f ? -1 : 0}
              aria-label={`Open ${fl.name}`}
              style={{ ["--i" as string]: i }}
            >
              <span className="range__card-glow" style={{ background: fl.accent }} aria-hidden="true" />
              <span className="range__card-imgwrap">
                <img src={media(fl.image)} alt={`${fl.name} snack pack`} loading="lazy" />
              </span>
              <span className="range__card-plate-wrap" aria-hidden="true">
                <span className="range__card-plate">{fl.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {f && (
        <div
          className="range__detail"
          ref={detailRef}
          key={tick}
          style={{
            color: f.onAccent,
            background: `linear-gradient(160deg, color-mix(in oklab, ${f.accent} 88%, white) 0%, ${f.accent} 45%, color-mix(in oklab, ${f.accent} 62%, black) 100%)`,
            ["--dir" as string]: dir,
          }}
          role="dialog"
          aria-label={f.name}
        >
          <div className="range__marquee" aria-hidden="true">
            <div className="range__marquee-track brand-font">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>{f.name}&nbsp;</span>
              ))}
            </div>
          </div>

          {garnish.map((g, i) => (
            <div
              key={i}
              className={`range__garnish range__garnish--${g.cls}`}
              style={{ transform: `translate(${mouse.x * g.depth * 30}px, ${mouse.y * g.depth * 30}px)` }}
            >
              <img src={media(f.elements[g.el])} alt="" />
            </div>
          ))}

          <div className="range__pack">
            <img src={media(f.image)} alt={`${f.name} snack pack`} />
          </div>

          <div className="range__copy">
            <p className="range__tagline">{f.tagline}</p>
            <p className="range__desc">{f.description}</p>
          </div>

          <button type="button" className="range__nav range__nav--prev" aria-label="Previous flavour" onClick={() => open(active! - 1, -1)}>
            <svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="range__nav range__nav--next" aria-label="Next flavour" onClick={() => open(active! + 1, 1)}>
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>

          <div className="range__actions">
            <button type="button" className="range__back" aria-label="Back to the range" onClick={close}>
              <svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
            </button>
            <Link href={f.href} className="range__more">See more</Link>
          </div>

          <div className="range__dots">
            {flavors.map((fl, i) => (
              <button key={fl.id} type="button" aria-label={`Go to flavour ${i + 1}`} className={i === active ? "is-active" : ""} onClick={() => open(i, i > active! ? 1 : -1)} />
            ))}
          </div>
        </div>
      )}
      {/* eslint-enable @next/next/no-img-element */}
    </section>
  );
}
