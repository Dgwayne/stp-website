'use client';

// Schematic teaching diagrams for the study pages. Drawn inline so they
// inherit the design system and cost no image bytes. Each figure keys a
// {kind: "figure", fig: "..."} study section.

const C = {
  cloud: '#3E5468',
  cloudLight: '#54708A',
  cloudDark: '#2E4052',
  rain: '#6FB7FF',
  ground: '#233850',
  label: '#E8EFF6',
  dim: '#8CA1B4',
  leader: '#5E7386',
  up: '#FFB627',
  inflow: '#FF5D52',
  down: '#6FB7FF',
};

const mono = { fontFamily: 'var(--mono, monospace)', fill: C.label };
const monoDim = { fontFamily: 'var(--mono, monospace)', fill: C.dim };

function Arrow({ d, color, w = 3 }) {
  return (
    <g stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} markerEnd="none" />
    </g>
  );
}

function Head({ x, y, angle, color }) {
  return (
    <path
      d="M0 0 L-9 -5 L-9 5 Z"
      fill={color}
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  );
}

function Leader({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.leader} strokeWidth="1" strokeDasharray="3 3" />;
}

function Puff({ cx, cy, r, fill = C.cloud }) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} />;
}

/* ---- Supercell anatomy, side view, storm motion left-to-right ---- */
function SupercellAnatomy() {
  return (
    <svg viewBox="0 0 720 430" role="img" aria-label="Supercell side-view anatomy diagram" style={{ width: '100%', height: 'auto' }}>
      {/* ground */}
      <line x1="20" y1="392" x2="700" y2="392" stroke={C.ground} strokeWidth="2" />

      {/* anvil */}
      <rect x="120" y="62" width="560" height="40" rx="20" fill={C.cloudLight} />
      {/* overshooting top */}
      <ellipse cx="300" cy="56" rx="46" ry="26" fill={C.cloudLight} />

      {/* main tower */}
      <Puff cx="250" cy="150" r="55" />
      <Puff cx="320" cy="135" r="62" />
      <Puff cx="380" cy="160" r="55" />
      <Puff cx="270" cy="205" r="60" />
      <Puff cx="350" cy="210" r="62" />
      <Puff cx="430" cy="200" r="52" />
      <Puff cx="480" cy="215" r="46" />

      {/* flanking line: stepped cumulus up from the left */}
      <Puff cx="95" cy="262" r="20" fill={C.cloudDark} />
      <Puff cx="135" cy="250" r="26" fill={C.cloudDark} />
      <Puff cx="182" cy="238" r="32" fill={C.cloud} />

      {/* cloud base */}
      <rect x="205" y="238" width="330" height="26" rx="10" fill={C.cloudDark} />

      {/* precipitation core */}
      <g opacity="0.85">
        <rect x="440" y="252" width="130" height="6" rx="3" fill={C.cloudDark} />
        {[452, 472, 492, 512, 532, 552].map((x) => (
          <line key={x} x1={x} y1="260" x2={x - 10} y2="388" stroke={C.rain} strokeWidth="2.5" opacity="0.55" />
        ))}
      </g>

      {/* wall cloud */}
      <Puff cx="290" cy="278" r="26" fill={C.cloudDark} />
      <Puff cx="325" cy="282" r="22" fill={C.cloudDark} />
      <rect x="262" y="262" width="88" height="18" fill={C.cloudDark} />

      {/* updraft arrow */}
      <Arrow d="M300 360 C 300 320, 300 220, 300 130" color={C.up} />
      <Head x={300} y={126} angle={-90} color={C.up} />

      {/* inflow arrow */}
      <Arrow d="M660 372 C 560 372, 430 360, 340 330" color={C.inflow} />
      <Head x={336} y={328} angle={-160} color={C.inflow} />

      {/* forward flank downdraft */}
      <Arrow d="M505 268 L 495 350" color={C.down} w={2.5} />
      <Head x={494} y={354} angle={97} color={C.down} />

      {/* rear flank downdraft */}
      <Arrow d="M235 250 C 222 290, 226 320, 246 344" color={C.down} w={2.5} />
      <Head x={249} y={347} angle={40} color={C.down} />

      {/* labels */}
      <Leader x1={300} y1={38} x2={300} y2={30} />
      <text x="300" y="22" textAnchor="middle" fontSize="14" style={mono}>Overshooting top</text>

      <text x="648" y="52" textAnchor="end" fontSize="14" style={mono}>Anvil</text>

      <Leader x1={505} y1={300} x2={608} y2={300} />
      <text x="614" y="296" fontSize="14" style={mono}>Precipitation core</text>
      <text x="614" y="313" fontSize="12.5" style={monoDim}>forward flank downdraft</text>

      <Leader x1={370} y1={251} x2={370} y2={225} />
      <text x="392" y="222" textAnchor="middle" fontSize="14" style={mono}>Rain-free base</text>

      <Leader x1={296} y1={302} x2={296} y2={330} />
      <text x="240" y="348" textAnchor="middle" fontSize="14" style={mono}>Wall cloud</text>

      <Leader x1={130} y1={222} x2={130} y2={200} />
      <text x="130" y="192" textAnchor="middle" fontSize="14" style={mono}>Flanking line</text>

      <text x="600" y="360" textAnchor="middle" fontSize="13" fill={C.inflow} fontFamily="var(--mono, monospace)">Inflow</text>
      <text x="322" y="170" fontSize="13" fill={C.up} fontFamily="var(--mono, monospace)">Updraft</text>
      <text x="196" y="318" textAnchor="end" fontSize="13" fill={C.down} fontFamily="var(--mono, monospace)">RFD</text>

      <text x="20" y="420" fontSize="12" style={monoDim}>Side view. Storm motion left to right; you are looking north.</text>
    </svg>
  );
}

