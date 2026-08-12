// THE FORECAST WORKS — the instruments
//
// The house rule this project inherits: BUILD THE INSTRUMENT, DON'T DRAW THE GRAPHIC. Where a
// real instrument already performs the abstraction, build that instead of a chart of it.
//
//   a probability            → an engraved dial with a needle
//   a probability that MOVED → a second needle, so the drift is an ANGLE you can see
//   a share of a total       → float tubes on a manifold, read against one scale
//   a threshold crossed      → an annunciator lamp, dark until it trips
//   a quantity over time     → a strip-chart recorder with its pen at the current date
//   a count of things        → tally squares, one per unit, because that is what a count is
//
// Everything is in sheet millimetres and goes through Draft.

import { PEN, INK } from './draft.js?v=20260811-2247';

// ── the dial ─────────────────────────────────────────────────────────────────
// An engraved 240° face. The LIVE needle is ink; the GHOST needle is where the same reading
// stood 30 days ago, drawn in the erase grey a draughtsman leaves behind a moved part. The gap
// between them is the drift — an angle, not a signed number in small print.
export function dial(d, cx, cy, r, { label, value, was = null, sub = '', id = null,
                                     colour = null, ticks = 5 } = {}) {
  const A0 = Math.PI * 1.20, A1 = -Math.PI * 0.20;      // sweep, ccw from lower-left
  const ang = (v) => A0 + (A1 - A0) * Math.max(0, Math.min(1, v));
  const c = colour ?? INK.ink;
  d.arc([cx, cy], r, A1, A0, { weight: PEN.medium, colour: INK.ink });
  d.arc([cx, cy], r * 0.78, A1, A0, { weight: PEN.hairline, colour: INK.inkLight });
  for (let i = 0; i <= ticks; i++) {
    const v = i / ticks, a = ang(v);
    const long = i === 0 || i === ticks || i * 2 === ticks;
    const r0 = long ? r * 0.72 : r * 0.80;
    d.line([cx + Math.cos(a) * r0, cy + Math.sin(a) * r0],
           [cx + Math.cos(a) * r, cy + Math.sin(a) * r],
           { weight: long ? PEN.thin : PEN.hairline, colour: INK.inkLight });
    // Scale figures are engraved OUTSIDE the arc at its ends, as on a panel meter. Inside,
    // they sat on the readout — the audit caught 0/50/100 overprinting the value.
    if (long) {
      const inside = i * 2 === ticks;
      const rt = inside ? r * 0.62 : r * 1.17;
      d.text([cx + Math.cos(a) * rt, cy + Math.sin(a) * rt - (inside ? -0.6 : 0.5)],
             String(Math.round(v * 100)),
             { size: 1.5, align: 'center', colour: INK.pencilLight, face: 'figure' });
    }
  }
  if (was !== null && Math.abs(was - value) > 0.0005) {
    const a = ang(was);
    d.line([cx, cy], [cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88],
           { weight: PEN.thin, colour: INK.erase });
    d.dot([cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88], 0.4,
          { colour: INK.erase });
    // the swept angle, shaded, so the eye lands on the movement rather than the position
    const a2 = ang(value);
    const ctx = d.ctx;
    ctx.beginPath();
    const [px, py] = d.p([cx, cy]);
    ctx.moveTo(px, py);
    ctx.arc(px, py, d.s(r * 0.88), -Math.max(a, a2), -Math.min(a, a2));
    ctx.closePath();
    ctx.fillStyle = value > was ? 'rgba(24,96,78,0.16)' : 'rgba(150,44,38,0.16)';
    ctx.fill();
  }
  const a = ang(value);
  d.line([cx, cy], [cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88],
         { weight: PEN.medium, colour: c });
  d.dot([cx, cy], 0.85, { colour: INK.ink });
  d.dot([cx, cy], 0.42, { colour: '#f4f1e8' });
  d.text([cx, cy - r * 0.52], (value * 100).toFixed(0) + '%',
         { size: 2.6, align: 'center', colour: c, weight: 700, face: 'figure' });
  if (label) d.text([cx, cy - r - 3.4], label,
                    { size: 1.9, align: 'center', colour: INK.ink, weight: 600, track: 0.14 });
  if (sub) d.text([cx, cy - r - 6.0], sub,
                  { size: 1.5, align: 'center', colour: INK.pencilLight, track: 0.10 });
  if (id) d.region(id, cx - r * 1.2, cy - r - 7, r * 2.4, r * 2 + 9);
}

