// THE FORECAST WORKS — the document
//
// A vertical sheet, read at a fixed scale by scrolling. The width is constant at 300 mm and
// every section states its own height, so lettering keeps the size it was drawn at and the
// reader never has to zoom. Sections are drawn bottom-up in their own millimetre space:
// x runs 0 → 300 across, y runs 0 → H up from the section's foot.

import { PEN, INK } from './draft.js';
import { dial, manifold, strip, tally, fmtNum } from './instruments.js';
import { describe, headline } from './narrative.js';
import { chooseFigures, drawFigure } from './figures.js';

export const SHEET_W = 300;
const PAD = 13;
const CW = SHEET_W - PAD * 2;

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

function rule(d, y, { colour = INK.ink, weight = PEN.medium } = {}) {
  d.line([PAD, y], [PAD + CW, y], { weight, colour });
}

function head(d, y, title, sub) {
  d.text([PAD, y], title, { size: 4.0, weight: 700, track: 0.18, colour: INK.ink });
  rule(d, y - 2.4, { weight: PEN.thin, colour: INK.inkLight });
  if (sub) {
    return y - 7.4 - d.textBlock([PAD, y - 5.4], sub, CW,
      { size: 2.0, lead: 1.45, colour: INK.pencil });
  }
  return y - 5.0;
}

// A position's note usually ends in a full stop already, so appending one to the first
// sentence gives ".." — small, and it reads as a truncation the drawing did not make.
function firstSentence(str) {
  const first = String(str || '').split('. ')[0].replace(/[.\s]+$/, '');
  return first ? first + '.' : '';
}

// A button that says what it does. Wide enough for a name and a line of description.
function button(d, x, y, w, h, { name, desc, on, dim, id, payload, accent }) {
  const c = on ? (accent || INK.blue) : INK.ink;
  d.rect(x, y, w, h, {
    weight: on ? PEN.outline : PEN.thin, colour: on ? c : INK.inkLight,
    fill: on ? 'rgba(21,84,166,0.10)' : (dim ? 'rgba(24,28,38,0.02)' : null),
  });
  if (on) {
    d.line([x + 1.2, y + 1.2], [x + 1.2, y + h - 1.2], { weight: PEN.heavy, colour: c });
  }
  d.text([x + 4.0, y + h - 4.4], name,
         { size: 2.3, weight: on ? 700 : 600, colour: on ? c : INK.ink, track: 0.06 });
  if (desc) {
    d.textBlock([x + 4.0, y + h - 7.6], desc, w - 6.5,
                { size: 1.8, lead: 1.38, colour: on ? INK.pencil : INK.pencilLight, max: 5 });
  }
  if (id) d.region(id, x, y, w, h, payload);
}

// ── 1 · the header ───────────────────────────────────────────────────────────
export function header(d, S, H) {
  let y = H - 8;
  d.text([PAD, y], 'THE FORECAST WORKS',
         { size: 6.0, weight: 700, track: 0.22, colour: INK.ink });
  d.text([PAD + CW, y], S.network.version.toUpperCase() + ' · READ ' + S.network.date,
         { size: 2.0, align: 'right', colour: INK.inkLight, track: 0.14, face: 'figure' });
  rule(d, y - 4.0, { weight: PEN.border });
  y -= 9.0;
  d.textBlock([PAD, y], 'A probabilistic model of the AI transition, 2012 to 2100, drawn as a ' +
    'document. The record to the left of TODAY is what the AI Policy Wiki has ' +
    'recorded. Everything to the right is a distribution over futures, re-sampled each ' +
    'morning as the wiki records what happened.', CW,
    { size: 2.1, lead: 1.45, colour: INK.pencil });
  y -= 11;
  d.text([PAD, y], S.headline, { size: 2.6, weight: 600, colour: INK.blue, track: 0.02 });
  return H;
}
header.height = () => 34;

