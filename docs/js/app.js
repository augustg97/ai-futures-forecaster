// AI FUTURES FORECASTER — state, the engine, and the board
//
// The forecast engine itself lives in the AI Atlas: the belief network, the evidence layer that
// moves it every morning, the wiki grounding, the nightly gate. This sheet is a SECOND SURFACE
// on that instrument. It reads the same emitted data and implements the same functions against
// the same shipped constants (`engine.json`), so the two surfaces cannot drift apart.

import { Draft, PEN, INK, paperTileURL } from './draft.js?v=20260819-0117';
import { SECTIONS, SHEET_W, TABS, CHART, COL, CTL_NOTE_W, balance,
         proseColumns, measureSections, SHEET_CW } from './sections.js?v=20260819-0117';
import { column, fmtNum } from './instruments.js?v=20260819-0117';
import { describe, headline } from './narrative.js?v=20260819-0117';
import { describeRecord, headlineRecord, RECORD, recordAt, whenOf } from './record.js?v=20260819-0117';
import { LONGFORM } from './narrative.js?v=20260819-0117';
import { chooseFigures } from './figures.js?v=20260819-0117';

// One build number, injected into index.html at ship time, versions BOTH the data fetches and
// (via the build's import rewrite) every module. A fresh app.js against a stale draft.js is the
// worst version of the cache failure, because it renders — and renders wrong.
const DATA_V = (typeof window !== 'undefined' && window.__BUILD) || 'DEV';
const NOW_Y = 2026.58;
const TRUNK = [[2012, 0.15], [2016, 0.45], [2019, 0.8], [2022, 1.1], [2022.92, 1.5],
               [2024, 1.9], [2025.5, 2.3], [NOW_Y, 2.6]];
// The document is drawn at one fixed width, so 2 mm of cap height is always the same number of
// pixels and nothing has to be zoomed to be read. Below the minimum the page scrolls sideways
// rather than shrinking the type past legibility.
const DOC_MIN = 1180, DOC_MAX = 1720;

const docEl = document.getElementById('doc');
const chipEl = document.getElementById('chip');
const tabsEl = document.getElementById('tabs');
const D = {};
const SEC = [];                       // { id, fn, el, cv, draft, h, sig }

const state = {
  tab: 'forecast', ctlAxis: 'T', yr: NOW_Y, pin: {}, obs: false, alt: null,
  chartView: 'forecast',   // 'forecast' | 'record' — which drawing the middle column carries
  recordWindow: 'all',     // which span the record view magnifies
  mmPerPx: 0.25, hovered: null, selected: null, touched: null,
  ready: false, fitted: false,
};

// ── the engine, ported ───────────────────────────────────────────────────────
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function capPath(wl) {
  let knots = D.engine.tempo_knots[wl.T].map((k) => k.slice());
  if (wl.C === 'C5') {
    const held = knots.filter((k) => k[0] <= 2029.0 && k[1] < 4.0);
    const base = held.length ? held : [knots[0]];
    knots = base.concat([[2031.0, Math.min(3.2, base[base.length - 1][1] + 0.3)]]);
  } else if (wl.C === 'C3' && (wl.T === 'T2' || wl.T === 'T3')) {
    const held = knots.filter((k) => k[1] <= 4.0);
    held.push([2040.0, 4.0]);
    knots = held.concat(knots.filter((k) => k[1] > 4.0)
      .map((k) => [k[0] + 7.5, k[1]]).filter((k) => k[0] > 2040.0));
  } else if (wl.A === 'A2' && (wl.T === 'T1' || wl.T === 'T2')) {
    knots = knots.map((k) => (k[1] >= 4.0 ? [k[0] + 0.8, k[1]] : k));
  }
  if (knots[knots.length - 1][0] < D.engine.y1) {
    knots.push([D.engine.y1, knots[knots.length - 1][1]]);
  }
  return knots;
}
function capAt(knots, y) {
  if (y <= knots[0][0]) return knots[0][1];
  if (y >= knots[knots.length - 1][0]) return knots[knots.length - 1][1];
  let i = 1; while (knots[i][0] < y) i++;
  const [y0, v0] = knots[i - 1], [y1, v1] = knots[i];
  return v0 + (v1 - v0) * (y - y0) / (y1 - y0);
}
function trunkCap(y) { return capAt(TRUNK, y); }

