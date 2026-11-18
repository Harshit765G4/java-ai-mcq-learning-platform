# AI Programming Prep V3

A static, responsive PGCP-AI practice platform for Python and Java.

## Included banks

- Python: 300 core, 100 code, 100 extension (500 total)
- Java: 300 core, 100 practical, 100 extension (500 total)
- Combined: 1,000 questions

## Run locally

This is a static HTML/CSS/JavaScript application. Open `index.html` directly or serve the folder with a local static server. For example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Data maintenance

Canonical data lives in `data/questions.json`, `data/meta.json`, and `data/references.json`. After editing JSON, regenerate browser data:

```bash
python scripts/sync_data.py
python scripts/validate_v3.py
```

Question records require a stable unique ID, subject (`python` or `java`), bank, topic ID, difficulty, four distinct options, answer index, explanation, hint, and reference ID. Code questions should include a `code` field.

## Vercel

Import the GitHub repository into Vercel. Select Framework Preset `Other`, leave Build Command blank, and set Output Directory to `.`. The project is static and requires no Node build step.

## Quality note

See `QUESTION_QUALITY_AUDIT_V3.md`. Structural checks do not prove semantic uniqueness or runtime correctness. Execute code questions and review generated question wording before relying on every item for a high-stakes exam.
