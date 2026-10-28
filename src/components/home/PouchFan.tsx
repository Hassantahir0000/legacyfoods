"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { media } from "@/lib/media";

/**
 * Overlapping fan of the seven nimko pouches, positioned as on the live site. Each pouch box is one grid column
 * wide (the middle one 115%), pulled left out of its column, and its picture is drawn at 210% of the box.
 * Phones use the live site's separate layout: a 326px strip where the pouches climb in a diagonal staircase.
 */
const pouches = [
  { n: "04", left: "-36%", tabletLeft: "-37px", bottom: 62, z: 1, m: { left: "-39px", bottom: -129, img: "200%" } },
  { n: "05", left: "-50%", tabletLeft: "-52px", bottom: 61, z: 1, m: { left: "-3px", bottom: -96 } },
  { n: "07", left: "-52%", tabletLeft: "-59px", bottom: 55, z: 1, m: { right: "-45px", bottom: -57 } },
  { n: "03", left: "-57%", tabletLeft: "-57px", bottom: 57, z: 4, width: "115.457%", m: { right: "-93px", bottom: -16, z: 4 } },
  { n: "02", left: "-65.797%", tabletLeft: "-60px", bottom: 61, z: 3, m: { right: "-136px", bottom: 24, z: 3 } },
  { n: "08", left: "-79.136%", tabletLeft: "-76px", bottom: 56, z: 2, m: { right: "-178px", bottom: 62, z: 2 } },
  { n: "09", left: "-90%", tabletLeft: "-98px", bottom: 60, z: 0, m: { right: "-213px", bottom: 103, z: 1 } },
];

export default function PouchFan() {
  const ref = useRef<HTMLDivElement>(null);

  // The live site's "inertia" hover: a pouch is flung in the direction the mouse was moving, then springs back.
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let oldX = 0;
    let oldY = 0;
    let velX = 0;
    let velY = 0;
    const onMove = (e: MouseEvent) => {
      velX = e.clientX - oldX;
      velY = e.clientY - oldY;
      oldX = e.clientX;
      oldY = e.clientY;
    };
    const items = Array.from(root.querySelectorAll<HTMLElement>(".pouch-fan__item"));
    const onEnter = (e: Event) => {
      const item = e.currentTarget as HTMLElement;
      gsap.killTweensOf(item);
      gsap.to(item, { x: velX * 8, y: velY * 8, rotation: velX * 0.3, duration: 0.6, ease: "power2.out" });
      gsap.to(item, { x: 0, y: 0, rotation: 0, duration: 1.5, delay: 0.15, ease: "elastic.out(1,0.35)" });
    };
    document.addEventListener("mousemove", onMove);
    items.forEach((i) => i.addEventListener("mouseenter", onEnter));
    return () => {
      document.removeEventListener("mousemove", onMove);
      items.forEach((i) => {
        i.removeEventListener("mouseenter", onEnter);
        gsap.killTweensOf(i);
      });
    };
  }, []);

  return (
    <div className="pouch-fan" ref={ref} aria-label="Cocotea nimko range">
      {pouches.map((p) => (
        <div className="pouch-fan__cell" key={p.n}>
          <div
            className="pouch-fan__item"
            style={{
              ["--left" as string]: p.left,
              ["--tablet-left" as string]: p.tabletLeft,
              ["--w" as string]: p.width ?? "100%",
              ["--bottom" as string]: `${p.bottom}px`,
              ["--z" as string]: p.z,
              ["--m-left" as string]: p.m.left ?? "auto",
              ["--m-right" as string]: p.m.right ?? "auto",
              ["--m-bottom" as string]: `${p.m.bottom}px`,
              ["--m-z" as string]: p.m.z ?? "auto",
              ["--m-img" as string]: p.m.img ?? "212%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media(`2026/10/pouches-${p.n}.webp`)} alt="Cocotea nimko pouch" width={577} height={573} loading="lazy" />
          </div>
        </div>
      ))}
    </div>
  );
}
