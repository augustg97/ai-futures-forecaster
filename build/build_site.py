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
#   8 the client's port diverges from the parent's emission ·
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


def registry_drift(ref="HEAD"):
    """Announce a registry that changed CONTENT, whatever its version says.

    The nightly's only registry announcement used to be the version string
    printed by `pull()`. On 2026-08-24 the parent's weekly schema review added
    a sub-axis, `D.watch-labor`, and emitted it under the SAME version,
    `r8-2026-08-20`, with the same changelog: the registry moved and every
    watcher keyed to the version string saw a quiet night. Same family as
    every defect this project has found — a surface reading a proxy for the
    quantity it claims to report.

    This reads nothing but the emitted file and the last committed copy of it,
    and it never refuses a build. The coverage gate owns refusal, and it owns
    the right things: an axis or a position the authored layer cannot letter.
    A sub-axis needs no re-keying, because `axisNotes()` derives its block from
    the data and draws an `origin`-carrying one as provisional. It still has to
    be SAID, because a new sub-axis is the parent telling us an axis is hearing
    events no rule explains.
    """
    net_path = os.path.join(WEB, "data", "forecast", "network.json")
    now = json.load(open(net_path))
    try:
        prev = json.loads(subprocess.check_output(
            ["git", "show", ref + ":web/data/forecast/network.json"],
            cwd=ROOT, stderr=subprocess.DEVNULL).decode("utf-8"))
    except Exception:
        print("registry drift · no previous build committed, nothing to compare")
        return

    def shape(d):
        ax, pos, sub = {}, {}, {}
        for a in d["axes"]:
            ax[a["key"]] = a.get("name", "")
            pos[a["key"]] = [p[0] for p in a["positions"]]
            sub[a["key"]] = {s["key"]: bool(s.get("origin"))
                             for s in (a.get("subaxes") or [])}
        return ax, pos, sub

    pax, ppos, psub = shape(prev)
    nax, npos, nsub = shape(now)
    moves = []
    for k in sorted(set(nax) - set(pax)):
        moves.append("axis %s (%s) is new" % (k, nax[k]))
    for k in sorted(set(pax) - set(nax)):
        moves.append("axis %s was withdrawn" % k)
    for k in sorted(set(nax) & set(pax)):
        gained = [x for x in npos[k] if x not in ppos[k]]
        lost = [x for x in ppos[k] if x not in npos[k]]
        if gained or lost:
            moves.append("axis %s positions: +%s -%s"
                         % (k, " ".join(gained) or "none",
                            " ".join(lost) or "none"))
        for s in sorted(set(nsub[k]) - set(psub.get(k, {}))):
            moves.append("sub-axis %s is new%s"
                         % (s, " · added by the schema review on its own "
                              "authority, drawn as provisional"
                            if nsub[k][s] else ""))
        for s in sorted(set(psub.get(k, {})) - set(nsub[k])):
            moves.append("sub-axis %s was withdrawn" % s)
    if len(now.get("conditionals", [])) != len(prev.get("conditionals", [])):
        moves.append("conditionals: %d to %d"
                     % (len(prev.get("conditionals", [])),
                        len(now.get("conditionals", []))))

    if not moves:
        print("registry drift · none · %s" % now.get("version"))
        return
    same_version = now.get("version") == prev.get("version")
    print("REGISTRY DRIFT · %s dated %s%s"
          % (now.get("version"), now.get("date"),
             "  ← THE VERSION STRING DID NOT MOVE; the registry did"
             if same_version else
             "  (was %s)" % prev.get("version")))
    for m in moves:
        print("  " + m)


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
    # THE RESEARCHED FIGURES ARE DECLARED TOO (P5). The 26 r4 figures moved under the r5
    # rebuild in silence because only the authored strings were declared; each now names
    # the live position it keys to, or is withdrawn, and a destination the registry does
    # not carry is a fault.
    live = {p for ps in reg.values() for p in ps}
    for k, dest in (cov.get("researched") or {}).items():
        if dest is not None and dest not in live:
            faults.append("researched figure %s keys to %s, which the registry does not carry"
                          % (k, dest))
    if faults:
        fail(4, "REGISTRY MOVED — refusing to publish.\n  parent emits %s "
                 "(%s); the drawing is keyed to %s\n  %s\n"
                 "The sheet keeps serving the last coherent build. Re-key the "
                 "authored layer, then restate %s."
                 % (net.get("version"), net.get("date"), cov.get("version"),
                    "\n  ".join(faults), os.path.relpath(cov_path, ROOT)))
    print("coverage OK · %s · %d axes, %d positions"
          % (net.get("version"), len(reg), sum(len(v) for v in reg.values())))
    table_coverage()


