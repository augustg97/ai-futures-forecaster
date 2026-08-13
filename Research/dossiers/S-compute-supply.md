# S · Compute & supply — dossier

**Status:** first pass complete · **Confidence in the recommendation:** medium-high
**Researched:** 2026-08-12 · **Questions answered:** 1, 2, 3, 4, 5

Researched second because gap **G1** says this axis gates capability and the model has no edge
for it. Before this dossier the three positions rested on **3 citations**.

---

## 1 · Base rate — where the constraint actually binds

The model's S axis is about "where the physical substrate lands and who controls it." The 2026
record says the binding constraint moved, and moved to a place the axis does not describe.

**Advanced packaging, not wafer fabrication, is now the rate-limiting step in AI accelerator
production.** CNBC (8 April 2026) and Digitimes (10 April 2026) both report it directly.

| fact | figure | date / source |
|---|---|---|
| TSMC CoWoS capacity reserved by one buyer (Nvidia) | **majority, through at least 2027** | CNBC, 8 Apr 2026 |
| CoWoS capacity growth | ~**80% CAGR**, still short of demand | CNBC, 8 Apr 2026 |
| TSMC's projected 2026 CoWoS capacity already allocated | **100%** | Morgan Stanley, Jan 2026 |
| Equipment suppliers' ability to fill CoWoS expansion orders | **~50%** | Morgan Stanley, Jan 2026 |
| 2026 HBM production pre-sold | **all of it**; server DRAM +55–60% QoQ | TrendForce, Jan 2026 |
| Advanced packaging capacity on US soil | **none** | CNBC, 8 Apr 2026 |
| Time to meaningful US CoWoS capacity | **18–24 months minimum** | TSMC build schedule |
| TSMC Arizona N3 slip vs its original 2024 target | **~12 months** | Reuters / TSMC earnings |

**Power, in parallel.** US data centres consume ~**6% of national electricity**, projected to
**11% by 2030**. **$162 billion** of projects sit blocked or delayed nationwide, and Georgia's
**HB 1012** (January 2026) proposes the **first statewide data-centre construction moratorium in
American history**. Against that, **$602 billion** of hyperscaler capex is committed for 2026.

## 2 · Mechanism, and its weakest step

Chips are fabricated → packaged → installed → powered. The model treats this as one variable
with one geography. **It is two variables with different geographies, and they are moving in
opposite directions.**

- **Data-centre siting is diversifying.** Sovereign clouds, Gulf capacity, second-tier hubs.
  This is the S2 story and it is true.
- **Chip supply is concentrating.** One packaging process, one country, one buyer holding the
  majority of it through 2027. This is the S1 story and it is *also* true, simultaneously.

A world can have compute spread across a dozen countries and still have every one of those
sites dependent on a single Taiwanese packaging line. The model cannot currently express that,
and it is the most likely actual state of the world.

The weakest step in the chain is **packaging**, because it cannot be substituted (the
accelerator architecture presupposes it), cannot be stood up quickly (sub-micron tooling,
qualification), and has no qualified second source at GPU volume before 2028.

## 3 · What the record shows as of 2026

- Supply chain for a US-delivered accelerator: **Arizona fab → Taiwan packaging → US customer.**
  US reshoring policy has moved the fab and not the chokepoint.
- Alternatives (Intel EMIB/Foveros, Amkor, ASE, Samsung) exist and none has publicly confirmed
  production-volume qualification at frontier HBM+GPU complexity.
- The constraint list has a clear order in 2026: **HBM allocation → CoWoS throughput → data
  centre power.** Two of the three are Taiwanese.

## 4 · Resolution criteria

| position | resolves TRUE if, at the date in question |
|---|---|
| **S1** concentration + flashpoint | >60% of frontier accelerator supply still routes through a single jurisdiction for packaging, **and** that jurisdiction is subject to an active sovereignty claim |
| **S2** diversified build-out | no single jurisdiction accounts for >40% of frontier accelerator packaging, **and** the top-3 compute-hosting countries hold <70% of installed AI capacity |
| **S3** constrained | frontier training runs are being deferred for stated supply reasons — grid interconnection, packaging allocation or export licence — in two or more consecutive years |

