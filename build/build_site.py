#!/usr/bin/env python3
"""build_site.py — AI Futures Forecaster: gate → pull → stamp → docs/.

This project is a SECOND SURFACE on the AI Atlas forecast engine, not a fork
of it. The engine, the wiki grounding, the evidence layer and the nightly
update all continue to live in `~/AI Atlas`, which this build reads
**read-only** and never writes to.

    python3 build/build_site.py          gate → pull → stamp → docs/
    python3 build/build_site.py --dev    pull only (local iteration)

Order matters, exactly as in the parent project: the Atlas gate runs FIRST
and this build refuses to publish if it fails; DATA_V is stamped BEFORE
index.html is copied, because a static host serving stale JSON is the
silent failure this stamp exists to catch.
"""

from __future__ import annotations

import datetime as _dt
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ATLAS = os.path.expanduser("~/AI Atlas")
ATLAS_FORECAST = os.path.join(ATLAS, "Research", "staged", "forecast")
ATLAS_TRUNK = os.path.join(ATLAS, "Research", "staged")
ATLAS_GATE = os.path.join(ATLAS, "Research", "modeling", "audit_all.py")
WEB = os.path.join(ROOT, "web")
DOCS = os.path.join(ROOT, "docs")

# the forecast surface the sheet reads (identical contract to the parent's)
FORECAST_FILES = ["engine.json", "network.json", "bands.json",
                  "marginals.json", "mainline.json", "crisis.json",
                  "delta.json", "claims.json", "grounding.json",
                  "exemplars.json", "ensemble2k.json"]
TRUNK_FILES = ["events.json", "meta.json"]
EXTRA = [(os.path.join(ATLAS, "data", "witness", "countries-110m.json"),
          "countries-110m.json")]


# Exit codes are the nightly task's contract (see build/nightly.sh):
#   1 the Atlas gate refused · 2 the pull or the extractor failed ·
#   3 push or live-verification failed · 4 the registry moved past the drawing.
# On 2026-08-17 every one of these was 1, so a climate extractor that no longer matched the
# parent's source was reported to an unattended run as a gate refusal — which has a different
# remedy and belongs to a different project.
def fail(code, msg):
    print(msg, file=sys.stderr)
    raise SystemExit(code)


def gate():
    if os.environ.get("SKIP_AUDIT") == "1":
        print("SKIP_AUDIT=1 — the Atlas gate was skipped. Say so out loud, "
              "and say why.")
        return
    if not os.path.isfile(ATLAS_GATE):
        fail(1, "cannot find the Atlas gate at %s — this project has no "
                 "data of its own and must not publish unaudited" % ATLAS_GATE)
    rc = subprocess.call([sys.executable, ATLAS_GATE])
    if rc != 0:
        fail(1, "Atlas gate FAILED (rc=%d) — refusing to publish" % rc)


def registry(net_path):
    """{axis key: [position keys]} from an emitted network.json."""
    net = json.load(open(net_path))
    return {a["key"]: [p[0] for p in a["positions"]] for a in net["axes"]}, net