// ── the graduated column ─────────────────────────────────────────────────────
// A sight glass. A probability is a level in a tube against an engraved scale — the reading a
// crisis point actually is: how full is this outcome.
export function column(d, x, y, w, h, { value, label, sub = '', id = null,
                                        colour = null, was = null } = {}) {
  const c = colour ?? INK.blue;
  d.rect(x, y, w, h, { weight: PEN.thin, colour: INK.ink });
  const fill = Math.max(0, Math.min(1, value)) * h;
  d.hatch([x + 0.25, y + 0.25, w - 0.5, fill - 0.5],
          { spacing: 0.9, angle: Math.PI / 2.6, weight: PEN.hairline, colour: c });
  d.line([x, y + fill], [x + w, y + fill], { weight: PEN.medium, colour: c });
  for (let i = 0; i <= 4; i++) {
    const ty = y + (i / 4) * h;
    d.line([x + w, ty], [x + w + (i % 2 ? 0.8 : 1.5), ty],
           { weight: PEN.hairline, colour: INK.inkLight });
    if (i % 2 === 0) d.text([x + w + 2.1, ty - 0.55], String(i * 25),
                            { size: 1.4, colour: INK.pencilLight, face: 'figure' });
  }
  if (was !== null && Math.abs(was - value) > 0.002) {
    const wy = y + Math.max(0, Math.min(1, was)) * h;
    d.line([x - 1.2, wy], [x + w + 0.6, wy],
           { weight: PEN.hairline, colour: INK.erase, dash: [1.2, 1.0] });
  }
  d.text([x + w / 2, y - 2.4], (value * 100).toFixed(0) + '%',
         { size: 2.0, align: 'center', colour: c, weight: 700, face: 'figure' });
  if (label) {
    const lines = d.wrap(label, h - 2, { size: 1.6 });
    d.text([x - 1.6, y + h - 0.4], lines[0], { size: 1.6, colour: INK.ink,
                                               align: 'left', angle: Math.PI / 2, track: 0.12 });
  }
  if (sub) d.text([x + w / 2, y - 5.0], sub,
                  { size: 1.4, align: 'center', colour: INK.pencilLight });
  if (id) d.region(id, x - 6, y - 6, w + 12, h + 10);
}

// ── the annunciator ──────────────────────────────────────────────────────────
// A row of lamps behind engraved legends. Dark = not reached; lit = the active world-line has
// crossed this domain's threshold at the current date. An annunciator panel is exactly the
// instrument for "which of these has tripped", which is what the capability domains are.
export function annunciator(d, x, y, w, items, { cols = 2, id = null } = {}) {
  const lw = w / cols, lh = 5.6;
  items.forEach((it, i) => {
    const cx = x + (i % cols) * lw, cy = y - Math.floor(i / cols) * lh;
    const on = it.on;
    d.rect(cx, cy - lh + 1.2, lw - 1.6, lh - 1.6,
           { weight: PEN.thin, colour: on ? INK.ink : INK.inkLight,
             fill: on ? 'rgba(178,86,24,0.16)' : 'rgba(120,116,110,0.05)' });
    if (on) d.hatch([cx + 0.3, cy - lh + 1.5, lw - 2.2, lh - 2.2],
                    { spacing: 0.7, angle: -Math.PI / 4, weight: PEN.hairline,
                      colour: INK.warmWash });
    d.text([cx + 1.4, cy - lh + 2.6], it.k,
           { size: 1.7, colour: on ? INK.ink : INK.pencilLight, weight: 700, track: 0.14 });
    d.text([cx + lw - 3.0, cy - lh + 2.6], it.th.toFixed(1),
           { size: 1.4, colour: INK.pencilLight, align: 'right', face: 'figure' });
    if (id) d.region(`${id}:${i}`, cx, cy - lh + 1.2, lw - 1.6, lh - 1.6);
  });
  return Math.ceil(items.length / cols) * lh;
}

// ── the manifold ─────────────────────────────────────────────────────────────
// Float tubes side by side on one scale: shares of a total read the way a rotameter bank is
// read. A pie makes you compare angles; a manifold makes you compare heights against a rule.
export function manifold(d, x, y, w, h, series, { id = null, unit = '%' } = {}) {
  const n = series.length, tw = Math.min(6.5, (w - (n - 1) * 3) / n);
  for (let i = 0; i <= 4; i++) {
    const ty = y + (i / 4) * h;
    d.line([x - 1.6, ty], [x + w, ty],
           { weight: PEN.hairline, colour: i % 2 ? INK.pencilLight : INK.inkLight,
             dash: i % 2 ? [0.8, 1.2] : null });
    if (i % 2 === 0) d.text([x - 2.2, ty - 0.55], String(i * 25),
                            { size: 1.4, align: 'right', colour: INK.pencilLight, face: 'figure' });
  }
  series.forEach((s, i) => {
    const cx = x + i * (tw + 3);
    d.rect(cx, y, tw, h, { weight: PEN.hairline, colour: INK.inkLight });
    const fh = Math.max(0, Math.min(1, s.v)) * h;
    d.rect(cx + 0.3, y + 0.3, tw - 0.6, Math.max(0.3, fh - 0.6),
           { weight: 0, fill: s.wash ?? INK.blueWash });
    d.hatch([cx + 0.3, y + 0.3, tw - 0.6, Math.max(0.3, fh - 0.6)],
            { spacing: 1.0, angle: Math.PI / 3, weight: PEN.hairline, colour: s.c });
    // the float: a machined bob riding at the reading
    d.polyline([[cx + 0.2, y + fh], [cx + tw / 2, y + fh + 1.3], [cx + tw - 0.2, y + fh],
                [cx + tw / 2, y + fh - 1.3]],
               { close: true, weight: PEN.thin, colour: s.c, fill: 'rgba(244,241,232,0.9)' });
    // Both legends sit BELOW the tubes. Putting the reading above them ran it into the
    // panel's own sub-caption, which the audit reported eleven times over.
    d.text([cx + tw / 2, y - 2.6], s.k,
           { size: 1.6, align: 'center', colour: INK.ink, weight: 700, track: 0.10 });
    d.text([cx + tw / 2, y - 5.4], (s.v * 100).toFixed(0) + unit,
           { size: 1.5, align: 'center', colour: s.c, face: 'figure' });
    if (id) d.region(`${id}:${s.k}`, cx - 1, y - 6.5, tw + 2, h + 8, s);
  });
}

