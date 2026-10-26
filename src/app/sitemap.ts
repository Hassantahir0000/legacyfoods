import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "/about-us", ...categories.map((c) => `/${c.slug}`), "/gallery", "/faqs", "/contact"];
  return paths.map((p) => ({ url: `${site.url}${p || "/"}`, lastModified: now, changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
