# Round 3 — sizing the four missing edges

Round 2 left one question: whether the four conditional edges the model lacks can be **sized**
from evidence, or only asserted. Three can. One cannot, and saying so is the result.

---

## Edge 1 · `T | S` — compute supply gates capability tempo

**Sized. This is the most load-bearing missing edge in the model.**

The mechanism runs through *effective* compute, which Epoch decomposes:

| quantity | figure |
|---|---|
| Physical training compute growth | **~4× per year** (4.5× since 2010) |
| Algorithmic efficiency gain | the same performance for **~3× less compute** each year |
| **Effective compute growth** | **~12× per year** |
| Share of that from algorithms | **~40%**; the remaining ~60% is physical compute |
| Algorithmic progress expressed as compute | a doubling every **9 months** (4–25 month range) |
| Shapley attribution of performance gains | **60–95% compute and data**, 5–40% novel algorithms |

**The arithmetic.** Under S3, physical compute growth is capped by grid connections, packaging
allocation and export licences. Take a constrained rate of ~1.5×/year against the ~4×/year
baseline. Effective compute growth falls from ~12×/year to ~4.5×/year — in log terms from 2.48
to 1.50, or **~60% of the baseline rate**.

METR's time horizon doubles every 212 days. Holding the relationship between effective compute
and capability roughly log-linear, that doubling stretches to **~350 days**. The date at which
the 80%-reliability horizon reaches one month moves from **2030–31 out to roughly 2033–35**.

**That is a shift from T2/T3 into T3/T4, produced by S alone.**

Recommended edge, as multipliers on T's weights:

| given | T1 | T2 | T3 | T4 |
|---|---:|---:|---:|---:|
| **S3** constrained | ×0.45 | ×0.70 | ×1.20 | ×1.55 |
| **S1** concentrated | ×0.95 | ×1.00 | ×1.00 | ×1.05 |
| **S2** diversified | ×1.15 | ×1.10 | ×0.95 | ×0.85 |

The asymmetry is deliberate: S3 has a physical mechanism with a measured rate, and S2's
advantage is weaker, because the algorithmic 40% keeps running under any siting arrangement.

## Edge 2 · `D | E` — and the model has this arrow the wrong way round

**Sized, and it is the most surprising result of the round.**

The model carries `E|D` — diffusion drives the economy. The historical record carries the
reverse, and carries it hard.

| finding | figure | source |
|---|---|---|
| US per-capita employment losses in **routine occupations** falling within a **12-month window of an NBER-dated recession** | **88%** | Jaimovich & Siu, *The Trend Is the Cycle* (NBER WP 18334) |
| Routine employment after the 1991, 2001 and 2007–09 recessions | fell and **never recovered** as a share of population | same |
| What that non-recovery explains | **the jobless recoveries** in aggregate | same |

**Automation displacement is a recession phenomenon.** Firms defer the reorganisation while
demand is strong and execute it when demand falls, and the jobs do not come back. Three
recessions over thirty years, 88% of the losses clustered in twelve-month windows.

This matters directly to the current forecast. The measured AI labour effect so far is an
*entry-level hiring* effect during an expansion. On this base rate, **an E3 or E4 world converts
that into an incumbent-displacement event**, and the model has no edge to carry it.

Recommended edge, as multipliers on D's weights:

| given | D1 shock | D2 uneven | D3 slow |
|---|---:|---:|---:|
| **E3** deflates hard | **×2.10** | ×0.95 | ×0.55 |
| **E4** demand crisis | **×2.40** | ×0.90 | ×0.50 |
| **E1** boom sustained | ×0.60 | ×1.05 | ×1.25 |
| **E2** correction survives | ×1.30 | ×1.00 | ×0.85 |

**Note the loop.** The model already has `E|D1` (displacement turns a correction into a demand
crisis). Adding `D|E` closes it into a feedback loop, which is what the record describes and
what the sampler must handle without oscillating. Implementation should apply the edge once per
sample, in a fixed order, and say which.

## Edge 3 · `D | T` — weaker than intuition suggests

**Sized, and the size is small.**

The natural assumption is that faster capability means faster diffusion. The measured record
says adoption is governed by things that do not respond to capability at all:

| finding | figure |
|---|---|
| Realised time saving for workers using chatbots | **2.8% of hours** |
| The same tasks in controlled trials | **>15%** |
| Enterprise pilots with no measurable P&L impact | **95%**, and the failures were **organisational** |
| Organisations doing systematic AI job redesign | **16%** |

