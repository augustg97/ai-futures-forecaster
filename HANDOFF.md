# Handoff — The Forecast Works

Paste this whole file as the first message of a new session.

---

## What you are working on

**The Forecast Works** — the AI Atlas forecast drawn as an A1 drafting sheet, in the register
of The Systems Works. Five plates over one zone composition.

- Repo `/Users/augustgweon/Forecast Works` · GitHub `augustg97/forecast-works`
- **Live: https://augustg97.github.io/forecast-works/** (Pages serves `main:/docs`)
- First shipped 2026-08-11, stamp `20260811-0146` verified live.
- Dev server `forecast-works` :8154 — `build/serve.py`, **no-store** (a cached module makes an
  edit invisible; that is why it exists).

## The boundary, which is a decision of record

This is a SECOND SURFACE on the AI Atlas instrument. **Never modify `~/AI Atlas` or
`~/Systems Works` from here.** The Atlas's staged forecast is read read-only, its gate must
pass before this publishes, and the client's climate constants are EXTRACTED from its
`worldlines.py` at build time rather than mirrored (`climate_params()` in `build/build_site.py`
— a parse failure is fatal).

## State right now

- All five plates draw: mainline · world · alternatives · this morning's revision · the key.
- Full parent functionality carried over: composer (intervene/observe, per-axis pinning),
  alternatives browser, date index, hover chips, per-mark note selection driving the notes
  column, hash state, pan/zoom/fit.
- Nightly: `build/nightly.sh` + a scheduled task at 11:20 local, after the Atlas's 10:47 run.
- Data as shipped: network `r2-2026-08-06`, read `2026-08-10`.

## Known gaps, honestly

- **No collision audit yet.** The Systems Works records every text box and reports overlaps;
  this sheet does not, so a dense plate can overprint without anything saying so. That is the
  first thing to build (their §5 is the model: record the box BEFORE the legibility cull, make
  solid marks declare themselves obstacles, sweep every plate at fitted zoom).
- Note cards are drawn only on the key plate; selection currently fills the notes column.
  Pinning a drawn card to the selected mark on every plate is the natural next step.
- The world map is equirectangular with no projection choice; sites are authored points.
- The left column has a quiet band below CONTROL on some plates; the flow-down layout is
  faithful but could carry one more panel (a claims register would suit it).

## Commands

```bash
python3 build/build_site.py --dev     # pull only
python3 build/build_site.py           # Atlas gate → pull → stamp → docs/
bash build/nightly.sh                 # the whole morning
python3 build/serve.py 8154           # or preview_start name="forecast-works"
```

## How the user wants this done

Read `CLAUDE.md` — the nine standing rules. The ones that bite: everything in sheet
millimetres; minimums in DEVICE pixels; one meaning per colour; regions registered at draw
time; build the instrument, not the graphic; never mirror a parent literal into JS.
