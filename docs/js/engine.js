// AI FUTURES FORECASTER — the engine, ported
//
// THE CLIENT IMPLEMENTS FUNCTIONS AGAINST engine.json CONSTANTS, NEVER MIRRORED LITERALS
// (CLAUDE.md rule 10). Every function here is the parent's own — worldlines.py in the Atlas —
// written against the constants the parent emits, so a conditioned path on this sheet is
// drawn by the same arithmetic that drew the emitted mainline. `build/port_gate.mjs` proves it:
// the port recomputes the parent's emitted knots and tracks and refuses the build on any
// divergence. Two implementations of one model are safe only while something checks that
// they agree; on 2026-08-17 they silently did not (LAWS_RATE re-keyed in the parent, read on
// the wrong axis here), and every laws value was NaN.
//
// Since r9 (P4 of the chronicle plan) the parent emits the takeoff gaps (`k_gap`), the
// dynamics' constants (`dynamics`), the horizon anchors and the templates' effects. An
// emission without them is drawn with the r8 arithmetic, so the sheet keeps working across the
// two registries and the gate says which it is checking.

export function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ── the capability path ──────────────────────────────────────────────────────
export function capPath(E, wl) {
  let knots = E.tempo_knots[wl.T].map((k) => k.slice());
  if (wl.C === 'C8') {
    const held = knots.filter((k) => k[0] <= 2029.0 && k[1] < 4.0);
    const base = held.length ? held : [knots[0]];
    knots = base.concat([[2031.0, Math.min(3.2, base[base.length - 1][1] + 0.3)]]);
  } else if ((wl.C === 'C5' || wl.C === 'C4') && (wl.T === 'T2' || wl.T === 'T3')) {
    const held = knots.filter((k) => k[1] <= 4.0);
    held.push([2040.0, 4.0]);
    knots = held.concat(knots.filter((k) => k[1] > 4.0)
      .map((k) => [k[0] + 7.5, k[1]]).filter((k) => k[0] > 2040.0));
  } else if ((wl.A === 'A2' || wl.A === 'A3') && (wl.T === 'T1' || wl.T === 'T2')) {
    knots = knots.map((k) => (k[1] >= 4.0 ? [k[0] + 0.8, k[1]] : k));
  }
  // M1: the takeoff shape places the coding crossing its gap before the research crossing
  const gap = E.k_gap && E.k_gap[wl.K];
  if (gap !== undefined) {
    const i3 = knots.findIndex((k) => k[1] >= 3.0);
    const i4 = knots.findIndex((k) => k[1] >= 4.0);
    if (i3 >= 0 && i4 >= 0 && i3 < i4 && knots[i4][0] < E.y1 && Math.abs(knots[i3][1] - 3.0) < 1e-9) {
      const y3 = Math.max(E.k_floor, knots[i4][0] - gap);
      knots[i3] = [y3, 3.0];
      knots = knots.filter((k, i) => !(i < i3 && k[0] >= y3));
      knots.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }
  }
  if (knots[knots.length - 1][0] < E.y1) knots.push([E.y1, knots[knots.length - 1][1]]);
  return knots;
}
export function capAt(knots, y) {
  if (y <= knots[0][0]) return knots[0][1];
  if (y >= knots[knots.length - 1][0]) return knots[knots.length - 1][1];
  let i = 1; while (knots[i][0] < y) i++;
  const [y0, v0] = knots[i - 1], [y1, v1] = knots[i];
  return v0 + (v1 - v0) * (y - y0) / (y1 - y0);
}
// the exact year each rung is first reached
export function crossings(knots, y1 = 2100) {
  const out = {};
  for (const r of [3, 4, 5, 6]) {
    let y = null;
    for (let i = 1; i < knots.length; i++) {
      const [ya, va] = knots[i - 1], [yb, vb] = knots[i];
      if (va < r && r <= vb) { y = vb > va ? ya + (yb - ya) * (r - va) / (vb - va) : yb; break; }
    }
    if (y === null && knots.length && knots[0][1] >= r) y = knots[0][0];
    if (y !== null && y < y1) out[String(r)] = Math.round(y * 100) / 100;
  }
  return out;
}
export function kGapClamped(E, wl) {
  const gap = E.k_gap && E.k_gap[wl.K];
  if (gap === undefined) return false;
  const c = crossings(capPath(E, wl), E.y1);
  if (!c['3'] || !c['4']) return false;
  return c['4'] - c['3'] < gap - 1e-6;
}

