// THE FORECAST WORKS — the plates
//
// A drawing sheet has one principal view and everything else serves it. The forecast gets the
// middle of the paper at size; the numeric apparatus — the network, today's reading, the
// controls — stands in a column on the left; the reading matter stands in a column on the
// right; and the behaviour traces run the width of the centre beneath the view. Every plate
// uses these zones, so a new sheet inherits the composition instead of inventing one.

import { PEN, INK, Draft } from './draft.js?v=20260811-2247';
import { dial, column, annunciator, manifold, strip, tally, fmtNum } from './instruments.js?v=20260811-2247';

export const SHEET = [841, 594];

export const ZONE = {
  left:  { x: -410, w: 218 },
  mid:   { x: -184, w: 386, cx: 9 },
  right: { x: 204,  w: 200, notationY: 236, notesY: 168 },
  view:  { y0: 30, y1: 266, cy: 148 },
  details: { y: -34 },
  graph: { y: -276, h: 150 },
};

export const PLATES = [
  { id: 'mainline', short: 'MAINLINE', title: 'THE MAINLINE' },
  { id: 'world',    short: 'WORLD',    title: 'THE WORLD' },
  { id: 'alts',     short: 'ALTERNATIVES', title: 'ALTERNATIVE FUTURES' },
  { id: 'morning',  short: 'MORNING',  title: "THIS MORNING'S REVISION" },
  { id: 'key',      short: 'KEY',      title: 'THE KEY' },
];

const CHIP = { w: 40, gap: 3, indent: 24, pitch: 9.6, h: 7.4 };
const NOTES_FLOOR = -246;

// ── shared furniture ─────────────────────────────────────────────────────────

function chip(d, x, y, w, label, { on = false, id = null, payload = null,
                                   colour = null } = {}) {
  const c = colour ?? INK.ink;
  d.rect(x, y - CHIP.h, w, CHIP.h,
         { weight: on ? PEN.outline : PEN.thin, colour: c, fill: on ? c : null,
           solid: true, label: 'chip ' + label });
  d.text([x + w / 2, y - CHIP.h + 2.3], label,
         { size: 1.9, align: 'center', weight: 600, pocket: true,
           colour: on ? 'rgba(238,236,228,0.96)' : c, track: 0.06 });
  if (id) d.region(id, x, y - CHIP.h, w, CHIP.h, payload);
}

function chipRow(d, x, y, label, items, avail) {
  d.text([x, y - 2.6], label, { size: 2.0, colour: INK.inkLight, track: 0.18 });
  const perRow = Math.max(1, Math.floor((avail - CHIP.indent + CHIP.gap) /
                                        (CHIP.w + CHIP.gap)));
  items.forEach((it, i) => {
    const col = i % perRow, row = Math.floor(i / perRow);
    chip(d, x + CHIP.indent + col * (CHIP.w + CHIP.gap), y - row * CHIP.pitch,
         CHIP.w, it.label, { on: it.on, id: it.id, payload: it.payload,
                             colour: it.colour });
  });
  return Math.ceil(items.length / perRow) * CHIP.pitch;
}

// The graduated time bar: an index you drag along an engraved scale, the way a
// drawing-office control is set.
function timeBar(d, x, y, w, S) {
  const y0 = 2012, y1 = 2100;
  d.text([x, y - 2.6], 'DATE', { size: 2.0, colour: INK.inkLight, track: 0.18 });
  const bx = x + CHIP.indent, bw = w - CHIP.indent;
  d.line([bx, y - 8], [bx + bw, y - 8], { weight: PEN.medium, colour: INK.ink });
  for (let yr = 2010; yr <= 2100; yr += 5) {
    if (yr < y0) continue;
    const tx = bx + ((yr - y0) / (y1 - y0)) * bw;
    const major = yr % 20 === 0 || yr === 2012;
    d.line([tx, y - 8], [tx, y - 8 - (major ? 2.8 : 1.6)],
           { weight: PEN.hairline, colour: INK.inkLight });
    if (major) d.text([tx, y - 13.6], String(yr),
                      { size: 1.6, align: 'center', face: 'figure',
                        colour: INK.pencilLight });
  }
  const nx = bx + ((S.yr - y0) / (y1 - y0)) * bw;
  d.polyline([[nx, y - 8], [nx - 2.0, y - 3.4], [nx + 2.0, y - 3.4]],
             { close: true, weight: PEN.medium, colour: INK.blue, fill: INK.blue });
  d.text([bx + bw, y - 2.6], fmtDate(S.yr),
         { size: 2.2, align: 'right', face: 'figure', colour: INK.blue, weight: 600 });
  d.region('ctl:time', bx - 3, y - 12, bw + 6, 12);
}

