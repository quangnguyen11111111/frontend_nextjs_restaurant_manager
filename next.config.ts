import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload-images-2026.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