// ── 2 · the forecast ─────────────────────────────────────────────────────────
// The time axis is compressed after 2040: the next fifteen years carry most of what the model
// has to say, and the rest of the century needs to be on the same sheet. The mapping is
// exported so the date control reads the same scale the chart is drawn on.
export const CHART = {
  bx: PAD + 16, bw: CW - 30, Y0: 2012, Y1: 2100, KNEE: 2040, SPLIT: 0.66,
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

export function forecast(d, S, H) {
  let y = head(d, H - 8, 'THE FORECAST',
    'Capability against time. The heavy ink line is the recorded past. The blue band is the ' +
    'spread of sampled futures, drawn at the tenth to ninetieth percentile with the middle ' +
    'half hatched more closely. The chain-dot rules are capability milestones, each labelled ' +
    'at the left.');

  const bx = CHART.bx, bw = CHART.bw, by = 26, bh = y - 34;
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
    d.text([X(yr), by - 5.4], String(yr),
           { size: 2.1, align: 'center', face: 'figure', colour: INK.inkLight });
  }
  // milestone datums
  for (let i = 1; i <= 6; i++) {
    d.line([bx, Yv(i)], [bx + bw, Yv(i)],
           { weight: PEN.thin, colour: INK.red, dash: [7, 2, 1.4, 2], alpha: 0.5 });
    d.text([bx + 1.8, Yv(i) + 1.4], (S.engine.ladder[i] || '').toUpperCase(),
           { size: 1.9, colour: INK.red, track: 0.12, alpha: 0.92 });
    d.text([bx - 2.0, Yv(i) - 0.8], String(i),
           { size: 1.9, align: 'right', face: 'figure', colour: INK.redLight });
    d.region(`mile:${i}`, bx, Yv(i) - 2.4, bw, 4.8, i);
  }
  // the band
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

  // the baseline median, kept as a ghost whenever a control is set, so the effect of the
  // setting is the gap between the two lines
  const med = [];
  B.year.forEach((yr, i) => { if (yr >= S.NOW) med.push([X(yr), Yv(B.p50[i])]); });
  if (S.baselineBands) {
    // The difference between the two medians IS the effect of the settings, so it is drawn as
    // an area rather than left for the eye to subtract. The label goes where the gap is widest,
    // because at either end the two lines usually sit on top of each other.
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
      d.fillPoly(g.concat(med.slice().reverse()), 'rgba(176,120,26,0.13)');
      d.hatch([X(S.NOW), by, bw - (X(S.NOW) - bx), bh],
              { spacing: 2.2, angle: Math.PI / 2, weight: PEN.hairline, colour: INK.ochre,
                path: (dd) => {
                  const ctx = dd.ctx, poly = g.concat(med.slice().reverse());
                  poly.forEach((pt, i) => {
                    const px = dd.x(pt[0]), py = dd.y(pt[1]);
                    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
                  });
                  ctx.closePath();
                } });
    }
    d.polyline(g, { weight: PEN.thin, colour: INK.pencil, dash: [4, 2.4] });
    if (wideYr) {
      const gi = G.year.indexOf(wideYr), bi = B.year.indexOf(wideYr);
      const my = (Yv(G.p50[gi]) + Yv(B.p50[bi])) / 2;
      d.leader([X(wideYr), my], [X(wideYr) + 10, my - 8],
               `WHAT YOUR SETTINGS MOVED · ${B.p50[bi] - G.p50[gi] > 0 ? '+' : '−'}` +
               `${Math.abs(B.p50[bi] - G.p50[gi]).toFixed(2)} AT ${Math.floor(wideYr)}`,
               { colour: INK.ochre, size: 1.9 });
    }
    d.text([X(2098), Yv(G.p50[G.year.indexOf(2098)]) - 3.4], 'NOTHING SET',
           { size: 1.8, align: 'right', colour: INK.pencil, track: 0.12 });
  }
  d.polyline(med, { weight: PEN.outline, colour: INK.blue });

  // the record
  d.polyline(S.TRUNK.map((p) => [X(p[0]), Yv(p[1])]),
             { weight: PEN.outline, colour: INK.ink });
  d.text([X(2013), Yv(0.8)], 'RECORDED', { size: 2.1, colour: INK.ink, weight: 600, track: 0.14 });

  // today and the date index
  d.line([X(S.NOW), by], [X(S.NOW), by + bh + 2.0], { weight: PEN.medium, colour: INK.ink });
  d.text([X(S.NOW) + 1.6, by + bh - 3.4], 'TODAY',
         { size: 2.3, colour: INK.ink, weight: 700, track: 0.18 });
  d.line([X(S.yr), by], [X(S.yr), by + bh], { weight: PEN.thin, colour: INK.blue });
  d.polyline([[X(S.yr), by + bh], [X(S.yr) - 2.0, by + bh + 3.4], [X(S.yr) + 2.0, by + bh + 3.4]],
             { close: true, weight: PEN.thin, colour: INK.blue, fill: INK.blue });
  d.text([X(S.yr), by + bh + 5.6], String(Math.floor(S.yr)),
         { size: 2.2, align: 'center', face: 'figure', colour: INK.blue, weight: 700 });

  // crisis points
  const CRY = { 'deal-window': 2030, 'explosive-takeoff': 2028, 'no-sc-window': 2036,
                'alignment-fails': 2031, 'hard-deflate': 2028.5, 'researcher-by-2035': 2035 };
  // Leaders placed at a fixed alternating offset ran their labels into each other wherever two
  // crisis points sat close on the curve. Each label now takes the first slot that is clear of
  // the ones already placed, and the leader stretches to wherever that is.
  const placed = [];
  const SLOTS = [12, -12, 19, -19, 26, -26, 33, -33];
  const items = S.crisis.crises.map((c) => {
    const yr = CRY[c.id] || 2032;
    return { c, yr, cx: X(yr), cy: Yv(S.capAt(yr)) };
  }).sort((a, b) => a.cx - b.cx);
  for (const it of items) {
    const c = it.c;
    const p = c.kind === 'axis' ? (S.marginals[c.axis] || {})[c.pos] ?? c.p : c.p;
    const str = `${(p * 100).toFixed(0)}%  ${c.q.toUpperCase()}`;
    const tw = d.textWidth(str, { size: 1.85 });
    let off = SLOTS[SLOTS.length - 1];
    for (const cand of SLOTS) {
      const lx = it.cx + 7, ly = it.cy + cand - 1.0;
      const box = { x: lx, y: ly, w: tw + 1.5, h: 3.6 };
      if (!placed.some((q) => Math.min(q.x + q.w, box.x + box.w) - Math.max(q.x, box.x) > 0 &&
                              Math.min(q.y + q.h, box.y + box.h) - Math.max(q.y, box.y) > 0)) {
        off = cand; placed.push(box); break;
      }
    }
    d.polyline([[it.cx, it.cy - 2.2], [it.cx + 2.2, it.cy], [it.cx, it.cy + 2.2],
                [it.cx - 2.2, it.cy]],
               { close: true, weight: PEN.thin, colour: INK.red, fill: 'rgba(244,241,232,0.92)' });
    d.leader([it.cx, it.cy], [it.cx + 7, it.cy + off], str, { colour: INK.red, size: 1.85 });
    d.region(`crisis:${c.id}`, it.cx - 3.4, it.cy - 3.4, 6.8, 6.8, c);
  }

  // the date scrubber, drawn as a graduated bar under the chart
  const sy = 18;
  d.line([bx, sy], [bx + bw, sy], { weight: PEN.medium, colour: INK.ink });
  for (let yr = 2015; yr <= 2100; yr += 5) {
    const major = yr % 20 === 0;
    d.line([X(yr), sy], [X(yr), sy - (major ? 3.0 : 1.8)],
           { weight: PEN.hairline, colour: INK.inkLight });
  }
  const nx = X(S.yr);
  d.polyline([[nx, sy], [nx - 2.4, sy + 4.4], [nx + 2.4, sy + 4.4]],
             { close: true, weight: PEN.medium, colour: INK.blue, fill: INK.blue });
  d.text([bx, sy - 5.4], 'DRAG THE INDEX, OR CLICK ANYWHERE ON THE CHART, TO CHANGE THE DATE',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });
  d.region('ctl:time', bx - 4, sy - 3, bw + 8, 10);

  // the key, on the plate it explains
  const keys = [
    ['RECORDED', INK.ink, PEN.outline, null],
    ['MEDIAN OF SAMPLED FUTURES', INK.blue, PEN.outline, null],
    ['MILESTONE DATUM', INK.red, PEN.thin, [7, 2, 1.4, 2]],
    ['THE SAME FORECAST WITH NOTHING SET', INK.erase, PEN.thin, [4, 2.4]],
  ];
  keys.forEach((it, i) => {
    const kx = bx + (i % 2) * (bw * 0.44) + bw * 0.10;
    const ly = 7.4 - Math.floor(i / 2) * 4.2;
    d.line([kx, ly + 0.6], [kx + 11, ly + 0.6], { weight: it[2], colour: it[1], dash: it[3] });
    d.text([kx + 13, ly], it[0], { size: 1.8, colour: INK.pencil, track: 0.08 });
  });
  S.chartX = X; S.chartY = Yv; S.chartBox = [bx, by, bw, bh];
  return H;
}
forecast.height = () => 206;