// The parent's `tracks()` — including the climate coupling, whose constants are extracted from
// its source at build time (see build/build_site.py) rather than mirrored here by hand.
function tracksJS(wl) {
  const P = D.engine.track_params, C = D.climate;
  const kn = capPath(wl);
  let gw = 62.0, us = 0.58, cn = 0.22, eu = 0.05, rev = 0.14, jobs = 0.0,
      laws = 61, appr = P.APPROVAL0[wl.P];
  let intensity = C.intensity0;
  // The axis the decline map is indexed by, and the positions that earn the bonus, are
  // extracted with the constants — this read carried a `wl.C === 'C3'` literal until r5
  // moved the condition to C4/C5, where it would have gone on computing the wrong number.
  let decline = C.decline[wl[C.decline_axis]]
              - (C.bonus.positions.includes(wl[C.bonus.axis]) ? C.bonus.amount : 0);
  const out = { year: [], cap: [], gw: [], us: [], cn: [], eu: [], rev: [], jobs: [],
                laws: [], appr: [], copies: [], speed: [], twh: [], co2: [] };
  for (let y = D.engine.y0; y <= D.engine.y1; y++) {
    const c = capAt(kn, y);
    let g = P.COMPUTE_G[wl.S] * P.E_DAMP[wl.E];
    g = 1.0 + (g - 1.0) * (1.0 / (1.0 + Math.max(0, gw / 8000.0)));
    gw = Math.min(60000.0, gw * g);
    // RE-KEYED TO r5. Six reads moved with the rebuild, and the one that mattered most was
    // silent: LAWS_RATE became R-keyed in the parent while this read it on C, so every laws
    // value was `undefined` and the recorder ran on NaN without raising. Counting statutes was
    // never a question about what the principal states settle between them, which is why the
    // rate followed the regulatory-architecture axis when C was carved down.
    if (wl.R === 'R4') us = Math.min(0.72, us + 0.004);       // executive release gate
    if (wl.C === 'C5' || wl.C === 'C4') {                      // a limit that holds
      us = Math.max(0.44, us - 0.003); cn = Math.min(0.30, cn + 0.002);
    }
    if (wl.R === 'R2') eu = Math.min(0.16, eu + 0.0025);       // contested patchwork
    cn = Math.min(0.34, cn + (wl.S !== 'S3' ? 0.003 : 0.0));
    const lift = 1.0 + 0.10 * Math.max(0, c - 2.6);
    const rg = 1.0 + (P.REV_G[wl.D] - 1.0) * lift;
    rev = Math.min(30.0, rev * (1.0 + (rg - 1.0) / (1.0 + rev / 6.0)));
    jobs = Math.max(-35.0, jobs + P.JOBS_RATE[wl.D] * Math.min(2.5, Math.max(0.3, c - 2.0)));
    laws = laws + P.LAWS_RATE[wl.R];
    appr += (wl.D === 'D4' ? -1.2 : -0.3) +
            ((wl.C === 'C5' || wl.C === 'C4') ? 0.8 : 0.0);
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
function instantiateJS(wl, seed) {
  const rng = mulberry32(seed), kn = capPath(wl), evs = [];
  for (const t of D.engine.templates) {
    let ok = true;
    for (const ax in t.req) if (!t.req[ax].includes(wl[ax])) ok = false;
    if (!ok || rng() > t.p) continue;
    let year = t.w[0] + (t.w[1] - t.w[0]) * Math.pow(rng(), 1.3);
    if (t.tie === 'cap>=3') { const k = kn.find((q) => q[1] >= 3.0); year = k ? k[0] : null; }
    if (t.tie === 'cap>=4') { const k = kn.find((q) => q[1] >= 4.0); year = k ? k[0] : null; }
    if (year === null || year > D.engine.y1) continue;
    const txt = t.text.replace('{year}', String(Math.floor(year)))
                      .replace('{survives}', wl.E === 'E2' ? 'survives' : 'stalls');
    evs.push({ year: Math.round(year * 10) / 10, layer: t.layer, text: txt,
               cites: t.cites, id: t.id });
  }
  evs.sort((a, b) => a.year - b.year);
  return evs;
}
// ── the sampler ──────────────────────────────────────────────────────────────
// THIS CLIENT DROPPED 10 OF ITS 25 CONDITIONAL EDGES, SILENTLY, UNTIL 2026-08-17.
// A single ordered pass over the declared axis order T, A, C, D, S, P, E applied an edge
// only when `Object.values(wl).includes(par)` — that is, only when the parent axis had
// already been drawn. Every edge whose parent came LATER in the order could never fire:
// all four economy-to-labour edges, all three supply-to-tempo edges, S|E3, S|E4 and P|E4.
// The unconditioned view was never affected, because the Atlas emits its own marginals and
// bands from a Python sampler repaired at r3. Every CONDITIONED view was: each time a reader
// pinned a control, `recondition()` redrew 3,000 world-lines with those ten edges absent, and
// so did the figure under every button. This is the r3 defect surviving in the port, and it
// looks exactly like a condition that happened not to apply.
//
// A Gibbs sweep re-draws each variable against ALL the others, so an edge fires whichever
// order its endpoints happen to sit in.
const GIBBS_SWEEPS = 4;
// THE SAMPLER RUNS 135,000 DRAWS PER CONDITIONING, so its inner loop decides whether the
// control panel answers in a frame or in eight seconds. r5 took the space from 7 axes and 25
// edges to 9 and 144, and the object-per-draw version went to 8.4 s a click.
//
// Precomputed once per registry: positions as indices, priors as a Float64Array per axis, and
// each edge as an array of multipliers ALIGNED TO THAT AXIS. A draw then starts from the prior
// row, walks only the eight positions actually held, and multiplies in the few tilts that name
// them. No allocation, no scan over parents that are not present.
let FAST = null;
function fastTables() {
  if (FAST && FAST.v === D.network.version) return FAST;
  const axes = D.network.axes.map((a) => a.key);
  const pos = {}, prior = {}, tilt = {}, scratch = {};
  for (const a of D.network.axes) {
    pos[a.key] = a.positions.map((p) => p[0]);
    prior[a.key] = Float64Array.from(a.positions.map((p) => p[2]));
    scratch[a.key] = new Float64Array(a.positions.length);
    tilt[a.key] = {};
    const cond = D.network.conditionals[a.key] || {};
    for (const par in cond) {
      const row = new Float64Array(a.positions.length).fill(1);
      a.positions.forEach((p, k) => { if (cond[par][p[0]] !== undefined) row[k] = cond[par][p[0]]; });
      tilt[a.key][par] = row;
    }
  }
  FAST = { v: D.network.version, axes, pos, prior, tilt, scratch };
  return FAST;
}
// One draw of `ax`, given the positions every other axis currently holds.
function drawAxis(ax, held, u, weights, T) {
  const w = T.scratch[ax], names = T.pos[ax], base = weights[ax];
  for (let k = 0; k < names.length; k++) w[k] = base[names[k]];
  const rows = T.tilt[ax];
  for (let h = 0; h < held.length; h++) {
    const row = rows[held[h]];
    if (row !== undefined) for (let k = 0; k < w.length; k++) w[k] *= row[k];
  }
  let tot = 0;
  for (let k = 0; k < w.length; k++) tot += w[k];
  let r = u * tot;
  for (let k = 0; k < w.length; k++) { r -= w[k]; if (r <= 0) return names[k]; }
  return names[names.length - 1];
}
function gibbs(nextU, weights, pinned) {
  const T = fastTables(), axes = T.axes, wl = {};
  const held = [];
  for (const ax of axes) {
    if (pinned[ax]) { wl[ax] = pinned[ax]; continue; }
    const names = T.pos[ax], base = weights[ax];
    let tot = 0;
    for (const n of names) tot += base[n];
    let r = nextU() * tot, chosen = names[names.length - 1];
    for (const n of names) { r -= base[n]; if (r <= 0) { chosen = n; break; } }
    wl[ax] = chosen;
  }
  for (let sweep = 0; sweep < GIBBS_SWEEPS; sweep++) {
    for (const ax of axes) {
      if (pinned[ax]) continue;
      held.length = 0;
      for (const other of axes) if (other !== ax) held.push(wl[other]);
      wl[ax] = drawAxis(ax, held, nextU(), weights, T);
    }
  }
  return wl;
}
function sampleOne(rng, weights, pinned) { return gibbs(rng, weights, pinned); }
// The effect measure draws from a fixed uniform matrix, so common random numbers hold: the
// only difference between the baseline and a test is the setting.
function sampleFixed(us, weights, pinned) {
  let k = 0;
  return gibbs(() => us[k++ % us.length], weights, pinned);
}
function jointP(wl, weights) {
  let p = 1.0; const chosen = {};
  for (const a of D.network.axes) {
    const k = a.key, w = {};
    for (const q of a.positions) w[q[0]] = weights[k][q[0]];
    const cond = D.network.conditionals[k] || {};
    for (const par in cond) {
      if (Object.values(chosen).includes(par)) {
        for (const pos in cond[par]) if (w[pos] !== undefined) w[pos] *= cond[par][pos];
      }
    }
    const tot = Object.values(w).reduce((x, y) => x + y, 0);
    p *= w[wl[k]] / tot; chosen[k] = wl[k];
  }
  return p;
}
// THE MOST PROBABLE LINE THAT ACTUALLY OCCURRED, out of the ones drawn.
//
// This enumerated every cell of the joint and returned the exact argmax. At 7 axes and 8,640
// cells that was cheap and meaningful. r5 took the space to 9 axes and 2,520,000 cells, where
// the enumeration costs 8.3 seconds — the whole of the delay on a control click — and returns
// an object worth less than it was: the exact argmax carries a joint probability of 0.0086%,
// one line in 11,668, and 20,000 draws produce 19,254 distinct assignments. No single line is
// the likely future in a space that flat.
//
// Scanning the ensemble the conditioning already drew gives a line that is jointly coherent,
// that actually occurred, and that costs O(n) instead of O(product of positions). The sheet
// letters what it is.
function argmaxLine(weights, pinned, lines) {
  let best = null, bp = -1;
  for (const wl of (lines || [])) {
    const p = jointP(wl, weights);
    if (p > bp) { bp = p; best = wl; }
  }
  if (best) return [{ ...best }, bp];
  // no ensemble to scan: fall back to each variable at its own most likely setting
  const wl = {};
  for (const a of D.network.axes) {
    wl[a.key] = pinned[a.key] ||
      a.positions.slice().sort((p, q) => q[2] - p[2])[0][0];
  }
  return [wl, jointP(wl, weights)];
}
function marginalsOf(lines) {
  const m = {};
  for (const wl of lines) for (const k in wl) { m[k] = m[k] || {}; m[k][wl[k]] = (m[k][wl[k]] || 0) + 1; }
  for (const k in m) { const n = Object.values(m[k]).reduce((a, b) => a + b, 0);
    for (const p in m[k]) m[k][p] /= n; }
  return m;
}
function bandsOf(lines) {
  const yrs = []; for (let y = D.engine.y0; y <= D.engine.y1; y++) yrs.push(y);
  const paths = lines.map((wl) => { const k = capPath(wl); return yrs.map((y) => capAt(k, y)); });
  const out = { year: yrs };
  for (const p of [10, 25, 50, 75, 90]) out['p' + p] = [];
  for (let c = 0; c < yrs.length; c++) {
    const vals = paths.map((pt) => pt[c]).sort((a, b) => a - b);
    for (const p of [10, 25, 50, 75, 90]) out['p' + p].push(vals[Math.floor(vals.length * p / 100)]);
  }
  return out;
}
function baseWeights() {
  const w = {};
  for (const a of D.network.axes) { w[a.key] = {}; for (const p of a.positions) w[a.key][p[0]] = p[2]; }
  return w;
}

// ── conditioning ─────────────────────────────────────────────────────────────
let cond = null;
function recondition() {
  const pins = Object.keys(state.pin);
  if (!pins.length) { cond = null; return; }
  const w = baseWeights();
  let lines = null, mode = '';
  if (state.obs && D.ens2k) {
    const filt = D.ens2k.lines.filter((wl) => pins.every((k) => wl[k] === state.pin[k]));
    if (filt.length >= 40) { lines = filt; mode = `OBSERVED · ${filt.length} OF 2000 LINES`; }
  }
  if (!lines) {
    const rng = mulberry32(4242);
    lines = []; for (let i = 0; i < 3000; i++) lines.push(sampleOne(rng, w, state.pin));
    mode = (state.obs ? 'OBSERVATION UNAVAILABLE — ' : '') + 'INTERVENED · 3000 RESAMPLED';
  }
  const [ml] = argmaxLine(w, state.pin, lines);
  cond = { lines, mode, marginals: marginalsOf(lines), bands: bandsOf(lines),
           main: ml, tracks: tracksJS(ml), events: instantiateJS(ml, 20260731) };
}
const altLine = () => (state.alt !== null && D.exemplars ? D.exemplars.lines[state.alt] : null);
function activeMain() { const a = altLine(); return a ? a.wl : (cond ? cond.main : D.mainline.wl); }
function activeTracks() {
  const a = altLine();
  if (a) return a.tracks.twh ? a.tracks : tracksJS(a.wl);
  if (cond) return cond.tracks;
  return D.mainline.tracks.twh ? D.mainline.tracks : tracksJS(D.mainline.wl);
}
function activeEvents() { const a = altLine(); return a ? a.events : (cond ? cond.events : D.mainline.events); }
function activeMarginals() { return cond ? cond.marginals : D.marginals.today; }
function activeBands() { return cond ? cond.bands : D.bands.annual; }
function activeLayers() {
  const a = altLine(); if (a && a.layers) return a.layers;
  const wl = activeMain();
  if (!cond && state.alt === null) return D.mainline.layers || {};
  if (!D.exemplars) return D.mainline.layers || {};
  let best = null, bs = -1;
  for (const e of D.exemplars.lines) {
    let s = 0; for (const k in wl) if (e.wl[k] === wl[k]) s++;
    if (e.wl.T === wl.T) s += 2; if (e.wl.C === wl.C) s += 2;
    if (s > bs) { bs = s; best = e; }
  }
  return best ? best.layers : (D.mainline.layers || {});
}
// The lookback is picked BY DATE, never by row count: the history carries repeated dates
// (a registry re-set writes a second row for the same day), so the nth row back is not n days
// back. Whatever row it lands on, `days` is the span actually measured — the drawing states
// that number rather than the 30 it was asking for.
const LOOKBACK_D = 30;
function daysBetween(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5); }
function lookback() {
  const h = D.marginals.history;
  if (!h || h.length < 2 || cond) return { m: {}, days: null };
  const to = h[h.length - 1].date;
  const want = new Date(Date.parse(to) - LOOKBACK_D * 864e5).toISOString().slice(0, 10);
  let pick = h[0];
  for (const r of h) if (r.date <= want) pick = r;      // newest row at or before the target
  const days = daysBetween(pick.date, to);
  return { m: pick.marginals || {}, days: days > 0 ? days : null };
}
function marginals30() { return lookback().m; }

// ── the notes: what a selected mark says ────────────────────────────────────
function axisNotes(a) {
  const lb = lookback();
  const m = activeMarginals()[a.key] || {}, w30 = lb.m[a.key] || {};
  const secs = [{ h: a.name, p: [a.desc || ''] }];
  const rows = a.positions.map((p) => {
    const now = (m[p[0]] || 0) * 100, was = lb.days === null ? null : (w30[p[0]] ?? null);
    const dr = was === null ? '' :
      ` (${(now - was * 100) >= 0 ? '+' : ''}${(now - was * 100).toFixed(1)}pp in ` +
      `${lb.days} day${lb.days === 1 ? '' : 's'})`;
    return `${p[0]} · ${p[1]} — ${now.toFixed(1)}%${dr}. ${p[4] || ''}`;
  });
  secs.push({ h: 'The positions', p: rows });
  const inter = [];
  for (const key in D.network.cond_stories) {
    const [child, par] = key.split('|');
    if (child === a.key) inter.push(`Given ${par}: ${D.network.cond_stories[key]}`);
    else if (a.positions.some((p) => p[0] === par)) {
      inter.push(`This axis shapes ${child}: ${D.network.cond_stories[key]}`);
    }
  }
  if (inter.length) secs.push({ h: 'Interactions', p: inter });
  // A sub-axis carrying `origin` was added by the parent's weekly schema review, not by the
  // draughtsman. It is uncited and unapproved, so it is not drawn as though it were authored.
  const subs = a.subaxes || [];
  const drawn = subs.filter((s) => !s.origin), prov = subs.filter((s) => s.origin);
  if (drawn.length) {
    secs.push({ h: 'Sub-axes', p: [drawn.map((s) => s.name || s.key).join(' · ')] });
  }
  if (prov.length) {
    secs.push({ h: 'Sub-axes — provisional, awaiting approval', p: prov.map(
      (s) => `${s.key} · ${s.name || ''} — added by the schema review itself, uncited and ` +
             `awaiting the draughtsman's approval. Logged as: ${s.origin}`) });
  }
  secs.push({ h: 'Grounding', p: [(a.cites || []).concat(
    a.positions.flatMap((p) => p[3] || [])).slice(0, 14).join(' · ')] });
  return secs;
}

function selectionNotes() {
  const sel = state.selected;
  if (!sel) return null;
  const [kind, ...rest] = sel.split(':');
  const m = activeMarginals();
  if (kind === 'axis') {
    const a = D.network.axes.find((z) => z.key === rest[0]);
    return a ? axisNotes(a) : null;
  }
  if (kind === 'pos') {
    const a = D.network.axes.find((z) => z.key === rest[0]);
    const p = a && a.positions.find((q) => q[0] === rest[1]);
    if (!p) return null;
    // A position opened from the controls has room for more than a paragraph, so the long
    // form goes under its own subhead as separate lines, each a complete sentence with a
    // figure and a date. A reader can check one without reading the rest.
    const lf = LONGFORM[p[0]];
    const out = [{ h: `${p[0]} · ${p[1]}`,
                   p: [p[4] || '', `Weight today: ${((m[a.key] || {})[p[0]] * 100 || 0).toFixed(1)}%.`] }];
    if (lf && lf.lines && lf.lines.length) {
      out.push({ h: lf.head, p: lf.lines.map((t) => '·\u2002' + t) });
    }
    out.push({ h: 'On this axis', p: [a.desc || ''] });
    out.push({ h: 'Grounding', p: [(p[3] || []).join(' · ')] });
    return out;
  }
  if (kind === 'rec') {
    const e = RECORD[+rest[0]];
    if (!e) return null;
    const later = RECORD.filter((q) => q.y > e.y).length;
    return [{ h: `${e.k} · ${whenOf(e)}`, p: [e.t] },
            { h: 'Consequence', p: [e.m] },
            { h: 'Position in the record', p: [
              `${later} recorded step${later === 1 ? '' : 's'} on this sheet fall after it. ` +
              `The capability index stood at ${trunkCap(e.y).toFixed(2)} when it happened, ` +
              `against ${trunkCap(NOW_Y).toFixed(2)} today.`,
              'The record is what the forecast is fitted to: every prior on the controls is ' +
              'a reading of how these steps arrived, and how fast.'] }];
  }
  if (kind === 'dom') {
    const dm = D.engine.domains[+rest[0]];
    if (!dm) return null;
    const tr = activeTracks();
    const i = Math.max(0, Math.min(tr.year.length - 1, Math.floor(state.yr) - D.engine.y0));
    const cap = state.yr < NOW_Y ? trunkCap(state.yr) : tr.cap[i];
    return [{ h: dm.n, p: [dm.d,
      cap >= dm.th ? `On the active world-line this domain has been crossed at the date on the index (threshold ${dm.th}).`
                   : `Not yet crossed on the active world-line: the capability index reads ${cap.toFixed(2)} against a threshold of ${dm.th}.`] },
            { h: 'Grounding', p: [(dm.cites || []).join(' · ')] }];
  }
  if (kind === 'mile') {
    const k = +rest[0];
    const ms = (D.engine.explainers.milestones || []).find((x) => x.k === k);
    return ms ? [{ h: ms.t, p: [ms.b] }, { h: 'Grounding', p: [(ms.cites || []).join(' · ')] }] : null;
  }
  if (kind === 'crisis') {
    const c = D.crisis.crises.find((x) => x.id === rest[0]);
    if (!c) return null;
    const p = c.kind === 'axis' ? (m[c.axis] || {})[c.pos] ?? c.p : c.p;
    return [{ h: c.q, p: [`Current probability ${(p * 100).toFixed(1)}%${cond ? ', under the composed conditions' : ', on the unconditioned network'}.`,
      c.kind === 'axis'
        ? `This is the weight the network puts on ${c.axis}.${c.pos}. It moves when an evidence rule touching that position fires — every application appears on Plate 4 with its driver.`
        : 'This is measured across the ensemble: the share of sampled world-lines that clear the level by the stated year.'] },
            { h: 'Grounding', p: [(c.cites || []).join(' · ')] }];
  }
  if (kind === 'layer') {
    const rows = activeLayers()[rest[0]] || [];
    const tr = activeTracks();
    const i = Math.max(0, Math.min(tr.year.length - 1, Math.floor(state.yr) - D.engine.y0));
    const extra = rest[0] === 'climate'
      ? [`At the date on the index: ${fmtNum(tr.twh[i])} TWh/yr of AI load, ${fmtNum(tr.co2[i])} Mt/yr of emissions.`]
      : rest[0] === 'economy' ? [`At the date on the index: $${tr.rev[i].toFixed(1)}T/yr of AI revenue.`] : [];
    return [{ h: rest[0] + ' — co-evolving with capability',
              p: extra.concat(rows.map((r) => `${r.year} · ${r.text}`)) },
            { h: 'Grounding', p: [rows.flatMap((r) => r.cites).slice(0, 10).join(' · ')] }];
  }
  if (kind === 'wp') {
    const ev = activeEvents()[+rest[0]];
    if (!ev) return null;
    return [{ h: `Waypoint · ${Math.floor(ev.year)}`, p: [ev.text,
      `Instantiated on the active world-line (${['T','K','A','C','R','D','S','P','E'].map((k) => activeMain()[k]).join('·')}) from a cited template. A composed line re-instantiates its own.`] },
            { h: 'Grounding', p: [(ev.cites || []).join(' · ')] }];
  }
  if (kind === 'delta') {
    const e = (D.delta.entries || [])[+rest[0]];
    if (!e) return null;
    return [{ h: e.rule, p: [
      `Impact class ${e.impact_class}; magnitude ×${(e.magnitude || 0).toFixed(5)}; ` +
      `${e.sources || 1} corroborating source(s); novelty decay k = ${(e.repeat_k ?? 0)}` +
      (e.spread !== undefined ? `; spread ${e.spread}` : '') + '.',
      'Applied: ' + Object.entries(e.applied || {}).map(([k, v]) =>
        `${k} ${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}pp`).join(' · ') + '.',
      e.driver ? 'Driver: ' + e.driver : 'No driver recorded.'] },
            { h: 'Grounding', p: [(e.cites || []).concat(e.driver_urls || []).join(' · ')] }];
  }
  if (kind === 'trk' || kind === 'stat') {
    const key = kind === 'trk' ? rest[0] : null;
    const ex = D.engine.explainers.stats_each || {};
    const e = ex[key] || ex[['cap','gw','rev','jobs','laws','appr','twh','co2'][+rest[0]] || 'rev'];
    return e ? [{ h: e.t, p: [e.b] }, { h: 'Grounding', p: [(e.cites || []).join(' · ')] }] : null;
  }
  if (kind === 'alt') {
    const e = D.exemplars.lines[+rest[0]];
    if (!e) return null;
    return [{ h: 'Alternative world-line', p: [
      'Composition ' + ['T','K','A','C','R','D','S','P','E'].map((k) => e.wl[k]).join('·') + '. ' +
      altPhrase(e) + '.',
      'One sampled future from the ensemble, drawn in full: its own capability path, its own ' +
      'waypoints, its own outcome layers. Selecting it makes it the active line everywhere on ' +
      'the sheet.'] },
      { h: 'Its waypoints', p: (e.events || []).slice(0, 8).map((v) => `${Math.floor(v.year)} · ${v.text}`) }];
  }
  return null;
}

function altPhrase(e) {
  const ml = D.mainline.wl;
  const diffs = Object.keys(ml).filter((k) => e.wl[k] !== ml[k]);
  if (!diffs.length) return 'the mainline composition itself';
  const k = diffs[0];
  const a = D.network.axes.find((z) => z.key === k);
  const p = a.positions.find((q) => q[0] === e.wl[k]);
  return `${a.name.toLowerCase()} goes “${p[1].split(' (')[0]}”` +
         (diffs.length > 1 ? ` and ${diffs.length - 1} more` : '');
}

// ── the other plates ─────────────────────────────────────────────────────────
const REGION_IDS = { us: ['840'], cn: ['156'], eu: ['276','250','380','724','528','616','056',
  '040','203','208','246','300','348','372','440','428','442','470','620','703','705','752',
  '233','196','191','100','642','826','756','578'] };
let PATHS = null;
function topoPaths() {
  if (PATHS || !D.topo) return PATHS;
  const o = D.topo.objects.countries, sc = D.topo.transform.scale, tr = D.topo.transform.translate;
  const dec = D.topo.arcs.map((a) => { let x = 0, y = 0; const pts = [];
    for (const [dx, dy] of a) { x += dx; y += dy; pts.push([x * sc[0] + tr[0], y * sc[1] + tr[1]]); }
    return pts; });
  PATHS = o.geometries.map((geom) => {
    const polys = geom.type === 'Polygon' ? [geom.arcs] : geom.type === 'MultiPolygon' ? geom.arcs : [];
    const paths = [];
    for (const poly of polys) for (const ring of poly) {
      const pts = [];
      for (const ai of ring) { const rev = ai < 0, idx = rev ? ~ai : ai;
        const seg = rev ? dec[idx].slice().reverse() : dec[idx];
        for (const p of seg) pts.push(p); }
      paths.push(pts);
    }
    return { id: String(geom.id).padStart(3, '0'), paths };
  });
  return PATHS;
}
function drawWorldPlate(d, S, box) {
  const [x, y, w, h] = box;
  const X = (lon) => x + (lon + 180) / 360 * w;
  const Y = (lat) => y + h * 0.52 + (lat / 90) * h * 0.42;
  d.rect(x, y, w, h, { weight: PEN.thin, colour: INK.ink });
  for (let lon = -180; lon <= 180; lon += 30) {
    d.line([X(lon), y], [X(lon), y + h],
           { weight: PEN.hairline, colour: INK.pencilLight, alpha: 0.5 });
    if (lon % 60 === 0) d.text([X(lon), y - 4], (lon === 0 ? '0°' : Math.abs(lon) + (lon < 0 ? '°W' : '°E')),
      { size: 1.6, align: 'center', face: 'figure', colour: INK.pencilLight });
  }
  for (let lat = -60; lat <= 80; lat += 20) {
    d.line([x, Y(lat)], [x + w, Y(lat)],
           { weight: PEN.hairline, colour: INK.pencilLight, alpha: 0.5 });
  }
  const tr = activeTracks();
  const i = Math.max(0, Math.min(tr.year.length - 1, Math.floor(S.yr) - D.engine.y0));
  const shares = { us: tr.us[i], cn: tr.cn[i], eu: tr.eu[i] };
  const tint = { us: INK.blue, cn: INK.red, eu: INK.green };
  const paths = topoPaths();
  if (paths) for (const c of paths) {
    let reg = null;
    for (const r in REGION_IDS) if (REGION_IDS[r].includes(c.id)) reg = r;
    const pts = c.paths;
    for (const ring of pts) {
      const mapped = ring.map((p) => [X(p[0]), Y(p[1])]);
      if (reg) d.fillPoly(mapped, reg === 'us' ? 'rgba(21,84,166,0.13)'
        : reg === 'cn' ? 'rgba(150,44,38,0.13)' : 'rgba(24,96,78,0.13)');
      d.polyline(mapped, { close: true, weight: PEN.hairline, colour: INK.inkLight });
    }
    if (reg) {
      // hatch density carries the share — a drawing shades by hatch, not by opacity
      const xs = pts.flat().map((p) => X(p[0])), ys = pts.flat().map((p) => Y(p[1]));
      const bx = Math.min(...xs), by = Math.min(...ys);
      d.hatch([bx, by, Math.max(...xs) - bx, Math.max(...ys) - by], {
        spacing: Math.max(0.9, 3.2 - shares[reg] * 4.0), angle: Math.PI / 4,
        weight: PEN.hairline, colour: tint[reg],
        path: (dd) => {
          const ctx = dd.ctx;
          for (const ring of pts) {
            ring.forEach((p, k) => {
              const px = dd.x(X(p[0])), py = dd.y(Y(p[1]));
              if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
            });
            ctx.closePath();
          }
        },
      });
    }
  }
  const gwNow = tr.gw[i];
  for (const s of D.engine.sites) {
    const share = s.r === 'row' ? 0.12 : shares[s.r] || 0.1;
    const gwSite = gwNow * share * s.w;
    const r = 0.9 + Math.log10(1 + gwSite) * 1.5;
    const [sx, sy] = [X(s.lon), Y(s.lat)];
    d.dot([sx, sy], r, { colour: INK.warm });
    d.arc([sx, sy], r + 1.2, 0, Math.PI * 2, { weight: PEN.hairline, colour: INK.warm });
    d.region(`site:${s.n}`, sx - r - 2, sy - r - 2, r * 4 + 4, r * 4 + 4,
             { s, gwSite });
  }
  const leg = y + 8;
  d.text([x + 2, leg], 'REGIME', { size: 1.8, colour: INK.inkLight, track: 0.16 });
  ['us', 'cn', 'eu'].forEach((r, k) => {
    d.rect(x + 20 + k * 30, leg - 1.8, 4, 2.6, { weight: PEN.hairline, colour: tint[r] });
    d.text([x + 25.6 + k * 30, leg], `${r.toUpperCase()} ${(shares[r] * 100).toFixed(0)}%`,
           { size: 1.7, colour: INK.pencil, face: 'figure' });
  });
}

function drawAltsPlate(d, S, box) {
  const [x, y, w, h] = box;
  if (!D.exemplars) { d.text([x, y + h / 2], 'THE ENSEMBLE IS STILL LOADING',
    { size: 2.4, colour: INK.pencilLight }); return; }
  const scored = D.exemplars.lines.map((e, i) => ({ i, c40: capAt(capPath(e.wl), 2040) }))
    .sort((a, b) => a.c40 - b.c40);
  const n = scored.length;
  const picks = [];
  const buckets = [['SLOW · BELOW THE 25TH', scored.slice(0, n >> 2)],
                   ['THE CENTRAL MASS', scored.slice(n >> 2, (3 * n) >> 2)],
                   ['FAST · ABOVE THE 75TH', scored.slice((3 * n) >> 2)]];
  for (const [label, arr] of buckets) {
    for (const f of [0, 0.34, 0.67, 1]) {
      const k = Math.min(arr.length - 1, Math.round(f * (arr.length - 1)));
      if (arr[k] && !picks.some((q) => q.i === arr[k].i)) picks.push({ ...arr[k], label });
    }
  }
  const cols = 4, cw = w / cols, ch = h / 3;
  picks.slice(0, 12).forEach((pk, idx) => {
    const e = D.exemplars.lines[pk.i];
    const cx = x + (idx % cols) * cw, cy = y + h - (Math.floor(idx / cols) + 1) * ch;
    const on = state.alt === pk.i;
    d.rect(cx + 2, cy + 8, cw - 6, ch - 14,
           { weight: on ? PEN.medium : PEN.hairline, colour: on ? INK.ochre : INK.inkLight });
    // the small multiple: its capability path against the same ladder
    const gx = cx + 6, gy = cy + 14, gw = cw - 16, gh = ch - 36;
    for (let m = 1; m <= 6; m += 1) {
      d.line([gx, gy + (m / 6.4) * gh], [gx + gw, gy + (m / 6.4) * gh],
             { weight: PEN.hairline, colour: INK.redLight, dash: [3, 2], alpha: 0.35 });
    }
    const kn = capPath(e.wl), pts = [];
    for (let yr = 2026; yr <= 2100; yr += 2) {
      pts.push([gx + ((yr - 2026) / 74) * gw, gy + (capAt(kn, yr) / 6.4) * gh]);
    }
    d.polyline(pts, { weight: PEN.medium, colour: on ? INK.ochre : INK.blue });
    d.text([cx + 6, cy + ch - 12], ['T','K','A','C','R','D','S','P','E'].map((k) => e.wl[k]).join('·'),
           { size: 2.0, face: 'figure', weight: 700, colour: on ? INK.ochre : INK.ink });
    d.text([cx + 6, cy + ch - 15.6], pk.label,
           { size: 1.4, colour: INK.pencilLight, track: 0.12 });
    const ph = altPhrase(e);
    d.textBlock([cx + 6, cy + 11], ph.charAt(0).toUpperCase() + ph.slice(1),
                cw - 14, { size: 1.6, lead: 1.4, colour: INK.pencil, max: 2 });
    d.region(`alt:${pk.i}`, cx + 2, cy + 8, cw - 6, ch - 14, e);
  });
}

// "A.A3" is the parent's key for it; "tractable with effort" is what it says. Built once from
// the registry the parent emitted, so a new axis or position carries its own name with no edit
// here.
let posNameMap = null;
function posName(key) {
  if (!posNameMap) {
    posNameMap = {};
    for (const a of D.network.axes) {
      for (const p of a.positions) posNameMap[`${a.key}.${p[0]}`] = p[1];
    }
  }
  return posNameMap[key] || null;
}

// Cut a string to the room it has and MARK the cut. A label trimmed silently reads as the whole
// name of something narrower than it is.
function elide(d, str, roomMM, size) {
  let s = String(str);
  if (roomMM <= 1 || d.textWidth(s, { size }) <= roomMM) return s;
  while (s.length > 1 && d.textWidth(s + '…', { size }) > roomMM) s = s.slice(0, -1);
  return s.replace(/[ (·,-]+$/, '') + '…';
}

// ── what an application means, composed ──────────────────────────────────────
// The plate lettered the arithmetic and quoted the driver, and left the reader to work out
// what the two had to do with each other. The parent emits no explanation, so one is
// composed here from the fields the entry carries: the class of development, how much
// corroboration it had, how far novelty decay had already reduced it, and which positions
// moved in which direction with what those positions MEAN.
const IMPACT_SENTENCE = {
  major: 'Classed as a major development, the largest weight the engine assigns.',
  moderate: 'Classed as a moderate development.',
  minor: 'Classed as a minor development, the smallest weight the engine assigns.',
};
function explainDelta(e) {
  const out = [];
  const cls = IMPACT_SENTENCE[(e.impact_class || '').toLowerCase()];
  const rule = e.rule ? `Matched by the rule ${e.rule}.` : '';
  out.push([cls, rule].filter(Boolean).join(' '));

  const n = e.sources || 1;
  const k = Number(e.repeat_k ?? 0);
  const corrob = n > 1 ? `${n} independent sources reported it`
                       : 'One source reported it';
  // The engine divides a rule's weight by a novelty factor that grows each time the rule
  // fires, so the same kind of news moves the network less the more often it arrives.
  // k is a divisor, so the share left is 1/k. Lettering k itself gave "to about a 3.7th of
  // its first application", which is not a quantity anyone can read.
  const decay = k > 1.05
    ? `, and repetition has reduced this rule's weight to about ${Math.round(100 / k)}% of ` +
      'what its first application carried'
    : ', and the rule is close to full weight';
  out.push(`${corrob}${decay}.`);

  const applied = Object.entries(e.applied || {});
  if (applied.length) {
    const up = applied.filter((p) => p[1] > 0);
    const dn = applied.filter((p) => p[1] < 0);
    const say = (p) => {
      const nm = posName(p[0]);
      const pp = Math.abs(p[1] * 100).toFixed(2);
      return nm ? `${nm.toLowerCase()} by ${pp} points` : `${p[0]} by ${pp} points`;
    };
    const bits = [];
    if (up.length) bits.push(`raised the weight on ${up.map(say).join(', ')}`);
    if (dn.length) bits.push(`lowered ${dn.map(say).join(', ')}`);
    out.push(`It ${bits.join(' and ')}.`);
  }
  if (e.event_date && e.date && e.event_date !== e.date) {
    out.push(`The development is dated ${e.event_date}; the engine read it on ${e.date}.`);
  }
  return out.join(' ');
}

const EXPL_X = 196;   // where the "what it means" column starts, in sheet mm
function drawMorningPlate(d, S, box) {
  const [x, y, w, h] = box;
  const ent = (D.delta.entries || []).slice().reverse();
  const today = ent.filter((e) => e.date === D.delta.date);
  const all = today.length ? today : ent;
  // A row needs about 18 mm: rule name, its arithmetic, the movement bars and
  // two lines of driver. Dividing the available height by however many entries
  // arrived gives 6.5 mm on a busy morning, and every row then draws through
  // the one below it. Fit what fits, and say what was left out.
  const ROW_MIN = 18;
  const fits = Math.max(1, Math.floor((h * 0.62 - 26) / ROW_MIN));
  const show = all.slice(0, fits);
  const dropped = all.length - show.length;
  if (!show.length) {
    d.text([x + 6, y + h - 20], 'NO EVIDENCE APPLICATION IS RECORDED.',
           { size: 2.6, colour: INK.pencil, track: 0.10 });
    return;
  }
  // The plate said "today" without ever lettering which day, so a reader could not tell a
  // fresh revision from a stale one — and the nightly build means the two look identical.
  const stamp = today.length ? D.delta.date : (show[0] && show[0].date) || D.delta.date;
  d.text([x, y + h - 8], today.length
    ? `${today.length} APPLICATION${today.length > 1 ? 'S' : ''} APPLIED ${stamp}`
    : `LATEST ${show.length} APPLICATIONS ON RECORD · TO ${stamp}`,
    { size: 2.2, colour: INK.red, weight: 700, track: 0.16 });
  const rowH = Math.min(34, (h * 0.62 - 26) / show.length);
  if (dropped > 0) {
    d.text([x + w, y + h - 8], `${dropped} FURTHER APPLICATION${dropped > 1 ? 'S' : ''} ` +
           'TODAY, BELOW THE FOLD OF THIS PLATE',
           { size: 1.8, align: 'right', colour: INK.red, track: 0.12 });
  }
  // The cloud ringed the last element of the parent's array and the caption called it the
  // newest. Every application in one morning carries the same application date, so the only
  // date that separates them is the development's own — and the array is not ordered by it.
  // On three of the nine mornings on record the last element was not the most recent
  // development, and on 2026-08-16 it was the OLDEST of eight: a working paper nine days old,
  // ringed while a development from that morning sat unringed two rows below. Rank by the
  // dates the entry actually carries, and letter each row's event date so the ring is
  // something a reader can check rather than take.
  const rank = (e) => `${e.date || ''}#${e.event_date || ''}`;
  let ring = 0;
  show.forEach((e, i) => { if (rank(e) > rank(show[ring])) ring = i; });
  show.forEach((e, i) => {
    const ry = y + h - 16 - (i + 1) * rowH;
    d.line([x, ry + rowH - 1.5], [x + w, ry + rowH - 1.5],
           { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.6 });
    d.text([x + 1, ry + rowH - 6], e.rule,
           { size: 2.1, weight: 700, colour: INK.ink, track: 0.06 });
    d.text([x + 1, ry + rowH - 9.4],
           `${(e.impact_class || '').toUpperCase()} · ×${(e.magnitude || 0).toFixed(4)} · ` +
           `${e.sources || 1} SOURCE(S) · k=${(e.repeat_k ?? 0)}` +
           (e.event_date ? ` · EVENT ${e.event_date}` : ''),
           { size: 1.5, colour: INK.pencilLight, face: 'figure' });
    // The movement, drawn as a bar per axis position, each lettered with what the position
    // MEANS. A row read "A.A3 +0.04pp" beside a driver about rising misalignment risk, and a
    // reader had no way to see that the model had been moved toward "tractable with effort" by
    // a development that says the opposite. The arithmetic is only checkable against its driver
    // once the key is spelled out.
    const applied = Object.entries(e.applied || {});
    const stride = Math.min(64, (EXPL_X - 98) / Math.max(1, applied.length));
    applied.forEach(([k, v], j) => {
      const bx = x + 96 + j * stride;
      const mag = Math.min(20, Math.abs(v) * 900);
      d.rect(bx, ry + rowH - 8.4, mag, 2.2,
             { weight: PEN.hairline, colour: v >= 0 ? INK.green : INK.red,
               fill: v >= 0 ? INK.greenWash : 'rgba(150,44,38,0.18)' });
      const fig = `${k} ${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}pp`;
      d.text([bx, ry + rowH - 10.8], fig,
             { size: 1.4, colour: v >= 0 ? INK.green : INK.red, face: 'figure' });
      const nm = posName(k);
      if (nm) {
        const lead = d.textWidth(fig + '  ', { size: 1.4, face: 'figure' });
        d.text([bx + lead, ry + rowH - 10.8], elide(d, nm, stride - lead - 3, 1.4),
               { size: 1.4, colour: INK.pencil });
      }
    });
    if (e.driver) {
      // The parent emits the driver at a fixed 140 characters. Ending the quotation without
      // a mark would read as a sentence the draughtsman wrote and then abandoned.
      const cut = e.driver.length >= 140 ? ' …' : '';
      d.textBlock([x + 1, ry + rowH - 13.0], 'DRIVER: ' + e.driver + cut, EXPL_X - 6,
                  { size: 1.55, lead: 1.4, colour: INK.pencil, max: 2 });
    }
    // WHAT IT MEANS, in its own column. The arithmetic and the quotation sat side by side
    // with nothing joining them; this says what the engine did with the development and why
    // the movement is the size it is.
    d.line([x + EXPL_X - 4, ry + 1], [x + EXPL_X - 4, ry + rowH - 3],
           { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.7 });
    d.text([x + EXPL_X, ry + rowH - 5.4], 'WHAT IT MEANS',
           { size: 1.45, track: 0.14, weight: 700, colour: INK.pencilLight });
    d.textBlock([x + EXPL_X, ry + rowH - 8.6], explainDelta(e), w - EXPL_X - 2,
                { size: 1.55, lead: 1.4, colour: INK.pencil, max: 5 });
    d.region(`delta:${(D.delta.entries || []).indexOf(e)}`, x, ry, w, rowH, e);
    if (i === ring) d.revisionCloud(x - 2, ry + 0.5, w + 4, rowH - 1);
  });

  // NET MOVEMENT — the day's total absolute drift per axis, as a bank of sight glasses.
  // A day's work on the network is a quantity; this is the instrument that reads it.
  const netY = y + h - 20 - show.length * rowH - 42;
  d.text([x, netY + 30], 'NET MOVEMENT ON THE NETWORK TODAY',
         { size: 3.0, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, netY + 26],
         'ABSOLUTE DRIFT SUMMED OVER TODAY’S APPLICATIONS · FULL SCALE 2 PERCENTAGE POINTS',
         { size: 1.6, colour: INK.pencilLight, track: 0.08 });
  const drift = {};
  for (const e of today) {
    for (const [k, v] of Object.entries(e.applied || {})) {
      const ax = k.split('.')[0];
      drift[ax] = (drift[ax] || 0) + Math.abs(v);
    }
  }
  const colGap = Math.min(34, (w - 210) / D.network.axes.length);
  D.network.axes.forEach((a, i) => {
    column(d, x + 4 + i * colGap, netY - 22, 8, 20, {
      value: Math.min(1, (drift[a.key] || 0) / 0.02),
      label: a.key + ' · ' + a.name.toUpperCase(),
      sub: ((drift[a.key] || 0) * 100).toFixed(2) + 'pp',
      colour: (drift[a.key] || 0) > 0 ? INK.red : INK.inkLight,
      id: `axis:${a.key}`,
    });
  });
  const res = (D.claims.claims || []).length;
  d.noteCard([x + 200, netY + 12], 'WHAT A QUIET MORNING MEANS',
    ['A quiet morning still carries news. Developments that fall outside every rule accumulate ' +
     'as RESIDUE, and the weekly schema review can answer a sustained cluster by adding an ' +
     'axis or a sub-axis on its own authority, logged for review. ' +
     `${res} claims stand registered for scoring as they resolve.`],
    { width: w - 210 });
}


// ── what a setting does to the forecast ──────────────────────────────────────
// A control that only changes a number teaches nothing. Each button carries the movement it
// makes in the median capability index at 2040, measured the way the chart measures it: sample
// the network with that setting held, take the median of the sampled paths, subtract the
// median without it. It is the same arithmetic for all 26 positions, so the figures compare.
const EFF_N = 48, EFF_YEAR = 2040;
// Capability alone is the wrong readout for most of these variables: by 2040 the median has
// already saturated the ladder under half the settings, so four of the seven rows would report
// nothing. Each position is measured against all seven quantities the model carries and prints
// the one it moves hardest, scaled by what counts as a movement in that quantity.
const EFF_READ = [
  ['MEDIAN CAPABILITY', (t, i) => t.cap[i], (d) => (d > 0 ? '+' : '') + d.toFixed(2), 0.15],
  ['COMPUTE', (t, i) => t.gw[i], (d) => (d > 0 ? '+' : '−') + fmtNum(Math.abs(d)) + ' GW', 250],
  ['AI REVENUE', (t, i) => t.rev[i], (d) => (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1) + ' $T', 0.5],
  ['EMPLOYMENT', (t, i) => t.jobs[i], (d) => (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1) + 'PP', 1.0],
  ['MEASURES IN FORCE', (t, i) => t.laws[i], (d) => (d > 0 ? '+' : '−') + Math.round(Math.abs(d)), 10],
  ['APPROVAL', (t, i) => t.appr[i], (d) => (d > 0 ? '+' : '−') + Math.abs(d).toFixed(1) + 'PP', 1.5],
  ['AI EMISSIONS', (t, i) => t.co2[i], (d) => (d > 0 ? '+' : '−') + fmtNum(Math.abs(d)) + ' MT', 80],
];
let effCache = { sig: null, base: null, map: {} };

// Common random numbers. Drawing a fresh stream for each setting makes the comparison mostly
// resampling noise — emissions are in the thousands, so a few unlucky draws swamp the real
// effect and every button reports the same movement. One fixed matrix of uniforms, one per
// sample per variable, is reused for every setting, so the only thing that differs between the
// baseline and the test is the setting itself.
let EFF_U = null;
function effUniforms() {
  if (EFF_U) return EFF_U;
  const rng = mulberry32(99173);
  EFF_U = [];
  for (let n = 0; n < EFF_N; n++) {
    const row = [];
    const per = D.network.axes.length * (1 + GIBBS_SWEEPS);
    for (let j = 0; j < per; j++) row.push(rng());
    EFF_U.push(row);
  }
  return EFF_U;
}
// THE FIGURE UNDER A BUTTON HAS TO ANSWER THE QUESTION THE DOCUMENT IS ASKING.
// This measured the intervened sampler in both modes, so alignment reported "no measured
// effect": under intervention A reaches the model through one edge (C given A1) and enters
// no track equation, so three of its four positions move nothing at all. Under observation
// it is one of the largest controls on the sheet — learning A4 moves T4 from 22% to 48% and
// drops the 2040 median capability by 1.3 rungs — because A's parent is T and learning the
// child reweights the parent. Reporting the first number while drawing the second is the
// defect.
//
// Observation is measured by FILTERING the fixed 2,000-line ensemble, which needs no RNG,
// so common random numbers are automatic. Below the same 40-line floor `recondition` uses,
// the subset is too thin to average and the intervened figure stands in.
const OBS_MIN = 40;
function readoutsEnsemble(pinned) {
  if (!D.ens2k) return null;
  const keys = Object.keys(pinned);
  const lines = keys.length
    ? D.ens2k.lines.filter((wl) => keys.every((k) => wl[k] === pinned[k]))
    : D.ens2k.lines;
  if (lines.length < OBS_MIN) return null;
  const sums = EFF_READ.map(() => 0);
  for (const wl of lines) {
    const tr = tracksJS(wl);
    const i = Math.max(0, Math.min(tr.year.length - 1, EFF_YEAR - D.engine.y0));
    EFF_READ.forEach((r, k) => { sums[k] += r[1](tr, i); });
  }
  return sums.map((s) => s / lines.length);
}
function readoutsFor(pinned, obs = false) {
  if (obs) { const e = readoutsEnsemble(pinned); if (e) return e; }
  const w = baseWeights(), U = effUniforms();
  const sums = EFF_READ.map(() => 0);
  for (let n = 0; n < EFF_N; n++) {
    const tr = tracksJS(sampleFixed(U[n], w, pinned));
    const i = Math.max(0, Math.min(tr.year.length - 1, EFF_YEAR - D.engine.y0));
    EFF_READ.forEach((r, k) => { sums[k] += r[1](tr, i); });
  }
  return sums.map((s) => s / EFF_N);
}
function effectsFor(pin, obs = state.obs) {
  const sig = JSON.stringify(pin) + (obs ? '|obs' : '|do');
  if (effCache.sig === sig) return effCache;
  const base = readoutsFor(pin, obs);
  const map = {};
  for (const a of D.network.axes) {
    for (const p of a.positions) {
      const key = `${a.key}:${p[0]}`;
      if (pin[a.key] === p[0]) { map[key] = 0; continue; }   // set: it is the baseline
      const v = readoutsFor({ ...pin, [a.key]: p[0] }, obs);
      let best = null, score = 0;
      EFF_READ.forEach((r, k) => {
        const d = v[k] - base[k], s = Math.abs(d) / r[3];
        if (s > score && s >= 1) { score = s; best = { label: r[0], text: r[2](d), d }; }
      });
      map[key] = best;
    }
  }
  effCache = { sig, base, map };
  return effCache;
}

// ── the notes: what the document is telling you ──────────────────────────────
// The parent writes each variable's provenance into its own description — which scenario a
// position was quarried from, and where in the literature it sits. That belongs in the method
// section and in the grounding line under a selected entry. On a button it crowds out what the
// setting actually means, so the clauses naming a source document are dropped here. The
// parent's text is left untouched; this is a reading of it.
const SCENARIO = new RegExp('(AI[- ]?20\\d\\d|Situational[- ]Awareness|Normal[- ]Technology' +
  '|Machines of Loving Grace|Europe 20\\d\\d|Plan A|plan family)', 'i');
function plain(text) {
  let out = String(text || '');
  // a dash clause or a parenthesis that exists only to name a source
  out = out.replace(
    /\s+[\u2013\u2014]\s+[^.;]*?(AI[- ]?20\d\d|Situational|Normal[- ]Technology|Loving Grace|Europe 20\d\d|Plan A|plan family)[^.;]*/gi, '');
  out = out.replace(/\s*\([^)]*(AI[- ]?20\d\d|Situational|Normal[- ]Technology|Plan A)[^)]*\)/gi, '');
  // then whole sentences that do the same
  const sents = out.split(/(?<=[.;])\s+/);
  const kept = sents.filter((q) => !SCENARIO.test(q));
  out = (kept.length ? kept : sents).join(' ')
    .replace(/\s+/g, ' ').replace(/\s+([.;,])/g, '$1').trim();
  if (out && !/[.!?]$/.test(out)) out += '.';
  return out;
}