export function fmtDate(y) {
  const yr = Math.floor(y);
  if (Math.abs(y - 2026.58) < 0.02) return 'TODAY · JUL 2026';
  if (yr >= 2040) return String(yr);
  const m = Math.max(0, Math.min(11, Math.floor((y - yr) * 12)));
  return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
          'OCT', 'NOV', 'DEC'][m] + ' ' + yr;
}

// ── the left column ──────────────────────────────────────────────────────────

// THE NETWORK — the belief network set as a schedule of equations, which is what a
// prior with a provenance is.
function networkPanel(d, S, x, y, w) {
  let yy = d.header(x, y, 'THE NETWORK', 'SEVEN AXES · POSITIONS AND TODAY’S WEIGHTS',
                    { width: w });
  const marg = S.marginals;
  for (const a of S.network.axes) {
    const m = marg[a.key] || {};
    const top = Object.entries(m).sort((p, q) => q[1] - p[1])[0];
    d.text([x, yy], a.key, { size: 2.0, colour: INK.inkLight, track: 0.14 });
    d.text([x + 8, yy], a.name.toUpperCase(),
           { size: 2.0, colour: INK.ink, weight: 600, track: 0.06 });
    d.text([x + w, yy], top ? (top[1] * 100).toFixed(0) + '%' : '—',
           { size: 2.0, align: 'right', face: 'figure', colour: INK.blue, weight: 600 });
    yy -= 3.4;
    // the positions, as a stacked rule: each position's share of the bar
    let px = x + 8;
    const barW = w - 8;
    for (const p of a.positions) {
      const share = (m[p[0]] || 0) * barW;
      if (share > 0.4) {
        d.rect(px, yy - 1.0, share, 1.8,
               { weight: PEN.hairline, colour: INK.inkLight,
                 fill: p[0] === (top && top[0]) ? INK.blueWash : 'rgba(24,28,38,0.06)' });
      }
      d.region(`pos:${a.key}:${p[0]}`, px, yy - 1.4, Math.max(1.4, share), 2.6, p);
      px += share;
    }
    d.text([x, yy - 0.2], top ? top[0] : '—',
           { size: 1.6, colour: INK.pencil, face: 'figure' });
    yy -= 4.6;
    d.region(`axis:${a.key}`, x, yy, w, 8, a);
  }
  return yy;
}

// TODAY'S READING — the arithmetic, with the present row ruled by hand in red.
function readingPanel(d, S, x, y, w) {
  let yy = d.header(x, y, "TODAY'S READING",
                    'THE ACTIVE WORLD-LINE, AT THE DATE ON THE INDEX', { width: w });
  const tr = S.tracks;
  const i = Math.max(0, Math.min(tr.year.length - 1, Math.floor(S.yr) - S.engine.y0));
  const rows = [
    ['CAPABILITY', S.yr < S.NOW ? '—' : tr.cap[i].toFixed(2), 'INDEX'],
    ['COMPUTE', fmtNum(tr.gw[i]), 'GW'],
    ['AI REVENUE', tr.rev[i] >= 1 ? tr.rev[i].toFixed(1) + 'T' :
                   (tr.rev[i] * 1000).toFixed(0) + 'B', 'USD/YR'],
    ['JOBS', tr.jobs[i].toFixed(1), '%'],
    ['LAWS IN FORCE', String(tr.laws[i]), 'COUNT'],
    ['APPROVAL', tr.appr[i].toFixed(0), '%'],
    ['AI ENERGY', tr.twh ? fmtNum(tr.twh[i]) : '—', 'TWH/YR'],
    ['AI EMISSIONS', tr.co2 ? fmtNum(tr.co2[i]) : '—', 'MT/YR'],
  ];
  d.line([x, yy + 1.4], [x + w, yy + 1.4], { weight: PEN.medium, colour: INK.ink });
  rows.forEach((r, k) => {
    const ry = yy - k * 4.4;
    d.text([x, ry], r[0], { size: 1.8, colour: INK.pencil, track: 0.10 });
    d.text([x + w - 16, ry], r[1],
           { size: 2.1, align: 'right', face: 'figure', colour: INK.ink, weight: 600 });
    d.text([x + w, ry], r[2],
           { size: 1.5, align: 'right', colour: INK.pencilLight });
    d.region(`stat:${k}`, x, ry - 1.2, w, 4.0, r);
  });
  const bot = yy - rows.length * 4.4 + 1.6;
  d.line([x, bot], [x + w, bot], { weight: PEN.medium, colour: INK.ink });
  return bot - 4;
}

