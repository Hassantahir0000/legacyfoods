"use client";

import { createElement, useEffect, useRef, useState } from "react";

type Props = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/** Fades/slides content in when it scrolls into view (Elementor "entrance animation"). */
export default function Reveal({ as = "div", className = "", delay = 0, children, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    { ref, className: `reveal ${shown ? "is-shown" : ""} ${className}`, style: { ...style, transitionDelay: `${delay}ms` } },
    children
  );
}
