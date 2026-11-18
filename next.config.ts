import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media-rockstargames-com.akamaized.net" },
      { protocol: "https", hostname: "www.rockstargames.com" },
    ],
  },
};

export default nextConfig;
