import type { Metadata } from "next";
import { media } from "@/lib/media";
import VideoHero from "@/components/home/VideoHero";
import CloudHero from "@/components/home/CloudHero";
import SwooshLine from "@/components/home/SwooshLine";
import CurvedMarquee from "@/components/home/CurvedMarquee";
import CategoryTiles from "@/components/home/CategoryTiles";
import MagicFlavors from "@/components/home/MagicFlavorsLazy";
import TheRange from "@/components/home/TheRange";
import Carousel from "@/components/Carousel";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: { absolute: "Home - Legacy Foods" },
  alternates: { canonical: "/" },
};

const heroPouches = ["04", "05", "07", "03", "02", "08", "09"];

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
        <div className="pouch-row" aria-label="Cocotea nimko range">
          {heroPouches.map((n, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={media(`2026/10/pouches-${n}.webp`)} alt="Cocotea nimko pouch" style={{ ["--i" as string]: i }} loading="lazy" />
          ))}
        </div>
      </div>

      <CurvedMarquee />
      <CategoryTiles />

      <section className="family-banner" aria-hidden="true" style={{ backgroundImage: `url("${media("2026/09/xz-scaled.png")}")` }} />

      <MagicFlavors />
      <TheRange />

      <section className="stories">
        <Carousel className="stories__carousel" autoplay={5000} label="Legacy Foods moments" dots>
          {stories.map((s) => (
            <article className="story" key={s.img}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(s.img)} alt="" loading="lazy" />
              <h2 className="brand-font">{s.title}</h2>
            </article>
          ))}
        </Carousel>
      </section>

      <section className="trust">
        <div className="trust__box">
          <Reveal as="h2" className="trust__title brand-font">Why Snack Lovers Trust Us</Reveal>
          <div className="trust__grid">
            {trust.map((t, i) => (
              <Reveal className="trust__card" key={t.title} delay={i * 120}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={media(t.icon)} alt="" width={110} height={110} loading="lazy" />
                <h3 className="brand-font">{t.title}</h3>
                <p>{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pack-slider">
        <Carousel className="pack-slider__carousel" autoplay={2500} label="Cocotea packs" dots>
          {packSlides.map(([src, alt], i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${src}-${i}`} src={media(src)} alt={alt} loading="lazy" />
          ))}
        </Carousel>
      </section>
    </div>
  );
}
