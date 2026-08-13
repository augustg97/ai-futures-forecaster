# Recommendations — held for review

**Superseded in part by [round-2-addenda.md](round-2-addenda.md)**, which closes the three
open questions and revises C3, D2, D3 and all four A positions. The round-2 figures are the
standing ones.

Every prior change the seven dossiers support, in one place, with the evidence that sizes it.
**None of these has been applied.** The priors live in the parent AI Atlas; this project
produces the case. Applying them is a decision, and it is August's.

## Prior changes

| axis | position | now | proposed | why |
|---|---|---:|---:|---|
| **T** | T1 explosive | 0.099 | **0.07** | requires the 212-day doubling to go super-exponential; the only evidence is a 2024-only subset METR declines to extrapolate from |
| | T2 fast | 0.302 | 0.30 | the central extrapolation lands here |
| | T3 gradual | 0.387 | **0.42** | reliability-adjusted (80%-horizon) extrapolation lands 2030–33 |
| | T4 no SC in window | 0.211 | **0.24** | four physical constraints on the compute chain, plus expert-survey mass past 2040 |
| **S** | S1 concentration | 0.327 | **0.35** | packaging chokepoint is *more* concentrated than fabrication |
| | S2 diversified | 0.417 | **0.33** | reads the siting story and misses the packaging one |
| | S3 constrained | 0.255 | **0.32** | $162B blocked, first statewide moratorium, 100% of 2026 CoWoS allocated |
| **D** | D1 shock | 0.190 | 0.17 | four years on, the aggregate effect is undetectable in CPS |
| | D2 uneven | 0.538 | 0.55 | the measured shape is exactly this |
| | D3 slow | 0.273 | 0.28 | the unresolved Danish contradiction |
| **E** | E1 boom | 0.289 | 0.26 | capex running years ahead of payback |
| | E2 correction survives | 0.428 | 0.44 | the only surviving bear argument is about *timing*, which corrects claims and not assets |
| | E3 deflates hard | 0.202 | 0.22 | ~$176B depreciation gap; Alphabet FCF −90% |
| | E4 demand crisis | 0.081 | 0.08 | its mechanism needs an aggregate labour shock that is not there |
| **P** | P1 backlash | 0.262 | **0.38** | **the largest change.** Restriction has cross-party majority support: 57–19 against preemption, 43% of Trump voters, 70% of Harris voters |
| | P2 acquiescence | 0.312 | 0.28 | |
| | P3 polarised | 0.426 | **0.34** | P3's own criterion is a partisan split; both coalitions are on the same side |
| **C** | C1 none / race | 0.402 | **0.36** | a great deal is happening; it is fragmented rather than absent |
| | C2 securitization | 0.264 | 0.27 | attempted 20 Mar 2026, not enacted |
| | C3 verified deal | 0.074 | 0.08 | |
| | C4 fragmented | 0.251 | **0.30** | 145 state laws against one federal law is the observed regime |
| | C5 moratorium | 0.009 | 0.01 | |
| **A** | A1 fails undetected | 0.116 | **0.15** | the mechanism moved from hypothesis to measurement |
| | A2 near-miss managed | 0.263 | 0.28 | the incidents were caught and published |
| | A3 tractable | 0.351 | **0.31** | headline results come from evaluations the subjects can recognise |
| | A4 untested | 0.270 | 0.26 | |

## Structural changes proposed

Ordered by what they would improve most.

1. **Split any axis that mixes magnitude with incidence** (G8). Three axes have the same fault
   and each produces a world the model cannot say:
   - **S** — siting diversifying while chip supply concentrates
   - **D** — entry-level hiring collapsing while aggregate employment is flat
   - **P** — a public united against its own government
   Design rule to adopt: **one axis, one question.**
2. **Add the four missing conditional edges** — `T|S`, `D|T`, `D|E`, `P|C` (G1, G3). T and D
   currently have no parents at all, and `T|S` is the most load-bearing missing edge in the
   model: three of the four published constraints on continued scaling *are* the S axis.
3. **Re-cast P3 as elite–public divergence** rather than partisan polarisation (G11), or add it
   as a fourth position. All three current positions describe left–right structure and the
   salient 2026 split is not left–right.
4. **Give D a sub-axis for incidence** (G7): entry-level / broad / incumbent-protected. P is
   downstream of D and the model routes a political shock through a variable that cannot see
   the age gradient carrying it.
5. **Give E a sub-axis for the channel of correction** (G9): equity / credit / capex. The
   distinction between E2 and E3 is mechanism, and it is currently carried by prose.
6. **Damp compute growth under S3 by an observed refusal rate** (G6) rather than a constant.
   $162B of blocked projects is a measurable rate that the model represents as nothing.

## What round 1 could not settle — all three now closed

See [round-2-addenda.md](round-2-addenda.md).

1. **International coordination.** Closed. Talks scheduled September 2026 at cabinet level; the
   industry itself asked for verification technology on 28 July 2026; the EU held its deadline
   against Meta, Google, ASML and Mistral. **C3 revised 0.08 → 0.12.**
2. **The labour contradiction.** Closed, and it *dissolves*: Humlum & Vestergaard measure
   incumbent wages and hours, Brynjolfsson et al. measure hiring of entrants. Both are the same
   world. **D3's round-1 increase is withdrawn; D2 rises to 0.57.**
3. **Benchmark contamination.** Bounded: 32.67% of successful SWE-bench patches involve solution
   leakage; removing leakage costs 3–7 pass@1 points; OpenAI has stopped reporting the
   benchmark. But METR's series is human-timed rather than issue-scraped, and its SWE-bench
   component biases the doubling *shorter* — so the contamination argument, followed through,
   is a small argument for **longer** timelines. **G12 downgraded high → medium.**

## The one remaining open question

Whether the four missing conditional edges (`T|S`, `D|T`, `D|E`, `P|C`) can be *sized* from
evidence rather than merely asserted. Round 3.
