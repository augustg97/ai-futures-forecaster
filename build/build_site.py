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


def gate():
    if os.environ.get("SKIP_AUDIT") == "1":
        print("SKIP_AUDIT=1 — the Atlas gate was skipped. Say so out loud, "
              "and say why.")
        return
    if not os.path.isfile(ATLAS_GATE):
        sys.exit("cannot find the Atlas gate at %s — this project has no "
                 "data of its own and must not publish unaudited" % ATLAS_GATE)
    rc = subprocess.call([sys.executable, ATLAS_GATE])
    if rc != 0:
        sys.exit("Atlas gate FAILED (rc=%d) — refusing to publish" % rc)


def climate_params():
    """The parent's `tracks()` computes the climate coupling from constants
    written inline in `worldlines.py`, and `engine.json` does not carry them
    — so a composed (client-side) world-line would have no TWh/CO2 track.

    Rather than mirror the numbers into JS by hand (the failure this whole
    project's single-source rule exists to prevent) or edit the parent to
    export them, this EXTRACTS them from the parent's source at build time.
    A parse failure is fatal: a silently missing climate track would render
    as a blank instrument, which is worse than a refused build.
    """
    src_path = os.path.join(ATLAS, "Research", "timelines", "worldlines.py")
    src = open(src_path).read()
    def one(pat, cast=float):
        m = re.search(pat, src)
        if not m:
            sys.exit("climate parameter not found in %s: /%s/ — the parent's "
                     "tracks() changed shape; fix the extractor rather than "
                     "hardcoding" % (src_path, pat))
        return cast(m.group(1))
    decline = re.search(r'int_decline\s*=\s*\{([^}]*)\}\[wl\["S"\]\]', src)
    if not decline:
        sys.exit("int_decline map not found in %s" % src_path)
    dmap = dict(re.findall(r'"(S\d)":\s*([\d.]+)', decline.group(1)))
    if set(dmap) != {"S1", "S2", "S3"}:
        sys.exit("int_decline map has unexpected keys: %s" % sorted(dmap))
    return {
        "intensity0": one(r'intensity\s*=\s*([\d.]+)\n'),
        "decline": {k: float(v) for k, v in dmap.items()},
        "c3_bonus": one(r'int_decline\s*-=\s*([\d.]+)'),
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
        sys.exit("missing staged forecast files in the Atlas: %s — run its "
                 "forecast_emit.py first" % missing)
    for n in TRUNK_FILES:
        src = os.path.join(ATLAS_TRUNK, n)
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(WEB, "data", n))
    for src, name in EXTRA:
        if os.path.isfile(src):
            shutil.copy2(src, os.path.join(WEB, "data", name))
    cp = climate_params()
    json.dump(cp, open(os.path.join(dst, "climate.json"), "w"))
    meta = json.load(open(os.path.join(dst, "network.json")))
    print("pulled forecast/%d + trunk/%d · network %s dated %s · climate "
          "params extracted (intensity0=%s, floor=%s)"
          % (len(FORECAST_FILES), len(TRUNK_FILES), meta.get("version"),
             meta.get("date"), cp["intensity0"], cp["floor"]))


def main():
    dev = "--dev" in sys.argv
    if not dev:
        gate()
    pull()
    if dev:
        print("dev pull done — serve the repo and open /web/")
        return
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
        sys.exit("__BUILD stamp point not found exactly once in web/index.html")
    # Version the ENTRY module too. Versioning only the imports leaves index.html loading a
    # bare `js/app.js`; a cached copy of that one file then pulls in its own old imports, so
    # the page reports the new stamp (which comes from index.html) while running the previous
    # build entirely. That is the exact "renders, and renders wrong" failure this guards.
    idx2, m = re.subn(r'(src=")js/app\.js(")', r'\1js/app.js?v=%s\2' % stamp, idx2)
    if m != 1:
        sys.exit("the entry module <script src=\"js/app.js\"> was not found exactly once; "
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
        sys.exit("no module imports were versioned — the rewrite pattern no longer "
                 "matches; a stale-module cache failure would be silent")
    open(os.path.join(DOCS, ".nojekyll"), "w").write("")
    print("built docs/ · __BUILD=%s · entry + %d module imports versioned"
          % (stamp, rewrites))
    print("after push, verify the live stamp:")
    print("  curl -s https://augustg97.github.io/forecast-works/ | "
          "grep -o '__BUILD = \"[^\"]*\"'")


if __name__ == "__main__":
    main()
