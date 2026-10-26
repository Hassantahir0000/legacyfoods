import type { Metadata } from "next";
import { media } from "@/lib/media";
import { site } from "@/lib/site";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Legacy Foods — questions, feedback, distributor and retail enquiries. Tarnol, Islamabad, Pakistan. +92 315 5555199.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Legacy Foods",
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: { "@type": "PostalAddress", streetAddress: "link madrisa road, sarai kharbuza", addressLocality: "Tarnol", postalCode: "44000", addressCountry: "PK" },
    sameAs: site.social.map((s) => s.href),
  };

  return (
    <div className="page-contact">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="contact-hero" style={{ ["--art" as string]: `url("${media("2026/09/legacy-contact.webp")}")` }}>
        <div className="contact-hero__copy">
          <h1 className="brand-font contact-title">Contact Us</h1>
          <p>Have a question about our products, or simply want to share your feedback? we’re always happy to hear from you.</p>
          <p>At Legacy Foods &amp; Snacks, we believe that great products are build around great relationships. Whether you’re a customer, retailer, distributor, or business partner. Our team is here to assist you.</p>
        </div>
        <div className="contact-hero__art" aria-hidden="true" />
      </section>

      <section className="contact-social" style={{ backgroundImage: `url("${media("2026/09/legacy-contact.webp2_.webp")}")` }}>
        <div className="wave-divider wave-divider--top-light" aria-hidden="true" />
        <ul>
          {site.social.map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 100}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={media(s.icon)} alt="" width={160} height={160} />
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="contact-distributor" style={{ ["--art" as string]: `url("${media("2026/09/distribution.webp")}")` }}>
        <div className="contact-distributor__copy">
          <h2 className="brand-font contact-title">Become A dISTRIBUTOR</h2>
          <p>Interested in becoming a distributor, retailor,or a business partner? Contact us to explore opportunities and grow together.</p>
          <a className="btn-purple" href="#message">Be a Distributor</a>
        </div>
        <div className="contact-distributor__art" aria-hidden="true" />
      </section>

      <section className="contact-map">
        <h2 className="brand-font">FIND US ON A GOOGLE MAP</h2>
        <iframe src={site.mapEmbed} title="Legacy Foods location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </section>

      <section className="contact-message" id="message">
        <div className="contact-message__copy">
          <h2 className="brand-font contact-title">write Us a Message</h2>
          <p>Your feedback matters to us. Share your experience, suggestions, or comments and help us continue to improve. Fill out the form and our team will get back to you as soon as possible.</p>
          <ul className="contact-message__details">
            <li><a href={site.phoneHref}>{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={site.mapsLink} target="_blank" rel="noopener noreferrer">{site.address}</a></li>
          </ul>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