A capability jump that halves the time a task takes changes nothing about liability law,
procurement cycles, or whether a firm has redesigned the job. **The gap between 2.8% and 15%
is the size of the thing capability cannot move.**

Recommended edge, as multipliers on D's weights — deliberately mild:

| given | D1 | D2 | D3 |
|---|---:|---:|---:|
| **T1** explosive | ×1.25 | ×1.00 | ×0.85 |
| **T2** fast | ×1.10 | ×1.00 | ×0.95 |
| **T3** gradual | ×0.95 | ×1.05 | ×1.05 |
| **T4** no SC in window | ×0.80 | ×1.00 | ×1.15 |

## Edge 4 · `P | C` — cannot be sized, and the reason is the finding

**Not sized.** The question is whether public opinion changes what governments enact. The
literature is genuinely split, and the split is not a detail.

- **Gilens & Page**, over **1,779 policy issues**, find that economic elites and organised
  business interests have substantial independent influence on US policy while average citizens
  and mass-based groups have little or none.
- **Bashir (2015)**, re-examining the same dataset, finds the test may understate the influence
  of citizens at the median by a wide margin, and that **average Americans got their preferred
  outcome roughly as often as elites did when the two disagreed**.

Those are not compatible, and the disagreement is about the exact quantity this edge needs.

**What follows.** The 57–19 public opposition to federal preemption does **not** license a
prediction that preemption fails. The honest treatment is to leave `P|C` out and say why, in
the sheet, where a reader might otherwise assume the model knows.

This is also the sharpest illustration of the programme's own standard: an edge that cannot be
sized from evidence should stay absent, and a forecast that quietly asserts it is worse than one
that admits the gap.

---

## Summary

| edge | status | effect |
|---|---|---|
| `T\|S` | **sized** | S3 stretches the capability doubling from 212 to ~350 days, moving the one-month horizon from 2030–31 to 2033–35 |
| `D\|E` | **sized** | 88% of routine job losses fall inside recessions; E3/E4 roughly doubles D1 |
| `D\|T` | **sized, small** | capability moves diffusion weakly; the 2.8%-vs-15% gap is what it cannot move |
| `P\|C` | **cannot be sized** | the literature disagrees about exactly this quantity |

Three of the four were added to the parent network with the multipliers above on 2026-08-13.
The fourth stays out, and the sheet says so.

**Applying them found a defect that had been there since the first version.** Conditional tilts
were applied in one forward pass over the axis order, so a tilt whose parent came later could
never fire. Three of the fourteen declared relationships had never once acted: `S|E3`, `S|E4`
and `P|E4`. Measured before the repair, pinning E3 moved S3 by −0.004 against a declared 1.6×,
while the forward edge `A|T4` moved A4 from 0.324 to 0.576 exactly as declared — so the
instrument worked and three of the model's own claims were inert. The sampler now re-draws each
axis against all the others for four sweeps, and the self-test checks that **every** declared
conditional orders its target as declared, comparing two pins on the same parent axis.

That last detail matters: pinning E2 *lowers* D1 despite a declared ×1.3, because pinning also
removes E4 and its ×2.40 from the base. A declared multiplier is a local tilt; a marginal is a
net effect through the whole network. A test that compares against the unpinned ensemble will
report a false failure.

## Sources

- Epoch AI — *Algorithmic progress in language models*; *Revisiting algorithmic progress*;
  *Trends in Artificial Intelligence*. https://epoch.ai/blog/algorithmic-progress-in-language-models
- Jaimovich, N. & Siu, H. — *The Trend Is the Cycle: Job Polarization and Jobless Recoveries*,
  NBER WP 18334. https://www.nber.org/system/files/working_papers/w18334/w18334.pdf
- Brookings — *How automation and other forms of IT affect the middle class* (Siu & Jaimovich).
  https://www.brookings.edu/wp-content/uploads/2019/11/Siu-Jaimovich_Automation-and-the-middle-class.pdf
- Gilens, M. & Page, B. — *Testing Theories of American Politics: Elites, Interest Groups, and
  Average Citizens*, Perspectives on Politics.
  https://www.cambridge.org/core/journals/perspectives-on-politics/article/testing-theories-of-american-politics-elites-interest-groups-and-average-citizens/62327F513959D0A304D4893B382B992B
- Bashir, O. — *Testing Inferences about American Politics: A Review of the "Oligarchy" Result*,
  Research & Politics. https://journals.sagepub.com/doi/10.1177/2053168015608896
- Humlum & Vestergaard (2.8% realised time saving); MIT NANDA (95%, organisational); WEF 2026
  (16% doing systematic redesign) — carried forward from rounds 1 and 2.
