"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { media } from "@/lib/media";
import { productLinks, site } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const productsActive = productLinks.some((p) => isActive(p.href));

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <nav className="site-header__nav site-header__nav--left" aria-label="Main">
          <Link href="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link href="/about-us" className={isActive("/about-us") ? "active" : ""}>About Us</Link>
          <div className={`nav-dropdown ${productsOpen ? "is-open" : ""}`} onMouseLeave={() => setProductsOpen(false)}>
            <button
              type="button"
              className={productsActive ? "active" : ""}
              aria-expanded={productsOpen}
              onClick={() => setProductsOpen((v) => !v)}
              onMouseEnter={() => setProductsOpen(true)}
            >
              Products
              <svg viewBox="0 0 320 512" aria-hidden="true"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" /></svg>
            </button>
            <ul className="nav-dropdown__menu">
              {productLinks.map((p) => (
                <li key={p.href}><Link href={p.href} className={isActive(p.href) ? "active" : ""}>{p.label}</Link></li>
              ))}
            </ul>
          </div>
        </nav>

        <Link href="/" className="site-header__logo" aria-label={site.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media(site.logo)} alt="Legacy Foods" width={180} height={120} />
        </Link>

        <nav className="site-header__nav site-header__nav--right" aria-label="Secondary">
          <Link href="/gallery" className={isActive("/gallery") ? "active" : ""}>Gallery</Link>
          <Link href="/faqs" className={isActive("/faqs") ? "active" : ""}>FAQ’S</Link>
          <Link href="/contact" className={isActive("/contact") ? "active" : ""}>Contact</Link>
        </nav>

        <button type="button" className="site-header__burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <span /><span /><span />
        </button>
      </div>

      <div className="site-header__wave" aria-hidden="true" />

      <div className={`mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu">
        <button type="button" className="mobile-menu__close" aria-label="Close menu" onClick={() => setOpen(false)}>×</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media(site.logo)} alt="" className="mobile-menu__logo" />
        <Link href="/">Home</Link>
        <Link href="/about-us">About Us</Link>
        <details>
          <summary>Products</summary>
          {productLinks.map((p) => (
            <Link key={p.href} href={p.href}>{p.label}</Link>
          ))}
        </details>
        <Link href="/faqs">FAQ’S</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </header>
  );
}