// The evidence programme's recommendations were APPLIED to the parent network on
// 2026-08-13 (registry r3), so this table is now the record of what moved and
// from where. `recommend()` reports a move only while the live prior still
// differs from the researched figure, which is how a reader can see that the
// applied network and the research agree.
const RESEARCHED = {
  'T:T1': 0.110, 'T:T2': 0.420, 'T:T3': 0.300, 'T:T4': 0.170,   // r4, 17 Aug 2026
  'A:A1': 0.170, 'A:A2': 0.290, 'A:A3': 0.290, 'A:A4': 0.250,
  'C:C1': 0.340, 'C:C2': 0.260, 'C:C3': 0.120, 'C:C4': 0.270, 'C:C5': 0.010,
  'D:D1': 0.170, 'D:D2': 0.570, 'D:D3': 0.260,
  'S:S1': 0.350, 'S:S2': 0.330, 'S:S3': 0.320,
  'P:P1': 0.380, 'P:P2': 0.280, 'P:P3': 0.340,
  'E:E1': 0.260, 'E:E2': 0.440, 'E:E3': 0.220, 'E:E4': 0.080,
};
// What the priors were before the evidence round, so the sheet can show the move.
const PRIOR_R2 = {
  // T's comparison is r3, the revision r4 moved from; every other axis still
  // compares against r2, which is the last time it moved.
  'T:T1': 0.070, 'T:T2': 0.290, 'T:T3': 0.410, 'T:T4': 0.230,
  'A:A1': 0.116, 'A:A2': 0.263, 'A:A3': 0.351, 'A:A4': 0.270,
  'C:C1': 0.402, 'C:C2': 0.264, 'C:C3': 0.074, 'C:C4': 0.251, 'C:C5': 0.009,
  'D:D1': 0.177, 'D:D2': 0.559, 'D:D3': 0.264,
  'S:S1': 0.327, 'S:S2': 0.417, 'S:S3': 0.255,
  'P:P1': 0.259, 'P:P2': 0.312, 'P:P3': 0.429,
  'E:E1': 0.289, 'E:E2': 0.441, 'E:E3': 0.196, 'E:E4': 0.074,
};
function recommend(axis, pos) {
  const key = `${axis}:${pos}`;
  const from = PRIOR_R2[key], to = RESEARCHED[key];
  if (from === undefined || to === undefined) return null;
  return Math.abs(to - from) < 0.005 ? null : { from, to };
}

