import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDXEditor (admin announcements editor) ships untranspiled ESM that Next
  // must compile itself. Required for the WYSIWYG body editor to load.
  transpilePackages: ["@mdxeditor/editor"],
};

export default nextConfig;
