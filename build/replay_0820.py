#!/usr/bin/env python3
"""Replay the whole 2026-08-20 pass over narrative.js from the r7 commit.

WHY THIS EXISTS. Every step of the day is a script over a saved input, so the day is
reproducible — which is what made a destroyed table a twenty-minute problem instead of a lost
afternoon. A reader blind to the array form of a stage slot emptied HEADCL and reported success;
the reader is fixed and this replays the day on top of the fix.

    python3 build/replay_0820.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SP = Path('/private/tmp/claude-501/-Users-augustgweon/92fc10c8-fb2d-45a6-bea7-5cf3c139d7bd/scratchpad')
STEPS = [
    ('apply_hollow.py', ['hollow_fixes.json'], 'the marks that opened onto nothing'),
    ('apply_hollow.py', ['hollow_fix2.json'], 'a retired phrase a rewrite brought back'),
    ('apply_hollow.py', ['named_fixes.json'], 'the five sentences August quoted'),
    ('apply_variants.py', ['variants_out.json'], 'two more ways to say each stage'),
    ('__stagetext__', [], 'the drawing reaches the alternatives'),
    ('apply_hollow.py', ['variant_repair.json'], 'gate faults inside the new clauses'),
    ('apply_g.py', ['g_head.json', 'g_frag.json'], 'axis G, benefit realisation'),
    ('apply_hollow.py', ['g_repair.json'], 'gate faults inside axis G'),
    ('apply_tension.py', ['tension_stages.json'], 'the tension table onto the stage clock'),
    ('apply_hollow.py', ['tension_repair.json'], 'gate faults inside the tension clauses'),
]
PATCH = ("""// A stage table falls back down its own sequence, so a table written short still draws.
export function stageText(row, year, tracks) {
  if (!row) return '';
  if (typeof row === 'string') return row;
  const stage = stageOf(year, tracks);
  const want = +stage.slice(1);
  for (let n = want; n >= 1; n--) if (row['s' + n]) return row['s' + n];
  for (let n = want + 1; n <= 6; n++) if (row['s' + n]) return row['s' + n];""",
"""// A STAGE HOLDS MORE THAN ONE WAY OF SAYING ITSELF. Sixty sentences covered seventy-four years,
// because a world-line fixes ten positions and each offered exactly one clause per stage, so a
// reader met the same sentence about four times. Each stage now holds three, written to different
// subjects, and the year chooses. The salt is the stage, so the three slots of one headline do
// not all step to their next alternative in the same year.
export function altOf(v, year, salt = 0) {
  if (!Array.isArray(v)) return v || '';
  if (!v.length) return '';
  return v[Math.abs(Math.floor(year) * 13 + salt * 5) % v.length];
}

// A stage table falls back down its own sequence, so a table written short still draws.
export function stageText(row, year, tracks) {
  if (!row) return '';
  if (typeof row === 'string') return row;
  const stage = stageOf(year, tracks);
  const want = +stage.slice(1);
  for (let n = want; n >= 1; n--) if (row['s' + n]) return altOf(row['s' + n], year, n);
  for (let n = want + 1; n <= 6; n++) if (row['s' + n]) return altOf(row['s' + n], year, n);""")
SPAN = ("""  const sp = spanFromStage(stage);
  const order = ['near', 'mid', 'long', 'far'];
  for (let i = order.indexOf(sp); i >= 0; i--) if (row[order[i]]) return row[order[i]];
  for (const k of order) if (row[k]) return row[k];
  return '';""",
"""  const sp = spanFromStage(stage);
  const order = ['near', 'mid', 'long', 'far'];
  for (let i = order.indexOf(sp); i >= 0; i--) if (row[order[i]]) return altOf(row[order[i]], year, i);
  for (const k of order) if (row[k]) return altOf(row[k], year, 0);
  return '';""")


def main():
    narr = ROOT / 'web' / 'js' / 'narrative.js'
    subprocess.run(['git', 'checkout', '--', 'web/js/narrative.js'], cwd=ROOT, check=True)
    print('restored narrative.js from r7')
    for script, args, why in STEPS:
        if script == '__stagetext__':
            s = narr.read_text(encoding='utf-8')
            for a, b in (PATCH, SPAN):
                if a not in s:
                    raise SystemExit('stageText patch site not found')
                s = s.replace(a, b)
            narr.write_text(s, encoding='utf-8')
            print('  · %s' % why)
            continue
        r = subprocess.run([sys.executable, 'build/' + script] + [str(SP / a) for a in args],
                           cwd=ROOT, capture_output=True, text=True)
        if r.returncode:
            raise SystemExit('%s failed:\n%s%s' % (script, r.stdout, r.stderr))
        print('  · %-40s %s' % (why, r.stdout.strip().splitlines()[0]))
    print('replayed')


if __name__ == '__main__':
    main()
