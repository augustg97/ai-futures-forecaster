# The Forecast Works — live state

**Live:** https://augustg97.github.io/forecast-works/ · build `20260812-0037`
**Local:** `python3 build/serve.py 8154` (serves `web/`, never `docs/`)

## What it is

Seven tabs. Within a tab the drawing is a vertical sheet 300 mm wide at one fixed scale, so
2 mm of cap height renders at about 11 px and nothing has to be zoomed.

| tab | sections | what it carries |
|-----|----------|-----------------|
| Forecast | masthead · forecast · controls | the band and its milestones on the left, the composed passage and the drawn scenes in a column to its right, the controls below |
| Instruments | details | A tempo dials · B compute manifold · C capability domains and agent collectives |
| Behaviour | behaviour | six recorders: compute, revenue, employment, measures, approval, emissions |
| World | world | the active line on the ground |
| Alternatives | alternatives | twelve sampled world-lines across the spread |
| This morning | morning | today's evidence applications with their arithmetic, and the net drift |
| Method | sources | method, grounding counts, the literature, and what this surface is |

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

Last sweep: **16 cases · 9,620 lettering marks · 0 collisions · 0 off-section · 0 overflows ·
control passes.** Full pass over every section: ~18 ms. Effect recalculation on a setting
change: 22 ms, cached per setting.

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
