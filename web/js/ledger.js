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
// a hash. Every composed group carries `src`, the ledger entries it was composed from, and the
// readout gate refuses a line without one.
import { MILESTONE_TEXT, DOMAIN_TEXT, LADDER_NOW, TEMPLATE_TEXT, THRESHOLDS, CRITERION,
         WORK_CLAUSE, ONSET, EVENT_GROUPS, MARKERS } from './narrative.js';

export const LANES = ['capability', 'buildout', 'capital', 'oversight'];
const LANE_HEAD = {
  capability: 'Capability', buildout: 'Build-out and coordination',
  capital: 'Capital and work', oversight: 'Rules and the public',
};
const MARKER_LANE = { supply: 'buildout', law: 'oversight', capital: 'capital',
                      oversight: 'oversight' };
const LAYER_LANE = {
  capability: 'capability', science: 'capability', security: 'oversight', law: 'oversight',
  politics: 'oversight', existential: 'oversight', geopolitics: 'buildout',
  economy: 'capital', labor: 'capital', society: 'capital', far: 'capital',
};
// An entry appears in full while it is within FULL_YEARS of the date, then as a dated
// clause until CLAUSE_YEARS, then not at all unless it set a condition still in force.
const FULL_YEARS = 2, CLAUSE_YEARS = 15;   // ages 0, 1 and 2: three years in full
const MAX_WORDS = 28;

const stop = (t) => { t = String(t || '').trim(); return t && !/[.!?]$/.test(t) ? t + '.' : t; };
const lower = (t) => (t ? t.charAt(0).toLowerCase() + t.slice(1) : t);
const upper = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
const fill = (text, year) => String(text || '').replace(/\{year\}/g, String(Math.floor(year)));
const words = (t) => String(t).trim().split(/\s+/).length;
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
export function buildLedger(wl, tracks, events, engine) {
  const entries = [];
  const cross = {};
  for (const r of [3, 4, 5, 6]) cross[r] = firstYear(tracks, 'cap', (v) => v >= r);
  const evs = (events || []).map((e) => ({ ...e, id: templateIdOf(e, engine.templates) }));
  const tied = new Set(evs.map((e) => e.id));
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
                   t: fill(mt.t, cross[r]), f: mt.f, m: mt.m, src: `milestone:${r}`, cites: [] });
  }
  for (const dm of engine.domains || []) {
    const dt = DOMAIN_TEXT[dm.k];
    if (!dt) continue;
    const y = firstYear(tracks, 'cap', (v) => v >= dm.th);
    if (!y) continue;
    entries.push({ y: y + 0.05, kind: 'milestone', lane: 'capability', k: dm.n,
                   t: fill(dt.t, y), f: dt.f, m: dt.m || '', src: `domain:${dm.k}`,
                   cites: dm.cites || [] });
  }
  for (const e of evs) {
    const tx = e.id && TEMPLATE_TEXT[e.id];
    const yr = Math.floor(e.year);
    if (!tx) {
      // A template with no authored text still reaches the ledger, in the parent's words,
      // so a new template is visible on the sheet the night it arrives.
      entries.push({ y: e.year, kind: 'event', lane: LAYER_LANE[e.layer] || 'oversight',
                     k: e.id || e.layer, t: stop(e.text), f: lower(stop(e.text).replace(/\.$/, '')),
                     m: '', src: `template:${e.id || 'unknown'}`, cites: e.cites || [] });
      continue;
    }
    const v = tx.variants ? (/\bsurvives\b/.test(e.text) ? tx.variants.survives
                                                         : tx.variants.stalls) : tx;
    entries.push({ y: e.year, kind: 'event', lane: tx.lane, k: e.id, t: fill(v.t, yr),
                   f: v.f, m: v.m || '', src: `template:${e.id}`, cites: e.cites || [] });
  }
  const byId = {};
  for (const e of evs) if (e.id && !(e.id in byId)) byId[e.id] = e.year;
  const onsets = {}, onsetKind = {};
  for (const ax in wl) {
    const pos = wl[ax], rule = ONSET[pos];
    let y = null, kind = null;
    if (rule) {
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
      entries.push({ y, kind: 'onset', lane: rule.lane || 'capital', k: pos,
                     t: `From ${Math.floor(y)}, ${lower(crit)}.`, f: lower(crit), m: '',
                     src: `onset:${pos}`, cites: [] });
    }
  }
  for (const th of THRESHOLDS) {
    for (const [level, cmp] of th.levels) {
      const y = firstYear(tracks, th.key,
        (v) => (th.dir === 'down' ? v <= level : v >= level));
      if (!y || y <= engine.y0) continue;
      entries.push({ y: y + 0.5, kind: 'threshold', lane: th.lane, k: `${th.key} ${level}`,
                     t: th.t(level, cmp, y), f: th.f(level, cmp), m: '', src: `track:${th.key}`,
                     cites: [] });
    }
  }
  for (const [my, ln, text] of MARKERS) {
    entries.push({ y: my + 0.9, kind: 'calendar', lane: MARKER_LANE[ln] || 'oversight',
                   k: `calendar ${my}`, t: text, f: text, m: '', src: `calendar:${my}-${ln}`,
                   cites: [] });
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
  [12, 'exceed a tenth of world output'],
  [4, 'rival the revenue of the world automotive industry'],
  [1.4, 'exceed worldwide semiconductor sales of 2026'],
  [0.2, 'make a large software business and a small share of the economy'],
  [0, 'run years behind the capital being spent on them'],
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
  // No sentence opens on the word its neighbour opened on. A dated event sentence that
  // follows the year sentence ("In 2035, … In 2033 the first …") moves its date to the end.
  for (let k = 1; k < out.length; k++) {
    const a = (out[k - 1].match(/^[A-Za-z]+/) || [''])[0].toLowerCase();
    const b = (out[k].match(/^[A-Za-z]+/) || [''])[0].toLowerCase();
    if (a && a === b) {
      const m = out[k].match(/^In (\d{4}),? (.+)\.$/);
      if (m) out[k] = `${upper(m[2])} in ${m[1]}.`;
    }
  }
  return out.join(' ');
}

