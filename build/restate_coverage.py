#!/usr/bin/env python3
"""Restate what the drawing can letter, from the registry it is now keyed to.

THE DECLARATION IS THE DRAWING'S OWN CLAIM, so it is restated deliberately and in the same commit
as the prose it describes — never derived at build time, which would make the gate agree with
itself. This script exists to stop the restatement being a hand-typed list of sixty-one entries;
it reads the pulled network and writes what is there, and the operator's job is to have wired the
prose first. `--check` reports the difference without writing.

    python3 build/restate_coverage.py [--check]
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COV = os.path.join(ROOT, "web", "data", "registry-covered.json")
NET = os.path.join(ROOT, "web", "data", "forecast", "network.json")


def main():
    check = "--check" in sys.argv
    net = json.load(open(NET, encoding="utf-8"))
    cov = json.load(open(COV, encoding="utf-8"))
    new = {
        "version": net["version"],
        "axes": {a["key"]: [p[0] for p in a["positions"]] for a in net["axes"]},
        "meanings": {p[0]: p[1] for a in net["axes"] for p in a["positions"]},
    }
    added_ax = sorted(set(new["axes"]) - set(cov["axes"]))
    gone_ax = sorted(set(cov["axes"]) - set(new["axes"]))
    added_pos = sorted(set(new["meanings"]) - set(cov["meanings"]))
    moved = sorted(k for k, v in cov["meanings"].items()
                   if k in new["meanings"] and new["meanings"][k] != v)
    print("registry %s -> %s" % (cov["version"], new["version"]))
    print("  axes added   :", " ".join(added_ax) or "none")
    print("  axes withdrawn:", " ".join(gone_ax) or "none")
    print("  positions added:", " ".join(added_pos) or "none")
    print("  positions that kept a letter and changed meaning:", " ".join(moved) or "none")
    if moved:
        for k in moved:
            print("     %s: %r -> %r" % (k, cov["meanings"][k], new["meanings"][k]))
    if check:
        return
    json.dump(new, open(COV, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print("restated %s · %d axes, %d positions"
          % (os.path.relpath(COV, ROOT), len(new["axes"]), len(new["meanings"])))


if __name__ == "__main__":
    main()
