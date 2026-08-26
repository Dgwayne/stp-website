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

/* ---- radar beam height vs range ---- */
function BeamHeight() {
  // Earth curvature exaggerated for teaching; the beam is straight.
  const groundY = (x) => 330 + Math.pow((x - 70) / 660, 2) * 150;

  const curve = [];
  for (let x = 60; x <= 700; x += 20) curve.push(`${x},${groundY(x)}`);

  return (
    <svg viewBox="0 0 720 400" role="img" aria-label="Radar beam height increasing with range diagram" style={{ width: '100%', height: 'auto' }}>
      {/* curved earth */}
      <path d={`M60,${groundY(60)} L ${curve.join(' L ')} L 700,400 L 60,400 Z`} fill={C.ground} opacity="0.55" />
      <polyline points={curve.join(' ')} fill="none" stroke={C.dim} strokeWidth="1.5" />

      {/* radar tower */}
      <line x1="70" y1="330" x2="70" y2="296" stroke={C.label} strokeWidth="3" />
      <circle cx="70" cy="288" r="9" fill={C.label} />
      <text x="70" y="352" textAnchor="middle" fontSize="12.5" style={monoDim}>Radar</text>

      {/* beam: straight line rising away from curving earth */}
      <g>
        <path d="M70 288 L 700 176" stroke={C.up} strokeWidth="2" fill="none" />
        <path d="M70 288 L 700 232" stroke={C.up} strokeWidth="2" fill="none" />
        <path d="M70 288 L 700 176 L 700 232 Z" fill={C.up} opacity="0.14" />
      </g>
      <text x="250" y="243" fontSize="12.5" fill={C.up} fontFamily="var(--mono, monospace)">Beam travels straight</text>

      {/* cone of silence */}
      <path d="M70 288 L 40 150 L 100 150 Z" fill={C.inflow} opacity="0.18" />
      <line x1="70" y1="288" x2="70" y2="150" stroke={C.inflow} strokeWidth="1" strokeDasharray="3 3" />
      <text x="86" y="140" fontSize="11.5" fill={C.inflow} fontFamily="var(--mono, monospace)">Cone of silence</text>

      {/* near storm: fully sampled */}
      <g>
        <ellipse cx="228" cy="250" rx="42" ry="16" fill={C.cloudLight} />
        <rect x="196" y="252" width="64" height="66" rx="10" fill={C.cloud} />
        <text x="228" y="378" textAnchor="middle" fontSize="12.5" style={mono}>Close storm</text>
        <text x="228" y="394" textAnchor="middle" fontSize="11.5" style={monoDim}>beam samples low levels</text>
      </g>

      {/* far storm: beam overshoots the low levels */}
      <g>
        <ellipse cx="586" cy="150" rx="54" ry="18" fill={C.cloudLight} />
        <rect x="548" y="152" width="76" height="150" rx="12" fill={C.cloud} />
        <text x="586" y="378" textAnchor="middle" fontSize="12.5" style={mono}>Distant storm</text>
        <text x="586" y="394" textAnchor="middle" fontSize="11.5" style={monoDim}>beam is above the low levels</text>
      </g>

      {/* the missed layer */}
      <path d="M548 232 L 624 232 L 624 302 L 548 302 Z" fill={C.inflow} opacity="0.16" />
      <Leader x1={624} y1={268} x2={678} y2={268} />
      <text x="682" y="264" textAnchor="end" fontSize="11.5" fill={C.inflow} fontFamily="var(--mono, monospace)">not sampled</text>

      <text x="20" y="26" fontSize="12.5" style={monoDim}>The beam is straight, the earth curves away: the farther the storm, the higher you are looking.</text>
    </svg>
  );
}