// ── the state handed to the sections ─────────────────────────────────────────
function sheetState(measure) {
  const wl = activeMain();
  const kn = capPath(wl);
  const tr = activeTracks();
  const idx = Math.max(0, Math.min(tr.year.length - 1, Math.floor(state.yr) - D.engine.y0));
  const cap = state.yr < NOW_Y ? trunkCap(state.yr) : tr.cap[idx];
  const eff = effectsFor(state.pin);
  // LEFT OF TODAY IS RECORD, AND TODAY IS ON THE RECORD TOO. The passage described a past year
  // with the forecast machinery — a sampled world-line, in the present tense, for a year already
  // decided — so 2017 read as a prediction about 2017. The guard stopped one year short: the
  // engine's first year is 2026, so 2026 itself still ran the forecast, and the sheet printed
  // whichever branch the controls had selected as though it were the present. August read it
  // back: "'savings tied to ai companies lose most of their value' is not the case... 2026
  // should reflect our current state and the record of 2026 so far." The project's own record
  // for 2026 says Nvidia closed at an all-time high in April. A CONTROL SETS A FUTURE; IT
  // CANNOT REWRITE WHAT HAS HAPPENED.
  const isRecord = state.yr < D.engine.y0 + 1;
  const paras = isRecord ? describeRecord(state.yr, trunkCap)
                         : describe(wl, state.yr, tr, D.engine.y0, trunkCap);
  const S = {
    yr: state.yr, NOW: NOW_Y, TRUNK, pin: state.pin, obs: state.obs, build: DATA_V,
    engine: D.engine, network: D.network, crisis: D.crisis, grounding: D.grounding,
    delta: D.delta, marginals: activeMarginals(), marginals30: marginals30(),
    lookbackDays: lookback().days,
    priors: D.marginals.today,
    bands: activeBands(), tracks: tr, events: activeEvents(),
    layers: activeLayers(), main: wl, idx, cap,
    capAt: (y) => capAt(kn, y), trunkCap,
    crossYear: (th) => {
      for (let i = 0; i < tr.cap.length; i++) if (tr.cap[i] >= th) return tr.year[i];
      return null;
    },
    // The forecast with nothing set, kept as a ghost line so a setting's effect is a visible gap
    baselineBands: (cond || state.alt !== null) ? D.bands.annual : null,
    altOrPinned: !!(cond || state.alt !== null),
    lineLabel: ['T', 'K', 'A', 'C', 'R', 'D', 'S', 'P', 'E'].map((k) => wl[k]).join('·'),
    effect: (k, p) => (eff.map[`${k}:${p}`] ?? null),
    isRecord,
    headline: isRecord ? headlineRecord(state.yr, trunkCap)
                       : headline(wl, state.yr, tr, D.engine.y0),
    record: RECORD, recordAt, chartView: state.chartView,
    recordWindow: state.recordWindow,
    prose: proseColumns(measure, paras),
    headlineH: 0,   // filled below, once the headline string exists
    figures: chooseFigures(wl, state.yr, cap),
    plain, recommend,
    drawWorld: drawWorldPlate, drawAlts: drawAltsPlate, drawMorning: drawMorningPlate,
  };
  // A note is drawn where the mark that opened it is: an axis entry unfolds inside its own row
  // on the controls, a milestone or a crisis point fills the band under the chart, and anything
  // on one of the other tabs sits at the head of that tab. Nothing sends the reader scrolling
  // to find the explanation of what they just pressed.
  S.headlineH = measure.wrap(S.headline, SHEET_CW, { size: 3.2, weight: 600 }).length
                * 3.2 * 1.28 + 3.2;
  const notes = selectionNotes();
  if (notes) {
    const kind = state.selected.split(':')[0];
    const onChart = kind === 'mile' || kind === 'crisis' || kind === 'rec';
    const inPanel = kind === 'axis' || kind === 'pos';
    // The panel letters the entry's name at 2.4 mm; repeating it as the first column heading
    // says the same thing twice in two sizes.
    const body = [{ ...notes[0], h: null }].concat(notes.slice(1));
    const mk = (w, columns) => {
      if (columns === 1) {
        return { title: notes[0].h || 'Note', cols: [body],
                 h: measureSections(measure, body, w - 8, 2.0) };
      }
      const bal = balance(measure, body, (w - 12) / 2, 2.0);
      return { title: notes[0].h || 'Note', cols: bal.cols, h: bal.h };
    };
    if (state.tab !== 'forecast') S.plateNote = mk(SHEET_W - 26, 2);
    else if (inPanel) {
      S.openAxis = state.selected.split(':')[1];
      S.openNote = mk(CTL_NOTE_W + 8, 1);
      if (S.openAxis !== state.ctlAxis) state.ctlAxis = S.openAxis;
    } else S.chartNote = mk(COL.mid.w, 2);
  }
  S.ctlAxis = state.ctlAxis;
  return S;
}

