"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** ms between auto-advances; 0 disables */
  autoplay?: number;
  label: string;
  arrows?: boolean;
  dots?: boolean;
};

/**
 * Lightweight scroll-snap carousel used for the story slider and the pack slider.
 * Slide width comes from CSS (`.carousel__slide` inside the given className).
 */
export default function Carousel({ children, className = "", autoplay = 0, label, arrows = true, dots = true }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(1);
  const paused = useRef(false);
  const slides = Children.toArray(children);

  const measure = useCallback(() => {
    const t = trackRef.current;
    if (!t || !t.firstElementChild) return;
    const w = (t.firstElementChild as HTMLElement).offsetWidth || 1;
    const perView = Math.max(1, Math.round(t.clientWidth / w));
    setPages(Math.max(1, slides.length - perView + 1));
    setIndex(Math.round(t.scrollLeft / w));
  }, [slides.length]);

  const goTo = useCallback(
    (i: number) => {
      const t = trackRef.current;
      if (!t || !t.firstElementChild) return;
      const w = (t.firstElementChild as HTMLElement).offsetWidth;
      const n = ((i % pages) + pages) % pages;
      t.scrollTo({ left: n * w, behavior: "smooth" });
    },
    [pages]
  );

  useEffect(() => {
    measure();
    const t = trackRef.current;
    if (!t) return;
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    t.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      t.removeEventListener("scroll", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) goTo(index + 1);
    }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, goTo, index]);

  return (
    <div
      className={`carousel ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="carousel__track" ref={trackRef}>
        {slides.map((s, i) => (
          <div
            className={`carousel__slide${i === index ? " is-active" : i === index - 1 ? " is-prev" : i === index + 1 ? " is-next" : ""}`}
            key={i}
            role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
            {s}
          </div>
        ))}
      </div>
      {arrows && (
        <>
          <button type="button" className="carousel__arrow carousel__arrow--prev" aria-label="Previous slide" onClick={() => goTo(index - 1)}>
            <svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="carousel__arrow carousel__arrow--next" aria-label="Next slide" onClick={() => goTo(index + 1)}>
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </>
      )}
      {dots && pages > 1 && (
        <div className="carousel__dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} className={i === index ? "is-active" : ""} onClick={() => goTo(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