function controlsPanel(d, S, x, y, w) {
  let yy = d.header(x, y, 'CONTROL',
                    'THE SHEET IS DRAWN FOR THE SETTINGS BELOW', { width: w });
  yy -= 1;
  yy -= chipRow(d, x, yy, 'PLATE',
    PLATES.map((p) => ({ label: p.short, on: p.id === S.plateId,
                         id: `ctl:plate:${p.id}` })), w) + 3.4;
  // the composer — one chip per axis, cycling through its positions
  const axItems = S.network.axes.map((a) => {
    const pin = S.pin[a.key];
    return { label: a.key + (pin ? ' ' + pin : ' ·'), on: !!pin,
             id: `ctl:pin:${a.key}`, colour: pin ? INK.blue : INK.ink };
  });
  yy -= chipRow(d, x, yy, 'COMPOSE', axItems, w) + 3.4;
  yy -= chipRow(d, x, yy, 'MODE', [
    { label: 'INTERVENE', on: !S.obs, id: 'ctl:mode:do' },
    { label: 'OBSERVE', on: S.obs, id: 'ctl:mode:obs' },
    { label: 'RESET', on: false, id: 'ctl:reset' },
  ], w) + 4.2;
  timeBar(d, x, yy, w, S);
  return yy - 18;
}

function epigraph(d, x, y, w, lines, cite) {
  d.line([x, y - lines.length * 5.0 - 1], [x, y + 1.6],
         { weight: PEN.thin, colour: INK.red });
  let yy = y;
  for (const ln of lines) {
    d.text([x + 4.6, yy], ln, { size: 2.7, colour: INK.red, track: 0.04 });
    yy -= 5.0;
  }
  d.text([x + 4.6, yy - 0.6], cite,
         { size: 1.8, colour: INK.redLight, track: 0.20 });
  return yy - 5;
}

function credit(d, S, x, yFoot, w) {
  const ind = 24;
  d.text([x, yFoot + 11.4], 'SOURCE',
         { size: 2.0, colour: INK.red, weight: 700, track: 0.22 });
  d.line([x, yFoot + 14.4], [x + w, yFoot + 14.4],
         { weight: PEN.hairline, colour: INK.inkLight });
  const g = S.grounding.counts;
  const lines = [
    `THE AI POLICY WIKI IN AUGUST'S VAULT — ${g.direct} PAGES GROUND THIS ENGINE ` +
    `DIRECTLY AND ${g.corpus} MORE FEED THE OBSERVED RECORD. NETWORK ` +
    `${S.network.version.toUpperCase()}, READ ${S.network.date}.`,
    'SCENARIO LITERATURE DECONSTRUCTED INTO CITED PARTS: AI 2027 · AI 2040 PLAN A ' +
    'AND ITS PLAN FAMILY · SITUATIONAL AWARENESS · EUROPE 2031 · MACHINES OF LOVING ' +
    'GRACE · AI AS NORMAL TECHNOLOGY · THE 2028 GLOBAL INTELLIGENCE CRISIS · ' +
    'ANTHROPIC 2028. NO SCENARIO IS PINNED; ALL ARE QUARRIED.',
    'PROBABILITIES ARE THE MODEL’S STRUCTURED JUDGMENTS, NOT MEASUREMENTS. ' +
    'THE ENGINE, ITS EVIDENCE LAYER AND ITS NIGHTLY UPDATE LIVE IN THE AI ATLAS; ' +
    'THIS SHEET IS A SECOND SURFACE ON THE SAME INSTRUMENT.',
  ];
  let yy = yFoot + 8.0;
  for (const ln of lines) {
    yy -= d.textBlock([x + ind, yy], ln, w - ind,
                      { size: 1.75, lead: 1.5, colour: INK.pencil, track: 0.06 }) + 1.4;
  }
}

