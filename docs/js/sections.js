// AI FUTURES FORECASTER — the document
//
// Seven tabs. The first carries the forecast, the passage describing it, and the controls that
// set it; the rest hold one plate each. Within a tab the drawing is a vertical sheet 300 mm
// wide, drawn at one fixed scale so lettering keeps the size it was drawn at and nothing has to
// be zoomed. A section's millimetre space runs x 0 → 300 across and y 0 → H up from its foot.

import { PEN, INK, PAPER } from './draft.js?v=20260903-0331';
import { dial, manifold, strip, collectives, fmtNum } from './instruments.js?v=20260903-0331';

export const SHEET_W = 340;
const PAD = 13;
const CW = SHEET_W - PAD * 2;
export const SHEET_CW = CW;

export const TABS = [
  { id: 'forecast', label: 'Forecast' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'behaviour', label: 'Behaviour' },
  { id: 'world', label: 'World' },
  { id: 'alternatives', label: 'Branches' },
  { id: 'revision', label: 'This morning' },
  { id: 'research', label: 'Research' },
  { id: 'method', label: 'Method' },
];

// ── shared furniture ─────────────────────────────────────────────────────────

// A section's height has to be known before anything in it is drawn. Guessing from character
// counts left tens of millimetres of blank paper under every prose section, so the height is
// measured with the drawing's own line-breaker: `wrap()` measures each string once at a 100 px
// reference and caches it, which makes an exact measure as cheap as an estimate.
export const LEAD = 1.45;
export function measureSections(d, secs, colW, size = 2.0) {
  let h = 0;
  for (const s of secs) {
    if (s.h) h += size * 1.9;
    for (const p of s.p || []) {
      if (!p) continue;
      h += d.wrap(p, colW, { size, lead: LEAD }).length * size * LEAD + 2.0;
    }
    h += 2.4;
  }
  return h;
}
// ── the passage: blocks that flow across the columns ────────────────────────
// The passage is SINCE, NOW and AHEAD, each a section of groups, and a group is the unit that
// flows across the three columns, so the columns end level however long NOW runs. A group
// that opens its section carries the section heading; a group that opens a column mid-section
// carries the heading again, marked continued, so a reader landing there knows the tense.
// Every line is an item of the chronicle with its own source: its kind is drawn as a mark in
// the margin (PROV_MARK, one glyph per kind, the key published under the headline), and the
// line is registered as a region a reader can open onto the note the composer wrote for it.
// Measuring and drawing share blockRows(), so a change to one cannot leave the other behind.
const BULLET_MARK = '·';
export const PROV_MARK = { milestone: '◆', event: '▸', threshold: '▪',
                           quantity: '▪', onset: '○', criterion: '○',
                           calendar: '▫' };
export const PROV_KEY = '◆ CAPABILITY MILESTONE   ▸ EVENT ON THIS PATH   ' +
  '▪ LEVEL A TRACK PASSES   ○ POSITION IN FORCE   ▫ ON THE CALENDAR   ' +
  '·  PRESS A LINE FOR ITS SOURCE';
