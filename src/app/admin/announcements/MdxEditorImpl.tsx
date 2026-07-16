"use client";

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
} from "@mdxeditor/editor";

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
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
}
