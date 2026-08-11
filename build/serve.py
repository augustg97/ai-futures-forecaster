#!/usr/bin/env python3
"""serve.py — the dev server. Dev never caches; production always versions.

A plain `http.server` lets the browser hold an ES module by URL, so an edit to draft.js can be
invisible while index.html reloads perfectly — the mixed-set failure, in development. This
sends `Cache-Control: no-store` on everything.
"""
import http.server
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "web")


class NoStore(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8154
    print("serving %s on :%d (no-store)" % (ROOT, port))
    http.server.ThreadingHTTPServer(("", port), NoStore).serve_forever()
