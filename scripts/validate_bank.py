#!/usr/bin/env python3
"""Validate the quality and structural integrity of the editable MCQ banks."""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MINIMUM_BANKS = {"core": 300, "code": 100, "extension": 100}
PREFIXES = {"core": "S", "code": "C", "extension": "X"}
DIFFICULTIES = {"easy", "medium", "hard", "expert"}
GENERIC_CODE_STEMS = {
    "what is printed?", "what happens?", "what is the output?", "what is the result?"
}


def read_json(name: str):
    with (DATA / name).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", str(text).strip().casefold())


def main() -> None:
    questions = read_json("questions.json")
    meta = read_json("meta.json")
    references = read_json("references.json")
    errors: list[str] = []
    warnings: list[str] = []

    ids = [q.get("id") for q in questions]
    numbers = [q.get("number") for q in questions]
    if len(ids) != len(set(ids)):
        errors.append("Question IDs are not unique.")
    if len(numbers) != len(set(numbers)):
        errors.append("Global question numbers are not unique.")
    if numbers and set(numbers) != set(range(1, len(questions) + 1)):
        errors.append("Global question numbers must be contiguous from 1 through the question count.")

    topic_ids = {topic.get("id") for topic in meta.get("topics", [])}
    prompts: dict[str, list[str]] = defaultdict(list)
    repeated_content: dict[tuple, list[str]] = defaultdict(list)
    bank_counts = Counter(q.get("bank") for q in questions)
    topic_counts = Counter((q.get("bank"), q.get("topicId")) for q in questions)
    difficulty_counts = Counter(q.get("difficulty") for q in questions)

    for q in questions:
        qid = str(q.get("id", "<missing-id>"))
        bank = q.get("bank")
        prefix = PREFIXES.get(bank)
        if not prefix or not re.fullmatch(rf"{prefix}-\d{{3,}}", qid):
            errors.append(f"{qid}: ID prefix does not match bank '{bank}'.")

        number = q.get("number")
        if not isinstance(number, int) or isinstance(number, bool) or number < 1:
            errors.append(f"{qid}: global number must be a positive integer.")

        prompt = q.get("question")
        if not isinstance(prompt, str) or not prompt.strip():
            errors.append(f"{qid}: question prompt is empty.")
        else:
            prompts[normalize(prompt)].append(qid)

        options = q.get("options")
        if not isinstance(options, list) or len(options) != 4:
            errors.append(f"{qid}: exactly four answer options are required.")
        else:
            if any(not isinstance(option, str) or not option.strip() for option in options):
                errors.append(f"{qid}: every answer option must be a non-empty string.")
            elif len({normalize(option) for option in options}) != 4:
                errors.append(f"{qid}: answer options must be distinct after whitespace/case normalization.")

        answer_index = q.get("answerIndex")
        if not isinstance(answer_index, int) or isinstance(answer_index, bool) or not 0 <= answer_index < 4:
            errors.append(f"{qid}: answerIndex must be an integer from 0 to 3.")

        if q.get("difficulty") not in DIFFICULTIES:
            errors.append(f"{qid}: difficulty must be one of {sorted(DIFFICULTIES)}.")
        if q.get("kind") not in {"concept", "code"}:
            errors.append(f"{qid}: kind must be 'concept' or 'code'.")
        if not isinstance(q.get("explanation"), str) or len(q["explanation"].strip()) < 25:
            errors.append(f"{qid}: explanation is missing or too short to teach the tested concept.")
        if not isinstance(q.get("hint"), str) or len(q["hint"].strip()) < 10:
            errors.append(f"{qid}: hint is missing or too short.")

        if q.get("topicId") not in topic_ids:
            errors.append(f"{qid}: topicId '{q.get('topicId')}' is not declared in meta.json.")
        if q.get("referenceId") not in references:
            errors.append(f"{qid}: referenceId '{q.get('referenceId')}' has no guide in references.json.")
        if bank == "code":
            code = q.get("code")
            if not isinstance(code, str) or not code.strip():
                errors.append(f"{qid}: code-bank question is missing its code snippet.")
            if normalize(prompt or "") in GENERIC_CODE_STEMS:
                errors.append(f"{qid}: generic code stem does not identify what to trace.")
            if q.get("kind") != "code":
                errors.append(f"{qid}: code-bank records must use kind='code'.")
        elif q.get("kind") == "code":
            warnings.append(f"{qid}: non-code bank item is labelled kind='code'.")

        if isinstance(options, list) and len(options) == 4 and isinstance(answer_index, int) and 0 <= answer_index < 4:
            repeated_content[(q.get("topicId"), tuple(normalize(o) for o in options), normalize(q.get("explanation", "")))].append(qid)

    for stem, matching_ids in prompts.items():
        if len(matching_ids) > 1:
            errors.append(f"Duplicate prompt shared by {', '.join(matching_ids)}: {stem}")
    for matching_ids in repeated_content.values():
        if len(matching_ids) > 1:
            errors.append(f"Repeated options and explanation within a topic: {', '.join(matching_ids)}")

    for bank, minimum in MINIMUM_BANKS.items():
        if bank_counts.get(bank, 0) < minimum:
            errors.append(f"Expected at least {minimum} {bank} questions, found {bank_counts.get(bank, 0)}.")
    for bank, count in bank_counts.items():
        if bank not in MINIMUM_BANKS:
            errors.append(f"Unexpected question bank '{bank}' contains {count} questions.")

    print(f"Total questions: {len(questions)}")
    print("Bank counts:", dict(bank_counts))
    print("Difficulty counts:", dict(difficulty_counts))
    print(f"Topics declared: {len(topic_ids)}; reference guides: {len(references)}")
    print("Question coverage by bank/topic:")
    for bank in MINIMUM_BANKS:
        print(f"  {bank}: " + ", ".join(f"{topic}={count}" for (b, topic), count in sorted(topic_counts.items()) if b == bank))
    if warnings:
        print(f"\nWarnings ({len(warnings)}):")
        for warning in warnings:
            print(" -", warning)
    if errors:
        print(f"\nValidation failed ({len(errors)} issue(s)):")
        for error in errors:
            print(" -", error)
        raise SystemExit(1)
    print("\nValidation passed: minimum bank sizes, unique prompts/IDs/numbers, four distinct options, valid answer keys, references, and code snippets.")


if __name__ == "__main__":
    main()
