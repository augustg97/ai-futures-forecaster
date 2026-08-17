# Evidence-gap register — AI Futures Forecaster / AI Atlas

**Assembled 2026-08-17.** Consolidates the evidence-gap investigations returned to this pass, one row per gap, tied to the forecast axis it changes.

Verdicts: **CLOSED** — a measurement exists and the number is read off it. **NARROWED** — better evidence, judgement still carrying part of the load. **OPEN** — no instrument exists; the row states what would build one.

## Provenance

Eight investigations arrived. The consolidation was scoped at twelve.

| arrived | id in payload | subject |
|---|---|---|
| yes | 11 | coding rung to research rung, axis K |
| yes | 14 | per-domain tempo, axis T |
| yes | 1 | arms-control agreement durability, C3 |
| yes | 1 | federal preemption of state AI law, C |
| yes | 1 | public opinion to policy, P |
| yes | 6 | compute against algorithms in effective-compute growth, S/T |
| yes | 1 | advanced-packaging concentration, S |
| partial | — | scaling ceilings and diminishing returns, T; the record cuts off mid-sentence inside its evidence list, and its `recommendedNumber` and `whatWouldSettleIt` are absent |

Four investigations are absent from the payload. Their gaps are unassessed, and they are unranked below. Recovering them is the first item of business, because a register that reports eight of twelve and ranks them by threat is ranking a sample it chose by accident.

---

## The register

| # | gap | axis | verdict | the number the evidence supports | strongest single source |
|---|---|---|---|---|---|
| EG-01 | interval from superhuman coder to superhuman AI researcher | K | NARROWED | 15% point mass at 0 months; 85% lognormal, median 12 months, 80% CI 4–38 | AI Futures Project Q2.5 2026 timelines update, 2026-08-16 |
| EG-02 | tempo differs by domain | T | NARROWED (CODE, HACK, ROBOT, FCAST, POLIT) · OPEN (BIO, SCI) | rate multipliers r = CODE 1.00, HACK 0.69, R&D 1.00, ROBOT 0.27; inter-domain spread widens 5.5× | METR, *How Does Time Horizon Vary Across Domains?*, 2025-07-14 |
| EG-03 | durability of a US–China agreement | C3 | NARROWED | bilateral lapse 2.48%/yr (22.2% per decade); violation 2.38%/yr; P(in force and verified at 10 years) 0.64 | 21-instrument coding, own assembly, 2026-08-17 |
| EG-04 | federal preemption of state AI law | C | NARROWED | P(binding preemption in force by 2027-12-31) 12%, band 8–15; by 2028-12-31 25%, band 20–30 | Senate floor vote 99–1, 2025-07-01 |
| EG-05 | public opinion moves AI policy | P | NARROWED (general) · OPEN (AI-specific) | public-to-business influence ratio 1.31, band 0.8–2.0, replacing 0.039; state AI bill conversion 12.0% in 2025, ~7.5% tracking 2026 | Enns, *Sociological Science* 13:528–564, 2026-05-05 |
| EG-06 | share of effective-compute growth that is physical | S3 edge | NARROWED | physical 50%, band 30–70; S3 retardation factor 0.65, band 0.50–0.76 | Ho, Epoch AI Gradient Updates, 2026-02-25 |
| EG-07 | concentration and interruption in advanced packaging | S | CLOSED (substitution floor) · NARROWED (share, base rate) | US CoWoS-class capacity in 2026 and 2027 = zero; Taiwan share 84%, band 80–88; interruption ≥1 month 3%/yr, band 2–4 | TrendForce, 2025-10-14 and 2025-12-04 |
| EG-08 | does the capability curve carry an asymptote | T, ladder | NARROWED on the record received | ScaleRL fitted asymptote A = 0.61; DeepSeek-R1-32B peaks 55.8% at ~12,000 tokens | arXiv:2510.13786, 2025-10-15 |
| EG-09 … EG-12 | — | — | not received | — | — |