// ── the document: layout, picking, interaction ───────────────────────────────
function docWidth() {
  return Math.max(DOC_MIN, Math.min(DOC_MAX, Math.floor(document.documentElement.clientWidth - 40)));
}
function layout(S) {
  const W = docWidth();
  state.mmPerPx = SHEET_W / W;
  docEl.style.width = W + 'px';
  for (const s of SEC) {
    const on = s.tab === state.tab;
    if (s.on !== on) { s.on = on; s.el.style.display = on ? 'block' : 'none'; s.sig = ''; }
    if (!on) continue;
    const hmm = Math.max(20, s.fn.height(S));
    if (Math.abs(hmm - s.h) > 0.05) {
      s.h = hmm;
      s.el.style.height = (hmm / state.mmPerPx) + 'px';
      s.cv.style.height = (hmm / state.mmPerPx) + 'px';
      s.sig = '';
    }
    if (s.cv.clientWidth !== W) { s.cv.style.width = W + 'px'; s.sig = ''; }
  }
  state.fitted = W > 0;
}
function cursorToMM(sec, e) {
  const r = sec.cv.getBoundingClientRect();
  if (!(r.width > 0)) return null;
  const k = SHEET_W / r.width;
  return [(e.clientX - r.left) * k, (r.bottom - e.clientY) * k];
}
function sectionOf(el) { return SEC.find((s) => s.cv === el || s.el === el || s.el.contains(el)); }

