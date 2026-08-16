import type { Metadata } from "next";
import AutoVideo from "@/components/AutoVideo";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Draw | Spotter Tools Pro",
  description:
    "Mark up the radar with fronts, outflow boundaries, rotation markers, hail cores and target boxes. Every mark belongs to the ground, so it stays on the storm when you pan and zoom.",
  openGraph: {
    title: "Spotter Tools Pro | Draw",
    description:
      "Draw on the radar with real weather symbols. Marks stay on the storm, measure themselves, and save automatically.",
    type: "website",
    images: [{ url: "/images/stp-logo.png", width: 1024, height: 1024 }],
  },
};

/** The preset colours, taken from the app so the page reads as a legend. */
const COLD = "#2E8BFF";
const WARM = "#FF4D4D";
const STATIONARY = "#9B5CFF";
const OCCLUDED = "#C050E8";
const OUTFLOW = "#22E0FF";
const DRYLINE = "#FFB300";
const ROTATION = "#FF2D95";
const CORRIDOR = "#E040FB";
const PLAN = "#00E5A0";

const steps: { title: string; body: string }[] = [
  {
    title: "Open Draw on map",
    body: "From the map menu. Two control rows appear at the bottom and the radar keeps running behind them.",
  },
  {
    title: "Pick what you are drawing",
    body: "The top row holds the tools and the weather presets. Swipe it sideways, or tap the three dots at its end to see every one with a line explaining what it does.",
  },
  {
    title: "Draw it",
    body: "One finger, or a left click and drag on Windows. A nearly straight stroke tidies itself into a line, and a closed round one into a neat circle.",
  },
  {
    title: "Put the pen away",
    body: "Tap the green tick. Your marks stay on the map with the tool closed, so you can carry on chasing and still see them.",
  },
];

const tools: { term: string; def: string }[] = [
  {
    term: "Select",
    def: "Pick a mark to move it, restyle it or delete it.",
  },
  {
    term: "Draw",
    def: "Freehand. A nearly straight stroke tidies itself into a line, and a closed round one into a neat circle. Always one undo away if you meant the wobble.",
  },
  { term: "Line", def: "Straight line, reporting its length and bearing." },
  { term: "Arrow", def: "A line with a head, for motion or direction." },
  { term: "Box", def: "Rectangle, reporting its sides and area." },
  { term: "Circle", def: "Ellipse, reporting its radius and area." },
  { term: "Text", def: "Tap the map to drop a label." },
];

type Preset = { name: string; colour: string; body: string };

const boundaries: Preset[] = [
  {
    name: "Cold front",
    colour: COLD,
    body: "Advancing cold air. Triangles point the way it is moving.",
  },
  {
    name: "Warm front",
    colour: WARM,
    body: "Advancing warm air. Semicircles point the way it is moving.",
  },
  {
    name: "Stationary",
    colour: STATIONARY,
    body: "A boundary that has stalled, so its symbols face both ways on purpose.",
  },
  {
    name: "Occluded",
    colour: OCCLUDED,
    body: "A cold front catching a warm one. Both symbols face the same way.",
  },
  {
    name: "Outflow",
    colour: OUTFLOW,
    body: "Gust front off a storm's cold pool. Ticks face the way it runs.",
  },
  {
    name: "Dryline",
    colour: DRYLINE,
    body: "Moisture boundary. Scallops face the moist air it advances into.",
  },
];

const stormFeatures: Preset[] = [
  {
    name: "Rotation",
    colour: ROTATION,
    body: "Ring a couplet or mesocyclone. Carries a spin arrow.",
  },
  {
    name: "Hail core",
    colour: DRYLINE,
    body: "Dashed ring round a hail signature. Reports its radius.",
  },
  {
    name: "Corridor",
    colour: CORRIDOR,
    body: "Damage or hail swath with a real ground width in miles, so it grows and shrinks with the map the way the ground does.",
  },
];

const planning: Preset[] = [
  {
    name: "Target box",
    colour: PLAN,
    body: "Where you plan to be. Filled so it reads as an area rather than an outline.",
  },
  {
    name: "Escape route",
    colour: PLAN,
    body: "Dashed arrow for the way out.",
  },
];

