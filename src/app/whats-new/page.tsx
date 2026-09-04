import fs from "node:fs";
import path from "node:path";
import { redirect, notFound } from "next/navigation";

// /whats-new always lands on the newest release notes.
export default function WhatsNewIndex() {
  const dir = path.join(process.cwd(), "src/content/whats-new");
  const latest = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0]
    : undefined;

  if (!latest) notFound();
  redirect(`/whats-new/${latest}`);
}
