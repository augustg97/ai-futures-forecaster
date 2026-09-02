// AI FUTURES FORECASTER — the ledger of a path, and the chronicle composed from it
//
// THE LIKELIEST PATH IS A SEQUENCE OF DATED EVENTS THE MODEL GENERATES, and the readout at a
// year is the chronicle of that path up to that year: what happened, when, what it
// established, and what the world looks like now in numbers a reader knows. This is the
// forecast side of the composer `record.js` already runs over the record, so the document
// reads the same way on both sides of TODAY (Research/plan-2026-09-02-chronicle.md, §2).
//
// The ledger is built from what the model emits for a path — the capability path's milestone
// crossings, the instantiated event templates, the year each position comes into force, the
// levels the tracks pass, and the dated calendar — with the text authored once per template
// and once per position in `narrative.js`. Sequence comes from the model; nothing is chosen by
// a hash. EVERY LINE OF THE PASSAGE IS AN ITEM THAT CARRIES ITS OWN PROVENANCE: the ledger
// entry, criterion or track it was composed from (`src`), its kind, which the sheet draws as
// a mark in the margin, and what a reader opening it is shown (`prov`). The readout gate
// refuses a line without a source.
import { MILESTONE_TEXT, DOMAIN_TEXT, LADDER_NOW, TEMPLATE_TEXT, THRESHOLDS, CRITERION,
         WORK_CLAUSE, ONSET, EVENT_GROUPS, MARKERS } from './narrative.js';

export const LANES = ['capability', 'buildout', 'capital', 'oversight'];
export const LANE_HEAD = {
  capability: 'Capability', buildout: 'Build-out and coordination',
  capital: 'Capital and work', oversight: 'Rules and the public',
};
// Each axis reads in one lane of NOW, the same four lanes SINCE is told in, so a reader finds
// a condition beside the events that set it. An axis the table does not know reads in the
// last lane, and says so in its source.
export const AXIS_LANE = { T: 'capability', K: 'capability', A: 'capability',
                           C: 'buildout', S: 'buildout',
                           D: 'capital', E: 'capital', G: 'capital',
                           R: 'oversight', P: 'oversight', L: 'oversight' };
const MARKER_LANE = { supply: 'buildout', law: 'oversight', capital: 'capital',
                      oversight: 'oversight' };
const LAYER_LANE = {
  capability: 'capability', science: 'capability', security: 'oversight', law: 'oversight',
  politics: 'oversight', existential: 'oversight', geopolitics: 'buildout',
  economy: 'capital', labor: 'capital', society: 'capital', far: 'capital',
};
const TRACK_NAME = {
  gw: 'installed AI computing capacity', rev: 'sales of AI services',
  jobs: 'employment against its 2026 level', appr: 'public approval of AI',
  laws: 'the count of AI statutes and regulations in force', cap: 'the capability index',
};
// World electricity generating capacity was near 9,500 GW in 2026 and has grown two to three
// per cent a year. An AI load larger than all generation cannot be served, so the compute track
// is read up to the year it passes that ceiling and no further; the readout gate carries the
// same figures and refuses a reading lettered past it.
export const WORLD_GW_2026 = 9500, WORLD_GW_GROWTH = 1.025;
const worldGW = (y) => WORLD_GW_2026 * Math.pow(WORLD_GW_GROWTH, y - 2026);
const GWP_BASE = 115;   // world output in 2026, $ trillion, the parent's own anchor
// A TRACK THAT STOPS MOVING AND HOLDS ITS VALUE TO THE END OF THE RUN IS AT ITS CAP: the
// parent's saturation, which the sheet letters as a cap, with the year it was reached, and
// never as a reading of that year. A plateau shorter than CAP_MIN_YEARS is a flat spell and a
// track that never moved is flat.
const CAP_MIN_YEARS = 8;
export function capState(tracks, key) {
  const v = tracks[key];
  if (!v || v.length < 2) return null;
  const n = v.length, years = tracks.year;
  let last = 0;
  for (let i = 1; i < n; i++) {
    if (Math.abs(v[i] - v[i - 1]) > 1e-9 * Math.max(1, Math.abs(v[i]))) last = i;
  }
  const out = {};
  if (key === 'gw') {
    for (let i = 0; i < n; i++) if (v[i] > worldGW(years[i])) { out.ceiling = years[i]; break; }
    for (let i = 0; i < n; i++) if (v[i] >= WORLD_GW_2026) { out.world2026 = years[i]; break; }
  }
  if (last > 0 && n - 1 - last >= CAP_MIN_YEARS) {
    out.since = years[last]; out.value = v[n - 1];
    out.top = key === 'cap' && v[n - 1] >= 6;
  }
  return Object.keys(out).length ? out : null;
}
export function capsFor(tracks) {
  const out = {};
  for (const k of ['cap', 'gw', 'rev', 'jobs', 'appr', 'laws', 'copies', 'speed']) {
    const c = capState(tracks, k);
    if (c) out[k] = c;
  }
  return out;
}
// An entry appears in full while it is within FULL_YEARS of the date, then as a dated
// clause (its short form, `s`) until CLAUSE_YEARS, then not at all. A condition still in
// force is carried by NOW with the year it began; a standing event the headline keeps —
// the capital event, the labour event — keeps its short dated form for as long as it stands.
const FULL_YEARS = 2, CLAUSE_YEARS = 15;   // ages 0, 1 and 2: three years in full
const MAX_WORDS = 28;

const stop = (t) => { t = String(t || '').trim(); return t && !/[.!?]$/.test(t) ? t + '.' : t; };
const lower = (t) => (t ? t.charAt(0).toLowerCase() + t.slice(1) : t);
const upper = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
const fill = (text, year) => String(text || '').replace(/\{year\}/g, String(Math.floor(year)));
const words = (t) => String(t).trim().split(/\s+/).length;
const keyOf = (e) => `${e.src}@${e.y}`;
function firstYear(tracks, key, test) {
  const v = tracks[key];
  if (!v) return null;
  for (let i = 0; i < tracks.year.length; i++) if (test(v[i])) return tracks.year[i];
  return null;
}

