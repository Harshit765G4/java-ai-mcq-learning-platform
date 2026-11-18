# Question-bank quality audit — release v2

## What was wrong with the initial bank

The uploaded source contained 500 records split into 300 syllabus, 100 code, and 100 extension questions. The review found that **all 300 syllabus questions formed 150 repeated pairs**, and **all 100 extension questions formed 50 repeated pairs**: one definition question followed by a lightly reworded scenario testing the same fact with the same four options and explanation (sometimes reordered). In the code bank, **88 of 100 prompts** used a generic stem such as “What is printed?” or “What happens?” that did not state what detail the learner should trace.

Several answer sets made questions easier through elimination rather than knowledge. Examples included one-word distractors from unrelated areas (for example, choosing a visualization library against a web framework), made-up method names, and option sets mixing a concept, an API name, and an output value. There was also at least one code prompt whose answer mentioned behavior not present in the snippet.

## What changed in v2

- Retained the **500-question total**, the three bank sizes (300 / 100 / 100), all existing IDs, and all global question numbers.
- Replaced one question from each repeated syllabus pair with a new, distinct syllabus-aligned learning objective. The resulting syllabus bank now contains 300 distinct prompts.
- Replaced one item from each repeated extension pair with a distinct adjacent Python/software-engineering concept.
- Rewrote all 100 code-question stems so each one asks about the particular operation, output, type, shape, mutation, exception, SQL operation, HTTP behavior, or framework behavior shown in its snippet. Code practice now also includes a regular-expression search example.
- Reworked weak options into four distinct, parallel alternatives from the same conceptual family. Where useful, options now describe both the construct and what it does rather than presenting isolated labels.
- Added more precise explanations for commonly confused behaviors, including `is` vs `==`, `break` vs `continue`, `append` vs `extend`, `sort()` vs `sorted()`, `map()` vs `filter()`, method overloading vs overriding, `super()` and MRO, tuple mutability, NumPy views/copies/axes/broadcasting/reshape, Pandas indexing and joins, transaction rollback, and HTTP request handling.
- Corrected the final Requests question so the answer is limited to the behavior actually demonstrated by its `timeout` and `raise_for_status()` calls.
- Preserved the reference library and its expanded material for NumPy/SciPy, Pandas, visualization, databases, Flask/Django, and Requests/urllib/Scrapy.
- Changed the local-save version. Candidate name and timer preference can carry forward from the old local save; old answer selections/results do not, because option order and answer keys may have changed under the same stable question IDs.

## Bank structure

| Bank | IDs | Count | Purpose |
|---|---|---:|---|
| Syllabus | `S-001` onward | 300 | Theory from Sessions 1–22, excluding lab assignments |
| Code | `C-001` onward | 100 | Code tracing and practical Python/library behavior |
| Extension | `X-001` onward | 100 | Related concepts beyond the stated syllabus |

Difficulty labels are `easy` (Basic), `medium`, `hard`, and `expert`. Topic filters remain connected to the reference guides using `topicId` and `referenceId`.

## Where to edit questions

**Canonical file:** `data/questions.json`

This is the only file to edit for question content. The app loads generated `data/questions.js`; do not edit that generated file manually. After editing the JSON, run validation and regenerate the browser bundle:

```bash
python scripts/validate_bank.py
python scripts/sync_data.py
```

Templates:

- `data/question-template.json` — syllabus and extension concept questions.
- `data/question-template-code.json` — code questions; includes the `code` field.

Stable ID rules:

- Existing IDs and global question numbers are permanent; do not recycle them.
- Add the next syllabus ID as `S-301`, the next code ID as `C-101`, and the next extension ID as `X-101`.
- Assign each new item a unique global `number` greater than the current maximum.
- `topicId` must match an item in `data/meta.json`; `referenceId` must match a guide in `data/references.json`.
- If a new topic is genuinely needed, add its label in `data/meta.json` and add a complete study guide in `data/references.json` before running the validator.

## MCQ authoring standard

Before adding a question, check all of the following:

1. **Learning objective:** Does it test a different fact, decision, code behavior, or edge case from existing questions?
2. **Prompt quality:** Is the question clear and answerable without guessing the examiner’s intention? For code, is the snippet complete enough to reason about?
3. **Single best answer:** Is exactly one option fully correct under the stated assumptions and Python/library version?
4. **Distractor quality:** Are the other three options plausible misconceptions from the same topic and same level of abstraction? Avoid joke options, nonexistent APIs unless the question tests API validity, and unrelated module names.
5. **Explanation:** Does it teach the rule and distinguish the closest wrong answer, not merely restate the correct option?
6. **Difficulty:** Basic = direct understanding; Medium = apply one rule; Hard = combine multiple rules or diagnose a likely defect; Expert = subtle semantics, edge cases, or trade-offs.
7. **Reference:** Can a learner open the linked topic note and study the relevant concept?

For code questions, manually trace the snippet before entering its answer key. Check imports, input values, types, loop boundaries, aliasing/mutation, exceptions, DataFrame/array shapes, and library-specific semantics. Do not claim that a snippet performs behavior that is not present in the code.

## Validation scope and limitation

`scripts/validate_bank.py` checks structure, unique IDs and numbers, contiguous numbering, prompt uniqueness, four distinct options, valid answer indexes, topic/reference links, bank totals, difficulty values, and required code snippets. These checks can catch data-integrity problems; they cannot prove that a technically plausible answer key is semantically correct. New questions should still receive a manual content review and a code-trace check before use in a mock test.
