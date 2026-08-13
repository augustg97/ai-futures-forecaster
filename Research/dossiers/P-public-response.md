# P · Public response — dossier

**Status:** first pass complete · **Confidence in the recommendation:** high
**Researched:** 2026-08-12

**This dossier overturns a prior.** The polling does not show what the model's modal position
assumes.

---

## 1 · Base rate — the 2026 polling

| question | result | margin |
|---|---|---|
| Adding AI preemption to the NDAA | **57% opposed, 19% support** | **3 : 1 against** |
| …among **Trump voters** | **43% oppose, 25% favour** | ~1.7 : 1 against |
| …among **Harris voters** | **70% oppose, 14% favour** | 5 : 1 against |
| AI regulation moratoriums (June 2026) | opposed | **3 : 1 against** |
| Congress prioritising child safety over AI industry advancement (Sept) | favoured | **9 : 1** |

## 2 · Mechanism — and why this changes the answer

The model's **P3 (polarised-fractured)** is modal at **0.426**, and its prose says the division
"cuts across existing party coalitions." The polling says something different and more specific:
**both coalitions want restriction**. 43% of Trump voters and 70% of Harris voters oppose
preemption. On child safety the margin is 9:1.

That is not a fractured public. That is a **broadly restrictionist public with an elite–public
split rather than a left–right one.** A 9:1 margin is not a polarised issue by any normal
measure; it is a consensus issue on which policy is moving the other way.

P1 (populist backlash) describes this: "restriction, taxation and procurement bans entering
serious platforms." The evidence is that they are entering platforms *in both parties*.

## 3 · Resolution criteria

| position | resolves TRUE if |
|---|---|
| **P1** populist backlash | restriction-favouring positions hold majority support **and** appear in the platforms of both major parties |
| **P2** adoption / acquiescence | net approval of AI positive **and** no major-party platform carrying restriction |
| **P3** polarised-fractured | the partisan gap on a headline AI question exceeds **30 points**, with each coalition on a different side |

The 2026 polling **fails P3's criterion**: on preemption, both coalitions are on the same side.
The gap is in intensity rather than direction.

## 4 · What would move these priors

| observation | direction | size |
|---|---|---|
| A headline AI question where the parties land on opposite sides by >30 points | P3 up | large |
| Federal preemption enacted **despite** 3:1 opposition | P1 up | large — it converts opinion into grievance |
| Net approval turning positive with restriction dropping from platforms | P2 up | moderate |

---

## Recommendation

Current priors: **P1 0.262 · P2 0.312 · P3 0.426**

**Recommended: P1 0.38 · P2 0.28 · P3 0.34** — held for review, and the largest single
recommended change in the programme so far.

The reasoning: P3's resolution criterion is a partisan *split*, and the best available 2026
polling shows cross-party agreement on restriction at 3:1 and 9:1 margins. The model's P3 prose
("cuts across existing party coalitions") describes a division that runs *within* both
coalitions — but a division that leaves both coalitions on the same side of the policy question
is, for every purpose the model uses P for, a backlash rather than a fracture.

## Gaps

- **G11 · P measures the wrong axis of division.** The salient split in the 2026 record is
  **public vs elite / industry**, not left vs right. The model's three positions all describe
  left–right structure. A public that agrees with itself and disagrees with its government
  produces different politics from one that is split down the middle — and the model cannot
  tell them apart.
  **Proposed:** re-cast P3 as *elite–public divergence* rather than partisan polarisation, or
  add it as a fourth position.
- **G7 feeds this.** The labour effect is concentrated in 22–25-year-olds. P is downstream of D
  and the model routes that shock through a variable that cannot see the age gradient.

## Sources

- Institute for Family Studies — *New Poll Shows Americans Overwhelmingly Oppose Federal
  Preemption of State AI Regulations* (57/19 overall; 43/25 Trump voters; 70/14 Harris voters).
  https://ifstudies.org/press-release/new-poll-shows-americans-overwhelmingly-oppose-federal-preemption-of-state-ai-regulations
- June 2026 survey on AI regulation moratoriums — opposed 3:1.
- September polling on congressional priorities — child safety over industry advancement, 9:1.
