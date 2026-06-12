import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.ggpht.com" },
      { protocol: "https", hostname: "srv1675350.hstgr.cloud" },
      { protocol: "https", hostname: "**.hstgr.cloud" },
    ],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  serverExternalPackages: ["sharp"],
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