// The emitted events carry the template's text with its slots filled and no id, so the id is
// recovered by matching the text against the template it came from. The client's own
// instantiation carries the id.
let TEMPLATE_RX = null;
function templateIdOf(e, templates) {
  if (e.id) return e.id;
  if (!TEMPLATE_RX) {
    TEMPLATE_RX = (templates || []).map((t) => {
      const esc = t.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\{year\\\}/g, '\\d{4}').replace(/\\\{survives\\\}/g, '(?:survives|stalls)');
      return [t.id, new RegExp('^' + esc + '$')];
    });
  }
  for (const [id, rx] of TEMPLATE_RX) if (rx.test(e.text)) return id;
  return null;
}

// ── the ledger ───────────────────────────────────────────────────────────────
export function buildLedger(wl, tracks, events, engine, given = {}) {
  const entries = [];
  const cross = {};
  for (const r of [3, 4, 5, 6]) {
    // the parent's exact crossing year where it emits one (r9), else the annual track's
    cross[r] = given.crossings && given.crossings[String(r)] != null
      ? Math.floor(given.crossings[String(r)]) : firstYear(tracks, 'cap', (v) => v >= r);
  }
  const evs = (events || []).map((e) => ({ ...e, id: templateIdOf(e, engine.templates) }));
  const tied = new Set(evs.map((e) => e.id));
  const spec = (id) => (engine.templates || []).find((t) => t.id === id) || null;
  // A tied event carries the crossing's own date (2028.6 for a knot the annual track first
  // shows at 2029), so the milestone year follows the event where the path instantiated it.
  for (const [id, r] of [['sc-crossing', 3], ['sar-crossing', 4]]) {
    const ev = evs.find((e) => e.id === id);
    if (ev && cross[r]) cross[r] = Math.min(cross[r], Math.floor(ev.year));
  }
  for (const r of [3, 4, 5, 6]) {
    if (!cross[r]) continue;
    if ((r === 3 && tied.has('sc-crossing')) || (r === 4 && tied.has('sar-crossing'))) continue;
    const mt = MILESTONE_TEXT[r];
    entries.push({ y: cross[r], kind: 'milestone', lane: 'capability', k: `milestone ${r}`,
                   t: fill(mt.t, cross[r]), s: fill(mt.s || mt.t, cross[r]), f: mt.f, m: mt.m,
                   src: `milestone:${r}`, cites: [],
                   prov: { milestone: r, year: cross[r], rung: (engine.ladder || [])[r] || '' } });
  }
  for (const dm of engine.domains || []) {
    const dt = DOMAIN_TEXT[dm.k];
    if (!dt) continue;
    const y = firstYear(tracks, 'cap', (v) => v >= dm.th);
    if (!y) continue;
    entries.push({ y: y + 0.05, kind: 'milestone', lane: 'capability', k: dm.n,
                   t: fill(dt.t, y), s: fill(dt.s || dt.t, y), f: dt.f, m: dt.m || '',
                   src: `domain:${dm.k}`, cites: dm.cites || [],
                   prov: { domain: dm.k, name: dm.n, th: dm.th, year: y, desc: dm.d || '' } });
  }
  for (const e of evs) {
    const tx = e.id && TEMPLATE_TEXT[e.id];
    const yr = Math.floor(e.year);
    const sp = spec(e.id);
    const prov = { template: e.id || 'unknown', parent: e.text, layer: e.layer, year: e.year,
                   window: sp && Array.isArray(sp.w) ? sp.w : null, p: sp ? sp.p : null,
                   req: sp && sp.req ? Object.entries(sp.req).map(([k, v]) => `${k} in ${[].concat(v).join(', ')}`).join('; ') : '' };
    if (!tx) {
      // A template with no authored text still reaches the ledger, in the parent's words,
      // so a new template is visible on the sheet the night it arrives.
      const own = stop(e.text);
      entries.push({ y: e.year, kind: 'event', lane: LAYER_LANE[e.layer] || 'oversight',
                     k: e.id || e.layer, t: own, s: own, f: lower(own.replace(/\.$/, '')),
                     m: '', src: `template:${e.id || 'unknown'}`, cites: e.cites || [], prov });
      continue;
    }
    const v = tx.variants ? (/\bsurvives\b/.test(e.text) ? tx.variants.survives
                                                         : tx.variants.stalls) : tx;
    entries.push({ y: e.year, kind: 'event', lane: tx.lane, k: e.id, t: fill(v.t, yr),
                   s: fill(v.s || v.t, yr), f: v.f, m: v.m || '', src: `template:${e.id}`,
                   cites: e.cites || [], prov });
  }
  const byId = {};
  for (const e of evs) if (e.id && !(e.id in byId)) byId[e.id] = e.year;
  const onsets = {}, onsetKind = {};
  // the rule that dates a position: the registry's own since r9, the authored table before it
  const RULES = engine.onsets || ONSET;
  for (const ax in wl) {
    const pos = wl[ax], rule = RULES[pos];
    let y = null, kind = null;
    if (given.onsets && given.onsets[pos] != null && rule) {
      y = given.onsets[pos];
      kind = rule.template ? 'template' : rule.milestone ? 'milestone' : rule.track ? 'track' : 'year';
    } else if (rule) {
      if (rule.template) { y = byId[rule.template] ?? null; kind = 'template'; }
      else if (rule.milestone) { y = cross[rule.milestone]; kind = 'milestone'; }
      else if (rule.track) {
        y = firstYear(tracks, rule.track, (v) => (rule.dir === 'below' ? v <= rule.at : v >= rule.at));
        kind = 'track';
      } else if (rule.year) { y = rule.year; kind = 'year'; }
    }
    onsets[pos] = y; onsetKind[pos] = y ? kind : null;
    if (rule && (rule.track || rule.year) && y) {
      const crit = String(CRITERION[pos] || '').replace(/\.\s*$/, '');
      const t = `From ${Math.floor(y)}, ${lower(crit)}.`;
      entries.push({ y, kind: 'onset', lane: rule.lane || AXIS_LANE[ax] || 'capital', k: pos, t, s: t,
                     f: lower(crit), m: '', src: `onset:${pos}`, cites: [],
                     prov: { position: pos, axis: ax, onset: y, onsetKind: kind } });
    }
  }
  const derived = { ...tracks };
  if (tracks.gwp) derived.revshare = tracks.rev.map((v, i) => v / tracks.gwp[i]);
  if (engine.dynamics) derived.gwshare = tracks.gw.map((v, i) => v / worldGW(tracks.year[i]));
  for (const th of THRESHOLDS) {
    if (!derived[th.key]) continue;
    for (const [level, cmp] of th.levels) {
      const y = firstYear(derived, th.key,
        (v) => (th.dir === 'down' ? v <= level : v >= level));
      if (!y || y <= engine.y0) continue;
      const t = th.t(level, cmp, y);
      entries.push({ y: y + 0.5, kind: 'threshold', lane: th.lane, k: `${th.key} ${level}`,
                     t, s: t, f: th.f(level, cmp), m: '', src: `track:${th.key}`, cites: [],
                     prov: { track: th.key, level, year: y } });
    }
  }
  for (const [my, ln, text] of MARKERS) {
    entries.push({ y: my + 0.9, kind: 'calendar', lane: MARKER_LANE[ln] || 'oversight',
                   k: `calendar ${my}`, t: text, s: text, f: text, m: '',
                   src: `calendar:${my}-${ln}`, cites: [], prov: { calendar: my, lane: ln } });
  }
  entries.sort((a, b) => a.y - b.y);
  return { entries, cross, onsets, onsetKind, byId };
}

