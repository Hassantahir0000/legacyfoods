"use client";

import { useEffect, useRef, useState } from "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}

let loader: Promise<unknown> | null = null;
const loadModelViewer = () => (loader ??= import("@google/model-viewer"));

/** 3D Cocotea pack (Google <model-viewer>), levitating; drag to rotate. Loads when near the viewport. */
export default function PackModel({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          loadModelViewer();
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="pw-model-wrap" ref={ref}>
      {near && (
        <model-viewer
          src={src}
          alt={alt}
          camera-controls=""
          disable-zoom=""
          disable-pan=""
          interaction-prompt="none"
          shadow-intensity="1.3"
          shadow-softness="0.9"
          environment-image="neutral"
          exposure="1.15"
          field-of-view="30deg"
          camera-orbit="0deg 75deg 105%"
          min-camera-orbit="auto 55deg auto"
          max-camera-orbit="auto 105deg auto"
          loading="eager"
          touch-action="pan-y"
        />
      )}
    </div>
  );
}
