# V3.2 fixes

1. **Answer positions** - 324/500 Java and 349/500 Python answers were option A (all 100 Java practical were A). Options are now shuffled with a seeded script (`scripts/rebalance_options.py`): exactly 125 each of A/B/C/D per subject, evenly spread inside every bank, no back-to-back repeats. Question text, option text and question counts are unchanged; `optionExplanations`, `answerIndex`, `correctAnswer` and the one literal "option B" reference (CORE-0011) were remapped.
2. **Saved progress** - storage key bumped to `pgcpai_combined_quiz_v4` so old results (scored against the old option order) are not reused. Name and timer carry over.
3. **Filter panel** - the left sidebar now scrolls (vertical + horizontal, thin scrollbar) instead of clipping on short screens; the question map has a fixed 280px height; bank list scrolls sideways if narrow.
4. `dist/` rebuilt.

Checks: all 1,000 questions clicked through in the UI (right + wrong answers scored correctly, status filters match); all 100 Java practical code answers executed on Java 21 and matched the key.