// ── the right column ─────────────────────────────────────────────────────────

function notationPanel(d, S, x, y, w) {
  let yy = d.header(x, y, 'CONDITIONAL STRUCTURE',
                    'HOW ONE AXIS BENDS ANOTHER · SIGNAL LINKS, NOT FLOWS',
                    { width: w });
  const axes = S.network.axes;
  const pos = {};
  const cols = [x + 16, x + 64, x + 112];
  const order = ['T', 'A', 'C', 'D', 'S', 'P', 'E'];
  order.forEach((k, i) => {
    const cx = cols[i % 3], cy = yy - 4 - Math.floor(i / 3) * 17;
    pos[k] = [cx, cy];
  });
  // links first, so the boxes sit on top of them
  for (const key in S.network.cond_stories) {
    const [child, par] = key.split('|');
    const pk = par[0];
    if (!pos[child] || !pos[pk] || pk === child) continue;
    const a = pos[pk], b = pos[child];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 3.4];
    d.polyline([[a[0], a[1] - 2.6], mid, [b[0], b[1] - 2.6]],
               { weight: PEN.hairline, colour: INK.ochre, dash: [2.4, 1.4] });
    d.arrowHead([b[0], b[1] - 2.6],
                Math.atan2(b[1] - 2.6 - mid[1], b[0] - mid[0]),
                { size: 1.5, colour: INK.ochre });
  }
  order.forEach((k) => {
    const [cx, cy] = pos[k];
    const a = axes.find((z) => z.key === k);
    const m = S.marginals[k] || {};
    const top = Object.entries(m).sort((p, q) => q[1] - p[1])[0];
    d.rect(cx - 13, cy - 6, 26, 9,
           { weight: PEN.medium, colour: INK.ink, fill: 'rgba(244,241,232,0.92)' });
    d.text([cx, cy - 1.4], k + ' · ' + (top ? top[0] : '—'),
           { size: 2.0, align: 'center', weight: 700, colour: INK.ink, face: 'figure' });
    d.text([cx, cy - 4.6], a ? a.name.toUpperCase().slice(0, 16) : '',
           { size: 1.4, align: 'center', colour: INK.pencilLight });
    d.region(`axis:${k}`, cx - 13, cy - 6, 26, 9, a);
  });
  return yy - 4 - Math.ceil(order.length / 3) * 17;
}

function notesPanel(d, S, x, yTop, w) {
  const secs = S.notes;
  let size = 2.15;
  for (let i = 0; i < 10; i++) {
    if (drawNotes(d, S, secs, x, yTop, w, size, true) >= NOTES_FLOOR) break;
    size -= 0.055;
  }
  drawNotes(d, S, secs, x, yTop, w, size, false);
  d.line([x - 10, NOTES_FLOOR], [x - 10, yTop + 12],
         { weight: PEN.hairline, colour: INK.inkLight });
}

