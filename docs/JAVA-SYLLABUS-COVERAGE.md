# Extracted syllabus coverage

**Source:** three supplied images titled *Suggested Teaching Guidelines for Advanced Programming for AI (Java Programming), PGCP-AI August 2026*, pages 1–3.

**Course standard:** Java 17 LTS. The syllabus also lists 90 hours (36 theory, 30 lab, 24 self-learning), basic programming/OOP prerequisites, and evaluation weighting of theory 40%, lab 40%, internal assessment 20%.

## Session-by-session map

| Session(s) | Topics extracted from the syllabus | Platform topic IDs |
|---|---|---|
| 1–2 | JVM architecture; Java overview/features/scope; OOP concepts; JDK/compiler/runtime/debugger/Javadoc; data types; package imports; Boolean/Double/Integer wrapper classes; operators; if/else, loops, switch, break and continue | `jvm`, `basics`, `oop-foundations`, `types-operators`, `control-flow` |
| 3–4 | Packages; arrays; String and StringBuilder; methods, access modifiers, overloading, parameter passing, constructors, immutability; inheritance, abstract classes, interfaces; polymorphism, references, casting, virtual methods, overriding | `packages`, `arrays`, `strings`, `methods-encapsulation`, `inheritance`, `polymorphism` |
| 5 | Exception handling; try/catch, multiple/nested catch, throw/throws/finally; built-in, runtime and checked exceptions; errors; custom exceptions; try-with-resources | `exceptions` |
| 6 | Enumerations; autoboxing; java.util, java.lang and java.math APIs; generics and collections overview | `enums-generics` |
| 7–8 | Functional programming; functional interfaces; Predicate, Map, Consumer and Supplier from java.util.function; lambda expressions; functional programming with collections | `functional`, `collections` |
| 9–10 | Streams and Collections distinction; java.util.stream; IntStream/LongStream/DoubleStream; filter, map, reduce, sort, flatMap, anyMatch, count, boxing; Java Date Time API | `streams`, `datetime` |
| 11–12 | Java concurrency; thread lifecycle; advantages/issues; Thread class, thread groups, Runnable, synchronization | `concurrency` |
| 13 | Reflection; rationale; inspect class name, superclass and interfaces | `reflection` |
| 14 | Introduction to Node.js; browser JS vs Node.js; Node.js REPL; reflection metadata/runtime inspection; performance and security considerations | `nodejs`, `reflection` |
| 15 | Introduction to Spring Framework; overview, Spring architecture, Spring MVC, Spring modules | `spring` |

## Lab/assignment note

The only specific indicative lab assignment shown in the supplied pages asks learners to create appropriate data structures for an employee object and use `java.util` package properties. It is kept as optional practical context rather than treated as a theory syllabus unit.

## Explicit scope boundaries

- The official course standard stated in the syllabus is **Java 17 LTS**.
- Node.js is covered as an adjacent JavaScript runtime topic in Session 14; it is not a Java language feature or part of the JVM.
- The page 3 reflection continuation note mentions frameworks such as Spring and Hibernate. This platform links reflection concepts to the later Spring introduction but does not treat Hibernate as a separate official syllabus unit.
- The extension bank is separate and is not an assertion of official syllabus coverage.
- The syllabus names reference books by Cay S. Horstmann, Herbert Schildt/McGraw Hill, and Joel Murach; it does not prescribe page ranges.
