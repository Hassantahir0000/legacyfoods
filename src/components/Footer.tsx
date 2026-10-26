import Link from "next/link";
import { media } from "@/lib/media";
import { pageLinks, productLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media(site.footerLogo)} alt="Legacy Foods" width={180} height={130} loading="lazy" />
          <p className="brand-font">Legacy Foods</p>
        </div>

        <div className="site-footer__col">
          <h4>Our Pages</h4>
          <ul>
            {pageLinks.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col">
          <h4>Products</h4>
          <ul>
            {productLinks.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="site-footer__col site-footer__contact">
          <h4>Get In Touch</h4>
          <ul>
            <li>
              <svg viewBox="0 0 384 512" aria-hidden="true"><path d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7a24 24 0 0 1-39.4 0zM192 272a80 80 0 1 0 0-160 80 80 0 0 0 0 160z" /></svg>
              <a href={site.mapsLink} target="_blank" rel="noopener noreferrer">{site.address}</a>
            </li>
            <li>
              <svg viewBox="0 0 512 512" aria-hidden="true"><path d="M497.4 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.7 370.7 0 0 1 130.6 204.1l60.6-49.6a23.9 23.9 0 0 0 6.9-28l-48-112A24.2 24.2 0 0 0 122.6.6l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.3 24.3 0 0 0-14-27.6z" /></svg>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <svg viewBox="0 0 512 512" aria-hidden="true"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z" /></svg>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy">© {new Date().getFullYear()} Legacy Foods (Pvt.) Ltd. All rights reserved.</p>
    </footer>
  );
}