function drawNotes(d, S, secs, x, yTop, w, size, dry) {
  let y = yTop;
  if (!dry) {
    d.line([x, y + 10], [x + w, y + 10], { weight: PEN.medium, colour: INK.ink });
    d.text([x, y + 4.6], 'NOTES', { size: 3.8, weight: 600, track: 0.20, colour: INK.ink });
    d.text([x + w, y + 4.6], S.plateTitle,
           { size: 2.0, align: 'right', colour: INK.inkLight, track: 0.16 });
    d.line([x, y + 1.6], [x + w, y + 1.6], { weight: PEN.hairline, colour: INK.red });
  }
  y -= 3.0;
  for (const sec of secs) {
    if (!dry) d.text([x, y], sec.h.toUpperCase(),
                     { size: 2.6, weight: 700, track: 0.18, colour: INK.red });
    y -= 4.0;
    for (const para of sec.p) {
      const lines = d.wrap(para, w, { size, track: 0.04 });
      for (const ln of lines) {
        if (!dry) d.text([x, y], ln,
                         { size, colour: INK.pencil, track: 0.04, weight: 400 });
        y -= size * 1.5;
      }
      y -= 1.4;
    }
    y -= 2.4;
  }
  return y;
}

// ── PLATE 1 · THE MAINLINE ───────────────────────────────────────────────────

