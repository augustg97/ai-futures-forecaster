# AI Futures Forecaster — live state

**Live:** https://augustg97.github.io/ai-futures-forecaster/ · build `20260812-1129`
**Local:** `python3 build/serve.py 8154` (serves `web/`, never `docs/`) · working
directory `~/Forecast Works`, repo `augustg97/ai-futures-forecaster`

**The old Pages path `augustg97.github.io/forecast-works/` now 404s.** Renaming a
GitHub repo redirects the repository page but NOT its Pages URL.

## What it is

Seven tabs. Within a tab the drawing is a vertical sheet **340 mm** wide at one fixed scale; the
document window opens to 1720 px, where 2 mm of cap height renders at about 13 px.

| tab | sections | what it carries |
|-----|----------|-----------------|
| Forecast | masthead · readout · board · scenes | the composed passage first, as a three-column band across the head of the sheet; then the board — instruments and the six behaviour recorders on the LEFT, the chart and its date index in the MIDDLE, the controls as a tabbed panel on the RIGHT; then the two drawn scenes |
| Instruments | details | A tempo dials · B compute manifold · C capability domains and agent collectives |
| Behaviour | behaviour | six recorders: compute, revenue, employment, measures, approval, emissions |
| World | world | the active line on the ground |
| Alternatives | alternatives | twelve sampled world-lines across the spread |
| This morning | morning | today's evidence applications with their arithmetic, and the net drift |
| Method | sources | method, grounding counts, the literature, and what this surface is |

## The passage

`narrative.js` COMPOSES it: each paragraph is the variable's own state × span, plus a CROSS
clause naming what a second variable does to it, plus a BAND clause keyed on a quantity at that
date, plus the figures. 84 CROSS clauses cover the six pairs that interact (E×S, E×D, C×S, A×T,
P×D, T×C). Holding the economy fixed and moving only supply, labour and the year gives 36
distinct economy paragraphs out of 36; 400 random world-line/year samples give 400 distinct
passages. **The headline is composed the same way** — every clause keyed on a position AND the
span, with the economy clause taking a second key from `ECON_MOD`; 780 of 800 samples distinct.
If you add a position to an axis in the parent, add its FRAG row for all four spans, its CROSS
row against whichever axis its paragraph pairs with, and (for E) its ECON and ECON_MOD rows, or
the clause silently drops.

## The colour of the sheet

Printer white, `PAPER = '#fdfdfb'` in `draft.js`, with the paper tooth at half its old
amplitude and the fibre blooms nearly colourless. Every ink is a density over that white, and
the whole palette was sharpened with the paper (ink 0.97, red 178·28·24, blue 10·72·168, warm
196·78·10). Nothing in the drawing may hard-code a paper colour — import `PAPER`.

## Where a note appears

A note is drawn where the mark that opened it is. An axis entry unfolds inside its own row on
the controls; a milestone or a crisis point fills the band under the chart; a mark on any other
tab puts its entry at the head of that tab. Nothing scrolls the reader away from what they
pressed.

## Standing checks

```bash
python3 build/build_site.py            # gate → pull → stamp → docs/
__FW.auditSweep()                      # console; REQUIRE controlPasses: true
```

Last sweep: **23 cases · 12,284 lettering marks · 0 collisions · 0 off-section · 0 overflows ·
control passes** (2026-08-12, run against the live build). Full pass over every section: ~18 ms.
Effect recalculation on a setting change: 22 ms, cached per setting.

## Open

- The A axis (alignment outcome) reports NO MEASURED EFFECT BY 2040 on all four positions. That
  is true of the model as built — nothing downstream in `tracks()` reads A, and no conditional
  links it to T. Whether that is a modelling gap or a property of the axis is worth a look in
  the Atlas.
- The `driver` field arrives from the parent cut at 140 characters. The sheet marks the cut with
  an ellipsis; lifting the cap is a change to the Atlas emitter, which this project does not
  make.
- `plain()` drops the clauses in the parent's variable descriptions that name a source document,
  so the controls describe what a variable does and Method carries the provenance. If the parent
  changes how it writes those descriptions, check the filter still re-punctuates cleanly.
