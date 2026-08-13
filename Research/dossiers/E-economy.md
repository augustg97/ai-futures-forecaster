# E · Economy — dossier

**Status:** first pass complete · **Confidence in the recommendation:** medium-high
**Researched:** 2026-08-12 · **Questions answered:** 1, 2, 3, 4, 5

---

## 1 · Base rate — the 2025–26 record

| fact | figure | source |
|---|---|---|
| Big-four hyperscaler capex, 2025 | **~$410 billion** | CNBC, 6 Feb 2026 |
| 2026 guidance | **~$700 billion** | CNBC, 6 Feb 2026 |
| Alphabet free cash flow, 2026 | **~$8B, down from $73B — a ~90% fall** | Pivotal Research |
| Understated depreciation, industry, 2026–28 | **~$176 billion** — chips booked over 5–6 years against a real economic life nearer 2–3 | Burry, via analyst summary |
| OpenAI loss run-rate | **~$14 billion this year** | reported |
| Venture dollars going to AI | **87.5%** | PitchBook, via Fortune, Aug 2026 |
| Enterprise GenAI pilots with no measurable P&L impact | **95%** | MIT NANDA, *The GenAI Divide*, 2025 |
| Companies abandoning most AI initiatives | **42%** | derived from the same survey |
| AI sector services revenue | **~$100 billion** — covers inference cost | analyst compilation |

## 2 · Mechanism — the bear case is three arguments and only one survives

This is the most important analytical finding in this dossier, and the model should encode it.

1. **"Earnings are fake."** Depreciation schedules understate the true cost of chips by ~$176B
   across 2026–28. **Partly right, and it moves reported earnings rather than cash flow.**
2. **"Demand is manufactured."** Circular vendor financing among five firms. **Mostly wrong** —
   most hyperscaler AI revenue is enterprises and consumers paying for cloud and software.
3. **"There is no revenue."** From the MIT 95% figure. **This one collapses.** MIT measures the
   *buyer's* return, not the *seller's* revenue, and the same survey found **~90% of workers
   using personal AI tools at work against 40% of firms with official subscriptions.** The
   revenue exists; it is not running through corporate AI budgets. The failures MIT found were
   **organisational, not technological**.

What survives is a **timing** argument: spending is running years ahead of payback and every
hyperscaler is building as though the return were already proven. The live question is whether
revenue covers **training and research**, not whether it covers inference — it already covers
inference.

**That is the E2 structure exactly**: a correction that clears financing without stopping the
physical build-out.

## 3 · Resolution criteria

| position | resolves TRUE if |
|---|---|
| **E1** boom sustained | aggregate AI-sector revenue growth exceeds capex growth for two consecutive years, with no peak-to-trough drawdown >30% in AI equities |
| **E2** correction, build-out survives | AI equities fall >40% peak-to-trough **while** installed capacity keeps growing year-on-year |
| **E3** deflates hard | announced capacity is cancelled such that installed GW growth goes **negative or flat** for two consecutive years |
| **E4** displacement-led demand crisis | aggregate consumption falls with **AI-attributed employment loss** identified as a driver in official statistics |

## 4 · What would move these priors

| observation | direction | size |
|---|---|---|
| A hyperscaler shortens its stated depreciation schedule | E2, E3 up | moderate — it converts the accounting argument into a cash one |
| Capex guidance revised **down** by >20% at two of the big four | E3 up | large |
| Enterprise adoption via official channels rises past 60% (from 40%) | E1 up | moderate — closes the buyer/seller gap MIT exposed |
| Installed GW growth goes flat while equities fall | **E2 confirmed** | this is E2's own resolution criterion |
| Aggregate consumption falls with AI-attributed job loss named in official statistics | E4 up | large — and it is the only route to E4 |

---

## Recommendation

Current priors: **E1 0.289 · E2 0.428 · E3 0.202 · E4 0.081**

The record supports the existing shape and sharpens the reason. E2 is modal because the only
surviving bear argument is about **timing**, and a timing problem produces a correction in
claims on the assets without stopping the assets. The depreciation gap and the 90% collapse in
Alphabet's free cash flow are real stressors and they are **balance-sheet** events.

E4 stays low, and the **D dossier is why**: the demand-crisis mechanism needs an aggregate
labour shock, and four years after ChatGPT the aggregate effect is still undetectable in CPS.
The model's own conditional already says `E|D3: slow diffusion starves the spiral`. The
measured evidence says the spiral is starved *today*.

Recommended: **E1 0.26 · E2 0.44 · E3 0.22 · E4 0.08** — held for review.

## Gaps and structural proposals

- **G9 · The model has no accounting channel.** The single most concrete near-term stressor —
  a ~$176B depreciation gap over 2026–28 — is an accounting event with cash-flow consequences,
  and the model's E axis has no way to represent "the assets are fine and the claims on them
  are not." That distinction is exactly what separates E2 from E3, and it is currently carried
  by prose rather than by structure.
  **Proposed:** an E sub-axis for the *channel* of correction (equity / credit / capex), so E2
  and E3 differ by mechanism rather than by degree.
- **The buyer/seller distinction should be in the sheet's own prose.** The 95% figure is the
  single most-cited number in the AI-economics discourse and it is routinely misread as
  "nobody is paying for this." The Method section should say what it measures.

## Sources

- CNBC, 6 Feb 2026 — hyperscaler capex $410B (2025) and ~$700B (2026 guidance); free-cash-flow
  compression. https://www.cnbc.com/2026/02/06/google-microsoft-meta-amazon-ai-cash.html
- MIT NANDA — *The GenAI Divide: State of AI in Business 2025*: 95% of pilots without
  measurable P&L impact; 150 leader interviews, 350-employee survey, 300 public deployments;
  failures organisational rather than technological. https://nanda.media.mit.edu/
- Fortune, 18 Aug 2025 — reporting and author interview on the MIT study.
- Pivotal Research / Mizuho — Alphabet free-cash-flow projection.
- Analyst synthesis of the three-part bear case, incl. the Burry depreciation argument and the
  buyer-vs-seller reading of MIT.
  https://realinvestmentadvice.com/resources/blog/ai-bear-case-what-skeptics-get-right-and-wrong/
- PitchBook via Fortune, 12 Aug 2026 — 87.5% of US venture dollars to AI.
- Fortune, 12 Aug 2026 — CIOs and CTOs imposing limits on AI use as costs rise.
