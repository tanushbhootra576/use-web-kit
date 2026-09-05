import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