// ── the chronicle ────────────────────────────────────────────────────────────
export function chronicle(wl, year, tracks, events, engine, network) {
  const Y = Math.floor(year);
  const y0 = engine.y0;
  const i = Math.max(0, Math.min(tracks.year.length - 1, Y - y0));
  const L = buildLedger(wl, tracks, events, engine);
  const cap = tracks.cap[i], gw = tracks.gw[i], rev = tracks.rev[i], jobs = tracks.jobs[i],
        appr = tracks.appr[i], laws = tracks.laws[i];
  const past = L.entries.filter((e) => Math.floor(e.y) <= Y);
  const ahead = L.entries.filter((e) => Math.floor(e.y) > Y);
  const used = new Set();
  for (const e of past) if (e.k === 'sc-crossing' || e.k === 'sar-crossing' || e.kind === 'milestone') used.add(e.src + '@' + e.y);
  const latest = (ids, within) => {
    const hits = past.filter((e) => e.kind === 'event' && ids.includes(e.k) &&
                                    Y - Math.floor(e.y) <= within);
    return hits.length ? hits[hits.length - 1] : null;
  };
  const take = (e) => { if (e) used.add(e.src + '@' + e.y); return e; };

  // 1 · capability, dated
  const c = L.cross;
  const gapWords = (n) => (n <= 0 ? 'in the same year that' : n === 1 ? 'a year after'
    : n === 2 ? 'about two years after' : n <= 5 ? `about ${['', '', '', 'three', 'four', 'five'][n]} years after`
    : `${n} years after`);
  let s1;
  if (c[4] && c[4] <= Y) {
    s1 = `In ${Y}, frontier AI systems have run the AI research loop without human researchers since ${c[4]}`;
    s1 += c[3] && c[3] <= c[4]
      ? `, ${gapWords(c[4] - c[3])} they first out-programmed the best human software engineers.`
      : '.';
    if (c[5] && c[5] <= Y) {
      s1 += ` Since ${c[5]} frontier systems have exceeded expert performance across every measured field.`;
    }
  } else if (c[3] && c[3] <= Y) {
    s1 = `In ${Y}, frontier AI systems have out-programmed the best human software engineers since ${c[3]}, and human researchers still choose what the laboratories investigate` +
         (c[4] ? `, on this path until ${c[4]}.` : '.');
  } else {
    s1 = `In ${Y}, ${band(cap, LADDER_NOW)}.` +
         (c[3] ? ` On this path they pass the best human software engineers in ${c[3]}.` : '');
  }
  // 2 · money: the dated capital event, then compute and revenue with their comparisons
  const capEv = take(latest(EVENT_GROUPS.capital, CLAUSE_YEARS));
  const s2 = capEv ? capEv.t : CRITERION[wl.E];
  const s3 = `Installed AI computing capacity stands near ${gwFmt(gw)} gigawatts, ${band(gw, GW_CMP)}.`;
  const s4 = `Sales of AI services, at ${money(rev)} a year, ${band(rev, REV_CMP)}.`;
  // 3 · work
  const wc = (jobs <= -2 || wl.D === 'D1') ? WORK_CLAUSE[wl.D] : null;
  let s5 = jobsFigure(jobs);
  if (wc) s5 += wc.mode === 'appos' ? `, ${wc.text}.` : `; ${wc.text}.`; else s5 += '.';
  const labEv = take(latest(EVENT_GROUPS.labour, CLAUSE_YEARS));
  const s6 = labEv ? labEv.t : '';
  // 4 · who decides
  const s7 = CRITERION[wl.C] || '';
  const ruleEv = take(latest(EVENT_GROUPS.rules, FULL_YEARS));
  const s8 = ruleEv ? ruleEv.t : '';
  // 5 · the public
  const s9 = `Approval of AI stands at ${appr.toFixed(0)}%.`;
  const s10 = CRITERION[wl.P] || '';
  // 6 · the year's own event, when one falls within a year of the date and is not yet said
  const saidThisYear = [capEv, labEv, ruleEv].some((e) => e && Math.floor(e.y) === Y);
  const own = saidThisYear ? null : past.filter((e) => Math.floor(e.y) === Y && e.kind === 'event' &&
                                 !used.has(e.src + '@' + e.y)).pop();
  const s11 = own ? own.t : '';
  const headline = assemble([s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11]);

  // ── the passage: since 2026 · now · ahead ──────────────────────────────────
  const paras = [];
  const groups = [];
  for (const lane of LANES) {
    // Chronological, oldest first, the way a chronicle reads. The two most recent entries
    // within FULL_YEARS carry what they established; older ones stand as a dated clause until
    // CLAUSE_YEARS and then leave the lane. A condition still in force is carried by NOW, with
    // the year it began, so nothing here needs to persist for it.
    const mine = past.filter((e) => e.lane === lane && e.kind !== 'calendar' &&
                                    Y - Math.floor(e.y) <= CLAUSE_YEARS)
      .sort((a, b) => a.y - b.y);
    const recent = mine.filter((e) => Y - Math.floor(e.y) <= FULL_YEARS).slice(-2);
    const bits = [], srcs = [], fullKeys = [];
    for (const e of mine) {
      if (recent.includes(e)) {
        bits.push(`${stop(e.t)}${e.m ? ' ' + stop(e.m) : ''}`);
        fullKeys.push(`${e.src}@${e.y}`);
      } else {
        bits.push(stop(e.t));
      }
      srcs.push(e.src);
    }
    const cal = past.filter((e) => e.lane === lane && e.kind === 'calendar' && Y - Math.floor(e.y) <= 2).slice(-3);
    for (const e of cal) { bits.push(stop(e.t)); srcs.push(e.src); }
    if (!bits.length) bits.push(`Nothing dated falls in this lane between ${Math.max(y0, Y - CLAUSE_YEARS)} and ${Y} on this path.`);
    groups.push({ head: LANE_HEAD[lane], text: bits.join(' '),
                  src: srcs.length ? srcs.join('; ') : 'ledger:empty', full: fullKeys });
  }
  paras.push({ lead: `Since ${Math.max(y0, Y - CLAUSE_YEARS)}.`, groups,
               text: groups.map((g) => g.text).join(' '),
               src: groups.map((g) => g.src).join('; ') });

  const cond = [], condSrc = [];
  for (const a of network.axes) {
    const pos = wl[a.key];
    if (!pos || !CRITERION[pos]) continue;
    const on = L.onsets[pos], ok = L.onsetKind[pos];
    let s = CRITERION[pos];
    if (on && Math.floor(on) > y0 && Math.floor(on) <= Y) {
      s += ok === 'milestone' ? ` On this path that happened in ${Math.floor(on)}.`
         : ok === 'template' ? ` That began in ${Math.floor(on)}.`
         : ` That has held since ${Math.floor(on)}.`;
    } else if (on && Math.floor(on) > Y) {
      s += ` On this path that begins in ${Math.floor(on)}.`;
    }
    cond.push(s); condSrc.push(`criterion:${pos}`);
  }
  const qty = [
    `Installed AI computing capacity is ${gwFmt(gw)} gigawatts, ${band(gw, GW_CMP)}.`,
    rateClause(tracks, i, 'gw', 'Capacity'),
    `Sales of AI services are ${money(rev)} a year and ${band(rev, REV_CMP)}.`,
    rateClause(tracks, i, 'rev', 'Revenue'),
    `${jobsFigure(jobs)}.`, rateClause(tracks, i, 'jobs', 'Employment', true),
    `Approval of AI stands at ${appr.toFixed(0)}%. ${apprClause(appr)}`,
    rateClause(tracks, i, 'appr', 'Approval', true),
    `About ${Math.round(laws / 10) * 10} AI statutes and regulations are in force, ${band(laws, LAW_CMP)}.`,
    rateClause(tracks, i, 'laws', 'The statute count'),
  ].filter(Boolean);
  paras.push({ lead: 'Now.',
    groups: [{ head: 'Conditions in force', text: cond.join(' '), src: condSrc.join('; ') },
             { head: 'Quantities', text: qty.join(' '), src: 'track:gw; track:rev; track:jobs; track:appr; track:laws' }],
    text: cond.join(' ') + ' ' + qty.join(' '), src: condSrc.join('; ') + '; track:*' });

  const next = ahead.filter((e) => e.kind !== 'calendar' && e.kind !== 'onset').slice(0, 6);
  const nextTxt = next.map((e) => `In ${Math.floor(e.y)}, ${e.f}.`);
  const lastY = L.entries.length ? Math.floor(L.entries[L.entries.length - 1].y) : Y;
  if (!next.length) nextTxt.push(`No further dated step falls on this path after ${lastY}.`);
  const calAhead = ahead.filter((e) => e.kind === 'calendar' && Math.floor(e.y) - Y <= 3);
  const aheadGroups = [{ head: 'Next on this path', text: nextTxt.join(' '),
                         src: next.length ? next.map((e) => e.src).join('; ') : 'ledger:end' }];
  if (calAhead.length) {
    aheadGroups.push({ head: 'On the calendar', text: calAhead.map((e) => stop(e.t)).join(' '),
                       src: calAhead.map((e) => e.src).join('; ') });
  }
  paras.push({ lead: 'Ahead on this path.', groups: aheadGroups,
               text: aheadGroups.map((g) => g.text).join(' '),
               src: aheadGroups.map((g) => g.src).join('; ') });

  return { headline, paras, ledger: L };
}

// Compatibility with the sections that draw the passage and the headline separately.
export function describe(wl, year, tracks, engine, network, events) {
  return chronicle(wl, year, tracks, events, engine, network).paras;
}
export function headline(wl, year, tracks, engine, network, events) {
  return chronicle(wl, year, tracks, events, engine, network).headline;
}
