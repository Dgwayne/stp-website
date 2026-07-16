"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";

// MDXEditor is client-only (it reaches for `document` at import), so load it
// with ssr:false. This must live in a client component.
const MdxEditorImpl = dynamic(() => import("./MdxEditorImpl"), {
  ssr: false,
  loading: () => (
    <div className="px-3 py-8 text-sm text-black/50">Loading editor…</div>
  ),
});

/**
 * Rich Markdown body field for the announcements editor. Wraps the WYSIWYG
 * editor and supplies the image upload handler that pushes a dropped/inserted
 * GIF or WebP to the B2-backed upload route and returns its public URL, which
 * MDXEditor then inserts inline at the cursor.
 */
export default function MarkdownField({
  value,
  onChange,
  password,
}: {
  value: string;
  onChange: (markdown: string) => void;
  password: string;
}) {
  const imageUploadHandler = useCallback(
    async (file: File): Promise<string> => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/announcements/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || `Upload failed (${res.status})`);
      }
      return data.url as string;
    },
    [password],
  );

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-white text-black">
      <MdxEditorImpl
        value={value}
        onChange={onChange}
        imageUploadHandler={imageUploadHandler}
      />
    </div>
  );
}
