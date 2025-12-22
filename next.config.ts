import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "erbotbgrcuckpcdqtkpc.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;