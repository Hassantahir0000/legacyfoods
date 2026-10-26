import Link from "next/link";
import { media } from "@/lib/media";

/**
 * Four category tiles. On hover, ingredient cut-outs pop out from the corners.
 * (The live site embeds the Nimko/Snacks/Popcorn cut-outs as inline base64;
 * here they use the matching ingredient images from the site's uploads.)
 */
const tiles = [
  {
    label: "Nimko",
    href: "/nimko",
    tone: "pink",
    garnish: ["ext/nimko-element.webp", "ext/nimko-chili-lemon.png", "2026/07/2-3.png", "2026/07/4-4.png"],
  },
  {
    label: "Snacks",
    href: "/snacks",
    tone: "lime",
    garnish: ["2026/07/11-2.png", "2026/07/12-1.png", "2026/07/13-1.png", "2026/07/14-1.png"],
  },
  {
    label: "Popcorn",
    href: "/popcorn",
    tone: "orange",
    garnish: ["2026/07/21-1.png", "ext/el-popcorn-1.webp", "2026/07/22-1.png", "ext/el-popcorn-2.png"],
  },
  {
    label: "Coated Peanut",
    href: "/coated-peanut",
    tone: "red",
    garnish: ["2026/10/coated-element-2-1.webp", "2026/10/coated-element3-1.webp", "2026/10/coated-element-1.webp", "2026/10/coated-element4-1.webp"],
  },
];

export default function CategoryTiles() {
  return (
    <section className="cat-tiles" aria-label="Product categories">
      {tiles.map((t) => (
        <Link key={t.href} href={t.href} className={`cat-tile cat-tile--${t.tone}`} style={{ ["--texture" as string]: `url("${media("2026/08/texture-scaled.webp")}")` }}>
          <span className="cat-tile__face">
            <span className="cat-tile__eyebrow">LEGACY FOODS EST. 2024</span>
            <span className="cat-tile__label">{t.label}</span>
          </span>
          {t.garnish.map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={g} src={media(g)} alt="" className={`cat-tile__garnish cat-tile__garnish--${i}`} loading="lazy" />
          ))}
        </Link>
      ))}
    </section>
  );
}