/* ---- velocity couplet ---- */
function VelocityCouplet() {
  // Geometry matters here: for PURE rotation the two velocity maxima sit
  // at the SAME RANGE from the radar (equidistant, straddling the sight
  // line). Maxima strung out ALONG one radial mean convergence or
  // divergence instead. Radar is drawn due south of the couplet so the
  // sight line is vertical and the pair is clearly equidistant.
  return (
    <svg viewBox="0 0 720 360" role="img" aria-label="Doppler velocity couplet showing cyclonic rotation" style={{ width: '100%', height: 'auto' }}>
      {/* radar, due south of the feature */}
      <circle cx="360" cy="312" r="7" fill={C.label} />
      <text x="360" y="336" textAnchor="middle" fontSize="12.5" style={monoDim}>Radar</text>

      {/* sight line straight out from the radar */}
      <line x1="360" y1="304" x2="360" y2="62" stroke={C.leader} strokeWidth="1" strokeDasharray="4 4" />

      {/* arc of constant range through both maxima */}
      <path d="M232 168 A 168 168 0 0 1 488 168" fill="none" stroke={C.dim} strokeWidth="1" strokeDasharray="5 5" opacity="0.7" />
      <text x="514" y="176" fontSize="11" style={monoDim}>same range</text>

      {/* the couplet: inbound left, outbound right, straddling the sight line */}
      <ellipse cx="300" cy="148" rx="58" ry="66" fill="#2E9E63" opacity="0.9" />
      <ellipse cx="420" cy="148" rx="58" ry="66" fill="#C4423A" opacity="0.9" />
      <text x="300" y="142" textAnchor="middle" fontSize="13" fontWeight="700" fill="#EAF7EF" fontFamily="var(--mono, monospace)">GREEN</text>
      <text x="300" y="160" textAnchor="middle" fontSize="11" fill="#EAF7EF" fontFamily="var(--mono, monospace)">toward radar</text>
      <text x="420" y="142" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FDECEA" fontFamily="var(--mono, monospace)">RED</text>
      <text x="420" y="160" textAnchor="middle" fontSize="11" fill="#FDECEA" fontFamily="var(--mono, monospace)">away from radar</text>

      {/* rotation arrow over the pair */}
      <path d="M258 66 A 108 108 0 0 1 462 66" fill="none" stroke={C.up} strokeWidth="2.5" strokeDasharray="6 4" />
      <Head x={464} y={68} angle={56} color={C.up} />
      <text x="360" y="44" textAnchor="middle" fontSize="12.5" fill={C.up} fontFamily="var(--mono, monospace)">cyclonic rotation</text>

      <text x="360" y="252" textAnchor="middle" fontSize="12.5" style={mono}>Inbound and outbound side by side, at the same range = rotation</text>
      <text x="360" y="272" textAnchor="middle" fontSize="11.5" style={monoDim}>Tighter packing means stronger rotation. Strung out along one radial instead? That is convergence.</text>
      <text x="360" y="292" textAnchor="middle" fontSize="11.5" fill={C.inflow} fontFamily="var(--mono, monospace)">Left and right are from the RADAR looking out, not from your screen</text>
    </svg>
  );
}

