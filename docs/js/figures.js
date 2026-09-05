// AI FUTURES FORECASTER — the figures
//
// Drawn scenes, in the same ink and pen weights as the rest of the document. Each depicts a
// condition the active world-line is in, and each carries a caption naming what it depicts and
// which setting selected it. Each is a drawing of a described future; the caption says so.
//
// The register follows the drafting convention used throughout: hairline construction, medium
// outlines on built form, hatching for material, wash for water and sky, warm ink for anything
// carrying energy, green for anything verified, red for anything contested.

import { PEN, INK } from './draft.js?v=20260905-1131';

// A deterministic jitter, so a scene is the same drawing every time it is redrawn.
function rnd(seed) {
  let s = seed | 0;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

// Sky, horizon and ground: the three registers every scene is built on. `sky` and `land` are
// wash colours; `hz` is the horizon as a fraction of the frame height.
function stage(d, b, { sky, land, hz = 0.42, sun = null, haze = 0 }) {
  const { x, y, w, h } = b;
  const sea = y + h * hz;
  d.rect(x, y, w, h, { weight: PEN.thin, colour: INK.inkLight });
  d.rect(x, sea, w, h - h * hz, { weight: 0, fill: sky });
  // graded sky: horizontal hairlines thinning upward read as a wash on paper
  const r = rnd(4211);
  for (let i = 0; i < 22; i++) {
    const t = i / 22;
    const yy = sea + (h - h * hz) * t;
    if (r() > 0.25 + t * 0.65) continue;
    d.line([x + 1, yy], [x + w - 1, yy],
           { weight: PEN.hairline, colour: INK.blueLight, alpha: 0.30 * (1 - t) + 0.05 });
  }
  if (sun) {
    d.arc(sun, h * 0.055, 0, Math.PI * 2, { weight: PEN.thin, colour: INK.warm, alpha: 0.75 });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      d.line([sun[0] + Math.cos(a) * h * 0.07, sun[1] + Math.sin(a) * h * 0.07],
             [sun[0] + Math.cos(a) * h * 0.095, sun[1] + Math.sin(a) * h * 0.095],
             { weight: PEN.hairline, colour: INK.warm, alpha: 0.55 });
    }
  }
  if (haze) {
    for (let i = 0; i < 5; i++) {
      const yy = sea + h * (0.06 + i * 0.05);
      d.line([x + 2, yy], [x + w - 2, yy],
             { weight: PEN.hairline, colour: INK.warm, alpha: haze * (1 - i * 0.17) });
    }
  }
  d.rect(x, y, w, h * hz, { weight: 0, fill: land });
  d.line([x, sea], [x + w, sea], { weight: PEN.thin, colour: INK.ink });
  return { x, y, w, h, sea, r };
}

function caption(d, x, y, w, title, sub) {
  d.text([x, y], title, { size: 2.2, weight: 700, track: 0.14, colour: INK.ink });
  if (sub) d.textBlock([x, y - 3.2], sub, w, { size: 1.75, lead: 1.42, colour: INK.pencil });
}

// A small human, for scale. Two strokes and a dot; enough to say how big the rest is.
function person(d, x, y, s, colour) {
  d.dot([x, y + s * 0.86], s * 0.13, { colour });
  d.line([x, y], [x, y + s * 0.72], { weight: PEN.hairline, colour });
  d.line([x - s * 0.2, y + s * 0.26], [x + s * 0.2, y + s * 0.26],
         { weight: PEN.hairline, colour });
}

function plume(d, x, y, s, colour, alpha = 0.5) {
  for (let k = 0; k < 5; k++) {
    d.arc([x + k * s * 0.18, y + s * (0.5 + k * 0.55)], s * (0.45 + k * 0.22),
          0.15, Math.PI - 0.15, { weight: PEN.hairline, colour, alpha: alpha * (1 - k * 0.16) });
  }
}

