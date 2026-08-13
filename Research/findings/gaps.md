# Gap register

Structural gaps in the model that research has exposed. Each entry names what is missing, what
evidence says it should be there, and what it would take to close.

A gap stays open until it is either closed in the parent Atlas or explicitly accepted with a
reason. This project does not change the Atlas; it produces the case.

---

## G1 · Compute supply gates capability, and no conditional says so

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