// ── the measured series under the ladder (M5) ────────────────────────────────
export function horizonHours(E, c) {
  const A = E.horizon_anchors;
  if (!A) return null;
  if (c <= A[0][0]) return A[0][1];
  if (c >= A[A.length - 1][0]) return A[A.length - 1][1];
  for (let i = 1; i < A.length; i++) {
    const [c0, h0] = A[i - 1], [c1, h1] = A[i];
    if (c0 <= c && c <= c1) {
      const t = (c - c0) / (c1 - c0);
      return Math.exp(Math.log(h0) + t * (Math.log(h1) - Math.log(h0)));
    }
  }
  return A[A.length - 1][1];
}

// ── the templates' effects on the tracks (M2) ────────────────────────────────
const EFFECT_MULT = ['gw_g', 'gw_mult', 'rev_g', 'work_rate', 'laws_g'];
const EFFECT_ADD = ['reemploy', 'appr_shock'];
export function effectSeries(E, events, yrs) {
  const eff = {};
  for (const k of EFFECT_MULT) eff[k] = new Array(yrs.length).fill(1.0);
  for (const k of EFFECT_ADD) eff[k] = new Array(yrs.length).fill(0.0);
  const byId = {};
  for (const t of E.templates || []) byId[t.id] = t;
  for (const e of events || []) {
    const fx = e.effects || (byId[e.id] && byId[e.id].effects) || (E.effects && E.effects[e.id]) || {};
    const y = Math.floor(e.year);
    for (const k in fx) {
      const spec = fx[k];
      if (k === 'appr_shock') {
        const i = y - yrs[0];
        if (i >= 0 && i < yrs.length) eff[k][i] += spec;
        continue;
      }
      const [val, dur] = spec;
      for (let i = Math.max(0, y - yrs[0]); i < Math.min(yrs.length, y - yrs[0] + Math.trunc(dur)); i++) {
        if (EFFECT_ADD.includes(k)) eff[k][i] += val; else eff[k][i] *= val;
      }
    }
  }
  return eff;
}

