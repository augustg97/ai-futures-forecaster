// build/table_coverage.mjs — which registry positions the authored TABLES can letter.
//
// The coverage gate compares the pulled registry against `registry-covered.json`, which is the
// drawing's own declaration. A declaration can be wrong: on 2026-09-01 it listed K4 as covered
// while HEADCL and FRAG had no K4 row, so a path carrying K4 drew no takeoff clause and nothing
// said so (review of 2026-09-01, defect 2). This reads the tables themselves and prints what
// they lack, and which of the six CROSS pairings `describe()` asks for are written. The build
// refuses on a missing HEADCL or FRAG row and reports the rest.
//
//   node build/table_coverage.mjs        → JSON on stdout
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADCL, FRAG, LONGFORM, PROCESS, CROSS_SLOTS, crossPairKnown } from '../web/js/narrative.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const net = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'forecast', 'network.json'), 'utf8'));
const axes = {};
for (const a of net.axes) axes[a.key] = a.positions.map((p) => p[0]);
const all = Object.values(axes).flat();

const missing = {
  HEADCL: all.filter((p) => !HEADCL[p]),
  FRAG: all.filter((p) => !FRAG[p]),
  LONGFORM: all.filter((p) => !LONGFORM[p]),
  PROCESS: all.filter((p) => !PROCESS[p]),
};
const cross = CROSS_SLOTS.map(([a, b]) => {
  const pairs = [];
  for (const x of axes[a] || []) for (const y of axes[b] || []) pairs.push([x, y]);
  const have = pairs.filter(([x, y]) => crossPairKnown(x, y)).length;
  return { pair: `${a}|${b}`, have, of: pairs.length };
});
process.stdout.write(JSON.stringify({
  version: net.version, positions: all.length, missing, cross,
}));