One number in the register is closed by measurement, and it is a zero.

---

## EG-01 · axis K · NARROWED

**The number.** 15% point mass at 0 months, 85% lognormal with median 12 months and 80% CI 4–38 months.

**The arithmetic.** Seven forecaster-group estimates, in months: 3.6 (AI 2027 authors, 2025-04), 6.6 (FutureSearch n=4, 2025-04), 8.9 (Kokotajlo, 2026-08-16), 13.2 (Lifland, 2026-08-16), 22.4 (Metaculus n=3, Anthropic AI R&D-4 to R&D-5, 2026-08-17), 27.0 (Halstead, 2026-08-16), 37.0 (Metaculus n=54, OpenAI High to Critical, 2026-08-17). Three of the seven are differences of median dates; where the AI Futures update publishes both quantities the difference-of-medians runs 1.35× and 2.27× high, mean 1.8×. Corrected set median 12.4, geometric mean 10.1. Width from the raw spread: σ_ln = ln(37.0/3.6) / (2 × 1.2816) = 0.909, giving 3.7 to 38.5 months.

**What carries the judgement.** All seven figures are forecasts. Five of the seven come from people who read each other; the two structurally independent panels sit at the high end. The direct measurements point lower than the forecasts: frontier agents reach 23.2% weighted average on autonomous post-training against 51.1% for human teams (PostTrainBench, arXiv:2603.08640v2, 2026-03-10), and RE-Bench stands at 0.5–0.8 against the 1.3 that AI 2027 predicted for early 2026 (AI 2027 Tracker, 2026-06-06).

**Residue.** The interval has been priced seven times and measured zero times. What would settle it: METR publishing separate time-horizon curves for research tasks and coding tasks from one task suite calibrated in human-expert hours, converting by months = log2(r) × doubling months. METR holds both sides already; the published 12-hour 50% horizon of 2026-05-19 pools them into one series.

## EG-02 · axis T · NARROWED for five domains, OPEN for two

**The number.** Replace the single tempo scalar with per-domain rate multipliers applied as an effective threshold, c*_k = 2.6 + (th_k − 2.6) / r_k.

- CODE r = 1.00 — reference; 50% horizon doubles every 196 days across 2019–2026, every 89 days for 2024+ models (METR, Time Horizon 1.1, 2026-01-29)
- HACK r = 0.69, band 0.51–0.89 — three same-window pairs: 4.7 mo against 4.2 mo (UK AISI, 2026-02); 9.8 mo against 6.44 mo and 5.7 mo against 2.92 mo (Lyptus Research, 2026-02, 291 tasks, R² = 0.95)
- ROBOT r = 0.27, band 0.20–0.35 — Tesla FSD 20 months against software's 4–7 (METR, 2025-07-14)
- FCAST — dated by measurement at 2026.9, CI 2026.0–2027.9 (ForecastBench, 2026-01-29), against the curve's 2029.5
- POLIT — dated by measurement at 2026.5: frontier systems out-persuade world-champion debaters and professional canvassers across 18,978 conversations from 6,923 people, and raise close to 3× the donations canvassers raise (arXiv:2606.16475, 2026-06), against the curve's 2031.1

**The consequence.** One scalar spreads the eight rungs over 2.7 years under T2. The measured evidence spreads them from 2026.5 to 2041.8, 15.3 years. Ratio 5.5×, band 5.4–6.1 across T1, T2 and T3.

**OPEN, and this is the register's largest hole.** BIO at th 4.1 and SCI at th 4.6 carry zero length-calibrated trend of any kind. Biosciences has levels — GPQA-Bio 42% to 81%, CloningScenarios 23% to 61%, ProtocolQA 31% to 72% across 27 models (arXiv:2505.06108, 2025-05) — with no human-time labels, so no horizon can be fitted. Novel science has two dated points on one instrument: FrontierMath Tier 4, 39.6% in April 2026 to 83.0% on 2026-08-07, with a v2 problem revision of 2026-06-12 sitting between them. Two of eight domains carry crossing dates set by assumption.

