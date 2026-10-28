import type { Metadata } from "next";
import { media } from "@/lib/media";
import VideoHero from "@/components/home/VideoHero";
import CloudHero from "@/components/home/CloudHero";
import SwooshLine from "@/components/home/SwooshLine";
import CurvedMarquee from "@/components/home/CurvedMarquee";
import CategoryTiles from "@/components/home/CategoryTiles";
import MagicFlavors from "@/components/home/MagicFlavorsLazy";
import TheRange from "@/components/home/TheRange";
import PouchFan from "@/components/home/PouchFan";
import Carousel from "@/components/Carousel";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: { absolute: "Home - Legacy Foods" },
  alternates: { canonical: "/" },
};

const stories = [
  { img: "2026/09/42-scaled.jpg", title: "Crunch into happiness with every bite!" },
  { img: "2026/09/cocotea-post-26.jpgdfgg-scaled.jpg", title: "Every handful brings a little more joy." },
  { img: "2026/09/cocotea-post-sdds-scaled.jpg", title: "Sweet, crunchy, and absolutely irresistible!" },
  { img: "2026/09/cocotea-post-26-sdfgvr-scaled.jpg", title: "Cravings called. We answered!" },
  { img: "2026/09/zxcqw-scaled.png", title: "Good times, great company, and delicious Nimko!" },
];

const trust = [
  { icon: "2026/09/quality.png", title: "Super Quality Snacks", text: "Made with carefully selected ingredients to deliver premium taste, freshness, and crunch in every bite." },
  { icon: "2026/09/halal-3.png", title: "Halal Recipes", text: "Prepared according to strict Halal standards, ensuring purity, trust, and peace of mind for our consumers." },
  { icon: "2026/09/hygiene.png", title: "Hygienic Processing", text: "Produced in clean, controlled environments following strict hygiene, highest quality, and food safety practices." },
  { icon: "2026/09/snack.png", title: "Great Taste", text: "A flavor so deeply rich and deliciously satisfying, just one freshly made crispy bite always leads to another." },
];

const packSlides = [
  ["2026/10/jumbo-pk.webp", "Jumbo Pops"],
  ["2026/10/curl-pk.webp", "Curls Pops"],
  ["2026/10/ring-pops-pk.webp", "Ring Pops"],
  ["2026/10/coated-green-pk.webp", "Coated Peanut Salt & Pepper"],
  ["2026/10/coated-red-pk.webp", "Coated Peanut Spicy Masala"],
  ["2026/10/coated-yelo-pk.webp", "Coated Peanut Cheese"],
  ...["11", "12", "02", "03", "04", "05", "06", "07", "08", "09", "01", "10"].map((n) => [`2026/10/pouches-${n}.webp`, "Cocotea pouch"]),
];

export default function HomePage() {
  return (
    <div className="page-home">
      <VideoHero />

      <div className="home-intro">
        <SwooshLine />
        <CloudHero />
        <PouchFan />
      </div>

      <CurvedMarquee />
      <CategoryTiles />

      <section className="family-banner" aria-hidden="true" style={{ backgroundImage: `url("${media("2026/09/xz-scaled.png")}")` }} />

      <MagicFlavors />
      <TheRange />

      <section className="stories">
        <Carousel className="stories__carousel" autoplay={4000} label="Legacy Foods moments" dots>
          {stories.map((s) => (
            <article className="story" key={s.img}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(s.img)} alt="" loading="lazy" />
              <h2 className="brand-font">{s.title}</h2>
            </article>
          ))}
        </Carousel>
      </section>

      {/* Entrance animations as on the live site: the box rises while the cards come in from the left, rightmost first.
          The cards start a full width to the left, so they follow the box's reveal rather than watching themselves. */}
      <section className="trust">
        <Reveal className="trust__box reveal--slow" delay={30}>
          <h2 className="trust__title brand-font">Why Snack Lovers Trust Us</h2>
          <div className="trust__grid">
            {trust.map((t, i) => (
              <div className={`trust__card ${i === 0 ? "trust__card--slide" : ""}`} key={t.title} style={{ transitionDelay: `${(trust.length - i) * 30}ms` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={media(t.icon)} alt="" width={110} height={110} loading="lazy" />
                <h3 className="brand-font">{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Continuous drift, one pack every 10s, like the live site's Swiper (speed 10000, no delay). Pauses on hover. */}
      <section className="pack-slider" aria-label="Cocotea packs">
        <div className="pack-slider__track" style={{ ["--count" as string]: packSlides.length }}>
          {[...packSlides, ...packSlides].map(([src, alt], i) => (
            <div className="pack-slider__slide" key={`${src}-${i}`} aria-hidden={i >= packSlides.length || undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(src)} alt={i < packSlides.length ? alt : ""} width={577} height={573} loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
