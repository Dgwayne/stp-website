'use client';

import { useState } from 'react';
import { FIGURES } from './StudyFigures';

/* Small inline icons, stroke-based so they inherit color. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const I = {
  phone: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 18h2" />
      <path d="M4.5 8.5a9 9 0 0 1 0 7M19.5 8.5a9 9 0 0 1 0 7" />
    </svg>
  ),
  phoneOff: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 18h2" />
      <path d="M4 4l16 16" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="m12 3 2.5 5.4 5.9.7-4.4 4 1.2 5.9L12 16l-5.2 3 1.2-5.9-4.4-4 5.9-.7L12 3Z" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.2" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M4 12h15M14 6.5 19.5 12 14 17.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 21s-6.5-5.5-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  ),
};

const TONES = {
  watch: 'var(--t-watch)',
  warning: 'var(--t-warning)',
  advisory: 'var(--t-advisory)',
  statement: 'var(--t-statement)',
  ok: 'var(--ok)',
  signal: 'var(--signal)',
};

function tone(t) {
  return TONES[t] ?? t ?? 'var(--signal)';
}

function Note({ children }) {
  if (!children) return null;
  return (
    <p className="study__callout">
      {I.warn}
      <span>{children}</span>
    </p>
  );
}

function Heading({ children }) {
  return <h2 className="study__h2">{children}</h2>;
}

/* ---- prose ---- */
function Prose({ s }) {
  return (
    <>
      {s.body && <p className="study__body">{s.body}</p>}
      {s.points && (
        <ul className="study__points">
          {s.points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
    </>
  );
}

/* ---- tier ladder ---- */
function TierLadder({ s }) {
  return (
    <div className="study__tiers">
      {s.tiers.map((t) => (
        <div className="study__tier" key={t.name} style={{ '--tone': tone(t.tone) }}>
          <div className="study__tierBar" />
          <div className="study__tierName">{t.name}</div>
          <div className="study__tierMeans">{t.means}</div>
          <div className="study__tierAction">{t.action}</div>
        </div>
      ))}
    </div>
  );
}

/* ---- damage-threat tag ladder with WEA indicator ---- */
function TagLadder({ s }) {
  return (
    <div className="study__tags">
      {s.tags.map((t) => (
        <div className={`study__tag${t.wea ? ' study__tag--wea' : ''}`} key={t.name}>
          <div className="study__tagName">{t.name}</div>
          <div className="study__tagCrit">{t.criteria}</div>
          <div className={`study__wea ${t.wea ? 'study__wea--yes' : 'study__wea--no'}`}>
            {t.wea ? I.phone : I.phoneOff}
            {t.wea ? 'Alerts phones' : 'No phone alert'}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- hail scale, circles at true relative diameter ---- */
const PX_PER_INCH = 34;

function HailScale({ s }) {
  return (
    <div className="study__hail">
      {s.items.map((h) => {
        const px = Math.round(h.inches * PX_PER_INCH);
        return (
          <div key={h.name} style={{ display: 'contents' }}>
            {h.threshold && (
              <div className="study__hailDivider" aria-hidden="true">
                <div className="study__hailDividerLine" />
                <div className="study__hailDividerLabel">severe starts here</div>
              </div>
            )}
            <div className={`study__hailItem${h.severe ? '' : ' study__hailItem--sub'}`}>
              <div className="study__hailBall" style={{ width: px, height: px }} />
              <div className="study__hailName">{h.name}</div>
              <div className="study__hailSize">{h.inches.toFixed(2)}&Prime;</div>
              <div className={`study__hailTag study__hailTag--${h.badgeTone}`}>{h.badge}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- SPC risk ladder ---- */
function RiskLadder({ s }) {
  return (
    <div className="study__risk">
      {s.levels.map((l) => (
        <div className="study__riskRow" key={l.name} style={{ '--tone': l.color }}>
          <div className="study__riskNum">{l.num}</div>
          <div className="study__riskName">{l.name}</div>
          <div className="study__riskDesc">{l.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ---- old name -> new name ---- */
function Renames({ s }) {
  return (
    <>
      {s.when && <span className="study__when">{s.when}</span>}
      <div className="study__renames">
        {s.rows.map((r, i) => (
          <div className="study__rename" key={i}>
            <div className="study__renameOld">{r.old}</div>
            <div className="study__renameArrow">{I.arrow}</div>
            <div className="study__renameNew">{r.new}</div>
            {r.note && <div className="study__renameNote">{r.note}</div>}
          </div>
        ))}
      </div>
    </>
  );
}

/* ---- criteria that must all hold ---- */
function CriteriaAll({ s }) {
  return (
    <>
      {s.intro && <p className="study__body">{s.intro}</p>}
      <div className="study__all">
        {s.items.map((c, i) => (
          <div style={{ display: 'contents' }} key={c.title}>
            {i > 0 && <div className="study__allPlus">+</div>}
            <div className="study__allItem">
              <strong>{c.title}</strong>
              <span>{c.detail}</span>
            </div>
          </div>
        ))}
      </div>
      {s.banner && <div className="study__allBanner">{s.banner}</div>}
    </>
  );
}

/* ---- lead-time timeline (hours before onset) ---- */
function Timeline({ s }) {
  const max = s.max ?? 48;
  const ticks = s.ticks ?? [48, 36, 24, 12, 0];
  return (
    <>
      {s.intro && <p className="study__body">{s.intro}</p>}
      <div className="study__timeline">
        {s.bars.map((b) => (
          <div className="study__tlRow" key={b.label}>
            <div className="study__tlLabel">{b.label}</div>
            <div className="study__tlTrack">
              <div
                className="study__tlBar"
                style={{ width: `${(b.hours / max) * 100}%`, '--tone': tone(b.tone) }}
              >
                <span className="study__tlHours">{b.hours}h</span>
              </div>
            </div>
          </div>
        ))}
        <div className="study__tlRow">
          <div />
          <div className="study__tlAxis">
            {ticks.map((t) => <span key={t}>{t === 0 ? 'onset' : `${t}h`}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---- marine wind bands ---- */
function WindBands({ s }) {
  const total = s.bands.reduce((a, b) => a + b.span, 0);
  return (
    <div className="study__bands">
      <div className="study__bandRow">
        {s.bands.map((b) => (
          <div
            className="study__band"
            key={b.name}
            style={{ flex: `${b.span} 1 0%`, '--tone': b.color, background: b.color }}
          >
            <div className="study__bandName">{b.name}</div>
            <div className="study__bandRange">{b.range}</div>
          </div>
        ))}
      </div>
      {s.caption && <div className="study__bandsCaption">{s.caption}</div>}
    </div>
  );
}

/* ---- interactive VTEC decoder ---- */
const VTEC_SEGS = [
  { text: 'O', tone: 'var(--t-statement)', name: 'Product class', means: 'O marks an operational (real, live) product.' },
  { text: 'NEW', tone: 'var(--t-advisory)', name: 'Action', means: 'A brand-new event. Follow-ups use codes like CON (continued) or CAN (cancelled).' },
  { text: 'KMAF', tone: 'var(--t-watch)', name: 'Issuing office', means: 'The office that issued it. KMAF is NWS Midland/Odessa — your office.' },
  { text: 'SV', tone: 'var(--t-warning)', name: 'Phenomenon', means: 'What the hazard is. SV = severe thunderstorm, TO = tornado, FF = flash flood.' },
  { text: 'W', tone: 'var(--signal)', name: 'Significance', means: 'The tier. W = Warning, A = Watch, Y = Advisory, S = Statement.' },
  { text: '0043', tone: 'var(--ok)', name: 'Event number', means: 'A counter for this phenomenon from this office this year: the 43rd severe thunderstorm event.' },
];

function VtecDecoder({ s }) {
  const [active, setActive] = useState(3); // start on the phenomenon: the useful one

  return (
    <>
      {s.intro && <p className="study__body">{s.intro}</p>}
      <div className="study__vtec">
        <div className="study__vtecString">
          <span className="study__vtecSep">/</span>
          {VTEC_SEGS.map((seg, i) => (
            <span key={seg.name} style={{ display: 'contents' }}>
              {i > 0 && <span className="study__vtecSep">.</span>}
              <button
                type="button"
                className="study__vtecSeg"
                style={{ '--tone': seg.tone }}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                {seg.text}
              </button>
            </span>
          ))}
          <span className="study__vtecSep">/</span>
        </div>
        <p className="study__vtecHint">Tap each part of the string to decode it.</p>
        <div className="study__vtecOut" style={{ '--tone': VTEC_SEGS[active].tone }}>
          <strong>{VTEC_SEGS[active].text}</strong> &mdash; {VTEC_SEGS[active].name}. {VTEC_SEGS[active].means}
        </div>
      </div>
    </>
  );
}

/* ---- side-by-side compare ---- */
function Compare({ s }) {
  return (
    <div className="study__compare">
      {[s.a, s.b].map((side) => (
        <div className="study__compareCard" key={side.title} style={{ '--tone': tone(side.tone) }}>
          <div className="study__compareTitle">{side.title}</div>
          {side.rows.map(([k, v]) => (
            <div className="study__compareRow" key={k}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---- myth vs reality ---- */
function Myths({ s }) {
  return (
    <div className="study__myths">
      {s.myths.map((m, i) => (
        <div className="study__myth" key={i}>
          <div className="study__mythSaid">{I.x}<span>&ldquo;{m.myth}&rdquo;</span></div>
          <div className="study__mythTruth">{I.check}<span>{m.truth}</span></div>
        </div>
      ))}
    </div>
  );
}

/* ---- schematic figure ---- */
function Figure({ s }) {
  const Fig = FIGURES[s.fig];
  if (!Fig) return null;
  return (
    <div className="study__figure">
      <Fig />
      {s.caption && <p className="study__figCaption">{s.caption}</p>}
    </div>
  );
}

/* ---- plain table fallback ---- */
function Table({ s }) {
  return (
    <div className="study__tableWrap">
      <table className="study__table">
        <thead>
          <tr>{s.table.columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {s.table.rows.map((r, ri) => (
            <tr key={ri}>{r.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BLOCKS = {
  prose: Prose,
  tierLadder: TierLadder,
  tagLadder: TagLadder,
  hailScale: HailScale,
  riskLadder: RiskLadder,
  renames: Renames,
  criteriaAll: CriteriaAll,
  timeline: Timeline,
  windBands: WindBands,
  vtec: VtecDecoder,
  compare: Compare,
  myths: Myths,
  table: Table,
  figure: Figure,
};

export function StudySection({ section }) {
  const Block = BLOCKS[section.kind] ?? (section.table ? Table : Prose);
  return (
    <section className="study__section">
      {section.heading && <Heading>{section.heading}</Heading>}
      {section.kind !== 'prose' && section.body && <p className="study__body">{section.body}</p>}
      <Block s={section} />
      {section.kind !== 'prose' && section.points && (
        <ul className="study__points" style={{ marginTop: '0.8rem' }}>
          {section.points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
      <Note>{section.note}</Note>
    </section>
  );
}

/* ---- essentials ---- */
export function Essentials({ items }) {
  return (
    <section className="study__essentials">
      <div className="study__essentialsHead">{I.star} If you remember nothing else</div>
      {items.map((e, i) => (
        <div className="study__essential" key={i}>
          <span className="study__essentialNum">{i + 1}</span>
          <span>{e}</span>
        </div>
      ))}
    </section>
  );
}

/* ---- local-office panel ---- */
export function LocalPanel({ text }) {
  return (
    <section className="study__local">
      {I.pin}
      <div>
        <p className="study__localTitle">Set by your local office</p>
        <p className="study__localBody">{text}</p>
      </div>
    </section>
  );
}

/* ---- quick checks: active recall, tap to reveal ---- */
export function QuickChecks({ checks }) {
  const [revealed, setRevealed] = useState(() => new Set());

  function toggle(i) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  const allDone = revealed.size >= checks.length;

  return (
    <section className="study__section">
      <Heading>Check yourself</Heading>
      <p className="study__body">
        Answer out loud before you reveal. If you get one wrong, scroll back up &mdash; then take the test.
      </p>
      <div className="study__checks">
        {checks.map((c, i) => {
          const open = revealed.has(i);
          return (
            <div className="study__check" key={i}>
              <button type="button" className="study__checkQ" onClick={() => toggle(i)} aria-expanded={open}>
                <span>{c.q}</span>
                <span className="study__checkFlip">{open ? 'Hide' : 'Reveal'}</span>
              </button>
              {open && <div className="study__checkA">{c.a}</div>}
            </div>
          );
        })}
      </div>
      {allDone && <p className="study__checksDone">All checks revealed &mdash; ready for the test</p>}
    </section>
  );
}
