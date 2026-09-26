import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderMarkdown } from "@/lib/miniMarkdown";

// The "how to use the new features" guide that rides alongside a release's
// notes. Served at spottertools.pro/<version>/howto (next.config rewrites the
// short path here), and only for releases that have a guide in
// src/content/howto.
const DIR = path.join(process.cwd(), "src/content/howto");
const SITE = "https://spottertools.pro";

function versions(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function read(version: string): string | null {
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
  if (!md) return { title: "How To | Spotter Tools Pro" };

  const title = `How to use what's new in ${version} | Spotter Tools Pro`;
  const description = `Step by step guides for the new features in Spotter Tools Pro ${version}, on iPhone, iPad, Android and Windows.`;
  const canonical = `${SITE}/${version}/howto`;
  const ogPath = `/images/whats-new-${version}.jpg`;
  const hasOg = fs.existsSync(path.join(process.cwd(), "public", ogPath));
  const ogImage = `${SITE}${ogPath}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      siteName: "Spotter Tools Pro",
      ...(hasOg ? { images: [{ url: ogImage, width: 1080, height: 1350 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(hasOg ? { images: [ogImage] } : {}),
    },
  };
}

export default async function HowToPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const md = read(version);
  if (!md) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <article>{renderMarkdown(md)}</article>

      <hr className="mt-16 border-white/10" />

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <Link href={`/${version}`} className="text-brand-teal hover:underline">
          Everything new in {version}
        </Link>
        <Link href="/" className="text-brand-teal hover:underline">
          spottertools.pro
        </Link>
        <span className="text-muted">iOS &nbsp;|&nbsp; Android &nbsp;|&nbsp; Windows</span>
      </div>
    </main>
  );
}