// ── 1 · compute sited outside any jurisdiction ───────────────────────────────
function offshore(d, b) {
  const S = stage(d, b, { sky: 'rgba(58,132,214,0.055)', land: 'rgba(58,132,214,0.10)',
                          hz: 0.40, sun: [b.x + b.w * 0.82, b.y + b.h * 0.78] });
  const { x, y, w, h, sea } = S;
  // water: registers of swell, closer swells taller
  for (let i = 0; i < 18; i++) {
    const t = i / 18, yy = y + t * h * 0.40, pts = [];
    for (let k = 0; k <= 46; k++) {
      pts.push([x + (k / 46) * w, yy + Math.sin(k * 0.62 + i * 1.7) * (0.22 + t * 0.9)]);
    }
    d.polyline(pts, { weight: PEN.hairline, colour: INK.blue, alpha: 0.16 + t * 0.34 });
  }
  // the jurisdiction line: the whole point of the scene
  d.line([x, y + h * 0.30], [x + w, y + h * 0.30],
         { weight: PEN.thin, colour: INK.red, dash: [4, 2, 1, 2], alpha: 0.85 });
  d.text([x + 2, y + h * 0.30 + 1.4], 'TERRITORIAL LIMIT',
         { size: 1.5, colour: INK.red, track: 0.14, pocket: true });
  // a far shore, so the limit has two sides
  d.polyline([[x, sea + 1.2], [x + w * 0.18, sea + 2.4], [x + w * 0.30, sea + 1.4],
              [x + w * 0.42, sea + 2.0], [x + w * 0.5, sea + 1.1]],
             { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.7 });
  // the platform
  const px = x + w * 0.24, pw = w * 0.50, deck = sea + h * 0.09;
  d.polyline([[px - 2.4, sea - 0.6], [px + pw + 2.4, sea - 0.6],
              [px + pw - 3, deck], [px + 3, deck]],
             { close: true, weight: PEN.outline, colour: INK.ink, fill: 'rgba(253,253,251,0.9)' });
  d.hatch([px - 2, sea - 0.6, pw + 4, deck - sea + 0.6],
          { spacing: 1.3, angle: Math.PI / 4, weight: PEN.hairline, colour: INK.inkLight });
  // legs into the water
  for (const f of [0.1, 0.35, 0.65, 0.9]) {
    d.line([px + pw * f, sea - 0.6], [px + pw * f, sea - h * 0.10],
           { weight: PEN.thin, colour: INK.inkLight });
  }
  // halls in two ranks
  const hallW = pw / 5.4;
  for (let i = 0; i < 5; i++) {
    const hx = px + 3 + i * hallW, hh = h * 0.085;
    d.rect(hx, deck, hallW - 1.4, hh,
           { weight: PEN.medium, colour: INK.ink, fill: 'rgba(253,253,251,0.92)' });
    d.hatch([hx, deck, hallW - 1.4, hh],
            { spacing: 1.0, angle: -Math.PI / 3, weight: PEN.hairline, colour: INK.inkLight });
    if (i < 4) {
      d.rect(hx + 1.6, deck + hh + 0.6, hallW - 4.6, h * 0.055,
             { weight: PEN.thin, colour: INK.ink, fill: 'rgba(253,253,251,0.92)' });
    }
  }
  // cooling stacks, warm because they carry the energy
  for (let i = 0; i < 4; i++) {
    const sx = px + pw * (0.14 + i * 0.24);
    d.rect(sx, deck + h * 0.155, 2.0, h * 0.09, { weight: PEN.thin, colour: INK.warm });
    plume(d, sx + 1.0, deck + h * 0.245, 1.5, INK.warm, 0.55);
  }
  // the cable to shore, and a tender alongside for scale
  d.polyline([[px, sea - h * 0.06], [x + w * 0.12, sea - h * 0.13], [x, sea - h * 0.15]],
             { weight: PEN.medium, colour: INK.ochre });
  d.text([x + 2, sea - h * 0.19], 'SUBSEA CABLE',
         { size: 1.5, colour: INK.ochre, track: 0.12, pocket: true });
  d.polyline([[px + pw + 6, sea - 1.2], [px + pw + 14, sea - 1.2],
              [px + pw + 12.5, sea - 3.0], [px + pw + 7.5, sea - 3.0]],
             { close: true, weight: PEN.thin, colour: INK.ink, fill: 'rgba(253,253,251,0.9)' });
  person(d, px + 5, deck + h * 0.085, h * 0.05, INK.ink);
  person(d, px + 8, deck + h * 0.085, h * 0.05, INK.ink);
  d.text([x + w - 2, y + h * 0.06], 'OUTSIDE ANY JURISDICTION',
         { size: 1.6, align: 'right', colour: INK.red, track: 0.16, weight: 700, pocket: true });
}

