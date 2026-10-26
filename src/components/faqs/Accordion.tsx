"use client";

import { useState } from "react";

export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`accordion__item ${isOpen ? "is-open" : ""}`}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-btn-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span className="accordion__icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                <span className="brand-font">{it.q}</span>
              </button>
            </h3>
            <div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="accordion__panel" hidden={!isOpen}>
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