// ── figures in the reader's units ────────────────────────────────────────────
const GW_CMP = [
  [9500, 'more than all the generating capacity that existed worldwide in 2026'],
  [4000, 'about three times United States generating capacity in 2026'],
  [1200, 'about all of United States generating capacity in 2026'],
  [600, 'about half of all United States generating capacity in 2026'],
  [200, 'about a sixth of United States generating capacity in 2026'],
  [0, 'a small share of national grids'],
];
const REV_CMP = [
  [12, 'exceed a tenth of world output in 2026'],
  [4, 'rival the revenue of the world automotive industry in 2026'],
  [1.4, 'exceed worldwide semiconductor sales of 2026'],
  [0.2, 'make a large software business and a small share of the economy'],
  [0, 'run years behind the capital being spent on them'],
];
const pct = (x, d = 0) => `${(x * 100).toFixed(d)}%`;
// A working measure of the time horizon, in the units a reader uses for the length of a task.
function hzFmt(h) {
  if (h < 48) return `${Math.round(h)} hours`;
  if (h < 400) return `about ${Math.round(h / 40)} working weeks`;
  if (h < 1900) return `about ${Math.round(h / 167)} working months`;
  return 'about a working year';
}
const REV_CMP_N = [
  [12, 'more than a tenth of world output in 2026'],
  [4, 'about the revenue of the world automotive industry'],
  [1.4, 'more than worldwide semiconductor sales of 2026'],
  [0.2, 'the size of a large software business'],
  [0, 'a small share of the economy'],
];
const LAW_CMP = [
  [600, 'ten times the count of 2026'], [250, 'four times the count of 2026'],
  [120, 'twice the count of 2026'], [0, 'the count of 2026 and a little more'],
];
const band = (v, rows) => { for (const [t, s] of rows) if (v >= t) return s; return rows[rows.length - 1][1]; };
const gwFmt = (v) => (v >= 1000 ? Math.round(v).toLocaleString('en-US') : String(Math.round(v)));
const money = (v) => (v >= 1 ? `$${v.toFixed(1)} trillion` : `$${Math.round(v * 1000)} billion`);
function rateClause(tracks, i, key, noun, pct = false) {
  const j = Math.max(0, i - 5);
  if (j === i) return '';
  const a = tracks[key][j], b = tracks[key][i];
  if (pct) {
    const d = b - a;
    if (Math.abs(d) < 0.6) return `${noun} has been flat for five years.`;
    const pts = Math.abs(d).toFixed(0);
    return `${noun} has moved ${d > 0 ? 'up' : 'down'} ${pts} point${pts === '1' ? '' : 's'} in five years.`;
  }
  if (!(a > 0)) return '';
  const mult = b / a;
  if (mult > 3) return `${noun} has more than tripled in five years.`;
  if (mult > 1.6) return `${noun} is up ${((mult - 1) * 100).toFixed(0)}% in five years.`;
  if (mult > 1.08) return `${noun} is up modestly over five years.`;
  if (mult > 0.95) return `${noun} has been flat for five years.`;
  return `${noun} is down ${((1 - mult) * 100).toFixed(0)}% in five years.`;
}
const fmtV = (k, v) => (k === 'gw' ? `${gwFmt(v)} gigawatts` : k === 'rev' ? `${money(v)} a year`
  : k === 'jobs' ? `${Math.abs(v).toFixed(0)}% ${v < 0 ? 'below' : 'above'} its 2026 level`
  : k === 'appr' ? `${v.toFixed(0)}%` : k === 'laws' ? `${Math.round(v)} measures`
  : k === 'cap' ? v.toFixed(1) : String(v));
