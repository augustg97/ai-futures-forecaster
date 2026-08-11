# The Forecast Works — instructions for Claude sessions

The AI Atlas forecast drawn as an A1 drafting sheet, in the register of The Systems Works.

**Read `README.md` first**, then `HANDOFF.md` for live state.

## Standing rules — these override default behaviour

1. **Never modify `~/AI Atlas` or `~/Systems Works` from this project.** The Atlas is read
   read-only for its staged forecast; the Systems Works is a design reference only. This is a
   decision of record (2026-08-11).

2. **This project owns no forecast data.** If the Atlas has not emitted, this build fails
   rather than drawing something plausible. The Atlas gate runs first and refuses the publish.

3. **Everything is in sheet millimetres.** Pen weights, type sizes (cap height), dash patterns,
   region boxes. Nothing is stated in pixels. `s(mm) = mm / mmPerPx` is the whole transform.

4. **Minimums are in DEVICE pixels.** The legibility cull and the hairline floor multiply by
   `dpr` — measuring them in CSS pixels culls every small label and empties the sheet (this
   happened; it is why the rule is written down).

5. **Colour is a code with one meaning per token** (README). Blue is probability in motion and
   nothing else. Publish the code on Plate 5 and never break it.

6. **Register a region as you draw the mark**, never afterwards; hit-test the smallest
   containing rectangle from the previous frame.

7. **Build the instrument, don't draw the graphic.** Where a real instrument performs the
   abstraction — dial, sight glass, manifold, annunciator, strip chart, tally — build that.

8. **The client implements functions against `engine.json` constants.** Never mirror a literal
   from the Atlas into JS; extend the build's extractor instead (see `climate_params()`).

9. **Dev never caches; production always versions.** `build/serve.py` sends `no-store`; the
   build versions every module import in `docs/`.

## Commands

```bash
python3 build/build_site.py --dev      # pull only
python3 build/build_site.py            # gate → pull → stamp → docs/
python3 build/serve.py 8154            # or: preview_start name="forecast-works"
```

## Traps that have cost time here

- A module cached by the browser makes an edit invisible while the page reloads perfectly.
  That is what `serve.py` exists for.
- `board.clientWidth` is 0 when the module runs before layout; a zero-size fit yields a
  non-finite scale that draws nothing and reports no error. `state.fitted` guards it.
- Canvas 2D is happy to accept a mis-nested arrow body in an options object; `node --check`
  on a `.js` file will not catch an ESM syntax error. Copy to `.mjs` to check.
