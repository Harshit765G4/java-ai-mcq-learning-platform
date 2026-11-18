#!/usr/bin/env python3
"""Regenerate the browser-friendly JS data files from the canonical JSON files."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def load_json(name: str):
    with (DATA / name).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_js(filename: str, variable: str, value) -> None:
    payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    content = f"/* Generated from {filename}. Edit the JSON source, then run scripts/sync_data.py. */\n"
    content += f"window.{variable} = {payload};\n"
    (DATA / filename.replace(".json", ".js")).write_text(content, encoding="utf-8")


def main() -> None:
    questions = load_json("questions.json")
    meta = load_json("meta.json")
    references = load_json("references.json")

    write_js("questions.json", "QUIZ_QUESTIONS", questions)
    write_js("meta.json", "QUIZ_META", meta)
    write_js("references.json", "QUIZ_REFERENCES", references)
    print(f"Synced {len(questions)} questions, {len(meta.get('topics', []))} topics, "
          f"and {len(references)} reference guides.")


if __name__ == "__main__":
    main()
