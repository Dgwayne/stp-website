import type { ReactNode } from "react";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  const alignClasses =
    align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`mb-12 ${alignClasses}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold sm:text-4xl">
        <span className="gradient-text">{title}</span>
      </h2>
      {description ? (
        <p
          className={`mt-4 max-w-2xl text-muted ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
