# The chronicle plan — the likeliest path told as a dated sequence, and a model that reaches 2100

**Revises** [`review-2026-09-01.md`](review-2026-09-01.md) after August's reading of it. Findings F1
to F7 and the six defects stand. Principles 2 and 4 of that review (a probability in every
sentence, forecast register throughout), the variable-by-variable block layout and the 2035 mock
are withdrawn. The premise now is his: **the sheet depicts and describes the likeliest path in
concrete, material terms**, in the register of the 2026 record headline. Probabilities and dates
ground it; they are the instrument's business, and they appear where the instrument for them
is. Nothing here is applied.

`ai-2027.com` and `ai-2040.com` were unreachable from this session (the egress proxy blocks
both), so the reading below is of the wiki's raw captures, `Raw Sources/AI 2027.md` and
`Raw Sources/AI 2040 - Plan A (2026-07-09).md`, and of the wiki's pages on them.

## 1 · What the two references actually do

Both are one path, told as if it happened, in dated sections. AI 2027 runs month by month —
"Late 2026: AI Takes Some Jobs", "February 2027: China Steals Agent-2", "July 2027: The Cheap
Remote Worker" — and AI 2040 year by year: "2027: The Writing on the Wall", "2028: AI on the
Ballot", "2029: Choose a Path". The prose is concrete because each period is an *event with
consequences*, and the next period follows from it:

> The stock market has gone up 30% in 2026, led by OpenBrain, Nvidia, and whichever companies
> have most successfully integrated AI assistants. The job market for junior software engineers
> is in turmoil: the AIs can do everything taught by a CS degree, but people who know how to
> manage and quality-control teams of AIs are making a killing. … there is a 10,000 person
> anti-AI protest in DC. — *AI 2027, Late 2026*

> America has two workforces now. The first is people, 165 million of them. The second is AI
> agents: millions of copies spun up and shut down every hour, working around the clock at
> superhuman speeds. Most of their work is slop. But enough of it is good that people are
> paying ten billion dollars a month for AIs that can, in theory at least, do anything on a
> computer that an employee can. — *AI 2040, 2027*

Four things to take from them, and one to leave.

1. **The unit is the dated event, and events cause each other.** Agent-2 is trained, so China
   steals it, so security tightens, so the algorithmic breakthroughs happen inside a locked
   programme. Concreteness comes from sequence. The present sheet's concreteness is decorative
   and simultaneous: a vignette keyed to a static position, next to another vignette keyed to
   another. That is the whole difference between compelling and incoherent.
2. **Quantities sit inside the narrative in units a reader knows** — 30% on the stock market, a
   10,000-person protest, $10 billion a month, 165 million workers, "OpenBrain has a net
   approval of −35% (25% approve, 60% disapprove, and 15% unsure)". The 2026 record headline
   already writes this way.
3. **Reasoning and probability live in footnotes and supplements, and a dashboard sits beside
   the text.** AI 2027 keeps "we forecast that they score 65%" and "Why only 4x? It's our
   uncertain best guess" in the margin, and its side panel carries the date, the capability
   level, compute and copies × speed. The sheet has this shape already: instruments left, chart
   middle, controls right. The prose should stop trying to be the dashboard.
4. **Branches are labelled.** The Race and Slowdown endings, and Plans A to D and S, are the
   model's A and C axes told as stories. The sheet's Alternatives plate should be its branches.
5. **Leave the invented names.** OpenBrain, Agent-3 and DeepCent are fiction's licence. This
   sheet is grounded in a wiki of the record, and AI 2027's own grading exercise (February 2026,
   "roughly 65% of the pace") shows what a named, checkable prediction buys. Actors come from
   the registry and the wiki; the future gets roles, never invented names.

## 2 · The design: a chronicle, one composer for record and forecast

**The likeliest path is a sequence of dated events the model generates. The readout at a year
is the chronicle of that path up to that year — what happened, when, what it established —
and the state of the world as the quantities describe it.**

