#!/usr/bin/env python3
"""Write the coherent-paragraph pass into web/js/narrative.js.

August, on reading the previous build: "Lots of repetition across sentences in headers - the whole
paragraph should be a well written paragraph for each header. And they can be longer to be
coherent. And for continuity, it may make sense to reference the particular control and its
effect, similar to our AI capabilities topic sentences." And: "Too many colons and semicolons."

His model, which the brief carried verbatim:
  2030: Large majorities of the public in most industrialized countries oppose AI development,
        cutting across political and economic lines.
  2035: Populist candidates running on anti-AI platforms win elections in the US and EU for the
        first time, but they fail to respond to the pace of change.

THE HEADLINE AGENTS AND THE PASSAGE AGENTS RETURN THE SAME SHAPE, so they are told apart by the
instruction each was given, which its own transcript records. Length cannot do it: a headline
clause and a short paragraph are the same size.

    python3 build/apply_coherent.py <journal.jsonl>
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from apply_authored import dates, lit, replace_table  # noqa: E402

NARR = Path(__file__).resolve().parent.parent / 'web' / 'js' / 'narrative.js'
STAGES = ('s1', 's2', 's3', 's4', 's5', 's6')
LOOSE = re.compile(r',\s+(and|but|so|which|who|when|where|while)\s')


def results(journal):
    run = Path(journal).parent
    for line in Path(journal).read_text(encoding='utf-8').splitlines():
        try:
            r = json.loads(line)
        except ValueError:
            continue
        if r.get('type') != 'result':
            continue
        v = r.get('result') or {}
        if not isinstance(v, dict):
            continue
        where = 'unknown'
        tr = run / ('agent-%s.jsonl' % r.get('agentId', ''))
        if tr.exists():
            body = tr.read_text(encoding='utf-8', errors='ignore')[:120000]
            if 'REWRITE THE PASSAGE PARAGRAPHS' in body:
                where = 'passage'
            elif 'REWRITE THE HEADLINE CLAUSES' in body:
                where = 'head'
        yield where, v


def read_table(src, name):
    m = re.search(r'(?:export )?const %s = \{' % name, src)
    i = m.end()
    depth = 1
    while i < len(src) and depth:
        c = src[i]
        if c == '"':
            i = src.index('"', i + 1)
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
        i += 1
    flat = re.sub(r'"\s*\+\s*\n?\s*"', '', src[m.end():i])
    out = {}
    for row in re.finditer(r'\n  ([A-Z]\d+): \{([^}]*)\}', flat):
        r = {}
        for f in re.finditer(r'(s\d): "((?:[^"\\]|\\.)*)"', row.group(2)):
            r[f.group(1)] = f.group(2)
        if r:
            out[row.group(1)] = r
    return out


def emit(table):
    body = []
    for k in sorted(table, key=lambda x: (x[0], int(x[1:]))):
        rows = ',\n'.join('        %s: %s' % (st, lit(dates(table[k][st]), 12))
                          for st in STAGES if table[k].get(st))
        body.append('  %s: {\n%s },\n' % (k, rows))
    return ''.join(body)


def marks(texts):
    sents = [x.strip() for t in texts for x in re.split(r'(?<=[.!?])\s+', t)
             if len(x.strip()) > 25]
    n = max(1, len(sents))
    return {
        'plain': sum(1 for x in sents if not re.search(r'[;—]|\w:\s|,\s+and\s', x)
                     and not re.match(r'(Because|Since|While|Although|When|As|Having|With)\b', x)),
        'semicolon': sum(1 for x in sents if ';' in x),
        'colon': sum(1 for x in sents if re.search(r'\w:\s', x)),
        'loose': sum(1 for x in sents if LOOSE.search(x)),
        'n': len(sents),
    }


def main():
    heads, paras = {}, {}
    for where, v in results(sys.argv[1]):
        for p in (v.get('positions') or []):
            k = p.get('key')
            if not k:
                continue
            target = heads if where == 'head' else paras if where == 'passage' else None
            if target is None:
                continue
            for st in STAGES:
                if p.get(st):
                    target.setdefault(k, {})[st] = p[st].strip()
    print('headline clauses %d · passage paragraphs %d'
          % (sum(len(v) for v in heads.values()), sum(len(v) for v in paras.values())))

    src = NARR.read_text(encoding='utf-8')
    cur_h, cur_f = read_table(src, 'HEADCL'), read_table(src, 'FRAG')
    for k, rows in heads.items():
        cur_h.setdefault(k, {}).update(rows)
    for k, rows in paras.items():
        cur_f.setdefault(k, {}).update(rows)
    src = replace_table(src, 'HEADCL', emit(cur_h))
    src = replace_table(src, 'FRAG', emit(cur_f))
    NARR.write_text(src, encoding='utf-8')

    for name, t in (('headline', cur_h), ('passage', cur_f)):
        m = marks([x for r in t.values() for x in r.values()])
        print('%-9s %4d sentences · plain %3.0f%% · semicolon %3.0f%% · colon %3.0f%% · loose %3.0f%%'
              % (name, m['n'], 100 * m['plain'] / m['n'], 100 * m['semicolon'] / m['n'],
                 100 * m['colon'] / m['n'], 100 * m['loose'] / m['n']))
    print('written', NARR)


if __name__ == '__main__':
    main()
