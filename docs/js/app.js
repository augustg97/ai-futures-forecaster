// THE FORECAST WORKS — state, the engine, and the board
//
// The forecast engine itself lives in the AI Atlas: the belief network, the evidence layer that
// moves it every morning, the wiki grounding, the nightly gate. This sheet is a SECOND SURFACE
// on that instrument. It reads the same emitted data and implements the same functions against
// the same shipped constants (`engine.json`), so the two surfaces cannot drift apart.

import { Draft, PEN, INK, drawPaper } from './draft.js?v=20260811-2247';
import { PLATES, SHEET, ZONE, drawPlate, fmtDate } from './plates.js?v=20260811-2247';
import { dial, column, strip, fmtNum } from './instruments.js?v=20260811-2247';

// One build number, injected into index.html at ship time, versions BOTH the data fetches and
// (via the build's import rewrite) every module. A fresh app.js against a stale draft.js is the
// worst version of the cache failure, because it renders — and renders wrong.
const DATA_V = (typeof window !== 'undefined' && window.__BUILD) || 'DEV';
const NOW_Y = 2026.58;
const TRUNK = [[2012, 0.15], [2016, 0.45], [2019, 0.8], [2022, 1.1], [2022.92, 1.5],
               [2024, 1.9], [2025.5, 2.3], [NOW_Y, 2.6]];
const BOARD = [SHEET[0] + 190, SHEET[1] + 140];

const board = document.getElementById('board');
const inkCv = document.getElementById('ink');
const paperCv = document.getElementById('sheet');
const chipEl = document.getElementById('chip');
const draft = new Draft(inkCv);
const D = {};

