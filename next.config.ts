import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const nextConfig: NextConfig = {
  async headers() {
    const staticPageCache = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
    ];

    return [
      {
        source: "/",
        headers: [...securityHeaders, { key: "Cache-Control", value: staticPageCache }],
      },
      {
        source: "/posts/:path*",
        headers: [...securityHeaders, { key: "Cache-Control", value: staticPageCache }],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  turbopack: {
    root: path.resolve("."),
  },
};

const withMDX = createMDX({ extension: /\.mdx?$/ });

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