/* ---- Wall cloud vs shelf cloud ---- */
function WallVsShelf() {
  return (
    <svg viewBox="0 0 720 330" role="img" aria-label="Wall cloud versus shelf cloud comparison" style={{ width: '100%', height: 'auto' }}>
      {/* divider */}
      <line x1="360" y1="16" x2="360" y2="290" stroke={C.ground} strokeWidth="1.5" strokeDasharray="4 5" />

      {/* ---- left: wall cloud ---- */}
      <text x="180" y="30" textAnchor="middle" fontSize="15" fontWeight="700" style={mono}>WALL CLOUD</text>

      {/* storm base */}
      <rect x="30" y="70" width="300" height="42" rx="14" fill={C.cloud} />
      {/* rain to the right of base */}
      {[292, 308, 324].map((x) => (
        <line key={x} x1={x} y1="112" x2={x - 6} y2="240" stroke={C.rain} strokeWidth="2" opacity="0.5" />
      ))}
      {/* lowering */}
      <Puff cx="150" cy="126" r="26" fill={C.cloudDark} />
      <Puff cx="190" cy="130" r="24" fill={C.cloudDark} />
      <rect x="120" y="108" width="100" height="22" fill={C.cloudDark} />

      {/* rising motion arrows */}
      <Arrow d="M132 210 C 140 180, 148 160, 152 148" color={C.inflow} w={2.5} />
      <Head x={153} y={144} angle={-70} color={C.inflow} />
      <Arrow d="M196 214 C 198 190, 198 172, 196 156" color={C.inflow} w={2.5} />
      <Head x={196} y={152} angle={-85} color={C.inflow} />

      <line x1="30" y1="252" x2="330" y2="252" stroke={C.ground} strokeWidth="2" />

      <text x="180" y="278" textAnchor="middle" fontSize="13" style={mono}>Isolated lowering, air RISING into it</text>
      <text x="180" y="296" textAnchor="middle" fontSize="12.5" style={monoDim}>Under the rain-free base, next to the rain</text>
      <text x="180" y="314" textAnchor="middle" fontSize="12.5" fill={C.inflow} fontFamily="var(--mono, monospace)">Watch for rotation: tornado territory</text>

      {/* ---- right: shelf cloud ---- */}
      <text x="540" y="30" textAnchor="middle" fontSize="15" fontWeight="700" style={mono}>SHELF CLOUD</text>

      {/* storm mass with rain behind */}
      <rect x="470" y="60" width="230" height="52" rx="14" fill={C.cloud} />
      {[560, 580, 600, 620, 640, 660].map((x) => (
        <line key={x} x1={x} y1="112" x2={x - 8} y2="240" stroke={C.rain} strokeWidth="2" opacity="0.5" />
      ))}

      {/* wedge sloping toward viewer/left */}
      <path d="M700 112 L 470 112 L 398 150 L 430 168 L 700 150 Z" fill={C.cloudDark} />
      <path d="M470 112 L 398 150 L 412 158 L 476 126 Z" fill={C.cloudLight} opacity="0.5" />

      {/* outflow arrows: outward and down */}
      <Arrow d="M470 190 C 448 196, 428 204, 408 216" color={C.down} w={2.5} />
      <Head x={404} y={218} angle={155} color={C.down} />
      <Arrow d="M508 196 C 494 210, 482 222, 470 234" color={C.down} w={2.5} />
      <Head x={467} y={237} angle={135} color={C.down} />

      <line x1="390" y1="252" x2="700" y2="252" stroke={C.ground} strokeWidth="2" />

      <text x="545" y="278" textAnchor="middle" fontSize="13" style={mono}>Long wedge, air PUSHING out and down</text>
      <text x="545" y="296" textAnchor="middle" fontSize="12.5" style={monoDim}>On the leading edge, ahead of the rain</text>
      <text x="545" y="314" textAnchor="middle" fontSize="12.5" fill={C.down} fontFamily="var(--mono, monospace)">Means wind: brace for the gust front</text>
    </svg>
  );
}

