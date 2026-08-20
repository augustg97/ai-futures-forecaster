// HOW OFTEN THE SHEET REPEATS ITSELF, MEASURED RATHER THAN NOTICED.
//
// August: "our sentences still repeat across years - they should not, our language should be as
// dynamic as the events we are forecasting." Hold one setting of all ten controls, step the year
// across the whole forecast, and count how many of the sentences the headline composes are
// distinct. Reported per slot, because a slot still keyed on the four calendar spans can only
// ever say four things however well each is written.
//
//   node build/measure_repeat.mjs [lines]
import { headline, stageOf } from '../web/js/narrative.js';

const AXES = { T: 5, K: 4, A: 5, C: 5, R: 5, D: 6, S: 5, P: 5, E: 5, L: 6, G: 6 };
const Y0 = 2026, Y1 = 2100;

// a world-line's capability track: a logistic climb whose crossing year the line itself sets
function tracks(crossAt, seed) {
  const t = { year: [], cap: [], appr: [], jobs: [], rev: [], gw: [], laws: [] };
  for (let y = Y0; y <= Y1; y++) {
    const u = (y - crossAt) / 6, k = y - Y0;
    t.year.push(y);
    t.cap.push(1.2 + 6.3 / (1 + Math.exp(-u)));
    // the four tracked quantities the headline reads, each varied by the line so the tension
    // clause is exercised rather than pinned to one branch
    t.appr.push(45 - (seed % 5) * 6 - k * 0.25);
    t.jobs.push(-(k * (0.15 + (seed % 4) * 0.08)));
    t.rev.push(1 + k * (0.05 + (seed % 3) * 0.06));
    t.gw.push(60 + k * 4);
    t.laws.push(90 + k * 6);
  }
  return t;
}

function lines(n) {
  const keys = Object.keys(AXES), out = [];
  for (let i = 0; i < n; i++) {
    const wl = {};
    let h = i * 2654435761 % 2147483647;
    for (const k of keys) {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      wl[k] = k + (1 + (h % AXES[k]));
    }
    out.push(wl);
  }
  return out;
}

const N = Number(process.argv[2] || 24);
const perLine = [], slotSets = [new Set(), new Set(), new Set(), new Set()];
let totalSent = 0, worst = { n: 0 };
for (const [i, wl] of lines(N).entries()) {
  const tr = tracks(2029 + (i % 9), i);
  const seen = new Map();
  let sent = 0;
  for (let y = Y0 + 1; y <= Y1; y++) {
    const h = headline(wl, y, tr, Y0);
    const parts = String(h || '').split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 20);
    parts.forEach((p, k) => { if (k < 4) slotSets[k].add(p); });
    for (const p of parts) {
      sent++;
      seen.set(p, (seen.get(p) || 0) + 1);
      if ((seen.get(p) || 0) > worst.n) worst = { n: seen.get(p), text: p };
    }
  }
  totalSent += sent;
  perLine.push({ sent, distinct: seen.size });
}
const avgS = perLine.reduce((a, x) => a + x.sent, 0) / perLine.length;
const avgD = perLine.reduce((a, x) => a + x.distinct, 0) / perLine.length;
console.log(`${N} world-lines · ${Y0 + 1} to ${Y1}`);
console.log(`per line: ${avgS.toFixed(0)} sentences, ${avgD.toFixed(1)} distinct `
  + `(each said ${(avgS / avgD).toFixed(2)} times)`);
console.log(`most repeated inside one line: ${worst.n} times — ${String(worst.text).slice(0, 88)}`);
console.log(`distinct across all ${N} lines, by position in the headline: `
  + slotSets.map((s) => s.size).join(' · '));
