# AI Futures Forecaster

The AI Atlas forecast, drawn as a document.

A probabilistic world-model of the AI transition, 2012 → 2100, composed on an A1 drafting sheet
in the register established by **The Systems Works**: paper and ink, ISO pen weights, everything
specified in sheet millimetres, and — where a real instrument already performs an abstraction —
the instrument built rather than the graphic drawn.

- **Live:** https://augustg97.github.io/forecast-works/ (Pages serves `main:/docs`)
- **Dev server:** `ai-futures-forecaster`, port 8154 (`build/serve.py`, no-store)

## What this is, and what it is not

This is a **second surface on one instrument**, not a fork of it. The engine — the belief
network, the evidence layer that moves it every morning, the wiki grounding, the nightly gate —
lives in `~/AI Atlas` and is untouched by this project. This build reads its emitted forecast
**read-only** and refuses to publish if the Atlas gate fails.

Neither `~/AI Atlas` nor `~/Systems Works` is ever modified from here. The drafting conventions
are adopted; nothing is imported across project boundaries.

## The five plates

| # | Plate | The principal view |
|---|---|---|
| 1 | THE MAINLINE | the forecast: percentile envelopes hatched over the observed record, milestone datums, crisis points annotated with leaders; the tempo dials, the compute manifold, the capability annunciator; six behaviour traces |
| 2 | THE WORLD | the active world-line on real ground: regime hatch ∝ compute share, sites ∝ modelled capacity |
| 3 | ALTERNATIVE FUTURES | twelve sampled world-lines across the probability curve, each drawn in full; click one to make it active everywhere |
| 4 | THIS MORNING'S REVISION | the day's evidence applications with their arithmetic and drivers, the newest ringed in a revision cloud; net movement per axis as a bank of sight glasses |
| 5 | THE KEY | the line types, the colour code, and the seven axes as a glossary |

Every plate carries the same left column (the network, today's reading, the controls), the same
right column (the conditional structure and the notes), and the same title block.

## The instruments

Where a quantity needed abstracting, the instrument that already does it was built:

- a probability is **a needle on an engraved face**; the reading of thirty days ago is a ghost
  needle behind it, so the drift is **an angle** rather than a signed number in small print;
- shares of a total are **floats riding in a manifold**, read against one scale;
- a threshold crossed is **an annunciator lamp** that trips;
- a quantity over time is **a pen on a strip chart** sitting at the date on the index;
- a count is **tally squares**, one per decade of the count;
- a day's work on the network is **a bank of sight glasses**, one per axis.

## The colour code, declared once

`ink` structure and the observed record · `blue` probability in motion · `red` annotation and
revision, including whatever the evidence moved this morning · `green` goals and targets ·
`ochre` delays, and the active composed line · `warm` energy: compute, power, emissions.

## Build and deploy

```bash
python3 build/build_site.py --dev     # pull the Atlas's staged forecast into web/data
python3 build/build_site.py           # Atlas gate → pull → stamp → docs/
git add -A && git commit && git push  # Pages serves main:/docs
curl -s https://augustg97.github.io/forecast-works/ | grep -o '__BUILD = "[^"]*"'
```

The build refuses to publish if the AI Atlas gate fails, stamps `window.__BUILD` into the built
copy only, and versions every module import in `docs/js/` so a fresh `app.js` can never be
served against a stale `draft.js`.

The climate constants the client needs are **extracted from the Atlas's `worldlines.py` at build
time** rather than mirrored by hand; a parse failure is fatal.
