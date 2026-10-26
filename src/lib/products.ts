/**
 * Product catalogue. Each category page renders its `products` in order.
 * To add a product: add an entry here — no other code changes needed.
 */
export type Product = {
  name: string;
  /** Section background colour */
  color: string;
  /** 3D pack model (.glb) shown with <model-viewer> */
  model: string;
  /** Bowl photo inside the spinning text ring */
  bowl: string;
  /** Small ingredient image floating around the bowl */
  accent?: string;
  /** Daraz listing; leave undefined if the product isn't listed yet */
  buyUrl?: string;
};

export type Category = {
  slug: "nimko" | "snacks" | "popcorn" | "coated-peanut";
  title: string;
  description: string;
  banner: string;
  products: Product[];
};

const daraz = (id: string) => `https://www.daraz.pk/products/-${id}.html`;

export const categories: Category[] = [
  {
    slug: "nimko",
    title: "Nimko",
    description:
      "Crunchy Cocotea nimko by Legacy Foods — Salted Peanut, Badshahi Delight, Mix Nimko, Dal Moth, Gujrati Delight, Dal Moong and Munchi Mix.",
    banner: "2026/09/nimko-banner.webp",
    products: [
      { name: "Salted Peanut", color: "rgba(252, 216, 61, 0.92)", model: "2026/07/salted-.glb", bowl: "2026/10/peanut.webp", accent: "2026/07/4-4.png", buyUrl: daraz("i1968226031") },
      { name: "Badshahi Delight", color: "rgb(47, 168, 201)", model: "2026/07/badshahi.glb", bowl: "2026/10/badshahi.webp", accent: "2026/07/5-4.png", buyUrl: daraz("i1967857980") },
      { name: "Mix Nimko", color: "rgba(110, 11, 20, 0.97)", model: "2026/07/mix-nimko-.glb", bowl: "2026/10/gujrati.webp", accent: "2026/07/2-3.png", buyUrl: daraz("i1968222240") },
      { name: "Dal Moth", color: "rgba(19, 122, 59, 0.95)", model: "2026/07/dal-moth-.glb", bowl: "2026/10/moth.webp", accent: "2026/07/4-4.png", buyUrl: daraz("i1967647861") },
      { name: "Gujrati Delight", color: "rgb(102, 90, 82)", model: "2026/07/gujrati-.glb", bowl: "2026/10/gujrati.webp", accent: "2026/07/3-4.png", buyUrl: daraz("i1967679319") },
      { name: "Dal Moong", color: "rgb(125, 207, 182)", model: "2026/07/Dal-moong-1.glb", bowl: "2026/10/moong.webp", accent: "2026/07/ChatGPT-Image-Jul-25-2026-04_17_08-PM.png", buyUrl: daraz("i1968222228") },
      { name: "Munchi Mix", color: "rgba(141, 47, 127, 0.95)", model: "2026/07/munchi-.glb", bowl: "2026/10/crunchi-munchi.webp", accent: "2026/07/1-3.png", buyUrl: daraz("i1967677363") },
    ],
  },
  {
    slug: "snacks",
    title: "Snacks",
    description:
      "Cocotea snacks by Legacy Foods — Ring Pops, Jumbo Pops, Curls Pops, Rango Tango and Potato Crisps.",
    banner: "2026/09/33.webp",
    products: [
      { name: "Ring Pops", color: "rgb(105, 104, 106)", model: "2026/08/Cocotea-Ring-pops-2.glb", bowl: "2026/09/round.webp", accent: "2026/07/13-1.png", buyUrl: daraz("i1968428430") },
      { name: "Jumbo Pops", color: "rgb(163, 59, 55)", model: "2026/08/Cocotea-jumbopops-final-.glb", bowl: "2026/10/jumbo.webp", accent: "2026/07/11-2.png", buyUrl: daraz("i1967885339") },
      { name: "Curls Pops", color: "rgb(17, 150, 93)", model: "2026/08/Cocotea-Curl-final-1.glb", bowl: "2026/09/ffd.webp", accent: "2026/07/12-1.png", buyUrl: daraz("i1968442124") },
      { name: "Rango Tango", color: "rgb(189, 45, 5)", model: "2026/08/Cocotea-Rangotango-.glb", bowl: "2026/10/rango.webp", accent: "2026/07/14-1.png", buyUrl: daraz("i1967679338") },
      { name: "Potato Crips", color: "rgb(11, 157, 65)", model: "2026/08/Cocotea-potato-veg-.glb", bowl: "2026/10/potato-crisp.webp", accent: "2026/08/potato-crips-salted.png", buyUrl: daraz("i1968218570") },
      { name: "Potato Crips", color: "rgb(47, 139, 167)", model: "2026/08/Cocotea-potato-salted-1.glb", bowl: "2026/10/potato-crisp.webp", accent: "2026/08/potato-crips-vegetables.png", buyUrl: daraz("i1968224189") },
      { name: "Crunch Potato Crisp", color: "rgb(71, 103, 112)", model: "2026/10/Pepper-Potato-Sticks-Cocotea.glb", bowl: "2026/10/pepper.webp", accent: "2025/06/stick-1.png", buyUrl: daraz("i1968224189") },
      { name: "Crunch Potato Crisp", color: "rgb(150, 39, 39)", model: "2026/10/masala-Potato-Sticks-Cocotea1.glb", bowl: "2026/10/maslala.webp", accent: "2025/06/stick-1.png", buyUrl: daraz("i1968224189") },
      { name: "Crunch Potato Crisp", color: "rgb(155, 142, 142)", model: "2026/10/salted-Potato-Sticks-Cocotea1.glb", bowl: "2026/10/salted.webp", accent: "2025/06/stick-1.png", buyUrl: daraz("i1968224189") },
    ],
  },
  {
    slug: "popcorn",
    title: "Popcorn",
    description: "Cocotea popcorn by Legacy Foods — Salted Popcorn and Caramel Popcorn.",
    banner: "2026/09/popbanner.jpgg_.jpg",
    products: [
      { name: "Popcorn", color: "rgba(149, 43, 43, 0.94)", model: "2026/09/SALTED-POPCORN-.glb", bowl: "2026/10/popcorn.webp", accent: "2026/07/21-1.png", buyUrl: daraz("i1967681480") },
      { name: "Caramel Popcorn", color: "rgba(139, 69, 19, 0.98)", model: "2026/07/caramel_bag_1.glb", bowl: "2026/10/caramel.webp", accent: "2026/07/22-1.png", buyUrl: daraz("i1967681472") },
    ],
  },
  {
    slug: "coated-peanut",
    title: "Coated Peanut",
    description: "Cocotea coated peanuts by Legacy Foods — Salt & Pepper, Cheese and Spicy Masala.",
    banner: "2026/09/coated-banner-pk--scaled.webp",
    products: [
      // The live site's Buy Now buttons for these point to "#" — add Daraz links when available.
      { name: "Coated Peanut", color: "rgb(0, 117, 65)", model: "2026/08/Cocotea-Coated-peanut-salt-and-pepper-.glb", bowl: "2026/10/coated.webp", accent: "2026/08/Coated-peanut-2-1.png" },
      { name: "Coated Peanut", color: "rgb(221, 112, 13)", model: "2026/08/Cocotea-Coated-peanut-cheese-.glb", bowl: "2026/10/coated.webp", accent: "2026/08/Coated-peanut-2-1.png" },
      { name: "Coated Peanut", color: "rgb(177, 8, 7)", model: "2026/08/Cocotea-Coated-peanut-spicy-maslala-.glb", bowl: "2026/10/coated.webp", accent: "2026/08/Coated-peanut-2-1.png" },
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