function forecastView(d, S, box) {
  const [x, y, w, h] = box;
  const Y0 = 2012, Y1 = 2100, SPLIT = 0.66;
  const X = (yr) => yr <= 2040
    ? x + ((yr - Y0) / (2040 - Y0)) * w * SPLIT
    : x + w * SPLIT + ((yr - 2040) / (Y1 - 2040)) * w * (1 - SPLIT);
  const Yv = (v) => y + Math.max(0, Math.min(6.4, v)) / 6.4 * h;
  S.X = X; S.Yv = Yv; S.viewBox = box;

  d.text([x, y + h + 10.4], 'THE FORECAST',
         { size: 3.6, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y + h + 6.4],
         'CAPABILITY AGAINST TIME · OBSERVED RECORD IN INK, THE DISTRIBUTION OF ' +
         'FUTURES IN BLUE · SCALE: 2012–2040 AT 66% OF THE WIDTH',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });

  // the ruled ground
  d.rect(x, y, w, h, { weight: PEN.thin, colour: INK.ink });
  for (let yr = 2015; yr < 2100; yr += 5) {
    const major = yr % 10 === 0;
    d.line([X(yr), y], [X(yr), y + h],
           { weight: PEN.hairline, colour: INK.pencilLight,
             dash: major ? null : [0.8, 1.6], alpha: major ? 0.55 : 0.4 });
  }
  for (let yr = 2020; yr <= 2100; yr += 10) {
    d.line([X(yr), y - 1.6], [X(yr), y], { weight: PEN.hairline, colour: INK.inkLight });
    d.text([X(yr), y - 5.0], String(yr),
           { size: 2.0, align: 'center', face: 'figure', colour: INK.inkLight });
  }

  // the milestone ladder as DATUM lines — a level the run has passed
  const lad = S.engine.ladder;
  for (let i = 1; i <= 6; i++) {
    d.line([x, Yv(i)], [x + w, Yv(i)],
           { weight: PEN.thin, colour: INK.red, dash: [7, 2, 1.4, 2], alpha: 0.55 });
    d.text([x + 1.6, Yv(i) + 1.2], (lad[i] || '').toUpperCase(),
           { size: 1.8, colour: INK.red, track: 0.12, alpha: 0.9 });
    d.text([x - 1.6, Yv(i) - 0.7], String(i),
           { size: 1.8, align: 'right', face: 'figure', colour: INK.redLight });
    d.region(`mile:${i}`, x, Yv(i) - 2.2, w, 4.4, i);
  }

  // resolution zones, dimensioned along the top as a real sheet dimensions its scales
  const zones = [[Y0, S.NOW, 'OBSERVED'], [S.NOW, 2032, 'MONTHLY'],
                 [2032, 2040, 'QUARTERLY'], [2040, 2060, 'YEARLY'],
                 [2060, Y1, 'DECADAL']];
  for (const [a, b, label] of zones) {
    d.dimH(X(a), X(b), y + h + 2.6, label, { size: 1.6 });
  }

  // the distribution: percentile envelopes, hatched — a band on a document is hatched
  const B = S.bands;
  const env = (lo, hi, spacing, alpha) => {
    const pts = [];
    B.year.forEach((yr, i) => { if (yr >= S.NOW) pts.push([X(yr), Yv(B[hi][i])]); });
    for (let i = B.year.length - 1; i >= 0; i--) {
      if (B.year[i] >= S.NOW) pts.push([X(B.year[i]), Yv(B[lo][i])]);
    }
    d.fillPoly(pts, alpha);
    d.hatch([X(S.NOW), y, w - (X(S.NOW) - x), h],
            { spacing, angle: -Math.PI / 4, weight: PEN.hairline,
              colour: INK.blueLight,
              path: (dd) => {
                const ctx = dd.ctx;
                pts.forEach((pt, i) => {
                  const px = dd.x(pt[0]), py = dd.y(pt[1]);
                  i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
                });
                ctx.closePath();
              } });
  };
  env('p10', 'p90', 3.2, 'rgba(58,132,214,0.09)');
  env('p25', 'p75', 1.7, 'rgba(58,132,214,0.13)');

  // the median — the mainline
  const med = [];
  B.year.forEach((yr, i) => { if (yr >= S.NOW) med.push([X(yr), Yv(B.p50[i])]); });
  d.polyline(med, { weight: PEN.outline, colour: INK.blue });

  // the active world-line, when it differs from the median
  if (S.altOrPinned) {
    const pts = [];
    for (let yr = S.NOW; yr <= Y1; yr += 1) pts.push([X(yr), Yv(S.capAt(yr))]);
    d.polyline(pts, { weight: PEN.medium, colour: INK.ochre, dash: [4.0, 2.0] });
    d.text([X(2092), Yv(S.capAt(2092)) + 2.0], 'ACTIVE',
           { size: 1.8, align: 'right', colour: INK.ochre, weight: 600, track: 0.14 });
  }

  // the observed record
  d.polyline(S.TRUNK.map((p) => [X(p[0]), Yv(p[1])]),
             { weight: PEN.outline, colour: INK.ink });
  d.text([X(2013), Yv(0.7)], 'OBSERVED RECORD',
         { size: 2.0, colour: INK.ink, weight: 600, track: 0.14 });

  // today
  d.line([X(S.NOW), y], [X(S.NOW), y + h + 1.4],
         { weight: PEN.medium, colour: INK.ink });
  d.text([X(S.NOW) + 1.4, y + h - 3.0], 'TODAY',
         { size: 2.2, colour: INK.ink, weight: 700, track: 0.18 });
  d.text([X(S.NOW) + 1.4, y + h - 6.4], 'THE SHEET IS REDRAWN EACH MORNING',
         { size: 1.5, colour: INK.pencilLight, track: 0.08 });

  // the date index
  d.line([X(S.yr), y], [X(S.yr), y + h], { weight: PEN.thin, colour: INK.blue });
  d.polyline([[X(S.yr), y + h], [X(S.yr) - 1.8, y + h + 3.0],
              [X(S.yr) + 1.8, y + h + 3.0]],
             { close: true, weight: PEN.thin, colour: INK.blue, fill: INK.blue });

  // crisis points — annotated with leaders, as a drawing annotates a condition
  const CRY = { 'deal-window': 2030, 'explosive-takeoff': 2028, 'no-sc-window': 2036,
                'alignment-fails': 2031, 'hard-deflate': 2028.5,
                'researcher-by-2035': 2035 };
  let side = 0;
  for (const c of S.crisis.crises) {
    const yr = CRY[c.id] || 2032;
    const p = c.kind === 'axis' ? (S.marginals[c.axis] || {})[c.pos] ?? c.p : c.p;
    const cx = X(yr), cy = Yv(S.capAt(yr));
    d.polyline([[cx, cy - 2.0], [cx + 2.0, cy], [cx, cy + 2.0], [cx - 2.0, cy]],
               { close: true, weight: PEN.thin, colour: INK.red,
                 fill: 'rgba(244,241,232,0.9)' });
    const ly = cy + (side % 2 ? -12 : 11) - Math.floor(side / 2) * 0;
    d.leader([cx, cy], [cx + 6, ly], `${(p * 100).toFixed(0)}%  ${c.q.toUpperCase()}`,
             { colour: INK.red, size: 1.75 });
    d.region(`crisis:${c.id}`, cx - 3, cy - 3, 6, 6, c);
    side++;
  }
}

