"use client";

import { useRef } from "react";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertThematicBreak,
  Separator,
  usePublisher,
  insertImage$,
} from "@mdxeditor/editor";

/// Custom toolbar button: pick an MP4/WebM, upload it through the same handler
/// the image plugin uses (the route accepts video), and insert it as an image
/// node — which serializes to `![video](url.mp4)`. The editor shows a
/// placeholder; the app renders it as a looping muted video.
function InsertVideoButton() {
  const insertImage = usePublisher(insertImage$);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        title="Insert video (MP4)"
        aria-label="Insert video"
        onClick={() => inputRef.current?.click()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "currentColor",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="14" height="14" rx="2" />
          <path d="m16 9 6-3v12l-6-3" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) insertImage({ file });
        }}
      />
    </>
  );
}

/**
 * The actual WYSIWYG editor. Loaded only on the client (MDXEditor touches
 * `document` at import time), via the dynamic wrapper in MarkdownField.tsx.
 *
 * Renders light-on-white inside the dark admin page — a clean "paper" to
 * type on — and stores/produces plain Markdown, which is exactly what the
 * app renders with flutter_markdown_plus.
 */
export default function MdxEditorImpl({
  value,
  onChange,
  imageUploadHandler,
}: {
  value: string;
  onChange: (markdown: string) => void;
  imageUploadHandler: (file: File) => Promise<string>;
}) {
  return (
    <MDXEditor
      markdown={value}
      onChange={onChange}
      contentEditableClassName="stp-mdx-content"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        imagePlugin({ imageUploadHandler }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <BlockTypeSelect />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertImage />
              <InsertVideoButton />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
}
