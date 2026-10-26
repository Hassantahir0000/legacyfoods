import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { preload } from "react-dom";
import { media, mediaOriginal } from "@/lib/media";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Home - Legacy Foods", template: "%s - Legacy Foods" },
  description:
    "Legacy Foods — makers of Cocotea nimko, snacks, popcorn and coated peanuts. Good Food. Real Legacy.",
  applicationName: `${site.name} - ${site.tagline}`,
  openGraph: {
    siteName: `${site.name} - ${site.tagline}`,
    locale: "en_US",
    type: "website",
    images: [{ url: mediaOriginal(site.ogImage) }],
  },
  twitter: { card: "summary_large_image", images: [mediaOriginal(site.ogImage)] },
  icons: { icon: mediaOriginal(site.footerLogo) },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#35097c" };

// Musco Origins is the brand display font, self-hosted by the old site.
const fontFace = `
@font-face{font-family:"Musco Origins";src:url("${media("2026/05/Musco-Origins.woff2")}") format("woff2"),url("${media("2026/05/Musco-Origins.woff")}") format("woff");font-weight:100 900;font-style:normal;font-display:swap}
:root{--bg-image:url("${media("2026/09/WhatsApp-Image-2026-09-16-at-9.47.48-PM.jpeg")}")}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The display font is used above the fold; fetch it with the HTML instead of after the CSS.
  preload(media("2026/05/Musco-Origins.woff2"), { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFace }} />
      </head>
      <body>
        <Preloader />
        <a href="#content" className="skip-link">Skip to main content</a>
        <SmoothScroll />
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
