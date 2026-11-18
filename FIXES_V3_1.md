# V3.1 page fixes

This patch addresses mismatches found in the V3 ZIP:

1. The page still contained old 727-total placeholders and old 50-count Java practical placeholder even though the JSON had 1,000 questions and 100 Java practical questions.
2. The Basic difficulty filter submitted `easy`, but 148 question records used `basic`, so those questions could not be found using that filter. The data now uses the UI's `easy` key consistently.
3. The Python code bank was shown with a zero count when Java was selected, and the Java practical bank was shown with a zero count when Python was selected. Irrelevant bank buttons are now hidden for single-subject mode.

Validation performed:
- 1,000 records parsed.
- Python: 300 core + 100 code + 100 extension.
- Java: 300 core + 100 practical + 100 extension.
- Structural errors: 0.
- JavaScript syntax checks passed for the app and generated data scripts.

Note: The 88 concise-option review warnings remain. The validator checks structure, not semantic originality or subject-matter correctness. The page also needs to be deployed with its complete folder tree; see VERCEL_DEPLOY.md.
