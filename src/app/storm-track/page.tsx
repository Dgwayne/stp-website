import type { Metadata } from "next";
import Link from "next/link";
import AutoVideo from "@/components/AutoVideo";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Storm Track | Spotter Tools Pro",
  description:
    "Draw the leading edge of a storm and Spotter Tools Pro projects where it is going, when it gets there, and which towns are in the path. Speed and direction are read from the radar automatically.",
  openGraph: {
    title: "Spotter Tools Pro | Storm Track",
    description:
      "Draw a storm edge, get arrival times for every town in its path. Motion read straight from the radar.",
    type: "website",
    images: [{ url: "/images/stp-logo.png", width: 1024, height: 1024 }],
  },
};

/** The app's own amber, used for time marks and arrival labels. */
const AMBER = "#f0a544";
/** The app's own alert red, used for your own position. */
const SELF = "#e8697f";

const steps: { title: string; body: string }[] = [
  {
    title: "Open Storm Track",
    body: "From the map menu. The map stays live behind it.",
  },
  {
    title: "Pick Cell or Line",
    body: "Cell for a single storm. Line for a squall line or any leading edge. This can only be changed before you start drawing.",
  },
  {
    title: "Tap the storm",
    body: "Cell takes one tap. For a line, tap your way along the leading edge, following its shape as closely as you like.",
  },
  {
    title: "Finish the line",
    body: "Tap the last point a second time, or double tap anywhere. On Windows, double click.",
  },
  {
    title: "Read it",
    body: "The projection appears straight away. No confirmation step and no dialog, because the motion has already been worked out.",
  },
  {
    title: "Adjust if you disagree",
    body: "Drag the round handle at the end of the arrow to change the direction or how far ahead you are looking. Drag any point on the edge to move it.",
  },
];

const readout: { term: string; def: string }[] = [
  {
    term: "23.7 mi",
    def: "How far ahead you are projecting. This is set by where you put the arrow, not by the speed.",
  },
  { term: "ESE 115°", def: "The direction the storm is travelling." },
  { term: "24 mph", def: "How fast it is moving." },
  {
    term: "You +33m",
    def: "Shown only when the storm reaches your own position. It sits at the top of the list and does not hide behind anything.",
  },
  {
    term: "1h",
    def: "How long the storm takes to cross the whole projection.",
  },
];

const onMap: string[] = [
  "The shaded band is where the storm will pass.",
  "The amber lines across it are time marks. They thin out or fill in as you zoom, so they never pile up on top of each other.",
  "Amber dots are places in the path, each labelled with its arrival time. In a built up area the app shows the notable ones rather than every suburb, so the map stays readable. The full list is always in the panel.",
  "The dashed line at the far end is the limit of what you asked for, not a limit of the storm.",
];

const provenance: { tag: string; title: string; body: string }[] = [
  {
    tag: "Auto",
    title: "KILN, 4 cells",
    body: "The motion came from four tracked storm cells near the line you drew, averaged together. A whole squall line is not held hostage to one cell, and a cell heading somewhere unrelated is thrown out rather than dragged into the average.",
  },
  {
    tag: "Manual",
    title: "Dragged, or set by hand",
    body: "If the radar has nothing useful nearby, the app says so instead of inventing a number. Same if two groups of storms disagree. You then aim it yourself with the arrow.",
  },
  {
    tag: "Timing",
    title: "from 10:28 AM frame",
    body: "Every arrival time counts from the radar image you drew on, not from the clock on your phone. Radar is always a few minutes behind live, and ignoring that would make every town arrive early.",
  },
  {
    tag: "Warning",
    title: "motion 9m older",
    body: "The tracking data the radar publishes can lag the picture you are looking at. When it does, the app tells you by how much, so you know how much weight to give the projection.",
  },
];

const options: { term: string; def: string }[] = [
  {
    term: "Storm speed",
    def: "Override the speed if you think the radar has it wrong. The direction stays credited to the radar, because you have not changed it.",
  },
  {
    term: "Cell size",
    def: "How wide a single storm is. The projection sweeps that width forward as a corridor.",
  },
  {
    term: "Spread",
    def: "Off by default. Turn it on and the projection stays rigid for the first half hour, then widens to say the storm could end up further left or right than the straight line suggests.",
  },
  { term: "Arrival times", def: "Countdown or clock." },
  {
    term: "Share this track",
    def: "Produces a written summary you can read out or paste into a net log. Direction, speed, your own arrival, then the towns with times.",
  },
  {
    term: "Clear this track",
    def: "Removes it. Deliberately kept away from Done, which just puts the tool away and leaves the track on the map.",
  },
];