/* ---- CAPE and CIN: a rising parcel against its environment ---- */
function CapeCin() {
  // Height rows shared by both curves so the filled regions line up.
  // Environment temperature (solid) vs a lifted surface parcel (dashed).
  const env = [[540, 360], [505, 320], [522, 285], [483, 240], [448, 190], [410, 140], [370, 90], [345, 62]];
  const parcel = [[540, 360], [495, 320], [488, 285], [483, 240], [474, 190], [462, 140], [445, 90], [436, 62]];
  const pts = (arr) => arr.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <svg viewBox="0 0 720 430" role="img" aria-label="CAPE and CIN parcel diagram" style={{ width: '100%', height: 'auto' }}>
      {/* ground */}
      <line x1="40" y1="370" x2="700" y2="370" stroke={C.ground} strokeWidth="2" />

      {/* CIN: parcel colder than environment, below the cap */}
      <polygon
        points={pts([[540, 360], [495, 320], [488, 285], [483, 240], [522, 285], [505, 320]])}
        fill={C.down}
        opacity="0.32"
      />
      {/* CAPE: parcel warmer than environment, above the LFC */}
      <polygon
        points={pts([[483, 240], [474, 190], [462, 140], [445, 90], [436, 62], [345, 62], [370, 90], [410, 140], [448, 190]])}
        fill={C.up}
        opacity="0.28"
      />

      {/* environment temperature curve */}
      <polyline points={pts(env)} fill="none" stroke={C.inflow} strokeWidth="3" strokeLinejoin="round" />
      {/* parcel path */}
      <polyline points={pts(parcel)} fill="none" stroke={C.label} strokeWidth="2.5" strokeDasharray="7 5" strokeLinejoin="round" />

      {/* surface parcel */}
      <circle cx="540" cy="360" r="6" fill={C.up} />
      <text x="556" y="352" fontSize="13" style={mono}>Warm, moist</text>
      <text x="556" y="368" fontSize="13" style={mono}>surface air</text>

      {/* LFC marker */}
      <circle cx="483" cy="240" r="4.5" fill={C.label} />
      <Leader x1={489} y1={240} x2={556} y2={228} />
      <text x="562" y="224" fontSize="13" style={mono}>LFC: free ascent</text>
      <text x="562" y="240" fontSize="12" style={monoDim}>starts here</text>

      {/* CIN label */}
      <Leader x1={508} y1={296} x2={542} y2={306} />
      <text x="548" y="302" fontSize="14" fontWeight="700" fill={C.rain} fontFamily="var(--mono, monospace)">CIN: the cap</text>
      <text x="548" y="319" fontSize="12" style={monoDim}>parcel colder than its</text>
      <text x="548" y="334" fontSize="12" style={monoDim}>surroundings, held down</text>

      {/* CAPE label */}
      <text x="424" y="140" textAnchor="middle" fontSize="17" fontWeight="700" fill={C.up} fontFamily="var(--mono, monospace)">CAPE</text>
      <text x="424" y="158" textAnchor="middle" fontSize="12" style={monoDim}>parcel warmer,</text>
      <text x="424" y="172" textAnchor="middle" fontSize="12" style={monoDim}>accelerates upward</text>

      {/* top hint */}
      <text x="390" y="40" textAnchor="middle" fontSize="12.5" style={monoDim}>Rise continues to the equilibrium level, where the anvil spreads out</text>

      {/* legend */}
      <line x1="60" y1="70" x2="102" y2="70" stroke={C.inflow} strokeWidth="3" />
      <text x="110" y="74" fontSize="12.5" style={mono}>Air around the storm</text>
      <line x1="60" y1="92" x2="102" y2="92" stroke={C.label} strokeWidth="2.5" strokeDasharray="7 5" />
      <text x="110" y="96" fontSize="12.5" style={mono}>Rising parcel</text>

      {/* axes */}
      <Arrow d="M60 340 L 60 130" color={C.dim} w={1.5} />
      <Head x={60} y={126} angle={-90} color={C.dim} />
      <text x="52" y="238" fontSize="12" style={monoDim} transform="rotate(-90 52 238)" textAnchor="middle">HEIGHT</text>
      <Arrow d="M420 400 L 660 400" color={C.dim} w={1.5} />
      <Head x={664} y={400} angle={0} color={C.dim} />
      <text x="360" y="404" textAnchor="end" fontSize="12" style={monoDim}>WARMER</text>

      <text x="40" y="424" fontSize="12" style={monoDim}>Blue area holds the storm down. Orange area is the fuel once something breaks through.</text>
    </svg>
  );
}

