import type { Metadata } from "next";
import { media } from "@/lib/media";
import ScrollVideo from "@/components/about/ScrollVideo";
import Reveal from "@/components/Reveal";
import AboutMotion from "@/components/about/AboutMotion";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "How Legacy Foods makes Cocotea snacks: infusion of traditional flavours, quality ingredients, state-of-the-art ovens, hygienic packaging and nationwide distribution.",
  alternates: { canonical: "/about-us" },
};

const SCROLL_VIDEO = "2026/08/WEBSITE-SCROLL-EFFECT-COCOTEA-new-updated-.mp4";

const stages = [
  {
    key: "infusion",
    title: "INFUSION",
    banner: "2026/09/banner-infusion-scaled.jpg",
    left: "2026/10/infCT-.webp",
    right: "2026/10/infSK.webp",
    gradient: "linear-gradient(100deg, #a9b93c 0%, #12c65a 100%)",
    text: "We start by blending the flavors that generations of Pakistanis grew up on the spice, the crunch, the aroma with modern food-safety and quality standards, creating snacks that taste like home but are made to today’s benchmarks.",
  },
  {
    key: "ingredients",
    title: "Quality Ingredients",
    banner: "2026/09/ElevenLabs_image_gpt-image-2-5-sunburst_A-cinematic-ae_2026-09-25T12_29_01.png",
    left: "2026/10/ingredient-CT-.webp",
    right: "2026/10/ingrediennts-S.webp",
    gradient: "linear-gradient(100deg, #dc0b50 0%, #560a26 100%)",
    text: "Every batch begins with carefully sourced, best-quality raw ingredients premium grains, fresh peanuts, and natural spices selected for freshness and consistency, so every pack of nimko, popcorn, or coated peanuts tastes the same, batch after batch.",
  },
  {
    key: "equipment",
    title: "State of the Art Equipments",
    banner: "2026/09/ElevenLabs_image_gpt-image-2-5-sunburst_generte-a-16_9-_2026-09-25T12_19_54-1.png",
    left: "2026/10/eq-CT.webp",
    right: "2026/10/oven.webp",
    gradient: "linear-gradient(100deg, #ad214e 0%, #fb6c46 100%)",
    text: "Our ingredients are then roasted and baked in state-of-the-art industrial ovens, engineered for even heat and precise temperature control. This ensures the perfect crunch and flavor in every product, while keeping oil content low and quality consistent at scale.",
  },
  {
    key: "packaging",
    title: "Packaging",
    banner: "2026/09/ElevenLabs_image_gpt-image-2-5-sunburst_A-cinematic-ul_2026-09-25T12_53_04.png",
    left: "2026/10/pkgCT.webp",
    right: "2026/10/Boxes.webp",
    gradient: "linear-gradient(100deg, #0b79ad 0%, #2bb3e6 100%)",
    text: "Once baked, our snacks are sealed fresh in hygienic, tamper-proof packaging designed to lock in flavor and crunch from the factory floor all the way to your hands.",
  },
  {
    key: "distribution",
    title: "Distribution",
    banner: "2026/09/n61.jpg",
    left: "2026/10/distribution-CT-1.webp",
    right: "2026/10/distribution-SK-1.webp",
    gradient: "linear-gradient(100deg, #6c3a8c 0%, #d88bc6 100%)",
    text: "From there, Legacy Foods products are distributed to shops and marts across Pakistan, reaching customers nationwide with the same fresh taste and quality in every city, every time.",
  },
];

const ribbons = ["NO ARTIFICIAL PRESERVATIVES", "FRESHLY PACKED", "TRADITIONAL RECIPES"];

export default function AboutPage() {
  return (
    <div className="page-about">
      {/* /video/* are the scrub-optimized copies made by `npm run optimize-video`; the original 4K file is the fallback. */}
      <ScrollVideo
        desktop={["/video/about-scroll-1080.mp4", media(SCROLL_VIDEO)]}
        mobile={["/video/about-scroll-720.mp4", "/video/about-scroll-1080.mp4", media(SCROLL_VIDEO)]}
      />

      {/* Cloud band that hides the seam between the video and the factory picture. */}
      <div className="about-cloud" aria-hidden="true" />

      <section className="about-hero">
        <h1 className="sr-only">About Legacy Foods</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media("2026/09/about-us-picture.jpg-1-scaled.jpeg")} alt="The Legacy Foods factory surrounded by gardens" />
      </section>

      <section className="about-ribbons" aria-label="Our promise">
        {ribbons.map((text) => (
          <div key={text} className="about-ribbon">
            <p className="brand-font">{text}</p>
          </div>
        ))}
      </section>

      {/* Each stage: the banner sticks while the gradient panel slides over it; AboutMotion animates the titles. */}
      {stages.map((s) => (
        <section key={s.key} className={`about-stage about-stage--${s.key}`}>
          <div className="about-stage__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media(s.banner)} alt="" />
          </div>
          <div className="about-stage__title">
            <h2 className="brand-font">{s.title}</h2>
          </div>
          <div className="about-stage__panel" style={{ ["--panel" as string]: s.gradient }}>
            {/* eslint-disable @next/next/no-img-element */}
            <Reveal className="about-stage__side about-stage__side--left"><img src={media(s.left)} alt="" loading="lazy" /></Reveal>
            <p className="about-stage__copy">{s.text}</p>
            <Reveal className="about-stage__side about-stage__side--right"><img src={media(s.right)} alt="" loading="lazy" /></Reveal>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </section>
      ))}

      <section className="about-outro">
        <div className="about-outro__heading">
          <h2 className="brand-font">Legacy foods.pk</h2>
        </div>
        <div className="about-outro__packs">
          {["04", "03", "01", "07"].map((n) => (
            <div key={n} className="about-outro__pack">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(`2026/06/cocotea-pouch-all-${n}.webp`)} alt="Cocotea pouch" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <AboutMotion />
    </div>
  );
}