let dragging = null;
function onDown(e) {
  const sec = sectionOf(e.target);
  if (!sec) return;
  const mm = cursorToMM(sec, e);
  if (!mm) return;
  const hit = sec.draft.hitTest(mm[0], mm[1]);
  if (!hit) { if (state.selected) { state.selected = null; writeHash(); redraw(); } return; }
  if (hit.id === 'ctl:time') {
    dragging = { sec, id: hit.id, map: hit.payload || null };
    sec.cv.setPointerCapture(e.pointerId);
    setTimeFrom(mm[0], hit.payload);
    return;
  }
  if (hit.id.startsWith('ctl:')) { applyControl(hit.id); return; }
  state.selected = state.selected === hit.id ? null : hit.id;
  if (hit.id.startsWith('alt:')) { state.alt = +hit.id.split(':')[1]; cond = null; state.pin = {}; }
  writeHash(); redraw();
}
function onMove(e) {
  if (dragging) {
    const mm = cursorToMM(dragging.sec, e);
    if (mm) setTimeFrom(mm[0], dragging.map);
    return;
  }
  const sec = sectionOf(e.target);
  if (!sec) { chipEl.style.display = 'none'; return; }
  const mm = cursorToMM(sec, e);
  const hit = mm ? sec.draft.hitTest(mm[0], mm[1]) : null;
  const id = hit ? hit.id : null;
  if (id !== (state.hovered && state.hovered.id)) {
    state.hovered = hit ? { ...hit, sec: sec.id } : null;
    docEl.style.cursor = hit ? 'pointer' : 'default';
    redraw();
  }
  const label = hit ? hoverLabel(hit) : null;
  if (label) {
    chipEl.innerHTML = `<b>${label[0]}</b>${label[1]}`;
    chipEl.style.display = 'block';
    const cw = chipEl.offsetWidth, ch = chipEl.offsetHeight;
    const left = e.clientX + 14 + cw > innerWidth - 6 ? e.clientX - 14 - cw : e.clientX + 14;
    const top = e.clientY + 16 + ch > innerHeight - 6 ? e.clientY - 12 - ch : e.clientY + 16;
    chipEl.style.left = Math.max(6, left) + 'px';
    chipEl.style.top = Math.max(6, top) + 'px';
  } else chipEl.style.display = 'none';
}
docEl.addEventListener('pointerdown', onDown);
docEl.addEventListener('pointermove', onMove);
docEl.addEventListener('pointerup', () => { dragging = null; });
docEl.addEventListener('pointerleave', () => { chipEl.style.display = 'none'; });

