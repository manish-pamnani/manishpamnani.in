import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "export" as const } : {}),
  trailingSlash: true,
  // Static export has no image optimizer server; serve files from /public directly.
  images: { unoptimized: true },
};

export default nextConfig;