/* ---- Thunderstorm lifecycle ---- */
function StormLifecycle() {
  return (
    <svg viewBox="0 0 720 320" role="img" aria-label="Thunderstorm lifecycle stages" style={{ width: '100%', height: 'auto' }}>
      <line x1="20" y1="262" x2="700" y2="262" stroke={C.ground} strokeWidth="2" />

      {/* stage 1: towering cumulus */}
      <Puff cx="120" cy="212" r="30" />
      <Puff cx="120" cy="170" r="34" />
      <Puff cx="118" cy="128" r="30" />
      <Arrow d="M120 250 L 120 110" color={C.up} w={2.5} />
      <Head x={120} y={106} angle={-90} color={C.up} />
      <text x="120" y="290" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>1. Towering cumulus</text>
      <text x="120" y="308" textAnchor="middle" fontSize="12.5" style={monoDim}>Updraft only, no rain yet</text>

      {/* stage 2: mature */}
      <rect x="270" y="66" width="200" height="30" rx="15" fill={C.cloudLight} />
      <Puff cx="345" cy="130" r="44" />
      <Puff cx="395" cy="150" r="40" />
      <Puff cx="330" cy="185" r="42" />
      <Puff cx="400" cy="195" r="38" />
      {[406, 424, 442].map((x) => (
        <line key={x} x1={x} y1="212" x2={x - 6} y2="258" stroke={C.rain} strokeWidth="2" opacity="0.55" />
      ))}
      <Arrow d="M330 246 L 330 116" color={C.up} w={2.5} />
      <Head x={330} y={112} angle={-90} color={C.up} />
      <Arrow d="M420 150 L 428 236" color={C.down} w={2.5} />
      <Head x={429} y={240} angle={95} color={C.down} />
      <text x="370" y="290" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>2. Mature</text>
      <text x="370" y="308" textAnchor="middle" fontSize="12.5" style={monoDim}>Updraft AND downdraft, severe most likely</text>

      {/* stage 3: dissipating */}
      <rect x="540" y="80" width="160" height="26" rx="13" fill={C.cloudDark} opacity="0.8" />
      <Puff cx="600" cy="150" r="34" fill={C.cloudDark} />
      <Puff cx="640" cy="170" r="30" fill={C.cloudDark} />
      {[586, 606, 626, 646].map((x) => (
        <line key={x} x1={x} y1="196" x2={x - 4} y2="256" stroke={C.rain} strokeWidth="1.8" opacity="0.4" />
      ))}
      <Arrow d="M612 130 L 618 240" color={C.down} w={2.5} />
      <Head x={618} y={244} angle={92} color={C.down} />
      <text x="612" y="290" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>3. Dissipating</text>
      <text x="612" y="308" textAnchor="middle" fontSize="12.5" style={monoDim}>Downdraft dominated, rain fades</text>
    </svg>
  );
}

export const FIGURES = {
  'supercell-anatomy': SupercellAnatomy,
  'wall-vs-shelf': WallVsShelf,
  'storm-lifecycle': StormLifecycle,
};
