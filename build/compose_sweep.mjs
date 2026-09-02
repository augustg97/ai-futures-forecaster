// build/compose_sweep.mjs — compose the headline and the passage over paths and years, so a
// gate can read what the sheet would letter rather than the strings it is authored from.
//
// The prose gate reads the authored literals in narrative.js, and every one of them can be
// clean while the COMPOSED output is not: a clause that leans on a neighbour, a pointer with no
// antecedent, four sentences of the same shape in a row, a join the assembler added. The
// readout gate (build/readout_gate.py) judges the composed text, and this is the composer run
// to order. Prints one JSON document to stdout.
//
//   node build/compose_sweep.mjs [exemplars=12] [step=3]
//
// The likeliest path is composed at every year; each exemplar every `step` years.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, headline, crossSlots } from '../web/js/narrative.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'forecast', n), 'utf8'));
const engine = F('engine.json'), main = F('mainline.json'), ex = F('exemplars.json');
const N = Number(process.argv[2] || 12), STEP = Number(process.argv[3] || 3);

const lines = [{ wl: main.wl, tracks: main.tracks, mainline: true }]
  .concat(ex.lines.filter((l) => !l.mainline).slice(0, N));
const out = { generated: new Date().toISOString(), y0: engine.y0, y1: engine.y1, lines: [] };
for (const [li, L] of lines.entries()) {
  const step = li === 0 ? 1 : STEP;
  const row = { wl: L.wl, mainline: !!L.mainline, cross: crossSlots(L.wl), years: [] };
  for (let y = engine.y0 + 1; y <= engine.y1; y += step) {
    const paras = describe(L.wl, y, L.tracks, engine.y0, null);
    row.years.push({
      y,
      headline: headline(L.wl, y, L.tracks, engine.y0),
      paras: paras.map((p) => ({
        lead: p.lead, src: p.src || null, text: p.text,
        groups: (p.groups || []).map((g) => ({ head: g.head, text: g.text, src: g.src || null })),
      })),
    });
  }
  out.lines.push(row);
}
process.stdout.write(JSON.stringify(out));