// ── 3 · the controls ─────────────────────────────────────────────────────────
const ROW_H = 25, BTN_H = 27;

export function controls(d, S, H) {
  let y = head(d, H - 8, 'THE CONTROLS',
    'Each row is one variable in the model. Selecting a setting fixes that variable and ' +
    'redraws the whole document for it: the forecast, the described future, the instruments ' +
    'and the behaviour charts. Along the foot of each button is what that setting moves ' +
    'hardest, and by how much, measured in 2040 against the same model the charts draw. The ' +
    'percentage at the top right is the weight the network currently puts on that setting. ' +
    'Selecting the same button again releases the variable.');
  y -= 3;

  for (const a of S.network.axes) {
    const pin = S.pin[a.key];
    const marg = S.marginals[a.key] || {};
    d.text([PAD, y], a.name.toUpperCase(),
           { size: 2.6, weight: 700, track: 0.14, colour: pin ? INK.blue : INK.ink });
    const modal = Object.entries(marg).sort((p, q) => q[1] - p[1])[0];
    d.text([PAD + CW, y], pin ? 'SET BY YOU' :
             modal ? `MOST LIKELY: ${modal[0]} AT ${(modal[1] * 100).toFixed(0)}%` : '',
           { size: 1.8, align: 'right', colour: pin ? INK.blue : INK.inkLight, track: 0.12 });
    d.textBlock([PAD, y - 3.2], a.desc || '', CW,
                { size: 1.85, lead: 1.4, colour: INK.pencil, max: 2 });
    d.region(`axis:${a.key}`, PAD, y - 4, CW, 6, a);
    const n = a.positions.length;
    const bw = (CW - (n - 1) * 2.6) / n;
    const byy = y - 9.4 - BTN_H;
    a.positions.forEach((p, i) => {
      const bxx = PAD + i * (bw + 2.6);
      const eff = S.effect(a.key, p[0]);
      button(d, bxx, byy, bw, BTN_H, {
        name: p[1].split(' (')[0].toUpperCase(),
        desc: firstSentence(p[4]),
        on: pin === p[0], dim: !!pin && pin !== p[0],
        id: `ctl:pin:${a.key}:${p[0]}`, payload: p,
      });
      const w8 = (marg[p[0]] || 0) * 100;
      d.text([bxx + bw - 3.0, byy + BTN_H - 4.4],
             `${w8.toFixed(0)}%`,
             { size: 1.9, align: 'right', face: 'figure',
               colour: pin === p[0] ? INK.blue : INK.inkLight, weight: 700 });
      // What this setting moves, and by how much, in the quantity it moves hardest. Drawn in
      // ink: a rise in emissions and a rise in approval are the same kind of statement here.
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
    y -= ROW_H + BTN_H - 6;
  }

  // the two mode switches, and the release
  const mb = (CW - 5.2) / 3;
  button(d, PAD, y - BTN_H + 8, mb, BTN_H - 8, {
    name: 'SUPPOSE IT HAPPENS', on: !S.obs, id: 'ctl:mode:do',
    desc: 'Treat a setting as something done to the world; the other variables keep their ' +
          'prior weights.' });
  button(d, PAD + mb + 2.6, y - BTN_H + 8, mb, BTN_H - 8, {
    name: 'SUPPOSE WE LEARN IT', on: S.obs, id: 'ctl:mode:obs',
    desc: 'Treat a setting as news; the model reweights the other variables in light of it.' });
  button(d, PAD + (mb + 2.6) * 2, y - BTN_H + 8, mb, BTN_H - 8, {
    name: 'RELEASE ALL', on: false, id: 'ctl:reset',
    desc: 'Return every variable to the distribution the evidence produced.' });
  return H;
}
controls.height = (S) => 44 + S.network.axes.length * (ROW_H + BTN_H - 6) + BTN_H + 6;

// ── 4 · the note ─────────────────────────────────────────────────────────────
export const NOTE_COL = (CW - 12) / 2;

export function note(d, S, H) {
  const n = S.note;
  let y = H - 8;
  d.rect(PAD - 4, 4, CW + 8, H - 6, { weight: PEN.thin, colour: INK.red, alpha: 0.55 });
  d.text([PAD, y], n.title.toUpperCase(),
         { size: 3.4, weight: 700, track: 0.18, colour: INK.red });
  d.text([PAD + CW, y], n.eyebrow.toUpperCase(),
         { size: 1.9, align: 'right', colour: INK.inkLight, track: 0.16 });
  rule(d, y - 2.8, { weight: PEN.thin, colour: INK.red });
  y -= 7.4;
  n.cols.forEach((col, ci) => {
    const x = PAD + ci * (NOTE_COL + 12);
    let cy = y;
    for (const sec of col) {
      if (sec.h) {
        d.text([x, cy], sec.h.toUpperCase(),
               { size: 2.1, weight: 700, track: 0.16, colour: INK.ink });
        cy -= 3.8;
      }
      for (const p of sec.p || []) {
        if (!p) continue;
        cy -= d.textBlock([x, cy], p, NOTE_COL,
                          { size: 2.0, lead: LEAD, colour: INK.pencil }) + 2.0;
      }
      cy -= 2.4;
    }
  });
  return H;
}
note.height = (S) => S.note.h + 14;

// ── 5 · the future being forecast ────────────────────────────────────────────
export function future(d, S, H) {
  let y = head(d, H - 8, 'THE FUTURE BEING FORECAST',
    'Composed from the settings on the controls and the date on the index. Changing either ' +
    'rewrites this passage. The wording is authored; the figures are read from the same ' +
    'tracks the behaviour charts draw.');
  const colW = NOTE_COL;
  S.description.cols.forEach((col, ci) => {
    const x = PAD + ci * (colW + 12);
    let cy = y;
    for (const sec of col) {
      d.text([x, cy], sec.h.toUpperCase(),
             { size: 2.2, weight: 700, track: 0.16, colour: INK.blue });
      cy -= 3.8;
      for (const p of sec.p) {
        cy -= d.textBlock([x, cy], p, colW,
                          { size: 2.0, lead: LEAD, colour: INK.pencil }) + 2.0;
      }
      cy -= 2.6;
    }
  });
  // The scenes sit directly under the prose, so the section closes where its content does.
  const fw = (CW - 14) / 2, fh = 68;
  const fy = Math.max(8, y - S.description.h - 6 - fh);
  S.figures.forEach((f, i) => {
    drawFigure(d, f.key, PAD + i * (fw + 14), fy, fw, fh);
  });
  return H;
}
future.height = (S) => 26 + S.description.h + 76;

// ── 6 · the details ──────────────────────────────────────────────────────────
export function details(d, S, H) {
  let y = head(d, H - 8, 'DETAIL   THE INSTRUMENTS',
    'Three readings of the active world-line at the date on the index, each built as an ' +
    'instrument: a needle against an engraved face, floats riding in a manifold, and a lamp ' +
    'panel with its domain lettered beside it.');
  const colW = (CW - 16) / 3;
  const tops = y - 4;

  // A — the tempo dials
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

  // B — the compute manifold
  const bx = PAD + colW + 8;
  d.text([bx, tops], 'B   COMPUTE SHARES',
         { size: 2.8, weight: 700, track: 0.14, colour: INK.ink });
  d.textBlock([bx, tops - 3.6], 'Floats riding in tubes against one scale: each region\'s ' +
    'share of modelled global AI compute on this line, at this date.', colW,
    { size: 1.8, lead: 1.4, colour: INK.pencil });
  const tr = S.tracks;
  const i0 = S.idx;
  manifold(d, bx + 8, tops - 46, colW - 16, 30, [
    { k: 'US', v: tr.us[i0], c: INK.blue, wash: INK.blueWash },
    { k: 'CN', v: tr.cn[i0], c: INK.red, wash: 'rgba(150,44,38,0.20)' },
    { k: 'EU', v: tr.eu[i0], c: INK.green, wash: INK.greenWash },
    { k: 'ROW', v: Math.max(0, 1 - tr.us[i0] - tr.cn[i0] - tr.eu[i0]),
      c: INK.pencil, wash: 'rgba(52,50,48,0.16)' },
  ], { id: 'manifold' });
  // The manifold puts its own legends 2.6 and 5.4 mm below the tubes, so the total clears them.
  d.text([bx, tops - 60], `TOTAL ${fmtNum(tr.gw[i0])} GW · ${fmtNum(tr.twh[i0])} TWH/YR`,
         { size: 2.1, face: 'figure', colour: INK.warm, weight: 700 });
  d.textBlock([bx, tops - 64], 'The total is the modelled build-out on this line. The energy ' +
    'figure is that capacity run at the utilisation the parent model assumes.', colW,
    { size: 1.75, lead: 1.4, colour: INK.pencilLight });

  // C — the domain panel, expanded
  const cx = PAD + (colW + 8) * 2;
  d.text([cx, tops], 'C   CAPABILITY DOMAINS',
         { size: 2.8, weight: 700, track: 0.14, colour: INK.ink });
  d.textBlock([cx, tops - 3.6], 'A lamp trips when the active line crosses that domain\'s ' +
    'threshold on the ladder. The year given is when this line crosses it.', colW,
    { size: 1.8, lead: 1.4, colour: INK.pencil });
  const cap = S.cap;
  let dy = tops - 10;
  S.engine.domains.forEach((dm, i) => {
    const on = cap >= dm.th;
    const yr = S.crossYear(dm.th);
    d.rect(cx, dy - 8.6, colW, 8.2, {
      weight: on ? PEN.thin : PEN.hairline, colour: on ? INK.ink : INK.inkLight,
      fill: on ? 'rgba(178,86,24,0.14)' : null, solid: on, label: 'lamp',
    });
    if (on) {
      d.dot([cx + 3.0, dy - 4.4], 1.3, { colour: INK.warm });
    } else {
      d.dot([cx + 3.0, dy - 4.4], 1.3, { colour: INK.inkLight, hollow: true });
    }
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
  // The tally letters its own caption; a second heading above it said the same thing twice.
  tally(d, cx, dy - 4.0, colW, { n: tr.copies[i0], speed: tr.speed[i0], id: 'tally' });
  return H;
}
details.height = (S) => 34 + Math.max(100, S.engine.domains.length * 9.4 + 30);

// ── 7 · behaviour over time ──────────────────────────────────────────────────
export function behaviour(d, S, H) {
  let y = head(d, H - 8, 'BEHAVIOUR OVER TIME',
    'Six quantities on the active world-line, 2026 to 2100. Each pen sits at the date on the ' +
    'index and its reading is printed beside it. The scale of each chart is derived from its ' +
    'own series, so the shape is comparable across settings even when the magnitude is not.');
  const tr = S.tracks, yrs = tr.year;
  const cw = (CW - 24) / 3, ch = (y - 22) / 2 - 12;
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
      note: 'Cumulative employment effect. The shock rate follows the 2028 crisis memo\'s ' +
            'published path.' },
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
    const py = 22 + (1 - Math.floor(i / 3)) * (ch + 24);
    const lo = Math.min(...p.d), hi = Math.max(...p.d);
    const pad = (hi - lo) * 0.08 || 1;
    strip(d, px + 10, py + 15, cw - 12, ch - 15, {
      data: p.d, years: yrs, y0: lo - pad, y1: hi + pad, colour: p.c,
      label: p.label, unit: p.unit, now: Math.max(S.engine.y0, S.yr), id: p.id, fmt: p.fmt,
    });
    // The recorder engraves its own vertical scale hard against the frame, so the years go
    // under the frame line rather than beside the zero, where they ran into it.
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
  return H;
}
behaviour.height = () => 250;

// ── 8 · the world ────────────────────────────────────────────────────────────
export function world(d, S, H) {
  const y = head(d, H - 8, 'THE WORLD',
    'The active world-line on the ground. Hatch density carries each region\'s share of ' +
    'modelled compute; the warm marks are sites drawn at the capacity this line gives them at ' +
    'this date. Site positions are authored from the record; the capacities are modelled.');
  S.drawWorld(d, S, [PAD, 16, CW, y - 22]);
  return H;
}
world.height = () => 200;

// ── 9 · alternatives ─────────────────────────────────────────────────────────
export function alternatives(d, S, H) {
  const y = head(d, H - 8, 'ALTERNATIVE FUTURES',
    'Twelve sampled world-lines drawn across the spread, from the slowest quarter to the ' +
    'fastest. Each panel shows that line\'s capability path against the same milestone rules. ' +
    'Selecting one makes it the active line through the whole document.');
  S.drawAlts(d, S, [PAD, 14, CW, y - 20]);
  return H;
}
alternatives.height = () => 232;

// ── 10 · this morning ────────────────────────────────────────────────────────
export function morning(d, S, H) {
  const y = head(d, H - 8, "THIS MORNING'S REVISION",
    'What the evidence moved on the network today, with the arithmetic that moved it: impact ' +
    'class, corroborating sources, novelty decay, the positions changed and the development ' +
    'that drove them. The newest application is ringed in a revision cloud.');
  S.drawMorning(d, S, [PAD, 14, CW, y - 20]);
  return H;
}
morning.height = () => 190;

// ── 11 · sources ─────────────────────────────────────────────────────────────
export function sources(d, S, H) {
  let y = head(d, H - 8, 'METHOD AND SOURCES', null);
  const g = S.grounding.counts;
  const colW = (CW - 12) / 2;
  const left = [
    ['WHERE THE PROBABILITIES COME FROM',
     `A documented belief network of ${S.network.axes.length} variables with sub-variables, ` +
     `priors carrying provenance, and cited conditional relationships, sampled into an ` +
     `ensemble of world-lines. ${g.direct} wiki pages ground the engine directly and ` +
     `${g.corpus} more feed the recorded past. Variables with thin grounding get wider ` +
     `priors, so uncertainty is inherited and stated. These are the model's ` +
     `structured judgments, documented and adjustable, and scored in public as registered ` +
     `claims resolve.`],
    ['THE DAILY UPDATE',
     'Each morning the day\'s developments are classified against cited evidence rules under ' +
     'a tiered impact methodology, scaled by corroboration and damped by repetition. Every ' +
     'application logs its arithmetic and its driver. A morning with few applications leaves ' +
     'residue, which the weekly schema review can answer by adding a variable on its own ' +
     'authority; such additions are marked as provisional wherever they appear.'],
  ];
  const right = [
    ['THE LITERATURE, TAKEN APART',
     'AI 2027 and its endings · AI 2040 Plan A and the plan family scored beside it · ' +
     'Situational Awareness · Europe 2031 · Machines of Loving Grace · AI as Normal ' +
     'Technology · The 2028 Global Intelligence Crisis · Anthropic\'s 2028 scenarios. Each is ' +
     'quarried for positions, parameters and event templates, and cited where its parts are ' +
     'used. No scenario is reproduced whole.'],
    ['THIS SHEET',
     'A second surface on the AI Atlas forecast engine, which holds the network, the evidence ' +
     'layer and the nightly gate. This document reads that engine\'s emitted forecast and ' +
     'publishes only when its gate passes. The drafting conventions follow The Systems Works.'],
  ];
  let ly = y, ry = y;
  for (const [h, p] of left) {
    d.text([PAD, ly], h, { size: 2.1, weight: 700, track: 0.16, colour: INK.red });
    ly -= 3.6;
    ly -= d.textBlock([PAD, ly], p, colW, { size: 1.9, lead: 1.45, colour: INK.pencil }) + 3.0;
  }
  for (const [h, p] of right) {
    const x = PAD + colW + 12;
    d.text([x, ry], h, { size: 2.1, weight: 700, track: 0.16, colour: INK.red });
    ry -= 3.6;
    ry -= d.textBlock([x, ry], p, colW, { size: 1.9, lead: 1.45, colour: INK.pencil }) + 3.0;
  }
  const foot = Math.min(ly, ry) - 4;
  rule(d, foot, { weight: PEN.thin, colour: INK.inkLight });
  d.text([PAD, foot - 4.4],
         `DATA ${S.build} · NETWORK ${S.network.version.toUpperCase()} · READ ${S.network.date}`,
         { size: 1.8, face: 'figure', colour: INK.inkLight, track: 0.06 });
  return H;
}
sources.height = () => 150;

export const SECTIONS = [
  { id: 'header', fn: header }, { id: 'forecast', fn: forecast },
  { id: 'controls', fn: controls }, { id: 'note', fn: note },
  { id: 'future', fn: future }, { id: 'details', fn: details },
  { id: 'behaviour', fn: behaviour }, { id: 'world', fn: world },
  { id: 'alternatives', fn: alternatives }, { id: 'morning', fn: morning },
  { id: 'sources', fn: sources },
];
