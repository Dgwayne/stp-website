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
 * Rich Markdown body field for the announcements editor. Supplies:
 *  - imageUploadHandler: the image plugin's uploader (posts to the upload
 *    route), for inline GIF/WebP images.
 *  - videoUpload: an XHR-based uploader that reports progress %, used by the
 *    Insert-video button so the user sees how far along a big MP4 is; the
 *    result is inserted as a `::video{src}` directive that renders as a real
 *    video in both the editor and the app.
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

  const videoUpload = useCallback(
    (file: File, onProgress: (pct: number) => void): Promise<string> =>
      new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/announcements/upload");
        xhr.setRequestHeader("x-admin-password", password);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          let data: { url?: string; error?: string } = {};
          try {
            data = JSON.parse(xhr.responseText);
          } catch {
            /* fall through to error */
          }
          if (xhr.status >= 200 && xhr.status < 300 && data.url) {
            resolve(data.url);
          } else {
            reject(new Error(data.error || `Upload failed (${xhr.status})`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        const form = new FormData();
        form.append("file", file);
        xhr.send(form);
      }),
    [password],
  );

  return (
    <div className="overflow-hidden rounded-md border border-white/10 bg-white text-black">
      <MdxEditorImpl
        value={value}
        onChange={onChange}
        imageUploadHandler={imageUploadHandler}
        videoUpload={videoUpload}
      />
    </div>
  );
}
