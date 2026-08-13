# AI Futures Forecaster — instructions for Claude sessions

The AI Atlas forecast drawn as a vertical drafting document, in the register of The
Systems Works. Read by scrolling, at one fixed scale.

**Read `README.md` first**, then `HANDOFF.md` for live state.

**The working directory is still `~/Forecast Works`** and the repo is
`augustg97/ai-futures-forecaster`. The project was renamed 2026-08-12; only the folder kept the
old name, because the nightly task, both `launch.json` entries and `nightly.sh` point at that
path. Do not "tidy" it without moving all four together.

## Standing rules — these override default behaviour

1. **Never modify `~/AI Atlas` or `~/Systems Works` from this project.** The Atlas is read
   read-only for its staged forecast; the Systems Works is a design reference only. This is a
   decision of record (2026-08-11).

2. **This project owns no forecast data.** If the Atlas has not emitted, this build fails
   rather than drawing something plausible. The Atlas gate runs first and refuses the publish.

3. **Seven TABS, each a vertical sheet of sections, one section per canvas.** The forecast tab
   is a three-column BOARD — instruments and behaviour left, chart middle, controls right —
   with the passage below it. Column geometry is `COL` in `sections.js`; nothing may assume the
   full sheet width inside a column. 300 mm wide,
   drawn at a fixed scale so nothing is zoomed; `web/js/sections.js` owns the tabs and the
   stack, and each section states its own height before anything in it is drawn. No pan, no
   zoom. Only the open tab's sections are laid out, painted or hit-tested.

   **A note opens where the mark that opened it is** — an axis entry inside its own control
   row, a chart mark in the band under the chart, anything else at the head of its tab. Sending
   the reader scrolling to find the explanation of what they just pressed is the defect this
   replaced.

   **Any plate that reads a date carries its own date index** (`dateStrip`). Its scale is
   linear where the chart's is compressed after 2040, so the region carries its own mapping and
   the pointer handler reads whichever it landed on.

4. **Measure prose, don't estimate it.** A section that grows with its text gets its height
   from `measureSections()`, which uses the drawing's own `wrap()`. Character-count estimates
   left tens of millimetres of blank paper under every prose section.

5. **Everything is in sheet millimetres.** Pen weights, type sizes (cap height), dash patterns,
   region boxes. Nothing is stated in pixels. `s(mm) = mm / mmPerPx` is the whole transform.

6. **Minimums are in DEVICE pixels.** The legibility cull and the hairline floor multiply by
   `dpr` — measuring them in CSS pixels culls every small label and empties the sheet (this
   happened; it is why the rule is written down).

7. **Colour is a code with one meaning per token** (README). Blue is probability in motion and
   nothing else. The code is published in the standing note, on the document itself.

8. **Register a region as you draw the mark**, never afterwards; hit-test the smallest
   containing rectangle from the previous frame.

9. **Build the instrument, don't draw the graphic.** Where a real instrument performs the
   abstraction — dial, sight glass, manifold, annunciator, strip chart, tally — build that.

10. **The client implements functions against `engine.json` constants.** Never mirror a literal
   from the Atlas into JS; extend the build's extractor instead (see `climate_params()`).

11. **Dev never caches; production always versions — INCLUDING THE ENTRY MODULE.** `build/serve.py` sends `no-store`; the
   build versions every module import in `docs/`.

12. **Run the collision audit before shipping a layout change** — `__FW.auditSweep()` in the
    console. It draws every SECTION at four dates, seven selections and five pin sets, and
    reports text/text overlaps, text-on-solid, off-section marks and column overflows.
    **The sweep plants its own positive control and reports `controlPasses`** — two overlapping
    labels, a label on declared-solid ground, and a mark past the frame. A zero with
    `controlPasses: false` means nothing. Expect ~9,000 marks over 16 cases.

13. **A section's millimetre space runs from its CORNER, so use `outside(box)`, not
    `offSheet()`.** `offSheet` assumes the origin is the middle of an A1 sheet; pointed at a
    section it reports every mark on the document (it reported 6,087 once).

14. **Draw once per content change, and only what is on screen.** Each section carries its own
    signature; a change that touches one section redraws one section, and an IntersectionObserver
    keeps the rest unpainted. A full pass over all eleven is ~18 ms. Anything that changes what
    is drawn must be in the common signature, or the document goes stale under the reader.

15. **Measure a setting's effect with COMMON RANDOM NUMBERS.** `effectsFor()` reuses one fixed
    matrix of uniforms across every setting, so the only difference between the baseline and the
    test is the setting. A fresh stream per setting makes the comparison resampling noise, and
    every button reports the same figure. Measure against all seven tracked quantities and print
    the one that moves hardest — the 2040 capability median has saturated under half the
    settings and would report nothing for four of the seven rows.

## Commands

```bash
python3 build/build_site.py --dev      # pull only
python3 build/build_site.py            # gate → pull → stamp → docs/
python3 build/serve.py 8154            # or: preview_start name="ai-futures-forecaster"
__FW.auditSweep()                      # in the console: the audit (check `controlPasses`)
```

