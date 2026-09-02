// build/port_gate.mjs — the port must be the parent.
//
// The client implements the engine's functions against the constants the parent emits
// (CLAUDE.md rule 10), and a conditioned path on the sheet is drawn by that port. Two
// implementations of one model are safe only while something checks that they agree: on
// 2026-08-17 the parent re-keyed LAWS_RATE onto R while the port read it on C, every laws
// value was NaN, and nothing raised. This recomputes the parent's emitted knots and tracks
// for the mainline and a sample of exemplars, given the parent's own events, and refuses the
// build on any divergence past the parent's rounding. Events are not compared: the parent
// draws with Python's generator and the port with mulberry32, by design.
//
//   node build/port_gate.mjs [exemplars=24]      → exit 8 on divergence
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { capPath, tracksJS, crossings, hasDynamics } from '../web/js/engine.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'forecast', n), 'utf8'));
const E = F('engine.json'), C = F('climate.json'), main = F('mainline.json'), ex = F('exemplars.json');
const N = Number(process.argv[2] || 24);

// the parent rounds each track when it emits; the port keeps full precision
const ROUND = { cap: 3, gw: 1, us: 3, cn: 3, eu: 3, rev: 3, jobs: 1, laws: 0, appr: 1, copies: 0,
                speed: 0, twh: 1, co2: 1, hz: 1, gwp: 1, work: 4 };
const worst = {};
let faults = 0, checked = 0;
function compare(label, wl, emitted, events, knots) {
  const mine = tracksJS(E, C, wl, events);
  if (knots) {
    const k2 = capPath(E, wl);
    const a = JSON.stringify(knots.map((k) => [Math.round(k[0] * 1000) / 1000, Math.round(k[1] * 1000) / 1000]));
    const b = JSON.stringify(k2.map((k) => [Math.round(k[0] * 1000) / 1000, Math.round(k[1] * 1000) / 1000]));
    if (a !== b) { faults++; console.log(`  ${label}: knots differ\n    parent ${a}\n    port   ${b}`); }
  }
  for (const key in ROUND) {
    if (!(key in emitted) || !(key in mine)) continue;
    const unit = Math.pow(10, -ROUND[key]);
    for (let i = 0; i < emitted[key].length; i++) {
      const a = emitted[key][i], b = mine[key][i];
      // within half a rounding unit, plus a relative slack for the last digit of a big number
      const tol = 0.5 * unit + 1e-9 * Math.max(Math.abs(a), Math.abs(b)) + 1e-7;
      const d = Math.abs(a - b);
      checked++;
      if (d > tol) {
        faults++;
        const w = worst[key] || { d: 0 };
        if (d > w.d) worst[key] = { d, label, year: emitted.year[i], parent: a, port: b };
      }
    }
  }
}
compare('mainline', main.wl, main.tracks, main.events, main.knots || null);
let n = 0;
for (const L of ex.lines) {
  if (L.mainline) continue;
  if (n++ >= N) break;
  compare(`exemplar ${n}`, L.wl, L.tracks, L.events || [], L.knots || null);
}
const mode = hasDynamics(E) ? 'r9 dynamics' : 'r8 arithmetic';
console.log(`port gate · ${mode} · mainline + ${n} exemplars · ${checked} values compared`);
if (main.crossings) {
  const mine = crossings(capPath(E, main.wl), E.y1);
  const same = JSON.stringify(mine) === JSON.stringify(main.crossings);
  console.log(`  crossings ${same ? 'agree' : 'DIFFER'}: parent ${JSON.stringify(main.crossings)} port ${JSON.stringify(mine)}`);
  if (!same) faults++;
}
for (const key in worst) {
  const w = worst[key];
  console.log(`  ${key}: worst ${w.d.toExponential(2)} on ${w.label} at ${w.year} (parent ${w.parent}, port ${w.port})`);
}
if (faults) { console.log(`PORT GATE REFUSED · ${faults} divergences`); process.exit(8); }
console.log('  0 divergences · PASS');
