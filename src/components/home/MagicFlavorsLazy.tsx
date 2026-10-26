"use client";

import dynamic from "next/dynamic";

/** three.js is ~150 KB, so the 3D section loads in its own chunk on the client only. */
const MagicFlavors = dynamic(() => import("./MagicFlavors"), {
  ssr: false,
  loading: () => <section className="magic-flavors" aria-label="Discover our magical flavors"><p className="magic-flavors__eyebrow">Discover our magical flavors</p></section>,
});

export default MagicFlavors;
