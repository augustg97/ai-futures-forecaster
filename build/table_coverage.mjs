// build/table_coverage.mjs — which registry positions and engine templates the authored
// tables can letter.
//
// The coverage gate compares the pulled registry against `registry-covered.json`, which is the
// drawing's own declaration. A declaration can be wrong: on 2026-09-01 it listed K4 as covered
// while the tables had no K4 row, so a path carrying K4 drew no takeoff clause and nothing said
// so (review of 2026-09-01, defect 2). This reads the tables themselves. Since the chronicle
// (plan-2026-09-02, P1) the tables are CRITERION, one sentence per position; TEMPLATE_TEXT, one
// entry per engine template; and LONGFORM, the entry a position opens on click. The build
// refuses on a position without a criterion or a template without text, and reports LONGFORM.
//
//   node build/table_coverage.mjs        → JSON on stdout
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CRITERION, TEMPLATE_TEXT, LONGFORM, ONSET } from '../web/js/narrative.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'forecast', n), 'utf8'));
const net = F('network.json'), engine = F('engine.json');
const all = net.axes.flatMap((a) => a.positions.map((p) => p[0]));
const templates = (engine.templates || []).map((t) => t.id);

const missing = {
  CRITERION: all.filter((p) => !CRITERION[p]),
  TEMPLATE_TEXT: templates.filter((id) => !TEMPLATE_TEXT[id]),
  LONGFORM: all.filter((p) => !LONGFORM[p]),
};
const onsetRules = all.filter((p) => ONSET[p]).length;
process.stdout.write(JSON.stringify({
  version: net.version, positions: all.length, templates: templates.length, missing, onsetRules,
}));
