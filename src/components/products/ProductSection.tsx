import { image, media } from "@/lib/media";
import type { Product } from "@/lib/products";
import PackModel from "./PackModel";

/** Accent positions from the live site: they pop in around the section on hover. */
const accents = [
  { top: "15%", left: "28%", width: "120px", rot: "-15deg" },
  { top: "48%", left: "48%", width: "70px", rot: "25deg" },
  { top: "58%", left: "82%", width: "135px", rot: "-10deg" },
];

/** One full-width product band: spinning name ring around the bowl, hover ingredients, 3D pack, Buy Now. */
export default function ProductSection({ product, index }: { product: Product; index: number }) {
  const ringId = `ring-${index}`;
  // As on the WordPress site: the name repeats at its natural spacing and whatever passes the end of the circle is cut off.
  const ringText = `${product.name} `.repeat(Math.ceil(90 / (product.name.length + 1)));

  return (
    <section
      className="product-section"
      style={{
        ["--product-bg" as string]: product.color,
        ["--button" as string]: product.button ?? product.color,
        ["--pattern" as string]: `url("${image("2026/09/Untitled-design-35.png")}")`,
      }}
      aria-label={product.name}
    >
      <div className="product-left">
        <div className="product-bowl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="product-bowl__img" src={image(product.bowl)} alt={product.name} width={800} height={800} loading="lazy" decoding="async" />
          {/* Elementor's text-path circle: a 250.5 box, text sitting on the rim of the plate. */}
          <svg className="product-bowl__ring" viewBox="0 0 250.5 250.5" aria-hidden="true">
            <path id={ringId} d="M.25,125.25a125,125,0,1,1,125,125,125,125,0,0,1-125-125" fill="none" />
            <text>
              <textPath href={`#${ringId}`} startOffset="0">{ringText}</textPath>
            </text>
          </svg>
        </div>
      </div>

      <div className="product-scene">
        <PackModel src={media(product.model)} alt={`${product.name} pack`} />
        <a className="buy-now" href={product.buyUrl ?? "/contact"} {...(product.buyUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <CartIcon /> Buy Now
        </a>
      </div>

      {product.accent && (
        <div className="product-accents" aria-hidden="true">
          {accents.map((a, i) => (
            <span
              key={i}
              className="product-accent-item"
              style={{ top: a.top, left: a.left, width: a.width, height: a.width, ["--rot" as string]: a.rot, backgroundImage: `url("${image(product.accent!)}")` }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** The live site's "shopping-cart2" icon. */
function CartIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.418 25.577c-1.552 0-2.814 1.262-2.814 2.814s1.262 2.814 2.814 2.814 2.814-1.262 2.814-2.814c-0-1.552-1.263-2.814-2.814-2.814zM13.418 29.634c-0.685 0-1.243-0.558-1.243-1.243s0.558-1.243 1.243-1.243 1.243 0.558 1.243 1.243c0 0.685-0.558 1.243-1.243 1.243zM23.289 25.577c-1.552 0-2.814 1.262-2.814 2.814s1.262 2.814 2.814 2.814 2.814-1.262 2.814-2.814c-0-1.552-1.263-2.814-2.814-2.814zM23.289 29.634c-0.685 0-1.243-0.558-1.243-1.243s0.558-1.243 1.243-1.243c0.685 0 1.243 0.558 1.243 1.243s-0.558 1.243-1.243 1.243zM23.982 10.76h-11.259c-0.434 0-0.786 0.352-0.786 0.786s0.352 0.786 0.786 0.786h11.259c0.434 0 0.786-0.352 0.786-0.786s-0.352-0.786-0.786-0.786zM23.369 14.84h-10.034c-0.434 0-0.786 0.352-0.786 0.786s0.352 0.786 0.786 0.786h10.034c0.434 0 0.786-0.352 0.786-0.786s-0.352-0.786-0.786-0.786z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M1.2 2.4l3.4 1.5 3.8 18.5h17.4l4.6-14.9H6" />
    </svg>
  );
}
