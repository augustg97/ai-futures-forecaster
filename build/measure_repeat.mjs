// HOW OFTEN THE SHEET REPEATS ITSELF, MEASURED RATHER THAN NOTICED.
//
// Hold one path, step the year across the whole forecast, and count how many of the sentences
// the chronicle composes are distinct, and how many consecutive years any one sentence is
// drawn in full. The chronicle's rule is that an entry appears in full while it is within three
// years of the date, then as a dated clause, then not at all (plan-2026-09-02, §2).
//
//   node build/measure_repeat.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chronicle } from '../web/js/ledger.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const F = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'forecast', n), 'utf8'));
const engine = F('engine.json'), network = F('network.json'), main = F('mainline.json'),
      ex = F('exemplars.json');
const sents = (t) => String(t || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 15);

for (const L of [{ wl: main.wl, tracks: main.tracks, events: main.events, name: 'likeliest path' },
                 ...ex.lines.slice(0, 3).map((l, k) => ({ ...l, name: `exemplar ${k}` }))]) {
  const seen = new Map();
  let total = 0, headDistinct = new Set(), runs = new Map(), worstRun = 0, worstText = '';
  let prevSet = new Set();
  for (let y = engine.y0 + 1; y <= engine.y1; y++) {
    const ch = chronicle(L.wl, y, L.tracks, L.events || [], engine, network);
    headDistinct.add(ch.headline);
    const cur = new Set();
    for (const p of ch.paras) {
      if (!/^Since/.test(p.lead)) continue;   // the standing conditions repeat by design
      for (const g of p.groups) for (const s of sents(g.text)) {
        total++; seen.set(s, (seen.get(s) || 0) + 1); cur.add(s);
      }
    }
    for (const s of cur) {
      const r = prevSet.has(s) ? (runs.get(s) || 1) + 1 : 1;
      runs.set(s, r);
      if (r > worstRun) { worstRun = r; worstText = s; }
    }
    prevSet = cur;
  }
  console.log(`${L.name} · ${engine.y1 - engine.y0} years · headlines distinct ${headDistinct.size}/${engine.y1 - engine.y0}`);
  console.log(`  since-2026 sentences: ${total} drawn, ${seen.size} distinct (each ${(total / Math.max(1, seen.size)).toFixed(1)}×)`);
  console.log(`  longest run of one sentence in consecutive years: ${worstRun} — ${worstText.slice(0, 90)}`);
}