// The sentence a capped quantity gets at a year past its cap: the value, the year it was
// reached, its comparison, and that the model's track stops there. Compute past the world's
// generating capacity is read no further.
function capSentence(key, cs, Y) {
  if (!cs) return null;
  if (key === 'gw' && cs.ceiling && Y >= cs.ceiling) {
    const first = cs.world2026
      ? `Installed AI computing capacity passed ${gwFmt(WORLD_GW_2026)} gigawatts in ${cs.world2026}, all the generating capacity that existed worldwide in 2026. `
      : '';
    return `${first}From ${cs.ceiling} the model's compute track exceeds the whole of world generating capacity in its own year and is not read past that point.`;
  }
  if (cs.since == null || Y < cs.since) return null;
  const v = cs.value, y = cs.since;
  switch (key) {
    case 'gw': return `Installed AI computing capacity reached ${gwFmt(v)} gigawatts in ${y}, ${band(v, GW_CMP)}, where the model's compute track stops.`;
    case 'rev': return `Sales of AI services reached ${money(v)} a year in ${y}, ${band(v, REV_CMP_N)}, where the model's revenue track saturates.`;
    // employment and approval settle: re-employment absorbs what it can and approval reverts
    // to the level its position sets, so a held value is an equilibrium and is lettered as one
    case 'jobs': return v <= -2
      ? `Employment has settled at ${Math.abs(v).toFixed(0)}% below its 2026 level since ${y}.`
      : `Employment has held within two points of its 2026 level since ${y}.`;
    case 'appr': return `Approval of AI has settled at ${v.toFixed(0)}% since ${y}.`;
    case 'laws': return `The count of AI statutes and regulations in force reached ${Math.round(v)} in ${y}, where the model's statute track stops.`;
    case 'cap': return cs.top
      ? `The capability index has stood at 6.0, the top of its scale, since ${y}; the ladder has no rung above it.`
      : `The capability index has stood at ${v.toFixed(1)} since ${y}, where the model's capability track stops.`;
    default: return null;
  }
}
function jobsFigure(v) {
  return v > -2 ? 'Employment is within two points of its 2026 level'
                : `Employment is ${Math.abs(v).toFixed(0)}% below its 2026 level`;
}
function apprClause(v) {
  if (v >= 55) return 'That is a majority, and it gives governments room to act.';
  if (v >= 40) return 'That is a plurality, enough to govern with and thin enough to lose.';
  if (v >= 25) return 'That is a minority, so each new deployment is a political decision.';
  return 'Fewer than a quarter of adults approve, and councils refuse deployments their residents oppose.';
}
// The date a standing condition carries, by how its onset was dated.
function onsetTag(kind, oy) {
  return kind === 'milestone' ? `On this path that happened in ${oy}.`
       : kind === 'template' ? `That began in ${oy}.`
       : `That has held since ${oy}.`;
}

// ── the assembler's own rules (language standard, rule 4) ────────────────────
// At most one ", and" join and one semicolon in a headline; no sentence past twenty-eight
// words. A sentence that breaks a rule is split at its last join, so the shape changes and
// the words do not.
const JOIN = /;\s+|,\s+(?:and|but|so|while|although|because|since|which)\s+/g;
function splitAtLastJoin(sent) {
  const joins = [...sent.matchAll(JOIN)].filter((m) => {
    const head = words(sent.slice(0, m.index)), tail = words(sent.slice(m.index + m[0].length));
    return head >= 3 && tail >= 3;
  });
  if (!joins.length) return [sent];
  const at = joins[joins.length - 1];
  const head = sent.slice(0, at.index).replace(/[,;:\s]+$/, '');
  const tail = sent.slice(at.index + at[0].length);
  return [stop(head), stop(upper(tail))];
}
function assemble(sentences) {
  // an authored string may carry two sentences; the rules apply to each
  let out = sentences.flatMap((s) => String(s || '').trim().split(/(?<=[.!?])\s+(?=[A-Z])/))
    .map((s) => stop(s.trim())).filter(Boolean);
  // long sentences first, then the joins the headline as a whole may carry
  let guard = 0;
  while (guard++ < 12) {
    const long = out.findIndex((s) => words(s) > MAX_WORDS && JOIN.test(s));
    JOIN.lastIndex = 0;
    if (long < 0) break;
    out.splice(long, 1, ...splitAtLastJoin(out[long]));
  }
  for (const [rx, keep] of [[/,\s+and\s+/, 1], [/;\s+/, 1]]) {
    let seen = 0;
    for (let k = 0; k < out.length; k++) {
      const n = (out[k].match(new RegExp(rx.source, 'g')) || []).length;
      if (!n) continue;
      if (seen + n <= keep) { seen += n; continue; }
      const parts = splitAtLastJoin(out[k]);
      if (parts.length === 2) { out.splice(k, 1, ...parts); k--; } else seen += n;
    }
  }
  // No sentence opens on the word its neighbour opened on. A dated sentence can carry its
  // date at either end, so one of the pair moves its date: "In 2033 the first …" after the
  // year sentence becomes "The first … in 2033", and "The first … in 2033" before "The United
  // States …" becomes "In 2033 the first …".
  const opening = (t) => (t.match(/^[A-Za-z]+/) || [''])[0].toLowerCase();
  const swapDate = (t) => {
    let m = t.match(/^In (\d{4}),? (.+)\.$/);
    if (m) return `${upper(m[2])} in ${m[1]}.`;
    m = t.match(/^(.+?),? (in|from) (\d{4})\.$/);
    if (m && !/\d{4}/.test(m[1])) return `${upper(m[2])} ${m[3]} ${lower(m[1])}.`;
    return t;
  };
  for (let pass = 0; pass < 3; pass++) {
    let moved = false;
    for (let k = 1; k < out.length; k++) {
      if (!opening(out[k]) || opening(out[k]) !== opening(out[k - 1])) continue;
      const alt = swapDate(out[k]);
      if (alt !== out[k] && opening(alt) !== opening(out[k - 1])) { out[k] = alt; moved = true; continue; }
      const prev = swapDate(out[k - 1]);
      if (prev !== out[k - 1] && opening(prev) !== opening(out[k]) &&
          (k < 2 || opening(prev) !== opening(out[k - 2]))) { out[k - 1] = prev; moved = true; }
    }
    if (!moved) break;
  }
  return out.join(' ');
}

// ── the chronicle ────────────────────────────────────────────────────────────
// An item is one line of the passage: its text, the ledger entry or table row it came from,
// its kind (the mark in the margin), a key the sheet can open, and what the note shows.
function item(e, t) {
  return { t, src: e.src, kind: e.kind, key: keyOf(e), y: e.y, cites: e.cites || [], prov: e.prov };
}
function group(head, items, full = []) {
  return { head, items, full, text: items.map((i) => i.t).join(' '),
           src: items.map((i) => i.src).join('; ') };
}