function setTimeFrom(mmX, map) {
  const yr = map && map.linear
    ? map.y0 + Math.max(0, Math.min(1, (mmX - map.x0) / map.w)) * (map.y1 - map.y0)
    : CHART.year(mmX);
  state.yr = Math.round(yr * 4) / 4;
  writeHash(); redraw();
}
function applyControl(id) {
  const [, kind, arg, pos] = id.split(':');
  if (kind === 'axis') {
    state.ctlAxis = arg;
    state.selected = null;
  } else if (kind === 'pin') {
    if (state.pin[arg] === pos) { delete state.pin[arg]; state.selected = `axis:${arg}`; }
    else { state.pin[arg] = pos; state.selected = `pos:${arg}:${pos}`; }
    state.alt = null; recondition();
    state.ctlAxis = arg;
  } else if (kind === 'mode') {
    state.obs = arg === 'obs';
    recondition();
  } else if (kind === 'rwin') {
    state.recordWindow = arg;
    state.selected = null;
  } else if (kind === 'view') {
    state.chartView = arg;
    state.selected = null;
  } else if (kind === 'reset') {
    state.pin = {}; state.alt = null; cond = null; state.selected = null;
  }
  writeHash(); redraw();
}
function hoverLabel(hit) {
  const [kind, ...rest] = hit.id.split(':');
  const m = activeMarginals();
  if (kind === 'ctl') {
    if (rest[0] === 'time') return ['DATE INDEX', 'drag to move the whole document in time'];
    if (rest[0] === 'axis') {
      const a = D.network.axes.find((z) => z.key === rest[1]);
      return a ? ['VARIABLE ' + rest[1], a.name] : null;
    }
    if (rest[0] === 'pin') {
      const a = D.network.axes.find((z) => z.key === rest[1]);
      const p = a && a.positions.find((q) => q[0] === rest[2]);
      // effectsFor stores {label, text, d} or 0 or null, never a bare number. This called
      // toFixed on the object and threw on every pointer move over a set-variable button —
      // latent until r5's edges gave enough settings a measurable effect to hover over.
      const e = effCache.map[`${rest[1]}:${rest[2]}`];
      const eff = e && e.text ? ` — ${e.text} on ${e.label.toLowerCase()} by 2040` : '';
      return p ? ['SET THIS VARIABLE', p[1] + eff] : null;
    }
    if (rest[0] === 'mode') return ['CONDITIONING MODE', rest[1] === 'obs'
      ? 'reweight everything else in light of the setting'
      : 'hold the setting, leave the rest at their priors'];
    if (rest[0] === 'reset') return ['RELEASE', 'return every variable to the evidence'];
    return ['CONTROL', hit.id.replace('ctl:', '')];
  }
  if (kind === 'axis') { const a = hit.payload; return ['VARIABLE ' + rest[0], a ? a.name : '']; }
  if (kind === 'pos') { const p = hit.payload;
    return ['POSITION ' + rest[1],
      (p ? p[1] : '') + ' — ' + (((m[rest[0]] || {})[rest[1]] || 0) * 100).toFixed(1) + '%']; }
  if (kind === 'crisis') { const c = hit.payload; return ['CRISIS POINT', c ? c.q : '']; }
  if (kind === 'mile') return ['MILESTONE DATUM', D.engine.ladder[+rest[0]] || ''];
  if (kind === 'dom') { const dm = D.engine.domains[+rest[0]];
    return dm ? ['CAPABILITY DOMAIN', dm.n] : null; }
  if (kind === 'site') { const p = hit.payload;
    return p ? ['COMPUTE SITE', `${p.s.n} — ~${p.gwSite.toFixed(1)} GW modelled`] : null; }
  if (kind === 'alt') { const e = hit.payload;
    return e ? ['ALTERNATIVE', ['T','K','A','C','R','D','S','P','E'].map((k) => e.wl[k]).join('·')] : null; }
  if (kind === 'delta') { const e = hit.payload; return e ? ['EVIDENCE APPLICATION', e.rule] : null; }
  if (kind === 'trk') return ['BEHAVIOUR TRACE', 'click for its mechanism'];
  if (kind === 'stat') return ['READING', hit.payload ? hit.payload[0] : ''];
  if (kind === 'layer') return ['OUTCOME LAYER', rest[0]];
  if (kind === 'wp') { const e = hit.payload;
    return e ? ['WAYPOINT', String(Math.floor(e.year))] : null; }
  return null;
}

addEventListener('keydown', (e) => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'Escape') { state.selected = null; redraw(); }
  if (e.key === 'ArrowLeft') {
    state.yr = Math.max(2012, state.yr - (e.shiftKey ? 5 : 0.5)); writeHash(); redraw(); }
  if (e.key === 'ArrowRight') {
    state.yr = Math.min(2100, state.yr + (e.shiftKey ? 5 : 0.5)); writeHash(); redraw(); }
});
addEventListener('resize', () => { for (const s of SEC) s.sig = ''; redraw(); });
// A shared link pasted into a tab that already has this document open changes the hash without
// reloading, so the state in the link would be ignored. Read it again when it changes.
addEventListener('hashchange', () => {
  if (!state.ready) return;
  state.pin = {}; state.alt = null; state.selected = null; cond = null;
  readHash();
  markTabs();
  for (const s of SEC) s.sig = '';
  redraw();
});

function writeHash() {
  const pins = Object.values(state.pin).join('.');
  history.replaceState(null, '',
    `#t=${state.tab}&v=${state.ctlAxis}&y=${state.yr.toFixed(2)}` +
    (pins ? `&pin=${pins}` : '') + (state.obs ? '&obs=1' : '') +
    (state.alt !== null ? `&alt=${state.alt}` : '') +
    (state.selected ? `&s=${encodeURIComponent(state.selected)}` : ''));
}
function readHash() {
  const h = location.hash;
  const t = h.match(/t=([a-z]+)/); if (t && TABS.some((q) => q.id === t[1])) state.tab = t[1];
  const v = h.match(/v=([A-Z])/); if (v) state.ctlAxis = v[1];
  const y = h.match(/y=([\d.]+)/); if (y) state.yr = Math.max(2012, Math.min(2100, +y[1]));
  const pin = h.match(/pin=([A-Z0-9.]+)/);
  if (pin) for (const pos of pin[1].split('.')) {
    const ax = D.network.axes.find((a) => a.positions.some((q) => q[0] === pos));
    if (ax) state.pin[ax.key] = pos;
  }
  state.obs = /obs=1/.test(h);
  const a = h.match(/alt=(\d+)/); if (a) state.alt = +a[1];
  const s = h.match(/s=([^&]+)/); if (s) state.selected = decodeURIComponent(s[1]);
  if (Object.keys(state.pin).length) recondition();
}

// ── the frame ────────────────────────────────────────────────────────────────
// Each section is its own canvas with its own signature, so a change that touches one section
// redraws one section. Sections outside the viewport are left for the observer to ask for.
let rafId = 0;
const visible = new Set();
function redraw() { if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; frame(); }); }

function frame() {
  if (!state.ready) return;
  const S = sheetState(SEC[0].draft);
  layout(S);
  if (!state.fitted) { requestAnimationFrame(frame); return; }
  const common = [state.tab, state.ctlAxis, state.yr.toFixed(2), JSON.stringify(state.pin),
                  state.obs ? 1 : 0, state.alt, state.selected,
                  state.hovered && state.hovered.id, docEl.clientWidth].join('|');
  for (const s of SEC) {
    if (!s.on || !visible.has(s.id)) continue;
    const sig = s.id + '|' + common + '|' + s.h.toFixed(2);
    if (sig === s.sig) continue;
    s.sig = sig;
    drawSection(s, S);
    layText(s);
  }
  markTabs();
}
// Write every lettered string into the transparent layer over its own section, at the place it
// was drawn, so a reader can select a paragraph and take it away. Reading order follows the
// drawing — down the sheet, then across — so a selection dragged over one column comes out as
// that column instead of a zigzag through all three.
function layText(s) {
  if (!s.tx) return;
  const k = 1 / state.mmPerPx;
  const marks = (s.draft.marks || []).filter((m) => m.str && String(m.str).trim() && !m.angle);
  // COPY READS COLUMN BY COLUMN, THEN DOWN. Sorting by y first put the three columns of the
  // passage on one line, so a copy came out interleaved: "...without supervision — writing and
  // debugging a · The Bureau of Industry and Security announced...". Marks are bucketed into
  // columns by where they sit across the sheet, and each column is read top to bottom before
  // the next begins.
  const COLW = SHEET_W / 3;
  const col = (m) => Math.min(2, Math.max(0, Math.floor(m.x / COLW)));
  marks.sort((a, b) => (col(a) - col(b)) || (b.y - a.y) || (a.x - b.x));
  const out = [];
  let line = [], lastY = null, lastCol = null;
  const flush = () => {
    if (!line.length) return;
    // EACH LINE IS ONLY AS WIDE AS ITS OWN TEXT. Full-width line divs stack on top of one
    // another, and at any point only the last one painted can take a selection — so with three
    // columns sharing a row, two of the three columns were unselectable and a drag returned
    // part of the page. The div is placed and sized from the marks it holds.
    const x0 = Math.min(...line.map((q) => q.left));
    const x1 = Math.max(...line.map((q) => q.left + q.w));
    for (const q of line) q.html = q.html.replace(/left:[-\d.]+px/,
      'left:' + (q.left - x0).toFixed(1) + 'px');
    out.push('<div style="position:absolute;left:' + x0.toFixed(1) + 'px;width:' +
             Math.max(1, x1 - x0).toFixed(1) + 'px;top:' + line[0].top +
             'px;white-space:pre-wrap">' +
             line.map((q) => q.html).join('') + '</div>');
    line = [];
  };
  for (const m of marks) {
    const c = col(m);
    const top = (s.h - m.y - m.h) * k;
    if (lastY === null || c !== lastCol || Math.abs(top - lastY) > 1.2) {
      flush(); lastY = top; lastCol = c;
    }
    // A trailing space inside the span, so two marks that meet on a line never run together.
    const left = m.x * k, w = (m.w || m.size * 4) * k;
    // The span carries the mark's own drawn width, so the highlight can be fitted to the
    // glyphs underneath rather than to whatever the page font happens to measure.
    line.push({ top: top.toFixed(1), left, w,
      html: '<span data-w="' + w.toFixed(2) + '" style="position:absolute;left:' +
            left.toFixed(1) + 'px;font-size:' + Math.max(6, m.size * k).toFixed(2) + 'px">' +
            String(m.str).replace(/&/g, '&amp;').replace(/</g, '&lt;') + ' </span>' });
  }
  flush();
  // ONLY WRITE WHEN THE TEXT CHANGED. Rewriting innerHTML destroys the very nodes a selection
  // is anchored to, and hovering redraws the section, so any drag across the passage collapsed
  // the moment the pointer moved. The layer is rebuilt only when its content differs.
  const html = out.join('');
  if (s.txHtml === html) return;
  s.txHtml = html; s.tx.innerHTML = html;
  // FIT EACH SPAN TO THE MARK IT SHADOWS. The overlay is set in the page's own font, so its
  // glyphs are a different width from the drawn ones and the selection highlight ended
  // mid-word, ragged, line after line. Every span is scaled horizontally to the width the
  // draughtsman actually drew. Widths are read in one pass and written in the next, so the
  // browser lays out twice rather than once per span.
  const spans = s.tx.querySelectorAll('span[data-w]');
  const scales = new Array(spans.length);
  for (let n = 0; n < spans.length; n++) {
    const want = parseFloat(spans[n].getAttribute('data-w'));
    const got = spans[n].offsetWidth;
    scales[n] = got > 0.5 ? want / got : 1;
  }
  for (let n = 0; n < spans.length; n++) {
    const sc = scales[n];
    if (sc > 0.2 && sc < 5 && Math.abs(sc - 1) > 0.01) {
      spans[n].style.transformOrigin = '0 0';
      spans[n].style.transform = 'scaleX(' + sc.toFixed(3) + ')';
    }
  }
}
function drawSection(s, S) {
  // `audit: true` records a box per lettered string. The collision sweep uses it, and so does
  // the selectable-text layer, which is why it is on for every draw now.
  s.draft.begin({ centre: [SHEET_W / 2, s.h / 2], mmPerPx: state.mmPerPx, audit: true });
  s.fn(s.draft, S, s.h);
  const hov = state.hovered && state.hovered.sec === s.id &&
              s.draft.regions.find((r) => r.id === state.hovered.id);
  if (hov && hov.id !== state.selected) highlight(s.draft, hov, false);
  const sel = state.selected && s.draft.regions.find((r) => r.id === state.selected);
  if (sel) highlight(s.draft, sel, true);
}
function highlight(d, r, isSel) {
  const c = isSel ? INK.red : INK.blue, m = 1.4;
  const x0 = r.x - m, y0 = r.y - m, x1 = r.x + r.w + m, y1 = r.y + r.h + m;
  d.polyline([[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
             { close: true, weight: isSel ? PEN.thin : PEN.hairline, colour: c,
               dash: isSel ? null : [2.4, 1.8] });
  if (isSel) {
    const t = Math.min(4.0, Math.min(r.w, r.h) * 0.30);
    for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1],
                                    [x1, y1, -1, -1], [x0, y1, 1, -1]]) {
      d.polyline([[cx + sx * t, cy], [cx, cy], [cx, cy + sy * t]],
                 { weight: PEN.medium, colour: c });
    }
  }
}