const IND = 3.0;        // the mark's hanging indent, in sheet millimetres
const HEAD_SIZE = 1.7;  // the section heading's cap height
const HEAD_LEAD = 1.28;
const SUB_SIZE = 1.5;   // the group heading, a step under the section heading
const KEY_H = 4.4;      // the key line under the headline's rule
// the note a line opens: type sizes, padding and the air above and below the box
const NOTE = { size: 1.7, lead: 1.36, title: 1.6, pad: 1.8, gap: 0.8, above: 1.2, below: 3.2 };
// EVERY VERTICAL GAP IN THE PASSAGE IS A MULTIPLE OF ONE UNIT, and measure and draw read the
// same numbers. They had been written out twice — 1.1 between bullets here, 1.0 + 0.6 around a
// group heading there, 2.2 after a section heading, 3.6 between paragraphs — four figures with
// no relation to each other, in two places that could disagree without anything noticing.
const SP_U = 0.9;
export const PROSE_SP = {
  bullet: SP_U,             // air between two lines
  subOver: SP_U * 1.35,     // above a group heading, which belongs to the lines below it
  subUnder: SP_U * 0.55,
  headUnder: SP_U * 1.9,    // under the section heading's rule
  para: SP_U * 3.4,         // between sections inside a column
  lead: 1.34,               // inside a wrapped line, tighter than running prose
};
export function proseBlocks(paras) {
  const blocks = [];
  paras.forEach((p, pi) => {
    const gs = p.groups && p.groups.length ? p.groups : [{ head: null, text: p.text }];
    gs.forEach((g, gi) => blocks.push({ lead: p.lead || '', first: gi === 0, group: g, para: pi }));
  });
  return blocks;
}
// sentence per line for a group with no items (the record), keeping decimals, dates and
// abbreviations intact
const splitSentences = (t) => String(t || '').split(/(?<=[.!?])\s+(?=[A-Z“"])/)
  .map((x) => x.trim()).filter(Boolean);
function noteRows(d, note, colW) {
  const w = colW - IND - NOTE.pad * 2;
  const title = d.wrap(String(note.title || 'SOURCE').toUpperCase(), w,
                       { size: NOTE.title, weight: 700, track: 0.16 });
  const paras = (note.lines || []).map((t) => d.wrap(t, w, { size: NOTE.size }));
  let h = NOTE.pad + title.length * NOTE.title * HEAD_LEAD + NOTE.gap;
  for (const ls of paras) h += ls.length * NOTE.size * NOTE.lead + NOTE.gap;
  h += NOTE.pad;
  return { title, paras, h };
}
export function blockRows(d, b, colW, size = 2.0, atTop = false) {
  const rows = [];
  const lead = String(b.lead || '').replace(/[.:]\s*$/, '').toUpperCase();
  if (lead && b.first) rows.push({ t: lead, head: 1 });
  else if (lead && atTop) rows.push({ t: `${lead} · CONTINUED`, head: 1, cont: true });
  const g = b.group;
  // A GROUP HEADING SAYS WHAT KIND OF CLAIM FOLLOWS. Under one section heading the lines mix
  // the lanes of the ledger, the conditions in force, the quantities the model computes, and
  // dated commitments already on the record. The reader is entitled to see which is which.
  if (g.head) rows.push({ t: g.head, head: 2 });
  if (g.items && g.items.length) {
    for (const it of g.items) {
      rows.push({ t: it.t, head: 0, mark: PROV_MARK[it.kind] || BULLET_MARK, key: it.key, item: it });
      if (it.note) rows.push({ head: 0, note: noteRows(d, it.note, colW) });
    }
  } else {
    for (const t of splitSentences(g.text)) rows.push({ t, head: 0, mark: BULLET_MARK });
  }
  // The heading is set at its own size and lead, so it is counted at its own size and lead.
  // Counting every row at body size measured the block short and put nine marks off the
  // section, which is the measure and the draw disagreeing by exactly one type size. THE
  // MEASURE MUST WRAP ON THE SAME TRACKING THE DRAW USES: textBlock defaults to 0.06, and a
  // count at 0 wrapped every line to more lines than were measured for it.
  let h = 0;
  for (const r of rows) {
    if (r.note) { r.h = NOTE.above + r.note.h + NOTE.below; h += r.h; continue; }
    const sz = r.head === 1 ? HEAD_SIZE : r.head === 2 ? SUB_SIZE : size;
    const n = d.wrap(r.t, colW - (r.head === 1 ? 0 : IND),
                     { size: sz, track: r.head ? 0.16 : 0.06, weight: r.head ? 700 : 400 }).length;
    r.h = r.head === 1 ? n * HEAD_SIZE * HEAD_LEAD + PROSE_SP.headUnder
        : r.head === 2 ? n * SUB_SIZE * HEAD_LEAD + PROSE_SP.subOver + PROSE_SP.subUnder
        : n * size * PROSE_SP.lead + PROSE_SP.bullet;
    h += r.h;
  }
  return { rows, h };
}
export function measureProse(d, paras, colW, size = 2.0) {
  const blocks = proseBlocks(paras);
  let h = 0;
  blocks.forEach((b, k) => {
    h += blockRows(d, b, colW, size, k === 0).h;
    if (k + 1 < blocks.length && blocks[k + 1].first) h += PROSE_SP.para;
  });
  return h;
}
// The passage across n columns, cut at group boundaries so the columns end level. Three
// columns keep it a band across the head of the sheet instead of a wall the chart has to sit
// under.
export const PROSE_N = 3;
export const PROSE_COL = (CW - (PROSE_N - 1) * 10) / PROSE_N;
export function proseColumns(d, paras, colW = PROSE_COL, n = PROSE_N, size = 2.0) {
  const blocks = proseBlocks(paras);
  const m = blocks.length;
  const keys = [];
  for (const b of blocks) for (const it of b.group.items || []) if (it.key) keys.push(it.key);
  if (!m) return { cols: Array.from({ length: n }, () => []), h: 0, keys };
  // each block measured twice: inside a column, and at the top of one, where it may carry a
  // continued heading
  const Hs = blocks.map((b) => [blockRows(d, b, colW, size, false).h,
                                blockRows(d, b, colW, size, true).h]);
  const colH = (a, z) => {
    let h = 0;
    for (let k = a; k < z; k++) {
      h += Hs[k][k === a ? 1 : 0];
      if (k + 1 < z && blocks[k + 1].first) h += PROSE_SP.para;
    }
    return h;
  };
  // Order has to be preserved, so the only choice is where to cut. With a dozen blocks every
  // set of cuts can be tried, and the one with the shortest tallest column wins — a greedy
  // fill left one column with a single line and another with four paragraphs.
  let best = null;
  const walk = (cuts, start) => {
    if (cuts.length === n - 1) {
      const bounds = [0, ...cuts, m];
      let tallest = 0;
      for (let c = 0; c < n; c++) tallest = Math.max(tallest, colH(bounds[c], bounds[c + 1]));
      if (!best || tallest < best.tallest) best = { tallest, bounds };
      return;
    }
    const left = n - 1 - cuts.length;
    for (let c = start; c <= m - left; c++) walk([...cuts, c], c + 1);
  };
  if (m >= n) walk([], 1);
  else {
    best = { tallest: Math.max(...Hs.map((h) => h[1])),
             bounds: [...Array(m + 1).keys()].concat(Array(n - m).fill(m)) };
  }
  const cols = [];
  for (let c = 0; c < n; c++) cols.push(blocks.slice(best.bounds[c], best.bounds[c + 1]));
  return { cols, h: best.tallest, keys };
}
// Split a run of sections into two columns of roughly equal drawn height.
export function balance(d, secs, colW, size = 2.0) {
  const hs = secs.map((s) => measureSections(d, [s], colW, size));
  const total = hs.reduce((a, b) => a + b, 0);
  let run = 0, cut = secs.length;
  for (let i = 0; i < secs.length; i++) {
    if (run + hs[i] / 2 > total / 2) { cut = i; break; }
    run += hs[i];
  }
  cut = Math.max(1, Math.min(secs.length - 1, cut));
  return { cols: [secs.slice(0, cut), secs.slice(cut)],
           h: Math.max(measureSections(d, secs.slice(0, cut), colW, size),
                       measureSections(d, secs.slice(cut), colW, size)) };
}

function rule(d, y, x0 = PAD, w = CW, { colour = INK.ink, weight = PEN.medium } = {}) {
  d.line([x0, y], [x0 + w, y], { weight, colour });
}

function head(d, y, title, sub, { x = PAD, w = CW } = {}) {
  d.text([x, y], title, { size: 4.0, weight: 700, track: 0.18, colour: INK.ink });
  rule(d, y - 2.4, x, w, { weight: PEN.thin, colour: INK.inkLight });
  if (sub) {
    return y - 7.4 - d.textBlock([x, y - 5.4], sub, w,
      { size: 2.0, lead: LEAD, colour: INK.pencil });
  }
  return y - 5.0;
}

// A position's note usually ends in a full stop already, so appending one to the first
// sentence gives ".." — small, and it reads as a truncation the drawing did not make.
function firstSentence(str) {
  const first = String(str || '').split('. ')[0].replace(/[.\s]+$/, '');
  return first ? first + '.' : '';
}

// Lettering cut to the width it has. A long position name ran into the figure at the right of
// its own button; the full name is in the entry the button opens.
function fit(d, str, w, opts) {
  if (d.textWidth(str, opts) <= w) return str;
  let s = String(str);
  while (s.length > 4 && d.textWidth(s + '…', opts) > w) s = s.slice(0, -1);
  return s.replace(/[\s·-]+$/, '') + '…';
}

// A button that says what it does.
function button(d, x, y, w, h,
                { name, desc, on, dim, id, payload, accent, tick, nameW = null }) {
  const c = on ? (accent || INK.blue) : INK.ink;
  d.rect(x, y, w, h, {
    weight: on ? PEN.outline : PEN.thin, colour: on ? c : INK.inkLight,
    fill: on ? 'rgba(21,84,166,0.10)' : (dim ? 'rgba(24,28,38,0.02)' : null),
  });
  if (on) d.line([x + 1.2, y + 1.2], [x + 1.2, y + h - 1.2], { weight: PEN.heavy, colour: c });
  const nameOpts = { size: 2.3, weight: on ? 700 : 600, track: 0.06 };
  d.text([x + 4.0, y + h - 4.4],
         nameW ? fit(d, name, nameW, nameOpts) : name,
         { ...nameOpts, colour: on ? c : INK.ink });
  if (desc) {
    d.textBlock([x + 4.0, y + h - 7.6], desc, w - 6.5,
                { size: 1.8, lead: 1.38, colour: on ? INK.pencil : INK.pencilLight, max: 5 });
  }
  if (tick) {
    d.arc([x + w - 4.0, y + h - 3.6], 1.5, 0, Math.PI * 2,
          { weight: PEN.thin, colour: on ? c : INK.inkLight });
    if (on) d.dot([x + w - 4.0, y + h - 3.6], 0.85, { colour: c });
  }
  if (id) d.region(id, x, y, w, h, payload);
}

// A note drawn where the reader is looking: two columns inside a ruled block.
export const NOTE_TITLE = { size: 2.4, weight: 700, track: 0.16 };
function noteBlock(d, x, y, w, note, { title = null, colour = INK.red } = {}) {
  // The column width follows the number of columns the note was MEASURED at. Deriving it from
  // the block width alone wrapped a one-column note to half its width and ran it off the foot
  // of the section, where nothing catches it.
  const n = Math.max(1, note.cols.length);
  const gap = n > 1 ? 4 : 0;
  const colW = (w - 8 - (n - 1) * gap) / n;
  // A title wider than the block wraps, and the block grows by the lines it takes: the
  // axis names r5 lengthened ran the title off the controls column and off the sheet. The
  // measure in sheetState() adds the same lines to `note.h`, from the same wrap.
  const tl = title ? d.wrap(title.toUpperCase(), w - 8, NOTE_TITLE) : [];
  const extra = tl.length > 1 ? (tl.length - 1) * NOTE_TITLE.size * 1.28 : 0;
  d.rect(x, y - note.h - (title ? 9 : 4), w, note.h + (title ? 11 : 6),
         { weight: PEN.thin, colour, alpha: 0.6 });
  let top = y;
  if (title) {
    d.textBlock([x + 4, y - 3.0], title.toUpperCase(), w - 8, { ...NOTE_TITLE, lead: 1.28, colour });
    top = y - 7.4 - extra;
  }
  note.cols.forEach((col, ci) => {
    let cy = top;
    const cx = x + 4 + ci * (colW + gap);
    for (const sec of col) {
      if (sec.h) {
        d.text([cx, cy], sec.h.toUpperCase(),
               { size: 2.0, weight: 700, track: 0.14, colour: INK.ink });
        cy -= 3.8;
      }
      for (const p of sec.p || []) {
        if (!p) continue;
        cy -= d.textBlock([cx, cy], p, colW, { size: 2.0, lead: LEAD, colour: INK.pencil })
            + 2.0;
      }
      cy -= 2.4;
    }
  });
}

// The date index belongs on every plate that reads a date, so a reader on the instruments or
// the behaviour tab can move time without going back to the forecast. Its scale is linear,
// unlike the chart's, so the region carries its own mapping.
export function dateStrip(d, x, y, w, S) {
  const y0 = 2026, y1 = 2100;
  const X = (yr) => x + ((Math.max(y0, Math.min(y1, yr)) - y0) / (y1 - y0)) * w;
  d.line([x, y], [x + w, y], { weight: PEN.medium, colour: INK.ink });
  for (let yr = y0; yr <= y1; yr += 2) {
    const major = yr % 10 === 0;
    d.line([X(yr), y], [X(yr), y - (major ? 3.0 : 1.5)],
           { weight: PEN.hairline, colour: INK.inkLight });
    if (major) {
      d.text([X(yr), y - 6.6], String(yr),
             { size: 1.7, align: 'center', face: 'figure', colour: INK.inkLight });
    }
  }
  const nx = X(S.yr);
  d.polyline([[nx, y], [nx - 2.4, y + 4.2], [nx + 2.4, y + 4.2]],
             { close: true, weight: PEN.medium, colour: INK.blue, fill: INK.blue });
  d.text([nx, y + 5.8], String(Math.floor(S.yr)),
         { size: 2.2, align: 'center', face: 'figure', colour: INK.blue, weight: 700 });
  d.text([x - 2, y + 5.8], 'DATE', { size: 1.8, align: 'right', colour: INK.pencilLight,
                                     track: 0.16 });
  d.region('ctl:time', x - 3, y - 8, w + 6, 16, { linear: true, x0: x, w, y0, y1 });
}

// ── 1 · masthead ─────────────────────────────────────────────────────────────
export function header(d, S, H) {
  const y = H - 8;
  d.text([PAD, y], 'AI FUTURES FORECASTER',
         { size: 6.0, weight: 700, track: 0.22, colour: INK.ink });
  d.text([PAD + CW, y], S.network.version.toUpperCase() + ' · READ ' + S.network.date,
         { size: 2.0, align: 'right', colour: INK.inkLight, track: 0.14, face: 'figure' });
  rule(d, y - 4.0, PAD, CW, { weight: PEN.border });
  d.textBlock([PAD, y - 9.0],
    'A probabilistic model of the AI transition, 2012 to 2100, drawn as a document. The record ' +
    'to the left of TODAY is what the AI Policy Wiki has recorded. Everything to the right is a ' +
    'distribution over futures, re-sampled each morning as the wiki records what happened.', CW,
    { size: 2.1, lead: LEAD, colour: INK.pencil });
  return H;
}
header.height = () => 26;


// ── 2 · the board: instruments · forecast · controls, side by side ───────────
// Three columns. The instruments and the behaviour recorders stand to the left of the chart so
// the readings and the forecast are in the eye at once; the controls are a panel on the right
// with one tab per variable, so a row of buttons and its entry fit without scrolling.
// 13 + 80 + 4 + 152 + 4 + 74 + 13 = 340. The extra width over the old 300 mm sheet goes to the
// chart, and buys the left column a second file of recorders, which is where the scroll was.
export const COL = {
  left: { x: PAD, w: 80 },
  mid: { x: PAD + 84, w: 152 },
  right: { x: PAD + 240, w: 74 },
};
export const CTL_NOTE_W = COL.right.w - 8;

export const CHART = {
  bx: COL.mid.x + 15, bw: COL.mid.w - 17, Y0: 2012, Y1: 2100, KNEE: 2040, SPLIT: 0.64,
  x(yr) {
    const C = CHART;
    return yr <= C.KNEE
      ? C.bx + ((yr - C.Y0) / (C.KNEE - C.Y0)) * C.bw * C.SPLIT
      : C.bx + C.bw * C.SPLIT + ((yr - C.KNEE) / (C.Y1 - C.KNEE)) * C.bw * (1 - C.SPLIT);
  },
  year(px) {
    const C = CHART, t = (px - C.bx) / C.bw;
    const yr = t <= C.SPLIT
      ? C.Y0 + (t / C.SPLIT) * (C.KNEE - C.Y0)
      : C.KNEE + ((t - C.SPLIT) / (1 - C.SPLIT)) * (C.Y1 - C.KNEE);
    return Math.max(C.Y0, Math.min(C.Y1, yr));
  },
};

const NOTE_BAND = 42;
const CHART_H = 152;

// ── the left column ──────────────────────────────────────────────────────────
function instrumentColumn(d, S, top) {
  const { x, w } = COL.left;
  let y = top;
  d.text([x, y], 'INSTRUMENTS', { size: 3.0, weight: 700, track: 0.16, colour: INK.ink });
  rule(d, y - 2.2, x, w, { weight: PEN.thin, colour: INK.inkLight });
  y -= 6.4;
  d.text([x, y], 'CAPABILITY TEMPO · WEIGHT' +
         (S.lookbackDays ? ` AND ITS ${S.lookbackDays}-DAY DRIFT` : ''),
         { size: 1.6, track: 0.10, colour: INK.pencilLight });
  y -= 2.8;
  // The baseline is the date the position space last changed, so a rebuild reads as a
  // rebuild and the dials show the world (P5).
  if (S.lookbackDays && S.spaceSince) {
    d.text([x, y], `SINCE ${S.spaceSince}, WHEN THE POSITION SPACE LAST CHANGED`,
           { size: 1.35, track: 0.08, colour: INK.pencilLight });
  }
  y -= 3.2;

  const T = S.network.axes.find((a) => a.key === 'T');
  const m = S.marginals.T || {}, was = S.marginals30.T || {};
  T.positions.forEach((p, i) => {
    dial(d, x + 9 + (i % 2) * 40, y - 12 - Math.floor(i / 2) * 27, 8.2, {
      label: p[0] + ' · ' + p[1].split(' (')[0].toUpperCase(), labelW: 37,
      value: m[p[0]] || 0, was: was[p[0]] ?? null, id: `pos:T:${p[0]}`, colour: INK.blue,
    });
  });
  y -= 12 + Math.ceil(T.positions.length / 2) * 27;

  const tr = S.tracks, i0 = S.idx;
  d.text([x, y], 'COMPUTE SHARES', { size: 1.9, weight: 700, track: 0.14, colour: INK.ink });
  y -= 4;
  manifold(d, x + 7, y - 24, w - 14, 22, [
    { k: 'US', v: tr.us[i0], c: INK.blue, wash: INK.blueWash },
    { k: 'CN', v: tr.cn[i0], c: INK.red, wash: 'rgba(178,28,24,0.20)' },
    { k: 'EU', v: tr.eu[i0], c: INK.green, wash: INK.greenWash },
    { k: 'ROW', v: Math.max(0, 1 - tr.us[i0] - tr.cn[i0] - tr.eu[i0]),
      c: INK.pencil, wash: 'rgba(38,38,40,0.16)' },
  ], { id: 'manifold' });
  y -= 24 + 8;
  d.text([x, y], `${fmtNum(tr.gw[i0])} GW · ${fmtNum(tr.twh[i0])} TWH/YR${capTag(S, 'gw')}`,
         { size: 1.9, face: 'figure', colour: INK.warm, weight: 700 });
  y -= 6;

  d.text([x, y], 'CAPABILITY DOMAINS', { size: 1.9, weight: 700, track: 0.14, colour: INK.ink });
  y -= 4;
  S.engine.domains.forEach((dm, i) => {
    const on = S.cap >= dm.th;
    d.rect(x, y - 6.6, w, 6.2, {
      weight: on ? PEN.thin : PEN.hairline, colour: on ? INK.ink : INK.inkLight,
      fill: on ? 'rgba(196,78,10,0.13)' : null, solid: on, label: 'lamp',
    });
    d.dot([x + 2.6, y - 3.4], 1.1, { colour: on ? INK.warm : INK.inkLight, hollow: !on });
    // The row lettered the key — CODE, HACK, FCAST, R&D — which a reader has to already
    // know to read. The engine carries a full name for each; it is drawn. DOMAIN_LABEL
    // overrides only where the engine's name is a description ("AI research itself")
    // and falls through to the engine for everything else, so the parent stays the source.
    const label = DOMAIN_LABEL[dm.k] || dm.n || dm.k;
    d.text([x + 5.4, y - 4.4], fit(d, label, w - 16, { size: 1.65, track: 0.04 }),
           { size: 1.65, weight: on ? 700 : 500, track: 0.04, pocket: true,
             colour: on ? INK.ink : INK.pencilLight });
    d.text([x + w - 2.0, y - 4.4], on ? String(S.crossYear(dm.th) || '—') : dm.th.toFixed(1),
           { size: 1.6, align: 'right', face: 'figure', pocket: true,
             colour: on ? INK.warm : INK.pencilLight });
    d.region(`dom:${i}`, x, y - 6.6, w, 6.2, dm);
    y -= 7.2;
  });
  y -= 2;
  y -= collectives(d, x, y, w, {
    n: tr.copies[i0], speed: tr.speed[i0], id: 'tally',
    prev: tr.copies[Math.max(0, i0 - 5)],
    cap: (() => { const f = capFlag(S, 'copies'); return f && S.yr >= f.since ? f : null; })(),
  }) + 3;
  return top - y;
}

// ── the recorders, across the foot of the board ──────────────────────────────
// Six strips two-up inside an 80 mm column gave each 36 mm of width for 75 years of
// history, so every one of them was a squiggle. Across the sheet each gets 50 mm and
// twice the height, and they read as one instrument panel.
export function recorders(d, S, H) {
  const top = H - 8;
  let y = head(d, top, 'BEHAVIOUR OVER TIME',
    'Six quantities the same sampled line produces, 2026 to 2100, with the pen standing at ' +
    'the date; the blue band is the tenth to ninetieth percentile of the sampled futures. ' +
    'Click any strip for what it measures and where its numbers come from.');
  const panels = behaviourPanels(S);
  const n = panels.length;
  const gap = 5;
  const pw = (CW - gap * (n - 1)) / n;
  const ph = 34;
  panels.forEach((p, i) => {
    const [lo, hi] = panelRange(p);
    const pad = (hi - lo) * 0.08 || 1;
    strip(d, PAD + i * (pw + gap) + 8, y - ph, pw - 9, ph, {
      data: p.d, years: S.tracks.year, y0: lo - pad, y1: hi + pad, colour: p.c,
      label: p.label, unit: p.unit, now: Math.max(S.engine.y0, S.yr), id: p.id, fmt: p.fmt,
      cap: p.cap, band: p.band,
    });
  });
  y -= ph + 4;
  return H - y + 4;
}
recorders.height = () => 60;

// ── the middle column ────────────────────────────────────────────────────────
// Two drawings share the middle column. The forecast is capability against time to 2100;
// the record is the same quantity across 2012 to today, at a scale where the steps that
// produced it are legible. They are the same axis at two magnifications, which is why the
// switch sits on the heading rather than in the tab rail.
const VIEWS = [['forecast', 'FORECAST'], ['record', 'RECORD']];
function viewSwitch(d, S, x, w, y) {
  const bw2 = 24, bh2 = 5.6, gap = 1.6;
  const total = VIEWS.length * bw2 + (VIEWS.length - 1) * gap;
  VIEWS.forEach(([k, name], i) => {
    const bx2 = x + w - total + i * (bw2 + gap);
    const on = (S.chartView || 'forecast') === k;
    d.rect(bx2, y - 1.4, bw2, bh2, {
      weight: on ? PEN.medium : PEN.hairline, colour: on ? INK.blue : INK.inkLight,
      fill: on ? 'rgba(38,118,214,0.14)' : null,
    });
    d.text([bx2 + bw2 / 2, y + 0.4], name,
           { size: 1.7, align: 'center', track: 0.10, weight: on ? 700 : 500,
             colour: on ? INK.blue : INK.pencil });
    d.region(`ctl:view:${k}`, bx2, y - 1.4, bw2, bh2, null);
  });
}

function chartColumn(d, S, top) {
  const { x, w } = COL.mid;
  if ((S.chartView || 'forecast') === 'record') return recordColumn(d, S, top);
  let y = head(d, top, 'FORECAST',
    'Capability against time. Heavy ink is the recorded past; the blue band is the spread of ' +
    'sampled futures at the tenth to ninetieth percentile, the middle half hatched closer. ' +
    'Chain-dot rules are the capability milestones.', { x, w });
  viewSwitch(d, S, x, w, top);
  // The caption opens the band's own entry: why it has this shape, and where the tracks of
  // the active path stop.
  d.region('band', x, y + 1.5, w - 62, top - 6.0 - (y + 1.5), null);

  const bx = CHART.bx, bw = CHART.bw, bh = CHART_H, by = y - bh;
  const X = CHART.x;
  const Yv = (v) => by + Math.max(0, Math.min(6.4, v)) / 6.4 * bh;

  d.rect(bx, by, bw, bh, { weight: PEN.thin, colour: INK.ink });
  // The caption under the index says a click on the chart changes the date. The frame is
  // that region, registered first so every mark on it wins the hit-test by area.
  d.region('ctl:time', bx, by, bw, bh);
  for (let yr = 2015; yr < 2100; yr += 5) {
    const major = yr % 10 === 0;
    d.line([X(yr), by], [X(yr), by + bh],
           { weight: PEN.hairline, colour: INK.pencilLight,
             dash: major ? null : [0.8, 1.6], alpha: major ? 0.45 : 0.3 });
  }
  for (let yr = 2020; yr <= 2100; yr += 20) {
    d.line([X(yr), by - 1.8], [X(yr), by], { weight: PEN.hairline, colour: INK.inkLight });
    d.text([X(yr), by - 5.0], String(yr),
           { size: 1.9, align: 'center', face: 'figure', colour: INK.inkLight });
  }
  // Lettering already on the chart, so the label allocator below can keep out of it. The
  // crisis label for the no-superintelligence window sat on GENERALLY SUPERINTELLIGENT when
  // the path reached the top rung; the allocator only knew about its own labels.
  const fixed = [];
  const fix = (x, y, str, size) => fixed.push({ x, y: y - size * 0.24, h: size * 1.28,
                                                w: d.textWidth(str, { size, track: 0.10 }) + 0.6 });
  for (let i = 1; i <= 6; i++) {
    d.line([bx, Yv(i)], [bx + bw, Yv(i)],
           { weight: PEN.thin, colour: INK.red, dash: [7, 2, 1.4, 2], alpha: 0.45 });
    const rung = (S.engine.ladder[i] || '').toUpperCase();
    d.text([bx + 1.6, Yv(i) + 1.3], rung, { size: 1.7, colour: INK.red, track: 0.10 });
    fix(bx + 1.6, Yv(i) + 1.3, rung, 1.7);
    d.text([bx - 1.8, Yv(i) - 0.8], String(i),
           { size: 1.8, align: 'right', face: 'figure', colour: INK.redLight });
    d.region(`mile:${i}`, bx, Yv(i) - 2.2, bw, 4.4, i);
  }
  const B = S.bands;
  const env = (lo, hi, spacing, fill) => {
    const pts = [];
    B.year.forEach((yr, i) => { if (yr >= S.NOW) pts.push([X(yr), Yv(B[hi][i])]); });
    for (let i = B.year.length - 1; i >= 0; i--) {
      if (B.year[i] >= S.NOW) pts.push([X(B.year[i]), Yv(B[lo][i])]);
    }
    d.fillPoly(pts, fill);
    d.hatch([X(S.NOW), by, bw - (X(S.NOW) - bx), bh],
            { spacing, angle: -Math.PI / 4, weight: PEN.hairline, colour: INK.blueLight,
              path: (dd) => {
                const ctx = dd.ctx;
                pts.forEach((pt, i) => {
                  const px = dd.x(pt[0]), py = dd.y(pt[1]);
                  if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
                });
                ctx.closePath();
              } });
  };
  env('p10', 'p90', 3.2, 'rgba(38,118,214,0.09)');
  env('p25', 'p75', 1.7, 'rgba(38,118,214,0.14)');

  const med = [];
  let diffLabel = null;
  B.year.forEach((yr, i) => { if (yr >= S.NOW) med.push([X(yr), Yv(B.p50[i])]); });
  if (S.baselineBands) {
    const G = S.baselineBands, g = [];
    let wide = 0, wideYr = null;
    G.year.forEach((yr, i) => {
      if (yr < S.NOW) return;
      g.push([X(yr), Yv(G.p50[i])]);
      const j = B.year.indexOf(yr);
      if (j >= 0 && Math.abs(B.p50[j] - G.p50[i]) > wide) {
        wide = Math.abs(B.p50[j] - G.p50[i]); wideYr = yr;
      }
    });
    if (wide > 0.05) {
      const poly = g.concat(med.slice().reverse());
      d.fillPoly(poly, 'rgba(168,116,8,0.15)');
      d.hatch([X(S.NOW), by, bw - (X(S.NOW) - bx), bh],
              { spacing: 2.0, angle: Math.PI / 2, weight: PEN.hairline, colour: INK.ochre,
                path: (dd) => {
                  const ctx = dd.ctx;
                  poly.forEach((pt, i) => {
                    const px = dd.x(pt[0]), py = dd.y(pt[1]);
                    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
                  });
                  ctx.closePath();
                } });
      const gi = G.year.indexOf(wideYr), bi = B.year.indexOf(wideYr);
      diffLabel = { yr: wideYr, my: (Yv(G.p50[gi]) + Yv(B.p50[bi])) / 2,
                    d: B.p50[bi] - G.p50[gi] };
    }
    d.polyline(g, { weight: PEN.thin, colour: INK.pencil, dash: [4, 2.4] });
  }
  d.polyline(med, { weight: PEN.outline, colour: INK.blue });
  d.polyline(S.TRUNK.map((p) => [X(p[0]), Yv(p[1])]), { weight: PEN.outline, colour: INK.ink });
  d.text([X(2013), Yv(0.75)], 'RECORDED',
         { size: 1.9, colour: INK.ink, weight: 600, track: 0.12 });
  fix(X(2013), Yv(0.75), 'RECORDED', 1.9);

  d.line([X(S.NOW), by], [X(S.NOW), by + bh + 2.0], { weight: PEN.medium, colour: INK.ink });
  d.text([X(S.NOW) + 1.4, by + bh - 3.2], 'TODAY',
         { size: 2.0, colour: INK.ink, weight: 700, track: 0.16 });
  fix(X(S.NOW) + 1.4, by + bh - 3.2, 'TODAY', 2.0);
  d.line([X(S.yr), by], [X(S.yr), by + bh], { weight: PEN.thin, colour: INK.blue });
  d.polyline([[X(S.yr), by + bh], [X(S.yr) - 2.0, by + bh + 3.0], [X(S.yr) + 2.0, by + bh + 3.0]],
             { close: true, weight: PEN.thin, colour: INK.blue, fill: INK.blue });

  // every label on the chart takes its slot from one allocator
  const placed = fixed.slice();
  const SLOTS = [10, -10, 16.5, -16.5, 23, -23, 29.5, -29.5];
  // A label is placed inside the frame on both axes: pushed above or below it lands on the
  // plate's caption, pushed past the right edge it lands in the control panel next door.
  // Every slot on the preferred side, then every slot on the other side; the first clear one
  // wins, and when none is clear the one that overlaps least. The old fallback took the
  // first in-frame slot regardless, which is how two crisis labels landed on each other
  // once the rung labels were in the allocator's way.
  const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
                            Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const place = (cx, cy, str, size) => {
    const tw = d.textWidth(str, { size }) + 1.5;
    const fitsRight = cx + 5 + tw <= bx + bw - 1;
    const sides = fitsRight ? [true, false] : [false, true];
    let best = null;
    for (const toRight of sides) {
      const x0 = toRight ? cx + 5 : cx - 5 - tw;
      if (x0 < bx + 1 || x0 + tw > bx + bw - 1) continue;
      for (const cand of SLOTS) {
        const box = { x: x0, y: cy + cand - 1.0, w: tw, h: 3.3 };
        if (box.y < by + 1 || box.y + box.h > by + bh - 1) continue;
        const cost = placed.reduce((t, q) => t + overlap(q, box), 0);
        if (!best || cost < best.cost) best = { cost, box, off: cand, right: !toRight };
        if (cost === 0) break;
      }
      if (best && best.cost === 0) break;
    }
    if (!best) {
      const x0 = fitsRight ? cx + 5 : cx - 5 - tw;
      best = { cost: 0, box: { x: x0, y: cy + SLOTS[0] - 1.0, w: tw, h: 3.3 }, off: SLOTS[0], right: !fitsRight };
    }
    placed.push(best.box);
    return { off: best.off, right: best.right };
  };
  if (diffLabel) {
    const str = `SETTINGS MOVED THIS ${diffLabel.d > 0 ? '+' : '−'}` +
                `${Math.abs(diffLabel.d).toFixed(2)} AT ${Math.floor(diffLabel.yr)}`;
    const pl = place(X(diffLabel.yr), diffLabel.my, str, 1.7);
    d.leader([X(diffLabel.yr), diffLabel.my],
             [X(diffLabel.yr) + (pl.right ? -5 : 5), diffLabel.my + pl.off], str,
             { colour: INK.ochre, size: 1.7, gap: 2.4, align: pl.right ? 'right' : 'left' });
  }
  const CRY = { 'deal-window': 2030, 'explosive-takeoff': 2028, 'no-sc-window': 2036,
                'alignment-fails': 2031, 'hard-deflate': 2028.5, 'researcher-by-2035': 2035 };
  const items = S.crisis.crises.map((c) => {
    const yr = CRY[c.id] || 2032;
    return { c, cx: X(yr), cy: Yv(S.capAt(yr)) };
  }).sort((a, b) => a.cx - b.cx);
  for (const it of items) {
    const c = it.c;
    const p = c.kind === 'axis' ? (S.marginals[c.axis] || {})[c.pos] ?? c.p : c.p;
    const str = `${(p * 100).toFixed(0)}%  ${c.q.toUpperCase()}`;
    const pl = place(it.cx, it.cy, str, 1.7);
    d.polyline([[it.cx, it.cy - 2.0], [it.cx + 2.0, it.cy], [it.cx, it.cy + 2.0],
                [it.cx - 2.0, it.cy]],
               { close: true, weight: PEN.thin, colour: INK.red, fill: PAPER });
    d.leader([it.cx, it.cy], [it.cx + (pl.right ? -5 : 5), it.cy + pl.off], str,
             { colour: INK.red, size: 1.7, gap: 2.4, align: pl.right ? 'right' : 'left' });
    d.region(`crisis:${c.id}`, it.cx - 3.2, it.cy - 3.2, 6.4, 6.4, c);
  }

  // the date index
  const sy = by - 12;
  d.line([bx, sy], [bx + bw, sy], { weight: PEN.medium, colour: INK.ink });
  for (let yr = 2015; yr <= 2100; yr += 5) {
    d.line([X(yr), sy], [X(yr), sy - (yr % 20 === 0 ? 3.0 : 1.8)],
           { weight: PEN.hairline, colour: INK.inkLight });
  }
  d.polyline([[X(S.yr), sy], [X(S.yr) - 2.2, sy + 4.0], [X(S.yr) + 2.2, sy + 4.0]],
             { close: true, weight: PEN.medium, colour: INK.blue, fill: INK.blue });
  // The year sits at the end of the index's own caption line: above the chart it ran into the
  // plate caption, and under the pointer it ran into the caption it shares the line with.
  d.text([bx, sy - 5.4], 'DRAG THE INDEX, OR CLICK THE CHART, TO CHANGE THE DATE',
         { size: 1.65, colour: INK.pencilLight, track: 0.08 });
  d.text([bx + bw, sy - 5.4], String(Math.floor(S.yr)),
         { size: 2.2, align: 'right', face: 'figure', colour: INK.blue, weight: 700 });
  d.region('ctl:time', bx - 4, sy - 3, bw + 8, 10);

  // the band below: the key, or the entry for a mark on the chart
  const bandTop = sy - 9;
  if (S.chartNote) {
    noteBlock(d, x, bandTop, w, S.chartNote, { title: S.chartNote.title });
  } else {
    const keys = [
      ['RECORDED', INK.ink, PEN.outline, null],
      ['MEDIAN OF SAMPLED FUTURES', INK.blue, PEN.outline, null],
      ['MILESTONE DATUM', INK.red, PEN.thin, [7, 2, 1.4, 2]],
      ['THE SAME FORECAST WITH EVERY VARIABLE FREE', INK.erase, PEN.thin, [4, 2.4]],
    ];
    d.rect(x, bandTop - NOTE_BAND + 4, w, NOTE_BAND - 4,
           { weight: PEN.hairline, colour: INK.inkLight });
    d.text([x + 4, bandTop - 5], 'KEY', { size: 2.1, weight: 700, track: 0.16, colour: INK.ink });
    d.text([x + w - 4, bandTop - 5], 'CLICK A MILESTONE, A CRISIS POINT, OR THE CAPTION FOR THE BAND',
           { size: 1.6, align: 'right', colour: INK.pencilLight, track: 0.08 });
    keys.forEach((it, i) => {
      const ly = bandTop - 11 - i * 4.6;
      d.line([x + 5, ly + 0.6], [x + 15, ly + 0.6], { weight: it[2], colour: it[1], dash: it[3] });
      d.text([x + 17, ly], it[0], { size: 1.75, colour: INK.pencil, track: 0.06 });
    });
  }
  return top - (bandTop - NOTE_BAND);
}

// ── the right column: the controls, one tab per variable ─────────────────────
// r5 added two axes and neither had a word here, so their tabs read as a bare letter.
// ONE LABEL PER AXIS, AND THE TABLE IS NOT DERIVED, so an axis added to the registry draws a
// tab with a blank name until its word is written here. L shipped that way on 2026-08-20.
const CTAB = { T: 'TEMPO', K: 'TAKEOFF', A: 'ALIGN', C: 'COORD', R: 'RULES',
               D: 'LABOUR', S: 'SUPPLY', P: 'PUBLIC', E: 'ECONOMY',
               L: 'CONDUCT', G: 'BENEFIT' };
const CBTN_H = 26;

// Display names for the capability domains. The engine's own `n` is drawn wherever it reads
// as a name; this overrides only where it reads as a description.
const DOMAIN_LABEL = {
  'R&D': 'Automated AI R&D',
  CODE: 'Coding & software',
  ROBOT: 'Robotics & physical work',
  POLIT: 'Persuasion & politics',
};

function controlColumn(d, S, top) {
  const { x, w } = COL.right;
  let y = top;
  d.text([x, y], 'CONTROLS', { size: 3.0, weight: 700, track: 0.16, colour: INK.ink });
  // The release command sits on the heading line, where a reader looks for it. At the foot of
  // the column it was behind every other control, including the ones it undoes.
  const RSW = 26, RSH = 6.0;
  const anySet = Object.keys(S.pin || {}).length > 0;
  button(d, x + w - RSW, y - 1.6, RSW, RSH, {
    name: 'RELEASE ALL', on: false, accent: INK.red, id: 'ctl:reset',
    dim: !anySet,
  });
  rule(d, y - 2.2, x, w - RSW - 3, { weight: PEN.thin, colour: INK.inkLight });
  y -= 6.2;
  d.textBlock([x, y], 'One tab per variable. Choosing a setting fixes that variable and ' +
    'redraws the document; the figure at the foot of a button is what the setting does to ' +
    'the quantity this variable drives, by 2040, or to the share of sampled paths past the ' +
    'research milestone by 2035, measured in the conditioning mode now in force. Choosing ' +
    'it again releases the variable.', w,
    { size: 1.7, lead: 1.38, colour: INK.pencil });
  y -= 17.4;

  // the tab strip
  const cols = 4, tw = (w - (cols - 1) * 1.6) / cols, th = 6.4;
  S.network.axes.forEach((a, i) => {
    const tx = x + (i % cols) * (tw + 1.6);
    const ty = y - Math.floor(i / cols) * (th + 1.6) - th;
    const on = S.ctlAxis === a.key;
    const set = !!S.pin[a.key];
    d.rect(tx, ty, tw, th, {
      weight: on ? PEN.medium : PEN.hairline, colour: on ? INK.blue : INK.inkLight,
      fill: on ? 'rgba(38,118,214,0.14)' : null,
    });
    // an axis with no word in CTAB takes the first word of its registry name rather than a blank
    const tab = CTAB[a.key] || String(a.name || '').split(/[ ,]/)[0].toUpperCase();
    d.text([tx + tw / 2, ty + 1.9], `${a.key} ${tab}`,
           { size: 1.75, align: 'center', track: 0.08, weight: on ? 700 : 500,
             colour: on ? INK.blue : INK.pencil });
    if (set) d.dot([tx + 1.8, ty + th - 1.6], 0.75, { colour: INK.blue });
    d.region(`ctl:axis:${a.key}`, tx, ty, tw, th, a);
  });
  y -= Math.ceil(S.network.axes.length / cols) * (th + 1.6) + 3;

  const a = S.network.axes.find((q) => q.key === S.ctlAxis) || S.network.axes[0];
  const pin = S.pin[a.key];
  const marg = S.marginals[a.key] || {};
  // r5 lengthened the axis names — "Coordination between principal states" against
  // "Coordination" — and the heading ran straight through the likeliest-position figure on
  // its right. The name takes the room the figure leaves, and says so by eliding.
  const modal = Object.entries(marg).sort((p, q) => q[1] - p[1])[0];
  const right = pin ? 'SET BY YOU'
    : modal ? `LIKELIEST ${modal[0]} ${(modal[1] * 100).toFixed(0)}%` : '';
  const rw = right ? d.textWidth(right, { size: 1.6, track: 0.08 }) + 3 : 0;
  d.text([x, y], fit(d, a.name.toUpperCase(), w - rw, { size: 2.3, weight: 700, track: 0.12 }),
         { size: 2.3, weight: 700, track: 0.12, colour: pin ? INK.blue : INK.ink });
  d.text([x + w, y], right,
         { size: 1.6, align: 'right', colour: pin ? INK.blue : INK.inkLight, track: 0.08 });
  y -= 3.4;
  y -= d.textBlock([x, y], S.plain(a.desc || ''), w,
                   { size: 1.7, lead: 1.38, colour: INK.pencil, max: 3 }) + 2.6;
  d.region(`axis:${a.key}`, x, y, w, 10, a);

  for (const p of a.positions) {
    const eff = S.effect(a.key, p[0]);
    const prior = ((S.priors[a.key] || {})[p[0]] || 0) * 100;
    const right = !pin ? `${((marg[p[0]] || 0) * 100).toFixed(0)}%`
                       : pin === p[0] ? 'SET' : `PRIOR ${prior.toFixed(0)}%`;
    const rw = d.textWidth(right, { size: 1.8, face: 'figure', weight: 700 });
    const by2 = y - CBTN_H;
    button(d, x, by2, w, CBTN_H, {
      name: p[1].split(' (')[0].toUpperCase(),
      nameW: w - 8.5 - rw,
      desc: S.plain(firstSentence(p[4])),
      on: pin === p[0], dim: !!pin && pin !== p[0],
      id: `ctl:pin:${a.key}:${p[0]}`, payload: p,
    });
    d.text([x + w - 2.6, by2 + CBTN_H - 4.2], right,
           { size: 1.8, align: 'right', face: 'figure', weight: 700,
             colour: pin === p[0] ? INK.blue : pin ? INK.pencilLight : INK.inkLight });
    d.line([x + 3.0, by2 + 4.4], [x + w - 2.6, by2 + 4.4],
           { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.7 });
    if (eff && !eff.none) {
      d.text([x + 3.4, by2 + 1.8], eff.label,
             { size: 1.45, track: 0.08, colour: INK.pencilLight });
      d.text([x + w - 2.6, by2 + 1.8], eff.text,
             { size: 1.6, align: 'right', face: 'figure', weight: 700, colour: INK.ink });
    } else if (eff !== 0) {
      // The two modes give different answers, and for alignment they differ enormously:
      // under intervention it moves nothing measurable, under observation it is one of the
      // largest controls on the sheet. A bare "no measured effect" beside a chart that
      // visibly moves is the reader's problem to resolve, so the line names the mode. An
      // axis no track reads at all says that, which is a fact about the model.
      d.text([x + 3.4, by2 + 1.8],
             eff && eff.noTrack && !S.obs ? 'NO TRACK READS THIS VARIABLE'
               : S.obs ? 'NO MEASURED EFFECT UNDER OBSERVATION'
                       : 'NO DIRECT EFFECT UNDER INTERVENTION',
             { size: 1.45, track: 0.08, colour: INK.pencilLight });
    }
    y = by2 - 2.2;
  }

  if (S.openNote) {
    y -= 2;
    noteBlock(d, x, y, w, S.openNote, { title: S.openNote.title });
    y -= S.openNote.h + 15;
  }

  // how a choice is applied
  y -= 4;
  d.text([x, y], 'CONDITIONING MODE',
         { size: 2.0, weight: 700, track: 0.12, colour: INK.ink });
  rule(d, y - 2.0, x, w, { weight: PEN.hairline, colour: INK.inkLight });
  y -= 5.4;
  d.text([x, y], 'TWO MODES · ONE IN FORCE AT A TIME',
         { size: 1.5, colour: INK.pencilLight, track: 0.10 });
  y -= 2.6;
  button(d, x, y - 17, w, 17, {
    name: 'SUPPOSE IT HAPPENS', on: !S.obs, tick: true, id: 'ctl:mode:do',
    desc: 'Fix the setting; hold every other variable at its prior weight.' });
  y -= 19;
  button(d, x, y - 17, w, 17, {
    name: 'SUPPOSE WE LEARN IT', on: S.obs, tick: true, id: 'ctl:mode:obs',
    desc: 'Fix the setting; reweight every other variable in its light.' });
  y -= 21;
  return top - y;
}

// ── the record, as its own drawing ──────────────────────────────────────────
// The same capability axis as the forecast, across 2012 to today, at a scale where the
// steps that produced the line are legible. Each step is drawn against the trunk at the
// height the index had reached when it happened, so what an event did to the line is a
// vertical distance rather than a claim.
const LANE_INK = { capability: INK.blue, buildout: INK.green,
                   capital: INK.warm, oversight: INK.red };
const LANE_NAME = { capability: 'CAPABILITY', buildout: 'BUILD-OUT & GOVERNANCE',
                    capital: 'CAPITAL', oversight: 'OVERSIGHT' };
// The record windows. Fourteen years across 152 mm puts the last eight months inside 5 mm,
// so the steps that matter most to a reader now are the ones drawn smallest. Each window
// re-scales BOTH axes: the capability range is taken from the trunk inside the window, so a
// narrow window is a magnification and not a crop.
const RWINDOWS = [
  { k: 'all', name: '2012', y0: 2012 },
  { k: 'd20', name: '2020', y0: 2020 },
  { k: 'd24', name: '2024', y0: 2024 },
  { k: 'y1', name: '12 MONTHS', y0: null, span: 1 },
];
function windowOf(S) {
  const w = RWINDOWS.find((q) => q.k === (S.recordWindow || 'all')) || RWINDOWS[0];
  const y1 = Math.ceil(S.NOW * 4) / 4;
  return { y0: w.span ? +(y1 - w.span).toFixed(2) : w.y0, y1, k: w.k };
}

function recordColumn(d, S, top) {
  const { x, w } = COL.mid;
  const win = windowOf(S);
  let y = head(d, top, 'RECORD',
    `What actually happened, ${Math.floor(win.y0)} to today, against the capability index it ` +
    'produced. Each step is drawn at the height the index had reached when it arrived, so the ' +
    'rise beside a step is what followed it. Click any step for what it established.',
    { x, w });
  viewSwitch(d, S, x, w, top);

  // the window switch, on its own line under the caption
  d.text([x, y - 0.6], 'WINDOW', { size: 1.5, track: 0.14, colour: INK.pencilLight });
  const ww = 20, wh = 5.2, wgap = 1.4;
  const wtot = RWINDOWS.length * ww + (RWINDOWS.length - 1) * wgap;
  RWINDOWS.forEach((q, i) => {
    const qx = x + w - wtot + i * (ww + wgap);
    const on = win.k === q.k;
    d.rect(qx, y - 2.6, ww, wh, {
      weight: on ? PEN.medium : PEN.hairline, colour: on ? INK.blue : INK.inkLight,
      fill: on ? 'rgba(38,118,214,0.14)' : null,
    });
    d.text([qx + ww / 2, y - 1.0], q.name,
           { size: 1.5, align: 'center', track: 0.06, weight: on ? 700 : 500,
             colour: on ? INK.blue : INK.pencil });
    d.region(`ctl:rwin:${q.k}`, qx, y - 2.6, ww, wh, null);
  });
  y -= 7.4;

  const bx = CHART.bx, bw = CHART.bw, bh = 96, by = y - bh;
  const R0 = win.y0, R1 = win.y1;
  const RX = (yy) => bx + ((yy - R0) / (R1 - R0)) * bw;
  // The capability range follows the window, so a narrow window magnifies the rise inside it
  // instead of drawing it as a flat line at the top of a fixed scale.
  let lo = Infinity, hi = -Infinity;
  for (let yy = R0; yy <= R1 + 1e-9; yy += 0.05) {
    const v = S.trunkCap(yy); if (v < lo) lo = v; if (v > hi) hi = v;
  }
  const padv = Math.max(0.08, (hi - lo) * 0.18);
  const CAP_LO = Math.max(0, lo - padv), CAP_HI = hi + padv;
  const Yv = (v) => by + (Math.max(CAP_LO, Math.min(CAP_HI, v)) - CAP_LO) /
                          (CAP_HI - CAP_LO) * bh;

  d.rect(bx, by, bw, bh, { weight: PEN.thin, colour: INK.ink });
  // The tick interval follows the window: a one-year window ruled at one year draws a single
  // line, and a fourteen-year window ruled at a month draws 168.
  const yrSpan = R1 - R0;
  const tick = yrSpan > 10 ? 1 : yrSpan > 5 ? 0.5 : yrSpan > 2 ? 0.25 : 1 / 12;
  for (let yy = Math.ceil(R0 / tick) * tick; yy <= R1 + 1e-9; yy += tick) {
    const major = Math.abs(yy - Math.round(yy)) < 1e-6;
    d.line([RX(yy), by], [RX(yy), by + bh],
           { weight: PEN.hairline, colour: INK.pencilLight,
             dash: major ? null : [0.8, 1.6], alpha: major ? 0.45 : 0.28 });
  }
  const vStep = (CAP_HI - CAP_LO) > 2 ? 0.5 : (CAP_HI - CAP_LO) > 0.8 ? 0.25 : 0.1;
  for (let v = Math.ceil(CAP_LO / vStep) * vStep; v < CAP_HI; v += vStep) {
    d.line([bx, Yv(v)], [bx + bw, Yv(v)],
           { weight: PEN.hairline, colour: INK.pencilLight, dash: [0.8, 1.6], alpha: 0.35 });
    d.text([bx - 1.6, Yv(v) - 0.8], v.toFixed(vStep < 0.25 ? 2 : 1),
           { size: 1.5, align: 'right', face: 'figure', colour: INK.pencilLight });
  }
  // the trunk: the recorded index itself
  const pts = [];
  const tstep = Math.min(0.25, (R1 - R0) / 240);
  for (let yy = R0; yy <= R1 + 1e-9; yy += tstep) pts.push([RX(yy), Yv(S.trunkCap(yy))]);
  pts.push([RX(R1), Yv(S.trunkCap(R1))]);
  d.polyline(pts, { weight: PEN.outline, colour: INK.ink });

  // the steps, each standing on the trunk at its own date
  const rec = (S.record || []).filter((e) => e.y >= R0 && e.y <= R1);
  // The label allocator has to REFUSE. Eight of the 35 steps fall inside the last eight
  // months, which is 3% of the width, and a fixed four rows drew them through each other:
  // 1,633 overlaps in one state. A step whose label has nowhere to go keeps its stem, its
  // dot and its click target, and loses only its lettering.
  const ROWS = 9;
  const rows = new Array(ROWS).fill(-1e9);
  rec.forEach((e) => {
    const ex = RX(e.y), ey = Yv(S.trunkCap(e.y));
    const c = LANE_INK[e.lane] || INK.pencil;
    const hot = Math.abs(e.y - S.yr) < 0.5;
    const idx = S.record.indexOf(e);
    const tw = d.textWidth(e.k, { size: 1.5, track: 0.04 });
    // A label with no room to its right is set to its left, or it runs out of the chart
    // and into the controls column — which is where 67 of these ended up.
    const goLeft = ex + 1.2 + tw > bx + bw;
    const x0 = goLeft ? ex - tw - 1.2 : ex + 1.2;
    const x1 = x0 + tw;
    let row = -1;
    for (let q = 0; q < ROWS; q++) if (rows[q] < x0 - 1.6) { row = q; break; }
    const ly = row >= 0 ? by + bh - 5 - row * 4.2 : ey + 3;
    d.line([ex, ey], [ex, ly - 1.4],
           { weight: PEN.hairline, colour: c, alpha: row >= 0 ? 0.55 : 0 });
    d.dot([ex, ey], hot ? 1.2 : 0.75, { colour: c });
    if (row >= 0) {
      rows[row] = x1;
      d.text([goLeft ? ex - 1.2 : ex + 1.2, ly], e.k,
             { size: 1.5, track: 0.04, weight: hot ? 700 : 400, align: goLeft ? 'right' : 'left',
               colour: hot ? c : INK.pencil, pocket: true });
    }
    d.region(`rec:${idx}`, (row >= 0 ? Math.min(ex, x0) : ex) - 2.2, Math.min(ey, ly) - 2.2,
             Math.max(4.4, row >= 0 ? tw + 4.4 : 4.4), Math.abs(ly - ey) + 5, e);
  });
  // where the index stands
  if (S.yr >= R0 && S.yr <= R1) {
    d.line([RX(S.yr), by], [RX(S.yr), by + bh], { weight: PEN.medium, colour: INK.blue });
    d.text([RX(S.yr) + 1.4, by + bh - 3.2], 'HERE',
           { size: 1.7, weight: 700, track: 0.12, colour: INK.blue, pocket: true });
  }
  d.line([RX(S.NOW), by], [RX(S.NOW), by + bh],
         { weight: PEN.thin, colour: INK.ink, dash: [2, 1.6] });

  // the date index, on the record's own scale
  const sy = by - 12;
  d.line([bx, sy], [bx + bw, sy], { weight: PEN.medium, colour: INK.ink });
  const lblStep = yrSpan > 10 ? 2 : yrSpan > 5 ? 1 : yrSpan > 2 ? 0.5 : 1 / 6;
  const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
               'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  for (let yy = Math.ceil(R0 / lblStep) * lblStep; yy <= R1 + 1e-9; yy += lblStep) {
    const whole = Math.abs(yy - Math.round(yy)) < 1e-6;
    d.line([RX(yy), sy], [RX(yy), sy - (whole ? 3.0 : 1.8)],
           { weight: PEN.hairline, colour: INK.inkLight });
    // A half-year tick lettered by rounding gave "2024 2025 2025 2026 2026 2027": two ticks
    // to a year, and a tick at mid-2026 called 2027. Under three years the fractional ticks
    // are lettered by MONTH, which is the question a reader zoomed that far in is asking;
    // above that they carry no lettering and only the whole years are named.
    const label = whole ? String(Math.round(yy))
      : yrSpan <= 3 ? MON[Math.min(11, Math.max(0, Math.floor((yy % 1) * 12)))]
      : null;
    if (label) {
      d.text([RX(yy), sy - 6.0], label,
             { size: whole ? 1.6 : 1.4, align: 'center', face: 'figure',
               colour: whole ? INK.pencil : INK.pencilLight });
    }
  }
  d.polyline([[RX(Math.min(R1, Math.max(R0, S.yr))), sy],
              [RX(Math.min(R1, Math.max(R0, S.yr))) - 2.2, sy + 4.0],
              [RX(Math.min(R1, Math.max(R0, S.yr))) + 2.2, sy + 4.0]],
             { close: true, weight: PEN.medium, colour: INK.blue, fill: INK.blue });
  d.region('ctl:time', bx - 4, sy - 3, bw + 8, 10,
           { linear: true, x0: bx, w: bw, y0: R0, y1: R1 });

  // the band: a key by lane, or the entry for a step
  const bandTop = sy - 10;
  if (S.chartNote) {
    noteBlock(d, x, bandTop, w, S.chartNote, { title: S.chartNote.title });
  } else {
    d.rect(x, bandTop - NOTE_BAND + 4, w, NOTE_BAND - 4,
           { weight: PEN.hairline, colour: INK.inkLight });
    d.text([x + 4, bandTop - 5], 'LANES', { size: 2.1, weight: 700, track: 0.16, colour: INK.ink });
    d.text([x + w - 4, bandTop - 5], `${rec.length} RECORDED STEPS · CLICK ONE FOR ITS ENTRY`,
           { size: 1.6, align: 'right', colour: INK.pencilLight, track: 0.08 });
    Object.keys(LANE_NAME).forEach((k, i) => {
      const ly = bandTop - 11 - i * 4.6;
      d.line([x + 5, ly + 0.6], [x + 13, ly + 0.6],
             { weight: PEN.outline, colour: LANE_INK[k] });
      const n = rec.filter((e) => e.lane === k).length;
      d.text([x + 15, ly], `${LANE_NAME[k]} · ${n} STEP${n === 1 ? '' : 'S'}`,
             { size: 1.75, colour: INK.pencil, track: 0.06 });
    });
  }
  return top - (bandTop - NOTE_BAND);
}

export function board(d, S, H) {
  const top = H - 8;
  const a = instrumentColumn(d, S, top);
  const b = chartColumn(d, S, top);
  const c = controlColumn(d, S, top);
  // What each column actually consumed, so board.height() can be checked against the
  // drawing instead of trusted. Estimating it left 47 mm of blank paper at the foot.
  board.measured = { left: a, mid: b, right: c, max: Math.max(a, b, c) };
  // column rules, so the three read as one drawing
  const y0 = 4, y1 = top + 5;
  for (const gx of [COL.mid.x - 2, COL.right.x - 2]) {
    d.line([gx, y0], [gx, y1], { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.55 });
  }
  return Math.max(a, b, c);
}
// Each term is calibrated against `board.measured`, which records what the three columns
// actually consumed. The previous estimate ran 39 to 61 mm over, and the board carried that
// as blank paper at its foot in every state.
board.height = (S) => {
  // The collectives instrument has two states: a one-line note below the autonomy
  // threshold, and the full ladder, clock scale and product above it — 54 mm more. The
  // left column declares the taller one, because a column that fits only its short
  // state draws its tall state past the board, which is where 14 marks went.
  const left = 198.8 + S.engine.domains.length * 7.2;
  const mid = (S.chartView === 'record' ? 96 + 124 : CHART_H + 76.2) +
              (S.chartNote ? S.chartNote.h + 12 : 0);
  const n = (S.network.axes.find((q) => q.key === S.ctlAxis) || S.network.axes[0])
    .positions.length;
  // The tab strip wraps at four to a row, and r5 took the axis count from seven to nine,
  // so it grew from two rows to three. That row was folded into the constant when there
  // were only ever two of them, and the column then drew 2 mm past the board.
  const right = 89 + Math.ceil(S.network.axes.length / 4) * 8 +
                n * (CBTN_H + 2.2) + (S.openNote ? S.openNote.h + 19 : 0);
  return Math.max(left, mid, right) + 6;
};

// ── 3 · the passage, across the head of the sheet ───────────────────────────
function drawNote(d, x, y, w, note) {
  const top = y + NOTE.above;
  d.rect(x, top - note.h, w, note.h, { weight: PEN.thin, colour: INK.red, alpha: 0.6 });
  let ty = top - NOTE.pad - NOTE.title;
  for (const ln of note.title) {
    d.text([x + NOTE.pad, ty], ln, { size: NOTE.title, weight: 700, track: 0.16, colour: INK.red });
    ty -= NOTE.title * HEAD_LEAD;
  }
  ty -= NOTE.gap;
  for (const ls of note.paras) {
    for (const ln of ls) {
      d.text([x + NOTE.pad, ty], ln, { size: NOTE.size, colour: INK.pencil, track: 0.06 });
      ty -= NOTE.size * NOTE.lead;
    }
    ty -= NOTE.gap;
  }
}
export function readout(d, S, H) {
  let y = H - 8;
  d.textBlock([PAD, y], S.headline, CW,
              { size: 3.2, lead: 1.28, colour: INK.blue, weight: 600 });
  y -= d.wrap(S.headline, CW, { size: 3.2, weight: 600 }).length * 3.2 * 1.28 + 3.2;
  rule(d, y + 1.6, PAD, CW, { weight: PEN.thin, colour: INK.blue });
  // The key to the marks is on the document, under the rule the marks hang from. The record
  // carries no marks: its lines are the record's own and open nothing.
  if (!S.isRecord) {
    d.text([PAD, y - 1.2], PROV_KEY, { size: 1.45, colour: INK.pencilLight, track: 0.10 });
  }
  y -= KEY_H;
  S.prose.cols.forEach((col, ci) => {
    let cy = y;
    const cx = PAD + ci * (PROSE_COL + 10);
    col.forEach((b, bi) => {
      if (bi && b.first) cy -= PROSE_SP.para;
      const { rows } = blockRows(d, b, PROSE_COL, 2.0, bi === 0);
      for (const r of rows) {
        if (r.note) { drawNote(d, cx + IND, cy, PROSE_COL - IND, r.note); cy -= r.h; continue; }
        if (r.head === 2) {
          cy -= PROSE_SP.subOver;
          cy -= d.textBlock([cx + IND, cy], r.t, PROSE_COL - IND,
                            { size: SUB_SIZE, lead: HEAD_LEAD, weight: 700, track: 0.16,
                              colour: INK.pencilLight });
          cy -= PROSE_SP.subUnder;
        } else if (r.head) {
          // A SUBHEADING HAS TO LOOK LIKE ONE. Bold body type at body size read as another
          // sentence; this is smaller, letter-spaced, in full ink, over a hairline, which is
          // the same treatment every other heading on the sheet gets. A continued heading is
          // the same heading in pencil.
          cy -= d.textBlock([cx, cy], r.t, PROSE_COL,
                            { size: HEAD_SIZE, lead: HEAD_LEAD, weight: 700,
                              track: 0.16, colour: r.cont ? INK.pencil : INK.ink });
          d.line([cx, cy + 1.0], [cx + PROSE_COL, cy + 1.0],
                 { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.8 });
          cy -= PROSE_SP.headUnder;
        } else {
          // the mark hangs in the margin; the line is a region a reader can open
          d.text([cx + 0.2, cy], r.mark, { size: 2.0, track: 0, colour: INK.pencilLight });
          const h = d.textBlock([cx + IND, cy], r.t, PROSE_COL - IND,
                                { size: 2.0, lead: PROSE_SP.lead, colour: INK.pencil });
          if (r.key) d.region(`prov:${r.key}`, cx, cy - h + 0.5, PROSE_COL, h + 1.0, r.item);
          cy -= h + PROSE_SP.bullet;  // air between lines, so they read as separate claims
        }
      }
    });
  });
  for (let i = 1; i < PROSE_N; i++) {
    const gx = PAD + i * (PROSE_COL + 10) - 5;
    d.line([gx, 4], [gx, y - 1], { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.45 });
  }
  return H;
}
// THE PASSAGE MUST NOT MOVE THE DOCUMENT WHEN THE DATE MOVES. Its height is a function of
// how much text this year happens to produce, so dragging the index re-laid out every section
// below it and the chart walked under the cursor. The section now reserves the tallest height
// it takes across the whole run and holds it, so the text grows and shrinks inside a fixed
// frame. The reserve is measured, not guessed: `readout.reserve` is the running maximum, and
// it only ever grows within a session.
readout.reserve = 0;
readout.height = (S) => {
  const want = 22 + KEY_H + (S.headlineH || 12) + S.prose.h;
  if (want > readout.reserve) readout.reserve = want;
  return readout.reserve;
};

// The annunciation a recorder carries past its track's cap: the year the track stopped, or the
// year compute passed the whole of world generating capacity.
export function capFlag(S, key) {
  const c = (S.caps || {})[key];
  if (!c) return null;
  if (c.ceiling) return { since: c.ceiling, word: 'CEILING' };
  // employment and approval settle to an equilibrium; the others stop at a ceiling
  if (c.since != null) return { since: c.since, word: (key === 'jobs' || key === 'appr') ? 'SETTLED' : 'CAP' };
  return null;
}
const capTag = (S, key) => {
  const f = capFlag(S, key);
  return f && S.yr >= f.since ? ` · ${f.word} ${f.since}` : '';
};
function behaviourPanels(S) {
  const tr = S.tracks;
  return [
    { d: tr.gw, label: 'COMPUTE', unit: 'GW', c: INK.warm, id: 'trk:gw',
      fmt: (v) => fmtNum(v),
      note: 'Modelled global AI capacity. Growth is set by the supply variable and damped by ' +
            'the economy variable.' },
    { d: tr.rev, label: 'REVENUE', unit: '$TN/YR', c: INK.blue, id: 'trk:rev',
      fmt: (v) => v.toFixed(1),
      note: 'Run-rate revenue grown by diffusion and capability, saturating against world ' +
            'output.' },
    { d: tr.jobs, label: 'EMPLOYMENT', unit: '% CUM.', c: INK.red, id: 'trk:jobs',
      fmt: (v) => v.toFixed(0),
      note: 'Cumulative employment effect. The shock rate follows the published crisis path.' },
    { d: tr.laws, label: 'MEASURES', unit: 'COUNT', c: INK.green, id: 'trk:laws',
      fmt: (v) => fmtNum(v),
      note: 'Tracked statutes and regulations. The fragmented-blocs setting legislates ' +
            'fastest.' },
    { d: tr.appr, label: 'APPROVAL', unit: '%', c: INK.ochre, id: 'trk:appr',
      fmt: (v) => v.toFixed(0),
      note: 'Approval under the public-response setting, depressed by displacement and ' +
            'steadied by a durable agreement.' },
    { d: tr.co2, label: 'EMISSIONS', unit: 'MT/YR', c: INK.pencil, id: 'trk:co2',
      fmt: (v) => fmtNum(v),
      note: 'Load times grid intensity, which falls faster where the build-out is ' +
            'coordinated or diversified.' },
  ].map((p) => {
    const k = p.id.slice(4);
    const tb = S.trackBands && S.trackBands[k];
    return { ...p, cap: capFlag(S, k), band: tb ? { lo: tb.p10, hi: tb.p90 } : null };
  });
}
const panelRange = (p) => {
  const vals = p.d.concat(p.band ? p.band.lo.concat(p.band.hi) : []);
  return [Math.min(...vals), Math.max(...vals)];
};

// ── 4 · instruments ──────────────────────────────────────────────────────────
export function details(d, S, H) {
  const y = head(d, H - 8, 'INSTRUMENTS',
    'Three readings of the active world-line at the date on the index, each built as an ' +
    'instrument: a needle against an engraved face, floats riding in a manifold, and a lamp ' +
    'panel with its domain lettered beside it.');
  dateStrip(d, PAD + 44, y - 4, CW - 44, S);
  const colW = (CW - 16) / 3;
  const tops = y - 18;

  d.text([PAD, tops], 'A   CAPABILITY TEMPO',
         { size: 2.8, weight: 700, track: 0.14, colour: INK.ink });
  d.textBlock([PAD, tops - 3.6], 'One face per setting. ' + (S.lookbackDays
    ? `The pale needle stands where the reading stood ${S.lookbackDays} ` +
      `day${S.lookbackDays === 1 ? '' : 's'} ago, on ${S.spaceSince}, when the position ` +
      'space last changed, so the movement is an angle and a rebuild never reads as one.'
    : 'A single needle: this setting holds one reading, so there is no gap to draw.'), colW,
    { size: 1.8, lead: 1.4, colour: INK.pencil });
  const T = S.network.axes.find((a) => a.key === 'T');
  const m = S.marginals.T || {}, was = S.marginals30.T || {};
  T.positions.forEach((p, i) => {
    dial(d, PAD + 13 + (i % 2) * 32, tops - 26 - Math.floor(i / 2) * 34, 10.5, {
      label: p[0] + ' · ' + p[1].split(' (')[0].toUpperCase(), labelW: 30,
      value: m[p[0]] || 0, was: was[p[0]] ?? null, id: `pos:T:${p[0]}`, colour: INK.blue,
    });
  });

  const bx = PAD + colW + 8;
  d.text([bx, tops], 'B   COMPUTE SHARES',
         { size: 2.8, weight: 700, track: 0.14, colour: INK.ink });
  d.textBlock([bx, tops - 3.6], 'Floats riding in tubes against one scale: each region\'s ' +
    'share of modelled global AI compute on this line, at this date.', colW,
    { size: 1.8, lead: 1.4, colour: INK.pencil });
  const tr = S.tracks, i0 = S.idx;
  manifold(d, bx + 8, tops - 46, colW - 16, 30, [
    { k: 'US', v: tr.us[i0], c: INK.blue, wash: INK.blueWash },
    { k: 'CN', v: tr.cn[i0], c: INK.red, wash: 'rgba(150,44,38,0.20)' },
    { k: 'EU', v: tr.eu[i0], c: INK.green, wash: INK.greenWash },
    { k: 'ROW', v: Math.max(0, 1 - tr.us[i0] - tr.cn[i0] - tr.eu[i0]),
      c: INK.pencil, wash: 'rgba(52,50,48,0.16)' },
  ], { id: 'manifold' });
  d.text([bx, tops - 60], `TOTAL ${fmtNum(tr.gw[i0])} GW · ${fmtNum(tr.twh[i0])} TWH/YR${capTag(S, 'gw')}`,
         { size: 2.1, face: 'figure', colour: INK.warm, weight: 700 });
  d.textBlock([bx, tops - 64], 'The total is the modelled build-out on this line. The energy ' +
    'figure is that capacity run at the utilisation the parent model assumes.', colW,
    { size: 1.75, lead: 1.4, colour: INK.pencilLight });

  const cx = PAD + (colW + 8) * 2;
  d.text([cx, tops], 'C   CAPABILITY DOMAINS',
         { size: 2.8, weight: 700, track: 0.14, colour: INK.ink });
  d.textBlock([cx, tops - 3.6], 'A lamp trips when the active line crosses that domain\'s ' +
    'threshold on the ladder. The year given is when this line crosses it.', colW,
    { size: 1.8, lead: 1.4, colour: INK.pencil });
  let dy = tops - 10;
  S.engine.domains.forEach((dm, i) => {
    const on = S.cap >= dm.th;
    const yr = S.crossYear(dm.th);
    d.rect(cx, dy - 8.6, colW, 8.2, {
      weight: on ? PEN.thin : PEN.hairline, colour: on ? INK.ink : INK.inkLight,
      fill: on ? 'rgba(178,86,24,0.14)' : null, solid: on, label: 'lamp',
    });
    d.dot([cx + 3.0, dy - 4.4], 1.3, { colour: on ? INK.warm : INK.inkLight, hollow: !on });
    d.text([cx + 6.0, dy - 3.4], dm.k,
           { size: 1.9, weight: 700, track: 0.12, pocket: true,
             colour: on ? INK.ink : INK.pencilLight });
    d.text([cx + 6.0, dy - 6.6], dm.n.toUpperCase(),
           { size: 1.5, track: 0.06, pocket: true,
             colour: on ? INK.pencil : INK.pencilLight });
    d.text([cx + colW - 2.4, dy - 3.4], on ? String(yr || '—') : 'THRESHOLD ' + dm.th.toFixed(1),
           { size: 1.7, align: 'right', face: 'figure', pocket: true,
             colour: on ? INK.warm : INK.pencilLight });
    d.region(`dom:${i}`, cx, dy - 8.6, colW, 8.2, dm);
    dy -= 9.4;
  });
  collectives(d, cx, dy - 4.0, colW, {
    n: tr.copies[i0], speed: tr.speed[i0], id: 'tally',
    prev: tr.copies[Math.max(0, i0 - 5)],
    cap: (() => { const f = capFlag(S, 'copies'); return f && S.yr >= f.since ? f : null; })(),
  });
  if (S.plateNote) noteBlock(d, PAD, 44, CW, S.plateNote, { title: S.plateNote.title });
  return H;
}
details.height = (S) => 48 + Math.max(126, S.engine.domains.length * 9.4 + 56) +
  (S.plateNote ? S.plateNote.h + 22 : 0);

// ── 5 · behaviour over time ──────────────────────────────────────────────────
export function behaviour(d, S, H) {
  const y = head(d, H - 8, 'BEHAVIOUR OVER TIME',
    'Six quantities on the active world-line, 2026 to 2100. Each pen sits at the date on the ' +
    'index and its reading is printed beside it; the blue band is the tenth to ninetieth ' +
    'percentile of the sampled futures. Every chart derives its scale from its own series and ' +
    'its band, so the shapes stay comparable across settings while the magnitudes differ.');
  dateStrip(d, PAD + 44, y - 4, CW - 44, S);
  const tr = S.tracks, yrs = tr.year;
  const foot = S.plateNote ? S.plateNote.h + 26 : 12;
  const cw = (CW - 24) / 3, ch = (y - 14 - foot - 10) / 2 - 12;
  const panels = behaviourPanels(S);
  panels.forEach((p, i) => {
    const px = PAD + (i % 3) * (cw + 12);
    const py = foot + 10 + (1 - Math.floor(i / 3)) * (ch + 24);
    const [lo, hi] = panelRange(p);
    const pad = (hi - lo) * 0.08 || 1;
    strip(d, px + 10, py + 15, cw - 12, ch - 15, {
      data: p.d, years: yrs, y0: lo - pad, y1: hi + pad, colour: p.c,
      label: p.label, unit: p.unit, now: Math.max(S.engine.y0, S.yr), id: p.id, fmt: p.fmt,
      cap: p.cap, band: p.band,
    });
    d.text([px + 10, py + 11.4], String(yrs[0]),
           { size: 1.6, colour: INK.pencilLight, face: 'figure' });
    d.text([px + cw - 2, py + 11.4], String(yrs[yrs.length - 1]),
           { size: 1.6, align: 'right', colour: INK.pencilLight, face: 'figure' });
    const span = yrs[yrs.length - 1] - yrs[0];
    const t = (Math.max(yrs[0], S.yr) - yrs[0]) / span;
    if (t > 0.14 && t < 0.86) {
      d.text([px + 10 + (cw - 12) * t, py + 11.4], String(Math.floor(S.yr)),
             { size: 1.6, align: 'center', colour: INK.blue, face: 'figure', weight: 700 });
    }
    d.textBlock([px + 10, py + 7.6], p.note, cw - 12,
                { size: 1.7, lead: 1.38, colour: INK.pencilLight, max: 2 });
  });
  if (S.plateNote) noteBlock(d, PAD, S.plateNote.h + 15, CW, S.plateNote,
                             { title: S.plateNote.title });
  return H;
}
behaviour.height = (S) => 250 + (S.plateNote ? S.plateNote.h + 26 : 0);

// ── 6 · world ────────────────────────────────────────────────────────────────
export function world(d, S, H) {
  const y = head(d, H - 8, 'WORLD',
    'The active world-line on the ground. Hatch density carries each region\'s share of ' +
    'modelled compute; the warm marks are sites drawn at the capacity this line gives them at ' +
    'this date. Site positions come from the record; the capacities are modelled.');
  dateStrip(d, PAD + 44, y - 4, CW - 44, S);
  const foot = S.plateNote ? S.plateNote.h + 24 : 16;
  S.drawWorld(d, S, [PAD, foot, CW, y - 16 - foot - 6]);
  if (S.plateNote) noteBlock(d, PAD, S.plateNote.h + 13, CW, S.plateNote,
                             { title: S.plateNote.title });
  return H;
}
world.height = (S) => 214 + (S.plateNote ? S.plateNote.h + 24 : 0);

// ── 7 · alternatives ─────────────────────────────────────────────────────────
export function alternatives(d, S, H) {
  const y = head(d, H - 8, 'BRANCHES FROM THE DRAWN PATH',
    'Twelve branches: on each, one variable takes another of its settings and the ledger of ' +
    'dated events changes most. The caption says what changes and when against the drawn ' +
    'path, in blue over the drawn path in pencil; the weight is the share of sampled futures ' +
    'holding that setting. Pressing a branch makes it the active line through the whole ' +
    'document, and pressing it again releases it.');
  const foot = S.plateNote ? S.plateNote.h + 22 : 14;
  S.drawBranches(d, S, [PAD, foot, CW, y - foot - 6]);
  if (S.plateNote) noteBlock(d, PAD, S.plateNote.h + 11, CW, S.plateNote,
                             { title: S.plateNote.title });
  return H;
}
alternatives.height = (S) => 204 + (S.plateNote ? S.plateNote.h + 22 : 0);

// ── 8 · this morning ─────────────────────────────────────────────────────────
export function morning(d, S, H) {
  // Two dates run through this plate and they are not the same date: when the engine applied
  // the evidence, and when the development it read actually happened. On a busy morning every
  // row shares the first and spreads over a week of the second, so the caption has to say
  // which one the ring follows, and the plate has to letter it.
  const dl = S.delta || {};
  const nToday = (dl.entries || []).filter((e) => e.date === dl.date).length;
  const y = head(d, H - 8, "THIS MORNING'S REVISION",
    'What the evidence moved on the network today, with the arithmetic that moved it: impact ' +
    'class, corroborating sources, novelty decay, the positions changed, and the development ' +
    'that drove them with the date it happened. ' +
    (nToday ? 'Every application here was applied this morning, to developments spanning ' +
              'several days. ' : 'This morning applied nothing, so the plate carries the ' +
              'latest applications on record. ') +
    'The row whose development is the most recent is ringed in a revision cloud.');
  const foot = S.plateNote ? S.plateNote.h + 22 : 14;
  S.drawMorning(d, S, [PAD, foot, CW, y - foot - 6]);
  if (S.plateNote) noteBlock(d, PAD, S.plateNote.h + 11, CW, S.plateNote,
                             { title: S.plateNote.title });
  return H;
}
// The plate held three rows whatever the morning brought. Six applications arrived on
// 2026-08-15 and half the day's work sat below the fold — the plate said so, but a reader who
// wants today's revision should not have to take the count on trust. The sheet grows with the
// day, to a cap: past MORN_MAX the fold note carries the remainder rather than the plate
// running the length of the tab.
const MORN_MAX = 8;
morning.rowsToday = (S) => {
  const dl = S.delta || {};
  const n = (dl.entries || []).filter((e) => e.date === dl.date).length;
  return Math.max(1, Math.min(n || 1, MORN_MAX));
};
morning.height = (S) => 190 + Math.max(0, morning.rowsToday(S) - 3) * 29 +
                        (S.plateNote ? S.plateNote.h + 22 : 0);


// ── 10 · research ────────────────────────────────────────────────────────────
// The evidence programme, on the sheet. A forecast whose priors rest on one citation each
// should say so where a reader can see it, beside the number that rests on them.
export function research(d, S, H) {
  let y = head(d, H - 8, 'EVIDENCE PROGRAMME',
    'A dossier stands behind each of the seven variables the registry carried at r4, each ' +
    'answering the same five questions from sources about the world: a base rate, a ' +
    'mechanism and its weakest step, the 2026 record, resolution criteria, and what would ' +
    'move the number. On 13 August 2026 the findings were applied to the forecast engine ' +
    'itself, as registry revision r3. What follows is the record of what moved. The ' +
    'rebuilds of 17 and 18 August added takeoff shape and regulatory architecture, which ' +
    'the programme reaches next. The full dossiers are in the repository under Research/.');

  // the audit that opened it
  d.rect(PAD, y - 26, CW, 26, { weight: PEN.thin, colour: INK.red, alpha: 0.6 });
  d.text([PAD + 4, y - 5.4], 'GROUNDING AUDIT',
         { size: 2.4, weight: 700, track: 0.16, colour: INK.red });
  d.textBlock([PAD + 4, y - 10], 'The engine is grounded in 1,330 wiki pages — but that ' +
    'number describes the corpus. The priors themselves rested on 55 citations from 31 ' +
    'sources, with 21 of the 26 positions in the r4 registry carrying one citation or none, ' +
    'and 19 of those 55 ' +
    'pointing at four scenario documents. A prior derived mainly from another forecast ' +
    'inherits its errors without inheriting its reasoning.', CW - 8,
    { size: 2.0, lead: LEAD, colour: INK.pencil });
  y -= 32;

  // ── the source register, which answers the audit ──────────────────────────
  // The pass measured the registry as it stood at r4. The parent has rebuilt twice since, to
  // nine axes and 49 positions, so the block states the set it covered and the set that
  // exists now. A present-tense 'every position' inherits whatever set the registry later
  // holds; a dated count of what was measured does not. The box takes its height from its own
  // wrap, because a constant sized to the old sentence would run the new one off its foot.
  // A COUNT IS DERIVED, NEVER TYPED. This sentence has gone stale three times — at r5, at r6 and
  // at r7 — because the register's own figure was written out by hand beside a registry that
  // kept growing. The covered set is dated and fixed; everything about the CURRENT registry is
  // read from what the parent emitted.
  const REG_COVERED = 26;
  const nowPos = S.network.axes.reduce((n, a) => n + a.positions.length, 0);
  const nowAx = S.network.axes.length;
  const regBody = 'The pass of 17 August 2026 put at least one source about the world behind ' +
    `each of the ${REG_COVERED} positions the registry then held — a measurement, a statute, ` +
    'a filing, a poll or market data, independent of any scenario document. Thirteen had ' +
    'rested wholly on a scenario document: T1, T2, T4, A1, A2, A4, C2, C3, C5, D1, D3, P3 and ' +
    'E4, under the meanings those letters carried at r4. Thirty-one independent world-sources ' +
    `stand behind that set. The registry now holds ${nowPos} positions across ${nowAx} axes, ` +
    `so the register reaches ${REG_COVERED} of them and stands clear of ` +
    `${nowPos - REG_COVERED}, among them every position on the axes added since. The register ` +
    'is in the repository at Research/findings/source-register.md.';
  const regH = 12 + d.wrap(regBody, CW - 8, { size: 2.0, track: 0.06, weight: 400 })
                     .length * 2.0 * LEAD;
  d.rect(PAD, y - regH, CW, regH, { weight: PEN.thin, colour: INK.green, alpha: 0.6 });
  d.text([PAD + 4, y - 5.4], 'SOURCE REGISTER',
         { size: 2.4, weight: 700, track: 0.16, colour: INK.green });
  d.text([PAD + CW - 4, y - 5.4], '26 POSITIONS OF REGISTRY r4 · 17 AUGUST 2026',
         { size: 1.8, align: 'right', track: 0.14, colour: INK.inkLight });
  d.textBlock([PAD + 4, y - 10], regBody, CW - 8,
    { size: 2.0, lead: LEAD, colour: INK.pencil });
  y -= regH + 6;

  // The register's calibration finding, and what happened to it.
  d.rect(PAD, y - 34, CW, 34, { weight: PEN.thin, colour: INK.blue, alpha: 0.6 });
  d.text([PAD + 4, y - 5.4], 'CALIBRATION FINDING, APPLIED',
         { size: 2.4, weight: 700, track: 0.16, colour: INK.blue });
  d.text([PAD + CW - 4, y - 5.4], 'REGISTRY r4 · 17 AUGUST 2026',
         { size: 1.8, align: 'right', track: 0.14, colour: INK.inkLight });
  d.textBlock([PAD + 4, y - 10], "The tempo priors quoted METR's task-completion horizon as a " +
    '212-day doubling, which is the 2019 to 2025 average. The 2024 to 2025 window doubles in ' +
    'about four months, and the horizon has run from four seconds in 2019 to more than sixteen ' +
    'hours in 2026. The larger error was in the slow figure itself: from sixteen hours at ' +
    'mid-2026, month-long work is 3.32 doublings at half reliability and 5.64 at the ' +
    "four-fifths bar, since METR's stricter horizon runs about five times shorter in task " +
    'length. That puts a superhuman coder at 2029.8 on the seven-month rate and 2028.4 on the ' +
    'four-month rate. Both land in FAST (2029-31); neither reaches GRADUAL (2032-36), which ' +
    'held the mode at 0.41 against fast at 0.29. Applied to the engine as r4 on August\u2019s ' +
    'instruction: T1 to 0.11, T2 to 0.42 and now modal, T3 to 0.30, T4 to 0.17. Gradual and ' +
    'continuous-normal stay substantial because a 5.64-doubling extrapolation breaks easily, ' +
    "because METR's own caution is that one year is a weak estimate, and because the " +
    'continuous-normal mechanism is structural and untested by a horizon trend.', CW - 8,
    { size: 2.0, lead: LEAD, colour: INK.pencil });
  y -= 40;

  // recommendations, per axis
  d.text([PAD, y], 'PRIOR REVISIONS',
         { size: 2.6, weight: 700, track: 0.14, colour: INK.ink });
  d.text([PAD + CW, y], 'r4 NAMES · APPLIED 13 AUG (r3) AND 17 AUG (r4)',
         { size: 1.8, align: 'right', track: 0.14, colour: INK.inkLight });
  rule(d, y - 2.2, PAD, CW, { weight: PEN.thin, colour: INK.inkLight });
  y -= 6.4;
  y -= d.textBlock([PAD, y], 'Each row carries the name its figure was researched under at ' +
    'registry r4 and, after the arrow, the live position it keys to by meaning. The rebuild ' +
    'of 17 August 2026 kept the letters and moved their meanings, so the letter on a control ' +
    'is not the letter on a row. Three figures, whose subject the rebuild split, are ' +
    'withdrawn and key to nothing. The figures themselves remain r4 figures; the ' +
    'destinations are declared in the coverage file and checked against the registry at ' +
    'every build.', CW,
    { size: 1.8, lead: LEAD, colour: INK.pencil }) + 3.0;
  // Split the axes into two columns FIRST, then draw each independently. Flowing them with a
  // shared cursor and a switch mid-loop redrew every axis in the second column at the same y.
  const colW = (CW - 12) / 2;
  const blocks = S.network.axes.map((a) => ({
    a, recs: a.positions.map((p) => [p, S.recommend(a.key, p[0])]).filter((r) => r[1]),
  })).filter((b) => b.recs.length);
  const hOf = (b) => 3.6 + b.recs.length * 3.4 + 2.6;
  const total = blocks.reduce((t, b) => t + hOf(b), 0);
  let run = 0, cut = blocks.length;
  for (let i = 0; i < blocks.length; i++) {
    if (run + hOf(blocks[i]) / 2 > total / 2) { cut = i; break; }
    run += hOf(blocks[i]);
  }
  cut = Math.max(1, Math.min(blocks.length - 1, cut));
  const cols = [blocks.slice(0, cut), blocks.slice(cut)];
  let deepest = y;
  cols.forEach((column, ci) => {
    const x = PAD + ci * (colW + 12);
    let cy = y;
    for (const { a, recs } of column) {
      d.text([x, cy], `${a.key} · ${a.name.toUpperCase()}`,
             { size: 2.1, weight: 700, track: 0.12, colour: INK.ink });
      cy -= 3.6;
      for (const [p, r] of recs) {
        const up = r.to > r.from;
        // The name the figure was researched under, never the live name of the letter: the
        // letters were re-assigned at r5 and the live name beside an r4 figure misattributed
        // thirteen of these rows (review of 2026-09-01, defect 5).
        const nm = (r.name || p[1].split(' (')[0]).toUpperCase();
        const dest = r.withdrawn ? '· WITHDRAWN' : r.dest ? `→ ${r.dest}${r.destName ? ' ' + r.destName.split(' (')[0].toUpperCase() : ''}` : '';
        d.text([x, cy], fit(d, `${nm} ${dest}`.trim(), colW - 33, { size: 1.85, track: 0.04 }),
               { size: 1.85, colour: r.withdrawn ? INK.pencilLight : INK.pencil, track: 0.04 });
        d.text([x + colW - 30, cy], r.from.toFixed(3),
               { size: 1.85, align: 'right', face: 'figure', colour: INK.pencilLight });
        d.polyline([[x + colW - 27, cy + 0.6], [x + colW - 22, cy + 0.6]],
                   { weight: PEN.hairline, colour: INK.inkLight });
        d.text([x + colW - 12, cy], r.to.toFixed(3),
               { size: 1.95, align: 'right', face: 'figure', weight: 700,
                 colour: Math.abs(r.to - r.from) >= 0.05 ? INK.red : INK.ink });
        d.text([x + colW, cy], up ? '▲' : '▼',
               { size: 1.7, align: 'right', colour: up ? INK.green : INK.redLight });
        cy -= 3.4;
      }
      cy -= 2.6;
    }
    if (cy < deepest) deepest = cy;
  });
  const bodyBottom = deepest;

  // the structural findings
  const gy = bodyBottom - 6;
  d.text([PAD, gy], 'STRUCTURAL DEFECTS',
         { size: 2.6, weight: 700, track: 0.14, colour: INK.ink });
  rule(d, gy - 2.2, PAD, CW, { weight: PEN.thin, colour: INK.inkLight });
  const gcol = (CW - 12) / 2;
  // Both findings were measured against the r3 network, and the parent has rebuilt twice
  // since. The right-hand block asserted four missing edges by name; the network now carries
  // all four, so it derives the shape from what the parent emits and states the r3 reading as
  // the dated finding it is. A sentence that counts a network cannot be a literal.
  const cond = S.network.conditionals || {};
  const axKeys = S.network.axes.map((a) => a.key);
  const parentsOf = (k) => [...new Set(Object.keys(cond[k] || {}).map((q) => q[0]))];
  const orphans = axKeys.filter((k) => parentsOf(k).length === 0);
  const unlinked = [];
  axKeys.forEach((x, i) => axKeys.slice(i + 1).forEach((y) => {
    if (!parentsOf(y).includes(x) && !parentsOf(x).includes(y)) unlinked.push(x + '\u2013' + y);
  }));
  d.textBlock([PAD, gy - 6.4], 'The r3 network mixed how big an effect is with where it lands ' +
    'on three axes, so a state that is sharp and narrow could not be said: compute siting ' +
    'diversifying while chip supply concentrates; entry-level hiring collapsing while ' +
    'aggregate employment is flat; a public united against its own government. Each is what ' +
    'the 2026 record shows, and the model rounds to whichever half is louder, then propagates ' +
    'the rounded state. ' + S.network.version.split('-')[0] + ' rebuilt each of them, and ' +
    'the programme re-reads the finding against the new positions.', gcol,
    { size: 2.0, lead: LEAD, colour: INK.pencil });
  d.textBlock([PAD + gcol + 12, gy - 6.4],
    (orphans.length
      ? orphans.length + ' of the ' + axKeys.length + ' variables carry no parent: ' +
        orphans.join(', ') + '. '
      : 'Each of the ' + axKeys.length + ' variables carries at least one parent. ') +
    'The r3 network left capability tempo and diffusion with none, and the programme named ' +
    'four edges it wanted: tempo on supply, diffusion on tempo, diffusion on the economy, and ' +
    'public response on coordination. ' + S.network.version.split('-')[0] + ' carries all ' +
    'four. ' + (unlinked.length
      ? 'The ' + unlinked.length + ' axis pairs that pass no edge either way are ' +
        unlinked.join(', ') + '.'
      : 'Every axis pair passes an edge one way or the other.'), gcol,
    { size: 2.0, lead: LEAD, colour: INK.pencil });

  // the sized edges
  const ey = gy - 26;
  d.text([PAD, ey], 'SAMPLER DEFECT',
         { size: 2.6, weight: 700, track: 0.14, colour: INK.red });
  rule(d, ey - 2.2, PAD, CW, { weight: PEN.thin, colour: INK.red });
  d.textBlock([PAD, ey - 6.4], 'Sizing the missing edges found a defect in the engine that ' +
    'had been there since the first version. Conditional tilts were applied in one pass over ' +
    'the axis order, so a tilt whose parent came later could never fire, and three of the ' +
    'fourteen relationships this model claims to represent had never once acted: compute ' +
    'supply given a capital collapse, given a demand crisis, and public response given a ' +
    'demand crisis. Nothing raised an error, because a dropped edge looks exactly like a ' +
    'condition that happened not to apply. Measured before the fix: pinning the capital ' +
    'collapse moved constrained supply by four thousandths against a declared 1.6 times, ' +
    'while a forward edge moved its target from 0.32 to 0.58 as declared. The sampler now ' +
    're-draws every variable against all the others, so direction no longer depends on the ' +
    'order the variables happen to be listed in.', CW,
    { size: 2.0, lead: LEAD, colour: INK.pencil });
  const ey2 = ey - 26;
  d.text([PAD, ey2], 'CONDITIONAL EDGES',
         { size: 2.6, weight: 700, track: 0.14, colour: INK.ink });
  rule(d, ey2 - 2.2, PAD, CW, { weight: PEN.thin, colour: INK.inkLight });
  const ew = (CW - 24) / 3;
  const eyB = ey2;
  const edges = [
    ['CAPABILITY GIVEN SUPPLY', INK.blue,
     'Effective compute grows about twelvefold a year: fourfold from hardware, the rest from ' +
     'algorithms doing the same work on a third less. Cap the hardware under a constrained ' +
     'build-out and the rate falls to about 60% of baseline, which stretches the capability ' +
     'doubling from 212 days to about 350 and moves month-long autonomous work from 2030 out ' +
     'to the mid-2030s.'],
    ['DIFFUSION GIVEN THE ECONOMY', INK.red,
     'Across three recessions in thirty years, 88% of American job losses in routine ' +
     'occupations fell inside a twelve-month window around the downturn, and those jobs never ' +
     'came back. Firms defer the reorganisation while demand holds and carry it out when ' +
     'demand falls. The model carries this arrow only in the other direction.'],
    ['PUBLIC RESPONSE GIVEN POLICY', INK.pencil,
     'This edge is left out on purpose. Whether public opinion changes what governments enact ' +
     'is exactly the quantity the political science literature disagrees about: one study of ' +
     '1,779 policy issues finds ordinary preferences have almost no independent effect, and a ' +
     're-examination of the same data finds they prevail about as often as elite preferences ' +
     'do. So a three-to-one majority against a policy predicts nothing here.'],
  ];
  edges.forEach(([h, c, body], i) => {
    const x = PAD + i * (ew + 12);
    d.text([x, eyB - 6.4], h, { size: 2.0, weight: 700, track: 0.12, colour: c });
    d.textBlock([x, eyB - 10.4], body, ew, { size: 1.9, lead: LEAD, colour: INK.pencil });
  });
  return H;
}
research.height = () => 376;

// ── 9 · method ───────────────────────────────────────────────────────────────
export function sources(d, S, H) {
  const y = head(d, H - 8, 'METHOD AND SOURCES', null);
  const g = S.grounding.counts;
  const colW = (CW - 12) / 2;
  const left = [
    ['EVIDENCE PROGRAMME',
     `A dossier stands behind seven of the ${S.network.axes.length} variables the registry now carries, each ` +
     'answering the same five questions from sources about the world: a base rate, a ' +
     'mechanism and its weakest step, the 2026 record, resolution criteria, and what would ' +
     'move the number. The audit that opened the programme is the reason for it — the engine ' +
     'is grounded in over 1,300 wiki pages, but the priors rested on 55 citations from 31 ' +
     'sources, and 21 of the 26 positions in the r4 registry carried one citation or none. ' +
     'Takeoff shape and regulatory architecture arrived in the rebuilds of 17 and 18 August ' +
     'and the programme reaches them next. Recommendations are held for review; the priors ' +
     'live in the parent engine, and changing one is a decision.'],
    ['MEASUREMENT CAVEATS',
     'The widely cited finding that 95% of enterprise AI pilots show no profit impact measures ' +
     'what the buyer booked as profit; the same survey found about 90% of ' +
     'workers using personal AI tools at work against 40% of firms with official ' +
     'subscriptions. Second, coding benchmarks are contaminated: about a third of successful ' +
     'patches on the most-cited one involve the solution appearing in the problem text, and ' +
     'removing that channel costs frontier models 3 to 7 points. The capability index here ' +
     'rests on a series timed against human professionals instead, whose benchmark-derived ' +
     'component biases the trend faster. Followed through, contamination is a small ' +
     'argument for later dates, and no argument at all for an index that reads too high.'],
    ['PROBABILITY DERIVATION',
     `A documented belief network of ${S.network.axes.length} variables with sub-variables, ` +
     `priors carrying provenance, and cited conditional relationships, sampled into an ` +
     `ensemble of world-lines. ${g.direct} wiki pages ground the engine directly and ` +
     `${g.corpus} more feed the recorded past. Variables with thin grounding get wider ` +
     `priors, so uncertainty is inherited and stated. These are the model's structured ` +
     `judgments, documented and adjustable, and scored in public as registered claims resolve.`],
    ['THE NUMBERS',
     (() => {
       const ml = S.network && S.path ? S.path : {};
       const n = (S.mainlineN || 2000).toLocaleString('en-US');
       const dyn = S.engine.dynamics;
       return `A sampled future is one world-line: a setting on each of the ${S.network.axes.length} ` +
         `variables, drawn from the network by Gibbs sampling, with the capability path its tempo ` +
         `and takeoff settings fix, the events its templates instantiate, and the tracks those ` +
         `events move. The ensemble is ${n} such lines; the drawn path is ` +
         (S.path && S.path.kind === 'medoid'
           ? `the medoid, the sampled line closest to all the others, with the single most ` +
             `probable line carried beside it` : `the single most probable line`) +
         `. ${S.exemplarN || 120} sampled lines are kept in full for the branches and the ` +
         `alternatives. Every band is the tenth to ninetieth percentile of the ensemble. The ` +
         `horizon is ${S.engine.y1}.` +
         (dyn ? ` The ceilings the tracks grow against: world generating capacity ` +
                `${dyn.WORLD_GW_2026.toLocaleString('en-US')} GW in 2026 growing ` +
                `${((dyn.WORLD_GW_GROWTH - 1) * 100).toFixed(1)}% a year, of which a supply setting ` +
                `reaches ${Math.round(Math.min(...Object.values(dyn.GW_SHARE_MAX)) * 100)}% to ` +
                `${Math.round(Math.max(...Object.values(dyn.GW_SHARE_MAX)) * 100)}%; world output ` +
                `$${dyn.GWP_2026} trillion in 2026 at ${((dyn.GWP_GROWTH - 1) * 100).toFixed(0)}% a year ` +
                `plus a lift the benefit setting lets through, tapering ${dyn.GWP_LIFT_TAPER} years ` +
                `after the research crossing; a diffusion band's share of that output; and ` +
                `${dyn.LAWS_MAX.toLocaleString('en-US')} statutes in force.`
              : ' The tracks carry hard caps.');
     })()],
    ['DAILY UPDATE',
     'Each morning the day\'s developments are classified against cited evidence rules under ' +
     'a tiered impact methodology, scaled by corroboration and damped by repetition. Every ' +
     'application logs its arithmetic and its driver. A quiet morning leaves residue, which ' +
     'the weekly schema review can answer by adding a variable on its own authority; such ' +
     'additions are marked provisional wherever they appear.'],
  ];
  const right = [
    ['SOURCE LITERATURE',
     'AI 2027 and its endings · AI 2040 Plan A and the plan family scored beside it · ' +
     'Situational Awareness · Europe 2031 · Machines of Loving Grace · AI as Normal ' +
     'Technology · The 2028 Global Intelligence Crisis · Anthropic\'s 2028 scenarios. Each is ' +
     'quarried for positions, parameters and event templates, and cited where its parts are ' +
     'used. Each scenario contributes parts.'],
    ['DOCUMENT PROVENANCE',
     'A second surface on the AI Atlas forecast engine, which holds the network, the evidence ' +
     'layer and the nightly gate. This document reads that engine\'s emitted forecast and ' +
     'publishes only when its gate passes. The drafting conventions follow The Systems Works.'],
  ];
  let ly = y, ry = y;
  for (const [h, p] of left) {
    d.text([PAD, ly], h, { size: 2.1, weight: 700, track: 0.16, colour: INK.red });
    ly -= 3.6;
    ly -= d.textBlock([PAD, ly], p, colW, { size: 1.9, lead: LEAD, colour: INK.pencil }) + 3.0;
  }
  for (const [h, p] of right) {
    const x = PAD + colW + 12;
    d.text([x, ry], h, { size: 2.1, weight: 700, track: 0.16, colour: INK.red });
    ry -= 3.6;
    ry -= d.textBlock([x, ry], p, colW, { size: 1.9, lead: LEAD, colour: INK.pencil }) + 3.0;
  }
  const foot = Math.min(ly, ry) - 4;
  rule(d, foot, PAD, CW, { weight: PEN.thin, colour: INK.inkLight });
  d.text([PAD, foot - 4.4],
         `DATA ${S.build} · NETWORK ${S.network.version.toUpperCase()} · READ ${S.network.date}`,
         { size: 1.8, face: 'figure', colour: INK.inkLight, track: 0.06 });
  return H;
}
sources.height = () => 236;

export const SECTIONS = [
  { id: 'header', fn: header, tab: 'forecast' },
  { id: 'readout', fn: readout, tab: 'forecast' },
  { id: 'board', fn: board, tab: 'forecast' },
  { id: 'recorders', fn: recorders, tab: 'forecast' },
  { id: 'details', fn: details, tab: 'instruments' },
  { id: 'behaviour', fn: behaviour, tab: 'behaviour' },
  { id: 'world', fn: world, tab: 'world' },
  { id: 'alternatives', fn: alternatives, tab: 'alternatives' },
  { id: 'morning', fn: morning, tab: 'revision' },
  { id: 'research', fn: research, tab: 'research' },
  { id: 'sources', fn: sources, tab: 'method' },
];
