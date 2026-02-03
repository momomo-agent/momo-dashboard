import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/momo-dashboard",
  images: { unoptimized: true },
};

export default nextConfig;