// ── the rail ─────────────────────────────────────────────────────────────────
function buildTabs() {
  tabsEl.innerHTML = '';
  for (const t of TABS) {
    const b = document.createElement('button');
    b.textContent = t.label;
    b.dataset.id = t.id;
    b.onclick = () => setTab(t.id);
    tabsEl.appendChild(b);
  }
  markTabs();
}
function markTabs() {
  for (const b of tabsEl.children) b.classList.toggle('on', b.dataset.id === state.tab);
}
function setTab(id) {
  if (state.tab === id) return;
  state.tab = id;
  // A selection made on one tab has no mark to point at on another, so it is released.
  state.selected = null;
  markTabs();
  scrollTo({ top: 0, behavior: 'instant' });
  writeHash();
  redraw();
}

// ── the collision audit ──────────────────────────────────────────────────────
// Every section, at several dates and selections, drawn with lettering recorded. Two defects
// are reported: lettering that overlaps other lettering or solid ground, and anything drawn
// outside the section. Run from the console: __FW.auditSweep().
function auditSweep({ tol = 0.6 } = {}) {
  const saved = { yr: state.yr, sel: state.selected, alt: state.alt,
                  pin: { ...state.pin }, hovered: state.hovered, tab: state.tab,
                  ctlAxis: state.ctlAxis };
  const cases = [];
  for (const yr of [2026.58, 2033, 2049, 2090]) cases.push({ yr, sel: null, pin: {} });
  for (const sel of ['axis:C', 'axis:T', 'pos:E:E4', 'crisis:deal-window',
                     'layer:climate', 'dom:4', 'mile:3']) {
    cases.push({ yr: 2033, sel, pin: {} });
  }
  for (const v of D.network.axes.map((a) => a.key)) {
    cases.push({ yr: 2036, sel: null, pin: {}, v });
  }
  for (const pin of [{ T: 'T1' }, { C: 'C5', D: 'D1' }, { T: 'T4', S: 'S3' },
                   { C: 'C3' }, { D: 'D1', E: 'E4', P: 'P1' }]) {
    cases.push({ yr: 2041, sel: null, pin });
  }
  const out = { cases: cases.length, collisions: [], offSheet: [], overflows: [], byCase: [] };
  state.hovered = null;
  for (const c of cases) {
    state.yr = c.yr; state.selected = c.sel; state.alt = null;
    state.pin = { ...c.pin };
    state.tab = 'forecast';
    state.ctlAxis = c.v || 'C';
    if (Object.keys(state.pin).length) recondition(); else cond = null;
    const S = sheetState(SEC[0].draft);
    for (const s of SEC) {
      state.tab = s.tab;
      const h = Math.max(20, s.fn.height(S));
      s.draft.begin({ centre: [SHEET_W / 2, h / 2], mmPerPx: state.mmPerPx, audit: true });
      s.fn(s.draft, S, h);
      const col = s.draft.collisions(tol);
      const off = s.draft.outside([0, 0, SHEET_W, h], 0.6);
      const ovf = s.draft.overflows || [];
      out.byCase.push({ sec: s.id, tab: s.tab, yr: c.yr, sel: c.sel,
                        pin: JSON.stringify(c.pin),
                        marks: s.draft.marks.length, col: col.length,
                        off: off.length, ovf: ovf.length });
      for (const x of ovf) out.overflows.push({ ...x, sec: s.id });
      for (const x of col) out.collisions.push({ ...x, sec: s.id, yr: c.yr, sel: c.sel });
      for (const x of off) out.offSheet.push({ ...x, sec: s.id, yr: c.yr, sel: c.sel });
    }
  }
  Object.assign(state, { yr: saved.yr, selected: saved.sel, alt: saved.alt,
                         pin: saved.pin, hovered: saved.hovered, tab: saved.tab,
                         ctlAxis: saved.ctlAxis });
  if (Object.keys(saved.pin).length) recondition(); else cond = null;
  for (const s of SEC) s.sig = '';
  redraw();
  // A positive control. The instrument reports a zero often enough that the zero has to be
  // earned: three faults are planted — two labels on top of each other, a label on declared
  // solid ground, and a mark past the frame — and all three must come back.
  {
    const d0 = SEC[0].draft;
    d0.begin({ centre: [SHEET_W / 2, 50], mmPerPx: state.mmPerPx, audit: true });
    d0.text([40, 50], 'CONTROL OVERLAP ALPHA', { size: 3 });
    d0.text([40, 50], 'CONTROL OVERLAP BETA', { size: 3 });
    d0.obstacle(100, 40, 40, 20, 'control-solid');
    d0.text([104, 46], 'CONTROL ON SOLID', { size: 3 });
    d0.text([SHEET_W + 40, 50], 'CONTROL OFF SHEET', { size: 3 });
    const cc = d0.collisions(tol), oo = d0.outside([0, 0, SHEET_W, 100], 0.6);
    out.control = { textText: cc.filter((c) => c.kind === 'text/text').length,
                    textSolid: cc.filter((c) => c.kind === 'text/solid').length,
                    offSheet: oo.length };
    out.controlPasses = out.control.textText >= 1 && out.control.textSolid >= 1 &&
                        out.control.offSheet >= 1;
    d0.marks = null; d0.obstacles = null;
  }
  out.collisions.sort((a, b) => b.area - a.area);
  out.worstCollisions = out.collisions.slice(0, 24);
  out.marksTotal = out.byCase.reduce((a, b) => a + b.marks, 0);
  out.offSheetUnique = [...new Map(out.offSheet.map((o) => [o.str + '|' + o.sec, o]))
                        .values()].slice(0, 40);
  return out;
}

// ── boot ─────────────────────────────────────────────────────────────────────
const J = (n) => fetch(`data/forecast/${n}?v=${DATA_V}`).then((r) => {
  if (!r.ok) throw new Error(n); return r.json();
});
async function boot() {
  const mast = document.getElementById('mast');
  [D.engine, D.network, D.bands, D.marginals, D.mainline, D.crisis, D.delta,
   D.claims, D.grounding, D.climate] = await Promise.all([
    J('engine.json'), J('network.json'), J('bands.json'), J('marginals.json'),
    J('mainline.json'), J('crisis.json'), J('delta.json'), J('claims.json'),
    J('grounding.json'), J('climate.json')]);
  readHash();

  document.body.style.backgroundImage = `url(${paperTileURL()})`;
  docEl.style.backgroundImage = `url(${paperTileURL()})`;
  for (const s of SECTIONS) {
    const el = document.createElement('section');
    const cv = document.createElement('canvas');
    // THE SHEET IS DRAWN, SO NOTHING ON IT COULD BE SELECTED OR COPIED. Every string the
    // draughtsman letters is also written into a transparent layer over the same section, at
    // the position it was drawn, so a reader can select a paragraph and take it with them.
    // The layer is inert to the pointer, which keeps the marks underneath hit-testable, and
    // it is turned on only while a selection is being made.
    const tx = document.createElement('div');
    tx.className = 'seltext';
    el.appendChild(cv);
    el.appendChild(tx);
    docEl.appendChild(el);
    SEC.push({ id: s.id, fn: s.fn, tab: s.tab, el, cv, tx,
               draft: new Draft(cv), h: 0, sig: '', on: null });
  }
  buildTabs();
  // Only what is on screen is drawn; a section entering the viewport asks for its own ink.
  const io = new IntersectionObserver((ents) => {
    let need = false;
    for (const e of ents) {
      const s = SEC.find((q) => q.el === e.target);
      if (!s) continue;
      if (e.isIntersecting) { visible.add(s.id); need = true; } else visible.delete(s.id);
    }
    if (need) redraw();
  }, { rootMargin: '600px 0px' });
  for (const s of SEC) io.observe(s.el);

  // Prime the passage's height reserve before the first draw, so the document does not
  // resettle under the reader on their first drag of the date. Composing and measuring is
  // cheap — the expensive part of a state is the sampling, and this reuses one sample.
  {
    const keep = state.yr;
    for (let y = D.engine.y0; y <= D.engine.y1; y += 6) { state.yr = y; sheetState(SEC[0].draft); }
    state.yr = D.engine.y1; sheetState(SEC[0].draft);
    state.yr = keep;
  }
  state.ready = true;
  redraw();
  new ResizeObserver(() => { for (const s of SEC) s.sig = ''; redraw(); }).observe(docEl);
  mast.textContent = 'AI Futures Forecaster · ' + D.network.date;

  J('exemplars.json').then((d) => { D.exemplars = d; for (const s of SEC) s.sig = ''; redraw(); })
    .catch(() => {});
  J('ensemble2k.json').then((d) => { D.ens2k = d; }).catch(() => {});
  fetch(`data/countries-110m.json?v=${DATA_V}`).then((r) => (r.ok ? r.json() : null))
    .then((d) => { if (d) { D.topo = d; for (const s of SEC) s.sig = ''; redraw(); } })
    .catch(() => {});
  // applyControl and recondition are on the debug surface because setting `state.pin`
  // directly does NOT resample: the pin only reaches the sampler through this path.
  // A verification that assigns state.pin and reads sheetState() silently measures the
  // unpinned line and reports that nothing moved. That has happened twice.
  window.__FW = { state, D, SEC, sheetState: () => sheetState(SEC[0].draft), capPath, capAt, tracksJS, auditSweep,
                  effectsFor, redraw, applyControl, recondition, readoutsFor };
  window.__FRAME_READY = true;
}
boot().catch((e) => {
  document.getElementById('mast').textContent = 'FAILED: ' + e.message;
  console.error(e);
});