const caveats: { title: string; body: string }[] = [
  {
    title: "It projects a straight line",
    body: "Real storms turn, speed up, decay and build. The further out you look, the less the projection is worth. Half an hour is confident, ninety minutes is a conversation starter.",
  },
  {
    title: "It does not know what you know",
    body: "A projection is arithmetic on a radar image. It has no view of terrain, boundaries, or the storm you can see out of the window, and it does not replace looking at the sky.",
  },
  {
    title: "It is not a warning",
    body: "Official watches and warnings come from the National Weather Service and appear on the map separately. This is a tool for thinking with, not an alert.",
  },
];

export default function StormTrackPage() {
  return (
    <div className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Storm Track"
          title="Where is it going, and when does it get here"
          description="Draw the leading edge of a storm and the app tells you where it is heading, when it arrives, and which towns are in the way. It reads the motion off the radar for you."
        />

        {/* Watch it happen first. The clip runs the whole job start to
            finish, so it answers "what is this" before any prose does. */}
        <figure className="mb-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
            <AutoVideo
              src="/videos/storm-track.mp4"
              poster="/videos/storm-track-poster.jpg"
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            Drawing a line across an approaching storm, then reading the
            arrival times off it. Recorded on the Windows app.
          </figcaption>
        </figure>

        {/* The same idea annotated, for the vocabulary the page then uses */}
        <figure className="mb-24">
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface p-5">
            <svg
              viewBox="0 0 720 300"
              role="img"
              aria-label="A drawn storm edge with a shaded projection extending ahead of it, time marks across the projection, and towns labelled with arrival times."
              className="block h-auto w-full min-w-[460px]"
            >
              <polygon
                points="120,30 100,150 118,270 528,258 546,138 528,18"
                fill="var(--color-brand-teal)"
                fillOpacity="0.14"
                stroke="var(--color-brand-teal)"
                strokeOpacity="0.5"
                strokeWidth="1.5"
              />

              <g
                stroke={AMBER}
                fill="none"
                strokeOpacity="0.55"
                strokeWidth="1.4"
              >
                <polyline points="222,27 202,147 220,267" />
                <polyline points="324,24 304,144 322,264" />
              </g>
              <polyline
                points="426,21 406,141 424,261"
                fill="none"
                stroke={AMBER}
                strokeWidth="2.4"
              />
              <polyline
                points="528,18 546,138 528,258"
                fill="none"
                stroke={AMBER}
                strokeOpacity="0.5"
                strokeWidth="1.3"
                strokeDasharray="5 4"
              />
              <g
                fontFamily="ui-monospace, Consolas, monospace"
                fontSize="12"
                fontWeight="700"
                fill={AMBER}
              >
                <text x="212" y="105">
                  15m
                </text>
                <text x="314" y="102">
                  30m
                </text>
                <text x="416" y="99" fontSize="13.5">
                  1h
                </text>
              </g>

              <circle cx="268" cy="198" r="4.5" fill={AMBER} />
              <circle cx="392" cy="86" r="4.5" fill={AMBER} />
              <g
                fontFamily="ui-monospace, Consolas, monospace"
                fontSize="11.5"
                fill="var(--color-foreground)"
              >
                <text x="278" y="193">
                  Abingdon +21m
                </text>
                <text x="402" y="81">
                  Galva +44m
                </text>
              </g>

              <circle cx="330" cy="238" r="5.5" fill={SELF} />
              <text
                x="342"
                y="243"
                fontFamily="ui-monospace, Consolas, monospace"
                fontSize="11.5"
                fontWeight="700"
                fill={SELF}
              >
                You +33m
              </text>

              <polyline
                points="120,30 100,150 118,270"
                fill="none"
                stroke="var(--color-foreground)"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <g
                fill="var(--color-brand-teal)"
                stroke="var(--color-surface)"
                strokeWidth="2"
              >
                <circle cx="120" cy="30" r="6" />
                <circle cx="100" cy="150" r="6" />
                <circle cx="118" cy="270" r="6" />
              </g>

              <line
                x1="100"
                y1="150"
                x2="516"
                y2="140"
                stroke="var(--color-brand-teal)"
                strokeWidth="1.8"
                strokeDasharray="5 5"
              />
              <circle
                cx="524"
                cy="140"
                r="8"
                fill="var(--color-brand-teal)"
                stroke="var(--color-surface)"
                strokeWidth="2"
              />
            </svg>
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted">
            The bright line is what you draw. Everything else the app works
            out.
          </figcaption>
        </figure>

        {/* Steps */}
        <section id="using" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Using it"
            title="Six taps, start to finish"
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
                any time, even part way through drawing a line. On Windows,
                right click and drag still pans as normal.
              </span>
            </p>
          </div>
        </section>

        {/* Readout */}
        <section id="readout" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="The readout"
            title="What the numbers mean"
            align="left"
          />

          <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-xl border border-white/10 bg-surface px-5 py-4 font-mono">
            <span className="text-lg font-bold tabular-nums">
              23.7 <span className="text-xs text-muted">mi</span>
            </span>
            <span className="text-lg font-bold">ESE 115&#176;</span>
            <span className="text-lg font-bold tabular-nums">
              24 <span className="text-xs text-muted">mph</span>
            </span>
            <span className="font-bold" style={{ color: SELF }}>
              You +33m
            </span>
            <span className="font-bold text-brand-teal">1h</span>
          </div>

          <dl className="divide-y divide-white/10 border-y border-white/10">
            {readout.map((row) => (
              <div
                key={row.term}
                className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-5"
              >
                <dt className="font-mono text-sm font-semibold">{row.term}</dt>
                <dd className="text-sm text-muted">{row.def}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-10 mb-4 text-lg font-semibold">On the map</h3>
          <ul className="space-y-2.5">
            {onMap.map((line) => (
              <li key={line} className="flex gap-3 text-sm text-muted">
                <span aria-hidden className="text-brand-teal">
                  &bull;
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border-l-2 bg-surface p-5" style={{ borderLeftColor: AMBER }}>
            <p className="text-sm">
              <span className="font-semibold">Countdown or clock.</span>{" "}
              <span className="text-muted">
                Times show as a countdown by default. Switch to clock times in
                Options if you are reading a track out on the air, which is
                what most people end up doing. A countdown is only true at the
                moment you read it.
              </span>
            </p>
          </div>
        </section>

        {/* Provenance */}
        <section id="numbers" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Where the numbers come from"
            title="The app does not guess quietly"
            description="Speed and direction are both read from the storms the radar is already tracking. Tap the chevron on the readout to see exactly what was used."
            align="left"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {provenance.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/10 bg-surface p-5"
              >
                <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {card.tag}
                </p>
                <h3 className="mb-2 font-semibold">{card.title}</h3>
                <p className="text-sm text-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Options */}
        <section id="options" className="scroll-mt-24 mb-24">
          <SectionHeader
            eyebrow="Options"
            title="Everything else, one tap away"
            align="left"
          />
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {options.map((row) => (
              <div
                key={row.term}
                className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-5"
              >
                <dt className="text-sm font-semibold">{row.term}</dt>
                <dd className="text-sm text-muted">{row.def}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Caveats */}
        <section id="limits" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Worth knowing"
            title="What it does not do"
            align="left"
          />
          <div className="space-y-5">
            {caveats.map((c) => (
              <div key={c.title}>
                <p className="font-semibold">{c.title}</p>
                <p className="mt-1 max-w-3xl text-sm text-muted">{c.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-xs text-muted">
            Place names and locations come from the GeoNames gazetteer, used
            under CC BY 4.0. Storm motion comes from the NEXRAD Level III storm
            tracking product for the radar site you have selected.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-24 rounded-2xl border border-white/10 bg-surface p-8 text-center sm:p-12">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            <span className="gradient-text">
              Storm Track is one tool of many
            </span>
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-muted">
            It sits on top of on-device NEXRAD Level 2 radar, the full Level III
            product set, satellite, models, and push alerts that fire even when
            the app is closed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-green-dim"
            >
              All features <span aria-hidden>&rarr;</span>
            </Link>
            <Link
              href="/radar"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition-all hover:border-white/30 hover:bg-white/5"
            >
              Radar deep dive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
