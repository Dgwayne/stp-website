"use client";

import ReactMarkdown from "react-markdown";

/**
 * A rough phone-sized rendering of how the app shows an announcement card:
 * accent-coloured header label + icon, title, markdown body, then the action
 * button (if any) and the "Got it" button. Colours and labels mirror
 * announcement_card.dart in the app repo; presets (updateAvailable,
 * reviewRequest) render as info, exactly as every installed build does.
 *
 * Only a sanity check for wording and formatting, not pixel-accurate.
 */

type Look = { label: string; accent: string; onAccent: string; icon: string };

const LOOKS: Record<string, Look> = {
  info: {
    label: "ANNOUNCEMENT",
    accent: "#2f8cff",
    onAccent: "#fff",
    icon: "i",
  },
  whatsNew: {
    label: "WHAT'S NEW",
    accent: "#5eb2ff",
    onAccent: "#fff",
    icon: "✦",
  },
  warning: {
    label: "HEADS UP",
    accent: "#ffb020",
    onAccent: "#000",
    icon: "!",
  },
  success: { label: "UPDATE", accent: "#30d158", onAccent: "#000", icon: "✓" },
};

const VIDEO_DIRECTIVE = /::video\{\s*src="([^"]*)"\s*\}/g;

export default function CardPreview({
  severity,
  title,
  body,
  actionLabel,
  actionUrl,
}: {
  severity: string;
  title: string;
  body: string;
  actionLabel?: string | null;
  actionUrl?: string | null;
}) {
  const look = LOOKS[severity] ?? LOOKS.info;
  // The app turns the editor's video directive into an image node and then
  // plays it; do the same here so the preview shows the clip.
  const md = body.replace(VIDEO_DIRECTIVE, "![video]($1)");
  const hasAction = !!(actionLabel?.trim() && actionUrl?.trim());

  return (
    <div className="rounded-xl bg-black/60 p-4">
      <div
        className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#0f1620] text-[14px] leading-snug text-white shadow-xl"
        style={{ borderTopColor: look.accent, borderTopWidth: 3 }}
      >
        <div className="flex items-center gap-2 px-4 pt-3">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
            style={{ color: look.accent, border: `1.5px solid ${look.accent}` }}
          >
            {look.icon}
          </span>
          <span
            className="text-[11px] font-semibold tracking-wider"
            style={{ color: look.accent }}
          >
            {look.label}
          </span>
        </div>
        <div className="px-4 pt-2 text-[18px] font-semibold">
          {title.trim() || <span className="italic opacity-50">Title</span>}
        </div>
        <div className="announcement-preview max-h-[320px] overflow-y-auto px-4 py-3">
          {body.trim() ? (
            <ReactMarkdown
              components={{
                img: ({ src, alt }) => {
                  const url = typeof src === "string" ? src : "";
                  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
                    return (
                      <video
                        src={url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="my-2 w-full rounded-md"
                      />
                    );
                  }
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={alt ?? ""}
                      className="my-2 w-full rounded-md"
                    />
                  );
                },
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: look.accent }}
                    className="underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {md}
            </ReactMarkdown>
          ) : (
            <span className="italic opacity-50">Body text</span>
          )}
        </div>
        <div className="flex gap-2 px-4 pb-4">
          {hasAction && (
            <span
              className="flex-1 rounded-lg border px-3 py-2 text-center text-[13px] font-medium"
              style={{ borderColor: look.accent, color: look.accent }}
            >
              {actionLabel}
            </span>
          )}
          <span
            className="flex-1 rounded-lg px-3 py-2 text-center text-[13px] font-medium"
            style={{ background: look.accent, color: look.onAccent }}
          >
            Got it
          </span>
        </div>
      </div>
      <style>{`
        .announcement-preview p,
        .announcement-preview li {
          font-size: 14px;
          margin: 0 0 8px;
        }
        .announcement-preview h1 {
          font-size: 21px;
          font-weight: 700;
          margin: 8px 0 6px;
        }
        .announcement-preview h2 {
          font-size: 18px;
          font-weight: 700;
          margin: 8px 0 6px;
        }
        .announcement-preview h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 8px 0 4px;
        }
        .announcement-preview ul {
          list-style: disc;
          padding-left: 20px;
        }
        .announcement-preview ol {
          list-style: decimal;
          padding-left: 20px;
        }
        .announcement-preview code {
          font-family: ui-monospace, monospace;
          font-size: 13px;
          background: rgba(255, 255, 255, 0.08);
          padding: 1px 4px;
          border-radius: 3px;
        }
        .announcement-preview strong {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
