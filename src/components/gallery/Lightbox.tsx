"use client";

import { useEffect, useState } from "react";

/** Image grid; click an image to view it full screen (arrow keys / Esc). */
export default function Lightbox({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % n));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, n]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <button key={src} type="button" className="gallery-grid__item" onClick={() => setOpen(i)} aria-label={`Open image ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[open]} alt="" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lightbox__close" aria-label="Close" onClick={() => setOpen(null)}>×</button>
          <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + n) % n); }}>‹</button>
          <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % n); }}>›</button>
        </div>
      )}
    </>
  );
}
