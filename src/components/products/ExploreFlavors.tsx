import Link from "next/link";
import { media } from "@/lib/media";
import Carousel from "@/components/Carousel";

/** The live site's cards, in its order: a front picture that fades to a second one on hover. */
const cards = [
  { href: "/nimko", label: "Nimko", front: "2026/09/5.webp", back: "2026/09/5a.webp" },
  { href: "/popcorn", label: "Popcorn", front: "2026/09/1.webp", back: "2026/09/1a.webp" },
  { href: "/snacks", label: "Snacks", front: "2026/09/2.webp", back: "2026/09/2a.webp" },
  { href: "/coated-peanut", label: "Coated Peanut", front: "2026/09/3-1.webp", back: "2026/09/3a-1.webp" },
  { href: "/snacks", label: "Snacks", front: "2026/09/4.webp", back: "2026/09/4a.webp" },
];

/** "Explore our other flavors": red band, heading on the left, autoplaying carousel of fade cards. */
export default function ExploreFlavors() {
  return (
    <section className="explore">
      <div className="explore__heading">
        <h2 className="brand-font">explore our other flavors</h2>
      </div>
      <Carousel className="explore__carousel" autoplay={3000} label="Other Cocotea flavors" dots={false}>
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className="fade-card" aria-label={c.label}>
            <span className="fade-card__layer" style={{ backgroundImage: `url("${media(c.front)}")` }} />
            <span className="fade-card__layer fade-card__layer--back" style={{ backgroundImage: `url("${media(c.back)}")` }} />
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
