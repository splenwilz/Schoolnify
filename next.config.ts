import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray lockfile in the home
  // directory was making Next.js infer the wrong root; this removes the
  // ambiguity regardless of lockfiles further up the tree.
  turbopack: {
    root: __dirname,
  },
  // Don't bundle this package — it lazy-loads data files at runtime
  serverExternalPackages: ["@countrystatecity/countries"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
