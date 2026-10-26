/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
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