// ── 2 · the gigawatt campus ──────────────────────────────────────────────────
function campus(d, b) {
  const S = stage(d, b, { sky: 'rgba(178,86,24,0.045)', land: 'rgba(52,50,48,0.06)',
                          hz: 0.34, haze: 0.30, sun: [b.x + b.w * 0.14, b.y + b.h * 0.80] });
  const { x, y, w, h, sea } = S;
  // far ridge
  const ridge = [[x, sea + 0.8]];
  const r = rnd(9931);
  for (let k = 1; k <= 20; k++) ridge.push([x + (k / 20) * w, sea + 0.6 + r() * h * 0.06]);
  d.polyline(ridge, { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.6 });
  // halls, three receding ranks
  const ranks = [{ n: 6, sc: 0.55, off: 0.16, a: 0.55 }, { n: 5, sc: 0.78, off: 0.09, a: 0.8 },
                 { n: 4, sc: 1.0, off: 0.02, a: 1 }];
  ranks.forEach((rk, ri) => {
    const hw = (w * 0.80) / rk.n, hh = h * 0.10 * rk.sc;
    for (let i = 0; i < rk.n; i++) {
      const hx = x + w * 0.10 + i * hw + (ri % 2) * 2;
      const hy = sea - h * rk.off * 0.4 + h * rk.off;
      d.rect(hx, hy, hw - 2.2, hh,
             { weight: ri === 2 ? PEN.medium : PEN.thin, colour: INK.ink,
               fill: 'rgba(253,253,251,0.9)', alpha: rk.a });
      d.hatch([hx, hy, hw - 2.2, hh],
              { spacing: 1.1, angle: Math.PI / 3, weight: PEN.hairline, colour: INK.inkLight });
      // roof plant
      for (let k = 0; k < 3; k++) {
        d.rect(hx + 1.4 + k * (hw - 5) / 3, hy + hh, (hw - 6) / 4, hh * 0.16,
               { weight: PEN.hairline, colour: INK.warm, alpha: rk.a });
      }
    }
  });
  // substation and transmission running off frame — where the power comes from
  const sx = x + w * 0.80;
  d.rect(sx, sea - h * 0.01, w * 0.09, h * 0.075,
         { weight: PEN.thin, colour: INK.warm, fill: 'rgba(178,86,24,0.10)' });
  d.hatch([sx, sea - h * 0.01, w * 0.09, h * 0.075],
          { spacing: 1.0, angle: -Math.PI / 4, weight: PEN.hairline, colour: INK.warm });
  d.text([sx, sea - h * 0.05], 'SUBSTATION',
         { size: 1.5, colour: INK.warm, track: 0.12, pocket: true });
  for (let i = 0; i < 4; i++) {
    const tx = sx + w * 0.11 + i * w * 0.045, th = h * (0.13 - i * 0.014);
    d.line([tx, sea], [tx, sea + th], { weight: PEN.thin, colour: INK.warm, alpha: 0.85 });
    d.line([tx - 2.4, sea + th * 0.82], [tx + 2.4, sea + th * 0.82],
           { weight: PEN.hairline, colour: INK.warm });
    d.line([tx - 1.8, sea + th], [tx + 1.8, sea + th], { weight: PEN.hairline, colour: INK.warm });
    if (i) {
      const px0 = sx + w * 0.11 + (i - 1) * w * 0.045;
      for (const f of [0.82, 1.0]) {
        d.polyline([[px0, sea + th / (1 - (i - 1) * 0.11) * f], [tx, sea + th * f]],
                   { weight: PEN.hairline, colour: INK.warm, alpha: 0.6 });
      }
    }
  }
  // cooling ponds
  for (let i = 0; i < 2; i++) {
    const bx = x + w * (0.10 + i * 0.30), bw = w * 0.24, byy = y + h * 0.09;
    d.rect(bx, byy, bw, h * 0.06,
           { weight: PEN.thin, colour: INK.blue, fill: 'rgba(58,132,214,0.13)' });
    for (let k = 0; k < 3; k++) {
      d.line([bx + 1, byy + h * 0.015 * (k + 1)], [bx + bw - 1, byy + h * 0.015 * (k + 1)],
             { weight: PEN.hairline, colour: INK.blue, alpha: 0.4 });
    }
  }
  d.text([x + w * 0.10, y + h * 0.055], 'COOLING',
         { size: 1.5, colour: INK.blue, track: 0.12, pocket: true });
  // the perimeter and the people at it
  d.line([x, y + h * 0.20], [x + w, y + h * 0.20],
         { weight: PEN.hairline, colour: INK.inkLight, dash: [1.6, 1.2] });
  person(d, x + w * 0.70, y + h * 0.20, h * 0.06, INK.ink);
  person(d, x + w * 0.73, y + h * 0.20, h * 0.06, INK.ink);
}

