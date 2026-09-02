# AI Futures Forecaster — live state

**2026-09-02, night, later: P5 is in — the plates.** Every plate the plan named now reads
the r9 emission, and the last authored table is full.

- **M7 · BRANCHES FROM THE DRAWN PATH** replaces the alternatives plate. Twelve panels; on each,
  one variable takes another of its settings and the ledger of dated events changes most.
  `ledgerDiff()` in `ledger.js` scores a branch against the drawn path — the research and coding
  crossings moved, the events gained and lost, and the 2050 quantities — and `branchCaption()`
  letters it: "The research crossing moves from 2034 to 2043. This branch gains the quiet decades
  of infrastructure in 2035 and the long stagnation in 2059. Sales of AI services in 2050 are
  $20.8 trillion a year against $26.7 trillion on the drawn path." The weight beside each is the
  share of sampled futures holding the setting. Today's ranking: C8 (halt), T5, T4, D4, T1, C3,
  S2, D3, T2, A2, S1, E4. **A branch's events are a counterfactual of the drawn path's own
  ledger** (`branchEventsJS` in `engine.js`): where a template's requirements hold on both lines
  the drawn path's draw stands, a crossing-tied year moves with the crossing, and only a template
  the branch newly qualifies for gets a fresh draw. Pressing a panel makes the branch the active
  line through the whole document (`state.branch`, hash `&branch=`; the chronicle composes it);
  pressing it again releases it. Its note letters the axis by name, what changes against the
  drawn path, what the drawn path holds, and the position's grounding.
- **The controls read their natural quantity.** K reads the gap between the coding and research
  crossings (K1 −1.3 y to K4 +2.7 y), G reads AI revenue in 2040, and L, which no track reads,
  prints its strongest network edge ("STRONGEST EDGE R1 ×0.75"), since the sampler is where L
  acts. `EFF_PRIMARY` names each axis's quantities and `EFF_READ.gap` computes the gap under the
  same common random numbers as the rest.
- **The research rows are keyed to the live registry.** `web/data/registry-covered.json` carries
  `researched`: the 26 r4 keys the evidence programme was written against, each mapped to the r9
  position that carries its meaning (T4→T5, A2→A3, A3→A5, A4→A6, C5→C8, D1→D4, D3→D1, P1→P5,
  P2→P1, P3→P4, E2→E3, E3→E4, E4→E5) or to nothing where no live position does (C3, C4, S3). The
  research tab letters each row's destination — "T4 NO SC IN WINDOW (R4) → T5 METHOD ASYMPTOTE",
  "C3 VERIFIED DEAL (R4) · WITHDRAWN" — and the coverage gate refuses a destination the registry
  does not carry. A dossier keeps its own key.
- **The drift baseline is the date the position space last changed**, `space_since` in the same
  file (2026-08-20, r7). The instrument column reads "SINCE 2026-08-20, WHEN THE POSITION SPACE
  LAST CHANGED" and the dial caption says the same; the lookback used to run from the last
  nightly, so a rebuild read as drift.
- **Method carries THE NUMBERS**, read from the emission: the ensemble of 2,000 lines, the
  medoid's agreement, the 25 exemplars, the p10 to p90 bands, the horizon anchors and the
  ceilings in `engine.dynamics`. Nothing in the block is typed.
- **LONGFORM G1 to G6 is authored** from `Research/findings/r8-benefit-axis.json` — ECMWF's AIFS,
  Flood Hub, MASAI, the 1,524 FDA-listed devices, rentosertib, AlphaEvolve, the adenoma
  deskilling study, METR's 19%, the Kenyan entrepreneurs, MIT's 95% — and table coverage reports
  LONGFORM lacks none.

Two defects found on the way, both in the branch captions. A crossing the parent reports at the
horizon year is a rung never reached, so `buildLedger` nulls a crossing at or past `engine.y1`;
before that every halted branch "lost the coding crossing". And the two crossing-tied templates
move with their crossing, so `ledgerDiff` leaves them out of gained and lost; before that every
tempo branch reported them as events.

Verified: coverage r9 (11 axes, 61 positions); counts; prose (564 strings); port (30,000
values, 0 divergences); readout strict (0 faults); sweep 34 cases, control passes, 0 collisions,
0 off-sheet, 0 overflows. **Left for the next tranches:** M2's library growth to about 120
cited templates (the far decades of the drawn path are thin: every far-field template requires
A2 or A3 and the medoid holds A4), and M3's era registries.