const state = {
  plateId: 'mainline', yr: NOW_Y, pin: {}, obs: false, alt: null,
  centre: [0, 0], mmPerPx: 0.5, hovered: null, selected: null,
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
  let decline = C.decline[wl.S] - (wl.C === 'C3' ? C.c3_bonus : 0);
  const out = { year: [], cap: [], gw: [], us: [], cn: [], eu: [], rev: [], jobs: [],
                laws: [], appr: [], copies: [], speed: [], twh: [], co2: [] };
  for (let y = D.engine.y0; y <= D.engine.y1; y++) {
    const c = capAt(kn, y);
    let g = P.COMPUTE_G[wl.S] * P.E_DAMP[wl.E];
    g = 1.0 + (g - 1.0) * (1.0 / (1.0 + Math.max(0, gw / 8000.0)));
    gw = Math.min(60000.0, gw * g);
    if (wl.C === 'C2') us = Math.min(0.72, us + 0.004);
    if (wl.C === 'C3') { us = Math.max(0.44, us - 0.003); cn = Math.min(0.30, cn + 0.002); }
    if (wl.C === 'C4') eu = Math.min(0.16, eu + 0.0025);
    cn = Math.min(0.34, cn + (wl.S !== 'S3' ? 0.003 : 0.0));
    const lift = 1.0 + 0.10 * Math.max(0, c - 2.6);
    const rg = 1.0 + (P.REV_G[wl.D] - 1.0) * lift;
    rev = Math.min(30.0, rev * (1.0 + (rg - 1.0) / (1.0 + rev / 6.0)));
    jobs = Math.max(-35.0, jobs + P.JOBS_RATE[wl.D] * Math.min(2.5, Math.max(0.3, c - 2.0)));
    laws = laws + P.LAWS_RATE[wl.C];
    appr += (wl.D === 'D1' ? -1.2 : -0.3) + (wl.C === 'C3' ? 0.8 : 0.0);
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
function sampleOne(rng, weights, pinned) {
  const wl = {};
  for (const a of D.network.axes) {
    const k = a.key;
    if (pinned[k]) { wl[k] = pinned[k]; continue; }
    const w = {};
    for (const p of a.positions) w[p[0]] = weights[k][p[0]];
    const cond = D.network.conditionals[k] || {};
    for (const par in cond) {
      if (Object.values(wl).includes(par)) {
        for (const pos in cond[par]) if (w[pos] !== undefined) w[pos] *= cond[par][pos];
      }
    }
    const tot = Object.values(w).reduce((x, y) => x + y, 0);
    let r = rng() * tot, chosen = null;
    for (const pos in w) { r -= w[pos]; if (r <= 0) { chosen = pos; break; } }
    wl[k] = chosen || Object.keys(w)[0];
  }
  return wl;
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
function argmaxLine(weights, pinned) {
  const keys = D.network.axes.map((a) => a.key);
  const posl = D.network.axes.map((a) => a.positions.map((p) => p[0]));
  let best = null, bp = -1;
  const rec = (i, wl) => {
    if (i === keys.length) { const p = jointP(wl, weights); if (p > bp) { bp = p; best = { ...wl }; } return; }
    const k = keys[i];
    for (const o of (pinned[k] ? [pinned[k]] : posl[i])) { wl[k] = o; rec(i + 1, wl); }
  };
  rec(0, {});
  return [best, bp];
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
  const [ml] = argmaxLine(w, state.pin);
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
function marginals30() {
  const h = D.marginals.history;
  if (!h || h.length < 2 || cond) return {};
  return h[Math.max(0, h.length - 31)].marginals || {};
}

// ── the notes column: what the sheet is telling you ──────────────────────────
function baseNotes() {
  const g = D.grounding.counts;
  const m = activeMarginals();
  const pct = (k, p) => ((m[k] || {})[p] * 100 || 0).toFixed(0);
  const del = D.delta.entries || [];
  const today = del.filter((e) => e.date === D.delta.date);
  return [
    { h: 'What this sheet is', p: [
      'A probabilistic world-model of the AI transition, 2012 to 2100, drawn as a document. ' +
      'The observed record to the left of TODAY is the wiki\'s own dated record. Everything ' +
      'to the right is a distribution over futures — not one path, and not a prediction of ' +
      'the draughtsman\'s.',
      'The forecast is re-sampled every morning from the AI Policy Wiki as it records what ' +
      'actually happened, so this sheet is redrawn daily and its title block carries the date ' +
      'it was read.'] },
    { h: 'Why the forecast has this shape', p: [
      `It is a MIXTURE of tempos, not a path. A ${pct('T', 'T1')}% explosive tail pulls the ` +
      `upper envelope to the ceiling by the early 2030s; the ${pct('T', 'T2')}% fast and ` +
      `${pct('T', 'T3')}% gradual mass carries the median through the superhuman-coder datum ` +
      `and on to researcher level mid-decade; and the ${pct('T', 'T4')}% no-superintelligence ` +
      'floor is why the lower envelope stays under the researcher datum into the 2050s.',
      'Shelves inside the band are policy, not physics: a verified deal holds lines at ' +
      'expert level from 2035 to 2040, and the moratorium tail freezes below the researcher ' +
      'datum altogether. Past 2045 most sampled futures saturate the ladder — what still ' +
      'differs there is OUTCOMES, which is what the behaviour traces and the notes track.'] },
    { h: 'Reading the drawing', p: [
      'Blue is probability in motion: the envelopes, the median, the date index. Ink is the ' +
      'observed record and the structure of the sheet. Red is annotation and revision — ' +
      'including whatever the evidence moved this morning. Green is a goal or a target. ' +
      'Ochre carries delays and the active composed line. Chain-dot rules across the drawing ' +
      'are DATUMS: the capability milestones, each a level the run has passed.',
      'Anything drawn can be pointed at. Hovering rules a light box around a mark; clicking ' +
      'pins a note card to it and fills this column with the full entry.'] },
    { h: 'This morning', p: today.length
      ? [`${today.length} evidence applications were made to the network today. ` +
         today.slice(-3).map((e) => `${e.rule} (${e.impact_class}, ×${(e.magnitude || 0).toFixed(4)})`).join('; ') + '.',
         'Each application logs its arithmetic — impact class, corroborating sources, ' +
         'novelty decay, the axis positions moved and the driver that moved them. Plate 4 ' +
         'draws the day in full.']
      : ['No evidence application has been made since the last emit. The residue — ' +
         'developments no rule yet reads — accumulates for the weekly schema review, which ' +
         'may add an axis or a sub-axis on its own and log it for review. Plate 4 draws the ' +
         'morning in full.'] },
    { h: 'Where these probabilities come from', p: [
      `A documented belief network of ${D.network.axes.length} axes with sub-axes, priors ` +
      `carrying provenance, and cited conditionals, sampled into an ensemble of world-lines. ` +
      `${g.direct} wiki pages ground the engine directly; ${g.corpus} more feed the observed ` +
      'record. Thin axes get widened priors — uncertainty is inherited, never hidden.',
      'They are the model\'s structured judgments, not measurements. Registered claims are ' +
      'scored in public as they resolve.'] },
  ];
}

function axisNotes(a) {
  const m = activeMarginals()[a.key] || {}, w30 = marginals30()[a.key] || {};
  const secs = [{ h: a.name, p: [a.desc || ''] }];
  const rows = a.positions.map((p) => {
    const now = (m[p[0]] || 0) * 100, was = (w30[p[0]] ?? null);
    const dr = was === null ? '' :
      ` (${(now - was * 100) >= 0 ? '+' : ''}${(now - was * 100).toFixed(1)}pp in 30 days)`;
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
  if (inter.length) secs.push({ h: 'How this axis interacts', p: inter });
  // A sub-axis carrying `origin` was added by the parent's weekly schema review, not by the
  // draughtsman. It is uncited and unapproved, so it is not drawn as though it were authored.
  const subs = a.subaxes || [];
  const drawn = subs.filter((s) => !s.origin), prov = subs.filter((s) => s.origin);
  if (drawn.length) {
    secs.push({ h: 'Sub-axes', p: [drawn.map((s) => s.name || s.key).join(' · ')] });
  }
  if (prov.length) {
    secs.push({ h: 'Sub-axes — provisional, not approved', p: prov.map(
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
    return [{ h: `${p[0]} · ${p[1]}`, p: [p[4] || '', `Weight today: ${((m[a.key] || {})[p[0]] * 100 || 0).toFixed(1)}%.`] },
            { h: 'On this axis', p: [a.desc || ''] },
            { h: 'Grounding', p: [(p[3] || []).join(' · ')] }];
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
      `Instantiated on the active world-line (${['T','A','C','D','S','P','E'].map((k) => activeMain()[k]).join('·')}) from a cited template. A composed line re-instantiates its own.`] },
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
      'Composition ' + ['T','A','C','D','S','P','E'].map((k) => e.wl[k]).join('·') + '. ' +
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
  d.text([x, y + h + 6], 'THE WORLD',
         { size: 3.6, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y + h + 2],
         'THE ACTIVE WORLD-LINE ON THE GROUND · REGIME TINT ∝ MODELLED COMPUTE SHARE · ' +
         'SITE SYMBOL ∝ MODELLED CAPACITY',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });
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
  d.text([x, y + h + 6], 'ALTERNATIVE FUTURES',
         { size: 3.6, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y + h + 2],
         'TWELVE SAMPLED WORLD-LINES ACROSS THE PROBABILITY CURVE · EACH DRAWN IN FULL · ' +
         'CLICK ONE TO MAKE IT THE ACTIVE LINE ON EVERY PLATE',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });
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
    d.text([cx + 6, cy + ch - 12], ['T','A','C','D','S','P','E'].map((k) => e.wl[k]).join('·'),
           { size: 2.0, face: 'figure', weight: 700, colour: on ? INK.ochre : INK.ink });
    d.text([cx + 6, cy + ch - 15.6], pk.label,
           { size: 1.4, colour: INK.pencilLight, track: 0.12 });
    const ph = altPhrase(e);
    d.textBlock([cx + 6, cy + 11], ph.charAt(0).toUpperCase() + ph.slice(1),
                cw - 14, { size: 1.6, lead: 1.4, colour: INK.pencil, max: 2 });
    d.region(`alt:${pk.i}`, cx + 2, cy + 8, cw - 6, ch - 14, e);
  });
}

function drawMorningPlate(d, S, box) {
  const [x, y, w, h] = box;
  d.text([x, y + h + 6], "THIS MORNING'S REVISION",
         { size: 3.6, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y + h + 2],
         `EVIDENCE APPLIED TO THE NETWORK ON ${D.delta.date} · EVERY MARK CARRIES ITS ` +
         'ARITHMETIC AND ITS DRIVER',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });
  const ent = (D.delta.entries || []).slice().reverse();
  const today = ent.filter((e) => e.date === D.delta.date);
  const show = (today.length ? today : ent).slice(0, 14);
  if (!show.length) {
    d.text([x + 6, y + h - 20], 'NO EVIDENCE APPLICATION IS RECORDED.',
           { size: 2.6, colour: INK.pencil, track: 0.10 });
    return;
  }
  d.text([x, y + h - 8], today.length
    ? `${today.length} APPLICATIONS TODAY` : `LATEST ${show.length} APPLICATIONS ON RECORD`,
    { size: 2.2, colour: INK.red, weight: 700, track: 0.16 });
  const rowH = Math.min(34, (h * 0.62 - 26) / show.length);
  show.forEach((e, i) => {
    const ry = y + h - 16 - (i + 1) * rowH;
    d.line([x, ry + rowH - 1.5], [x + w, ry + rowH - 1.5],
           { weight: PEN.hairline, colour: INK.inkLight, alpha: 0.6 });
    d.text([x + 1, ry + rowH - 6], e.rule,
           { size: 2.1, weight: 700, colour: INK.ink, track: 0.06 });
    d.text([x + 1, ry + rowH - 9.4],
           `${(e.impact_class || '').toUpperCase()} · ×${(e.magnitude || 0).toFixed(4)} · ` +
           `${e.sources || 1} SOURCE(S) · k=${(e.repeat_k ?? 0)}`,
           { size: 1.5, colour: INK.pencilLight, face: 'figure' });
    // the movement, drawn as a bar per axis position
    let bx = x + 96;
    for (const [k, v] of Object.entries(e.applied || {})) {
      const mag = Math.min(20, Math.abs(v) * 900);
      d.rect(bx, ry + rowH - 8.4, mag, 2.2,
             { weight: PEN.hairline, colour: v >= 0 ? INK.green : INK.red,
               fill: v >= 0 ? INK.greenWash : 'rgba(150,44,38,0.18)' });
      d.text([bx, ry + rowH - 10.8], `${k} ${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}pp`,
             { size: 1.4, colour: v >= 0 ? INK.green : INK.red, face: 'figure' });
      bx += Math.max(26, mag + 8);
    }
    if (e.driver) {
      d.textBlock([x + 1, ry + rowH - 13.0], 'DRIVER: ' + e.driver, w - 4,
                  { size: 1.55, lead: 1.4, colour: INK.pencil, max: 2 });
    }
    d.region(`delta:${(D.delta.entries || []).indexOf(e)}`, x, ry, w, rowH, e);
    if (i === 0) d.revisionCloud(x - 2, ry + 0.5, w + 4, rowH - 1);
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
  D.network.axes.forEach((a, i) => {
    column(d, x + 4 + i * 26, netY - 22, 7, 20, {
      value: Math.min(1, (drift[a.key] || 0) / 0.02),
      label: a.key + ' · ' + a.name.toUpperCase().slice(0, 12),
      sub: ((drift[a.key] || 0) * 100).toFixed(2) + 'pp',
      colour: (drift[a.key] || 0) > 0 ? INK.red : INK.inkLight,
      id: `axis:${a.key}`,
    });
  });
  const res = (D.claims.claims || []).length;
  d.noteCard([x + 200, netY + 12], 'WHAT A QUIET MORNING MEANS',
    ['A morning with few applications is not a morning with no news. Developments no rule ' +
     'yet reads accumulate as RESIDUE, and the weekly schema review may answer a sustained ' +
     'cluster by adding an axis or a sub-axis on its own — logged for review, never silent. ' +
     `${res} claims stand registered for scoring as they resolve.`],
    { width: w - 210 });
}

function drawKeyPlate(d, S, box) {
  const [x, y, w, h] = box;
  d.text([x, y + h + 6], 'THE KEY',
         { size: 3.6, weight: 600, track: 0.13, colour: INK.ink });
  d.text([x, y + h + 2],
         'THE CONVENTIONS THIS SHEET IS DRAWN IN, AND THE VOCABULARY IT USES',
         { size: 1.8, colour: INK.pencilLight, track: 0.10 });
  let yy = y + h - 12;
  d.text([x, yy], 'LINE TYPES', { size: 2.8, weight: 700, track: 0.16, colour: INK.ink });
  yy -= 6;
  const lines = [
    ['OBSERVED RECORD', INK.ink, PEN.outline, null,
     'What the wiki has recorded. To the left of TODAY, and never extrapolated.'],
    ['THE DISTRIBUTION', INK.blue, PEN.outline, null,
     'Probability in motion: the median world-line, the envelopes, the date index.'],
    ['DATUM', INK.red, PEN.thin, [7, 2, 1.4, 2],
     'A capability milestone — a level the run has passed, ruled across the drawing.'],
    ['ANNOTATION / REVISION', INK.red, PEN.thin, null,
     'Dimensions, notes, and whatever this morning\'s evidence moved.'],
    ['THE ACTIVE COMPOSED LINE', INK.ochre, PEN.medium, [4, 2],
     'A world-line you pinned or selected, drawn against the distribution it came from.'],
    ['GOAL / TARGET', INK.green, PEN.medium, [5, 2, 1.4, 2],
     'A registered claim or a coordination target — something aimed at rather than expected.'],
    ['ENERGY', INK.warm, PEN.medium, null,
     'Compute, power and emissions — the physical substrate of the whole thing.'],
  ];
  for (const [name, c, pen, dash, gloss] of lines) {
    d.line([x, yy], [x + 24, yy], { weight: pen, colour: c, dash });
    d.text([x + 28, yy - 0.8], name, { size: 2.2, weight: 600, track: 0.12, colour: c });
    d.textBlock([x + 28, yy - 4.2], gloss, w * 0.44,
                { size: 1.8, lead: 1.4, colour: INK.pencil, max: 2 });
    yy -= 12.5;
  }
  // the axis glossary, three columns
  const gx = x + w * 0.52;
  let gy = y + h - 12;
  d.text([gx, gy], 'THE SEVEN AXES',
         { size: 2.8, weight: 700, track: 0.16, colour: INK.ink });
  gy -= 6;
  for (const a of D.network.axes) {
    d.text([gx, gy], a.key + ' · ' + a.name.toUpperCase(),
           { size: 2.1, weight: 700, track: 0.10, colour: INK.ink });
    const used = d.textBlock([gx, gy - 3.6], a.desc || '', w * 0.44,
                             { size: 1.75, lead: 1.4, colour: INK.pencil, max: 3 });
    d.text([gx, gy - 4.2 - used], a.positions.map((p) => p[0]).join(' · '),
           { size: 1.6, colour: INK.blue, face: 'figure' });
    d.region(`axis:${a.key}`, gx - 2, gy - 6 - used, w * 0.46, 9 + used, a);
    gy -= used + 11;
  }
  d.noteCard([x, y + 46],
             'THE INSTRUMENT, NOT THE GRAPHIC',
             ['Where a real instrument already performs an abstraction, this sheet builds it: ' +
              'a probability is a needle on an engraved face, a drift is the angle between two ' +
              'needles, a share is a float riding in a tube, a threshold is a lamp that trips, ' +
              'a quantity over time is a pen on a moving chart.'],
             { width: w * 0.46 });
}

// ── the sheet state handed to the plates ─────────────────────────────────────
function sheetState() {
  const wl = activeMain();
  const kn = capPath(wl);
  const sel = selectionNotes();
  return {
    plateId: state.plateId,
    plateTitle: (PLATES.find((p) => p.id === state.plateId) || {}).title || '',
    yr: state.yr, NOW: NOW_Y, TRUNK, pin: state.pin, obs: state.obs,
    engine: D.engine, network: D.network, crisis: D.crisis, grounding: D.grounding,
    delta: D.delta, marginals: activeMarginals(), marginals30: marginals30(),
    bands: activeBands(), tracks: activeTracks(), events: activeEvents(),
    layers: activeLayers(), main: wl,
    capAt: (y) => capAt(kn, y), trunkCap,
    altOrPinned: !!(cond || state.alt !== null),
    lineLabel: ['T','A','C','D','S','P','E'].map((k) => wl[k]).join('·') +
      (state.alt !== null ? '  ·  ALTERNATIVE' : cond ? '  ·  COMPOSED' : '  ·  MAINLINE'),
    notes: sel || baseNotes(),
    epigraph: {
      lines: ['“IT IS A VEHICLE FOR COMMUNICATING', 'AND STRESS-TESTING OUR', 'RECOMMENDATIONS.”'],
      cite: 'AI 2040: PLAN A, ON WHAT A SCENARIO IS FOR',
    },
    drawWorldPlate, drawAltsPlate, drawMorningPlate, drawKeyPlate,
  };
}

// ── the board: view, picking, interaction ────────────────────────────────────
// A zero-sized board yields a non-finite scale, and a non-finite scale draws nothing while
// reporting no error — the module can run before the browser has laid the page out. So fitting
// is a no-op until the board has a size, and the first frame retries it.
function fitSheet() {
  const w = board.clientWidth, h = board.clientHeight;
  if (!(w > 0 && h > 0)) return false;
  state.mmPerPx = Math.max(SHEET[0] / (w * 0.985), SHEET[1] / (h * 0.94));
  state.centre = [0, 0];
  state.fitted = true;
  clampView();
  return true;
}
function fitSheetIfUnset() {
  if (!state.fitted || !Number.isFinite(state.mmPerPx) || state.mmPerPx <= 0) fitSheet();
}
function clampView() {
  const maxX = Math.max(0, (BOARD[0] - board.clientWidth * state.mmPerPx) / 2);
  const maxY = Math.max(0, (BOARD[1] - board.clientHeight * state.mmPerPx) / 2);
  state.centre[0] = Math.max(-maxX, Math.min(maxX, state.centre[0]));
  state.centre[1] = Math.max(-maxY, Math.min(maxY, state.centre[1]));
}
function cursorToSheet(e) {
  const r = board.getBoundingClientRect();
  return [state.centre[0] + (e.clientX - r.left - r.width / 2) * state.mmPerPx,
          state.centre[1] - (e.clientY - r.top - r.height / 2) * state.mmPerPx];
}

let drag = null;
board.addEventListener('pointerdown', (e) => {
  const [mx, my] = cursorToSheet(e);
  const hit = draft.hitTest(mx, my);
  if (hit && hit.id.startsWith('ctl:')) {
    drag = { kind: 'ctl', id: hit.id, moved: false };
    if (hit.id === 'ctl:time') setTimeFromPointer(mx);
    else applyControl(hit.id);
    board.setPointerCapture(e.pointerId);
    return;
  }
  drag = { kind: 'pan', x: e.clientX, y: e.clientY,
           cx: state.centre[0], cy: state.centre[1], moved: false, hit };
  board.classList.add('dragging');
  board.setPointerCapture(e.pointerId);
});
board.addEventListener('pointermove', (e) => {
  const [mx, my] = cursorToSheet(e);
  if (drag && drag.kind === 'ctl') {
    drag.moved = true;
    if (drag.id === 'ctl:time') { setTimeFromPointer(mx); schedule(); }
    return;
  }
  if (drag && drag.kind === 'pan') {
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    state.centre[0] = drag.cx - dx * state.mmPerPx;
    state.centre[1] = drag.cy + dy * state.mmPerPx;
    clampView(); markMoving(); schedule();
    return;
  }
  const hit = draft.hitTest(mx, my);
  const id = hit ? hit.id : null;
  if (id !== (state.hovered && state.hovered.id)) {
    state.hovered = hit;
    board.style.cursor = hit ? (hit.id.startsWith('ctl:') ? 'pointer' : 'pointer') : 'grab';
    schedule();
  }
  if (hit) {
    const label = hoverLabel(hit);
    if (label) {
      chipEl.innerHTML = `<b>${label[0]}</b>${label[1]}`;
      chipEl.style.display = 'block';
      // Flip the chip back inside the window near an edge — trailing the cursor blindly
      // pushes it off the page, which is the one piece of lettering the sheet's own audit
      // cannot see because it is not on the sheet.
      const cw = chipEl.offsetWidth, chh = chipEl.offsetHeight;
      const left = e.clientX + 14 + cw > innerWidth - 6 ? e.clientX - 14 - cw : e.clientX + 14;
      const top = e.clientY + 16 + chh > innerHeight - 6 ? e.clientY - 12 - chh : e.clientY + 16;
      chipEl.style.left = Math.max(6, left) + 'px';
      chipEl.style.top = Math.max(6, top) + 'px';
    } else chipEl.style.display = 'none';
  } else chipEl.style.display = 'none';
});
board.addEventListener('pointerup', (e) => {
  board.classList.remove('dragging');
  if (drag && drag.kind === 'pan' && !drag.moved) {
    const hit = drag.hit;
    if (hit && !hit.id.startsWith('ctl:')) {
      state.selected = state.selected === hit.id ? null : hit.id;
      writeHash();
    } else if (!hit) state.selected = null;
    schedule();
  }
  drag = null;
});
board.addEventListener('pointerleave', () => { chipEl.style.display = 'none'; });
board.addEventListener('wheel', (e) => {
  e.preventDefault();
  const before = cursorToSheet(e);
  const maxMm = Math.max(BOARD[0] / board.clientWidth, BOARD[1] / board.clientHeight);
  state.mmPerPx = Math.max(0.06, Math.min(maxMm, state.mmPerPx * Math.exp(e.deltaY * 0.0012)));
  const after = cursorToSheet(e);
  state.centre[0] += before[0] - after[0];
  state.centre[1] += before[1] - after[1];
  clampView(); markMoving(); schedule();
}, { passive: false });

function setTimeFromPointer(mx) {
  const L = ZONE.left;
  const bx = L.x + 8 + 24, bw = (L.w - 16) - 24;
  const t = Math.max(0, Math.min(1, (mx - bx) / bw));
  state.yr = 2012 + t * (2100 - 2012);
  writeHash();
}
function applyControl(id) {
  const [, kind, arg] = id.split(':');
  if (kind === 'plate') { state.plateId = arg; state.selected = null; }
  else if (kind === 'pin') {
    const a = D.network.axes.find((z) => z.key === arg);
    const poss = a.positions.map((p) => p[0]);
    const cur = state.pin[arg];
    const idx = cur ? poss.indexOf(cur) + 1 : 0;
    if (idx >= poss.length) delete state.pin[arg]; else state.pin[arg] = poss[idx];
    state.alt = null; recondition();
  } else if (kind === 'mode') {
    if (arg === 'do') state.obs = false;
    if (arg === 'obs') state.obs = true;
    recondition();
  } else if (kind === 'reset') { state.pin = {}; state.alt = null; cond = null; }
  writeHash(); schedule();
}
function hoverLabel(hit) {
  const [kind, ...rest] = hit.id.split(':');
  const m = activeMarginals();
  if (kind === 'axis') { const a = hit.payload;
    return ['AXIS ' + rest[0], a ? a.name : '']; }
  if (kind === 'pos') { const p = hit.payload;
    return ['POSITION ' + rest[1],
      (p ? p[1] : '') + ' — ' + (((m[rest[0]] || {})[rest[1]] || 0) * 100).toFixed(1) + '%']; }
  if (kind === 'crisis') { const c = hit.payload; return ['CRISIS POINT', c ? c.q : '']; }
  if (kind === 'mile') return ['MILESTONE DATUM', 'level ' + rest[0] + ' on the ladder'];
  if (kind === 'dom') { const dm = D.engine.domains[+rest[0]];
    return dm ? ['CAPABILITY DOMAIN', dm.n] : null; }
  if (kind === 'site') { const p = hit.payload;
    return p ? ['COMPUTE SITE', `${p.s.n} — ~${p.gwSite.toFixed(1)} GW modelled`] : null; }
  if (kind === 'alt') { const e = hit.payload;
    return e ? ['ALTERNATIVE', ['T','A','C','D','S','P','E'].map((k) => e.wl[k]).join('·')] : null; }
  if (kind === 'delta') { const e = hit.payload;
    return e ? ['EVIDENCE APPLICATION', e.rule] : null; }
  if (kind === 'trk') return ['BEHAVIOUR TRACE', 'click for its mechanism'];
  if (kind === 'stat') return ['READING', hit.payload ? hit.payload[0] : ''];
  if (kind === 'layer') return ['OUTCOME LAYER', rest[0]];
  if (kind === 'wp') { const e = hit.payload; return e ? ['WAYPOINT', String(Math.floor(e.year))] : null; }
  if (kind === 'ctl') return ['CONTROL', hit.id.replace('ctl:', '')];
  return null;
}

addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') { fitSheet(); schedule(); }
  if (e.key === 'Escape') { state.selected = null; schedule(); }
  if (e.key === 'ArrowLeft') { state.yr = Math.max(2012, state.yr - (e.shiftKey ? 5 : 0.5)); writeHash(); schedule(); }
  if (e.key === 'ArrowRight') { state.yr = Math.min(2100, state.yr + (e.shiftKey ? 5 : 0.5)); writeHash(); schedule(); }
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= PLATES.length) { state.plateId = PLATES[n - 1].id; state.selected = null; writeHash(); schedule(); }
});
addEventListener('resize', () => { PAPER_SIG = ''; schedule(); });

function writeHash() {
  const pins = Object.entries(state.pin).map(([, v]) => v).join('.');
  history.replaceState(null, '',
    `#p=${state.plateId}&y=${state.yr.toFixed(2)}` +
    (pins ? `&pin=${pins}` : '') + (state.obs ? '&obs=1' : '') +
    (state.alt !== null ? `&alt=${state.alt}` : '') +
    (state.selected ? `&s=${encodeURIComponent(state.selected)}` : ''));
}
function readHash() {
  const h = location.hash;
  const p = h.match(/p=([a-z]+)/); if (p && PLATES.some((q) => q.id === p[1])) state.plateId = p[1];
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
let rafId = 0, lastSig = '', PAPER_SIG = '';
function schedule() { if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; frame(); }); }

// ── motion ───────────────────────────────────────────────────────────────────
// A pan changes nothing on the sheet except where it sits, and a full redraw of this drawing
// costs ~20 ms. So while the view is moving, the last completed ink is blitted at the new
// offset (and scale, for a wheel), and a crisp redraw follows once the gesture settles.
let inkCache = null;                 // { cv, sig, centre, mmPerPx, w, h }
let moving = false, settleTimer = 0;
function markMoving() {
  moving = true;
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => { moving = false; lastSig = ''; schedule(); }, 170);
}
function cacheInk(sig) {
  const cv = inkCache && inkCache.cv ? inkCache.cv : document.createElement('canvas');
  if (cv.width !== inkCv.width || cv.height !== inkCv.height) {
    cv.width = inkCv.width; cv.height = inkCv.height;
  }
  const c = cv.getContext('2d');
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, cv.width, cv.height);
  c.drawImage(inkCv, 0, 0);
  inkCache = { cv, sig, centre: [state.centre[0], state.centre[1]],
               mmPerPx: state.mmPerPx, w: board.clientWidth, h: board.clientHeight };
}
function blitInk() {
  const dpr = draft.dpr || 1;
  const W = board.clientWidth, H = board.clientHeight;
  if (inkCv.width !== W * dpr || inkCv.height !== H * dpr) return false;
  const k = inkCache.mmPerPx / state.mmPerPx;
  const dx = (inkCache.centre[0] - state.centre[0]) / state.mmPerPx;
  const dy = -(inkCache.centre[1] - state.centre[1]) / state.mmPerPx;
  const ctx = draft.ctx;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(W / 2 + dx, H / 2 + dy);
  ctx.scale(k, k);
  ctx.drawImage(inkCache.cv, -W / 2 * dpr / dpr, -H / 2, W, H);
  ctx.restore();
  return true;
}
function frame() {
  if (!state.ready) return;
  if (!state.fitted || !Number.isFinite(state.mmPerPx) || state.mmPerPx <= 0) {
    if (!fitSheet()) { requestAnimationFrame(() => { lastSig = ''; schedule(); }); return; }
    lastSig = '';
  }
  const contentSig = [state.plateId, state.yr.toFixed(3), JSON.stringify(state.pin),
                      state.obs ? 1 : 0, state.alt, state.selected,
                      state.hovered && state.hovered.id,
                      board.clientWidth, board.clientHeight].join('|');
  const sig = contentSig + '|' + state.centre[0].toFixed(2) + '|' +
              state.centre[1].toFixed(2) + '|' + state.mmPerPx.toFixed(5);
  if (sig === lastSig) return;
  lastSig = sig;
  const paperSig = [state.centre[0].toFixed(2), state.centre[1].toFixed(2),
                    state.mmPerPx.toFixed(5), board.clientWidth, board.clientHeight].join('|');
  if (paperSig !== PAPER_SIG) {
    PAPER_SIG = paperSig;
    const w = board.clientWidth, h = board.clientHeight;
    const sx = w / 2 - (SHEET[0] / 2 + state.centre[0]) / state.mmPerPx;
    const sy = h / 2 - (SHEET[1] / 2 - state.centre[1]) / state.mmPerPx;
    drawPaper(paperCv, [sx, sy, SHEET[0] / state.mmPerPx, SHEET[1] / state.mmPerPx]);
  }
  // While the view is moving, reuse the last completed ink rather than redrawing the sheet.
  if (moving && inkCache && inkCache.sig === contentSig &&
      inkCache.w === board.clientWidth && inkCache.h === board.clientHeight) {
    if (blitInk()) return;
  }
  draft.begin({ centre: state.centre, mmPerPx: state.mmPerPx });
  const S = sheetState();
  drawPlate(draft, S);
  // hover and selection, ruled the way a draughtsman rules them
  const hov = state.hovered && draft.prevRegions.find((r) => r.id === state.hovered.id);
  if (hov && hov.id !== state.selected) highlight(hov, false);
  const sel = state.selected && draft.prevRegions.find((r) => r.id === state.selected);
  if (sel) highlight(sel, true);
  cacheInk(contentSig);
}
function highlight(r, isSel) {
  const c = isSel ? INK.red : INK.blue, m = 1.4;
  const x0 = r.x - m, y0 = r.y - m, x1 = r.x + r.w + m, y1 = r.y + r.h + m;
  draft.polyline([[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
                 { close: true, weight: isSel ? PEN.thin : PEN.hairline, colour: c,
                   dash: isSel ? null : [2.4, 1.8] });
  if (isSel) {
    const t = Math.min(4.0, Math.min(r.w, r.h) * 0.30);
    for (const [cx, cy, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1],
                                    [x1, y1, -1, -1], [x0, y1, 1, -1]]) {
      draft.polyline([[cx + sx * t, cy], [cx, cy], [cx, cy + sy * t]],
                     { weight: PEN.medium, colour: c });
    }
  }
}

// ── the collision audit ──────────────────────────────────────────────────────
// Every plate, at several dates and selections, drawn with lettering recorded. Two defects
// are reported: lettering that overlaps other lettering or solid ground, and anything drawn
// outside the frame line. Run from the console: __FW.auditSweep().
function auditSweep({ tol = 0.6 } = {}) {
  const saved = { plate: state.plateId, yr: state.yr, sel: state.selected,
                  alt: state.alt, pin: { ...state.pin }, hovered: state.hovered };
  const cases = [];
  for (const p of PLATES) {
    for (const yr of [2026.58, 2033, 2049, 2090]) {
      cases.push({ plate: p.id, yr, sel: null });
    }
  }
  // and the selections that swap the whole notes column
  for (const sel of ['axis:C', 'axis:T', 'pos:E:E4', 'crisis:deal-window',
                     'layer:climate', 'dom:4', 'mile:3']) {
    cases.push({ plate: 'mainline', yr: 2033, sel });
  }
  const out = { cases: cases.length, collisions: [], offSheet: [], overflows: [], byCase: [] };
  state.hovered = null;
  for (const c of cases) {
    state.plateId = c.plate; state.yr = c.yr; state.selected = c.sel;
    state.alt = null; state.pin = {}; cond = null;
    draft.begin({ centre: [0, 0], mmPerPx: state.mmPerPx, audit: true });
    drawPlate(draft, sheetState());
    const col = draft.collisions(tol);
    const off = draft.offSheet(SHEET, 10);
    const ovf = draft.overflows || [];
    out.byCase.push({ plate: c.plate, yr: c.yr, sel: c.sel,
                      marks: draft.marks.length, col: col.length, off: off.length,
                      ovf: ovf.length });
    for (const x of ovf) (out.overflows = out.overflows || []).push({ ...x, plate: c.plate });
    for (const x of col) out.collisions.push({ ...x, plate: c.plate, yr: c.yr, sel: c.sel });
    for (const x of off) out.offSheet.push({ ...x, plate: c.plate, yr: c.yr, sel: c.sel });
  }
  Object.assign(state, { plateId: saved.plate, yr: saved.yr, selected: saved.sel,
                         alt: saved.alt, pin: saved.pin, hovered: saved.hovered });
  if (Object.keys(saved.pin).length) recondition();
  lastSig = ''; schedule();
  out.collisions.sort((a, b) => b.area - a.area);
  out.worstCollisions = out.collisions.slice(0, 24);
  out.offSheetUnique = [...new Map(out.offSheet.map((o) => [o.str + '|' + o.plate, o]))
                        .values()].slice(0, 40);
  return out;
}

// ── boot ─────────────────────────────────────────────────────────────────────
const J = (n) => fetch(`data/forecast/${n}?v=${DATA_V}`).then((r) => {
  if (!r.ok) throw new Error(n); return r.json();
});
async function boot() {
  const note = document.getElementById('mast');
  [D.engine, D.network, D.bands, D.marginals, D.mainline, D.crisis, D.delta,
   D.claims, D.grounding, D.climate] = await Promise.all([
    J('engine.json'), J('network.json'), J('bands.json'), J('marginals.json'),
    J('mainline.json'), J('crisis.json'), J('delta.json'), J('claims.json'),
    J('grounding.json'), J('climate.json')]);
  readHash();
  state.ready = true;
  fitSheet();
  new ResizeObserver(() => { PAPER_SIG = ''; lastSig = ''; fitSheetIfUnset(); schedule(); })
    .observe(board);
  schedule();
  note.textContent = 'THE FORECAST WORKS';
  J('exemplars.json').then((d) => { D.exemplars = d; lastSig = ''; schedule(); }).catch(() => {});
  J('ensemble2k.json').then((d) => { D.ens2k = d; }).catch(() => {});
  fetch(`data/countries-110m.json?v=${DATA_V}`).then((r) => (r.ok ? r.json() : null))
    .then((d) => { if (d) { D.topo = d; lastSig = ''; schedule(); } }).catch(() => {});
  window.__FW = { state, D, draft, sheetState, fitSheet, capPath, capAt, tracksJS,
                  auditSweep };
  window.__FRAME_READY = true;
}
boot().catch((e) => {
  document.getElementById('mast').textContent = 'FAILED: ' + e.message;
  console.error(e);
});