// ── 3 · the verified agreement ───────────────────────────────────────────────
function verification(d, b) {
  const S = stage(d, b, { sky: 'rgba(24,96,78,0.045)', land: 'rgba(24,96,78,0.06)', hz: 0.30 });
  const { x, y, w, h, sea } = S;
  // the fab: a long blind wall, because that is what these buildings are
  const fx = x + w * 0.06, fw = w * 0.62, fh = h * 0.30;
  d.rect(fx, sea, fw, fh, { weight: PEN.outline, colour: INK.ink, fill: 'rgba(253,253,251,0.93)' });
  d.hatch([fx, sea, fw, fh],
          { spacing: 1.6, angle: Math.PI / 4, weight: PEN.hairline, colour: INK.inkLight });
  for (let i = 1; i < 7; i++) {
    d.line([fx + (fw * i) / 7, sea], [fx + (fw * i) / 7, sea + fh],
           { weight: PEN.hairline, colour: INK.inkLight });
  }
  // the seal chain across the doors: green, because it is a verified commitment
  d.polyline([[fx, sea + fh * 0.34], [fx + fw, sea + fh * 0.34]],
             { weight: PEN.medium, colour: INK.green, dash: [6, 1.6, 1.2, 1.6] });
  for (let i = 0; i < 5; i++) {
    const sx = fx + fw * (0.10 + i * 0.20);
    d.arc([sx, sea + fh * 0.34], 1.5, 0, Math.PI * 2, { weight: PEN.thin, colour: INK.green });
    d.dot([sx, sea + fh * 0.34], 0.6, { colour: INK.green });
  }
  d.text([fx + 1.5, sea + fh * 0.34 + 2.2], 'SEALED · DECLARED · INSPECTED',
         { size: 1.5, colour: INK.green, track: 0.14, pocket: true });
  // the inspection gantry
  const gx = x + w * 0.72, gw = w * 0.22, gh = h * 0.42;
  d.rect(gx, sea, gw, gh, { weight: PEN.thin, colour: INK.ink });
  for (let i = 0; i <= 4; i++) {
    d.line([gx, sea + (gh * i) / 4], [gx + gw, sea + (gh * i) / 4],
           { weight: PEN.hairline, colour: INK.inkLight });
    d.polyline([[gx, sea + (gh * i) / 4], [gx + gw, sea + (gh * (i + 1)) / 4]],
               { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.7 });
  }
  d.rect(gx - 1.4, sea + gh, gw + 2.8, h * 0.035,
         { weight: PEN.medium, colour: INK.green, fill: 'rgba(24,96,78,0.12)' });
  // camera masts watching the line
  for (const f of [0.20, 0.50, 0.80]) {
    const mx = fx + fw * f;
    d.line([mx, sea + fh], [mx, sea + fh + h * 0.10],
           { weight: PEN.thin, colour: INK.green });
    d.polyline([[mx, sea + fh + h * 0.10], [mx + 2.4, sea + fh + h * 0.115],
                [mx + 2.4, sea + fh + h * 0.085]],
               { close: true, weight: PEN.hairline, colour: INK.green, fill: INK.greenWash });
  }
  // inspectors at the gate
  person(d, x + w * 0.66, sea, h * 0.075, INK.green);
  person(d, x + w * 0.685, sea, h * 0.075, INK.green);
  d.text([x + w - 2, y + h * 0.06], 'DECLARED CAPACITY UNDER INSPECTION',
         { size: 1.6, align: 'right', colour: INK.green, track: 0.14, weight: 700, pocket: true });
}

