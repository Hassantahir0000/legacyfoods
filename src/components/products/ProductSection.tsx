import { media } from "@/lib/media";
import type { Product } from "@/lib/products";
import PackModel from "./PackModel";

/** One full-width product band: spinning name ring around the bowl, floating ingredients, 3D pack, Buy Now. */
export default function ProductSection({ product, index }: { product: Product; index: number }) {
  const ringId = `ring-${index}`;
  // Repeat the name around the ring; textLength stretches it to close the circle exactly.
  const reps = Math.max(2, Math.round(48 / (product.name.length + 3)));
  const ringText = `${product.name}   `.repeat(reps);

  return (
    <section
      className="product-section"
      style={{ ["--product-bg" as string]: product.color, ["--pattern" as string]: `url("${media("2026/09/Untitled-design-35.png")}")` }}
      aria-label={product.name}
    >
      <div className="product-section__inner">
        <div className="product-bowl">
          <svg className="product-bowl__ring" viewBox="0 0 300 300" aria-hidden="true">
            <path id={ringId} d="M150,150 m-125,0 a125,125 0 1,1 250,0 a125,125 0 1,1 -250,0" fill="none" />
            <text>
              <textPath href={`#${ringId}`} startOffset="0" textLength="780" lengthAdjust="spacing">{ringText}</textPath>
            </text>
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="product-bowl__img" src={media(product.bowl)} alt={product.name} width={800} height={800} loading="lazy" decoding="async" />
        </div>

        <div className="product-pack">
          <PackModel src={media(product.model)} alt={`${product.name} pack`} />
          {product.buyUrl ? (
            <a className="buy-now" href={product.buyUrl} target="_blank" rel="noopener noreferrer">
              <CartIcon /> Buy Now
            </a>
          ) : (
            <a className="buy-now" href="/contact">
              <CartIcon /> Buy Now
            </a>
          )}
        </div>
      </div>

      {product.accent &&
        [0, 1, 2].map((i) => (
          <span key={i} className={`product-accent-item product-accent-item--${i}`} style={{ backgroundImage: `url("${media(product.accent!)}")` }} aria-hidden="true" />
        ))}
    </section>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}