**What would settle it.** Expert-hours labels attached to LABBench2's ~1,900 tasks, re-run against eight or more dated checkpoints. A frozen FrontierMath Tier 4 re-run quarterly, so the 39.6% to 83.0% move separates from the revision. Mean time between interventions on real hardware for dated robotics policy releases, so embodiment stops being dated by a Tesla proxy METR itself calls biased.

## EG-03 · C3, the deal's durability · NARROWED

**The numbers**, per agreement-year in force, from 21 instruments coded 1949–2026:

- bilateral limits between adversaries: lapse 5 / 201.6 = 2.48%/yr, 22.2% per decade; Poisson 90% interval 0.98–5.21%/yr
- violation: 4 / 167.8 = 2.38%/yr, 21.4% per decade
- multilateral with a verification organ: 2 / 250.1 = 0.80%/yr, 7.7% per decade
- informal export regimes with zero verification: 1 / 260.7 = 0.38%/yr, 3.8% per decade
- P(still in force and verified at 10 years) = 0.78 × 0.822 = 0.64

**The conditional the model should carry.** All four bilateral agreements with a documented material breach ended. Lags from finding to termination: Agreed Framework 0.2 years, New START 3.0, INF 5.1, ABM 12.6; median 4.1. On four events, carry 0.8–0.9 with a wide band.

**Two adjustments the raw rate misses.** Verification uptime: on-site inspection ran 13.0 of INF's 31.2 years and 9.1 of New START's 15.0, 47.8% of 46.2 agreement-years. Apply 0.5 to any "in force" term the model reads as implying monitoring. Time to teeth: TTBT took 16.4 years from signature (1974-07-03) to entry into force with agreed verification protocols (1990-12-11); CWC took 4.3; CTBT has taken 29.9 and counting. An AI agreement signed in year t carries verification from about t+4 to t+16, with a live branch where it never arrives — Peigné, Nguyen and Wang put a zero-knowledge training-verification proof of concept at approximately 36 months with thirteen open problems named (arXiv:2606.05433, 2026-06-03).

**Residue.** Zero of the 21 instruments pair the United States with China in a binding limit on a technology. Every figure transfers by analogy to the US–Soviet case, and the analogy carries a shared verification culture and an economic non-relationship that hold differently now. Carry the transfer as an assumption with its own uncertainty.

## EG-04 · axis C, preemption · NARROWED

The investigation returned itself as filled. Downgraded here: the 3-in-19 hazard rate is an assembly from a self-chosen case set, and its own settling note records that no peer-reviewed per-Congress hazard rate for technology preemption exists.

**The numbers.** 3 enactments across 19 Congress-opportunities = 15.8% per Congress. Split by whether the bill carries a federal replacement standard: with one, 5 of 5 eventually enacted (aviation, vehicle emissions, nutrition labeling, GMO labeling, spam), median gap from first state law about 3 years; as a pure moratorium, 1 of 3.

- P(binding federal preemption in force by 2027-12-31) = 12%, band 8–15
- P(by 2028-12-31) = 25%, band 20–30
- P(enactment | a bill pairing preemption with a substantive federal standard reaches committee markup) = 70–80%
- P(specific provisions of specific state AI laws struck on First Amendment grounds by end 2028) = 50–60%, producing no field preemption

**The observable that moves it.** A committee markup of the Great American AI Act or any successor pairing preemption with a substantive standard. That single event shifts the estimate from the 15.8% branch to the 70–80% branch. The Obernolte–Trahan draft was released 2026-06-04 and remains unintroduced as of 2026-08-17.

