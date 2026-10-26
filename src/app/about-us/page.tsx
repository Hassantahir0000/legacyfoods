import type { Metadata } from "next";
import { media } from "@/lib/media";
import ScrollVideo from "@/components/about/ScrollVideo";
import Reveal from "@/components/Reveal";

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
    gradient: "linear-gradient(100deg, rgb(169, 185, 60) 0%, rgb(18, 198, 90) 100%)",
    text: "We start by blending the flavors that generations of Pakistanis grew up on the spice, the crunch, the aroma with modern food-safety and quality standards, creating snacks that taste like home but are made to today’s benchmarks.",
  },
  {
    key: "ingredients",
    title: "Quality Ingredients",
    banner: "2026/09/ElevenLabs_image_gpt-image-2-5-sunburst_A-cinematic-ae_2026-09-25T12_29_01.png",
    left: "2026/10/ingredient-CT-.webp",
    right: "2026/10/ingrediennts-S.webp",
    gradient: "linear-gradient(100deg, rgb(220, 11, 80) 0%, rgb(86, 10, 38) 100%)",
    text: "Every batch begins with carefully sourced, best-quality raw ingredients premium grains, fresh peanuts, and natural spices selected for freshness and consistency, so every pack of nimko, popcorn, or coated peanuts tastes the same, batch after batch.",
  },
  {
    key: "equipment",
    title: "State of the Art Equipments",
    banner: "2026/09/ElevenLabs_image_gpt-image-2-5-sunburst_generte-a-16_9-_2026-09-25T12_19_54-1.png",
    left: "2026/10/eq-CT.webp",
    right: "2026/10/oven.webp",
    gradient: "linear-gradient(100deg, rgb(173, 33, 78) 0%, rgb(251, 108, 70) 100%)",
    text: "Our ingredients are then roasted and baked in state-of-the-art industrial ovens, engineered for even heat and precise temperature control. This ensures the perfect crunch and flavor in every product, while keeping oil content low and quality consistent at scale.",
  },
  {
    key: "packaging",
    title: "Packaging",
    banner: "2026/09/ElevenLabs_image_gpt-image-2-5-sunburst_A-cinematic-ul_2026-09-25T12_53_04.png",
    left: "2026/10/pkgCT.webp",
    right: "2026/10/Boxes.webp",
    gradient: "linear-gradient(100deg, rgb(11, 121, 173) 0%, rgb(43, 179, 230) 100%)",
    text: "Once baked, our snacks are sealed fresh in hygienic, tamper-proof packaging designed to lock in flavor and crunch from the factory floor all the way to your hands.",
  },
  {
    key: "distribution",
    title: "Distribution",
    banner: "2026/09/n61.jpg",
    left: "2026/10/distribution-CT-1.webp",
    right: "2026/10/distribution-SK-1.webp",
    gradient: "linear-gradient(100deg, rgb(108, 58, 140) 0%, rgb(216, 139, 198) 100%)",
    text: "From there, Legacy Foods products are distributed to shops and marts across Pakistan, reaching customers nationwide with the same fresh taste and quality in every city, every time.",
  },
];

const strips = [
  { text: "NO ARTIFICIAL PRESERVATIVES", bg: "rgb(42, 171, 225)", color: "#fff" },
  { text: "FRESHLY PACKED", bg: "rgb(253, 230, 96)", color: "#5b0f2a" },
  { text: "TRADITIONAL RECIPES", bg: "rgb(224, 7, 82)", color: "#fff" },
];

export default function AboutPage() {
  return (
    <div className="page-about">
      {/* /video/* are the scrub-optimized copies made by `npm run optimize-video`; the original 4K file is the fallback. */}
      <ScrollVideo
        desktop={["/video/about-scroll-1080.mp4", media(SCROLL_VIDEO)]}
        mobile={["/video/about-scroll-720.mp4", "/video/about-scroll-1080.mp4", media(SCROLL_VIDEO)]}
      />

      <section className="about-crunch">
        <h1 className="sr-only">About Legacy Foods</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media("2026/09/about-us-picture.jpg-1-scaled.jpeg")} alt="The Legacy Foods factory surrounded by gardens" />
      </section>

      <section className="about-strips" aria-label="Our promise">
        {strips.map((s) => (
          <p key={s.text} className="brand-font" style={{ background: s.bg, color: s.color }}>{s.text}</p>
        ))}
      </section>

      {stages.map((s) => (
        <section key={s.key} className={`about-stage about-stage--${s.key}`}>
          <div className="about-stage__banner" style={{ backgroundImage: `url("${media(s.banner)}")` }}>
            <h2 className="brand-font">{s.title}</h2>
          </div>
          <div className="about-stage__band" style={{ background: s.gradient }}>
            {/* eslint-disable @next/next/no-img-element */}
            <Reveal className="about-stage__left"><img src={media(s.left)} alt="" loading="lazy" /></Reveal>
            <Reveal as="p" className="about-stage__text" delay={120}>{s.text}</Reveal>
            <Reveal className="about-stage__right" delay={240}><img src={media(s.right)} alt="" loading="lazy" /></Reveal>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
        </section>
      ))}

      <section className="about-outro">
        <h2 className="brand-font">Legacy foods.pk</h2>
        <div className="about-outro__packs">
          {["04", "03", "01", "07"].map((n, i) => (
            <Reveal key={n} delay={i * 120} style={{ ["--i" as string]: i }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(`2026/06/cocotea-pouch-all-${n}.webp`)} alt="Cocotea pouch" loading="lazy" />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