// ── the tracks ───────────────────────────────────────────────────────────────
// r9: dynamics against ceilings, with the path's own events moving what follows them. The
// arithmetic is worldlines.tracks() line for line; the parent rounds what it emits and the
// port keeps full precision, so the gate compares within the rounding.
function tracksDynamic(E, C, wl, events) {
  const P = E.track_params, Dn = E.dynamics;
  const kn = capPath(E, wl);
  const yrs = [];
  for (let y = E.y0; y <= E.y1; y++) yrs.push(y);
  const eff = effectSeries(E, events, yrs);
  const S = wl.S, Ee = wl.E, Dd = wl.D, R = wl.R, Pp = wl.P, Cc = wl.C;
  const liftG = wl.G in Dn.GWP_LIFT ? Dn.GWP_LIFT[wl.G] : 0.01;
  let gw = 62.0, us = 0.58, cn = 0.22, eu = 0.05, rev = 0.14, gwp = Dn.GWP_2026;
  const y4 = crossings(kn, E.y1)['4'];
  let m = 0.0, tOn = null, laws = 61.0, appr = P.APPROVAL0[Pp];
  let intensity = C.intensity0;
  let decline = C.decline[wl[C.decline_axis]]
              - (C.bonus.positions.includes(wl[C.bonus.axis]) ? C.bonus.amount : 0);
  const out = { year: [], cap: [], gw: [], us: [], cn: [], eu: [], rev: [], jobs: [], laws: [],
                appr: [], copies: [], speed: [], twh: [], co2: [], hz: [], gwp: [], work: [] };
  yrs.forEach((y, i) => {
    const c = capAt(kn, y);
    const g = (P.COMPUTE_G[S] - 1.0) * P.E_DAMP[Ee] * eff.gw_g[i];   // E damps the excess (r9)
    const ceiling = Dn.GW_SHARE_MAX[S] * Dn.WORLD_GW_2026 * Math.pow(Dn.WORLD_GW_GROWTH, y - E.y0);
    gw = Math.max(10.0, gw * (1.0 + g * Math.max(0.0, 1.0 - gw / ceiling)) * eff.gw_mult[i]);
    if (R === 'R4') us = Math.min(0.72, us + 0.004);
    if (Cc === 'C5' || Cc === 'C4') { us = Math.max(0.44, us - 0.003); cn = Math.min(0.30, cn + 0.002); }
    if (R === 'R2') eu = Math.min(0.16, eu + 0.0025);
    cn = Math.min(0.34, cn + (S !== 'S3' ? 0.003 : 0.0));
    const taper = y4 === undefined ? 1.0 : Math.max(0.0, 1.0 - Math.max(0.0, y - y4) / Dn.GWP_LIFT_TAPER);
    gwp *= Dn.GWP_GROWTH + liftG * Math.min(Dn.GWP_LIFT_UNITS, Math.max(0.0, c - 3.0)) * taper;
    const lift = 1.0 + 0.10 * Math.max(0, c - 2.6);
    const rg = (P.REV_G[Dd] - 1.0) * lift * eff.rev_g[i];
    const revMax = Dn.REV_SHARE_MAX[Dd] * gwp;
    rev = rev * (1.0 + rg * Math.max(0.0, 1.0 - rev / revMax));
    const gate = Math.min(2.5, Math.max(0.3, c - 2.0));
    m += Dn.WORK_RATE[Dd] * gate * eff.work_rate[i] * Math.max(0.0, 1.0 - m / Dn.WORK_SHARE_MAX[Dd]);
    if (tOn === null && m >= 0.005) tOn = y;
    const rhoMax = Math.max(0.0, Math.min(0.95, Dn.REEMPLOY_MAX[Dd] + eff.reemploy[i]));
    const rho = tOn === null ? 0.0 : rhoMax * (1.0 - Math.exp(-(y - tOn) / Dn.REEMPLOY_TAU));
    const jobs = -100.0 * m * (1.0 - rho);
    laws += P.LAWS_RATE[R] * eff.laws_g[i] * Math.max(0.0, 1.0 - laws / Dn.LAWS_MAX);
    const eq = Dn.APPROVAL_EQ[Pp] + Dn.APPROVAL_JOBS * jobs + ((Cc === 'C5' || Cc === 'C4') ? Dn.APPROVAL_LIMIT : 0.0);
    appr += Dn.APPROVAL_K * (eq - appr) + eff.appr_shock[i];
    appr = Math.max(8.0, Math.min(80.0, appr));
    const copies = c < 3.0 ? 0 : gw * Dn.COPIES_PER_GW0 * Math.pow(10, Dn.COPIES_PER_GW_LOG * (c - 2.6));
    const speed = c < 3.0 ? 1 : Math.min(1000, Math.trunc(13 * Math.pow(5.5, c - 3.0)));
    const twh = gw * C.hours * C.util;
    intensity = Math.max(C.floor, intensity * decline);
    out.year.push(y); out.cap.push(c); out.gw.push(gw);
    out.us.push(us); out.cn.push(cn); out.eu.push(eu);
    out.rev.push(rev); out.jobs.push(jobs); out.laws.push(Math.trunc(laws));
    out.appr.push(appr); out.copies.push(Math.trunc(copies)); out.speed.push(speed);
    out.hz.push(horizonHours(E, c)); out.gwp.push(gwp); out.work.push(m);
    out.twh.push(twh); out.co2.push(twh * intensity / 1000.0);
  });
  return out;
}
// the r8 arithmetic, kept for an emission that carries no dynamics
function tracksLegacy(E, C, wl) {
  const P = E.track_params;
  const kn = capPath(E, wl);
  let gw = 62.0, us = 0.58, cn = 0.22, eu = 0.05, rev = 0.14, jobs = 0.0,
      laws = 61, appr = P.APPROVAL0[wl.P];
  let intensity = C.intensity0;
  let decline = C.decline[wl[C.decline_axis]]
              - (C.bonus.positions.includes(wl[C.bonus.axis]) ? C.bonus.amount : 0);
  const out = { year: [], cap: [], gw: [], us: [], cn: [], eu: [], rev: [], jobs: [],
                laws: [], appr: [], copies: [], speed: [], twh: [], co2: [] };
  for (let y = E.y0; y <= E.y1; y++) {
    const c = capAt(kn, y);
    let g = P.COMPUTE_G[wl.S] * P.E_DAMP[wl.E];
    g = 1.0 + (g - 1.0) * (1.0 / (1.0 + Math.max(0, gw / 8000.0)));
    gw = Math.min(60000.0, gw * g);
    if (wl.R === 'R4') us = Math.min(0.72, us + 0.004);
    if (wl.C === 'C5' || wl.C === 'C4') { us = Math.max(0.44, us - 0.003); cn = Math.min(0.30, cn + 0.002); }
    if (wl.R === 'R2') eu = Math.min(0.16, eu + 0.0025);
    cn = Math.min(0.34, cn + (wl.S !== 'S3' ? 0.003 : 0.0));
    const lift = 1.0 + 0.10 * Math.max(0, c - 2.6);
    const rg = 1.0 + (P.REV_G[wl.D] - 1.0) * lift;
    rev = Math.min(30.0, rev * (1.0 + (rg - 1.0) / (1.0 + rev / 6.0)));
    jobs = Math.max(-35.0, jobs + P.JOBS_RATE[wl.D] * Math.min(2.5, Math.max(0.3, c - 2.0)));
    laws = laws + P.LAWS_RATE[wl.R];
    appr += (wl.D === 'D4' ? -1.2 : -0.3) + ((wl.C === 'C5' || wl.C === 'C4') ? 0.8 : 0.0);
    appr = Math.max(8, Math.min(72, appr));
    const copies = c < 3.0 ? 0 : Math.min(5e7, 2.2e4 * Math.pow(10, 1.1 * (c - 3.0)));
    const speed = c < 3.0 ? 1 : Math.min(1000, Math.floor(13 * Math.pow(5.5, c - 3.0)));
    const twh = gw * C.hours * C.util;
    intensity = Math.max(C.floor, intensity * decline);
    out.year.push(y); out.cap.push(c); out.gw.push(gw);
    out.us.push(us); out.cn.push(cn); out.eu.push(eu);
    out.rev.push(rev); out.jobs.push(jobs); out.laws.push(laws | 0);
    out.appr.push(appr); out.copies.push(copies | 0); out.speed.push(speed | 0);
    out.twh.push(twh); out.co2.push(twh * intensity / 1000.0);
  }
  return out;
}
export function tracksJS(E, C, wl, events) {
  return E.dynamics ? tracksDynamic(E, C, wl, events) : tracksLegacy(E, C, wl);
}
export const hasDynamics = (E) => !!(E && E.dynamics);