// ── the strip-chart recorder ─────────────────────────────────────────────────
// A pen on a moving chart: the instrument that draws a quantity against time, with its scale
// engraved on the left and the pen sitting at the current date.
export function strip(d, x, y, w, h, { data, years, y0, y1, colour = null, label, unit = '',
                                       now = null, id = null, dash = null, extra = null,
                                       fmt = (v) => v.toFixed(0) }) {
  const c = colour ?? INK.ink;
  d.rect(x, y, w, h, { weight: PEN.hairline, colour: INK.inkLight });
  for (let i = 1; i < 4; i++) {
    d.line([x, y + (i / 4) * h], [x + w, y + (i / 4) * h],
           { weight: PEN.hairline, colour: INK.pencilLight, dash: [0.7, 1.3] });
  }
  const X = (yr) => x + ((yr - years[0]) / (years[years.length - 1] - years[0])) * w;
  const Y = (v) => y + Math.max(0, Math.min(1, (v - y0) / (y1 - y0))) * h;
  const draw = (arr, col, dsh) => {
    const pts = [];
    for (let i = 0; i < arr.length; i++) pts.push([X(years[i]), Y(arr[i])]);
    const ctx = d.ctx;
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const px = d.x(pt[0]), py = d.y(pt[1]);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    d.stroke({ weight: PEN.thin, colour: col, dash: dsh });
  };
  if (extra) draw(extra.data, extra.c ?? INK.pencilLight, [2.2, 1.4]);
  draw(data, c, dash);
  d.text([x + 0.8, y + h - 2.0], label,
         { size: 1.7, colour: INK.ink, weight: 700, track: 0.12 });
  d.text([x + w - 0.8, y + h - 2.0], unit,
         { size: 1.4, colour: INK.pencilLight, align: 'right' });
  d.text([x - 0.9, y + h - 1.2], fmt(y1),
         { size: 1.3, align: 'right', colour: INK.pencilLight, face: 'figure' });
  d.text([x - 0.9, y + 0.4], fmt(y0),
         { size: 1.3, align: 'right', colour: INK.pencilLight, face: 'figure' });
  if (now !== null) {
    const nx = X(now);
    d.line([nx, y], [nx, y + h], { weight: PEN.hairline, colour: INK.red });
    const i = Math.max(0, Math.min(data.length - 1, Math.round(now - years[0])));
    d.dot([nx, Y(data[i])], 0.55, { colour: INK.red });
    d.text([Math.min(nx + 1.2, x + w - 12), Y(data[i]) + 1.4], fmt(data[i]),
           { size: 1.6, colour: INK.red, weight: 700, face: 'figure' });
  }
  if (id) d.region(id, x, y, w, h);
}

// ── tally squares ────────────────────────────────────────────────────────────
// A count drawn as a count. Each square is a decade of copies on a log tally, so the block
// grows the way the number does and the reader sees an order of magnitude as an area.
export function tally(d, x, y, w, { n, speed, id = null }) {
  const cell = 1.5, gap = 0.5, cols = Math.floor(w / (cell + gap));
  const units = n > 0 ? Math.max(1, Math.round(Math.log10(n + 1) * 9)) : 0;
  for (let i = 0; i < units; i++) {
    const cx = x + (i % cols) * (cell + gap), cy = y - Math.floor(i / cols) * (cell + gap);
    d.rect(cx, cy - cell, cell, cell,
           { weight: PEN.hairline, colour: INK.ink, fill: 'rgba(24,28,38,0.55)' });
  }
  const rows = Math.ceil(units / cols) || 1;
  const h = rows * (cell + gap);
  d.text([x, y - h - 1.4], n > 0
    ? `${fmtNum(n)} copies · ${speed}× human speed`
    : 'agent collectives: below threshold',
    { size: 1.7, colour: n > 0 ? INK.ink : INK.pencilLight, weight: 600, track: 0.06 });
  if (id) d.region(id, x, y - h - 3, w, h + 4);
  return h + 3;
}

export function fmtNum(v) {
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
  return String(Math.round(v));
}