These are readable from TSMC earnings (packaging is now a distinct reporting line), from
interconnection-queue data, and from lab statements.

## 5 · What would move these priors

| observation | direction | size |
|---|---|---|
| Arizona CoWoS lines reach production qualification on schedule (late 2027/early 2028) | S2 up, S1 down | large — it is the single event that breaks the chokepoint |
| A second source (Intel, Samsung, Amkor) qualifies at GPU volume | S2 up | large |
| Two or more further statewide data-centre moratoria pass | S3 up | moderate |
| A frontier lab states publicly that a training run was deferred for power or packaging | S3 up | large — this is S3's resolution criterion firing |
| Tariff reclassification of packaging as a derivative product | S3 up, S1 up | moderate |

---

## Recommendation

Current priors: **S1 0.327 · S2 0.417 · S3 0.255**

The evidence points against S2 being the modal case. **S2 at 0.417 is reading the
data-centre-siting story and missing the packaging story.** Siting is diversifying; the
chokepoint is not, has no qualified alternative before 2028, and its one US remedy has already
slipped 12 months once. Meanwhile S3's mechanism is being actively confirmed in the record —
$162B blocked, the first statewide moratorium proposal, 100% of 2026 packaging allocated.

Recommended: **S1 0.35 · S2 0.33 · S3 0.32** — held for review.

That is a large move and it rests on a real conflation in the axis definition, which is the
more important finding below.

## Gaps and structural proposals this opened

- **G5 · The S axis conflates two variables that are moving in opposite directions.** Siting
  and chip supply have different geographies, different constraints and different timescales.
  Proposed: split S into **S-siting** (where capacity is installed) and **S-supply** (where the
  packaging and HBM chokepoints sit), or add a sub-axis. Without it the model cannot represent
  the most likely actual world: capacity everywhere, dependency on one island.
- **G1 confirmed and sized.** Three of Epoch's four constraints on continued scaling are this
  axis. The `T|S` edge is missing. This dossier gives it a rate: under S3, the physical route to
  a 2e29 FLOP run in 2030 requires 1–5 GW single-site or 2–45 GW distributed, against a US grid
  already refusing $162B of projects.
- The model's **warm-ink energy track** (GW, TWh) is modelled from a growth parameter and takes
  no account of the interconnection queue. Proposed: damp `COMPUTE_G` under S3 by the observed
  refusal rate rather than by a fixed constant.

## Sources

- CNBC, 8 April 2026 — Nvidia's reservation of TSMC CoWoS capacity through 2027; no US advanced
  packaging capacity; Arizona→Taiwan→US routing.
  https://www.cnbc.com/2026/04/08/tsmc-nvidia-advanced-packaging-intel.html
- Digitimes, 10 April 2026 — advanced packaging, rather than wafer fabrication, as the binding
  constraint. https://www.digitimes.com/news/a20260410VL204/packaging-capacity-tsmc-nvidia-demand.html
- Morgan Stanley, January 2026 (via analyst summary) — 100% of TSMC 2026 CoWoS capacity
  allocated; ~50% fulfilment of expansion equipment orders.
- TrendForce, January 2026 — all 2026 HBM pre-sold; server DRAM +55–60% QoQ.
- SK Hynix, 9 January 2026 — HBM4 mass production deferred past Q1 2026 on Nvidia per-pin
  speed revision.
- Georgia HB 1012, January 2026 — first proposed statewide data-centre construction moratorium;
  $162B of US projects blocked or delayed.
- Reuters / TSMC earnings — Arizona N3 ~12-month slip against the original 2024 target.
- Epoch AI — *Can AI Scaling Continue Through 2030?* for the power envelopes (1–5 GW
  single-site, 2–45 GW distributed).

**Source-quality note.** The packaging figures reach this dossier through analyst secondary
sources that cite CNBC, Digitimes, Morgan Stanley and TrendForce. The primary reports are named
above and should be read directly before any prior is actually changed. The power and moratorium
figures are from primary legislative and utility records.