def climate_params(net_path):
    """The parent's `tracks()` computes the climate coupling from constants
    written inline in `worldlines.py`, and `engine.json` does not carry them
    — so a composed (client-side) world-line would have no TWh/CO2 track.

    Rather than mirror the numbers into JS by hand (the failure this whole
    project's single-source rule exists to prevent) or edit the parent to
    export them, this EXTRACTS them from the parent's source at build time.
    A parse failure is fatal: a silently missing climate track would render
    as a blank instrument, which is worse than a refused build.

    NOTHING HERE NAMES AN AXIS OR A POSITION. The r5 rebuild (2026-08-17)
    broke the previous version because it asserted the decline map was keyed
    {S1,S2,S3} and that the bonus was earned by C3 — both were literals from
    a registry that had moved under them, and the second would have gone on
    computing quietly with the wrong condition. The axis the map is indexed
    by, the positions it carries and the positions that earn the bonus are
    all read out of the parent's source, then checked against the registry
    the parent emitted in the same run.
    """
    src_path = os.path.join(ATLAS, "Research", "timelines", "worldlines.py")
    src = open(src_path).read()
    reg, _ = registry(net_path)

    def one(pat, cast=float):
        m = re.search(pat, src)
        if not m:
            fail(2, "climate parameter not found in %s: /%s/ — the parent's "
                     "tracks() changed shape; fix the extractor rather than "
                     "hardcoding" % (src_path, pat))
        return cast(m.group(1))

    decline = re.search(
        r'int_decline\s*=\s*\{([^}]*)\}\[wl\["(\w+)"\]\]', src, re.S)
    if not decline:
        fail(2, "int_decline map not found in %s — the parent's climate "
                 "coupling changed shape; fix the extractor" % src_path)
    axis = decline.group(2)
    dmap = {k: float(v)
            for k, v in re.findall(r'"(\w+)":\s*([\d.]+)', decline.group(1))}
    if axis not in reg:
        fail(2, "int_decline is indexed by axis %r, which the emitted "
                 "registry does not carry (it has %s)" % (axis, sorted(reg)))
    if set(dmap) != set(reg[axis]):
        fail(2, "int_decline covers %s but axis %s carries %s — the parent's "
                 "source and its own emitted registry disagree; a world-line "
                 "on a missing position would have no climate track"
                 % (sorted(dmap), axis, sorted(reg[axis])))

    # the bonus: `if wl["X"] in ("X4", "X5"):` or `if wl["X"] == "X4":`
    bonus = re.search(
        r'if\s+wl\["(\w+)"\]\s*(?:in\s*\(([^)]*)\)|==\s*"(\w+)")\s*:\s*\n'
        r'\s*int_decline\s*-=\s*([\d.]+)', src)
    if not bonus:
        fail(2, "the int_decline bonus condition was not found in %s — it "
                 "carried a fixed C3 literal until r5 and must never carry "
                 "one again; fix the extractor" % src_path)
    b_axis = bonus.group(1)
    b_pos = (re.findall(r'"(\w+)"', bonus.group(2)) if bonus.group(2)
             else [bonus.group(3)])
    if b_axis not in reg or not set(b_pos) <= set(reg[b_axis]):
        fail(2, "the int_decline bonus is keyed on %s%s, which the emitted "
                 "registry does not carry" % (b_axis, b_pos))

    return {
        "intensity0": one(r'intensity\s*=\s*([\d.]+)\n'),
        "decline_axis": axis,
        "decline": dmap,
        "bonus": {"axis": b_axis, "positions": b_pos,
                  "amount": float(bonus.group(4))},
        "hours": one(r'twh\s*=\s*gw\s*\*\s*([\d.]+)'),
        "util": one(r'twh\s*=\s*gw\s*\*\s*[\d.]+\s*\*\s*([\d.]+)'),
        "floor": one(r'intensity\s*=\s*max\(([\d.]+),'),
        "_source": "extracted from AI Atlas worldlines.py at build time",
    }


def pull():
    dst = os.path.join(WEB, "data", "forecast")
    os.makedirs(dst, exist_ok=True)
    missing = []
    for n in FORECAST_FILES:
        src = os.path.join(ATLAS_FORECAST, n)
        if not os.path.isfile(src):
            missing.append(n)
            continue
        shutil.copy2(src, os.path.join(dst, n))
    if missing:
        fail(2, "missing staged forecast files in the Atlas: %s — run its "
                 "forecast_emit.py first" % missing)
    for n in TRUNK_FILES:
        src = os.path.join(ATLAS_TRUNK, n)
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(WEB, "data", n))
    for src, name in EXTRA:
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(WEB, "data", name))
    net_path = os.path.join(dst, "network.json")
    cp = climate_params(net_path)
    json.dump(cp, open(os.path.join(dst, "climate.json"), "w"))
    meta = json.load(open(net_path))
    print("pulled forecast/%d + trunk/%d · network %s dated %s · climate "
          "params extracted (intensity0=%s, floor=%s, decline on %s, bonus "
          "%s%s)"
          % (len(FORECAST_FILES), len(TRUNK_FILES), meta.get("version"),
             meta.get("date"), cp["intensity0"], cp["floor"],
             cp["decline_axis"], cp["bonus"]["axis"],
             cp["bonus"]["positions"]))