/* ---- Wind shear ladder: why shear organizes storms ---- */
function ShearLadder() {
  // Small wind-profile arrows at three heights for each panel.
  const winds = (x0, lens) => (
    <g>
      {lens.map((len, i) => {
        const y = 196 - i * 44;
        return (
          <g key={i}>
            <line x1={x0} y1={y} x2={x0 + len} y2={y} stroke={C.dim} strokeWidth="2.2" />
            <Head x={x0 + len + 2} y={y} angle={0} color={C.dim} />
          </g>
        );
      })}
    </g>
  );

  return (
    <svg viewBox="0 0 720 350" role="img" aria-label="Storm organization under increasing wind shear" style={{ width: '100%', height: 'auto' }}>
      <line x1="20" y1="262" x2="700" y2="262" stroke={C.ground} strokeWidth="2" />

      {/* panel 1: no shear */}
      <text x="130" y="32" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>WEAK SHEAR</text>
      {winds(34, [22, 22, 22])}
      <Puff cx="150" cy="200" r="26" />
      <Puff cx="150" cy="162" r="30" />
      <Puff cx="148" cy="124" r="26" />
      <Arrow d="M138 250 L 138 116" color={C.up} w={2.5} />
      <Head x={138} y={112} angle={-90} color={C.up} />
      {[156, 168, 180].map((x) => (
        <line key={x} x1={x} y1="150" x2={x - 2} y2="256" stroke={C.rain} strokeWidth="2" opacity="0.5" />
      ))}
      <text x="130" y="290" textAnchor="middle" fontSize="12.5" style={mono}>Rain falls back into the updraft</text>
      <text x="130" y="308" textAnchor="middle" fontSize="12" style={monoDim}>One brief pulse, then collapse</text>

      {/* panel 2: moderate shear */}
      <text x="370" y="32" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>MODERATE SHEAR</text>
      {winds(274, [16, 30, 46])}
      <Puff cx="410" cy="196" r="26" fill={C.cloudDark} />
      <Puff cx="412" cy="160" r="28" fill={C.cloudDark} />
      {[418, 430, 442].map((x) => (
        <line key={x} x1={x} y1="182" x2={x + 2} y2="256" stroke={C.rain} strokeWidth="2" opacity="0.5" />
      ))}
      <Puff cx="352" cy="222" r="16" />
      <Puff cx="358" cy="200" r="19" />
      <Arrow d="M348 252 L 352 192" color={C.up} w={2.2} />
      <Head x={352} y={188} angle={-86} color={C.up} />
      <text x="370" y="290" textAnchor="middle" fontSize="12.5" style={mono}>New cells fire on the flank as old ones rain out</text>
      <text x="370" y="308" textAnchor="middle" fontSize="12" style={monoDim}>A multicell family, renewing for hours</text>

      {/* panel 3: strong shear */}
      <text x="600" y="32" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>STRONG SHEAR</text>
      {winds(504, [14, 38, 64])}
      {/* tilted storm: base left, top displaced right */}
      <Puff cx="580" cy="204" r="26" />
      <Puff cx="600" cy="168" r="30" />
      <Puff cx="624" cy="132" r="28" />
      <rect x="600" y="94" width="104" height="24" rx="12" fill={C.cloudLight} />
      <Arrow d="M566 252 C 574 220, 592 170, 616 128" color={C.up} w={2.8} />
      <Head x={618} y={124} angle={-60} color={C.up} />
      {[652, 666, 680].map((x) => (
        <line key={x} x1={x} y1="150" x2={x - 4} y2="256" stroke={C.rain} strokeWidth="2" opacity="0.5" />
      ))}
      <text x="590" y="290" textAnchor="middle" fontSize="12.5" style={mono}>Rain falls clear of the updraft</text>
      <text x="590" y="308" textAnchor="middle" fontSize="12" style={monoDim}>One rotating storm, hours long</text>

      <text x="20" y="338" fontSize="12" style={monoDim}>Grey arrows: wind at low, middle and upper levels. The difference between them is the shear.</text>
    </svg>
  );
}

