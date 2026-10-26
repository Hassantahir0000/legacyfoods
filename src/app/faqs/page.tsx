import type { Metadata } from "next";
import { media } from "@/lib/media";
import Accordion from "@/components/faqs/Accordion";

export const metadata: Metadata = {
  title: "FAQ’S",
  description: "Answers about Legacy Foods products: halal certification, ingredients, distribution, wholesale, delivery, shelf life, allergens and ordering.",
  alternates: { canonical: "/faqs" },
};

const faqs = [
  { q: "Are Legacy Foods products halal?", a: "Yes. All Legacy Foods products are 100% halal, prepared according to Islamic halal standards. We ensure quality and cleanliness at every step." },
  { q: "Are your products organic?", a: "Legacy Foods uses high-quality and carefully selected ingredients. While some products are not fully organic, we strictly focus on hygiene, freshness, and food safety." },
  { q: "How can I become a distributor?", a: "You can apply to become a distributor by clicking the “Be a Distributor” button on our website or by contacting us through our Contact Us page." },
  { q: "Do you offer wholesale or bulk orders?", a: "Yes. We offer bulk and wholesale options for distributors and retailers. Please contact us for pricing and details." },
  { q: "What makes Legacy Foods different from others?", a: "Legacy Foods stands out because of its premium quality ingredients, halal assurance, hygienic production, and great taste at affordable prices." },
  { q: "Do you deliver all over Pakistan?", a: "Yes, Legacy Foods provides nationwide delivery across Pakistan through reliable courier services." },
  { q: "What is the shelf life of your products?", a: "Shelf life varies by product. Please check the manufacturing date, expiry or best-before date, and storage instructions printed on the packaging." },
  { q: "Do your snacks contain allergens?", a: "Some snacks may contain peanuts, wheat, gram flour, or other allergens. Please read the product packaging and ingredient information carefully before consuming." },
  { q: "How can I place an order on Legacy Foods.pk?", a: "Browse our products, select your preferred snacks, Click on Buy now button add them to your cart, and follow the checkout instructions to complete your order." },
  { q: "How can I contact customer support?", a: "You can reach us via our Contact Us page, phone number, or email provided on the website." },
];

export default function FaqsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="page-faqs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="brand-font faqs__title">frequently ask question</h1>
      <div className="faqs__layout">
        <div className="faqs__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("2026/10/675.png")} alt="Curious customer holding a Cocotea Jumbo Pops pack" />
        </div>
        <Accordion items={faqs} />
      </div>
    </div>
  );
}