// ── the templates, instantiated on a path ────────────────────────────────────
// The parent draws with Python's own generator, this with mulberry32, so the two streams are
// not the same and a conditioned path's events are this sheet's own. `{survives}` reads the
// parent's rule: the build-out survives the correction on E2 and E3 (the template's own
// requirement), and the port said E2 alone until r9.
// EVERY TEMPLATE TAKES ITS TWO UNIFORMS WHETHER OR NOT ITS REQUIREMENT HOLDS. Drawing only
// for the templates a line qualifies for shifted every later draw when one requirement
// changed, so two lines that differ on one axis differed on a dozen random events too, and a
// branch "gained the distillation attacks" for no reason the flip could explain. Common
// random numbers, as the effects machinery has them.
export function instantiateJS(E, wl, seed) {
  const rng = mulberry32(seed), kn = capPath(E, wl), evs = [];
  for (const t of E.templates) {
    const uP = rng(), uW = rng();
    let ok = true;
    for (const ax in t.req) if (!t.req[ax].includes(wl[ax])) ok = false;
    if (!ok || uP > t.p) continue;
    let year = t.w[0] + (t.w[1] - t.w[0]) * Math.pow(uW, 1.3);
    if (t.tie === 'cap>=3') { const k = kn.find((q) => q[1] >= 3.0); year = k ? k[0] : null; }
    if (t.tie === 'cap>=4') { const k = kn.find((q) => q[1] >= 4.0); year = k ? k[0] : null; }
    if (year === null || year > E.y1) continue;
    const txt = t.text.replace('{year}', String(Math.floor(year)))
                      .replace('{survives}', (wl.E === 'E2' || wl.E === 'E3') ? 'survives' : 'stalls');
    evs.push({ year: Math.round(year * 10) / 10, layer: t.layer, text: txt,
               cites: t.cites, id: t.id, effects: t.effects || undefined });
  }
  evs.sort((a, b) => a.year - b.year);
  return evs;
}

