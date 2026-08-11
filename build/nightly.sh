#!/bin/bash
# nightly.sh — redraw the sheet after the AI Atlas has emitted.
# Exit codes: 0 published+verified · 1 the Atlas gate refused · 2 pull failed · 3 push/verify.
set -u
ROOT="/Users/augustgweon/Forecast Works"
cd "$ROOT" || exit 2

python3 build/build_site.py || exit 1     # the Atlas gate runs inside this
git add -A
git commit -q -m "Sheet redrawn $(date +%F)" || true
git push -q origin main || exit 3

WANT=$(grep -o '__BUILD = "[^"]*"' docs/index.html | head -1)
for i in $(seq 1 20); do
  sleep 15
  LIVE=$(curl -s https://augustg97.github.io/forecast-works/ | grep -o '__BUILD = "[^"]*"' | head -1)
  [ "$LIVE" = "$WANT" ] && { echo "live OK $WANT"; exit 0; }
done
echo "live still stale: want $WANT"
exit 3
