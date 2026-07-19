"use client";

import { useRef, useState } from "react";
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
  directivesPlugin,
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
  insertDirective$,
  type DirectiveDescriptor,
} from "@mdxeditor/editor";

export type VideoUpload = (
  file: File,
  onProgress: (pct: number) => void,
) => Promise<string>;

// Renders a real, playing <video> for the `::video{src="..."}` leaf directive
// inside the WYSIWYG editor, so an inline video previews as an actual video
// instead of a broken-image icon.
const videoDirectiveDescriptor: DirectiveDescriptor = {
  name: "video",
  type: "leafDirective",
  attributes: ["src"],
  hasChildren: false,
  testNode: (node) => node.name === "video",
  Editor: ({ mdastNode }) => {
    const attrs = (mdastNode.attributes ?? {}) as Record<string, string>;
    const src = attrs.src ?? "";
    return (
      <div style={{ margin: "8px 0" }} contentEditable={false}>
        {src ? (
          <video
            src={src}
            muted
            loop
            autoPlay
            playsInline
            controls
            style={{
              maxWidth: "100%",
              maxHeight: 320,
              borderRadius: 10,
              display: "block",
              background: "#000",
            }}
          />
        ) : (
          <div style={{ color: "#999" }}>video</div>
        )}
      </div>
    );
  },
};

// Custom toolbar button: upload an MP4/WebM (with a live progress %), then
// insert it inline as a `::video{src}` directive that both the editor and the
// app render as a real video.
function InsertVideoButton({ videoUpload }: { videoUpload: VideoUpload }) {
  const insertDirective = usePublisher(insertDirective$);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);

  return (
    <>
      <button
        type="button"
        title="Insert video (MP4)"
        aria-label="Insert video"
        disabled={pct !== null}
        onClick={() => inputRef.current?.click()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          height: 36,
          padding: "0 8px",
          border: "none",
          background: "transparent",
          cursor: pct !== null ? "default" : "pointer",
          color: "currentColor",
          font: "inherit",
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
        <span style={{ fontSize: 13 }}>
          {pct === null ? "Video" : `${pct}%`}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            setPct(0);
            const url = await videoUpload(file, setPct);
            insertDirective({
              type: "leafDirective",
              name: "video",
              attributes: { src: url },
            });
          } catch (err) {
            alert(
              "Video upload failed: " +
                (err instanceof Error ? err.message : String(err)),
            );
          } finally {
            setPct(null);
          }
        }}
      />
    </>
  );
}

export default function MdxEditorImpl({
  value,
  onChange,
  imageUploadHandler,
  videoUpload,
}: {
  value: string;
  onChange: (markdown: string) => void;
  imageUploadHandler: (file: File) => Promise<string>;
  videoUpload: VideoUpload;
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
        directivesPlugin({ directiveDescriptors: [videoDirectiveDescriptor] }),
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
              <InsertVideoButton videoUpload={videoUpload} />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
}