// ── a branch's events: the drawn path's own, except where the flip reaches ───────────────
// One variable flips; everything the flip does not touch is held. A template whose
// requirement holds on both lines keeps the drawn path's draw, present or absent, with its
// year re-tied where it follows a crossing; one the branch newly qualifies for takes a fresh
// draw of its own; one the branch no longer qualifies for is lost. The drawn path's events
// may be the parent's, drawn by a generator this port cannot reproduce, and this is how a
// branch can still be measured against them.
export function branchEventsJS(E, base, baseEvents, wl, seed) {
  const kn = capPath(E, wl), rng = mulberry32(seed), evs = [];
  const had = {};
  for (const e of baseEvents || []) if (!(e.id in had)) had[e.id] = e;
  const holds = (line, t) => { for (const ax in t.req) if (!t.req[ax].includes(line[ax])) return false; return true; };
  const tieYear = (t) => {
    if (t.tie === 'cap>=3') { const k = kn.find((q) => q[1] >= 3.0); return k ? k[0] : null; }
    if (t.tie === 'cap>=4') { const k = kn.find((q) => q[1] >= 4.0); return k ? k[0] : null; }
    return undefined;
  };
  for (const t of E.templates) {
    const uP = rng(), uW = rng();
    const okA = holds(base, t), okB = holds(wl, t);
    if (!okB) continue;
    let year = null, text = null;
    if (okA) {
      const e = had[t.id];
      if (!e) continue;                     // absent on the drawn path, absent here
      year = e.year; text = e.text;
      const ty = tieYear(t);
      if (ty !== undefined) { year = ty; text = null; }
    } else {
      if (uP > t.p) continue;
      year = t.w[0] + (t.w[1] - t.w[0]) * Math.pow(uW, 1.3);
      const ty = tieYear(t);
      if (ty !== undefined) year = ty;
    }
    if (year === null || year === undefined || year > E.y1) continue;
    if (text === null) {
      text = t.text.replace('{year}', String(Math.floor(year)))
                   .replace('{survives}', (wl.E === 'E2' || wl.E === 'E3') ? 'survives' : 'stalls');
    }
    evs.push({ year: Math.round(year * 10) / 10, layer: t.layer, text, cites: t.cites, id: t.id,
               effects: t.effects || undefined });
  }
  evs.sort((a, b) => a.year - b.year);
  return evs;
}

// ── the onsets a path gives its positions ────────────────────────────────────
export function onsetsJS(E, wl, knots, events, tr) {
  const rules = E.onsets || {};
  const byId = {};
  for (const e of events || []) if (!(e.id in byId)) byId[e.id] = e.year;
  const cross = crossings(knots, E.y1);
  const out = {};
  for (const ax in wl) {
    const pos = wl[ax], rule = rules[pos];
    if (!rule) continue;
    let y = null;
    if (rule.template) y = byId[rule.template] ?? null;
    else if (rule.milestone) y = cross[String(rule.milestone)] ?? null;
    else if (rule.track) {
      const series = tr[rule.track] || [];
      for (let i = 0; i < series.length; i++) {
        const hit = rule.dir === 'below' ? series[i] <= rule.at : series[i] >= rule.at;
        if (hit) { y = tr.year[i]; break; }
      }
    } else if (rule.year) y = rule.year;
    if (y !== null && y !== undefined) out[pos] = Math.round(y * 10) / 10;
  }
  return out;
}

// ── the medoid of an ensemble (M6) ───────────────────────────────────────────
// Under Hamming distance the sum of distances from one line to the set decomposes by axis, so
// the medoid is the line whose positions the most other lines share, summed over the axes.
export function medoid(lines) {
  const counts = {};
  for (const wl of lines) for (const k in wl) {
    counts[k] = counts[k] || {}; counts[k][wl[k]] = (counts[k][wl[k]] || 0) + 1;
  }
  let best = null, bs = -1;
  for (const wl of lines) {
    let sc = 0; for (const k in wl) sc += counts[k][wl[k]];
    if (sc > bs) { best, bs = sc; best = wl; }
  }
  return { wl: { ...best }, agree: bs / (lines.length * Object.keys(best).length) };
}
