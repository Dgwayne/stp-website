const STAR =
  "M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6L1.3 7.8l6.1-.7z";

function Row({ size, className }: { size: number; className: string }) {
  return (
    <span className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width={size}
          height={size}
          className="shrink-0"
          aria-hidden
        >
          <path d={STAR} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Five stars filled to the exact rating (a 4.6 shows six tenths of the fifth
 * star), so the stars never claim more than the number beside them.
 */
export default function Stars({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      className="relative inline-flex"
    >
      <Row size={size} className="text-white/15" />
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <Row size={size} className="text-amber-400" />
      </span>
    </span>
  );
}
