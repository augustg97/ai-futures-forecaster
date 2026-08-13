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