**2026-09-02, night: P4's first tranche is in — the model programme, in the parent.** The
Atlas is on GitHub as `augustg97/ai-atlas`, so the work went where the plan puts it: registry
**r9-2026-09-02** on the Atlas branch `claude/ai-futures-forecaster-review-t7fvqb`, held for
August's merge, with its changelog entry and self-tests. **Merge order: the Atlas branch first,
then this one.** This client reads the r9 emission behind fallbacks, so it draws an r8 emission
too, but the r9 data files committed here come from a local emit of that branch and the nightly
overwrites them with whatever the Atlas's `main` emits.

What r9 does (`Research/timelines/worldlines.py`, `axes.py`, `forecast_emit.py`):

- **M1 · K reaches the capability path.** The coding crossing sits K's gap before T's research
  crossing (K1 0.75 y, K2 1.5, K3 3.5, K4 6.5; floor 2027.2); the published mainline said K1
  and drew 1.6 years, and the chronicle lettered "about three years after" beside "within twelve
  months". A gap that cannot fit (T1 or T2 with K4) is clamped and counted; the self-test bounds
  the share under a tenth of the ensemble.
- **M4 · tracks as dynamics against ceilings.** Compute grows logistically toward the share of
  world generating capacity (9,500 GW in 2026, 2.5% a year) its supply position can reach
  (S1 30%, S2 35%, S3 12%, S4 20%, S5 15%); revenue toward its diffusion band's share of a world
  output ($115T, 3% at trend) whose growth the benefit position lifts by up to 6 points, tapering
  to trend over forty years after the research crossing; the machine share of paid work toward
  the band's own ceiling with re-employment absorbing part of it over twelve years, so employment
  dips and settles; approval mean-reverts to the level its position sets, lowered by employment
  loss, raised where a verified limit holds; statutes saturate at 1,200; agent copies follow
  compute. E damps the growth excess of compute where the r8 form multiplied the growth factor
  and shrank compute 29% a year for seventy years on demand-crisis lines. The 76 nightly sanity
  findings are 18, all of them the ladder's top rung or a band's own ceiling. Every track has an
  ensemble band (`bands.json.tracks`, p10/p50/p90 over 2,000 lines) and two new series, `gwp`
  (world output) and `work` (the machine share), plus `hz`.
- **M2 · effects.** Templates carry effects: a correction cuts the compute growth excess by
  45% for three years, an incident shocks approval six points and speeds statutes, a labour
  statute raises re-employment for good. The registry carries `ONSETS`, moved from
  `narrative.js`, and the D bands are dated by the machine share (a tenth, a third, a half). The
  library is still 38 templates; growth to about 120 cited templates is the next tranche, and
  it is why the far decades of the drawn path are still thin (2050s and 2070s empty on the
  medoid: every far-field template requires A2 or A3 and the medoid holds A4).
- **M5 · the time horizon.** METR's 50% horizon in hours, anchored to the rungs (16 h at 2.6,
  one working month at 3.0, one working year at 4.0), emitted as `hz`; above the research rung
  it is no longer a measurement and NOW says so.
- **M6 · the medoid is drawn.** `mainline.json` is the medoid of the 2,000-line ensemble
  (`kind: "medoid"`, `agree` 0.30), the argmax carried beside it (`argmax: {wl, p}`). Today
  they differ on four axes: **T3·K1·A4·C1·R4·D2·S3·P3·E3·L4·G2** drawn, against the argmax
  T2·K1·A2·C1·R4·D2·S1·P3·E3·L4·G4. The band note letters both. `mainline_kind` in
  `engine.json` is the switch; a conditioned view draws the medoid of its own ensemble.

On this side: **`web/js/engine.js` is the port** (capPath, tracksJS, instantiateJS, onsets,
medoid) against the emitted constants with the r8 arithmetic as fallback, and
**`build/port_gate.mjs` (exit 8) recomputes the parent's emitted knots and tracks for the
mainline and 25 exemplars and refuses on any divergence** — 30,000 values, 0 divergences, the
crossings agreeing. The chronicle reads the emitted onsets and crossings, letters the year's own
shares ("8% of world output in 2050", "11% of the world's generating capacity in 2077"), the
spread of the sampled futures beside each quantity, the horizon, and world output itself; the
recorders draw the p10 to p90 band behind the pen; employment and approval that hold a value
read as settled, since they are equilibria. `{survives}` now follows the parent's rule (E2 and
E3). K and G have readouts on the controls.

