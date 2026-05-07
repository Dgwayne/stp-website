import Link from "next/link";

export type Feature = {
  icon: string;
  title: string;
  description: string;
  href?: string;
};

export default function FeatureCard({ feature }: { feature: Feature }) {
  const inner = (
    <div className="group h-full rounded-2xl border border-white/5 bg-surface p-6 transition-all hover:border-brand-teal/30 hover:bg-surface-light">
      <div className="mb-3 text-3xl">{feature.icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-muted">
        {feature.description}
      </p>
      {feature.href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-teal opacity-0 transition-opacity group-hover:opacity-100">
          Learn more <span aria-hidden>&rarr;</span>
        </span>
      ) : null}
    </div>
  );

  if (feature.href) {
    return (
      <Link href={feature.href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
