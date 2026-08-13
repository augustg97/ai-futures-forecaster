# D · Diffusion & labour — dossier

**Status:** first pass complete · **Confidence in the recommendation:** high
**Researched:** 2026-08-12 · **Questions answered:** 1, 2, 3, 4, 5

This is the axis with the **best measured evidence of any in the model**, and it is the one the
model's own structure serves worst: D has no parent (gap G3).

---

## 1 · Base rate — the measured effect, 2022–2026

| finding | figure | source |
|---|---|---|
| Entry-level hiring in AI-exposed occupations, **within firms**, vs less-exposed | **−13%** | Brynjolfsson, Chandar & Chen, *Canaries in the Coal Mine* (Stanford Digital Economy Lab / ADP) |
| Entry-level jobs in AI-exposed fields, US | **−16%** | Brynjolfsson et al., cited in WEF, June 2026 |
| Affected cohort | **22–25 year olds**; older workers **statistically insignificant** | same |
| Aggregate US employment effect | **small — not detectable in CPS** | Stanford Digital Economy Lab; SIEPR |
| Young workers globally in AI-exposed roles | **37%** — E Asia 75%, N America 69%, Europe 63% | ILO / PwC AI Jobs Barometer 2026, via WEF |
| Entry-level workers reporting a productivity increase | **68%** | WEF, 9,000 workers across 48 economies |
| …who **also** report spending more time working | **45%** | same |
| Net skills change, highest AI-exposure entry-level quartile vs lowest | **~2×** | PwC AI Jobs Barometer 2026 |
| Organisations reporting systematic AI job redesign | **16%** | WEF 2026 |

**The shape of the effect is the finding.** It is sharp, concentrated in one age band within
exposed occupations, and invisible in the aggregate. Occupation alone does not predict it;
occupation × age does.

## 2 · Mechanism, and its weakest step

Capability → task automation → firms stop hiring for the automated task → the *entry* rung
disappears while incumbents are unaffected → the pipeline that produced experienced workers
narrows → the effect surfaces in aggregate a decade later.

The weakest step is the **causal attribution**. Two papers find hiring in AI-exposed occupations
began declining **after the Fed's monetary policy shift and before ChatGPT's release**. The
remote-work shift also skews hiring towards experienced workers independently. The *Canaries*
authors take these seriously and test against them: results hold excluding tech, excluding
computer jobs, excluding remote-capable jobs, and with firm-time fixed effects. They remain
observational.

Contradicting evidence exists and should be weighted: **Humlum & Vestergaard (Denmark)** find
substantially weaker effects using worker-survey adoption measures. The authors themselves say
it is unresolved whether that is institutional difference, measurement difference, or method.

## 3 · Resolution criteria

| position | resolves TRUE if |
|---|---|
| **D1** shock | cumulative employment change vs 2026 is worse than **−8%** by the date, **and** the decline is visible in aggregate national statistics rather than only in exposed-occupation subsets |
| **D2** uneven by sector | the exposed/unexposed hiring gap exceeds **10 points** while aggregate employment stays within **±3%** of 2026 |
| **D3** slow absorption | the exposed/unexposed gap stays under **5 points** and aggregate employment stays within **±2%** |

## 4 · What would move these priors

| observation | direction | size |
|---|---|---|
| Aggregate employment falls below −4% vs 2026 in a non-recession year | D1 up | large |
| The entry-level gap widens beyond 25% and spreads to the 26–35 band | D1 up | large |
| A replication with **experimental** variation in firm AI adoption confirms causality | D1, D2 up | moderate |
| The Danish result replicates in two more countries | D3 up | large |
| Organisations doing systematic job redesign rises from 16% past 50% | D2 up, D1 down | moderate |

---

## Recommendation

Current priors: **D1 0.190 · D2 0.538 · D3 0.273**

**The evidence confirms the existing shape.** A sharp effect inside exposed occupations, no
aggregate effect, strong sectoral variation — that is D2, and D2 is already modal at 0.538.
Small adjustments only: **D1 0.17 · D2 0.55 · D3 0.28**, held for review. The move away from D1
reflects that four years after ChatGPT the aggregate is still undetectable; the move to D3
reflects the unresolved Danish contradiction.

## Gaps and structural proposals

- **G7 · The effect is age-graded and the axis is not.** The measured decline is −13% for
  22–25-year-olds and statistically zero for older workers *in the same occupations*. The model
  has three positions describing sectoral spread and none describing which cohort absorbs it.
  A world where entry-level hiring collapses and incumbent employment is untouched is D2 by the
  model's definition and D1 by any political measure — which matters, because **P** (public
  response) is downstream and reacts to the political measure.
  **Proposed:** a sub-axis on D for incidence (entry-level / broad / incumbent-protected), or a
  fourth position.
- **G3 confirmed.** D still has no parent. This dossier gives the missing edges content: `D|T`
  (automation follows capability with a lag measurable in the exposure data) and `D|E` (the
  2022–24 decline is confounded by monetary policy, which is E).
- **The same conflation as S.** Sharp-but-narrow and broad-but-shallow are different worlds, and
  the model gives each one position on the same axis so it cannot say *sharp at the entry rung,
  invisible in aggregate* — which is what the record shows. This is now a **pattern across two
  axes**, and worth treating as a design finding rather than two bugs.

## Sources

- Brynjolfsson, Chandar & Chen — *Canaries in the Coal Mine? Six Facts about the Recent
  Employment Effects of Artificial Intelligence*, Stanford Digital Economy Lab with ADP payroll
  microdata. https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/
- Chandar, B. — *AI and Labor Markets: What We Know and Don't Know*, Stanford Digital Economy
  Lab, Oct 2025 (robustness tests, the Danish contradiction, the observational caveat).
  https://digitaleconomy.stanford.edu/news/ai-and-labor-markets-what-we-know-and-dont-know/
- SIEPR — *What is really happening to jobs? Separating AI hype from reality* (the monetary
  policy and remote-work confounders).
  https://siepr.stanford.edu/publications/policy-brief/what-really-happening-jobs-separating-ai-hype-reality
- World Economic Forum — *Artificial Intelligence and the Future of Entry-Level Work*, June 2026
  (9,000 entry-level workers, 48 economies; exposure shares; productivity and time findings).
  https://reports.weforum.org/docs/WEF_Artificial_Intelligence_and_the_Future_of_Entry_Level_Work_2026.pdf
- PwC AI Jobs Barometer 2026 / ILOSTAT — exposure shares by region, net skills change index.
- Hosseini & Lichtinger (2025); Klein Teeselink (2025) — corroboration, US and UK.
- Humlum & Vestergaard (2025) — the Danish contradiction.
