"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Scroll animations for the About page, ported from the old site's GSAP script:
 *  - each stage title builds in its own way as the stage scrolls in (scrubbed),
 *  - the panel copy slides up line by line,
 *  - the outro heading fills in and the pouches rise one after another.
 * Renders nothing; it works on the markup in app/about-us/page.tsx.
 */
export default function AboutMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    let ctx: gsap.Context | undefined;
    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;

    // Split only once the brand font is in, so the character boxes are measured correctly.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".about-stage").forEach((stage) => {
          const h = stage.querySelector<HTMLElement>(".about-stage__title h2");
          const range = { trigger: stage, start: "top 68%", end: "top -8%", scrub: 0.6 };

          if (h && stage.classList.contains("about-stage--packaging")) {
            const { tops, bottoms } = splitHalves(h);
            gsap.fromTo(tops, { yPercent: -120 }, { yPercent: 0, stagger: 0.05, ease: "none", scrollTrigger: range });
            gsap.fromTo(bottoms, { yPercent: 120 }, { yPercent: 0, stagger: 0.05, ease: "none", scrollTrigger: range });
          } else if (h) {
            const chars = SplitText.create(h, { type: "words,chars" }).chars;
            const vars: Record<string, gsap.TweenVars> = {
              infusion: { color: "rgba(255,255,255,0)", stagger: 0.09 },
              ingredients: { opacity: 0, scale: 0.82, stagger: 0.1 },
              equipment: { opacity: 0, filter: "blur(16px)", stagger: 0.09 },
              distribution: { rotation: 180, opacity: 0, scale: 0.6, stagger: 0.1 },
            };
            const key = Object.keys(vars).find((k) => stage.classList.contains(`about-stage--${k}`));
            gsap.from(chars, { ...(key ? vars[key] : { opacity: 0, stagger: 0.08 }), ease: "none", scrollTrigger: range });
          }

          const copy = stage.querySelector<HTMLElement>(".about-stage__copy");
          if (copy) revealLines(copy, "top 86%");
        });

        const outro = document.querySelector<HTMLElement>(".about-outro");
        if (!outro) return;
        const heading = outro.querySelector<HTMLElement>(".about-outro__heading");
        const title = outro.querySelector<HTMLElement>("h2");
        const list = outro.querySelector<HTMLElement>(".about-outro__packs");
        const packs = gsap.utils.toArray<HTMLElement>(".about-outro__pack", outro);
        const chars = title ? SplitText.create(title, { type: "words,chars" }).chars : [];

        mm = gsap.matchMedia();
        mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (c) => {
          const desktop = c.conditions?.desktop;
          gsap.set(packs, { y: desktop ? "70vh" : "60vh", opacity: 0, transformOrigin: "50% 100%", force3D: true });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out", overwrite: "auto" },
            scrollTrigger: { trigger: outro, start: desktop ? "top 82%" : "top 90%", end: desktop ? "top 15%" : "top 18%", scrub: true, invalidateOnRefresh: true },
          });
          if (heading) tl.fromTo(heading, { y: desktop ? 70 : 45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 0);
          if (chars.length) tl.fromTo(chars, { color: "rgba(184,29,26,0)" }, { color: "#b81d1a", ease: "none", duration: 0.5, stagger: 0.05 }, 0.05);

          const stagger = desktop ? 0.19 : 0.12;
          const rise = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: desktop
              ? { trigger: outro, start: "top 50%", end: "top -25%", scrub: 0.9, invalidateOnRefresh: true }
              : { trigger: list ?? outro, start: "top 95%", end: "top 45%", scrub: 0.9, invalidateOnRefresh: true },
          });
          rise.to(packs, { y: 0, duration: 1, stagger }, 0);
          rise.to(packs, { opacity: 1, duration: 0.05, stagger }, 0);
        });
      });

      // Images above load late and push everything down; re-measure when they arrive.
      document.querySelectorAll<HTMLImageElement>(".page-about img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      });
    });

    return () => {
      cancelled = true;
      mm?.revert();
      ctx?.revert();
    };
  }, []);

  return null;
}

/** Lines slide up from behind a mask, tilted slightly, one after another. */
function revealLines(el: HTMLElement, start: string) {
  const split = SplitText.create(el, { type: "lines", mask: "lines" });
  gsap.from(split.lines, {
    yPercent: 125,
    rotate: 4,
    stagger: 0.09,
    duration: 1.05,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start, toggleActions: "play none none reverse" },
  });
}

/** Each letter as a top half and a bottom half that slide in from opposite sides and meet ("Packaging"). */
function splitHalves(h: HTMLElement) {
  const text = h.textContent ?? "";
  const tops: HTMLElement[] = [];
  const bottoms: HTMLElement[] = [];
  h.setAttribute("aria-label", text);
  h.textContent = "";
  const line = document.createElement("span");
  line.className = "split-line";
  for (const ch of text) {
    const box = document.createElement("span");
    box.className = "split-char";
    box.setAttribute("aria-hidden", "true");
    if (ch === " ") {
      box.innerHTML = "&nbsp;";
    } else {
      for (const half of ["top", "bottom"] as const) {
        const s = document.createElement("span");
        s.className = `split-half split-half--${half}`;
        s.textContent = ch;
        box.appendChild(s);
        (half === "top" ? tops : bottoms).push(s);
      }
    }
    line.appendChild(box);
  }
  h.appendChild(line);
  return { tops, bottoms };
}
