# The Forecast Works — live state

**Live:** https://augustg97.github.io/forecast-works/ · build `20260812-0001`
**Local:** `python3 build/serve.py 8154` (serves `web/`, never `docs/`)

## What it is now

A vertical document, 300 mm wide and about 2.2 m long, read by scrolling. Eleven sections,
each its own canvas at a fixed scale, so 2 mm of cap height renders at about 11 px and nothing
has to be zoomed. There is no pan and no zoom.

| # | section | height | what it carries |
|---|---------|--------|-----------------|
| 1 | header | 34 mm | masthead, standing description, the one-sentence headline for the current state |
| 2 | forecast | 206 mm | the band, the milestone datums, the crisis points, the date scrubber, the key, and the ochre area showing what your settings moved |
| 3 | controls | 399 mm | seven variables, 26 labelled buttons, each with a description, its weight, and what it moves hardest by 2040 |
| 4 | note | grows | the full entry for whatever is selected; the standing note when nothing is |
| 5 | future | grows | the composed passage for this line and this date, plus two drawn scenes |
| 6 | details | 139 mm | A tempo dials · B compute manifold · C capability domains and agent collectives |
| 7 | behaviour | 250 mm | six recorders: compute, revenue, employment, measures, approval, emissions |
| 8 | world | 200 mm | the active line on the ground |
| 9 | alternatives | 232 mm | twelve sampled world-lines across the spread |
| 10 | morning | 190 mm | today's evidence applications with their arithmetic, and the net drift |
| 11 | sources | 150 mm | method, grounding counts, the literature, and what this surface is |

## Standing checks

```bash
python3 build/build_site.py            # gate → pull → stamp → docs/
__FW.auditSweep()                      # console; REQUIRE controlPasses: true
```

Last sweep: **16 cases · 9,060 lettering marks · 0 collisions · 0 off-section · 0 overflows ·
control passes.** Full redraw of all eleven sections: 18 ms. Effect recalculation on a pin
change: 22 ms, cached per pin set.

## Open

- The A axis (alignment outcome) reports NO MEASURED EFFECT BY 2040 on all four positions.
  That is true of the model as built — nothing downstream in `tracks()` reads A, and no
  conditional links it to T. Whether that is a modelling gap or a real property of the axis is
  worth a look in the Atlas.
- The `driver` field arrives from the parent cut at 140 characters. The sheet marks the cut
  with an ellipsis; lifting the cap is a change to the Atlas emitter, which this project does
  not make.