export function chronicle(wl, year, tracks, events, engine, network, given = {}) {
  const Y = Math.floor(year);
  const y0 = engine.y0, y1 = engine.y1;
  const i = Math.max(0, Math.min(tracks.year.length - 1, Y - y0));
  const L = buildLedger(wl, tracks, events, engine, given);
  const cap = tracks.cap[i], gw = tracks.gw[i], rev = tracks.rev[i], jobs = tracks.jobs[i],
        appr = tracks.appr[i], laws = tracks.laws[i];
  const past = L.entries.filter((e) => Math.floor(e.y) <= Y);
  const ahead = L.entries.filter((e) => Math.floor(e.y) > Y);
  const caps = capsFor(tracks);
  const capS = (k) => capSentence(k, caps[k], Y);
  // The ledger's end: the last dated entry the model produced on this path. Past it the
  // chronicle says so, and the far decades read as what they are.
  const dated = L.entries.filter((e) => e.kind !== 'calendar');
  const ledgerEnd = dated.length ? Math.floor(dated[dated.length - 1].y) : y0;
  const used = new Set();
  for (const e of past) if (e.k === 'sc-crossing' || e.k === 'sar-crossing' || e.kind === 'milestone') used.add(keyOf(e));
  const latest = (ids, within) => {
    const hits = past.filter((e) => e.kind === 'event' && ids.includes(e.k) &&
                                    Y - Math.floor(e.y) <= within);
    return hits.length ? hits[hits.length - 1] : null;
  };
  const take = (e) => { if (e) used.add(keyOf(e)); return e; };
  const age = (e) => Y - Math.floor(e.y);
  // An event the headline keeps is drawn in full for three years and in its short dated form
  // after that, so the year of the correction, the law, the deal stays on the sheet.
  const datedForm = (e) => (age(e) <= FULL_YEARS ? e.t : e.s || e.t);
  // A criterion in the headline carries the year it came into force where a rule dates it,
  // once the event that dated it has left the headline.
  const tagged = (pos) => {
    const crit = CRITERION[pos] || '';
    const on = L.onsets[pos], ok = L.onsetKind[pos];
    if (!crit || !on) return crit;
    const oy = Math.floor(on);
    if (oy <= y0 || oy > Y || Y - oy <= FULL_YEARS) return crit;
    return `${crit} ${onsetTag(ok, oy)}`;
  };

  // 1 · capability, dated
  const c = L.cross;
  const gapWords = (n) => (n <= 0 ? 'in the same year that' : n === 1 ? 'a year after'
    : n === 2 ? 'about two years after' : n <= 5 ? `about ${['', '', '', 'three', 'four', 'five'][n]} years after`
    : `${n} years after`);
  let s1;
  if (c[4] && c[4] <= Y) {
    const gap = c[3] && c[3] <= c[4]
      ? `, ${gapWords(c[4] - c[3])} they first out-programmed the best human software engineers.`
      : '.';
    s1 = c[4] === Y
      ? `In ${Y} frontier AI systems first ran the AI research loop without human researchers${gap.replace(' they first ', ' they ')}`
      : `In ${Y}, frontier AI systems have run the AI research loop without human researchers since ${c[4]}${gap}`;
    if (c[5] && c[5] <= Y) {
      s1 += c[5] === Y
        ? ` In ${Y} frontier systems first exceeded expert performance across every measured field.`
        : ` Since ${c[5]} frontier systems have exceeded expert performance across every measured field.`;
    }
  } else if (c[3] && c[3] <= Y) {
    const until = c[4] ? (c[4] < y1 ? `, on this path until ${c[4]}.` : ` through ${y1} on this path.`) : '.';
    s1 = (c[3] === Y
      ? `In ${Y} frontier AI systems out-programmed the best human software engineers for the first time, and human researchers still choose what the laboratories investigate`
      : `In ${Y}, frontier AI systems have out-programmed the best human software engineers since ${c[3]}, and human researchers still choose what the laboratories investigate`) + until;
  } else {
    s1 = `In ${Y}, ${band(cap, LADDER_NOW)}.` +
         (c[3] ? ` On this path they pass the best human software engineers in ${c[3]}.` : '');
  }
  // 2 · money: the dated capital event, then compute and revenue with their comparisons
  const capEv = take(latest(EVENT_GROUPS.capital, Infinity));
  const s2 = capEv ? datedForm(capEv) : tagged(wl.E);
  const gwp = tracks.gwp ? tracks.gwp[i] : null;
  const live = !!engine.dynamics;
  const s3 = capS('gw') || (live
    ? `Installed AI computing capacity stands near ${gwFmt(gw)} gigawatts, ${band(gw, GW_CMP)} and ${pct(gw / worldGW(Y))} of the world's generating capacity in ${Y}.`
    : `Installed AI computing capacity stands near ${gwFmt(gw)} gigawatts, ${band(gw, GW_CMP)}.`);
  const s4 = capS('rev') || (gwp
    ? `Sales of AI services, at ${money(rev)} a year, are ${pct(rev / gwp, rev / gwp < 0.02 ? 1 : 0)} of world output in ${Y}.`
    : `Sales of AI services, at ${money(rev)} a year, ${band(rev, REV_CMP)}.`);
  // 3 · work
  const wc = (jobs <= -2 || wl.D === 'D1') ? WORK_CLAUSE[wl.D] : null;
  let s5 = capS('jobs');
  if (!s5) {
    s5 = jobsFigure(jobs);
    if (wc) s5 += wc.mode === 'appos' ? `, ${wc.text}.` : `; ${wc.text}.`; else s5 += '.';
  }
  const labEv = take(latest(EVENT_GROUPS.labour, Infinity));
  const s6 = labEv ? datedForm(labEv) : '';
  // 4 · who decides
  const s7 = tagged(wl.C);
  const ruleEv = take(latest(EVENT_GROUPS.rules, FULL_YEARS));
  const s8 = ruleEv ? ruleEv.t : '';
  // 5 · the public
  const s9 = capS('appr') || `Approval of AI stands at ${appr.toFixed(0)}%.`;
  const s10 = tagged(wl.P);
  // 6 · the year's own event, when one falls within a year of the date and is not yet said
  const saidThisYear = [capEv, labEv, ruleEv].some((e) => e && Math.floor(e.y) === Y);
  const own = saidThisYear ? null : past.filter((e) => Math.floor(e.y) === Y && e.kind === 'event' &&
                                 !used.has(keyOf(e))).pop();
  const s11 = own ? own.t : '';
  // 7 · past the last dated entry on this path, the headline says so
  const s12 = Y > ledgerEnd ? `After ${ledgerEnd} the model dates nothing on this path.` : '';
  const headline = assemble([s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12]);

  // ── the passage: since 2026 · now · ahead ──────────────────────────────────
  const paras = [];
  const groups = [];
  const since0 = Math.max(y0, Y - CLAUSE_YEARS);
  for (const lane of LANES) {
    // Chronological, oldest first, the way a chronicle reads. The two most recent entries
    // within FULL_YEARS carry what they established; older ones stand as a dated clause until
    // CLAUSE_YEARS and then leave the lane. A condition still in force is carried by NOW, with
    // the year it began, so nothing here needs to persist for it.
    const mine = past.filter((e) => e.lane === lane && e.kind !== 'calendar' &&
                                    Y - Math.floor(e.y) <= CLAUSE_YEARS)
      .sort((a, b) => a.y - b.y);
    const recent = mine.filter((e) => Y - Math.floor(e.y) <= FULL_YEARS).slice(-2);
    const items = [], fullKeys = [];
    for (const e of mine) {
      if (recent.includes(e)) {
        items.push(item(e, `${stop(e.t)}${e.m ? ' ' + stop(e.m) : ''}`));
        fullKeys.push(keyOf(e));
      } else {
        items.push(item(e, stop(e.s || e.t)));
      }
    }
    const cal = past.filter((e) => e.lane === lane && e.kind === 'calendar' && Y - Math.floor(e.y) <= 2).slice(-3);
    for (const e of cal) items.push(item(e, stop(e.t)));
    if (!items.length) {
      items.push({ t: `Nothing dated falls in this lane between ${since0} and ${Y} on this path.`,
                   src: 'ledger:empty', kind: 'note', key: `ledger:empty:${lane}`, y: Y, cites: [],
                   prov: { empty: lane, from: since0, to: Y } });
    }
    groups.push(group(LANE_HEAD[lane], items, fullKeys));
  }
  if (groups.every((g) => g.items.length === 1 && g.items[0].kind === 'note')) {
    groups.length = 0;
    groups.push(group(null, [{
      t: `Nothing dated falls between ${since0} and ${Y} on this path. The ledger of this path ends in ${ledgerEnd}.`,
      src: 'ledger:end', kind: 'note', key: 'ledger:end:since', y: Y, cites: [],
      prov: { end: ledgerEnd } }]));
  }
  paras.push({ lead: `Since ${since0}.`, groups,
               text: groups.map((g) => g.text).join(' '),
               src: groups.map((g) => g.src).join('; ') });

  // NOW: the conditions in force, one per axis, in the lane its axis reads in, each with the
  // year it came into force where a rule dates it; then the quantities, each with its
  // comparison and its five-year rate.
  const nowGroups = [];
  for (const lane of LANES) {
    const items = [];
    for (const a of network.axes) {
      if ((AXIS_LANE[a.key] || 'oversight') !== lane) continue;
      const pos = wl[a.key];
      if (!pos || !CRITERION[pos]) continue;
      const on = L.onsets[pos], ok = L.onsetKind[pos];
      let s = CRITERION[pos];
      if (on && Math.floor(on) > y0 && Math.floor(on) <= Y) s += ' ' + onsetTag(ok, Math.floor(on));
      else if (on && Math.floor(on) > Y) s += ` On this path that begins in ${Math.floor(on)}.`;
      const p = a.positions.find((q) => q[0] === pos);
      items.push({ t: s, src: `criterion:${pos}`, kind: 'criterion', key: `criterion:${pos}`,
                   y: on || y0, cites: (p && p[3]) || [],
                   prov: { position: pos, axis: a.key, onset: on, onsetKind: ok,
                           known: a.key in AXIS_LANE } });
    }
    if (items.length) nowGroups.push(group(LANE_HEAD[lane], items));
  }
  // the spread of the sampled futures at this date, for the quantities the parent bands
  const TB = given.trackBands;
  const spread = (k, fmt) => {
    if (!TB || !TB[k] || !TB.year) return '';
    const j = TB.year.indexOf(Y);
    if (j < 0) return '';
    return ` Across ${TB.n.toLocaleString('en-US')} sampled futures the middle four-fifths run from ${fmt(TB[k].p10[j])} to ${fmt(TB[k].p90[j])}.`;
  };
  const hz = tracks.hz ? tracks.hz[i] : null;
  const hzLine = hz == null ? '' : (cap < 4.0
    ? `AI agents complete tasks of about ${hzFmt(hz)} on their own at a 50% success rate, against 16 hours in mid-2026.`
    : `The time-horizon measure stopped at the research rung${c[4] ? ` in ${c[4]}` : ''}: no human has been timed at longer tasks.`);
  const qty = [
    ['cap', cap, capS('cap') || ''],
    ['hz', hz, hzLine],
    ['gw', gw, capS('gw') || (live
       ? `Installed AI computing capacity is ${gwFmt(gw)} gigawatts, ${band(gw, GW_CMP)} and ${pct(gw / worldGW(Y))} of the world's generating capacity in ${Y}. `
       : `Installed AI computing capacity is ${gwFmt(gw)} gigawatts, ${band(gw, GW_CMP)}. `) +
               rateClause(tracks, i, 'gw', 'Capacity') + spread('gw', (v) => `${gwFmt(v)} gigawatts`)],
    ['rev', rev, capS('rev') || (gwp
       ? `Sales of AI services are ${money(rev)} a year, ${pct(rev / gwp, rev / gwp < 0.02 ? 1 : 0)} of world output in ${Y}. `
       : `Sales of AI services are ${money(rev)} a year and ${band(rev, REV_CMP)}. `) +
                 rateClause(tracks, i, 'rev', 'Revenue') + spread('rev', (v) => `${money(v)} a year`)],
    ['gwp', gwp, gwp == null ? '' :
       `World output on this path is ${money(gwp)}, ${(gwp / GWP_BASE).toFixed(1)} times its 2026 size. The model lifts trend growth by the share of the capability gains the benefit position lets through, tapering after the research crossing.`],
    ['jobs', jobs, capS('jobs') || `${jobsFigure(jobs)}. ${rateClause(tracks, i, 'jobs', 'Employment', true)}` +
                   spread('jobs', (v) => `${Math.abs(v).toFixed(0)}% ${v < 0 ? 'below' : 'above'}`)],
    ['appr', appr, capS('appr') || `Approval of AI stands at ${appr.toFixed(0)}%. ${apprClause(appr)} ` +
                   rateClause(tracks, i, 'appr', 'Approval', true) + spread('appr', (v) => `${v.toFixed(0)}%`)],
    ['laws', laws, capS('laws') || `About ${Math.round(laws / 10) * 10} AI statutes and regulations are in force, ` +
                   `${band(laws, LAW_CMP)}. ${rateClause(tracks, i, 'laws', 'The statute count')}` +
                   spread('laws', (v) => `${Math.round(v / 10) * 10}`)],
  ].filter(([, , t]) => t)
   .map(([k, v, t]) => ({ t: t.trim(), src: `track:${k}`, kind: 'quantity', key: `track:${k}@now`,
                          y: Y, cites: [], prov: { track: k, value: v, year: Y, cap: caps[k] || null,
                                                   capped: !!capS(k) } }));
  nowGroups.push(group('Quantities', qty));
  paras.push({ lead: 'Now.', groups: nowGroups,
               text: nowGroups.map((g) => g.text).join(' '),
               src: nowGroups.map((g) => g.src).join('; ') });

  const next = ahead.filter((e) => e.kind !== 'calendar' && e.kind !== 'onset').slice(0, 6);
  const nextItems = next.map((e) => item(e, `In ${Math.floor(e.y)}, ${e.f}.`));
  if (!nextItems.length) {
    nextItems.push({ t: `The ledger of this path ends in ${ledgerEnd}. The model dates nothing after it.`,
                     src: 'ledger:end', kind: 'note', key: 'ledger:end', y: Y, cites: [],
                     prov: { end: ledgerEnd } });
  }
  const calAhead = ahead.filter((e) => e.kind === 'calendar' && Math.floor(e.y) - Y <= 3);
  const aheadGroups = [group('Next on this path', nextItems)];
  if (calAhead.length) {
    aheadGroups.push(group('On the calendar', calAhead.map((e) => item(e, stop(e.t)))));
  }
  paras.push({ lead: 'Ahead on this path.', groups: aheadGroups,
               text: aheadGroups.map((g) => g.text).join(' '),
               src: aheadGroups.map((g) => g.src).join('; ') });

  return { headline, paras, ledger: L, caps, ledgerEnd };
}

