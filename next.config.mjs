/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async headers() {
    // Optimized assets aren't content-hashed, so cache for 30 days rather than forever.
    const assetCache = { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" };
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      ...["img", "models", "fonts", "video"].map((dir) => ({ source: `/${dir}/:path*`, headers: [assetCache] })),
    ];
  },
  // Old WordPress URLs that should keep working after the move.
  async redirects() {
    return [
      { source: "/coated-peanuts", destination: "/coated-peanut", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/products", destination: "/", permanent: false },
      { source: "/feed", destination: "/", permanent: false },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
