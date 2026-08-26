// Per-module visual identity: accent color + icon. Content stays in
// study-guide.json; how a module looks lives here.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const ICONS = {
  broadcast: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.7 18.3a9 9 0 0 1 0-12.6M18.3 5.7a9 9 0 0 1 0 12.6" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M13 2 5 13.5h5L9.5 22 18 10h-5.5L13 2Z" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 2.8S5.8 10 5.8 14.2a6.2 6.2 0 0 0 12.4 0C18.2 10 12 2.8 12 2.8Z" />
      <path d="M9.5 14.5a2.6 2.6 0 0 0 2.4 2.7" />
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 2v20M4 6l16 12M20 6 4 18" />
      <path d="M12 2l-2 2.5M12 2l2 2.5M12 22l-2-2.5M12 22l2-2.5" />
    </svg>
  ),
  thermo: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M10 4a2 2 0 0 1 4 0v9.3a4.5 4.5 0 1 1-4 0V4Z" />
      <path d="M12 9v7" />
      <circle cx="12" cy="17.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 2.5c1 3-1.5 4.6-2.7 6.4C7.9 11 7 12.8 7 14.8a5 5 0 0 0 10 0c0-3.6-2.6-5-3-8.3-1 .8-1.6 1.9-1.5 3.4-1.7-1.6-1.3-4.5-.5-7.4Z" />
    </svg>
  ),
  hurricane: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="2.6" />
      <path d="M14.5 10.5C16.5 7 15.8 4 13.5 2.2c.6 2.6.2 4.7-1 6.7M9.5 13.5C7.5 17 8.2 20 10.5 21.8c-.6-2.6-.2-4.7 1-6.7" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 21s-6.5-5.5-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M7 18a4 4 0 0 1-.6-7.96 5.5 5.5 0 0 1 10.7-1.2A4.4 4.4 0 0 1 17.5 18H7Z" />
      <path d="M9.5 21h.01M13 21h.01M16.5 21h.01" />
    </svg>
  ),
  radar: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 12 4.9 7.6a8.3 8.3 0 1 1-.5 8.2" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <path d="M12 12l7.5-4.6" />
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M4 16.5a8 8 0 0 1 16 0" />
      <path d="M12 16.5 16.2 10" />
      <circle cx="12" cy="16.5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M5.5 12.8l1.4.8M12 8.5v1.6M18.5 12.8l-1.4.8" />
    </svg>
  ),
};

export const MODULE_META = {
  fundamentals: { accent: '#FFB627', icon: 'broadcast' },
  'convective-warnings': { accent: '#FF5D52', icon: 'bolt' },
  'watches-outlooks': { accent: '#F2E35C', icon: 'eye' },
  flooding: { accent: '#6FB7FF', icon: 'water' },
  winter: { accent: '#7FD1E8', icon: 'snow' },
  'non-precip': { accent: '#FFA75C', icon: 'thermo' },
  'fire-weather': { accent: '#FF7A45', icon: 'flame' },
  'tropical-marine': { accent: '#4FD1C5', icon: 'hurricane' },
  statements: { accent: '#9FB0C0', icon: 'doc' },
  'local-maf': { accent: '#E8A86B', icon: 'pin' },
  'storm-structure': { accent: '#B49AE8', icon: 'cloud' },
  'radar-basics': { accent: '#5BD6A8', icon: 'radar' },
  'severe-parameters': { accent: '#F08CBB', icon: 'gauge' },
};

export function moduleMeta(slug) {
  return MODULE_META[slug] ?? { accent: '#FFB627', icon: 'broadcast' };
}

// Dashboard grouping. A module missing from every list lands in the
// fallback group, so adding a module never breaks the dashboard; add it
// here when you want it in a specific section.
export const CATEGORIES = [
  {
    key: 'core',
    title: 'The warning system',
    slugs: ['fundamentals', 'convective-warnings', 'watches-outlooks'],
  },
  {
    key: 'hazards',
    title: 'Hazard programs',
    slugs: ['flooding', 'winter', 'non-precip', 'fire-weather', 'tropical-marine'],
  },
  {
    key: 'products',
    title: 'Products and reporting',
    slugs: ['statements'],
  },
  {
    key: 'field',
    title: 'Field skills',
    slugs: ['storm-structure', 'radar-basics', 'severe-parameters'],
  },
  {
    key: 'local',
    title: 'Your local office',
    slugs: ['local-maf'],
  },
];

export const FALLBACK_CATEGORY = { key: 'more', title: 'More training' };

export function categoryOf(slug) {
  return CATEGORIES.find((c) => c.slugs.includes(slug)) ?? FALLBACK_CATEGORY;
}
