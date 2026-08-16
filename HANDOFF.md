# AI Futures Forecaster — live state

**Live:** https://augustg97.github.io/ai-futures-forecaster/ · build `20260816-1600`
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
| Research | research | the evidence programme: the audit, all 26 recommended priors against their current values, and the structural finding |
| Method | sources | method, grounding counts, the literature, and what this surface is |

## The passage

**Every clause has to say a checkable thing** — who does what, to what, with what visible
result. "A reset that left the concrete standing" is a sentence that sounds like it means
something; "the correction wiped out AI equity values without stopping datacenter construction"
is the same claim, stated so a reader can disagree with it. That rule governs every string in
`narrative.js`, and it is the standard a new clause has to meet.

`narrative.js` COMPOSES it: each paragraph is the variable's own state × span, plus a CROSS
clause naming what a second variable does to it, plus a BAND clause keyed on a quantity at that
date, plus the figures. 84 CROSS clauses cover the six pairs that interact (E×S, E×D, C×S, A×T,
P×D, T×C). Holding the economy fixed and moving only supply, labour and the year gives 36
distinct economy paragraphs out of 36; 400 random world-line/year samples give 400 distinct
passages.

**Per-YEAR variation (2026-08-16).** The paragraphs varied by SPAN — four states across 74 years —
so a fixed world-line read identically for up to nine consecutive years. Three continuous sources
now: `crossingClause` places the year against this line's own capability crossings ("reached
superhuman coding in 2032, one year ago; automated AI research is two years ahead, in 2035"),
`rateClause` puts a five-year rate beside every level, and `MARKERS` is a calendar of dated
commitments already on the public record. **Holding one world-line and moving only the year gives
75 distinct passages out of 75.**

`MARKERS` runs in **four lanes**, one per paragraph that takes a marker — supply and law into
build-out and governance, capital into capital and employment, oversight into oversight and public
opinion. At 2027 all four fire. The record thins after 2030, so the later lanes are empty and
those years say nothing dated. Two rules govern an entry: **it stands alone**, because only one
entry per lane is ever drawn and a sibling it refers to is never beside it; and **it carries its
own date with no deictic words**, because a retrospective prefix would have to agree in tense with
an entry it cannot see. **The headline is composed the same way** — every clause keyed on a position AND the
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

Last sweep: **23 cases · 16,410 lettering marks · 0 collisions · 0 off-section · 0 overflows ·
control passes** (2026-08-16, run against the live build). Full pass over every section: ~18 ms.
Effect recalculation on a setting change: 22 ms, cached per setting.

**Verify a deploy in a browser that is not holding the old `index.html`.** After the 08-16 push
`curl` read the new stamp while the Playwright tab still ran the previous build and reported the
previous drawing. A cache-busting query on the URL settled it.

## The morning plate carries two dates, and they are not the same date

`date` is when the engine applied the evidence; `event_date` is when the development happened. Every
row on one morning shares the first, so only the second can order them — and the parent's array is
not ordered by it. The revision cloud ringed the last array element and the caption called it the
newest: wrong on three of the nine mornings in the window, and on 2026-08-16 it ringed a working
paper nine days old while that morning's own development sat unringed below it. The ring now takes
the row ranked highest on `(date, event_date)`, every row letters its `EVENT` date so the ring is
checkable, and the caption states the rule it follows. `delta.json` is a **rolling window of 40
entries** — every count drawn from it is a count over the last 40 applications. See
[`Research/nightly-2026-08-16.md`](Research/nightly-2026-08-16.md).

## The morning plate letters what a position MEANS

A row reads `A.A3 +0.04pp · tractable with effort`, the name taken from the registry the parent
emitted. It lettered the bare key until 2026-08-15, which meant the plate whose whole job is
letting a reader check an application against its driver could not be checked: a lab **raising**
its misalignment risk estimate moved the model **toward** alignment being tractable, and nothing
on the sheet showed it. The plate also grows with the day's application count now (cap 8, then the
fold note), and `column()` shrinks a label to fit and marks its own cut rather than dropping
`wrap()`'s later lines — that silent drop lettered one sight glass `C ·`. See
[`Research/nightly-2026-08-15.md`](Research/nightly-2026-08-15.md).