/* ---- Hodograph pair: straight vs curved, SRH as swept area ---- */
function HodographPair() {
  return (
    <svg viewBox="0 0 720 340" role="img" aria-label="Straight versus curved hodograph comparison" style={{ width: '100%', height: 'auto' }}>
      <line x1="360" y1="16" x2="360" y2="300" stroke={C.ground} strokeWidth="1.5" strokeDasharray="4 5" />

      {/* ---- left: straight ---- */}
      <text x="180" y="32" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>STRAIGHT HODOGRAPH</text>
      {[45, 90].map((r) => (
        <circle key={r} cx="120" cy="240" r={r} fill="none" stroke={C.leader} strokeWidth="1" opacity="0.6" />
      ))}
      <polyline points="120,240 158,212 216,168 282,118" fill="none" stroke={C.label} strokeWidth="2.5" strokeLinejoin="round" />
      {[[120, 240, '0'], [158, 212, '1 km'], [216, 168, '3 km'], [282, 118, '6 km']].map(([x, y, l]) => (
        <g key={l}>
          <circle cx={x} cy={y} r="4.5" fill={C.up} />
          <text x={Number(x) + 10} y={Number(y) - 6} fontSize="12" style={mono}>{l}</text>
        </g>
      ))}
      <text x="180" y="286" textAnchor="middle" fontSize="12.5" style={mono}>Wind changes with height, but in a line</text>
      <text x="180" y="304" textAnchor="middle" fontSize="12" style={monoDim}>Splitting storms: mirror left and right movers</text>

      {/* ---- right: curved ---- */}
      <text x="540" y="32" textAnchor="middle" fontSize="14" fontWeight="700" style={mono}>CURVED HODOGRAPH</text>
      {[45, 90].map((r) => (
        <circle key={r} cx="470" cy="250" r={r} fill="none" stroke={C.leader} strokeWidth="1" opacity="0.6" />
      ))}
      {/* SRH: area swept between the low-level trace and the storm motion */}
      <polygon points="530,196 470,250 528,238 566,196" fill={C.up} opacity="0.3" />
      <path d="M470 250 C 510 246, 546 224, 566 196 C 580 174, 584 148, 578 124" fill="none" stroke={C.label} strokeWidth="2.5" />
      {[[470, 250, '0'], [528, 238, '1 km'], [566, 196, '3 km'], [578, 124, '6 km']].map(([x, y, l]) => (
        <g key={l}>
          <circle cx={x} cy={y} r="4.5" fill={C.up} />
          <text x={Number(x) + 10} y={Number(y) + 14} fontSize="12" style={mono}>{l}</text>
        </g>
      ))}
      <circle cx="530" cy="196" r="5" fill={C.inflow} />
      <text x="518" y="186" fontSize="12" fill={C.inflow} fontFamily="var(--mono, monospace)">storm</text>
      <Leader x1={530} y1={222} x2={478} y2={168} />
      <text x="416" y="160" fontSize="12.5" fill={C.up} fontFamily="var(--mono, monospace)">SRH: the swept area</text>
      <text x="540" y="286" textAnchor="middle" fontSize="12.5" style={mono}>Winds turn clockwise with height</text>
      <text x="540" y="304" textAnchor="middle" fontSize="12" style={monoDim}>Right mover favored: supercell country</text>

      <text x="20" y="330" fontSize="12" style={monoDim}>Each dot is the wind at that height, drawn from a common origin. Shape matters as much as speed.</text>
    </svg>
  );
}

export const FIGURES = {
  'supercell-anatomy': SupercellAnatomy,
  'wall-vs-shelf': WallVsShelf,
  'storm-lifecycle': StormLifecycle,
  'beam-height': BeamHeight,
  'velocity-couplet': VelocityCouplet,
  'cape-cin': CapeCin,
  'shear-ladder': ShearLadder,
  'hodograph-srh': HodographPair,
};
