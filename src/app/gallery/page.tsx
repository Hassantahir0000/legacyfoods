import type { Metadata } from "next";
import { media } from "@/lib/media";
import Reveal from "@/components/Reveal";
import Lightbox from "@/components/gallery/Lightbox";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Exploring the moments, products, and traditions behind Legacy Foods.",
  alternates: { canonical: "/gallery" },
};

const featured = [
  "2026/10/cocotea-post-dfsd.jpg",
  "2026/10/xasdws.png",
  "2026/10/cocotea-post-26.jpgxcs.jpg",
];

const grid = [
  "elementor/thumbs/1-08-rvbahz5j8apkpeis2bfyj9e53y2cfkv7izon4qz0ok.webp",
  "elementor/thumbs/1-07-rvbahtii3ahurqqyz9074atdjmu55e8ti7rq937dpw.webp",
  "elementor/thumbs/1-06-rvbahotb54bf5oxsqoz29u02kphb2wq5tkiaupecl0.webp",
  "elementor/thumbs/1-05-rvbahi8fta2ewf7ct44oadnuf0dql101gnxwhro3sk.webp",
  "elementor/thumbs/1-04-rvbah370rxhtqnt78xmn6hggwufv5vcc2li4tcaek4.webp",
  "elementor/thumbs/1-03-rvbagvob997j5s44gudmmjcs5rgxgaihdka8z4ljxw.webp",
  "elementor/thumbs/1-02-rvbago5lqkx8kwf1or4m2l93eohzqpomoj2d4wwpbo.webp",
  "elementor/thumbs/1-01-rvbaghkqeqo8bmolr6a834wv8zef8tyibmhyrz6gj8.webp",
  "elementor/thumbs/1-09-rvbaicb9vz7l7xznxh4qi62lfc9hfcbg8stfumfi9g.webp",
  "elementor/thumbs/2-01-1-rvbfj9azb0vdu176i6eox0jhi6jry3jks94u4w6mno.webp",
  "elementor/thumbs/2-07-1-rvbfjr5wwvjtymh8lw4lqe18si3r0cih6pj295g5dg.webp",
  "elementor/thumbs/2-05-1-rvbfjmgpypdecko2dc3gvx7xtkqwxuzti29murn48k.webp",
  "elementor/thumbs/2-04-1-rvbfjjn7e79jdqs5tsvl6fxk1f4taromhob6exrar8.webp",
  "elementor/thumbs/2-03-1-rvbfjfvumv4e3axmfr92wgvpnvncfz9p55p8htwvg4.webp",
  "elementor/thumbs/2-02-1-rvbfjd2c2d0j4h1pw8176zlbvq18svyi4rqs2011ys.webp",
  "elementor/thumbs/2-06-rvbfjpa8j7h9bejywvbcleiblqd0kyb0ig83alixpw.webp",
];

export default function GalleryPage() {
  return (
    <div className="page-gallery">
      <section className="gallery-hero">
        <Reveal as="p" className="gallery-hero__intro">Exploring the moments, products, and traditions behind Legacy Foods.</Reveal>
        <h1 className="brand-font gallery-hero__title">
          {"A Taste of Legacy".split("").map((ch, i) => (
            <span key={i} style={{ ["--i" as string]: i }}>{ch === " " ? " " : ch}</span>
          ))}
        </h1>
        <div className="gallery-fan">
          {featured.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={media(src)} alt="Cocotea campaign poster" className={`gallery-fan__card gallery-fan__card--${i}`} />
          ))}
        </div>
      </section>

      <section className="gallery-grid-wrap" aria-label="Photo gallery">
        <Lightbox images={grid.map((g) => media(g))} />
      </section>
    </div>
  );
}