// The last dated entry the model produced on a path, for the notes that name it.
export function ledgerEndOf(wl, tracks, events, engine) {
  const L = buildLedger(wl, tracks, events, engine);
  const dated = L.entries.filter((e) => e.kind !== 'calendar');
  return dated.length ? Math.floor(dated[dated.length - 1].y) : engine.y0;
}
// What a track does on the active path, for the note a recorder opens.
export function trackNote(tracks, key, Y) {
  const cs = capState(tracks, key), y1 = tracks.year[tracks.year.length - 1];
  const name = TRACK_NAME[key] || key;
  if (!cs) return `On the active path the track of ${name} is still moving at ${y1}.`;
  const parts = [];
  if (cs.since != null) {
    parts.push(`On the active path the track of ${name} reaches ${fmtV(key, cs.value)} in ` +
               `${cs.since} and holds it to ${y1}` +
               (Y >= cs.since ? `; at the date on the index it has held it for ${Y - cs.since} years` : '') +
               '. The sheet letters it as a cap from that year, never as a reading.');
  }
  if (cs.ceiling) {
    parts.push(`It passes the whole of world generating capacity in ${cs.ceiling}, so the sheet ` +
               'reads it no further.');
  }
  return parts.join(' ');
}
// Where the tracks stop on the active path, for the note the chart's caption opens.
export function capsSummary(tracks, ledgerEnd) {
  const y1 = tracks.year[tracks.year.length - 1];
  const out = [];
  const c = capState(tracks, 'cap');
  if (c && c.since != null) {
    out.push(c.top ? `The capability index reaches 6.0, the top of the ladder, in ${c.since} and holds it to ${y1}.`
                   : `The capability index stops at ${c.value.toFixed(1)} in ${c.since} and holds it to ${y1}.`);
  }
  for (const [k, noun, verb] of [['rev', 'Revenue', 'reaches'], ['jobs', 'Employment', 'settles at'],
                                 ['appr', 'Approval', 'settles at'], ['laws', 'The statute count', 'reaches']]) {
    const cs = capState(tracks, k);
    if (cs && cs.since != null) out.push(`${noun} ${verb} ${fmtV(k, cs.value)} in ${cs.since} and holds it.`);
  }
  const g = capState(tracks, 'gw');
  if (g && g.ceiling) out.push(`Compute passes the whole of world generating capacity in ${g.ceiling}.`);
  else if (g && g.since != null) out.push(`Compute stops at ${fmtV('gw', g.value)} in ${g.since}.`);
  out.push(`The ledger of this path ends in ${ledgerEnd}; the model dates nothing after it. ` +
           'Past these years the chronicle letters the tracks as caps and the passage says where ' +
           'the ledger ends.');
  return out.join(' ');
}