// ── 4 · the physical economy ─────────────────────────────────────────────────
function robotZone(d, b) {
  const S = stage(d, b, { sky: 'rgba(58,132,214,0.05)', land: 'rgba(52,50,48,0.07)', hz: 0.38 });
  const { x, y, w, h, sea } = S;
  // shed roof over the whole yard
  d.polyline([[x + w * 0.04, sea + h * 0.34], [x + w * 0.50, sea + h * 0.46],
              [x + w * 0.96, sea + h * 0.34]],
             { weight: PEN.outline, colour: INK.ink });
  for (let i = 0; i <= 8; i++) {
    const cx = x + w * (0.06 + i * 0.11);
    const top = sea + h * 0.34 + Math.abs(0.5 - i / 8) * -h * 0.12 + h * 0.12;
    d.line([cx, sea], [cx, top], { weight: PEN.hairline, colour: INK.inkLight });
  }
  // gantry crane on rails
  const rail = sea + h * 0.26;
  d.line([x + w * 0.06, rail], [x + w * 0.94, rail], { weight: PEN.thin, colour: INK.ink });
  const cgx = x + w * 0.42;
  d.rect(cgx, rail - h * 0.02, w * 0.16, h * 0.04, { weight: PEN.medium, colour: INK.ochre });
  d.line([cgx + w * 0.08, rail - h * 0.02], [cgx + w * 0.08, sea + h * 0.06],
         { weight: PEN.thin, colour: INK.ochre });
  d.rect(cgx + w * 0.06, sea + h * 0.02, w * 0.04, h * 0.045,
         { weight: PEN.thin, colour: INK.ochre, fill: 'rgba(176,120,26,0.14)' });
  // stacked material
  const r = rnd(7717);
  for (let i = 0; i < 9; i++) {
    const bx = x + w * (0.08 + i * 0.055), bh = h * (0.03 + r() * 0.05);
    d.rect(bx, sea, w * 0.045, bh,
           { weight: PEN.hairline, colour: INK.ink, fill: 'rgba(253,253,251,0.85)' });
    d.hatch([bx, sea, w * 0.045, bh],
            { spacing: 0.9, angle: -Math.PI / 4, weight: PEN.hairline, colour: INK.inkLight });
  }
  // the units, and the arcs of their motion
  for (let i = 0; i < 7; i++) {
    const ux = x + w * (0.10 + i * 0.115), uy = y + h * (0.10 + (i % 3) * 0.06);
    d.rect(ux, uy, w * 0.035, h * 0.05,
           { weight: PEN.thin, colour: INK.blue, fill: 'rgba(58,132,214,0.14)' });
    d.dot([ux + w * 0.009, uy], 0.7, { colour: INK.blue });
    d.dot([ux + w * 0.026, uy], 0.7, { colour: INK.blue });
    d.arc([ux + w * 0.017, uy + h * 0.025], w * 0.030, 0.35, 2.0,
          { weight: PEN.hairline, colour: INK.blue, dash: [1.4, 1.2], alpha: 0.7 });
  }
  person(d, x + w * 0.92, sea, h * 0.075, INK.ink);
  d.text([x + 2, y + h * 0.05], 'CONTINUOUS OPERATION · NO SHIFT PATTERN',
         { size: 1.6, colour: INK.blue, track: 0.14, weight: 700, pocket: true });
}