def coverage_gate():
    """Refuse to publish a registry the drawing cannot letter.

    Every authored string in `narrative.js` and every literal in `figures.js`
    is keyed on a position letter, and the letters are stable while their
    MEANINGS are not: r5 (2026-08-17) kept P1 and moved it from 'populist
    backlash' to 'acquiescence through use'. Composing r4 prose against an r5
    registry does not fail — it draws confident sentences that say the
    opposite of the world-line they label, in the largest lettering on the
    sheet. Nothing downstream catches that, so it is caught here.

    `web/data/registry-covered.json` is the drawing's own declaration of what
    it can say. Wire the new positions, then restate the coverage in the same
    commit as the prose.
    """
    cov_path = os.path.join(WEB, "data", "registry-covered.json")
    net_path = os.path.join(WEB, "data", "forecast", "network.json")
    reg, net = registry(net_path)
    if not os.path.isfile(cov_path):
        fail(4, "no coverage declaration at %s — the drawing must state "
                 "which registry its authored strings are keyed to" % cov_path)
    cov = json.load(open(cov_path))
    faults = []
    for ax in sorted(set(reg) | set(cov["axes"])):
        have, want = set(cov["axes"].get(ax, [])), set(reg.get(ax, []))
        if ax not in cov["axes"]:
            faults.append("axis %s (%s) is new: %s" % (
                ax, next(a["name"] for a in net["axes"] if a["key"] == ax),
                " ".join(sorted(want))))
        elif ax not in reg:
            faults.append("axis %s was withdrawn by the parent" % ax)
        elif have != want:
            faults.append("axis %s: registry has %s, the drawing covers %s"
                          % (ax, " ".join(sorted(want)), " ".join(sorted(have))))
    moved = [k for k, v in cov.get("meanings", {}).items()
             if any(p[0] == k and p[1] != v
                    for a in net["axes"] for p in a["positions"])]
    if moved:
        faults.append("%d positions kept their letter and changed meaning: %s"
                      % (len(moved), " ".join(sorted(moved))))
    if faults:
        fail(4, "REGISTRY MOVED — refusing to publish.\n  parent emits %s "
                 "(%s); the drawing is keyed to %s\n  %s\n"
                 "The sheet keeps serving the last coherent build. Re-key the "
                 "authored layer, then restate %s."
                 % (net.get("version"), net.get("date"), cov.get("version"),
                    "\n  ".join(faults), os.path.relpath(cov_path, ROOT)))
    print("coverage OK · %s · %d axes, %d positions"
          % (net.get("version"), len(reg), sum(len(v) for v in reg.values())))


def prose_gate():
    """Refuse to publish a passage that has drifted back into plumbing.

    The authored layer is rewritten by workflows often, and it drifts the same
    way every time: invented bodies performing invented procedures, and data
    centres standing in as the subject of a forecast about AI. August named
    both on 2026-08-19. `build/prose_gate.py` carries the check and the
    evidence; it exits 5 with the offending strings.
    """
    rc = subprocess.call([sys.executable,
                          os.path.join(ROOT, "build", "prose_gate.py")])
    if rc:
        fail(5, "prose gate refused the authored layer (see above)")


def main():
    dev = "--dev" in sys.argv
    if not dev:
        gate()
    pull()
    if dev:
        print("dev pull done — serve the repo and open /web/")
        return
    coverage_gate()
    prose_gate()
    stamp = _dt.datetime.now().strftime("%Y%m%d-%H%M")
    os.makedirs(DOCS, exist_ok=True)
    for item in os.listdir(DOCS):
        p = os.path.join(DOCS, item)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    for item in os.listdir(WEB):
        s = os.path.join(WEB, item)
        d = os.path.join(DOCS, item)
        shutil.copytree(s, d) if os.path.isdir(s) else shutil.copy2(s, d)
    # Stamp the BUILT copy, never the working one — the source stays `DEV` so a dev
    # server is never mistaken for a shipped sheet.
    idx_path = os.path.join(DOCS, "index.html")
    idx = open(idx_path).read()
    idx2, n = re.subn(r'window\.__BUILD = "[^"]*"',
                      'window.__BUILD = "%s"' % stamp, idx)
    if n != 1:
        fail(3, "__BUILD stamp point not found exactly once in web/index.html")
    # Version the ENTRY module too. Versioning only the imports leaves index.html loading a
    # bare `js/app.js`; a cached copy of that one file then pulls in its own old imports, so
    # the page reports the new stamp (which comes from index.html) while running the previous
    # build entirely. That is the exact "renders, and renders wrong" failure this guards.
    idx2, m = re.subn(r'(src=")js/app\.js(")', r'\1js/app.js?v=%s\2' % stamp, idx2)
    if m != 1:
        fail(3, "the entry module <script src=\"js/app.js\"> was not found exactly once; "
                 "an unversioned entry silently serves a stale module graph")
    open(idx_path, "w").write(idx2)
    # Version every module import, so a fresh app.js can never be served against a
    # stale draft.js. Rewritten in docs/ only.
    jsdir = os.path.join(DOCS, "js")
    rewrites = 0
    for name in sorted(os.listdir(jsdir)):
        if not name.endswith(".js"):
            continue
        p = os.path.join(jsdir, name)
        src = open(p).read()
        src2, k = re.subn(r"(from\s+'\./[A-Za-z0-9_-]+\.js)'",
                          r"\1?v=%s'" % stamp, src)
        rewrites += k
        open(p, "w").write(src2)
    if rewrites == 0:
        fail(3, "no module imports were versioned — the rewrite pattern no longer "
                 "matches; a stale-module cache failure would be silent")
    open(os.path.join(DOCS, ".nojekyll"), "w").write("")
    print("built docs/ · __BUILD=%s · entry + %d module imports versioned"
          % (stamp, rewrites))
    print("after push, verify the live stamp:")
    print("  curl -s https://augustg97.github.io/ai-futures-forecaster/ | "
          "grep -o '__BUILD = \"[^\"]*\"'")


if __name__ == "__main__":
    main()
