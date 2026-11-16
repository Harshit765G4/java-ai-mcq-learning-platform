# Question quality audit

Audit timestamp: 2026-11-16T13:57:33.059Z

## Bank counts

| Bank | Questions |
|---|---:|
| core | 130 |
| practical | 50 |
| extension | 47 |
| **Total** | **227** |

## Difficulty distribution

| Difficulty | Questions |
|---|---:|
| basic | 21 |
| medium | 136 |
| hard | 60 |
| expert | 10 |

## Question types

| Type | Questions |
|---|---:|
| code | 50 |
| concept | 177 |

## Structural checks

- **uniqueIds:** PASS
- **uniqueGlobalNumbers:** PASS
- **validAnswerIndexes:** PASS
- **fourOptionsPerQuestion:** PASS
- **explanationsAndHintsPresent:** PASS
- **validTopicAndReferenceLinks:** PASS
- **codeSnippetsPresentForCodeQuestions:** PASS
- **allSyllabusTopicsRepresented:** PASS
- **lexicalSimilarityScreen:** No high-similarity prompt pairs were found by the lightweight Jaccard screen.

Structural errors: **0**
Warnings: **28**; 28 short-option warnings.

The short-option warnings primarily occur where an answer is an exact code output, numeric literal, boolean, or concise API result. These are short by design but should still receive manual review.

## Syllabus topic coverage

| Topic | Questions |
|---|---:|
| JVM Architecture & Java Overview | 9 |
| Java Basics, Variables & Scope | 8 |
| Object-Oriented Programming Concepts | 2 |
| Data Types, Wrappers & Operators | 19 |
| Control Statements | 8 |
| Packages, Imports & Java Tools | 12 |
| Arrays | 12 |
| String & StringBuilder | 10 |
| Methods, Constructors & Encapsulation | 15 |
| Inheritance, Abstract Classes & Interfaces | 9 |
| Polymorphism, Casting & Overriding | 9 |
| Exception Handling | 14 |
| Enums, Autoboxing, Generics & Collections Overview | 12 |
| Functional Programming & Lambda Expressions | 10 |
| Collection Framework & Operations | 13 |
| Streams & Stream API | 14 |
| Java Date-Time API | 7 |
| Java Concurrency & Threads | 20 |
| Reflection API | 6 |
| Introduction to Node.js | 5 |
| Introduction to Spring Framework | 13 |

## Prompt similarity

No high-similarity prompt pairs were found by the lightweight Jaccard screen.

The lexical screen is a heuristic and cannot prove semantic originality. Human content review remains necessary.

## Count ambiguity

The user brief has inconsistent targets: bank headings total 550 (300 + 100 + 150), detailed bank targets total 650 (350 + 150 + 150), and the stated overall total is 600. The current starter set contains 227 questions and does not meet any of these targets.

## Limitations

- Lexical similarity screening cannot prove semantic originality; human review is still required.
- The delivered bank is a curated starter set and does not meet the requested 600/650-question target.
- Compilation/runtime execution of every illustrative code snippet has not been performed by this validator.
