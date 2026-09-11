import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MDXEditor (admin announcements editor) ships untranspiled ESM that Next
  // must compile itself. Required for the WYSIWYG body editor to load.
  transpilePackages: ["@mdxeditor/editor"],

  // spottertools.pro/1.0.69 serves the release notes for that version. A
  // REWRITE rather than a redirect, so the short link is what stays in the
  // address bar when somebody opens it from Facebook. The pattern is generic,
  // so every future release gets its short URL without another config change.
  // Nothing else on the site matches a bare x.y.z, so this shadows no route.
  async rewrites() {
    return [
      {
        source: "/:version(\\d+\\.\\d+\\.\\d+)",
        destination: "/whats-new/:version",
      },
    ];
  },
};

export default nextConfig;
