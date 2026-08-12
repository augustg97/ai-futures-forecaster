// THE FORECAST WORKS — the document
//
// Seven tabs. The first carries the forecast, the passage describing it, and the controls that
// set it; the rest hold one plate each. Within a tab the drawing is a vertical sheet 300 mm
// wide, drawn at one fixed scale so lettering keeps the size it was drawn at and nothing has to
// be zoomed. A section's millimetre space runs x 0 → 300 across and y 0 → H up from its foot.

import { PEN, INK } from './draft.js?v=20260812-0037';
import { dial, manifold, strip, tally, fmtNum } from './instruments.js?v=20260812-0037';
import { drawFigure } from './figures.js?v=20260812-0037';

export const SHEET_W = 300;
const PAD = 13;
const CW = SHEET_W - PAD * 2;

// the forecast tab's two columns: the chart on the left, the passage on the right
export const CHART_W = 184;
export const PROSE_W = CW - CHART_W - 10;

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
  const colW = (w - 12) / 2;
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
    const cx = x + 4 + ci * (colW + 4);
    for (const sec of col) {
      if (sec.h) {
        d.text([cx, cy], sec.h.toUpperCase(),
               { size: 2.0, weight: 700, track: 0.14, colour: INK.ink });
        cy -= 3.8;
      }
      for (const p of sec.p || []) {
        if (!p) continue;
        cy -= d.textBlock([cx, cy], p, colW - 4, { size: 2.0, lead: LEAD, colour: INK.pencil })
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
  d.text([PAD, y], 'THE FORECAST WORKS',
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

// ── 2 · forecast, with the passage beside it ─────────────────────────────────
// The time axis is compressed after 2040: the next fifteen years carry most of what the model
// has to say, and the rest of the century belongs on the same chart. The mapping is exported so
// the date control reads the same scale the chart is drawn on.
export const CHART = {
  bx: PAD + 16, bw: CHART_W - 18, Y0: 2012, Y1: 2100, KNEE: 2040, SPLIT: 0.66,
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

const NOTE_BAND = 40;

export function forecast(d, S, H) {
  let y = head(d, H - 8, 'FORECAST',
    'Capability against time. The heavy ink line is the recorded past; the blue band is the ' +
    'spread of sampled futures at the tenth to ninetieth percentile, with the middle half ' +
    'hatched more closely. Chain-dot rules are the capability milestones.',
    { x: PAD, w: CHART_W });

  const bx = CHART.bx, bw = CHART.bw, by = NOTE_BAND + 22, bh = y - by - 6;
  const X = CHART.x;
  const Yv = (v) => by + Math.max(0, Math.min(6.4, v)) / 6.4 * bh;

  d.rect(bx, by, bw, bh, { weight: PEN.thin, colour: INK.ink });
  for (let yr = 2015; yr < 2100; yr += 5) {
    const major = yr % 10 === 0;
    d.line([X(yr), by], [X(yr), by + bh],
           { weight: PEN.hairline, colour: INK.pencilLight,
             dash: major ? null : [0.8, 1.6], alpha: major ? 0.5 : 0.35 });
  }
  for (let yr = 2020; yr <= 2100; yr += 10) {
    d.line([X(yr), by - 1.8], [X(yr), by], { weight: PEN.hairline, colour: INK.inkLight });
    d.text([X(yr), by - 5.0], String(yr),
           { size: 2.0, align: 'center', face: 'figure', colour: INK.inkLight });
  }
  for (let i = 1; i <= 6; i++) {
    d.line([bx, Yv(i)], [bx + bw, Yv(i)],
           { weight: PEN.thin, colour: INK.red, dash: [7, 2, 1.4, 2], alpha: 0.5 });
    d.text([bx + 1.8, Yv(i) + 1.4], (S.engine.ladder[i] || '').toUpperCase(),
           { size: 1.85, colour: INK.red, track: 0.12, alpha: 0.92 });
    d.text([bx - 2.0, Yv(i) - 0.8], String(i),
           { size: 1.9, align: 'right', face: 'figure', colour: INK.redLight });
    d.region(`mile:${i}`, bx, Yv(i) - 2.4, bw, 4.8, i);
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
  env('p10', 'p90', 3.4, 'rgba(58,132,214,0.08)');
  env('p25', 'p75', 1.8, 'rgba(58,132,214,0.12)');

  const med = [];
  let diffLabel = null;
  B.year.forEach((yr, i) => { if (yr >= S.NOW) med.push([X(yr), Yv(B.p50[i])]); });
  if (S.baselineBands) {
    // The difference between the two medians IS the effect of the settings, so it is drawn as
    // an area. The label goes where the gap is widest; at either end the lines coincide.
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
      d.fillPoly(poly, 'rgba(176,120,26,0.13)');
      d.hatch([X(S.NOW), by, bw - (X(S.NOW) - bx), bh],
              { spacing: 2.2, angle: Math.PI / 2, weight: PEN.hairline, colour: INK.ochre,
                path: (dd) => {
                  const ctx = dd.ctx;
                  poly.forEach((pt, i) => {
                    const px = dd.x(pt[0]), py = dd.y(pt[1]);
                    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
                  });
                  ctx.closePath();
                } });
    }
    d.polyline(g, { weight: PEN.thin, colour: INK.pencil, dash: [4, 2.4] });
    if (wide > 0.05 && wideYr) {
      const gi = G.year.indexOf(wideYr), bi = B.year.indexOf(wideYr);
      diffLabel = { yr: wideYr, my: (Yv(G.p50[gi]) + Yv(B.p50[bi])) / 2,
                    d: B.p50[bi] - G.p50[gi] };
    }
    d.text([bx + bw - 1.5, Yv(G.p50[G.year.indexOf(2098)]) - 3.4], 'EVERY VARIABLE FREE',
           { size: 1.7, align: 'right', colour: INK.pencil, track: 0.12 });
  }
  d.polyline(med, { weight: PEN.outline, colour: INK.blue });

  d.polyline(S.TRUNK.map((p) => [X(p[0]), Yv(p[1])]), { weight: PEN.outline, colour: INK.ink });
  d.text([X(2013), Yv(0.8)], 'RECORDED', { size: 2.0, colour: INK.ink, weight: 600, track: 0.14 });

  d.line([X(S.NOW), by], [X(S.NOW), by + bh + 2.0], { weight: PEN.medium, colour: INK.ink });
  d.text([X(S.NOW) + 1.6, by + bh - 3.4], 'TODAY',
         { size: 2.2, colour: INK.ink, weight: 700, track: 0.18 });
  d.line([X(S.yr), by], [X(S.yr), by + bh], { weight: PEN.thin, colour: INK.blue });
  d.polyline([[X(S.yr), by + bh], [X(S.yr) - 2.0, by + bh + 3.4], [X(S.yr) + 2.0, by + bh + 3.4]],
             { close: true, weight: PEN.thin, colour: INK.blue, fill: INK.blue });
  d.text([X(S.yr), by + bh + 5.6], String(Math.floor(S.yr)),
         { size: 2.2, align: 'center', face: 'figure', colour: INK.blue, weight: 700 });

  // crisis points, each label taking the first slot clear of the ones already placed
  const CRY = { 'deal-window': 2030, 'explosive-takeoff': 2028, 'no-sc-window': 2036,
                'alignment-fails': 2031, 'hard-deflate': 2028.5, 'researcher-by-2035': 2035 };
  const placed = [];
  const SLOTS = [11, -11, 18, -18, 25, -25, 32, -32];
  const place = (cx, cy, str, size) => {
    const tw = d.textWidth(str, { size });
    for (const cand of SLOTS) {
      const box = { x: cx + 6, y: cy + cand - 1.0, w: tw + 1.5, h: 3.5 };
      if (!placed.some((q) => Math.min(q.x + q.w, box.x + box.w) - Math.max(q.x, box.x) > 0 &&
                              Math.min(q.y + q.h, box.y + box.h) - Math.max(q.y, box.y) > 0)) {
        placed.push(box); return cand;
      }
    }
    return SLOTS[SLOTS.length - 1];
  };
  // The difference label takes its slot first: it names the whole point of the settings, and
  // it collided with a crisis label whenever the two happened to land together.
  if (diffLabel) {
    const str = `YOUR SETTINGS MOVED THIS ${diffLabel.d > 0 ? '+' : '−'}` +
                `${Math.abs(diffLabel.d).toFixed(2)} AT ${Math.floor(diffLabel.yr)}`;
    const off = place(X(diffLabel.yr), diffLabel.my, str, 1.85);
    d.leader([X(diffLabel.yr), diffLabel.my], [X(diffLabel.yr) + 6, diffLabel.my + off], str,
             { colour: INK.ochre, size: 1.85, gap: 2.4 });
  }
  const items = S.crisis.crises.map((c) => {
    const yr = CRY[c.id] || 2032;
    return { c, cx: X(yr), cy: Yv(S.capAt(yr)) };
  }).sort((a, b) => a.cx - b.cx);
  for (const it of items) {
    const c = it.c;
    const p = c.kind === 'axis' ? (S.marginals[c.axis] || {})[c.pos] ?? c.p : c.p;
    const str = `${(p * 100).toFixed(0)}%  ${c.q.toUpperCase()}`;
    const off = place(it.cx, it.cy, str, 1.8);
    d.polyline([[it.cx, it.cy - 2.2], [it.cx + 2.2, it.cy], [it.cx, it.cy + 2.2],
                [it.cx - 2.2, it.cy]],
               { close: true, weight: PEN.thin, colour: INK.red, fill: 'rgba(244,241,232,0.92)' });
    // The leader arrives on a diagonal, so its tip lands inside the first glyph at the default
    // gap and eats the leading digit. Stand the lettering further off.
    d.leader([it.cx, it.cy], [it.cx + 6, it.cy + off], str,
             { colour: INK.red, size: 1.8, gap: 2.4 });
    d.region(`crisis:${c.id}`, it.cx - 3.4, it.cy - 3.4, 6.8, 6.8, c);
  }

  // the date index
  const sy = NOTE_BAND + 6;
  d.line([bx, sy], [bx + bw, sy], { weight: PEN.medium, colour: INK.ink });
  for (let yr = 2015; yr <= 2100; yr += 5) {
    d.line([X(yr), sy], [X(yr), sy - (yr % 20 === 0 ? 3.0 : 1.8)],
           { weight: PEN.hairline, colour: INK.inkLight });
  }
  const nx = X(S.yr);
  d.polyline([[nx, sy], [nx - 2.4, sy + 4.4], [nx + 2.4, sy + 4.4]],
             { close: true, weight: PEN.medium, colour: INK.blue, fill: INK.blue });
  d.text([bx, sy - 5.6], 'DRAG THE INDEX, OR CLICK ANYWHERE ON THE CHART, TO CHANGE THE DATE',
         { size: 1.75, colour: INK.pencilLight, track: 0.10 });
  d.region('ctl:time', bx - 4, sy - 3, bw + 8, 10);

  // The band under the chart holds the key, and takes the note of any mark on the chart the
  // reader points at, so an explanation appears where the reader is already looking.
  if (S.chartNote) {
    noteBlock(d, PAD, NOTE_BAND - 3, CHART_W, S.chartNote, { title: S.chartNote.title });
  } else {
    const keys = [
      ['RECORDED', INK.ink, PEN.outline, null],
      ['MEDIAN OF SAMPLED FUTURES', INK.blue, PEN.outline, null],
      ['MILESTONE DATUM', INK.red, PEN.thin, [7, 2, 1.4, 2]],
      ['THE SAME FORECAST WITH EVERY VARIABLE FREE', INK.erase, PEN.thin, [4, 2.4]],
    ];
    d.rect(PAD, 3, CHART_W, NOTE_BAND - 6, { weight: PEN.hairline, colour: INK.inkLight });
    d.text([PAD + 4, NOTE_BAND - 8], 'KEY',
           { size: 2.2, weight: 700, track: 0.18, colour: INK.ink });
    d.text([PAD + CHART_W - 4, NOTE_BAND - 8],
           'CLICK A MILESTONE OR A CRISIS POINT AND ITS ENTRY APPEARS HERE',
           { size: 1.7, align: 'right', colour: INK.pencilLight, track: 0.10 });
    keys.forEach((it, i) => {
      const kx = PAD + 5 + (i % 2) * (CHART_W * 0.48);
      const ly = NOTE_BAND - 14 - Math.floor(i / 2) * 4.6;
      d.line([kx, ly + 0.6], [kx + 10, ly + 0.6], { weight: it[2], colour: it[1], dash: it[3] });
      d.text([kx + 12, ly], it[0], { size: 1.8, colour: INK.pencil, track: 0.08 });
    });
  }

  // ── the passage, beside the chart ──────────────────────────────────────────
  const px = PAD + CHART_W + 10;
  let py = H - 8;
  d.textBlock([px, py], S.headline, PROSE_W,
              { size: 2.6, lead: 1.32, colour: INK.blue, weight: 600 });
  py -= d.wrap(S.headline, PROSE_W, { size: 2.6, weight: 600 }).length * 2.6 * 1.32 + 3.4;
  rule(d, py + 1.4, px, PROSE_W, { weight: PEN.thin, colour: INK.blue });
  py -= 1.6;
  for (const para of S.prose.paras) {
    py -= d.runIn([px, py], para.lead, para.text, PROSE_W,
                  { size: 2.0, lead: LEAD, colour: INK.pencil, leadColour: INK.ink }) + 2.4;
  }
  py -= 3;
  const fw = PROSE_W, fh = 54;
  for (const f of S.figures) {
    py -= fh;
    drawFigure(d, f.key, px, py, fw, fh);
    py -= 5;
  }
  return H;
}
forecast.height = (S) => {
  const left = 22 + NOTE_BAND + 128;
  const right = 30 + S.prose.h + S.figures.length * 59;
  return Math.max(left, right);
};

// ── 3 · controls ─────────────────────────────────────────────────────────────
const ROW_H = 25, BTN_H = 27;

export function controls(d, S, H) {
  let y = head(d, H - 8, 'CONTROLS',
    'Each row is one variable. Choosing a setting fixes that variable and redraws the whole ' +
    'document for it. Along the foot of each button is the quantity that setting moves ' +
    'hardest, and by how much, measured in 2040 against the model the charts draw; the ' +
    'percentage at the top right is the weight the network currently puts on it. Choosing a ' +
    'setting opens its full entry directly beneath the row, and choosing it again releases ' +
    'the variable. Once a variable is set, the other buttons on its row carry the weight the ' +
    'evidence alone gives them.');
  y -= 3;

  for (const a of S.network.axes) {
    const pin = S.pin[a.key];
    const marg = S.marginals[a.key] || {};
    const open = S.openAxis === a.key ? S.openNote : null;
    d.text([PAD, y], a.name.toUpperCase(),
           { size: 2.6, weight: 700, track: 0.14, colour: pin ? INK.blue : INK.ink });
    const modal = Object.entries(marg).sort((p, q) => q[1] - p[1])[0];
    d.text([PAD + CW, y], pin ? 'SET BY YOU' :
             modal ? `MOST LIKELY: ${modal[0]} AT ${(modal[1] * 100).toFixed(0)}%` : '',
           { size: 1.8, align: 'right', colour: pin ? INK.blue : INK.inkLight, track: 0.12 });
    d.textBlock([PAD, y - 3.2], S.plain(a.desc || ''), CW,
                { size: 1.85, lead: 1.4, colour: INK.pencil, max: 2 });
    d.region(`axis:${a.key}`, PAD, y - 4, CW, 6, a);
    const n = a.positions.length;
    const bw = (CW - (n - 1) * 2.6) / n;
    const byy = y - 9.4 - BTN_H;
    a.positions.forEach((p, i) => {
      const bxx = PAD + i * (bw + 2.6);
      const eff = S.effect(a.key, p[0]);
      const prior = ((S.priors[a.key] || {})[p[0]] || 0) * 100;
      const right = !pin ? `${((marg[p[0]] || 0) * 100).toFixed(0)}%`
                         : pin === p[0] ? 'SET' : `PRIOR ${prior.toFixed(0)}%`;
      const rw = d.textWidth(right, { size: pin && pin !== p[0] ? 1.7 : 1.9,
                                      face: 'figure', weight: 700 });
      button(d, bxx, byy, bw, BTN_H, {
        name: p[1].split(' (')[0].toUpperCase(),
        nameW: bw - 9.0 - rw,
        desc: S.plain(firstSentence(p[4])),
        on: pin === p[0], dim: !!pin && pin !== p[0],
        id: `ctl:pin:${a.key}:${p[0]}`, payload: p,
      });
      // Under a setting every other position on the row reads zero, which says nothing. The
      // weight the evidence gives it is the useful figure, so that is what is shown instead.
      d.text([bxx + bw - 3.0, byy + BTN_H - 4.4], right,
             { size: pin && pin !== p[0] ? 1.7 : 1.9, align: 'right', face: 'figure',
               weight: 700,
               colour: pin === p[0] ? INK.blue : pin ? INK.pencilLight : INK.inkLight });
      if (eff !== 0) {
        d.line([bxx + 3.4, byy + 4.6], [bxx + bw - 3.0, byy + 4.6],
               { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.7 });
      }
      if (eff) {
        d.text([bxx + 4.0, byy + 1.9], eff.label,
               { size: 1.5, track: 0.10, colour: INK.pencilLight });
        d.text([bxx + bw - 3.0, byy + 1.9], eff.text + ' BY 2040',
               { size: 1.7, align: 'right', face: 'figure', weight: 700, colour: INK.ink });
      } else if (eff !== 0) {
        // The model couples this variable to nothing the sheet measures by 2040. Saying so is
        // a finding about the model, and worth the line it costs.
        d.text([bxx + 4.0, byy + 1.9], 'NO MEASURED EFFECT BY 2040',
               { size: 1.5, track: 0.10, colour: INK.pencilLight });
      }
    });
    y = byy - 5;
    if (open) {
      noteBlock(d, PAD, y, CW, open, { title: open.title });
      y -= open.h + 15;
    }
    y -= 4;
  }

  // ── the two settings that govern how a choice is applied ───────────────────
  d.text([PAD, y], 'HOW A CHOICE IS APPLIED',
         { size: 2.6, weight: 700, track: 0.14, colour: INK.ink });
  d.textBlock([PAD, y - 3.2],
    'A separate setting, in force for every variable above. It decides what the rest of the ' +
    'network does when you fix one variable.', CW,
    { size: 1.85, lead: 1.4, colour: INK.pencil });
  const mw = (CW - 5.2) / 3;
  const my = y - 9.4 - BTN_H;
  button(d, PAD, my, mw, BTN_H, {
    name: 'SUPPOSE IT HAPPENS', on: !S.obs, tick: true, id: 'ctl:mode:do',
    desc: 'Fix the setting and hold every other variable at its prior weight. Reads: what ' +
          'follows if this is made true.' });
  button(d, PAD + mw + 2.6, my, mw, BTN_H, {
    name: 'SUPPOSE WE LEARN IT', on: S.obs, tick: true, id: 'ctl:mode:obs',
    desc: 'Fix the setting and reweight every other variable in its light. Reads: what this ' +
          'would tell you about the rest.' });
  button(d, PAD + (mw + 2.6) * 2, my, mw, BTN_H, {
    name: 'RELEASE EVERY VARIABLE', on: false, accent: INK.red, id: 'ctl:reset',
    desc: 'Clears all settings at once and returns each variable to the weight the evidence ' +
          'gives it.' });
  d.text([PAD + (mw + 2.6) * 2, my - 3.4], 'A COMMAND, TAKING EFFECT WHEN PRESSED',
         { size: 1.6, colour: INK.pencilLight, track: 0.12 });
  d.text([PAD, my - 3.4], 'TWO MODES · ONE IN FORCE AT A TIME',
         { size: 1.6, colour: INK.pencilLight, track: 0.12 });
  return H;
}
controls.height = (S) => {
  const rows = S.network.axes.length * (ROW_H + BTN_H - 6);
  return 56 + rows + (S.openNote ? S.openNote.h + 19 : 0) + BTN_H + 16;
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
  const panels = [
    { d: tr.gw, label: 'COMPUTE', unit: 'GW INSTALLED', c: INK.warm, id: 'trk:gw',
      fmt: (v) => fmtNum(v),
      note: 'Modelled global AI capacity. Growth is set by the supply variable and damped by ' +
            'the economy variable.' },
    { d: tr.rev, label: 'AI REVENUE', unit: 'USD TRILLION / YEAR', c: INK.blue, id: 'trk:rev',
      fmt: (v) => v.toFixed(1),
      note: 'Run-rate revenue grown by diffusion and capability, saturating against world ' +
            'output.' },
    { d: tr.jobs, label: 'EMPLOYMENT', unit: '% CUMULATIVE CHANGE', c: INK.red, id: 'trk:jobs',
      fmt: (v) => v.toFixed(0),
      note: 'Cumulative employment effect. The shock rate follows the published crisis path.' },
    { d: tr.laws, label: 'MEASURES IN FORCE', unit: 'COUNT', c: INK.green, id: 'trk:laws',
      fmt: (v) => fmtNum(v),
      note: 'Tracked statutes and regulations. The fragmented-blocs setting legislates ' +
            'fastest.' },
    { d: tr.appr, label: 'PUBLIC APPROVAL', unit: '%', c: INK.ochre, id: 'trk:appr',
      fmt: (v) => v.toFixed(0),
      note: 'Approval under the public-response setting, depressed by displacement and ' +
            'steadied by a durable agreement.' },
    { d: tr.co2, label: 'AI EMISSIONS', unit: 'MT CO2 / YEAR', c: INK.pencil, id: 'trk:co2',
      fmt: (v) => fmtNum(v),
      note: 'Load times grid intensity, which falls faster where the build-out is ' +
            'coordinated or diversified.' },
  ];
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
  { id: 'forecast', fn: forecast, tab: 'forecast' },
  { id: 'controls', fn: controls, tab: 'forecast' },
  { id: 'details', fn: details, tab: 'instruments' },
  { id: 'behaviour', fn: behaviour, tab: 'behaviour' },
  { id: 'world', fn: world, tab: 'world' },
  { id: 'alternatives', fn: alternatives, tab: 'alternatives' },
  { id: 'morning', fn: morning, tab: 'revision' },
  { id: 'sources', fn: sources, tab: 'method' },
];
