# Gap register

Structural gaps in the model that research has exposed. Each entry names what is missing, what
evidence says it should be there, and what it would take to close.

A gap stays open until it is either closed in the parent Atlas or explicitly accepted with a
reason. This project does not change the Atlas; it produces the case.

---

## G1 · Compute supply gates capability, and no conditional says so — SIZED

**Closed as research, open as a change:** `interactions/round-3-edges.md` sizes the edge.
Under S3 the effective-compute growth rate falls to ~60% of baseline, which stretches METR's
212-day doubling to ~350 days and moves the one-month horizon from 2030–31 to 2033–35.
Multipliers are in that file.



**Opened:** 2026-08-12, from `dossiers/T-capability-tempo.md`
**Severity:** high — this is the model's most load-bearing missing edge

The T axis has **no parent**. Epoch AI's assessment of whether 4×/year training-compute growth
survives to 2030 names four binding constraints: **power, chip production capacity, data
scarcity, and the latency wall.** Three of those are exactly what the **S** axis represents.

So the model asserts that capability tempo is independent of compute supply, while the best
available evidence on compute scaling says the opposite. Under `S3` (constrained by controls and
energy) the physical route to T1 and T2 is materially narrower, and the network does not know it.

**To close:** a conditional `T|S` with S3 depressing T1/T2 and raising T3/T4, sized against
Epoch's power and chip-capacity ranges (1–5 GW single-site, 2–45 GW distributed, ~30M
H100-equivalents for a 2e29 FLOP run).

## G2 · No representation of a reliability ceiling

**Opened:** 2026-08-12, from `dossiers/T-capability-tempo.md`
**Severity:** high — it is the likeliest route to T3/T4 that involves no physical constraint

METR measures a 50% time horizon and an 80% time horizon. They currently double at the same
rate (212 vs 213 days) from very different levels. If the 80% series flattens while the 50%
series keeps climbing, capability continues to improve on paper and stops being deployable —
which produces slow tempo and slow diffusion **at once**, from one cause.

The model has no variable and no conditional that represents this. It would show up as
correlated T3/T4 and D3, and the model currently treats those as independent.

**To close:** either a sub-axis on T for reliability, or a conditional `D|T` carrying the same
mechanism. Needs a measured series first — the 80% horizon is published, so this is testable.

## G3 · D has no parent

**Opened:** 2026-08-12, from `QUESTIONS.md` structural audit
**Severity:** medium

Diffusion and labour depends on capability and on the economy, and the model says nothing about
how. T is at least defensible as a root; D is not.

**To close:** `D|T` and `D|E` conditionals, grounded in adoption base rates rather than in
scenario documents.

## G4 · The priors rest on a scenario-heavy base

**Opened:** 2026-08-12, from `findings/grounding-audit.md`
**Severity:** high — it is the reason this programme exists

**21 of 26 positions carry one citation or none.** 19 of 55 citations point at four scenario
documents. A prior derived mainly from another forecast inherits that forecast's errors without
inheriting its reasoning.

**To close:** a dossier per position, each answering the five questions in `QUESTIONS.md` from
sources that are about the world. This register tracks that work.

## G12 · Benchmark contamination — QUANTIFIED, severity downgraded to medium

**Opened:** 2026-08-12 · **Bounded:** 2026-08-13, `findings/round-2-addenda.md`

32.67% of successful SWE-bench patches involve solution leakage; removing leakage channels costs
3–7 pass@1 points; ~12% of tasks are contaminated for one frontier model; OpenAI's audit found
59.4% of its o3 failures were test flaws, and it recommends discontinuing the benchmark.

**Why this sheet is less exposed than that implies:** the T evidence is METR's time-horizon
series, built on human-timed HCAST and RE-Bench tasks. Its SWE-bench-derived component is
flagged by METR as likely *underestimating* shorter-horizon models, which biases the doubling
time shorter. **Followed through, the contamination argument is a small argument for LONGER
timelines**, not for a capability index that is too high.

Severity high → **medium**. The Method section should carry the numbers.

## G5 · The S axis conflates two variables moving in opposite directions

**Opened:** 2026-08-12, from `dossiers/S-compute-supply.md`
**Severity:** high — it makes the most likely actual world inexpressible

Data-centre **siting** is diversifying: sovereign clouds, Gulf capacity, second-tier hubs. Chip
**supply** is concentrating: one packaging process, one country, one buyer holding the majority
of 2026-27 capacity, no qualified second source before 2028.

Both are true at once. The axis has one position for "diversified" and one for "concentrated",
so it cannot say *capacity everywhere, dependency on one island* — which the 2026 record
suggests is where the world actually is.

**To close:** split S into siting and supply, or add a sub-axis for the chokepoint. Until then
S2's prior is carrying a story the evidence only half supports.

## G6 · The energy track ignores the interconnection queue

**Opened:** 2026-08-12, from `dossiers/S-compute-supply.md`
**Severity:** medium

`tracks()` grows installed GW from `COMPUTE_G` damped by a fixed economy constant. The 2026
record has **$162B of US projects blocked or delayed** and the first proposed statewide
moratorium. Refusal is a real, measurable rate and the model represents it as nothing.

**To close:** damp compute growth under S3 by an observed refusal rate rather than a constant.

## G7 · The labour effect is age-graded and the axis is not

**Opened:** 2026-08-12, from `dossiers/D-diffusion-labour.md`
**Severity:** high — and it propagates into P