Verified: gates strict, 0 faults; sweep 32 cases, 0 collisions; measure_repeat 74 of 74. The
comparison "about a tenth of world output" on the $12 trillion level now says "in 2026", since
world output on a path grows.

**2026-09-02, evening: P3 of the chronicle plan is in — the horizon interim.** The slider still
runs to 2100, and past a path's caps and its last dated entry the sheet says what it is
reading. `capState()` in `ledger.js` finds where each track of the active path stops — a track
that holds one value for eight years or more to the end of the run is at its cap — and where
compute passes the whole of world generating capacity (9,500 GW in 2026, 2.5% a year; the
readout gate carries the same figures). Past that year a quantity is lettered as a cap with the
year it was reached and never as a reading of the year: "Sales of AI services reached $30.0
trillion a year in 2045, more than a tenth of world output, where the model's revenue track
saturates"; "Employment reached 35% below its 2026 level in 2060, where the model's employment
track stops"; "From 2060 the model's compute track exceeds the whole of world generating
capacity in its own year and is not read past that point"; and, in NOW, "The capability index
has stood at 6.0, the top of its scale, since 2036; the ladder has no rung above it". The
recorders on the board and on the behaviour tab annunciate the same thing at the pen
(`30.0 · CAP 2045`, `22,832 · CEILING 2060`), the compute total and the agent tally carry it,
and a recorder's note gains a paragraph on what its track does on this path.

