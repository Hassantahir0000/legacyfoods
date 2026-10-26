import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { categories, getCategory } from "@/lib/products";
import { image, media } from "@/lib/media";
import ProductSection from "@/components/products/ProductSection";
import ExploreFlavors from "@/components/products/ExploreFlavors";

type Params = { category: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/${c.slug}` },
    openGraph: { images: [{ url: media(c.banner) }] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();

  // The banner is a CSS background, which the browser only finds after the stylesheet; start it right away.
  const banner = image(c.banner);
  preload(banner, { as: "image", fetchPriority: "high" });

  return (
    <div className="page-category">
      <section className="category-banner" style={{ backgroundImage: `url("${banner}")` }}>
        <h1 className="sr-only">{c.title}</h1>
      </section>
      {c.products.map((p, i) => (
        <ProductSection key={`${p.model}-${i}`} product={p} index={i} />
      ))}
      <ExploreFlavors current={c.slug} />
    </div>
  );
}