Measured: **−13% entry-level hiring** in AI-exposed occupations within firms, concentrated in
**22–25 year olds**, with **statistically insignificant** effects on older workers in the same
occupations. Aggregate employment shows nothing.

The axis has three positions about how the effect spreads across *sectors* and none about which
*cohort* absorbs it. A world where the entry rung disappears and incumbents are untouched reads
as D2 in the model and as a crisis in the politics — and **P is downstream of D**, so the model
routes a political shock through a variable that cannot see it.

**To close:** a sub-axis on D for incidence (entry-level / broad / incumbent-protected).

## G8 · A pattern, not two bugs: the model cannot express "sharp and narrow"

**Opened:** 2026-08-12, from S and D dossiers together
**Severity:** high — this is a design finding

Twice now the record has shown two things being true at once that the model gives one axis:

- **S:** siting diversifying **and** chip supply concentrating
- **D:** entry-level hiring collapsing **and** aggregate employment flat

In both cases the model's positions are alternatives, so the true state is inexpressible and
gets rounded to whichever half is louder. The forecast then propagates the rounded state.

**Proposed:** wherever an axis mixes *magnitude* with *incidence*, split it. The design rule to
adopt: **one axis, one question.** An axis that answers "how big" and "where" at once will
always have a world it cannot say.

## G13 · An evidence rule matches on event TYPE and cannot read the finding's DIRECTION

**Opened:** 2026-08-15, from this project's own nightly pull
**Severity:** high — it moves priors monotonically, and the sheet drew it before it could say it

Two of the six applications on 2026-08-15 were `ev-safety-research`, and both applied the same
vector: **A3 "tractable with effort" +0.043pp, A1 "fails undetected" −0.021pp**. Their drivers:

- Anthropic **raising its estimate of the risk of misalignment** in high-stakes situations
- Anthropic's Frontier Red Team reporting a **swarm of 45 coordinating agents**

Both are adverse findings about alignment. Both moved the network toward alignment being
tractable and away from it failing undetected.

This is not two unlucky matches. **All 12 `ev-safety-research` applications on record in
`delta.json` carry the identical sign pattern** — `A.A3 +`, `A.A1 −` — across drivers that
include a lab unable to rule out critical risk, agents exploiting infrastructure, 272 experts
rating 24 risk domains, and agents colliding in multi-agent work. The one driver that plausibly
*does* support tractability (six published principles for safety auditing) receives the same
vector as the rest.

The mechanism: the rule matches on the event's **type** — that a safety-research item appeared —
and the type of a finding carries no information about which way the finding points. A rule
keyed on "safety research was published" will read a rising risk estimate as evidence that
safety research is working. The parent's matcher also sees only a truncated prefix of the item,
so the sentence that states the direction is frequently past the cut.

**To close (a change to the parent, held):** an evidence rule whose positions are ordered along
a *tractable ↔ intractable* dimension needs a direction term read from the finding itself, not
from its category. Failing that, the rule should apply a **symmetric widening** — raise the
uncertainty on A without moving its centre — since "a safety finding was published" is genuine
information about attention and none at all about outcome.

**What this project did about it:** nothing to the priors, which live in the Atlas. The morning
plate now letters what each position key MEANS beside its arithmetic, so a reader sees
`A.A3 +0.04pp · tractable with effort` sitting beside a driver about rising misalignment risk
and can judge the application against the development that drove it. The drawing's job is to
make the parent's arithmetic checkable; it could not do that while the positions were lettered
in the parent's internal keys.

### Addendum 2026-08-22 · the defect has a size, and one firing carries the board

Two findings from tonight's pull, both quantified over the full 40-entry window.

**The direction of an update never varies with the event.** 40 applications, 11 distinct rules,
**11 distinct sign patterns**. No rule has applied two different directions, ever. A rule's vector
is a property of the rule; the event chooses which rule fires and how hard, and nothing else.
Tonight added the cleanest pair yet: `ev-enforcement-action` applied one identical vector
(C1 −0.05pp, C4 +0.11pp) both to a $400m Justice Department settlement with TikTok and to a judge
**throwing out** seven economic espionage counts. Enforcement landing and enforcement collapsing
move *Coordination between principal states* the same way.

**Magnitude and direction are set independently, so a misdirected firing is not small.** Magnitude
comes from the impact class times the repeat damping; direction comes from the rule. The single
`ev-export-retaliation` firing on 2026-08-21 — the only `notable` in forty, `magnitude 0.008`
against a window median of `0.00045`, `repeat_k 0.0` so the r2 novelty floor damped it not at all —
contributed **2.400pp** of absolute position motion. Nineteen firings of `ev-capital-commitment`
contributed 1.127pp. It is 94.7% of the window's net `S.S3` move and 120% of the net `C.C1` move,
which are the board's two largest, and its driver is House ranking members asking the Commerce
Secretary to explain export-control policy.

The novelty floor guards **repetition**. Nothing guards **direction at magnitude**, and the two
compound: the rules that fire hardest are the ones that fire rarely, so they arrive undamped.

**This sharpens the recommendation without changing it.** A direction term read from the finding
is the fix. Failing that, the symmetric widening should be **conditioned on impact class** — a
`notable` firing is exactly where an unread direction costs the most, and exactly where the current
design applies the least damping. Held; the change is the parent's. See
[`../nightly-2026-08-22.md`](../nightly-2026-08-22.md).