## The lookback states its own span

The drift comparison is picked **by date**, never by row count, and every label letters the
span it actually measured — `(+3.3pp in 14 days)`, `WEIGHT AND ITS 14-DAY DRIFT`. The history
began 2026-07-31, so it is short of the 30 days the lookback asks for, and it carries a
**duplicated date** (`2026-08-13` twice, from the r3 re-set), so the nth row back is not n days
back. Until 2026-08-30 these read under 30 and that is correct. See
[`Research/nightly-2026-08-14.md`](Research/nightly-2026-08-14.md).

**The gap on the dials is mostly the r3 re-set, not the world.** 2026-08-13 drifted 0.869
against a typical night's 0.010, and it sits inside the window. The instrument cannot yet
distinguish a prior change from a world change; a registry channel beside `evidence` and
`grounding` in `delta.json`'s `moved` field is the proposal, held.

## The evidence programme

`Research/` holds a dossier per axis, two rounds deep. Read `Research/REGISTER.md` first, then
`findings/recommendations.md` and `findings/round-2-addenda.md` — the round-2 figures are the
standing ones. **26 prior changes and 6 structural proposals, held for review; none applied.**
The client mirrors them in `RECOMMEND` in `app.js`, which is this project's own research output
and never touches the network.

Round 3 is done. [`interactions/round-3-edges.md`](Research/interactions/round-3-edges.md)
sizes three of the four missing edges with multipliers and shows the fourth cannot be sized:

- **`T|S`** — under a constrained build-out, effective compute growth falls to ~60% of baseline,
  stretching the capability doubling from 212 to ~350 days and moving month-long autonomous work
  from 2030–31 to 2033–35. A shift from T2/T3 into T3/T4 from the supply variable alone.
- **`D|E`** — 88% of US routine job losses fall within twelve months of a recession, and never
  recover. The model carries only the opposite arrow. Adding this closes a feedback loop with
  the existing `E|D`, so it must be applied once per sample in a stated order.
- **`D|T`** — sized and small. Capability moves diffusion weakly; the 2.8%-against-15% gap is
  the size of what it cannot move.
- **`P|C`** — cannot be sized. Gilens & Page and Bashir disagree about exactly this quantity,
  so the edge stays out and the sheet says why.

## Open

- **[G13](Research/findings/gaps.md): an evidence rule matches on event TYPE and cannot read the
  finding's DIRECTION.** Every `ev-safety-research` application applies the identical vector — A3
  up, A1 down — across drivers that are mostly adverse; 14 distinct incidents across the 08-15 and
  08-16 windows, one sign pattern. A3 has risen on every night it moved since the r3 re-set, and E1
  likewise. The fix is the parent's, and the recommendation is a direction term or a symmetric
  widening of A. Held.
- The A axis (alignment outcome) reports NO MEASURED EFFECT BY 2040 on all four positions. That
  is true of the model as built — nothing downstream in `tracks()` reads A, and no conditional
  links it to T. Whether that is a modelling gap or a property of the axis is worth a look in
  the Atlas.
- **Six structural proposals stand unimplemented**, because they are changes to the parent
  Atlas: split the three axes that mix magnitude with incidence, add the four missing edges,
  re-cast P3 as elite–public divergence, give D an incidence sub-axis, give E a correction-channel
  sub-axis, and damp compute growth under S3 by an observed refusal rate.
- The `driver` field arrives from the parent cut at 140 characters. The sheet marks the cut with
  an ellipsis; lifting the cap is a change to the Atlas emitter, which this project does not
  make.
- `plain()` drops the clauses in the parent's variable descriptions that name a source document,
  so the controls describe what a variable does and Method carries the provenance. If the parent
  changes how it writes those descriptions, check the filter still re-punctuates cleanly.
