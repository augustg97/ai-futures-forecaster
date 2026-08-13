# T · Capability tempo — dossier

**Status:** first pass complete · **Confidence in the recommendation:** medium
**Researched:** 2026-08-12 · **Questions answered:** 1, 2, 3, 4, 5

The master variable. Every other axis in the model conditions on it, and the forecast band is
mostly its shape. Before this dossier the four positions rested on **6 citations**, four of
them to other people's scenarios.

---

## 1 · Base rate — what the measured trend actually says

The strongest evidence about the world (rather than about anyone's scenario) is METR's
time-horizon series: the length of software task, measured by how long human professionals
take, that a frontier agent completes autonomously at a given reliability.

| measure | value | source |
|---|---|---|
| 50% time-horizon doubling, 2019–2025 | **212 days** | METR, *Measuring AI Ability to Complete Long Tasks* |
| 95% bootstrap CI on that doubling | **171–249 days** (±19%) | same |
| 80%-reliability horizon doubling | 213 days — same within error, but the horizon itself is far shorter | same |
| 2023–2025 models, non-SWAA tasks only | 191 days | same |
| 2024-only models | ~3 months — METR states this is **not robust** for extrapolation | same |
| Extrapolated date of a 1-month 50% horizon | ~4.6 years from o1 (39 min, late 2024) | same |
| 80% CI width on that extrapolated date | **about 2 years** | same |

**The extrapolation, done explicitly.** A "superhuman coder" in this model's sense needs
roughly a one-month task horizon — about 8 doublings above o1's 39 minutes.

- at the central 212-day doubling → **mid-2029**
- at the fast end of the CI (171 days) → **mid-2028**
- at the slow end (249 days) → **early 2030**

That is the 50%-reliability horizon. Deployment-grade autonomous research is closer to the 80%
horizon, which doubles at the same rate from a substantially lower level — roughly two further
doublings, or **+1.2 years**, putting the reliability-adjusted date at **2030–2031**.

**This is a T2 result sliding into early T3.** T1 (2027–28) requires the trend to be
super-exponential. The 2024-only subset hints at that and METR explicitly declines to
extrapolate from it.

## 2 · Mechanism, and its weakest step

The chain is: training compute grows → capability on long-horizon tasks grows → coding and then
AI research automate. The weakest step is **the second**, and the binding constraint on the
first is physical.

Epoch AI's assessment of whether the ~4×/year training-compute growth can continue to 2030:

- training runs of **2e29 FLOP are likely possible by 2030**, with a range of 2e28–2e30
- that is roughly **10,000× GPT-4**, and requires about **30M H100-equivalents at 40%
  utilisation for three months**
- power: **1–5 GW** for a single-site run; **2–45 GW** for a geographically distributed one
- four constraints could bind first: **power, chip production capacity, data scarcity, and the
  latency wall**

So the compute needed for the trend to continue is *technically feasible* and not
*comfortably* so. Each of the four constraints is a live route to T3 or T4, and three of them
(power, chips, data) are the same quantities the model's **S** axis is about. That coupling is
real and the model does not currently represent it — see the gap register.

## 3 · What the record shows as of 2026

- Training compute has grown ~**4×/year**, ~10,000× since GPT-2, doubling every 6–10 months.
- The time-horizon trend has held for **six years across a capability range of many doublings**,
  which is a strong prior for continuation and a weak one for acceleration.
- METR has extended the method to **nine further benchmarks** (scientific reasoning, maths,
  robotics, computer use, self-driving) and finds **generally similar rates** — the trend is not
  an artefact of one task family.

## 4 · Resolution criteria

Each position is scoreable against the METR series, which is published and dated:

| position | resolves TRUE if |
|---|---|
| **T1** explosive | the 80%-reliability time horizon reaches one month **on or before 2028-12-31** |
| **T2** fast | it reaches one month in **2029–2031** |
| **T3** gradual | it reaches one month in **2032–2036** |
| **T4** continuous-normal | it has **not** reached one month by **2040-12-31** |

Interim checkpoints: the 80% horizon passing 8 hours, and passing one week. Both are readable
off the same series years before the question resolves.

## 5 · What would move these priors

| observation | direction | rough size |
|---|---|---|
| Two consecutive frontier releases whose 80% horizon doubles in **under 5 months** | T1, T2 up | large — this is the super-exponential case |
| A frontier release whose 80% horizon **fails to improve** | T3, T4 up | large |
| A **single training run above 1e27 FLOP** announced and completed | T1, T2 up | moderate — the compute chain is holding |
| **Grid interconnection** becoming the stated binding constraint at two or more frontier labs | T3, T4 up | moderate — and couples T to S |
| Published evidence of a **reliability ceiling** (80% horizon flattening while 50% keeps rising) | T3, T4 up | large — this is the mechanism most likely to break the extrapolation |

---

## Triangulation: what other forecasters say, and why they disagree

| forecaster | estimate | known problem |
|---|---|---|
| **AI Impacts / Grace et al., 2023** (2,778 AI researchers) | 50% chance of high-level machine intelligence by **2047** — 13 years *earlier* than the previous survey | asks about **all tasks**, not coding; researchers are poor forecasters of their own field |
| earlier survey (738 researchers) | median **2059** | same |
| **Superforecasters (XPT, 2022)** | **2047**; 25% by 2048 | same definition; no AI expertise |
| **Metaculus community (Jan 2025)** | **2027** on a four-part definition | strong selection for people unusually engaged with AI |
| Metaculus, four-year drift | mean fell from ~50 years to ~5 | shows responsiveness, and shows the crowd is not anchored |
| **2025 → 2026** | the Metaculus community, Dario Amodei and elite forecaster Peter Wildeford all pushed timelines **out** | the first sustained *outward* revision in several years |

**The disagreement is mostly definitional.** The surveys ask about all human tasks; this model's
T asks about coding and AI research, which should arrive materially earlier. Comparing them
directly is the commonest error in this literature, and the model should not make it.

The 2025–26 outward revision is the most decision-relevant fact here, because it is recent, it
runs against the prior direction of travel, and it comes from forecasters with the best track
records rather than from the surveys with the worst.

---

## Recommendation

Current priors: **T1 0.099 · T2 0.302 · T3 0.387 · T4 0.211**

The METR extrapolation with its own error bars centres on **2029–2031 at 50% reliability** and
**2030–2033 reliability-adjusted**. That straddles the T2/T3 boundary, which is where the
current priors already put most of the mass. **The existing distribution survives contact with
the evidence.** Two adjustments are defensible:

1. **T1 → ~0.07** (from 0.099). Reaching a one-month 80% horizon by end-2028 requires the trend
   to go super-exponential, and the only evidence for that is a 2024-only subset its own authors
   decline to extrapolate from.
2. **T4 → ~0.24** (from 0.211). Four independent physical constraints on the compute chain, plus
   an unmeasured reliability ceiling, plus expert-survey mass well beyond 2040. Against that,
   T4 is about coding rather than all tasks, which pulls the other way — hence a small move
   rather than a large one.

Redistribute to T3, which the reliability-adjusted extrapolation most directly supports:
**T1 0.07 · T2 0.30 · T3 0.42 · T4 0.24** — held for review rather than applied, because
changing a prior is a change to the parent Atlas, which this project does not make.

## Gaps this opened

- **S gates T and the model does not say so.** Three of Epoch's four constraints (power, chip
  production, data) are exactly the S axis. A conditional from S to T is missing and
  load-bearing. Logged in `findings/gaps.md`.
- The model has no representation of a **reliability ceiling** — the 50%/80% divergence — which
  is the single mechanism most likely to produce T3 or T4 without any compute constraint
  binding.

## Sources

Ordered by weight in the above.

- METR — *Measuring AI Ability to Complete Long Tasks* (time-horizon series, doubling times,
  confidence intervals, extrapolation, 80%-vs-50% analysis, nine-benchmark extension).
  https://metr.org/
- Epoch AI — *Can AI Scaling Continue Through 2030?* (2e29 FLOP feasibility, four constraints,
  power ranges, H100-equivalent accounting). https://epoch.ai/publications/can-ai-scaling-continue-through-2030
- Epoch AI — *Training compute of frontier AI models grows by 4-5x per year*.
  https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year
- AI Impacts / Grace et al. 2023 — survey of 2,778 AI researchers; HLMI median 2047.
  https://aiimpacts.org/
- 80,000 Hours — *When do experts expect AGI to arrive?* (comparison of surveys,
  superforecasters and Metaculus, and the selection problems in each).
  https://80000hours.org/2025/03/when-do-experts-expect-agi-to-arrive/
- LessWrong — commentary on interpreting the METR time-horizons result, including the
  super-exponential reading and the arguments against it.