const measures: { term: string; def: string }[] = [
  { term: "Line and arrow", def: "Length and bearing." },
  { term: "Freehand", def: "The distance along the path you drew." },
  { term: "Box", def: "Its sides, and its area." },
  { term: "Circle", def: "Its radius, and its area." },
  { term: "Corridor", def: "Length, bearing, and how wide the swath is." },
];

const editing: string[] = [
  "Change its colour, width, line style or fill. The style row becomes that mark's own settings while it is picked.",
  "Duplicate it, push it in front of or behind other marks, or delete it.",
  "Flip which way a boundary's symbols face, for when a straight line gave the app nothing to go on.",
  "Edit the wording of a text label.",
];

const keeping: { title: string; body: string }[] = [
  {
    title: "Saves itself",
    body: "The map you are marking up is written to your device as you work and comes back when you next open the app. You do not have to do anything.",
  },
  {
    title: "Named sketches",
    body: "Give one a name to keep it and open it again later. Useful for a setup you built the night before.",
  },
  {
    title: "Share an image",
    body: "Sends a picture of the map with your marks on it, ready for a group chat or a report.",
  },
  {
    title: "Export the shapes",
    body: "Sends the raw geometry, for anyone who wants to open it in mapping software.",
  },
];

/** A small symbol legend, so the direction rule is shown and not just told. */
function FrontLegend() {
  return (
    <svg
      viewBox="0 0 760 200"
      role="img"
      aria-label="Front symbol legend. Cold front triangles, warm front semicircles, stationary front alternating symbols, and outflow ticks, all sitting on the side the boundary is advancing into."
      className="block h-auto w-full min-w-[560px]"
    >
      {/* Cold */}
      <line x1="36" y1="48" x2="250" y2="48" stroke={COLD} strokeWidth="4" />
      <path d="M74 48 L88 30 L102 48 Z" fill={COLD} />
      <path d="M144 48 L158 30 L172 48 Z" fill={COLD} />
      <path d="M214 48 L228 30 L242 48 Z" fill={COLD} />
      <text x="36" y="74" fill="currentColor" fontSize="13" opacity="0.65">
        Cold front
      </text>

      {/* Warm */}
      <line x1="36" y1="136" x2="250" y2="136" stroke={WARM} strokeWidth="4" />
      <path d="M74 136 A14 14 0 0 1 102 136" fill="none" stroke={WARM} strokeWidth="4" />
      <path d="M144 136 A14 14 0 0 1 172 136" fill="none" stroke={WARM} strokeWidth="4" />
      <path d="M214 136 A14 14 0 0 1 242 136" fill="none" stroke={WARM} strokeWidth="4" />
      <text x="36" y="162" fill="currentColor" fontSize="13" opacity="0.65">
        Warm front
      </text>

      {/* Stationary */}
      <line x1="330" y1="48" x2="544" y2="48" stroke={STATIONARY} strokeWidth="4" />
      <path d="M352 48 L366 30 L380 48 Z" fill={STATIONARY} />
      <path d="M410 48 A14 14 0 0 0 438 48" fill="none" stroke={STATIONARY} strokeWidth="4" />
      <path d="M468 48 L482 30 L496 48 Z" fill={STATIONARY} />
      <text x="330" y="74" fill="currentColor" fontSize="13" opacity="0.65">
        Stationary, facing both ways
      </text>

      {/* Outflow */}
      <line x1="330" y1="136" x2="544" y2="136" stroke={OUTFLOW} strokeWidth="4" />
      <line x1="364" y1="136" x2="364" y2="118" stroke={OUTFLOW} strokeWidth="4" />
      <line x1="414" y1="136" x2="414" y2="118" stroke={OUTFLOW} strokeWidth="4" />
      <line x1="464" y1="136" x2="464" y2="118" stroke={OUTFLOW} strokeWidth="4" />
      <line x1="514" y1="136" x2="514" y2="118" stroke={OUTFLOW} strokeWidth="4" />
      <text x="330" y="162" fill="currentColor" fontSize="13" opacity="0.65">
        Outflow boundary
      </text>

      {/* Direction key */}
      <text x="614" y="52" fill="currentColor" fontSize="13" fontWeight="600">
        Symbols point
      </text>
      <text x="614" y="70" fill="currentColor" fontSize="13" fontWeight="600">
        the way it moves
      </text>
      <line
        x1="614"
        y1="140"
        x2="614"
        y2="104"
        stroke="var(--color-brand-teal)"
        strokeWidth="3"
      />
      <path d="M607 110 L614 98 L621 110 Z" fill="var(--color-brand-teal)" />
      <text x="634" y="132" fill="currentColor" fontSize="12.5" opacity="0.65">
        movement
      </text>
    </svg>
  );
}

