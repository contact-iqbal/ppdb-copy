/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "smkantartika2-sda.sch.id" },
      { protocol: "https", hostname: "ppdb.telkomschools.sch.id" },
      { protocol: "https", hostname: "radarjatim.id" },
      { protocol: "https", hostname: "smaantarda.sch.id" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: 'http://localhost/project/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
