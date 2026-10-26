import Link from "next/link";
import { productLinks } from "@/lib/site";

const tones: Record<string, string> = {
  "/nimko": "pink",
  "/snacks": "lime",
  "/popcorn": "orange",
  "/coated-peanut": "red",
};

/** "Explore our other flavors" flip cards at the bottom of each category page. */
export default function ExploreFlavors({ current }: { current: string }) {
  return (
    <section className="explore">
      <h2 className="brand-font">explore our other flavors</h2>
      <div className="explore__grid">
        {productLinks.map((p) => (
          <Link key={p.href} href={p.href} className={`flip-card flip-card--${tones[p.href]} ${p.href === `/${current}` ? "is-current" : ""}`}>
            <span className="flip-card__inner">
              <span className="flip-card__front brand-font">{p.label}</span>
              <span className="flip-card__back">
                <span className="brand-font">{p.label}</span>
                <span className="flip-card__cta">Explore →</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
