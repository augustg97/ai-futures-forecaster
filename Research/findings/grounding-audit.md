# Grounding audit — the state of the evidence before this programme

Network `r2-2026-08-06`, read 2026-08-12. Computed from `network.json`, not asserted.

## The headline finding

The engine is grounded in **1330 wiki pages directly** and 484 more through the recorded past. That number describes the CORPUS.

The **priors** rest on something much thinner: **34 citations across the 26 positions**, drawn from **31 distinct sources**. **21 of 26 positions carry one citation or none.**

A prior with one citation is an opinion with a footnote. That is the gap this programme exists to close.

## Sources carrying the whole prior structure

- 5× `sources/ai-2027`
- 4× `sources/ai-as-normal-technology`
- 3× `sources/aschenbrenner-situational-awareness`
- 3× `sources/ai-2040-plan-a`
- 3× `concepts/compute-governance`
- 3× `concepts/ai-bubble-debate`
- 2× `concepts/agi-timelines`
- 2× `analysis/interpretability-and-safety`
- 2× `analysis/eu-vs-us-ai-regulation`
- 2× `analysis/us-china-ai-competition`
- 2× `concepts/ai-diffusion`
- 2× `concepts/ai-labor-disruption`
- 2× `concepts/export-controls-ai`
- 2× `concepts/ai-backlash`
- 2× `analysis/ai-bubble-vs-buildout`
- 1× `concepts/scaling-laws`
- 1× `sources/grading-ai-2027-2025-predictions`
- 1× `concepts/responsible-scaling-policy`
- 1× `analysis/coordinated-slowdown-proposals`
- 1× `sources/anthropic-2028-ai-leadership`
- 1× `concepts/ai-displacement-vs-augmentation`
- 1× `concepts/middle-manager-displacement`
- 1× `concepts/professional-services-ai-adoption`
- 1× `industries/healthcare`
- 1× `industries/legal`
- 1× `industries/financial`
- 1× `industries/education`
- 1× `industries/media`
- 1× `analysis/companion-chatbot-harms`
- 1× `sources/europe-2031`
- 1× `sources/2028-global-intelligence-crisis`

Four scenario documents carry 19 of 55 citations between them. The priors are therefore a reading of the scenario literature more than they are a reading of evidence about the world.

## Positions by grounding depth

| axis | position | prior | citations | note |
|---|---|---|---:|---:|
| T Capability tempo | T1 explosive (SC 2027-28) | 0.099 | 2 | 247 ch |
| T Capability tempo | T2 fast (2029-31) | 0.302 | 2 | 189 ch |
| T Capability tempo | T3 gradual (2032-36) | 0.387 | 1 ⚠ | 188 ch |
| T Capability tempo | T4 continuous-normal (no SC in window) | 0.211 | 1 ⚠ | 178 ch |
| A Alignment outcome | A1 fails undetected | 0.116 | 1 ⚠ | 178 ch |
| A Alignment outcome | A2 near-miss, managed | 0.263 | 1 ⚠ | 190 ch |
| A Alignment outcome | A3 tractable with effort | 0.351 | 1 ⚠ | 160 ch |
| A Alignment outcome | A4 untested in window | 0.270 | 1 ⚠ | 145 ch |
| C Coordination | C1 none / race | 0.402 | 1 ⚠ | 162 ch |
| C Coordination | C2 US securitization | 0.264 | 2 | 184 ch |
| C Coordination | C3 US-CN transparency deal | 0.074 | 1 ⚠ | 177 ch |
| C Coordination | C4 fragmented blocs | 0.251 | 1 ⚠ | 165 ch |
| C Coordination | C5 moratorium / shutdown | 0.009 | 1 ⚠ | 180 ch |
| D Diffusion & labor | D1 shock | 0.190 | 1 ⚠ | 154 ch |
| D Diffusion & labor | D2 uneven by sector | 0.538 | 5 | 186 ch |
| D Diffusion & labor | D3 slow absorption | 0.273 | 1 ⚠ | 145 ch |
| S Compute & supply | S1 concentration + flashpoint | 0.327 | 1 ⚠ | 146 ch |
| S Compute & supply | S2 diversified build-out | 0.417 | 1 ⚠ | 143 ch |
| S Compute & supply | S3 constrained (controls + energy) | 0.255 | 1 ⚠ | 125 ch |
| P Public response | P1 populist backlash | 0.262 | 1 ⚠ | 117 ch |
| P Public response | P2 adoption/acquiescence | 0.312 | 1 ⚠ | 115 ch |
| P Public response | P3 polarized-fractured | 0.426 | 1 ⚠ | 130 ch |
| E Economy | E1 boom sustained | 0.289 | 1 ⚠ | 85 ch |
| E Economy | E2 bubble corrects, build-out survives | 0.428 | 1 ⚠ | 173 ch |
| E Economy | E3 deflates hard (capex-led) | 0.202 | 1 ⚠ | 106 ch |
| E Economy | E4 displacement-led demand crisis | 0.081 | 2 | 142 ch |

## Interactions

The model carries **14 conditional stories** — every claim it makes about how one variable changes another.

Axes with parents: A (2), C (3), S (4), P (2), E (3).
**Axes with no parent at all: T, D.**

T having no parent is defensible — it is the master variable. D having none is a gap: diffusion plainly depends on capability and on the economy, and the model says nothing about how.

## What follows from this audit

1. Every position needs a dossier that establishes a base rate, a mechanism, resolution criteria, and what would move it — with sources that are about the world rather than about another forecast.
2. The interaction structure needs the same treatment. 14 stories is a sketch.
3. Where research cannot support a prior, the prior should widen. Uncertainty that is inherited honestly is worth more than a number with a footnote.
