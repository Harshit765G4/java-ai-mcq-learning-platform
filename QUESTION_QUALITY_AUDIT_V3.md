# V3 Question Quality Audit

## Bank counts

| Subject | Core | Practical / Code | Extension | Total |
|---|---:|---:|---:|---:|
| Python | 300 | 100 | 100 | 500 |
| Java | 300 | 100 | 100 | 500 |
| **Total** | **600** | **200** | **200** | **1,000** |

## Validation

The V3.1 browser release also normalizes the 148 `basic` difficulty records to the `easy` key used by the UI, so the Basic filter now matches the stored questions.

Run `python scripts/validate_v3.py` to check required fields, four distinct options, answer indexes, IDs, subject/global numbering, topic mappings, reference mappings, and code snippets.

The current structural validation reports zero errors. It emits short-option warnings, mainly for exact code outputs and concise values. Structural validation is not a substitute for manually reviewing every answer and running every code sample on Java 17 / the relevant Python version.

## Important content-quality limitation

The Java bank combines the previously authored Java questions with additional generated records to reach the requested 300/100/100 distribution. Some of the added conceptual and extension items use broad rule-oriented wording, and some practical cases are template-based. They are structurally valid but should be reviewed and strengthened before treating the bank as a fully human-reviewed examination bank. The count is not a claim that all 500 questions have been independently peer-reviewed for semantic originality.

The Python bank retains the existing 500-question set. It has not been expanded to 700 in this release.
