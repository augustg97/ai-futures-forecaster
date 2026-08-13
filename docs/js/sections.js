// AI FUTURES FORECASTER — the document
//
// Seven tabs. The first carries the forecast, the passage describing it, and the controls that
// set it; the rest hold one plate each. Within a tab the drawing is a vertical sheet 300 mm
// wide, drawn at one fixed scale so lettering keeps the size it was drawn at and nothing has to
// be zoomed. A section's millimetre space runs x 0 → 300 across and y 0 → H up from its foot.

import { PEN, INK, PAPER } from './draft.js?v=20260812-1738';
import { dial, manifold, strip, tally, fmtNum } from './instruments.js?v=20260812-1738';
import { drawFigure } from './figures.js?v=20260812-1738';

export const SHEET_W = 340;
const PAD = 13;
const CW = SHEET_W - PAD * 2;
export const SHEET_CW = CW;

export const TABS = [
  { id: 'forecast', label: 'Forecast' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'behaviour', label: 'Behaviour' },
  { id: 'world', label: 'World' },
  { id: 'alternatives', label: 'Alternatives' },
  { id: 'revision', label: 'This morning' },
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
export function measureProse(d, paras, colW, size = 2.0) {
  let h = 0;
  for (const p of paras) {
    h += d.runInLines(p.lead, p.text, colW, size).lines.length * size * LEAD + 2.4;
  }
  return h;
}
// The passage across n columns, split so the columns end level. Three columns keep it a band
// across the head of the sheet instead of a wall the chart has to sit under.
export const PROSE_N = 3;
export const PROSE_COL = (CW - (PROSE_N - 1) * 10) / PROSE_N;
export function proseColumns(d, paras, colW = PROSE_COL, n = PROSE_N, size = 2.0) {
  const hs = paras.map((p) => measureProse(d, [p], colW, size));
  // Order has to be preserved, so the only choice is where to cut. With a handful of
  // paragraphs every set of cuts can be tried, and the one with the shortest tallest column
  // wins — a greedy fill left one column with a single line and another with four paragraphs.
  const m = paras.length;
  let best = null;
  const cuts = [];
  const walk = (start, depth) => {
    if (depth === n - 1) {
      const bounds = [0, ...cuts, m];
      let tallest = 0;
      for (let c = 0; c < n; c++) {
        let sum = 0;
        for (let k = bounds[c]; k < bounds[c + 1]; k++) sum += hs[k];
        if (sum > tallest) tallest = sum;
      }
      if (best === null || tallest < best.tallest) {
        best = { tallest, bounds: bounds.slice() };
      }
      return;
    }
    for (let c = start; c <= m; c++) { cuts.push(c); walk(c, depth + 1); cuts.pop(); }
  };
  if (m === 0) return { cols: Array.from({ length: n }, () => []), h: 0 };
  walk(0, 0);
  const cols = [];
  for (let c = 0; c < n; c++) cols.push(paras.slice(best.bounds[c], best.bounds[c + 1]));
  return { cols, h: Math.max(...cols.map((c) => measureProse(d, c, colW, size))) };
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
function noteBlock(d, x, y, w, note, { title = null, colour = INK.red } = {}) {
  // The column width follows the number of columns the note was MEASURED at. Deriving it from
  // the block width alone wrapped a one-column note to half its width and ran it off the foot
  // of the section, where nothing catches it.
  const n = Math.max(1, note.cols.length);
  const gap = n > 1 ? 4 : 0;
  const colW = (w - 8 - (n - 1) * gap) / n;
  d.rect(x, y - note.h - (title ? 9 : 4), w, note.h + (title ? 11 : 6),
         { weight: PEN.thin, colour, alpha: 0.6 });
  let top = y;
  if (title) {
    d.text([x + 4, y - 3.0], title.toUpperCase(),
           { size: 2.4, weight: 700, track: 0.16, colour });
    top = y - 7.4;
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
  d.text([x, y], 'CAPABILITY TEMPO · WEIGHT AND ITS 30-DAY DRIFT',
         { size: 1.6, track: 0.10, colour: INK.pencilLight });
  y -= 4;

  const T = S.network.axes.find((a) => a.key === 'T');
  const m = S.marginals.T || {}, was = S.marginals30.T || {};
  T.positions.forEach((p, i) => {
    dial(d, x + 9 + (i % 2) * 40, y - 12 - Math.floor(i / 2) * 27, 8.2, {
      label: p[0] + ' · ' + p[1].split(' (')[0].toUpperCase().slice(0, 9),
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
  d.text([x, y], `${fmtNum(tr.gw[i0])} GW · ${fmtNum(tr.twh[i0])} TWH/YR`,
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
    d.text([x + 5.4, y - 4.4], dm.k,
           { size: 1.8, weight: 700, track: 0.10, pocket: true,
             colour: on ? INK.ink : INK.pencilLight });
    d.text([x + w - 2.0, y - 4.4], on ? String(S.crossYear(dm.th) || '—') : dm.th.toFixed(1),
           { size: 1.6, align: 'right', face: 'figure', pocket: true,
             colour: on ? INK.warm : INK.pencilLight });
    d.region(`dom:${i}`, x, y - 6.6, w, 6.2, dm);
    y -= 7.2;
  });
  y -= 2;
  tally(d, x, y, w, { n: tr.copies[i0], speed: tr.speed[i0], id: 'tally' });
  y -= 15;

  // ── behaviour, six recorders at reading size ───────────────────────────────
  d.text([x, y], 'BEHAVIOUR OVER TIME', { size: 3.0, weight: 700, track: 0.16, colour: INK.ink });
  rule(d, y - 2.2, x, w, { weight: PEN.thin, colour: INK.inkLight });
  y -= 6.4;
  d.text([x, y], '2026 TO 2100 ON THE ACTIVE LINE · PEN AT THE DATE',
         { size: 1.6, track: 0.10, colour: INK.pencilLight });
  y -= 4;
  const half = (w - 4) / 2;
  behaviourPanels(S).forEach((p, i) => {
    const lo = Math.min(...p.d), hi = Math.max(...p.d);
    const pad = (hi - lo) * 0.08 || 1;
    const px = x + (i % 2) * (half + 4);
    const py = y - 17 - Math.floor(i / 2) * 20.5;
    strip(d, px + 7, py, half - 8, 16, {
      data: p.d, years: S.tracks.year, y0: lo - pad, y1: hi + pad, colour: p.c,
      label: p.label, unit: p.unit, now: Math.max(S.engine.y0, S.yr), id: p.id, fmt: p.fmt,
    });
  });
  y -= 20.5 * Math.ceil(behaviourPanels(S).length / 2) + 2;
  return top - y;
}

// ── the middle column ────────────────────────────────────────────────────────
function chartColumn(d, S, top) {
  const { x, w } = COL.mid;
  let y = head(d, top, 'FORECAST',
    'Capability against time. Heavy ink is the recorded past; the blue band is the spread of ' +
    'sampled futures at the tenth to ninetieth percentile, the middle half hatched closer. ' +
    'Chain-dot rules are the capability milestones.', { x, w });

  const bx = CHART.bx, bw = CHART.bw, bh = CHART_H, by = y - bh;
  const X = CHART.x;
  const Yv = (v) => by + Math.max(0, Math.min(6.4, v)) / 6.4 * bh;

  d.rect(bx, by, bw, bh, { weight: PEN.thin, colour: INK.ink });
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
  for (let i = 1; i <= 6; i++) {
    d.line([bx, Yv(i)], [bx + bw, Yv(i)],
           { weight: PEN.thin, colour: INK.red, dash: [7, 2, 1.4, 2], alpha: 0.45 });
    d.text([bx + 1.6, Yv(i) + 1.3], (S.engine.ladder[i] || '').toUpperCase(),
           { size: 1.7, colour: INK.red, track: 0.10 });
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

  d.line([X(S.NOW), by], [X(S.NOW), by + bh + 2.0], { weight: PEN.medium, colour: INK.ink });
  d.text([X(S.NOW) + 1.4, by + bh - 3.2], 'TODAY',
         { size: 2.0, colour: INK.ink, weight: 700, track: 0.16 });
  d.line([X(S.yr), by], [X(S.yr), by + bh], { weight: PEN.thin, colour: INK.blue });
  d.polyline([[X(S.yr), by + bh], [X(S.yr) - 2.0, by + bh + 3.0], [X(S.yr) + 2.0, by + bh + 3.0]],
             { close: true, weight: PEN.thin, colour: INK.blue, fill: INK.blue });

  // every label on the chart takes its slot from one allocator
  const placed = [];
  const SLOTS = [10, -10, 16.5, -16.5, 23, -23, 29.5, -29.5];
  // A label is placed inside the frame on both axes: pushed above or below it lands on the
  // plate's caption, pushed past the right edge it lands in the control panel next door.
  const place = (cx, cy, str, size) => {
    const tw = d.textWidth(str, { size }) + 1.5;
    const toRight = cx + 5 + tw <= bx + bw - 1;
    const x0 = toRight ? cx + 5 : cx - 5 - tw;
    let fallback = null;
    for (const cand of SLOTS) {
      const box = { x: x0, y: cy + cand - 1.0, w: tw, h: 3.3 };
      if (box.y < by + 1 || box.y + box.h > by + bh - 1) continue;
      if (fallback === null) fallback = cand;
      if (!placed.some((q) => Math.min(q.x + q.w, box.x + box.w) - Math.max(q.x, box.x) > 0 &&
                              Math.min(q.y + q.h, box.y + box.h) - Math.max(q.y, box.y) > 0)) {
        placed.push(box); return { off: cand, right: !toRight };
      }
    }
    const off = fallback === null ? SLOTS[0] : fallback;
    placed.push({ x: x0, y: cy + off - 1.0, w: tw, h: 3.3 });
    return { off, right: !toRight };
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
    d.text([x + w - 4, bandTop - 5], 'CLICK A MILESTONE OR CRISIS POINT FOR ITS ENTRY',
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
const CTAB = { T: 'TEMPO', A: 'ALIGN', C: 'COORD', D: 'LABOUR', S: 'SUPPLY',
               P: 'PUBLIC', E: 'ECONOMY' };
const CBTN_H = 26;

function controlColumn(d, S, top) {
  const { x, w } = COL.right;
  let y = top;
  d.text([x, y], 'CONTROLS', { size: 3.0, weight: 700, track: 0.16, colour: INK.ink });
  rule(d, y - 2.2, x, w, { weight: PEN.thin, colour: INK.inkLight });
  y -= 6.2;
  d.textBlock([x, y], 'One tab per variable. Choosing a setting fixes that variable and ' +
    'redraws the document; the figure at the foot of a button is what the setting moves ' +
    'hardest by 2040. Choosing it again releases the variable.', w,
    { size: 1.7, lead: 1.38, colour: INK.pencil });
  y -= 12.5;

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
    d.text([tx + tw / 2, ty + 1.9], `${a.key} ${CTAB[a.key] || ''}`,
           { size: 1.75, align: 'center', track: 0.08, weight: on ? 700 : 500,
             colour: on ? INK.blue : INK.pencil });
    if (set) d.dot([tx + 1.8, ty + th - 1.6], 0.75, { colour: INK.blue });
    d.region(`ctl:axis:${a.key}`, tx, ty, tw, th, a);
  });
  y -= Math.ceil(S.network.axes.length / cols) * (th + 1.6) + 3;

  const a = S.network.axes.find((q) => q.key === S.ctlAxis) || S.network.axes[0];
  const pin = S.pin[a.key];
  const marg = S.marginals[a.key] || {};
  d.text([x, y], a.name.toUpperCase(),
         { size: 2.3, weight: 700, track: 0.12, colour: pin ? INK.blue : INK.ink });
  const modal = Object.entries(marg).sort((p, q) => q[1] - p[1])[0];
  d.text([x + w, y], pin ? 'SET BY YOU'
           : modal ? `LIKELIEST ${modal[0]} ${(modal[1] * 100).toFixed(0)}%` : '',
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
    if (eff) {
      d.text([x + 3.4, by2 + 1.8], eff.label,
             { size: 1.45, track: 0.08, colour: INK.pencilLight });
      d.text([x + w - 2.6, by2 + 1.8], eff.text,
             { size: 1.6, align: 'right', face: 'figure', weight: 700, colour: INK.ink });
    } else if (eff !== 0) {
      d.text([x + 3.4, by2 + 1.8], 'NO MEASURED EFFECT BY 2040',
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
  d.text([x, y], 'HOW A CHOICE IS APPLIED',
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
  d.text([x, y], 'A COMMAND, TAKING EFFECT WHEN PRESSED',
         { size: 1.5, colour: INK.pencilLight, track: 0.10 });
  y -= 2.6;
  button(d, x, y - 15, w, 15, {
    name: 'RELEASE EVERY VARIABLE', on: false, accent: INK.red, id: 'ctl:reset',
    desc: 'Return each variable to the weight the evidence gives it.' });
  y -= 15;
  return top - y;
}

export function board(d, S, H) {
  const top = H - 8;
  const a = instrumentColumn(d, S, top);
  const b = chartColumn(d, S, top);
  const c = controlColumn(d, S, top);
  // column rules, so the three read as one drawing
  const y0 = 4, y1 = top + 5;
  for (const gx of [COL.mid.x - 2, COL.right.x - 2]) {
    d.line([gx, y0], [gx, y1], { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.55 });
  }
  return Math.max(a, b, c);
}
board.height = (S) => {
  const left = 34 + Math.ceil(4 / 2) * 27 + 34 + 6 + S.engine.domains.length * 7.2 + 24 +
               18 + 3 * 20.5;
  const mid = 30 + CHART_H + 21 + NOTE_BAND + (S.chartNote ? S.chartNote.h + 12 : 0);
  const n = (S.network.axes.find((q) => q.key === S.ctlAxis) || S.network.axes[0])
    .positions.length;
  const right = 40 + Math.ceil(S.network.axes.length / 4) * 8 + 20 + n * (CBTN_H + 2.2) +
                (S.openNote ? S.openNote.h + 19 : 0) + 100;
  return Math.max(left, mid, right) + 12;
};

// ── 3 · the passage, across the head of the sheet ───────────────────────────
export function readout(d, S, H) {
  let y = H - 8;
  d.textBlock([PAD, y], S.headline, CW,
              { size: 3.2, lead: 1.28, colour: INK.blue, weight: 600 });
  y -= d.wrap(S.headline, CW, { size: 3.2, weight: 600 }).length * 3.2 * 1.28 + 3.2;
  rule(d, y + 1.6, PAD, CW, { weight: PEN.thin, colour: INK.blue });
  y -= 2.2;
  S.prose.cols.forEach((col, ci) => {
    let cy = y;
    const cx = PAD + ci * (PROSE_COL + 10);
    for (const para of col) {
      cy -= d.runIn([cx, cy], para.lead, para.text, PROSE_COL,
                    { size: 2.0, lead: LEAD, colour: INK.pencil, leadColour: INK.ink }) + 2.4;
    }
  });
  for (let i = 1; i < PROSE_N; i++) {
    const gx = PAD + i * (PROSE_COL + 10) - 5;
    d.line([gx, 4], [gx, y - 1], { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.45 });
  }
  return H;
}
readout.height = (S) => 22 + (S.headlineH || 12) + S.prose.h;

// ── the drawn scenes ────────────────────────────────────────────────────────
export function scenes(d, S, H) {
  const y = head(d, H - 8, 'SCENES',
    'Two drawings of the future the settings and the date describe. Each caption states what ' +
    'the scene depicts and which setting selected it.');
  const fw = (CW - 14) / 2, fh = y - 12;
  S.figures.forEach((f, i) => {
    drawFigure(d, f.key, PAD + i * (fw + 14), 8, fw, fh);
  });
  return H;
}
scenes.height = () => 92;

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
  ];
}

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
  d.textBlock([PAD, tops - 3.6], 'One face per setting. The pale needle stands where the ' +
    'reading stood thirty days ago, so the movement is an angle.', colW,
    { size: 1.8, lead: 1.4, colour: INK.pencil });
  const T = S.network.axes.find((a) => a.key === 'T');
  const m = S.marginals.T || {}, was = S.marginals30.T || {};
  T.positions.forEach((p, i) => {
    dial(d, PAD + 13 + (i % 2) * 32, tops - 26 - Math.floor(i / 2) * 34, 10.5, {
      label: p[0] + ' · ' + p[1].split(' (')[0].toUpperCase().slice(0, 12),
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
  d.text([bx, tops - 60], `TOTAL ${fmtNum(tr.gw[i0])} GW · ${fmtNum(tr.twh[i0])} TWH/YR`,
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
  tally(d, cx, dy - 4.0, colW, { n: tr.copies[i0], speed: tr.speed[i0], id: 'tally' });
  if (S.plateNote) noteBlock(d, PAD, 44, CW, S.plateNote, { title: S.plateNote.title });
  return H;
}
details.height = (S) => 48 + Math.max(100, S.engine.domains.length * 9.4 + 30) +
  (S.plateNote ? S.plateNote.h + 22 : 0);

// ── 5 · behaviour over time ──────────────────────────────────────────────────
export function behaviour(d, S, H) {
  const y = head(d, H - 8, 'BEHAVIOUR OVER TIME',
    'Six quantities on the active world-line, 2026 to 2100. Each pen sits at the date on the ' +
    'index and its reading is printed beside it. Every chart derives its scale from its own ' +
    'series, so the shapes stay comparable across settings while the magnitudes differ.');
  dateStrip(d, PAD + 44, y - 4, CW - 44, S);
  const tr = S.tracks, yrs = tr.year;
  const foot = S.plateNote ? S.plateNote.h + 26 : 12;
  const cw = (CW - 24) / 3, ch = (y - 14 - foot - 10) / 2 - 12;
  const panels = behaviourPanels(S);
  panels.forEach((p, i) => {
    const px = PAD + (i % 3) * (cw + 12);
    const py = foot + 10 + (1 - Math.floor(i / 3)) * (ch + 24);
    const lo = Math.min(...p.d), hi = Math.max(...p.d);
    const pad = (hi - lo) * 0.08 || 1;
    strip(d, px + 10, py + 15, cw - 12, ch - 15, {
      data: p.d, years: yrs, y0: lo - pad, y1: hi + pad, colour: p.c,
      label: p.label, unit: p.unit, now: Math.max(S.engine.y0, S.yr), id: p.id, fmt: p.fmt,
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
  const y = head(d, H - 8, 'ALTERNATIVE FUTURES',
    'Twelve sampled world-lines drawn across the spread, from the slowest quarter to the ' +
    'fastest. Each panel shows that line\'s capability path against the same milestone rules. ' +
    'Choosing one makes it the active line through the whole document.');
  const foot = S.plateNote ? S.plateNote.h + 22 : 14;
  S.drawAlts(d, S, [PAD, foot, CW, y - foot - 6]);
  if (S.plateNote) noteBlock(d, PAD, S.plateNote.h + 11, CW, S.plateNote,
                             { title: S.plateNote.title });
  return H;
}
alternatives.height = (S) => 232 + (S.plateNote ? S.plateNote.h + 22 : 0);

// ── 8 · this morning ─────────────────────────────────────────────────────────
export function morning(d, S, H) {
  const y = head(d, H - 8, "THIS MORNING'S REVISION",
    'What the evidence moved on the network today, with the arithmetic that moved it: impact ' +
    'class, corroborating sources, novelty decay, the positions changed and the development ' +
    'that drove them. The newest application is ringed in a revision cloud.');
  const foot = S.plateNote ? S.plateNote.h + 22 : 14;
  S.drawMorning(d, S, [PAD, foot, CW, y - foot - 6]);
  if (S.plateNote) noteBlock(d, PAD, S.plateNote.h + 11, CW, S.plateNote,
                             { title: S.plateNote.title });
  return H;
}
morning.height = (S) => 190 + (S.plateNote ? S.plateNote.h + 22 : 0);

// ── 9 · method ───────────────────────────────────────────────────────────────
export function sources(d, S, H) {
  const y = head(d, H - 8, 'METHOD AND SOURCES', null);
  const g = S.grounding.counts;
  const colW = (CW - 12) / 2;
  const left = [
    ['WHERE THE PROBABILITIES COME FROM',
     `A documented belief network of ${S.network.axes.length} variables with sub-variables, ` +
     `priors carrying provenance, and cited conditional relationships, sampled into an ` +
     `ensemble of world-lines. ${g.direct} wiki pages ground the engine directly and ` +
     `${g.corpus} more feed the recorded past. Variables with thin grounding get wider ` +
     `priors, so uncertainty is inherited and stated. These are the model's structured ` +
     `judgments, documented and adjustable, and scored in public as registered claims resolve.`],
    ['THE DAILY UPDATE',
     'Each morning the day\'s developments are classified against cited evidence rules under ' +
     'a tiered impact methodology, scaled by corroboration and damped by repetition. Every ' +
     'application logs its arithmetic and its driver. A quiet morning leaves residue, which ' +
     'the weekly schema review can answer by adding a variable on its own authority; such ' +
     'additions are marked provisional wherever they appear.'],
  ];
  const right = [
    ['THE LITERATURE QUARRIED',
     'AI 2027 and its endings · AI 2040 Plan A and the plan family scored beside it · ' +
     'Situational Awareness · Europe 2031 · Machines of Loving Grace · AI as Normal ' +
     'Technology · The 2028 Global Intelligence Crisis · Anthropic\'s 2028 scenarios. Each is ' +
     'quarried for positions, parameters and event templates, and cited where its parts are ' +
     'used. Each scenario contributes parts.'],
    ['THIS DOCUMENT',
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
sources.height = () => 150;

export const SECTIONS = [
  { id: 'header', fn: header, tab: 'forecast' },
  { id: 'readout', fn: readout, tab: 'forecast' },
  { id: 'board', fn: board, tab: 'forecast' },
  { id: 'scenes', fn: scenes, tab: 'forecast' },
  { id: 'details', fn: details, tab: 'instruments' },
  { id: 'behaviour', fn: behaviour, tab: 'behaviour' },
  { id: 'world', fn: world, tab: 'world' },
  { id: 'alternatives', fn: alternatives, tab: 'alternatives' },
  { id: 'morning', fn: morning, tab: 'revision' },
  { id: 'sources', fn: sources, tab: 'method' },
];
