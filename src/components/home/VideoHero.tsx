"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * YouTube brand film as a muted, looping background video with no controls.
 * The player loads only when the section nears the viewport, and the thumbnail stays
 * on top until it has started, hiding YouTube's loading spinner and title flash.
 */
export default function VideoHero() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [started, setStarted] = useState(false);
  const id = site.youtubeId;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // loop=1 only works with playlist=<same id>; controls=0 + pointer-events: none keeps YouTube's UI hidden.
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "0",
    disablekb: "1",
    fs: "0",
    rel: "0",
    iv_load_policy: "3",
    modestbranding: "1",
    playsinline: "1",
    cc_load_policy: "0",
    enablejsapi: "1",
  });

  // cc_load_policy=0 isn't honoured when the viewer has captions on in their YouTube settings,
  // so also unload the captions module through the player's postMessage API.
  const hideCaptions = (frame: HTMLIFrameElement) => {
    const send = () =>
      frame.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "unloadModule", args: ["captions"] }), "*");
    [500, 1500, 3000].forEach((ms) => setTimeout(send, ms));
  };

  return (
    <section className="video-hero" ref={ref} aria-label="Legacy Foods brand film">
      <div className="video-hero__frame">
        {near && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
            title="Legacy Foods Pakistan"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            onLoad={(e) => {
              hideCaptions(e.currentTarget);
              setTimeout(() => setStarted(true), 1200);
            }}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`video-hero__poster ${started ? "is-hidden" : ""}`} src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" />
      </div>
      <div className="wave-divider wave-divider--yellow" aria-hidden="true" />
    </section>
  );
}
