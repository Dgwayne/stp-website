import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/miniMarkdown";

// Versioned on purpose: a link shared to Facebook keeps showing the release it
// was posted for, instead of quietly turning into the next release's notes.
const DIR = path.join(process.cwd(), "src/content/whats-new");
const SITE = "https://spottertools.pro";

function versions(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

function read(version: string): string | null {
  // the route segment lands in a filesystem path, so refuse anything that is
  // not a plain version number
  if (!/^\d+\.\d+\.\d+$/.test(version)) return null;
  const file = path.join(DIR, `${version}.md`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

export function generateStaticParams() {
  return versions().map((version) => ({ version }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ version: string }>;
}): Promise<Metadata> {
  const { version } = await params;
  const md = read(version);
  if (!md) return { title: "What's New — Spotter Tools Pro" };

  // The share description is the first real paragraph, not the short
  // "iOS, Android and Windows" tagline that precedes it.
  const summary =
    md
      .split("\n")
      .map((l) => l.trim())
      .find(
        (l) =>
          l.length > 80 && !l.startsWith("#") && !l.startsWith("!["),
      )
      ?.replace(/\*\*/g, "")
      .slice(0, 200) ?? "";

  const title = `What's New in ${version} — Spotter Tools Pro`;
  // Absolute, and on the real domain: metadataBase falls back to the
  // vercel.app host because NEXT_PUBLIC_SITE_URL is unset in production, and
  // a link shared to Facebook should show spottertools.pro.
  const canonical = `${SITE}/whats-new/${version}`;
  const ogPath = `/images/whats-new-${version}.jpg`;
  const hasOg = fs.existsSync(path.join(process.cwd(), "public", ogPath));
  const ogImage = `${SITE}${ogPath}`;

  return {
    title,
    description: summary,
    alternates: { canonical },
    openGraph: {
      title,
      description: summary,
      type: "article",
      url: canonical,
      siteName: "Spotter Tools Pro",
      ...(hasOg ? { images: [{ url: ogImage, width: 1080, height: 1350 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      ...(hasOg ? { images: [ogImage] } : {}),
    },
  };
}

export default async function WhatsNewPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const md = read(version);
  if (!md) notFound();

  const others = versions().filter((v) => v !== version);

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <article>{renderMarkdown(md)}</article>

      <hr className="mt-16 border-white/10" />

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <Link href="/" className="text-brand-teal hover:underline">
          spottertools.pro
        </Link>
        <span className="text-muted">iOS &nbsp;|&nbsp; Android &nbsp;|&nbsp; Windows</span>
      </div>

      {others.length > 0 && (
        <div className="mt-8 text-sm text-muted">
          Earlier releases:{" "}
          {others.map((v, i) => (
            <span key={v}>
              {i > 0 && ", "}
              <Link
                href={`/whats-new/${v}`}
                className="text-brand-teal hover:underline"
              >
                {v}
              </Link>
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