function detailsBand(d, S, x, y, w) {
  // DETAIL A — the tempo dial bank, two needles: today and thirty days ago
  d.text([x, y], 'DETAIL A   THE TEMPO DIALS',
         { size: 3.0, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y - 3.6],
         'ONE FACE PER POSITION · THE GHOST NEEDLE STANDS WHERE THE READING STOOD ' +
         'THIRTY DAYS AGO, SO THE DRIFT IS AN ANGLE',
         { size: 1.6, colour: INK.pencilLight, track: 0.08 });
  const T = S.network.axes.find((a) => a.key === 'T');
  const m = S.marginals.T || {}, was = S.marginals30.T || {};
  T.positions.forEach((p, i) => {
    dial(d, x + 13 + i * 27, y - 20, 9.4, {
      label: p[0], sub: p[1].split(' (')[0].toUpperCase().slice(0, 14),
      value: m[p[0]] || 0, was: was[p[0]] ?? null, id: `pos:T:${p[0]}`,
      colour: INK.blue,
    });
  });

  // DETAIL B — the compute manifold
  const bx = x + 122;
  d.text([bx, y], 'DETAIL B   THE COMPUTE MANIFOLD',
         { size: 3.0, weight: 600, track: 0.13, colour: INK.ink });
  d.text([bx, y - 3.6],
         'SHARES OF MODELLED GLOBAL AI COMPUTE, READ AGAINST ONE SCALE',
         { size: 1.6, colour: INK.pencilLight, track: 0.08 });
  const tr = S.tracks;
  const i = Math.max(0, Math.min(tr.year.length - 1, Math.floor(S.yr) - S.engine.y0));
  manifold(d, bx + 6, y - 30, 46, 24, [
    { k: 'US', v: tr.us[i], c: INK.blue, wash: INK.blueWash },
    { k: 'CN', v: tr.cn[i], c: INK.red, wash: 'rgba(150,44,38,0.20)' },
    { k: 'EU', v: tr.eu[i], c: INK.green, wash: INK.greenWash },
    { k: 'ROW', v: Math.max(0, 1 - tr.us[i] - tr.cn[i] - tr.eu[i]),
      c: INK.pencil, wash: 'rgba(52,50,48,0.16)' },
  ], { id: 'manifold' });

  // DETAIL C — the annunciator and the tally
  const cx = x + 196;
  d.text([cx, y], 'DETAIL C   CAPABILITY ANNUNCIATOR',
         { size: 3.0, weight: 600, track: 0.13, colour: INK.ink });
  d.text([cx, y - 3.6],
         'A LAMP TRIPS WHEN THE ACTIVE LINE CROSSES THAT DOMAIN’S THRESHOLD',
         { size: 1.6, colour: INK.pencilLight, track: 0.08 });
  const cap = S.yr < S.NOW ? S.trunkCap(S.yr) : tr.cap[i];
  annunciator(d, cx, y - 7, 74, S.engine.domains.map((dm) => ({
    k: dm.k, th: dm.th, on: cap >= dm.th })), { cols: 2, id: 'dom' });
  tally(d, cx, y - 33, 74, { n: tr.copies[i], speed: tr.speed[i], id: 'tally' });
}