**Past the last dated entry the passage stops and says so.** The headline closes with "After
2075 the model dates nothing on this path"; SINCE collapses to one line naming the ledger's end
when every lane is empty; AHEAD reads "The ledger of this path ends in 2075. The model dates
nothing after it." The chart's caption now opens the band's own note: the parent's
`why_shape` explainer with its tempo slots filled, and a paragraph computed from the active
path on where its tracks stop and where its ledger ends — the saturation sentence the plan
asked for. The chart frame is now the date region its caption always claimed ("click the chart
to change the date" did nothing before); every mark on it still wins the hit-test by area.

**The readout gate refuses a quantity lettered past its cap** (`check_caps`): the composer
reports each path's caps with every composed year, and a present-tense reading of a capped
track past its cap is a fault. 0 faults over 294 composed years past a cap; provenance,
language and repetition unchanged at 0. The 76 sanity findings on the parent's tracks stay
reported and refuse nothing — they are the case for the model programme, P4.

**2026-09-02, later still: P2 of the chronicle plan is in — the layout.** The passage flows
across the three columns at group boundaries, so the columns end level however long NOW runs:
`proseColumns()` tries every set of cuts over the blocks (a group, with its section heading
when it opens the section) and takes the shortest tallest column, and a section that continues
in the next column carries its heading again in pencil, marked continued. The passage at 2035
went from 168 mm to 136 mm, with no column standing empty beside another. Measure and draw share
`blockRows()`. NOW reads in the same four lanes as SINCE (`AXIS_LANE` in `ledger.js`: T K A ·
C S · D E G · R P L), then the quantities; an axis the table does not know reads in the last
lane and its note says so.

**Every line of the passage is an item with its own provenance** — the ledger entry, criterion
or track it was composed from, and its kind — drawn as a mark in the margin (`PROV_MARK`:
◆ capability milestone, ▸ event on this path, ▪ a level a track passes, ○ a position in force,
▫ the calendar) with the key on the sheet under the headline's rule. Pressing a line opens its
note inside the column, under the line (`provenanceNote()`): which template the parent
instantiated and at what date, in the parent's own words, with its window, probability and
requirements from `engine.json`; which milestone the capability track crossed and when; which
position of the registry is in force and by what rule it is dated; the grounding behind it. The
readout gate now checks every line for a source and a kind (0 of 10,487 unsourced), and the
audit sweep opens three notes (SINCE, NOW, AHEAD) among its cases.

**The dated clauses August asked for.** Every template, milestone and domain text carries a
short dated form `s` ("The AI investment boom broke in 2026 and construction never stopped").
The headline keeps the capital event and the labour event for as long as they stand — in full
for three years, then in that form — so 2050 reads "The AI investment boom broke in 2026 and
construction never stopped" where it read the undated E3 criterion. SINCE draws the same form
for entries past their three years. A criterion in the headline whose position a rule dates
carries the year once the event that dated it has left the headline ("That began in 2031." /
"On this path that happened in 2028." / "That has held since 2030."); the gate treats these tags
as dated pointers to the sentence before them. The assembler's opening-word rule now moves a
date to either end of a sentence, so "The first wage-insurance programmes … became law in 2033"
before "The United States and China …" becomes "In 2033 the first …". A crossing that falls in
the year of the date reads "first ran" and "first exceeded", where it read "since 2031" in 2031.

**Both audit findings that predated P0 are fixed, and the sweep is clean** (30 cases, 29,526
marks, 0 collisions, 0 off-section, 0 overflows, `controlPasses: true`). The chart's label
allocator seeds itself with the rung labels, RECORDED and TODAY, tries every slot on both sides
and takes the least-overlapping one when none is clear — the old fallback took the first
in-frame slot regardless, which put two crisis labels on each other the moment the rung labels
were in the way. A note title wider than its block wraps and the block grows by the lines it
takes, with `sheetState()` adding the same lines from the same wrap; "COORDINATION BETWEEN
PRINCIPAL STATES" ran off the sheet before.

Gates at the commit: prose OK over 516 strings; tables OK; counts OK; readout gate strict, 0
faults over 374 composed years; `measure_repeat` 74 of 74 distinct headlines on the likeliest
path. `docs/` is untouched here; the nightly publishes it. Left for P3 to P5: the horizon
interim, the model programme in the parent, the plates.

**2026-09-02, later: P1 of the chronicle plan is in.** The forecast readout is a chronicle.
`web/js/ledger.js` builds the ledger of the active path — milestone crossings from the
capability track, the instantiated templates (ids recovered from the emitted text where the
parent gives none), each position's onset by rule, the levels the tracks pass, the dated
calendar — and composes the headline and the passage from it, the way `record.js` composes the
record. `narrative.js` is now tables only: `TEMPLATE_TEXT` (38 templates, each with what
happened, a dated clause for AHEAD, and what it established), `MILESTONE_TEXT`, `DOMAIN_TEXT`,
`THRESHOLDS`, `CRITERION` (61 sentences, one per position), `WORK_CLAUSE`, `ONSET` (29 rules),
`LADDER_NOW`, plus the kept `MARKERS`, `PROCESS` and `LONGFORM`. HEADCL, FRAG, RUNG_SHORT,
CROSS, ECON, ECON_MOD, TENSION, PAIRS and the stage clock are gone: 9,652 lines to 1,258,
2,897 authored strings to 467, every one of them keyed to a thing the model emits.

The passage is three paragraphs across the three columns — SINCE {Y−15}, NOW, AHEAD ON THIS
PATH — and the headline is a fixed construction: capability dated, the capital event and the
two figures, work, who decides, the public, the year's own event. The assembler enforces the
language standard's rule 4 on the composed output: at most one ", and" join and one semicolon in
a headline, twenty-eight words at most, no two neighbours opening on the same word (a dated
event sentence moves its date to the end). An entry appears in full for three years, as a dated
clause for fifteen, then leaves the lane; a condition still in force is carried by NOW with the
year it began.

**The readout gate is strict** (`build/readout_gate.py`, exit 7): provenance on every composed
group, the language standard over every composed headline, and repetition on the likeliest
path. It passes on the likeliest path at every year and on twelve exemplars every third year:
0 unsourced of 2,648 groups, 0 language faults in 374 headlines, 0 repetition findings.
`measure_repeat.mjs` reads 74 distinct headlines in 74 years. `READOUT_STRICT=0` drops it to
report mode, out loud. The 76 sanity findings (compute past world capacity in 2060, revenue
frozen at $30 trillion from 2045, employment at −35% from 2060) are the parent's tracks,
reported nightly and refusing nothing until P3.

What the chronicle shows about the model, now that it composes only what the model emits:
past 2050 the likeliest path carries three entries in forty years, and the far decades read
thin. That is the honest state (plan-2026-09-02 §3, the model programme). The alternatives
plate's captions, the branches plate and the controls' readouts are P5.

The audit sweep's two findings predate P0 and stand (below). `docs/` is untouched here.

**2026-09-02: P0 of the chronicle plan is in** ([`Research/plan-2026-09-02-chronicle.md`](Research/plan-2026-09-02-chronicle.md);
the review it answers is [`Research/review-2026-09-01.md`](Research/review-2026-09-01.md)).
The six defects of the review are fixed in `web/`; `docs/` is untouched here and the nightly
rebuild publishes it. What changed, and what to know:

- **CROSS lookups try both orientations** (`crossText`), so the three slots that never fired
  (C×S, E×S, T×C) draw where a pairing is written. On the likeliest path two are still
  unwritten, `E3|S1` and `T2|C1`; the readout gate reports them. HEADCL, FRAG and LONGFORM
  carry **K4** rows now. `build/table_coverage.mjs` reads the tables themselves and
  `coverage_gate()` refuses a position HEADCL or FRAG cannot letter; it reports LONGFORM
  (lacks G1–G6) and the CROSS pairs written, counting either orientation (A×T 20/35, E×D
  10/20, P×D 6/20, C×S 11/40, E×S 10/25, T×C 11/40).
- **Every path label is derived from the registry** (`lineLabel()`); the alternatives plate
  letters eleven axes.
- **A control button prints the quantity its axis drives** (`EFF_PRIMARY`), the first that
  moves; the tempo axes read the share of sampled paths past the research milestone by 2035.
  Under intervention only the axis's own quantities are consulted, so L and G letter NO TRACK
  READS THIS VARIABLE and A4/A5 letter NO DIRECT EFFECT; under observation any movement counts.
  **Fixing this exposed a common-random-number defect**: `gibbs()` skipped the uniform for a
  pinned axis, so every later draw slid by one and every G button printed the same −4pp
  under intervention, G having no outgoing edge and no track. A pinned axis now spends its draw.
  CLAUDE.md rule 15 is amended.
- **The research rows letter the r4 name** their figure was researched under, with a note
  under the heading; re-keying or withdrawal is held for the programme (P5).
- **The 30-day lookback never reaches behind the registry's date** (`registryDate()`), so the
  dials read 12 days against r8's 2026-08-20 rather than 30 days across the r5 rebuild.
- **`build/readout_gate.py` runs on every build, in report mode**: provenance per composed
  unit (100% unsourced until P1), the language standard's rules 1 to 4 over composed
  headlines (232 of 374 carry a fault today), and sanity of quantities (the likeliest path's
  compute passes world generating capacity in 2060; revenue is frozen at $30 trillion from
  2045; employment at −35% from 2060). `READOUT_STRICT=1` makes it refuse with exit 7; that is
  the setting from P1. `build/compose_sweep.mjs` is the composer run to order for it.
- **The audit sweep carries two findings that predate P0**, identical on the last published
  build: one chart-label collision at 2041 (GENERALLY SUPERINTELLIGENT against 12% NO
  SUPERINTELLIGENCE THIS WINDOW) and the axis-note title running off the controls column when
  the C axis's entry is open. `controlPasses: true`, 0 overflows. Neither is in P0's scope;
  both belong to P2's layout pass.

The parent rebuilt its registry twice on 2026-08-17 — `r5-2026-08-17`, then `r6-2026-08-18`.
Seven axes and 26 positions became **nine and 49**; two axes are new (**K** takeoff shape, **R**
regulatory architecture); and every position that kept its letter changed its meaning, four of
them to roughly the opposite. The authored layer was re-keyed against r5 (`1ed5580`) and r6
(`88609a9`) and the sheet publishes again. **The 26 researched figures in `app.js` were not
re-keyed** — see the finding below.

**2026-08-19: five authored SENTENCES were still asserting r4**, none of them keyed to a letter,
so the coverage declaration could not see them — `ALL 26 POSITIONS`, "Every position now carries
at least one source", two "a dossier stands behind each variable", and a block naming four network
edges as missing that the parent had already drawn. All five are corrected, the structural block
now derives from `S.network.conditionals`, and `build/counts_gate.py` (exit 6) refuses any authored
count of axes, positions, variables or dossiers that neither matches the live registry nor dates
itself. A letter inherits a new meaning; a quantifier inherits a new domain.

**2026-08-24: the registry moved and its version string held.** The parent's weekly schema review
added a fifth machine-made sub-axis — `D.watch-labor`, twelve unexplained labour and institutions
events in seven days — and emitted it under `r8-2026-08-20`, last night's version, with an
identical changelog. Axes held at 11 and positions at 61, because a sub-axis is neither, so
coverage and counts were both right to pass, and `axisNotes()` already files an `origin`-carrying
sub-axis under "provisional, awaiting approval". What went unsaid was that anything had changed:
the build's only registry statement was the version string. `registry_drift()` in `build_site.py`
now compares the emitted registry against the last committed copy — axes, positions, sub-axes with
their origin flag, conditional count — and prints what moved, calling out a content change under a
held version in those words. It refuses nothing; coverage still owns refusal. Fourth setting for
the same shape: **a surface reads a proxy and reports it as the quantity.**

**Live:** https://augustg97.github.io/ai-futures-forecaster/ · redrawn nightly, so the build
stamp here would be stale by morning (it was, by five days, until 2026-08-24). Read it from the
sheet: `curl -s https://augustg97.github.io/ai-futures-forecaster/ | grep -o '__BUILD = "[^"]*"'`,
and check something the build DRAWS beside it — `data/forecast/network.json` carries the registry
version and the date it was emitted. Registry as of 2026-08-24: `r8-2026-08-20`, 11 axes, 61
positions.

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
| Branches | alternatives | twelve branches from the drawn path, one variable moved on each, ranked by how much the ledger of dated events changes |
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
python3 build/build_site.py            # gate → pull → coverage → stamp → docs/
__FW.auditSweep()                      # console; REQUIRE controlPasses: true
```

**The coverage gate stands between the pull and the stamp.** `web/data/registry-covered.json`
declares which axes, positions and meanings the authored strings are keyed to; the build compares
the pulled registry against it and refuses on any difference. Restate the declaration in the same
commit as the prose that covers the new positions, never before it. Exit codes now separate the
four ways a night can fail: 1 the Atlas gate refused · 2 pull or extractor · 3 push or verify ·
4 the registry moved. They were all 1 until 2026-08-17, which reported a broken climate extractor
as a gate refusal and pointed the diagnosis at the wrong project.

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

## The researched figures are keyed to r4 letters (2026-08-18)

`RESEARCHED` and `PRIOR_R2` in `app.js` hold the evidence programme's 26 figures, researched
against the **r4** meanings. `recommend()` looks them up by letter and `sections.js` letters each
row with the **live r6 name** for that letter. Twenty-two rows draw; **thirteen attach a figure to a
letter that now means something else**, four of them roughly the opposite, and P1/P2 are a straight
transposition — the sheet says the programme recommended raising *acquiescence through use* to
0.380 when it recommended raising *populist backlash*. The heading still reads `APPLIED 13 AUG (r3)
AND 17 AUG (r4)`.

The crisis board has the same shape from the parent's side: `no-sc-window` draws **18% NO
SUPERINTELLIGENCE THIS WINDOW** off `T.T4`, which under r6 means arrival in 2037 to 2050, and
`deal-window` draws a dated transparency deal off C3, *Declaratory accord*. The band-keyed item
`researcher-by-2035` came through untouched, because a measured quantity survives a rebuild.

**A coverage declaration protects only what it declares.** It caught the authored strings through
two rebuilds in one night and did it correctly; the 26 figures were never in it. Re-keying them is
held — three have no clean destination and belong withdrawn rather than moved to the
nearest-looking cell. See [`Research/nightly-2026-08-18.md`](Research/nightly-2026-08-18.md).

## Open

- **[G13](Research/findings/gaps.md): an evidence rule matches on event TYPE and cannot read the
  finding's DIRECTION.** Every `ev-safety-research` application applies the identical vector — A3
  up, A1 down — across drivers that are mostly adverse; 14 distinct incidents across the 08-15 and
  08-16 windows, one sign pattern. A3 has risen on every night it moved since the r3 re-set, and E1
  likewise. The fix is the parent's, and the recommendation is a direction term or a symmetric
  widening of A. Held.

  **Sized 2026-08-22.** Across the whole 40-entry window: 11 rules, **11 sign patterns**, no rule
  has ever applied two directions. And because magnitude comes from the impact class while
  direction comes from the rule, one misdirected firing outruns a week of correct ones — the single
  `notable` application in forty (`ev-export-retaliation`, 08-21, `repeat_k 0.0`) contributed
  **2.400pp** of position motion against 1.127pp from nineteen `ev-capital-commitment` firings, and
  is 94.7% of the net `S.S3` move and 120% of the net `C.C1` move. The novelty floor damps
  repetition; nothing damps direction at magnitude. The addendum recommends conditioning the
  symmetric widening on impact class. See
  [`Research/nightly-2026-08-22.md`](Research/nightly-2026-08-22.md).
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
