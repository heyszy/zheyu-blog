import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "node:path";

const nextConfig: NextConfig = {
  async headers() {
    const staticPageCache = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

    return [
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: staticPageCache }],
      },
      {
        source: "/posts/:path*",
        headers: [{ key: "Cache-Control", value: staticPageCache }],
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
