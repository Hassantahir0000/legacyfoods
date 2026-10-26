"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/** YouTube brand film. Loads the player only after a click, so the page stays fast. */
export default function VideoHero() {
  const [playing, setPlaying] = useState(false);
  const id = site.youtubeId;

  return (
    <section className="video-hero" aria-label="Legacy Foods brand film">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Legacy Foods Pakistan"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-hero__poster" onClick={() => setPlaying(true)} aria-label="Play video: Legacy Foods Pakistan">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" />
          <span className="video-hero__play" aria-hidden="true">
            <svg viewBox="0 0 68 48"><path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="#f00" /><path d="M45 24 27 14v20z" fill="#fff" /></svg>
          </span>
        </button>
      )}
      <div className="wave-divider wave-divider--yellow" aria-hidden="true" />
    </section>
  );
}