## Traps that have cost time here

- A module cached by the browser makes an edit invisible while the page reloads perfectly.
  That is what `serve.py` exists for.
- `board.clientWidth` is 0 when the module runs before layout; a zero-size fit yields a
  non-finite scale that draws nothing and reports no error. `state.fitted` guards it.
- Canvas 2D is happy to accept a mis-nested arrow body in an options object; `node --check`
  on a `.js` file will not catch an ESM syntax error. Copy to `.mjs` to check.
- **Tracking by drawing one glyph at a time** cost 22,568 `measureText` and 11,284 `fillText`
  calls in a single frame (29 ms). Use `ctx.letterSpacing` and one `fillText`; measure each
  string once at a 100 px reference and cache it. Now 8.6 ms.
- **Regenerating the paper's noise on every pointer move** is the other half of that lag. The
  material is generated once into its own canvas and blitted.
- `wrap()` cannot push an unbreakable token to the next line, so a citation slug wider than
  the column simply ran off it. Tokens now break on `/ · — -`, then by character, and the
  audit counts any line still over width.
- A hidden Browser pane fires no rAF, so a frame-timing probe there hangs. Time the draw path
  synchronously instead.

- **`offSheet()` on a corner-origin section reports the entire document.** Its bounds are
  ±sheet/2. Use `outside([0, 0, SHEET_W, h])`.
- **A fresh random stream per condition drowns the effect in noise.** Emissions run to
  thousands; a few unlucky draws swamped every real difference and all 26 buttons reported the
  same movement. Common random numbers.
- **A first sentence usually ends in a full stop already**, so appending one gives ".." and
  reads as a truncation the drawing did not make (`firstSentence()`).
- **The parent emits `driver` at exactly 140 characters.** Ending the quotation without a mark
  reads as an abandoned sentence; the sheet appends "…" when the field is at the cap.
- **A hidden Browser pane fires no rAF and its screenshots go blank after a scripted scroll.**
  Verify layout with the Playwright MCP instead, which renders and screenshots reliably.

- **Titles carry no article** — CONTROLS, INSTRUMENTS, FORECAST, WORLD, METHOD AND SOURCES.
- **Say what a thing is, never what it is not.** No "X, not Y", no "rather than", no "instead
  of" in any authored string. This applies to the drawing's own lettering as much as to prose.
- **The parent writes provenance into its variable descriptions.** `plain()` drops the clauses
  and parentheses naming a source document and re-punctuates what is left; the citations stay in
  Method and in the grounding line of a selected entry. Dropping a dash clause without
  re-punctuating leaves "or halt This axis owns…".
- **A leader arrives on a diagonal**, so at the default gap its tip lands inside the first glyph
  and eats it. Stand crisis and difference labels off by 2.4 mm.
- **One slot allocator for every label on the chart.** The difference label placed on its own
  collided with the crisis labels whenever they landed together.

- **A note block's column width follows the number of columns it was MEASURED at**, never the
  block width alone. A one-column note wrapped to half its width runs off the foot of its
  section, where nothing catches it.
- **Clamp a chart label inside the frame on BOTH axes.** Pushed up it lands on the plate's
  caption; pushed right it lands in the next column. A label with no room to its right is set
  to its left.
- **The paper colour is `PAPER` in draft.js.** Never hard-code `#f4f1e8` or its successors —
  a stale literal shows up as a pale rectangle on white.

- **Versioning only the imports leaves `index.html` loading a bare `js/app.js`.** A cache holding
  that one file pulls in its own old `?v=` imports, so the page runs the previous build entirely
  while `window.__BUILD` — read from the fresh index.html — reports the new stamp. The build now
  versions the entry too and refuses to publish if it cannot find it exactly once. **Verify a
  deploy by checking something the new build DRAWS, never by checking the stamp alone.**

- **The passage AND THE HEADLINE are composed, never selected.** The headline is the largest
  lettering on the sheet and the sentence a reader tests the model against; it was keyed on one
  position per clause and read identically across every year and every other setting. Clauses
  are keyed on position × span, and the economy clause takes a second key from `ECON_MOD`.
  A modifier appended after a comma must be a tense-neutral PHRASE — a present-continuous
  modifier on a retrospective base gives "a century past the correction, with the halls changing
  hands" — and must not repeat a noun the base already used.
- **The paragraphs are composed, never selected.** A paragraph that reads the same for every other
  setting of every other variable is a bug in `narrative.js`, not a style choice. Each one takes
  its own FRAG (position × span), a CROSS clause against a second variable, a BAND clause keyed
  on a tracked quantity, and the figures.
- **Five years before the first forecast year is RECORD.** Comparing the run against itself
  reported the index flat in 2026, the year it had just climbed a rung; the lookback reads the
  trunk when the window predates the forecast.
- **Balance prose columns by trying every set of cuts**, not by filling greedily. With a handful
  of paragraphs the exhaustive partition is free and a greedy fill leaves one column with a
  single line beside one with four.