**The judicial channel is thinner than the model may be treating it.** xAI v. Weiser pleads four constitutional theories and zero federal statutory-preemption counts, because no federal AI statute exists to preempt with; the docket's most recent entry is 2026-04-27 and the preliminary-injunction clock starts 28 days after Colorado finalises rulemaking. Mozilla v. FCC (2019-10-01) vacated executive preemption for want of authority; National Pork Producers v. Ross (2023-05-11) removed the extraterritoriality theory.

## EG-05 · axis P · NARROWED on the general question, OPEN on the AI one

**The overturn.** Enns (*Sociological Science* 13:528–564, published 2026-05-05) reproduces the Gilens and Page table almost exactly from a data-generating process in which the 10th and 90th income percentiles have identical influence (β = 0.164 for both), showing the near-zero result is Simpson's paradox introduced by restricting to preference-gap cases. On the identical restricted data, a group-intercept indicator returns responsiveness to the 10th percentile of 0.33. On the full 1,779 cases with the public treated as a whole, the general public's coefficient is 3.11 (SE 0.40) against business interests' 2.37 (0.36). Gilens has published no reply in the three months to 2026-08-17.

**The numbers.**
- public-to-business influence ratio: 1.31, band 0.8–2.0. Any weight carrying the Gilens and Page prior of 0.039 is multiplied by 34.
- enactment prior for a high-salience measure with 70%-plus support, per state, per four years: 0.45, band 0.43–0.57 — three independent routes land inside it (Gilens and Page's own 43% descriptive figure; Lax and Phillips 57% at majorities ≥70%; 1 − (1 − 0.13)⁴ = 0.43 from the 2026 companion-chatbot record)
- state AI bill conversion: 12.0% in 2025 (145 / 1,208, MultiState), tracking 7.5% in 2026, band 6.5–9.2
- the level to forecast: enacted state AI laws per year ≈ 145 ± 25. Introductions ran 635 → 1,208 → ~2,191 over two years while conversion fell 15.6% → 12.0% → ~7.5% and enactments stayed roughly flat.

**OPEN.** No study has regressed state AI enactment on state-level AI opinion. The only peer-reviewed model of state AI adoption covers 181 bills 2018–2022, 27 enacted, and carries no public-opinion variable of any kind (Parinandi et al., *Business and Politics*, 2024-03-18). The opinion data now exists at all 50 states from roughly 21,000 respondents (CHIP50 Report #116, August 2025), and its own headline is why the test bites: in every state the share worried about too little regulation exceeds the share worried about too much, so opinion is near-uniform across states while enactment ranges from zero to double digits. If the coefficient comes back near zero against that variance structure, the forecast should move weight to party control, session calendar and preemption risk, and treat polling as a floor condition.

## EG-06 · S3 edge · NARROWED

**The finding is an estimand mismatch.** Epoch's 60–95% is a Shapley share of a perplexity reduction between two named models in linear space (arXiv:2403.05812, 2024-03-09). The forecast needs ln(g_physical) / ln(g_physical × g_algorithmic), a share of a log growth rate.

**The 60–95% is a spread across model pairs and rises with baseline recency.** Summing Table 1: 72.2% at a 2012 baseline, 85.3% at 2016, 91.6% at 2018. The 95% endpoint spans one year, 2018 to 2019. Twelve rows are built from five endpoints. This is the window-label defect in another dress — a spread printed as an uncertainty band.

**The number.** Physical share 50%, band 30–70. Pre-training reading: ln(4.1) / (ln(4.1) + ln(3)) = 56%, band 44–67 sweeping the International AI Safety Report 2026 range of 2–6×/yr. All-software reading, which the forecast window requires because RL post-training is live from 2024: ln(4.5) / (ln(4.5) + ln(10)) = 40%, band 28–68, using Epoch's own 10×/yr with 80% interval 2–50× (2026-02-25). Gundlach et al. cross-check: 7 / 10.84 = 65%.

**Consequence.** S3 retardation factor 0.65, band 0.50–0.76, against the register's 0.605. METR's 212-day doubling stretches to 326 days, band 279–424, against 350. The one-month-horizon date moves from 2030–31 to roughly 2032–34, about a year nearer than the register's 2033–35. A compute-supply constraint bites less than the register has it.

**Residue.** Every observational estimate in this literature is open to an endogeneity objection with a measured size: Whitfill's Monte Carlo on the actual Ho et al. dataset turns a true 45% annual rate into 16.5% at correlation 0.5 and 93% at correlation −0.5 (arXiv:2508.11033, 2025-08-14). Gundlach et al. show the whole quantity is ill-posed without naming a reference algorithm and a target scale — the same model sequence yields 63%/yr against an LSTM reference and 0%/yr against a dense Transformer one (arXiv:2511.21622, 2025-11-26). The near-term falsification: Epoch's ~10×/yr and Scher's 16–60×/yr imply April 2026 frontier capability trainable for 100× to 3,600× less compute by 2028; Gundlach's 2.23×/yr implies about 5×. Two to three orders of magnitude apart inside two years, readable off the Epoch Capabilities Index compute frontier.

## EG-07 · axis S · CLOSED on the substitution floor, NARROWED on share and base rate

**CLOSED.** United States CoWoS-class capacity in 2026 and 2027 is zero. Amkor Peoria reaches volume production early 2028 (TrendForce, 2025-10-14); TSMC Arizona P6 begins tool installation at the end of 2027 (TrendForce, 2025-12-04). TSMC's five CoWoS sites — AP3 Longtan, AP5 Taichung, AP6 Zhunan, AP7 Chiayi, AP8 Tainan — are all in Taiwan. Set the substitution floor to zero through 2027.

**NARROWED.** Taiwan share of CoWoS-class 2.5D packaging 84%, band 80–88: (130 + 30) / 190 from TrendForce 2026-06-15. Nvidia holds roughly 60% of that pool (Morgan Stanley, 2025-07-29), so one customer and one island coincide on about half of world 2.5D output. Leading-edge logic ≤7nm, Taiwan 88%, band 85–92; for ≤3nm specifically the 2026 share is 100%.

**Qualification time.** 12 months is the floor at an operator already running the process (AP7 Chiayi Plant 2: tools 2H 2025, production 2026). 27 months for greenfield (Amkor Peoria: groundbreaking 2025-10-06, volume production early 2028). A new package format runs 2.2 years (CoPoS validation Q3 2026, mass production end-2028).

**The base rate, and the shape matters more than the level.** 3%/yr for a ≥1-month, ≥20% interruption; 15% over 2026–2030. Seismic 0.023/yr plus non-seismic chokepoint 0.010/yr. Every Taiwan seismic recovery on record is 2–3 days and under 0.7% of a quarter's revenue, and the largest earthquake in 25 years closed as a NT$4.3bn net gain after insurance finalised in Q2 2026 (TSMC 6-K, 2026-08-14). Model the interruption as low-probability and long-tailed: 3%/yr at 12–18 months through 2027, on the strength of the zero substitution floor and the 12-month qualification minimum.

**Scope limit worth carrying explicitly.** This base rate covers accident, disaster and export control. Blockade, quarantine and armed conflict have zero events in 27 years of record, so this evidence is silent on them and the S axis needs a separate political-risk term.

## EG-08 · axis T, the ladder's shape · NARROWED on an incomplete record

The record cuts off inside its evidence list. Its recommended number and settling note did not arrive.

**What arrived and holds.** Meta's ScaleRL fits RL compute to performance with a sigmoid carrying an estimated asymptotic pass rate: ScaleRL A = 0.61, GRPO ≈ 0.58, DAPO ≈ 0.59, MiniMax and Magistral ≈ 0.59–0.60, over 400,000 GPU-hours, with design choices modulating compute efficiency while leaving the asymptote in place (arXiv:2510.13786, 2025-10-15). The predictive test held: a sigmoid fitted on the first 50k GPU-hours forecast A = 0.645 and the extension to 100k landed on it. A second bend: across the Qwen2.5 dense series the 32B model outperforms the 72B under equal compute budgets (arXiv:2509.25300, ACL 2026). Inference-time returns at the top of the budget carry confidence intervals touching zero — FrontierMath +11.67 ±10.99 pp from 1M to 10M tokens, SWE-Bench Pro +0.27 ±0.31 pp from 16M to 30M (arXiv:2606.17930, 2026-06-16). Test-time compute has a measured negative return: DeepSeek-R1-32B peaks on AIME 2024/2025 at ~12,000 tokens and 55.8% accuracy, then falls.

**The tension the headline states.** The data wall has slipped later at every revision and the METR time-horizon trend shows no bend, while RL post-training compute and test-time tokens both have measured ceilings, one of them negative.

**What this means for the engine as it stands.** The tempo tracks can represent a ceiling — T5 saturates at 3.9 by 2075 and 4.0 by 2100 — and they represent it as a tempo choice sampled at a prior weight. A fitted asymptote of A = 0.61 on a named method is a different kind of object: a measured property of a training setting. The forecast has a place to put a ceiling and no channel by which a measurement of one arrives.

**Recover the full record before acting on this row.**

---

## Ranking: which open gaps most threaten the forecast's conclusions

1. **BIO and SCI dated by assumption (EG-02, OPEN).** Two of eight domains carry crossing dates with zero fitted trend behind them, and the same investigation's structural change is the largest number anywhere in the register: the inter-domain spread widens 5.5×, moving ROBOT from 2031.5 to 2041.8 under T2, +10.3 years. The forecast prints eight dated domain crossings; two of them are set by nothing, and the six that are measured say the model's single tempo scalar is wrong by a factor of five and a half. This is the axis-mixing defect the programme already named on its own evidence layer — one scalar answering eight questions has a world it cannot say.

2. **Whether the capability curve has an asymptote (EG-08, record incomplete).** Every other gap shifts a date. This one asks whether the ladder above rung 3 is the right object. A fitted asymptote of A = 0.61 that design choices do not move is a claim the engine has no channel to receive, and the record that would tell us how far it generalises is the one that arrived truncated.

3. **K has been priced and never measured (EG-01).** Seven forecasts, zero measurements, five of the seven from people who read each other, and the two direct instruments (PostTrainBench 23.2% against 51.1%, RE-Bench 0.5–0.8 against a predicted 1.3) sit below every forecast. The band 4–38 months is honest; the concern is that its centre is a consensus of one circle.

4. **The US–Soviet-to-US–China transfer (EG-03).** Zero of 21 coded instruments pair the United States with China. The C3 branch weight rests entirely on an analogy, and the closest live precedent — the November 2024 statement on human control of nuclear-use decisions — was restated around "relevant weapons systems" within twelve months.

5. **Opinion to AI enactment, unmeasured (EG-05).** The general responsiveness question moved by a factor of 34 on one 2026-05-05 paper. The AI-specific version is now runnable for the first time and has never been run, and the 2026 record is a natural experiment sitting unused: enacted AI laws ran 109 by 2026-07-01 against 121 by 2025-07-01 while polling moved further toward regulation.

6. **Political risk in the compute supply (EG-07).** The measured base rate covers accident, disaster and export control and is silent on blockade and conflict, on 27 years of zero events. The S axis needs a separate term with its own prior, and this evidence cannot supply it.

7. **The four investigations that did not arrive (EG-09 … EG-12).** Unrankable, and therefore the first thing to fix.

---

## Three findings that generalise past their own row

**A spread is not a band.** Epoch's 60–95% is the minimum and maximum of 12 overlapping rows built from 5 endpoints, monotone in baseline recency (72.2% at 2012, 91.6% at 2018), and the 95% endpoint spans one year. Taking its midpoint would push the physical share about 20 points above every rate-based route. This is the same defect as the panel label that reported the window it asked for: a quantity computed over one field, printed as though computed over another.

**Measure the estimand the model uses.** EG-06's whole finding is that the published number answers a different question than the forecast asks. Six decompositions exist; the one the register cited was the wrong shape, and reading it correctly moves the S3 retardation factor and pulls the one-month-horizon date a year nearer.

**A base rate assembled from a self-chosen case set is a judgement wearing a figure's clothes.** EG-03's 2.48%/yr and EG-04's 15.8% per Congress are both own-coding with no published study behind either, and both investigations say so in their own settling notes. Carry them with the band, and carry the band's provenance with it.
---

# Engineer's addendum, 2026-08-17

Written after working the numbers against the registry as built.

## The K axis has a hole, and the evidence lands in it

Gap 11 replaced one lab's self-published record with **seven forecaster-group estimates** of
the interval between the coding rung and the automated-research rung: 3.6 months (AI 2027
authors), 6.6 (four FutureSearch professionals), 8.9 (Kokotajlo), ~13 (Lifland), 27 (Halstead),
22.4 and 37 (two Metaculus panels). It recommends 15% point mass at zero plus a lognormal with
median 12 months and an 80% interval of 4 to 38 months.

Worked through (sigma 0.899):

| interval | mass |
|---|---|
| 12 months or less | 0.575 |
| 12 to 24 months | 0.238 |
| 24 to 60 months | 0.156 |
| over 60 months | 0.031 |

r5 built K as **inside one year 0.26 · two to five years 0.43 · past five years 0.31**. Two
findings follow, and the second is the more serious.

1. **The evidence says takeoff is much faster than r5 priced it.** 0.575 against 0.26 on the
   first band, and 0.031 against 0.31 on the last.
2. **The bands are not exhaustive.** Nothing on the axis covers 12 to 24 months, and that is
   where 0.238 of the mass falls — the second-largest band. An axis whose positions leave a hole
   returns shares that are not a probability, which is the same defect that forced the C split
   in this same revision. K needs a four-band ladder before its priors are re-set.

**Held, not applied.** Re-setting K priors onto bands that do not cover the evidence would put
the mass in the wrong place with more confidence than before.

## Two further numbers ready to apply

- **The public-to-policy channel is unblocked.** r3 left the P-into-C and P-into-R edges unsized
  because Gilens and Page (near-zero independent effect of ordinary preferences over 1,779
  cases) and their critics disagreed. Gap 5 reports that on 5 May 2026 the near-zero result was
  shown to be reproducible from a data-generating process in which rich and poor have identical
  influence, and that on the identical 1,779 cases the general public's coefficient ratio is
  **1.31 against the 0.039 the original implied**. The edges can be sized.
- **The compute-to-algorithmic split is the wrong estimand.** Gap 6 finds Epoch's 60-95% is the
  minimum and maximum across 12 overlapping model pairs in one 2024 paper, and rises
  monotonically with how recent the baseline is (72.2% at a 2012 baseline). The quantity the
  T-given-S3 edge needs is the share of effective-compute growth that survives a physical cap,
  which is a different ratio. The edge is sized on a number that does not measure what it is
  used for.

## Citation hygiene

The Data Center Watch figure appears in nine edges and five position descriptions. Its own
quarterly series runs $64bn (May 2024 to March 2025), $98bn across 20 projects (Q2 2025),
$156bn for calendar 2025, and **$130bn across 75 projects for January to March 2026**. Cite the
last, dated, once. Retire the $64bn figure, which measures a different and older window.

## Concentration, now citable

Taiwan holds **88% of leading-edge logic** (band 85-92%) and roughly **84% of CoWoS-class
packaging**, with no United States CoWoS capacity until early 2028. The interruption base rate
still has to be built from a census, because the four Taiwan earthquakes on record produced no
leading-edge outage long enough to measure.