function PresetGrid({ items }: { items: Preset[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((p) => (
        <div
          key={p.name}
          className="grid grid-cols-[0.75rem_1fr] gap-4 rounded-xl border border-white/10 bg-surface p-4"
        >
          <span
            aria-hidden
            className="rounded"
            style={{ backgroundColor: p.colour }}
          />
          <div>
            <p className="font-semibold">{p.name}</p>
            <p className="mt-1 text-sm text-muted">{p.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DrawPage() {
  return (
    <div className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Draw"
          title="Mark up the radar, and have it stay put"
          description="Fronts, outflow boundaries, rotation markers, hail cores, target boxes and plain freehand. Every mark belongs to the ground, so the circle you put around a hook echo is still around it two counties later."
        />

        {/* The clip runs the whole job start to finish, so it answers
            "what is this" before any prose does. */}
        <figure className="mb-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
            <AutoVideo
              src="/videos/draw.mp4"
              poster="/videos/draw-poster.jpg"
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            Drawing boundaries, a rotation marker and a labelled outflow over
            live radar. Recorded on the Windows app.
          </figcaption>
        </figure>

        {/* Why it matters, in one idea */}
        <section className="mb-24">
          <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              <span className="gradient-text">
                A mark is a place, not a pixel
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Most drawing tools paint on the glass. Move the map and the
              drawing stays where it was on your screen, which is worse than
              useless once the storm has moved out from under it.
            </p>
            <p className="mt-3 max-w-2xl text-muted">
              Here every mark is stored as a position on the earth. Circle a
              couplet, pan two counties to check the inflow, zoom out to see
              the whole line, and your circle is exactly where you left it.
            </p>
          </div>
        </section>

        {/* Getting started */}
        <section id="start" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Getting started"
            title="Four steps"
            align="left"
          />
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[2rem_1fr] gap-4 py-4 sm:gap-5"
              >
                <span className="pt-1 font-mono text-sm font-bold text-brand-green">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border-l-2 border-brand-teal bg-surface p-5">
            <p className="text-sm">
              <span className="font-semibold">
                One finger draws, two fingers move the map.
              </span>{" "}
              <span className="text-muted">
                There is no mode to switch. Pinch and pan with two fingers at
                any moment, including part way through a stroke. On Windows,
                hold the right mouse button and drag.
              </span>
            </p>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="The tools"
            title="Seven basics"
            align="left"
          />
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {tools.map((row) => (
              <div
                key={row.term}
                className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-5"
              >
                <dt className="font-semibold">{row.term}</dt>
                <dd className="text-sm text-muted">{row.def}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Presets */}
        <section id="presets" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Weather presets"
            title="Real symbols, one tap"
            description="Each preset sets the tool, the colour and the line style together, then draws the proper symbols along whatever you sketch. You are not drawing triangles by hand: you draw the boundary and it puts them on."
            align="left"
          />

          <figure className="mb-10">
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface p-5">
              <FrontLegend />
            </div>
            <figcaption className="mt-3 text-xs text-muted">
              The symbols sit on the side the boundary is advancing into. The
              app works that out from the shape you drew, not from which end
              you started at, so a bow comes out the same whether you draw it
              upward or downward. A bowed line puts its symbols on the outside
              of the curve, which is where a gust front is heading.
            </figcaption>
          </figure>

          <h3 className="mb-4 text-lg font-semibold">Boundaries</h3>
          <PresetGrid items={boundaries} />

          <h3 className="mt-10 mb-4 text-lg font-semibold">Storm features</h3>
          <PresetGrid items={stormFeatures} />

          <h3 className="mt-10 mb-4 text-lg font-semibold">Chase planning</h3>
          <PresetGrid items={planning} />

          <div className="mt-8 rounded-xl border-l-2 bg-surface p-5" style={{ borderLeftColor: OUTFLOW }}>
            <p className="text-sm">
              <span className="font-semibold">
                If the symbols face the wrong way.
              </span>{" "}
              <span className="text-muted">
                On a dead straight line there is nothing in the shape to say
                which way the boundary is moving. Pick the mark with Select,
                open the options and tap Flip pips.
              </span>
            </p>
          </div>
        </section>

        {/* Measurement */}
        <section id="measure" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Numbers"
            title="Every mark measures itself"
            description="There is no separate ruler to reach for. Whatever you draw already knows its own size, and you can pin that to the map."
            align="left"
          />
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {measures.map((row) => (
              <div
                key={row.term}
                className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-5"
              >
                <dt className="font-semibold">{row.term}</dt>
                <dd className="text-sm text-muted">{row.def}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted">
            Distances read in yards up to a thousand, then in miles.
          </p>
        </section>

        {/* Editing */}
        <section id="editing" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Changing your mind"
            title="Nothing is stuck"
            align="left"
          />
          <p className="mb-6 max-w-2xl text-muted">
            Turn on Select and tap a mark. It lights up with dots on its
            corners. Drag the body to move the whole thing, or drag a dot to
            reshape it. With it picked you can also:
          </p>
          <ul className="space-y-2.5">
            {editing.map((line) => (
              <li key={line} className="flex gap-3 text-sm text-muted">
                <span aria-hidden className="text-brand-teal">
                  &bull;
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border-l-2 border-brand-green bg-surface p-5">
            <p className="text-sm">
              <span className="font-semibold">
                Undo and redo never scroll away.
              </span>{" "}
              <span className="text-muted">
                They sit on the bottom row at every screen size, alongside the
                green tick. Undo goes back fifty steps, and clearing everything
                is undoable too, so nothing in Draw asks you to confirm.
              </span>
            </p>
          </div>
        </section>

        {/* Storm Track hand-off */}
        <section id="storm-track" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Working together"
            title="Turn a mark into a storm track"
            description="Draw is for what you mean. Storm Track does the arithmetic: swaths, the towns in the path and when it reaches them. They hand off to each other rather than duplicating each other."
            align="left"
          />
          <p className="mb-6 max-w-2xl text-muted">
            Pick a line or an arrow with Select, then choose Make storm track.
            Each is read the way you drew it:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-semibold">A line</p>
              <p className="mt-1 text-sm text-muted">
                Taken as the storm&#39;s leading edge. The radar is asked where
                it is going.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-semibold">An arrow</p>
              <p className="mt-1 text-sm text-muted">
                Taken as the motion itself. Its tail is where the storm is, and
                its shaft is the direction and how far ahead to look.
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            Your marks stay on the map through the switch. Only the pen is put
            away.
          </p>
        </section>

        {/* Keeping it */}
        <section id="saving" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Keeping it"
            title="Saving and sharing"
            align="left"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {keeping.map((k) => (
              <div
                key={k.title}
                className="rounded-xl border border-white/10 bg-surface p-5"
              >
                <p className="font-semibold">{k.title}</p>
                <p className="mt-1 text-sm text-muted">{k.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            All four live under the three dots on the bottom row, in Saved
            sketches.
          </p>
        </section>

        {/* Field notes */}
        <section id="notes" className="scroll-mt-24">
          <SectionHeader
            eyebrow="In the field"
            title="Things worth knowing"
            align="left"
          />
          <div className="space-y-5">
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-semibold">
                Your marks stay readable over radar
              </p>
              <p className="mt-1 text-sm text-muted">
                Every stroke carries a thin contrasting outline, so a line
                crossing a red core does not disappear into it. That is why
                white and black are both usable here, and why the eight quick
                colours avoid the greens, yellows and reds the radar itself is
                made of. The full colour picker is still there if you want it.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-semibold">
                You never have to put the pen down to look around
              </p>
              <p className="mt-1 text-sm text-muted">
                Two fingers move the map at any moment, including halfway
                through a stroke. The stroke is abandoned, the map moves, and
                you carry on.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-semibold">
                Move the controls if they are in your way
              </p>
              <p className="mt-1 text-sm text-muted">
                If you are drawing near the bottom of the screen, the options
                include a switch to send both control rows to the top edge
                instead.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-surface p-5">
              <p className="font-semibold">If your palm keeps touching</p>
              <p className="mt-1 text-sm text-muted">
                Turn on Map locked from the options. The map then holds
                completely still and stray contacts are ignored, at the cost of
                having to unlock it to pan. It is off by default because
                two-finger panning already keeps drawing and moving apart.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