// ── what a line opens onto ───────────────────────────────────────────────────
// The note a reader gets by pressing a line of the passage: which thing the model emitted or
// which table row the line was composed from, in the parent's own words where it has them,
// and the grounding behind it. `plain` is the sheet's own cleaner for registry prose.
export function provenanceNote(it, engine, network, plain = (t) => t) {
  const p = it.prov || {};
  const lines = [];
  let title = 'SOURCE';
  if (p.milestone) {
    title = `CAPABILITY MILESTONE ${p.milestone}`;
    lines.push(`The capability index of the active path first reaches ${p.milestone}.0 in ` +
               `${p.year}${p.rung ? `; the ladder names this rung "${p.rung}"` : ''}.`);
    lines.push('The index is the parent model\'s sampled capability track. The sentence is ' +
               'authored once per rung and takes its year from the track.');
  } else if (p.domain) {
    title = `CAPABILITY DOMAIN · ${p.name}`;
    lines.push(`The engine lamps this domain when the capability index passes ${p.th}; on the ` +
               `active path that is ${p.year}.`);
    if (p.desc) lines.push(plain(p.desc));
  } else if (p.template) {
    title = `EVENT TEMPLATE · ${p.template}`;
    lines.push(`The parent instantiated this template on the active path at ` +
               `${Number(p.year).toFixed(1)}${p.layer ? `, in its ${p.layer} layer` : ''}.`);
    if (p.parent) lines.push(`The parent's own words: "${p.parent}"`);
    if (p.window) {
      lines.push(`The template's window is ${Math.floor(p.window[0])} to ${Math.floor(p.window[1])}` +
                 `${p.p != null ? ` and its probability inside it ${p.p}` : ''}` +
                 `${p.req ? `; it requires ${p.req}` : ''}. Read from engine.json.`);
    }
  } else if (p.track && p.level != null) {
    title = `TRACK LEVEL · ${String(p.track).toUpperCase()}`;
    lines.push(`The track of ${TRACK_NAME[p.track] || p.track} on the active path first passes ` +
               `${fmtV(p.track, p.level)} in ${p.year}.`);
    lines.push('The level and its comparison are authored; the track is the parent model\'s.');
  } else if (p.track === 'hz') {
    title = 'TRACK · TIME HORIZON';
    lines.push('METR\'s 50% time horizon in hours, read off the capability index between the ' +
               'rungs: 16 hours at the 2026 anchor, one working month at the coding rung, one ' +
               'working year at the research rung. Above the research rung no human has been ' +
               'timed at the task, so the series is emitted at the rung-4 figure and is no ' +
               'longer a measurement.');
  } else if (p.track === 'gwp') {
    title = 'TRACK · WORLD OUTPUT';
    lines.push('World output on the active path: $115 trillion in 2026 growing 3% a year at ' +
               'trend, lifted by the benefit position\'s share of the capability above the ' +
               'coding rung, two index units at most, tapering to trend over forty years after ' +
               'the research crossing. The revenue share and the comparisons read against it.');
  } else if (p.track) {
    title = `TRACK · ${String(p.track).toUpperCase()}`;
    lines.push(`The track of ${TRACK_NAME[p.track] || p.track} on the active path reads ` +
               `${fmtV(p.track, p.value)} in ${p.year}.` +
               (p.capped ? '' : ' The five-year rate is read from the same track.'));
    if (p.cap && p.cap.ceiling && p.year >= p.cap.ceiling) {
      lines.push(`The track exceeds the whole of world generating capacity from ${p.cap.ceiling} ` +
                 `(${gwFmt(WORLD_GW_2026)} gigawatts in 2026, growing ${((WORLD_GW_GROWTH - 1) * 100).toFixed(1)}% a year), ` +
                 'so the sheet reads it no further.');
    } else if (p.cap && p.cap.since != null && p.year >= p.cap.since) {
      lines.push(`The track holds this value from ${p.cap.since} to the end of the run, so the ` +
                 'sheet letters it as a cap and never as a reading of the year.');
    }
  } else if (p.position) {
    const a = (network.axes || []).find((z) => z.key === p.axis);
    const pos = a && a.positions.find((q) => q[0] === p.position);
    title = `POSITION ${p.position}${pos ? ' · ' + pos[1] : ''}`;
    lines.push(`${p.position} is the active path's setting of variable ${p.axis}` +
               `${a ? `, ${lower(a.name)}` : ''}.`);
    if (pos && pos[4]) {
      // the first two sentences of the registry's own description; the full entry opens
      // from the position's button on the controls
      const sents = String(plain(pos[4])).split(/(?<=[.!?])\s+(?=[A-Z])/);
      lines.push(`The registry's own description: ${sents.slice(0, 2).join(' ')}` +
                 (sents.length > 2 ? ' The full entry opens from its button on the controls.' : ''));
    }
    const how = { milestone: 'the capability milestone its rule names',
                  template: 'the template that names it', track: 'a track passing the level its rule names',
                  year: 'the year its rule states' }[p.onsetKind];
    lines.push(p.onset ? `On this path it comes into force in ${Math.floor(p.onset)}, dated by ${how}.`
                       : 'In force from the record; no rule dates its onset.');
    if (p.known === false) lines.push('This variable is new to the sheet and reads in the last lane until it is placed.');
  } else if (p.calendar) {
    title = `CALENDAR · ${p.calendar}`;
    lines.push('A dated commitment already on the record, authored from the sources in Method. ' +
               'The model does not generate it and the controls do not move it.');
  } else if (p.end != null) {
    title = 'END OF THE LEDGER';
    lines.push(`The active path carries no dated entry after ${p.end}: no milestone, template, ` +
               'onset or level. What the quantities show past it is the model\'s caps, lettered ' +
               'as caps. The far decades wait on the model programme ' +
               '(Research/plan-2026-09-02-chronicle.md, section 3).');
  } else if (p.empty) {
    title = 'EMPTY LANE';
    lines.push(`No milestone, event, onset or level falls in this lane between ${p.from} and ` +
               `${p.to} on the active path. That is the model, reported as it is.`);
  }
  // wiki slugs are lettered; web addresses are counted, and listed on the sources plate
  const all = it.cites || [];
  const slugs = all.filter((c) => !/^https?:/.test(c)).slice(0, 6), web = all.length - all.filter((c) => !/^https?:/.test(c)).length;
  if (slugs.length || web) {
    lines.push(`Grounding: ${slugs.join(' · ')}${slugs.length && web ? ', and ' : ''}` +
               `${web ? `${web} web source${web === 1 ? '' : 's'} on the sources plate` : ''}.`);
  }
  lines.push(`Ledger source ${it.src}.`);
  return { title, lines };
}

// Compatibility with the sections that draw the passage and the headline separately.
export function describe(wl, year, tracks, engine, network, events) {
  return chronicle(wl, year, tracks, events, engine, network).paras;
}
export function headline(wl, year, tracks, engine, network, events) {
  return chronicle(wl, year, tracks, events, engine, network).headline;
}
