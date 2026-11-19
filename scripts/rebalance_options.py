#!/usr/bin/env python3
"""Randomise option order so correct answers are spread evenly across A-D.

Deterministic (seeded) so re-running gives the same result. Keeps optionExplanations,
answerIndex and correctAnswer aligned, and remaps literal "option X" references.
Questions whose options depend on position ("all of the above" etc.) are left alone.
Question text, option text and the number of questions are never changed.
"""
import json, random, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSITIONAL = re.compile(r'\b(all|none|both|neither)\b[^.]{0,25}\b(above|these)\b|^\(?[A-D][).:]\s', re.I)
LETTER_REF = re.compile(r'\b([Oo]ption )([A-D])\b')
L = 'ABCD'

def permute(q, new_answer, rng):
    old = q.get('answerIndex', q.get('correctAnswer'))
    others = [i for i in range(4) if i != old]
    rng.shuffle(others)
    order = []  # order[new_pos] = old_index
    it = iter(others)
    for p in range(4):
        order.append(old if p == new_answer else next(it))
    inv = {o: n for n, o in enumerate(order)}
    q['options'] = [q['options'][o] for o in order]
    if 'optionExplanations' in q:
        q['optionExplanations'] = [q['optionExplanations'][o] for o in order]
    remap = lambda t: LETTER_REF.sub(lambda m: m.group(1) + L[inv[L.index(m.group(2))]], t)
    q['explanation'] = remap(q['explanation'])
    if 'optionExplanations' in q:
        q['optionExplanations'] = [remap(t) for t in q['optionExplanations']]
    q['answerIndex'] = new_answer
    if 'correctAnswer' in q: q['correctAnswer'] = new_answer

def rebalance(questions, key=lambda q: (q.get('subject'), q.get('bank')), seed=20260619):
    rng = random.Random(seed)
    groups = {}
    for q in questions:
        groups.setdefault(key(q), []).append(q)
    for g in groups.values():
        movable = [q for q in g if not any(POSITIONAL.search(o) for o in q['options'])]
        for i in range(0, len(movable), 4):
            block = [0, 1, 2, 3]; rng.shuffle(block)
            # avoid same answer back-to-back across block boundaries
            if i and block[0] == movable[i-1]['answerIndex']:
                block[0], block[1] = block[1], block[0]
            for q, t in zip(movable[i:i+4], block):
                permute(q, t, rng)

if __name__ == '__main__':
    p = ROOT / 'data' / 'questions.json'
    qs = json.loads(p.read_text(encoding='utf-8'))
    rebalance(qs)
    p.write_text(json.dumps(qs, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    # legacy React data (unused by index.html, kept consistent)
    for f in (ROOT / 'src' / 'data').glob('questions-*.json'):
        d = json.loads(f.read_text(encoding='utf-8'))
        for q in d: q['answerIndex'] = q['correctAnswer']
        rebalance(d, key=lambda q: q['bank'])
        for q in d: q.pop('answerIndex', None)
        f.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('done')