function behaviourGraph(d, S, x, y, w, h) {
  d.text([x, y + h + 5.6], 'BEHAVIOUR OVER TIME',
         { size: 3.6, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y + h + 1.8],
         'THE ACTIVE WORLD-LINE’S LAYERS, 2026–2100 · THE PEN SITS AT THE DATE ON THE INDEX',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });
  const tr = S.tracks, yrs = tr.year;
  const cellW = (w - 24) / 3, cellH = (h - 14) / 2;
  const panels = [
    { d: tr.gw, label: 'COMPUTE', unit: 'GW', c: INK.warm, id: 'trk:gw',
      fmt: (v) => fmtNum(v) },
    { d: tr.rev, label: 'AI REVENUE', unit: 'USD T/YR', c: INK.blue, id: 'trk:rev',
      fmt: (v) => v.toFixed(1) },
    { d: tr.jobs, label: 'JOBS', unit: '% CUMULATIVE', c: INK.red, id: 'trk:jobs',
      fmt: (v) => v.toFixed(0) },
    { d: tr.laws, label: 'LAWS IN FORCE', unit: 'COUNT', c: INK.green, id: 'trk:laws',
      fmt: (v) => fmtNum(v) },
    { d: tr.appr, label: 'PUBLIC APPROVAL', unit: '%', c: INK.ochre, id: 'trk:appr',
      fmt: (v) => v.toFixed(0) },
    { d: tr.co2 || tr.gw, label: 'AI EMISSIONS', unit: 'MT/YR', c: INK.pencil,
      id: 'trk:co2', fmt: (v) => fmtNum(v) },
  ];
  panels.forEach((p, i) => {
    const px = x + (i % 3) * (cellW + 12);
    const py = y + (1 - Math.floor(i / 3)) * (cellH + 14);
    const lo = Math.min(...p.d), hi = Math.max(...p.d);
    const pad = (hi - lo) * 0.08 || 1;
    strip(d, px + 8, py, cellW - 10, cellH, {
      data: p.d, years: yrs, y0: lo - pad, y1: hi + pad, colour: p.c,
      label: p.label, unit: p.unit, now: Math.max(S.engine.y0, S.yr),
      id: p.id, fmt: p.fmt,
    });
  });
}

// ── the plates ───────────────────────────────────────────────────────────────

export function drawPlate(d, S) {
  d.border(SHEET, 10);
  const L = ZONE.left, R = ZONE.right, M = ZONE.mid;

  // left column, stacked downward
  let ly = networkPanel(d, S, L.x + 8, 262, L.w - 16);
  ly = readingPanel(d, S, L.x + 8, ly - 6, L.w - 16);
  const cBottom = controlsPanel(d, S, L.x + 8, ly - 4, L.w - 16);
  epigraph(d, L.x + 8, Math.min(cBottom - 8, -170), L.w - 16, S.epigraph.lines,
           S.epigraph.cite);
  credit(d, S, L.x + 8, -281, L.w - 16);

  // right column
  notationPanel(d, S, R.x + 6, R.notationY, R.w - 12);
  notesPanel(d, S, R.x + 6, R.notesY, R.w - 12);

  // the middle — per plate
  if (S.plateId === 'mainline') {
    forecastView(d, S, [M.x + 20, 34, M.w - 34, 224]);
    detailsBand(d, S, M.x + 20, 18, M.w - 34);
    behaviourGraph(d, S, M.x + 20, -268, M.w - 34, 198);
  } else if (S.plateId === 'world') {
    S.drawWorldPlate(d, S, [M.x + 14, -36, M.w - 24, 294]);
    behaviourGraph(d, S, M.x + 20, -268, M.w - 34, 190);
  } else if (S.plateId === 'alts') {
    S.drawAltsPlate(d, S, [M.x + 14, -142, M.w - 24, 396]);
  } else if (S.plateId === 'morning') {
    S.drawMorningPlate(d, S, [M.x + 14, -262, M.w - 24, 508]);
  } else if (S.plateId === 'key') {
    S.drawKeyPlate(d, S, [M.x + 14, -262, M.w - 24, 508]);
  }

  d.titleBlock(SHEET, [
    ['THE FORECAST WORKS',
     `PLATE ${PLATES.findIndex((p) => p.id === S.plateId) + 1}  ·  ${S.plateTitle}`, 3.2],
    ['WORLD-LINE', S.lineLabel, 2.0],
    ['NETWORK / READ', `${S.network.version.toUpperCase()}  ·  ${S.network.date}`, 2.0],
    ['SCALE / SHEET', `A1 841 × 594   ·   ${fmtDate(S.yr)}`, 2.0],
  ], { margin: 10, w: 132, h: 40 });
}