The sheet already contains the right machinery, on the wrong side of TODAY. `record.js` holds a
ledger of dated entries, each `{y, lane, k, t, m}` — the year, the lane, a key, what happened,
what it established — and `describeRecord()` and `headlineRecord()` compose the passage and the
headline from it. That is the composer. The forecast side should be the same composer run over
a ledger the model emits for the likeliest path. The seam at TODAY leaves the prose, and the
2026 headline's register carries forward because it is the same code.

### The ledger of a path

For a sampled path, in order of date:

| kind | source in the model | example on today's likeliest path |
|---|---|---|
| **milestone** | the capability path's crossings of the ladder and of the eight domain thresholds (`engine.domains`) | superhuman coder 2029 · research loop 2031 · generally superhuman 2033 · ceiling 2036 |
| **event** | the instantiated templates (`instantiateJS`; 38 templates today, with windows, requirements, probabilities, citations) | capex correction 2026.9 · agent incident 2028.7 · copyright settles 2029.1 · preemption fight 2029.7 · Europe's leverage moment 2030.9 · labour constitution 2033.5 · bio century 2046.4 |
| **onset** | each position's date of coming into force: already in force (R4's release gate, June 2026; C1's controls), dated by a template (E3 by the correction; A2 by the first incident), or by a track threshold (D2 when employment first reads 5% below 2026) | E3 onset 2026.9 · A2 onset 2028.7 · D2 onset 2032 |
| **threshold** | a track crossing a level with meaning in the world's units, compared with 2026 | AI revenue passes worldwide semiconductor sales, 2031 · installed compute passes half of United States generating capacity, 2035 |
| **calendar** | dated commitments on the record (the present `MARKERS`, widened) | the EU's product high-risk rules apply from 2 August 2028 |

Every entry carries `t` (what happens), `m` (what it establishes), `cites`, and `src` — the
template, position or track it came from. The `t` and `m` text is authored **once per template
and once per position**, with slots for the year and the quantities, in the register of the
record: named actors, figures, dates. Sequence comes from the model's windows and `req`,
causation from the templates' effects, and neither from prose. Positions stop being eternal
states: the correction is an event of late 2026, so at 2077 it is fifty years old and the
chronicle either says so or says nothing. That single change removes the Delaware bankruptcy
judges from 2077.

### The readout at a year

**Headline** — blue, five or six sentences, the same construction every day, every clause from
the ledger or the tracks:

1. Capability, dated: the most recent milestone and how long ago, and what systems do now, in
   the ladder's own words rewritten as work.
2. Money and build-out: installed compute and AI revenue with their 2026 comparisons, and the
   capital condition as the dated event that set it.
3. Work: employment against 2026, and the labour event if one has happened.
4. Who decides: the coordination and rule-making positions in force, named by what they do, and
   the most recent law or geopolitics event, dated.
5. The public: the approval figure and what the public-response position means on the ground.
6. When one falls within about three years of the date: the year's own headline event, with
   what it established.

Under it, one line in pencil, the only place the headline's probability appears: "The
likeliest of 2,000 sampled paths. Two-thirds of paths have crossed the research line by 2035; a
fifth never do. The spread is the blue band."

**The passage** — the chronicle, chronological, which is how both references read:

- **Since 2026.** The ledger between the record and the date, in order, each entry's `t` and
  `m`; the two most recent per lane in full, earlier ones as a dated clause ("the copyright
  question settled into licensing in 2029"), entries older than about fifteen years dropped
  unless they set a standing condition.
- **Now.** The standing conditions — each position in force, described by its own registry
  criterion — and the quantities, in world units, each beside a 2026 comparison and a five-year
  rate.
- **Ahead.** The next entries on this path with their years: "the research loop closes in 2031
  on this path; the EU's product high-risk rules apply from August 2028; the compressed century
  in biology opens in 2046." This is what makes the passage a forecast, and it is the one thing
  the record cannot do.

Coherence falls out: an event is stated once, at its date, and referred to afterwards by date.
Per-year variation falls out: the ledger grows, the numbers move, the "ahead" list shrinks.
Repetition is bounded by rule: an entry appears in full while it is recent, then as a clause,
then not at all. Past the last ledger entry on a path the chronicle stops and says so — no
stage-six vignettes — until the model programme (section 3) gives the far decades a ledger.

### Register

- Every sentence carries a `src`: a ledger entry, a track value, or a registry criterion. The
  gate refuses a line without one. This replaces most of `prose_gate.py`'s style rules, which
  were policing the symptoms of unsourced prose.
- Named actors are the ones the source names. No invented named actors, no invented staffing.
- Every event carries a date; the composer computes "four years ago" and "ahead".
- Quantities in world units with a 2026 comparison, as the standing rule already says.
- Tense: past for what the ledger has, present for standing conditions, future for "ahead".
- No model vocabulary. "Milestone" for rung, "path" for line, and no span, stage or index.

### The mock, composed from today's model's own ledger

2035 on the likeliest path (`T2·K1·A2·C1·R4·D2·S1·P3·E3·L4·G4`; ledger and tracks from
`mainline.json`; sources in brackets, which the sheet would carry as marks, never as text):

> In 2035, frontier systems have run the AI research loop without human researchers since
> 2031, two years after they passed the best human engineers at software, and the interval was
> the shortest any forecasting group had priced. [milestones 2029, 2031; K1] The valuation
> correction of late 2026 wiped out AI equity and left the build-out standing: installed AI
> compute is about 630 gigawatts, half of United States generating capacity in 2026, and AI
> revenue runs near $5.8 trillion a year, comparable to the global automotive industry. [event
> bubble-correction 2026.9; E3; tracks gw, rev] Employment is 8% below its 2026 level, and the
> wage-insurance and dividend schemes legislated in 2033 are the first national answer to it.
> [tracks jobs; event labor-constitution 2033.5] Washington and Beijing each run their own
> compute stack under their own export controls, and the release gate the executive branch set
> in June 2026 still decides when a frontier model ships. [C1; R4] Approval of AI stands at 37%,
> and planning boards refuse projects that national policy favours, one county at a time.
> [tracks appr; P3]
>
> *The likeliest of 2,000 sampled paths. Two-thirds of paths have crossed the research line by
> 2035; a fifth never do. The spread is the blue band.*

Then the passage's "Ahead": "On this path the ladder's top is reached in 2036, and the
compressed century in biology opens in 2046, clearing major disease families decades ahead of
the prior trend."

The same year composed today reads: "By 2035, AI is wrong in ways that surface after a plant
is built or a trial finishes … Tenants refused a lease by an unlisted scoring tool must sue in
housing court … School districts that miss the August procurement window teach a whole year
without tutoring capacity." Every clause of the mock above is in the model; none of the
current headline's is.

And 2077 on the same path, to show what the far decades have today:

> In 2077 the research loop has run without human direction for 46 years. The compressed
> century in biology that opened in 2046 cleared the major disease families decades ahead of
> the prior trend. Since 2056 the central political question has been allocation among
> abundant options. Digital persons have held legal standing in several jurisdictions since
> 2067, and population statistics carry a second column.

Three entries in forty years and no quantity the tracks can be trusted for — revenue, employment
and the agent count have all sat at their caps since the 2040s. That is the honest state of the
far future on today's model, and it is the case for section 3.

### What is retired, what is kept

Retired: HEADCL, FRAG, RUNG_SHORT, CROSS, ECON, ECON_MOD, TENSION, PAIRS — 2,400 of the 2,897
authored strings, the hash rotations, the stage clock. Kept: `record.js` and its composer,
`MARKERS` (widened into the calendar lane), `PROCESS` (its cadences become effects on events),
`LONGFORM` (the position entry that opens on click, where the best of the retired vignettes may
live, marked as illustration). Authored anew: `t` and `m` for every template (38 today, ~120
after M2) and a criterion sentence per position per era (61 today).

## 3 · The model programme — a forecast that reaches 2100

The chronicle can only be as good as the ledger, and the ledger past 2040 is thin because the
model is. The registry defines its positions through 2050; 25 of the 38 templates open before
2030, six in the 2030s, four in the 2040s, three after 2050; the ladder saturates at 6.0 and
the median reaches it in 2043; every track is a compounding rate with a hard cap, and by 2077
revenue, employment and the agent count sit at their caps on every sampled path. Seven
changes, each a registry decision with its own changelog entry and self-test under the standing
rule, in the order that unlocks the chronicle.

**M1 · Positions become processes with onsets.** Every position gets an `onset` rule — in force
now, dated by a template, or dated by a track threshold — and the engine emits the onset per
path. Small, and it removes the eternal-state defect that produced most of F3 and F4.

**M2 · The ledger is an emitted object.** The engine emits, per path, the dated ledger of
section 2, for the mainline, the exemplars and the ensemble. Every template gains `m` and slots.
The library grows from 38 to about 120 across all eras, each cited to the wiki, and templates
gain *effects* — an agent incident raises the statute rate for some years, a correction cuts
compute growth, a deal shifts the capability path. Three such effects already exist (the A2
shift, the C3 pause, `{survives}`); effects are what make the chronicle causal rather than
listed.

**M3 · Eras, each with its own variables — the extension to 2100.** The eleven axes are the
*arrival* era's questions: how fast, how controlled, who coordinates, who pays, who decides.
Two further registries, with dossiers per axis under the programme's five questions, priors
from the scenario literature and from base rates, and edges from the earlier era carrying the
conditional structure:

- **Transformation** (from the research crossing to a settlement, roughly the 2030s to the
  2050s): the control outcome at takeoff (kept, paused, contested, lost — from A, K, L, C); the
  growth regime (normal 2 to 3%, fast 5 to 10%, explosive above 20% for a decade, stagnation or
  collapse — from D, E, S, G); the political settlement (broad distribution, bloc duopoly,
  single-actor concentration, successor system — from C, R, L, P); the physical transition
  (compute, energy and robotics build-out against modelled ceilings — from S, E and the
  robotics domain); human welfare (G carried forward).
- **Settlement** (2050s to 2100): who governs (institutions, hybrid, successor); what people do
  (work optional, employment persists); biology (ageing treated for whom); off-world industry;
  the state of any limit (holds, lapses, broken — the `PROCESS` figures already hold the base
  rates: five inspection agreements dying at a median near thirty years); population.

Transitions carry dates: the takeoff length from K, the settlement date sampled from the
transformation regime. Each path becomes a dated trajectory to 2100. Daily evidence moves the
arrival era's marginals as now; the later eras move through edges and the weekly review, and
the sheet says so in the Method section. Base rates matter here more than scenarios: growth
regimes after general-purpose technologies, institutional durability, arms-control lifetimes.

**M4 · Tracks become era dynamics with physical ceilings.** Replace the hard caps with
logistics against ceilings that are themselves variables of the physical-transition axis.
Revenue as a share of world output under the growth regime; employment as the machine share of
work with a re-employment term, so "35% below 2026, flat for forty years" becomes a trajectory
with a settlement level; approval mean-reverting to a level set by welfare and the settlement,
shocked by incidents; compute as an S-curve against grid and fabrication growth, able to *fall*
after a correction or a halt; copies × speed bounded by compute rather than frozen at 43.9
million at 1,000× from 2040. Emit p10, p50 and p90 per year for every track across the
ensemble, as the bands do for capability.

**M5 · Continuous capability under the ladder.** Keep the ladder as the milestone scale the
chronicle names, and add measured series beneath it that keep moving: METR-style time horizon
in hours for the arrival era, and after the crossing an effective research throughput (the
agent-collectives instrument, bounded by M4's compute) and a domain-coverage fraction. These
give the far chronicle quantities and the Instruments tab readings past 2040.

**M6 · The likeliest path named as an object.** Today's mainline is the joint argmax over 121
million cells, and it differs from the per-axis modes on four axes (the modes are R2, S3, P2,
G2; the argmax holds R4, S1, P3, G4, because the edges favour them jointly). Say which is drawn
and why. The better object for a chronicle is the ensemble's **medoid** — the sampled path
closest to all the others — because it is a real sample with a real ledger, where the argmax
cell may have been sampled once or never. Recommend the medoid, lettered as such.

**M7 · Branches.** The Alternatives plate becomes the branches plate: from the likeliest path,
the divergences where one axis flips and the ledger changes most — the model's own Race and
Slowdown — each captioned in words with its weight. That is AI 2027's grammar generalised.

## 4 · Plan

Each phase ships alone and leaves the sheet publishable. P1 to P3 are this project's; P4 is the
parent's, under the standing rule, and the chronicle improves as each of its parts lands.

| phase | work | size | acceptance |
|---|---|---|---|
| **P0 · fixes and gates** | the six defects of the review; a provenance gate that refuses a composed line without a `src`; a sanity gate on quantities (compute against world generating capacity, revenue against world output, employment against the record) that refuses the publish | ½ day | gates run in `build_site.py` |
| **P1 · the chronicle on today's model** | `web/js/ledger.js` builds the ledger for a path from `mainline.json`, `exemplars.json` and `engine.json` (milestones, events, onsets by rule, thresholds, calendar); `headline()` and `describe()` replaced by the record composer generalised; `t` and `m` authored for the 38 templates and a criterion sentence for the 61 positions; the eight vignette tables retired | 3 days | the 2035 mock reproduces from the module; holding a path and stepping 2027 to 2050, every year's passage differs by ledger content and no entry appears in full more than three years running |
| **P2 · layout** | headline and grounding line; the passage in Since / Now / Ahead across the three columns, the existing partition balancing them; a provenance mark per line; `auditSweep()` clean | 1 day | reader test below |
| **P3 · horizon, interim** | the slider stays to 2100; past a path's last ledger entry the passage stops and letters the year the ledger ends; the "why the river has this shape" explainer gains the saturation sentence | ½ day | no quantity lettered past its cap |
| **P4 · the model programme** | M1, M2, M6 first (they unlock the chronicle on the arrival era); then M4 and M5 (credible quantities to 2100); then M3 (the eras, with dossiers); then M7 | M1–M2 one week · M4–M6 one week · M3 three weeks of the evidence programme · M7 two days | each a registry version with changelog and self-test; the far chronicle at 2077 carries at least one entry per decade and a quantity per track with a spread |
| **P5 · plates** | branches plate; the controls' per-axis readouts; the research rows re-keyed or withdrawn; the drift baseline | 2 days | coverage and counts gates pass |

**Reader test**, from the head of the forecast tab alone, at any year: can a reader say what has
happened on this path and when, what the world looks like now in numbers they know, what comes
next on this path and when, and, from the line under the headline, how likely this path is
against the others? On the present sheet the answer is no to all four; the 2026 record answers
the first two.

## 5 · What I would still push back on

- **Concrete is not the same as invented.** August's brief is concrete and material, and the
  mock above is; what it gives up is the Oslo radiographers. If the far decades come out
  thinner than the vignettes made them look, that is the model being honest, and the remedy is
  M3, not more authored colour.
- **The far future needs its own variables, not more prose.** Extending to 2100 on the arrival
  era's axes cannot work; the positions are defined through 2050 and the ladder ends. M3 is the
  price of 2100, and it is a research programme, not a rewrite.
- **The likeliest path should be a sampled one.** The argmax cell is a point in a space of 121
  million; the medoid is a path the model actually produced.