// ── 5 · the build-out that stopped ───────────────────────────────────────────
function stalled(d, b) {
  const S = stage(d, b, { sky: 'rgba(52,50,48,0.05)', land: 'rgba(52,50,48,0.08)', hz: 0.34 });
  const { x, y, w, h, sea } = S;
  // an unfinished frame: columns up, no cladding
  const fx = x + w * 0.14, fw = w * 0.46, fh = h * 0.34;
  for (let i = 0; i <= 6; i++) {
    const cx = fx + (fw * i) / 6;
    d.line([cx, sea], [cx, sea + fh * (i > 3 ? 0.62 : 1)],
           { weight: PEN.thin, colour: INK.inkLight });
  }
  for (const f of [0.34, 0.68, 1.0]) {
    d.line([fx, sea + fh * f], [fx + fw * (f === 1 ? 0.5 : 1), sea + fh * f],
           { weight: PEN.thin, colour: INK.inkLight });
  }
  // partial cladding on the finished half
  d.rect(fx, sea, fw * 0.44, fh * 0.68,
         { weight: PEN.thin, colour: INK.ink, fill: 'rgba(253,253,251,0.75)' });
  d.hatch([fx, sea, fw * 0.44, fh * 0.68],
          { spacing: 1.6, angle: Math.PI / 4, weight: PEN.hairline, colour: INK.inkLight });
  // the idle crane, jib slack
  const cx0 = x + w * 0.68;
  d.line([cx0, sea], [cx0, sea + h * 0.46], { weight: PEN.medium, colour: INK.ochre });
  for (let i = 0; i < 7; i++) {
    d.polyline([[cx0, sea + h * (0.06 * i)], [cx0 + 2.4, sea + h * (0.06 * i + 0.03)],
                [cx0, sea + h * (0.06 * i + 0.06)]],
               { weight: PEN.hairline, colour: INK.ochre, alpha: 0.7 });
  }
  d.line([cx0 - w * 0.06, sea + h * 0.44], [cx0 + w * 0.20, sea + h * 0.46],
         { weight: PEN.thin, colour: INK.ochre });
  d.line([cx0 + w * 0.16, sea + h * 0.455], [cx0 + w * 0.16, sea + h * 0.30],
         { weight: PEN.hairline, colour: INK.ochre, dash: [1.4, 1.0] });
  d.rect(cx0 + w * 0.145, sea + h * 0.26, w * 0.03, h * 0.04,
         { weight: PEN.hairline, colour: INK.ochre });
  // undelivered material, weathering
  const r = rnd(3313);
  for (let i = 0; i < 6; i++) {
    const bx = x + w * (0.06 + i * 0.055);
    d.rect(bx, sea, w * 0.04, h * 0.028,
           { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.85 });
    if (r() > 0.45) {
      d.hatch([bx, sea, w * 0.04, h * 0.028],
              { spacing: 0.8, angle: Math.PI / 3, weight: PEN.hairline, colour: INK.red });
    }
  }
  // the notice
  d.rect(x + w * 0.80, sea + h * 0.10, w * 0.16, h * 0.10,
         { weight: PEN.thin, colour: INK.red, fill: 'rgba(253,253,251,0.9)' });
  d.text([x + w * 0.88, sea + h * 0.10 + 5.0], 'WORKS',
         { size: 1.5, align: 'center', colour: INK.red, track: 0.12, pocket: true });
  d.text([x + w * 0.88, sea + h * 0.10 + 2.0], 'SUSPENDED',
         { size: 1.5, align: 'center', colour: INK.red, track: 0.12, pocket: true });
  d.line([x + w * 0.88, sea], [x + w * 0.88, sea + h * 0.10],
         { weight: PEN.hairline, colour: INK.red });
  d.text([x + 2, y + h * 0.05], 'CAPITAL WITHDRAWN · SCHEDULE ABANDONED',
         { size: 1.6, colour: INK.red, track: 0.14, weight: 700, pocket: true });
}

// ── 6 · the public square ────────────────────────────────────────────────────
function square(d, b) {
  const S = stage(d, b, { sky: 'rgba(150,44,38,0.045)', land: 'rgba(52,50,48,0.06)', hz: 0.44 });
  const { x, y, w, h, sea } = S;
  // the ministry: a portico, because the argument is with the state
  const mx = x + w * 0.56, mw = w * 0.38, mh = h * 0.34;
  d.rect(mx, sea, mw, mh, { weight: PEN.outline, colour: INK.ink, fill: 'rgba(253,253,251,0.94)' });
  d.polyline([[mx - 2, sea + mh], [mx + mw / 2, sea + mh + h * 0.10], [mx + mw + 2, sea + mh]],
             { close: true, weight: PEN.medium, colour: INK.ink, fill: 'rgba(253,253,251,0.94)' });
  for (let i = 0; i < 7; i++) {
    const cx = mx + 2 + (i * (mw - 4)) / 6;
    d.line([cx, sea], [cx, sea + mh], { weight: PEN.thin, colour: INK.inkLight });
  }
  d.line([mx, sea + mh * 0.92], [mx + mw, sea + mh * 0.92],
         { weight: PEN.hairline, colour: INK.inkLight });
  // the line in front of it
  d.line([mx - 3, sea + h * 0.02], [mx + mw + 3, sea + h * 0.02],
         { weight: PEN.medium, colour: INK.ink });
  for (let i = 0; i < 9; i++) person(d, mx - 1 + i * (mw / 8), sea + h * 0.02, h * 0.055, INK.ink);
  // the crowd: density, not portraits
  const r = rnd(5501);
  for (let i = 0; i < 520; i++) {
    const t = r();
    const cx = x + w * 0.02 + t * w * 0.58 + r() * w * 0.04;
    const cy = y + h * (0.05 + r() * 0.30);
    const rr = 0.30 + (1 - (cy - y) / (h * 0.35)) * 0.42;
    d.dot([cx, cy], rr, { colour: r() > 0.72 ? INK.redLight : INK.red });
  }
  // placards
  for (let i = 0; i < 7; i++) {
    const px = x + w * (0.05 + i * 0.075) + (i % 2) * w * 0.02;
    const py = y + h * (0.20 + (i % 3) * 0.045);
    d.line([px, py - h * 0.06], [px, py], { weight: PEN.hairline, colour: INK.ink });
    d.rect(px - w * 0.022, py, w * 0.044, h * 0.035,
           { weight: PEN.thin, colour: INK.red, fill: 'rgba(253,253,251,0.9)' });
    for (let k = 0; k < 2; k++) {
      d.line([px - w * 0.017, py + h * (0.012 + k * 0.010)],
             [px + w * (k ? 0.008 : 0.017), py + h * (0.012 + k * 0.010)],
             { weight: PEN.hairline, colour: INK.red, alpha: 0.8 });
    }
  }
  d.text([x + 2, y + h * 0.04], 'CONSENT IS A BINDING CONSTRAINT',
         { size: 1.6, colour: INK.red, track: 0.14, weight: 700, pocket: true });
}