def node_bin():
    """The nightly runs from a scheduled task whose PATH may not carry Homebrew."""
    for cand in [shutil.which("node"), "/opt/homebrew/bin/node", "/usr/local/bin/node"]:
        if cand and os.path.isfile(cand):
            return cand
    return None


def table_coverage():
    """Refuse a position the authored TABLES cannot letter, whatever the declaration says.

    The declaration is the drawing's claim about itself, and on 2026-09-01 it claimed K4 while
    HEADCL and FRAG had no K4 row — a path carrying it drew no takeoff clause, silently. The
    tables are read by `build/table_coverage.mjs`; a missing HEADCL or FRAG row refuses, the
    LONGFORM and PROCESS gaps and the CROSS pairings are reported.
    """
    node = node_bin()
    if not node:
        print("TABLE COVERAGE SKIPPED — node not found; the tables were not checked. "
              "Say so out loud.")
        return
    raw = subprocess.check_output(
        [node, os.path.join(ROOT, "build", "table_coverage.mjs")], cwd=ROOT)
    tc = json.loads(raw.decode("utf-8"))
    miss = tc["missing"]
    if miss["CRITERION"] or miss["TEMPLATE_TEXT"]:
        fail(4, "AUTHORED TABLES CANNOT LETTER THE ENGINE — refusing to publish.\n"
                 "  CRITERION lacks positions: %s\n  TEMPLATE_TEXT lacks templates: %s\n"
                 "A path carrying one of these draws the parent's own words for it, or "
                 "nothing. Write the rows, then rebuild."
                 % (" ".join(miss["CRITERION"]) or "none",
                    " ".join(miss["TEMPLATE_TEXT"]) or "none"))
    print("tables OK · a criterion for all %d positions · text for all %d templates · "
          "onset rules on %d positions · LONGFORM lacks %s"
          % (tc["positions"], tc["templates"], tc["onsetRules"],
             " ".join(miss["LONGFORM"]) or "none"))


def count_gate():
    """Refuse to publish an authored count the registry has outgrown.

    The coverage gate catches a position that changed meaning, because the
    drawing declares which letters it letters. It cannot catch a SENTENCE.
    Three of them survived both rebuilds of 17 and 18 August still asserting
    r4 — 'ALL 26 POSITIONS', 'Every position now carries at least one source',
    'A dossier now stands behind each variable' — and a fourth asserted four
    missing network edges that the parent had since drawn.

    A letter inherits a new MEANING and is wrong about one row. A quantifier
    inherits a new DOMAIN and is wrong about every member the rebuild added.
    `build/counts_gate.py` carries the rule and exits 6.
    """
    rc = subprocess.call([sys.executable,
                          os.path.join(ROOT, "build", "counts_gate.py")])
    if rc:
        fail(6, "count gate refused the authored layer (see above)")


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


def port_gate():
    """The client's port of the engine must reproduce the parent's own emission.

    A conditioned path on the sheet is drawn by web/js/engine.js, written against
    the constants the parent emits (rule 10). Two implementations of one model
    are safe only while something checks that they agree — on 2026-08-17 they
    silently did not — so build/port_gate.mjs recomputes the parent's emitted
    knots and tracks for the mainline and a sample of exemplars, given the
    parent's own events, and refuses on any divergence past the parent's
    rounding. Exit 8.
    """
    rc = subprocess.call([node_bin(), os.path.join(ROOT, "build", "port_gate.mjs")], cwd=ROOT)
    if rc != 0:
        fail(8, "the port diverges from the parent's emission (see above)")


def readout_gate():
    """Judge the COMPOSED readout: provenance, the language standard, and sanity of quantities.

    `build/readout_gate.py` runs the composer over the likeliest path and a set of exemplars
    and reads what the sheet would letter (plan-2026-09-02, P0). Since the chronicle composer
    landed (P1) it is STRICT: a composed line without a source, a headline that breaks the
    language standard's assembler rules, or a Since-2026 entry drawn in full for more than
    three years running refuses the publish with exit 7. READOUT_STRICT=0 drops it to report
    mode, out loud, for a night when the composer must ship with a known fault.
    """
    strict = os.environ.get("READOUT_STRICT", "1") != "0"
    rc = subprocess.call([sys.executable,
                          os.path.join(ROOT, "build", "readout_gate.py")]
                         + (["--strict"] if strict else []))
    if rc:
        fail(7, "readout gate refused the composed passage (see above)")


def main():
    dev = "--dev" in sys.argv
    if not dev:
        gate()
    pull()
    if dev:
        print("dev pull done — serve the repo and open /web/")
        return
    registry_drift()
    coverage_gate()
    count_gate()
    prose_gate()
    port_gate()
    readout_gate()
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
