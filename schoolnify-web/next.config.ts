import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