const FIGURES = {
  offshore: { draw: offshore, title: 'Compute beyond the border',
    sub: 'Hulls moored past the territorial limit, generating their own power and landing a ' +
         'subsea cable ashore. Nothing here sits inside a jurisdiction that could licence it, ' +
         'which is the point of siting it here. Selected when coordination is absent or blocs ' +
         'have fragmented.' },
  campus: { draw: campus, title: 'Gigawatt campus',
    sub: 'Halls, substation, transmission and cooling at the scale the compute track implies. ' +
         'The capacity this forecast counts in aggregate, at one site. Selected while capacity ' +
         'is growing.' },
  verification: { draw: verification, title: 'Verified agreement',
    sub: 'Capacity declared, supply lines sealed, inspectors on site. What a treaty obligation ' +
         'looks like once it reaches the ground. Selected when coordination holds.' },
  robot: { draw: robotZone, title: 'Physical economy',
    sub: 'Capability reaching material work: continuous operation, no shift pattern, and no ' +
         'reason to light the building. Selected once the run passes the robotics threshold.' },
  stalled: { draw: stalled, title: 'Build-out that stopped',
    sub: 'Foundations poured, steel halted, the schedule abandoned and the capital withdrawn. ' +
         'The demand case failed before the concrete was finished. Selected under a demand ' +
         'crisis or a halt.' },
  square: { draw: square, title: 'Public square',
    sub: 'A crowd, a legislature, and procurement decisions waiting on both. Consent is the ' +
         'binding constraint here, ahead of capability or capital. Selected when opposition ' +
         'holds governing power or the public is durably split.' },
};

// Two scenes per state: the first says what the physical world looks like, the second what the
// politics is doing to it.
export function chooseFigures(wl, year, cap) {
  const out = [];
  if (wl.E === 'E5' || wl.C === 'C8' || wl.E === 'E4') out.push('stalled');
  if ((wl.C === 'C5' || wl.C === 'C4')) out.push('verification');
  if (wl.C === 'C1' || wl.R === 'R2') out.push('offshore');
  if (cap >= 4.5) out.push('robot');
  out.push('campus');
  if (wl.P === 'P5' || wl.P === 'P4') out.push('square');
  const seen = new Set(), pick = [];
  for (const k of out) { if (!seen.has(k)) { seen.add(k); pick.push(k); } }
  return pick.slice(0, 2).map((k) => ({ key: k, ...FIGURES[k] }));
}

export function drawFigure(d, key, x, y, w, h) {
  const f = FIGURES[key];
  if (!f) return;
  const capH = 12;
  f.draw(d, { x, y: y + capH, w, h: h - capH });
  d.obstacle(x, y + capH, w, h - capH, 'figure');
  caption(d, x, y + capH - 3.0, w, f.title.toUpperCase(), f.sub);
  d.region(`fig:${key}`, x, y, w, h, f);
}
