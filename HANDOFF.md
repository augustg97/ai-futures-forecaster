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
- Data as shipped: network `r2-2026-08-06`, read `2026-08-11`.
- Axis notes separate AUTHORED sub-axes from PROVISIONAL ones — a sub-axis carrying `origin`
  was written by the parent's weekly schema review, is uncited, and is drawn under its own
  "provisional, not approved" heading with the origin printed verbatim (added 2026-08-11).

## A trap the parent sets

`network.version` is NOT a sufficient change detector. On 2026-08-10 the Atlas's weekly schema
review added `C.watch-federal` and `E.watch-ai` on its own, left `version` at `r2-2026-08-06`,
and added no changelog entry. A version comparison reports "no change" while the registry has
grown. Diff the axis and sub-axis KEYS, not just the version string.

## The audit and the frame budget (2026-08-11, second round)

- **The collision audit is built and clean.** `__FW.auditSweep()` in the console draws all five
  plates at four dates plus seven selections with lettering recorded, and reports text/text,
  text-on-solid, off-sheet and column overflow. **27 cases, 211–299 marks each, 0/0/0.**
  It earned that zero: on first run it found **88 collisions** on the details band (the
  manifold's readings sat in the panel's own sub-caption; the dials' scale figures sat on their
  readouts), and both are fixed. Before trusting a zero, run the positive control — two
  overlapping labels, a label on declared-solid ground, a mark past the frame — and confirm it
  returns exactly three findings.
- **Frame budget: 8.6 ms** median full redraw at 2560×1440 (was 29.1). `text()` had been
  applying tracking one glyph at a time: 22,568 `measureText` + 11,284 `fillText` per frame.
  Panning no longer redraws at all — the last ink is blitted and a crisp redraw follows 170 ms
  after the gesture settles.

## Known gaps, honestly
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
