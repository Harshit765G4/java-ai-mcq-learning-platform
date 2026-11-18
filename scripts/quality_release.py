#!/usr/bin/env python3
"""Curated content release: preserve IDs/numbers; replace repetitive pair members."""
from __future__ import annotations
import json
from pathlib import Path
from collections import Counter
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
questions = json.loads((DATA / 'questions.json').read_text(encoding='utf-8'))
by_id = {x['id']: x for x in questions}

def Q(prompt, options, answer, explanation, hint, level='medium'):
    assert len(options) == 4 and len(set(options)) == 4, prompt
    assert answer in range(4)
    return dict(question=prompt, options=options, answerIndex=answer,
                explanation=explanation, hint=hint, difficulty=level)

# Each item replaces the second member of a former definition/scenario duplicate.
CORE_NEW = {
'environment': [
Q('A machine has Python 3.10 and 3.12 installed, but `python` still launches 3.10. What should the developer check to run the project with 3.12?', ['The interpreter executable selected by PATH or the platform launcher', 'The pip version, because pip chooses the newest interpreter at runtime', 'The IDE color theme, because it controls the interpreter version', 'The `.py` extension, because it always selects the latest Python'],0,'A command name is resolved to a particular interpreter through PATH or a launcher. Verify the executable (for example, `python3.12 --version`) and configure the project to use it.','Check which executable the shell actually resolves.','medium'),
Q('A learner wants to enter one Python statement, see its result immediately, and then enter another statement without creating a file. Which environment is intended?', ['The interactive interpreter (REPL)', 'The package installer, which executes source files', 'A virtual environment folder, which has no interactive prompt', 'A database cursor, which runs Python expressions'],0,'The REPL is a read–evaluate–print loop for interactive experiments. A script is better for saved, repeatable programs.','Look for the environment that evaluates each entered statement.','easy'),
Q('A package imports in the terminal but not in VS Code. The terminal and editor are configured with different Python executables. What is the correct fix?', ['Select the terminal’s package-containing interpreter in VS Code', 'Rename the package to match the Python minor version', 'Copy the package source beside every file without checking environments', 'Reinstall VS Code because editors maintain their own package repositories'],0,'Packages are installed into a particular interpreter environment. The editor must use that same interpreter, or the dependency must also be installed in its selected environment.','Compare the interpreter paths, not just the visible Python versions.','hard'),
Q('A `.py` file has been saved successfully but no output appears. Which step is still required to execute it?', ['Run the file using the Python interpreter', 'Install the file with pip', 'Change the extension to `.exe`', 'Save the file again in a different editor'],0,'Saving writes source code; it does not run it. Invoke the interpreter with the script path, such as `python analysis.py`.','Separate saving source code from executing it.','easy'),
Q('A program raises `IndentationError` before reaching its first print statement. What does this indicate?', ['Python cannot parse a valid block structure from the indentation', 'Every Python block must contain exactly four statements', 'Indentation changed the values stored in the variables', 'The file contains a comment that the interpreter cannot execute'],0,'Indentation defines suites in Python. An inconsistent or unexpected indentation level can make the source syntactically invalid before runtime execution begins.','This is a parsing problem, not a variable-value problem.','medium'),
],
'basics': [
Q('A function receives an integer and later binds the same name to a string. Which Python feature permits this?', ['Dynamic typing: a name may be rebound to an object of another type', 'Static typing: the first assignment permanently fixes the variable type', 'Pointer casting: each assignment converts to the original type', 'Schema inference: the interpreter creates a fixed database column'],0,'Python is dynamically typed: types belong to objects, while names are bound to objects at runtime. Rebinding a name is permitted, although operations must still be valid for the new object.','Ask whether the type belongs to the object or permanently to the name.','medium'),
Q('A function should accept `int` or `float` values and reject strings. Which check is most suitable?', ['`isinstance(value, (int, float))`', '`type(value) == str`', '`value is int or float`', '`value == int or value == float`'],0,'`isinstance` checks whether an object belongs to one of the supplied classes, including subclasses. `is` checks identity and is not a type-membership test.','Use the built-in that accepts a class or tuple of classes.','medium'),
Q('Which statement about Python Boolean values is correct?', ['`bool` is a subclass of `int`, so `isinstance(True, int)` is true', '`bool` is a subclass of `str`, so `True` behaves as text', '`True` and `False` are instances of `float` only', '`bool` is unrelated to the numeric type hierarchy'],0,'Python defines `bool` as a subclass of `int`; `True` behaves numerically like 1 and `False` like 0 in many contexts. Explicitly exclude Boolean values where an application requires an integer but not a Boolean.','Remember the type hierarchy for `bool`.','hard'),
Q('Why can `0.1 + 0.2 == 0.3` evaluate to `False`?', ['Many decimal fractions have no exact finite binary floating-point representation', 'The plus operator concatenates floating-point values as text', 'Python rounds every float to an integer before comparison', 'Equality comparisons are unsupported for numbers with decimal points'],0,'Binary floating-point stores approximations for many decimal fractions, so tiny representation errors can remain. Use a tolerance-based comparison such as `math.isclose` for approximate numeric equality.','Think about binary representation of decimal fractions.','hard'),
Q('What is a subtle property of Python’s `and` and `or` operators?', ['They short-circuit and return one of their operands, which need not be a Boolean', 'They always evaluate both expressions and return only `True` or `False`', 'They convert each operand to an integer before evaluation', 'They perform bitwise operations and accept only integers'],0,'`and` returns the first falsy operand or the last operand; `or` returns the first truthy operand or the last. Both short-circuit, so the right-hand expression may not run.','Consider the object returned, not only its truth value.','expert'),
Q('How is `not a == b` grouped according to Python operator precedence?', ['`not (a == b)`', '`(not a) == b`', '`not a` and `b` are evaluated independently', 'The expression is invalid unless both values are Boolean'],0,'Comparisons bind more tightly than `not`, so Python evaluates `a == b` first and then negates the result. Parentheses are useful when expressions become more complex.','Compare the precedence of equality and logical negation.','hard'),
Q('A variable should explicitly represent “no value has been supplied”. Which value is the intended sentinel?', ['`None`, the singleton representing absence of a value', '`0`, because numeric zero always means missing data', '`False`, because it is identical to every empty value', '`[]`, because an empty list is Python’s null object'],0,'`None` represents absence of a value and is distinct from zero, false, and empty containers. The idiomatic test is `value is None`.','Choose the dedicated absence marker rather than a valid data value.','easy'),
Q('A form provides the text `12.5`. Which conversion preserves the fractional part as a numeric value?', ['`float("12.5")`', '`int("12.5")`', '`bool("12.5")`', '`str(12.5)`'],0,'`float` parses a numeric string containing a decimal point. `int("12.5")` raises `ValueError`; converting to `str` would keep text rather than produce a number.','Choose the numeric constructor that accepts a decimal fraction.','medium'),
Q('What is the result type of `5 / 2` in Python 3, and why?', ['A `float`, because `/` performs true division', 'An `int`, because both operands are integers', 'A `str`, because division converts numbers to text', 'A `tuple`, because division returns quotient and remainder'],0,'True division `/` produces a floating-point result in Python 3 even for integer operands. Use `//` when floor division is intended.','Distinguish true division from floor division.','easy'),
Q('Which expression tests whether `value` refers to the singleton `None`?', ['`value is None`', '`value == None` is always preferred for identity tests', '`value in None`', '`type(value) is False`'],0,'`is None` expresses an identity check against the singleton and is the standard idiom. Equality can be overloaded by custom objects, so identity is the precise test.','The question asks for identity with a singleton.','hard'),
],
'control': [
Q('A `while` loop never terminates because its condition remains true. What is the most direct defect to investigate?', ['The loop body does not update the state that controls the condition', 'The condition uses a Boolean expression rather than an integer', 'The loop body contains a print statement', 'The loop variable was created outside the function'],0,'A condition-controlled loop needs some state change that can eventually make the condition false, or an explicit exit. Without that change, an infinite loop is possible.','Trace the variables used in the condition across iterations.','medium'),
Q('What is the key difference between `break` and `continue` inside a loop?', ['`break` exits the nearest loop; `continue` skips to its next iteration', '`break` skips one iteration; `continue` exits every enclosing loop', '`break` restarts the loop; `continue` terminates the program', 'Both statements terminate the nearest loop in the same way'],0,'`break` terminates the nearest enclosing loop. `continue` abandons the remainder of the current iteration and proceeds to the next one.','One exits the loop; the other advances within it.','easy'),
Q('What does `range(10, 2, -2)` yield?', ['10, 8, 6, 4', '10, 8, 6, 4, 2', '8, 6, 4, 2', '2, 4, 6, 8, 10'],0,'The start value is included, the stop value is excluded, and a negative step moves downward. The sequence is 10, 8, 6, 4.','The stop is still excluded, even when the step is negative.','hard'),
Q('Which condition is truthy in Python?', ['A non-empty string such as `"0"`', 'An empty string `""`', 'The integer `0`', 'The value `None`'],0,'Non-empty strings are truthy, including the string `"0"`. Empty strings, numeric zero, and `None` are falsy.','A string containing a character is not the same as an empty string.','medium'),
Q('In a nested loop, an unlabelled `break` is executed by the inner loop. What happens?', ['Only the innermost enclosing loop is terminated', 'Both the inner and outer loops are terminated automatically', 'The entire Python program exits', 'Execution resumes at the first line of the outer loop body'],0,'`break` affects only the nearest enclosing `for` or `while` loop. To exit multiple levels, use an additional condition, a function return, or another explicit design.','Identify the nearest loop that lexically encloses the break.','hard'),
Q('What is the role of `pass` in a syntactically required block?', ['It performs no operation and acts as a placeholder statement', 'It skips the current loop iteration', 'It exits the nearest loop immediately', 'It returns `None` from the current function'],0,'`pass` is a null statement. It lets a block remain syntactically valid while doing nothing; `continue`, `break`, and `return` have control-flow effects.','It is the no-operation placeholder, not a loop-control command.','medium'),
Q('When does the `else` suite of a `while` loop execute?', ['When the loop condition becomes false without the loop being exited by `break`', 'Whenever the loop executes at least once, even if it breaks', 'Only when the loop body raises an exception', 'Only when the initial condition is false and the body runs'],0,'A loop-level `else` runs after normal exhaustion: a `for` iterable ends or a `while` condition becomes false. It is skipped when `break` terminates the loop.','The distinction is normal completion versus termination by `break`.','expert'),
Q('Which expression is equivalent to `"adult" if age >= 18 else "minor"`?', ['A conditional expression that chooses one of two values based on the condition', 'A loop that repeats while age is at least 18', 'A function definition with a default argument', 'A dictionary lookup using `age` as a key'],0,'The conditional expression evaluates its condition and returns the first expression when true or the second when false. It is also called a ternary expression.','It is an expression that selects a value, not a statement block.','medium'),
Q('What does short-circuit evaluation guarantee in `x != 0 and 100 / x > 2`?', ['The division is skipped when `x == 0`, because the left operand is false', 'The division is always evaluated before the comparison', 'The expression raises `ZeroDivisionError` whenever x is zero', 'The right side is evaluated only if x is negative'],0,'`and` does not evaluate its right operand if the left operand is falsy. The guard prevents division by zero when `x` is zero.','The left side is a guard for the expression on the right.','expert'),
Q('A loop uses `for index, item in enumerate(records, start=1)`. What does `enumerate` add?', ['A running index paired with each item from the iterable', 'A sorted copy of the records in ascending order', 'A count of items remaining after the current one', 'A dictionary mapping each item to its memory address'],0,'`enumerate` yields pairs containing a counter and the corresponding item. `start=1` changes the first counter to one; it does not sort or copy the iterable.','Look for the pair produced at every iteration.','medium'),
],
}
CORE_NEW.update({
'strings': [
Q('For `text = "automation"`, what does `text[1:8:2]` select?', ['Characters at indexes 1, 3, 5, and 7', 'Characters at indexes 1 through 8, including 8', 'Every second character beginning at index 0', 'The string in reverse order'],0,'A slice uses start, stop (exclusive), and step. Starting at index 1 and advancing by 2 selects indexes 1, 3, 5, and 7.','Read all three slice components: start, stop, and step.','hard'),
Q('A parser needs to split `"name:Harshit:AI"` at only the first colon and preserve the remaining text together. Which string method is best?', ['`partition(":")`, which returns the text before, separator, and text after the first match', '`split(":")`, which divides at every colon by default', '`rsplit(":")`, which divides from the right by default', '`strip(":")`, which removes colons from both ends'],0,'`partition` splits at the first occurrence and returns a three-item tuple (before, separator, after). `split` can divide at every occurrence unless limited.','The requirement is one split and a three-part result.','medium'),
Q('Why might `casefold()` be preferred to `lower()` for caseless text comparison?', ['`casefold()` is designed for more aggressive Unicode-aware caseless matching', '`casefold()` removes all punctuation but preserves case', '`lower()` converts text to bytes while `casefold()` returns a list', '`casefold()` changes the original string in place'],0,'Both return new strings, but `casefold` is intended for caseless matching and handles more Unicode case distinctions than `lower`.','The question is about robust comparison, especially across Unicode text.','expert'),
Q('A file parser should accept a line only when it begins with `ERROR:`. Which method expresses this test directly?', ['`line.startswith("ERROR:")`', '`line.endswith("ERROR:")`', '`line.find("ERROR:") == len(line)`', '`line.isalpha()`'],0,'`startswith` checks a prefix without requiring manual slicing or a search for the substring. `endswith` checks the opposite end.','The required token must be at the beginning of the string.','easy'),
Q('What does `"ha" in "hahaha"` evaluate to?', ['`True`, because the left string occurs as a substring of the right string', '`False`, because `in` tests only individual characters', '`2`, because it returns the number of occurrences', 'A list containing every matching index'],0,'For strings, `in` performs a substring-membership test and returns a Boolean. It does not count occurrences or return matching positions.','Membership in a string checks whether a substring occurs.','easy'),
Q('After `name = "Ada"`, what happens when code executes `name = name.replace("A", "E")`?', ['The name is rebound to a new string; the original string object is not modified', 'The first character of the existing string is mutated in place', 'The statement raises `TypeError` because replace is not available on strings', 'The old and new names become aliases to a mutable character array'],0,'Strings are immutable. `replace` returns a new string, and assigning that result to `name` rebinds the name to the new object.','The method returns a value; it does not mutate the existing string.','medium'),
Q('A Unicode string contains `"café"`. Which statement is accurate about Python 3 strings?', ['A `str` stores Unicode text; encoding is needed when converting it to bytes', 'A `str` can contain only ASCII characters unless converted to a list', 'Every character occupies exactly one byte in memory', 'A `str` and a UTF-8 byte sequence are always interchangeable'],0,'Python 3 `str` represents Unicode text. Encoding (such as UTF-8) produces `bytes`; decoding converts bytes back to text.','Distinguish Unicode text from encoded bytes.','hard'),
Q('Which expression joins a list of words with one space between adjacent words?', ['`" ".join(words)`', '`words.join(" ")`', '`" ".split(words)`', '`str(words, " ")`'],0,'`join` is a string method called on the separator. It concatenates string elements with that separator between them.','The separator is the object on which `join` is called.','medium'),
Q('In an f-string, how can a floating-point value be formatted to exactly two digits after the decimal point?', ['`f"{value:.2f}"`', '`f"{value:2d}"`', '`f"{value:.2s}"`', '`f"{value:%2}"`'],0,'The format specifier `.2f` requests fixed-point formatting with two digits after the decimal point. The field width and precision are separate concepts.','Use fixed-point format with a precision of two.','hard'),
],
'dictionaries': [
Q('For a dictionary `profile`, what does the expression `"name" in profile` test?', ['Whether `"name"` is a key in the dictionary', 'Whether the value `"name"` occurs among dictionary values', 'Whether the dictionary has exactly one entry', 'Whether the dictionary is sorted by the key `name`'],0,'Membership testing on a dictionary checks keys. Use `"name" in profile.values()` when the requirement is to search values.','Dictionary iteration and membership are key-oriented by default.','medium'),
Q('What is the difference between `d.pop("x")` and `d.pop("x", None)` when key `x` is absent?', ['The first raises `KeyError`; the second returns `None`', 'Both return `None` and leave the dictionary unchanged', 'The first returns `False`; the second raises `KeyError`', 'The first inserts `x`; the second deletes the entire dictionary'],0,'`pop` removes and returns the value for a key. Without a default, a missing key raises `KeyError`; with a default, that default is returned.','Compare the behavior when the key does not exist.','hard'),
Q('What does `d.setdefault("region", "APAC")` do when `region` is not already a key?', ['Inserts the key with value `"APAC"` and returns that value', 'Raises `KeyError` because the key is missing', 'Deletes every key except `region`', 'Returns a new dictionary without modifying `d`'],0,'`setdefault` returns the existing value if the key is present. Otherwise it inserts the supplied default and returns it.','It is a lookup with an insertion-on-miss behavior.','hard'),
Q('Which expression builds a dictionary mapping each word to its length?', ['`{word: len(word) for word in words}`', '`[word: len(word) for word in words]`', '`(word, len(word) for word in words)`', '`{len(word) for word in words}`'],0,'A dictionary comprehension uses `{key_expression: value_expression for ...}`. A set comprehension omits the key/value colon.','Look for the key-value colon inside the braces.','medium'),
Q('If `d = {"status": "new"}` and code assigns `d.update({"status": "sent"})`, what happens?', ['The existing key remains but its value is replaced with `"sent"`', 'A second `status` key is created beside the first', 'The dictionary rejects the update because keys cannot be changed', 'The original dictionary is unchanged and a new one is returned'],0,'Dictionary keys are unique. `update` overwrites the value for a key that already exists and adds keys that are new; it mutates the dictionary.','A dictionary cannot contain duplicate copies of the same key.','medium'),
Q('What does `for key, value in d.items():` provide on each iteration?', ['A key and its associated value as a pair', 'Only values, with keys automatically sorted', 'The integer position and the key name', 'A copy of the dictionary for every iteration'],0,'`items()` returns a dynamic view of key/value pairs. Iterating it allows both the key and corresponding value to be unpacked.','Use the method that exposes pairs rather than keys alone.','easy'),
],
'lists': [
Q('After `b = a.copy()`, which statement is generally true when `a` is a list containing only immutable integers?', ['`b` is a separate outer list, so appending to `b` does not append to `a`', '`a` and `b` are the same list object', '`copy()` converts the list into a tuple', 'Changing the length of `b` always changes the length of `a`'],0,'A list’s `copy()` method makes a shallow copy: the outer list is distinct. With immutable integer elements, changing the list structure in one does not change the other.','Think about whether the outer container or its elements are shared.','medium'),
Q('Which statement distinguishes `remove(value)` from `pop(index)`?', ['`remove` deletes the first matching value; `pop` deletes and returns an item at an index', '`remove` returns the deleted item; `pop` always removes the first matching value', 'Both methods delete every occurrence of a value', '`pop` cannot be used with an index and always clears the list'],0,'`remove(x)` searches for and deletes the first element equal to `x`. `pop(i)` removes and returns the element at index `i` (the last item by default).','One is value-based; the other is position-based and returns the removed item.','medium'),
Q('What is the effect of `values.insert(1, 99)` on a list?', ['It places `99` at index 1 and shifts later elements to the right', 'It replaces the element at index 1 without moving other elements', 'It appends `99` after the last element', 'It sorts the list so that `99` is at position 1'],0,'`insert(i, x)` adds an element before the current item at index `i`. Existing elements at that index and later positions shift right.','The operation adds a new slot rather than replacing an existing element.','easy'),
Q('Why does `items.sort()` usually not belong inside an assignment such as `sorted_items = items.sort()`?', ['`sort()` mutates the list in place and returns `None`; `sorted()` returns a new sorted list', '`sort()` returns a tuple while `sorted()` mutates the original', '`sort()` sorts only strings and `sorted()` sorts only numbers', 'Both methods return the same list object without modifying it'],0,'`list.sort()` sorts the existing list and returns `None`. The built-in `sorted(iterable)` creates and returns a new list, leaving the original iterable unchanged.','Compare an in-place list method with the built-in function.','medium'),
Q('What does the slice assignment `values[1:3] = [8, 9, 10]` do?', ['Replaces the selected slice and may change the list length', 'Replaces exactly one item because the stop index is excluded', 'Creates a new list and leaves `values` unchanged', 'Raises `TypeError` because slices cannot appear on the left side'],0,'Slice assignment mutates the list. The replacement may contain a different number of elements than the selected slice, so the list length can change.','The right-hand sequence need not have the same length as the slice.','hard'),
Q('What kind of copy does `copy.copy()` make for a nested list by default?', ['A shallow copy: the outer list is new, but nested objects are shared', 'A deep copy: every nested object is recursively duplicated', 'A reference alias: even the outer list is the same object', 'A serialized copy that converts nested lists to strings'],0,'A shallow copy duplicates only the outer container. Nested mutable elements still refer to the same objects; `copy.deepcopy` recursively copies the object graph.','Think about whether nested mutable lists are duplicated too.','hard'),
Q('What does `3 in [1, 2, 3, 4]` return?', ['`True`, because membership finds an equal element', '`3`, because `in` returns the matching index', '`False`, because list membership checks keys only', 'A list containing the matching element'],0,'The `in` operator tests membership and returns a Boolean. Use `index(3)` if you need the first matching position.','Membership is a Boolean test, not an index lookup.','easy'),
Q('Which call sorts a list of dictionaries by each record’s `age` value without requiring a custom comparison class?', ['`sorted(records, key=lambda row: row["age"])`', '`records.sort(row["age"])`', '`sorted(records, reverse=row["age"])`', '`records.order_by("age")`'],0,'The `key` parameter computes a comparable sort key for every element. A lambda is often used to extract one field from each dictionary.','The sort key should extract the value that determines ordering.','hard'),
Q('Why can `matrix = [[0] * 3] * 2` cause unexpected changes across rows?', ['Both rows reference the same inner list object', 'The multiplication converts each row into an immutable tuple', 'The outer list stores only the first row and discards the second', 'Nested lists cannot contain integer values'],0,'List multiplication repeats references to the same inner list; it does not create independent nested lists. Use a comprehension to create a separate row each time.','Check whether each row is a distinct object or a repeated reference.','expert'),
],
'functions': [
Q('If a Python function reaches the end of its body without executing `return`, what value does the call produce?', ['`None`', '`0`', '`False`', 'The last expression evaluated inside the function'],0,'A function without an executed return statement returns `None`. Python does not automatically return the last expression as some interactive languages do.','A function needs an explicit return to send back another value.','easy'),
Q('Which function signature is valid when a required parameter and a defaulted parameter are used?', ['`def connect(host, timeout=5):`', '`def connect(timeout=5, host):`', '`def connect(host=, timeout=5):`', '`def connect(host, timeout, =5):`'],0,'Parameters without defaults must precede parameters with defaults in the ordinary positional parameter section. The first signature is valid and gives `timeout` a default.','Required positional parameters cannot follow a defaulted positional parameter.','medium'),
Q('In `def report(name, *, format="csv")`, how must the caller provide `format`?', ['As a keyword argument, such as `report("sales", format="json")`', 'Only as the second positional argument', 'As an item inside `*args`', 'It can never be changed from the default'],0,'The `*` marker makes following parameters keyword-only. The caller must name `format` explicitly.','The bare asterisk marks the start of keyword-only parameters.','hard'),
Q('When a function is defined as `def f(*args, **kwargs):`, how are additional arguments collected?', ['Extra positional arguments become a tuple; extra keyword arguments become a dictionary', 'Both kinds are collected into one list', 'Positional arguments become a dictionary and keywords become a tuple', 'All extra arguments are silently discarded'],0,'`*args` collects additional positional arguments into a tuple. `**kwargs` collects additional keyword arguments into a dictionary.','Remember the distinct container associated with each parameter form.','medium'),
Q('A local variable shadows a global variable with the same name. Which scope rule explains how Python resolves the name?', ['LEGB: Local, Enclosing, Global, Built-in', 'FIFO: First In, First Out', 'MRO: Method Resolution Order only', 'LIFO: Last In, First Out'],0,'Python resolves ordinary names by the LEGB rule: Local, Enclosing function, Global module, then Built-in scope. The nearest matching binding is used.','Think of the order Python searches for a name.','hard'),
Q('A nested function must rebind a variable defined in its immediately enclosing function. Which declaration is intended?', ['`nonlocal variable_name`', '`global variable_name`', '`static variable_name`', '`outer variable_name`'],0,'`nonlocal` allows assignment to a binding in the nearest enclosing function scope. `global` instead refers to a module-level binding.','The variable lives in an enclosing function, not at module level.','hard'),
Q('What is a significant distinction between a `lambda` expression and a `def` statement?', ['A lambda creates a function whose body is a single expression', 'A lambda can never accept arguments', 'A function created with def cannot return a value', 'A lambda is automatically executed when its module is imported'],0,'A lambda creates an anonymous function with a single expression body. `def` supports a statement suite, docstrings, and more complex function bodies.','The key restriction is on the lambda body, not on its arguments.','medium'),
Q('What does `map(function, iterable)` return in Python 3?', ['A lazy iterator that applies the function to each item', 'A list that is always evaluated immediately', 'A dictionary keyed by the original item positions', 'A Boolean indicating whether every item passed the function'],0,'`map` returns an iterator in Python 3. Convert it to a list or consume it in a loop when eager results are needed.','Consider lazy evaluation in Python 3.','medium'),
Q('Why is a mutable default such as `items=[]` usually avoided in a function definition?', ['The same list object is reused across calls that omit the argument', 'A fresh list is automatically created for every call', 'Lists cannot be used as function arguments', 'The default list is copied deeply whenever the function is called'],0,'Default argument expressions are evaluated once when the function is defined. A mutable object can therefore retain changes across calls; use `None` and create a new list inside the function.','Ask when the default expression is evaluated.','expert'),
Q('Where is a function’s docstring placed so tools such as `help()` can expose it?', ['As the first string literal in the function body', 'After the final return statement', 'Inside the parameter list after each comma', 'In a comment beginning with `# doc:` only'],0,'The first string literal in a function, class, or module body becomes its docstring and is available through `__doc__` and help tools.','It must be the first statement-like item in the function body.','medium'),
Q('A recursive function calls itself with smaller input. What condition is essential to prevent unbounded recursion?', ['A base case that returns without making another recursive call', 'A global variable declared in every recursive frame', 'A `while True` loop after every recursive call', 'A mutable default argument shared by all calls'],0,'A base case terminates recursion for an input that is sufficiently small or otherwise terminal. Each recursive step must make progress toward that case.','Look for the condition that stops further recursive calls.','hard'),
],
})
CORE_NEW.update({
'regex': [
Q('Why is a raw string such as `r"\\d+"` often used for a regular-expression pattern in Python?', ['It prevents Python string-literal processing from consuming backslashes before the regex engine sees them', 'It compiles the pattern into machine code at import time', 'It makes every regex match case-insensitive', 'It turns the pattern into a bytes object automatically'],0,'A raw string keeps backslashes in the string literal, making patterns such as `\\d+` easier to write. The regex engine still interprets the backslash escape.','There are two parsers to consider: Python’s string literal and the regex pattern.','medium'),
Q('What is the practical difference between `re.match(pattern, text)` and `re.search(pattern, text)`?', ['`match` checks from the start of the string; `search` scans for a match anywhere', '`match` searches from the end; `search` checks only the first character', '`match` returns all matches; `search` returns only a Boolean', 'They are identical except for the type of pattern accepted'],0,'`re.match` attempts a match at the beginning of the string. `re.search` scans forward until it finds a match or reaches the end.','Ask whether matching is anchored at the start by the function itself.','hard'),
Q('In the pattern `r"(?P<year>\\d{4})-(\\d{2})"`, how can code retrieve the named four-digit year group?', ['`match.group("year")`', '`match.group(0)` only, because named groups cannot be retrieved by name', '`match["year"]` on the original input string', '`match.find("year")`'],0,'A named capture group is retrieved with `group("year")` or through the group dictionary. Group 0 represents the entire match.','The group name is declared inside `(?P<name>...)`.','hard'),
Q('Why might a compiled regex be stored in a module-level variable when the same pattern is used repeatedly?', ['The pattern is compiled once and the compiled object can be reused for repeated matches', 'Compilation makes the regular expression match only once', 'The compiled object permanently changes every input string', 'A compiled pattern converts all matches into integers'],0,'`re.compile` creates a reusable pattern object. Reusing it avoids repeatedly expressing and compiling the same pattern in application code.','Consider repeated use of the same pattern, not a different matching rule.','medium'),
],
'tuples': [
Q('Which syntax creates a one-element tuple containing the integer 5?', ['`(5,)`', '`(5)`', '`[5,]`', '`{5:}`'],0,'The comma makes a tuple. Parentheses alone are grouping, so `(5)` is just the integer 5; `[5]` is a list.','Tuple-ness comes from the comma, not the parentheses.','easy'),
Q('In `first, *middle, last = (1, 2, 3, 4, 5)`, what type is `middle`?', ['A list containing `[2, 3, 4]`', 'A tuple containing `(2, 3, 4)`', 'An iterator over the original tuple', 'A single integer containing 234'],0,'Extended iterable unpacking assigns the starred target a list containing all remaining items. The other targets receive the first and last values.','The starred target gathers zero or more remaining values in a list.','hard'),
Q('Under what condition can a tuple be used as a dictionary key?', ['Every element in the tuple must be hashable', 'The tuple must contain at least one mutable list', 'The tuple must contain only strings', 'The tuple must have exactly two elements'],0,'A tuple is hashable only when its elements are hashable. A tuple containing a list is not hashable because lists are mutable and unhashable.','The tuple’s own immutability is not sufficient if it contains an unhashable item.','hard'),
Q('Which expression creates a new tuple by adding `("ML",)` to `("Python",)`?', ['`("Python",) + ("ML",)`', '`("Python",).append("ML")`', '`("Python",).add("ML")`', '`("Python",)[1] = "ML"`'],0,'Tuple concatenation with `+` creates a new tuple. Tuples do not provide in-place append or item assignment because they are immutable.','Use an operation that creates a new tuple rather than mutating an existing one.','medium'),
Q('A tuple contains a list: `record = ("A", [1, 2])`. Which statement is correct?', ['The tuple cannot replace its second slot, but the nested list can still be mutated', 'Both the tuple and every object inside it are deeply immutable', 'The list automatically becomes a tuple when inserted', 'The tuple becomes mutable because one of its elements is mutable'],0,'Tuple immutability protects the references stored in its slots. It does not make referenced mutable objects immutable; the nested list can be changed in place.','Separate the immutability of the container from mutability of referenced objects.','expert'),
],
})
CORE_NEW.update({
'oop': [
Q('A class has an attribute `department = "AI"` defined in the class body. Instances that do not define their own `department` will normally read which value?', ['The shared class attribute `"AI"`', 'A new empty string created for each instance', 'The name of the class’s parent module', 'The value of the most recently created instance attribute with any name'],0,'Attribute lookup checks the instance and then its class hierarchy. If an instance does not shadow `department`, the class attribute is found.','Consider instance attributes first, then class attributes.','medium'),
Q('Which statement best describes the role of `__init__` in ordinary Python class construction?', ['It initializes a newly created instance after `__new__` has created it', 'It allocates memory and must return the instance explicitly', 'It runs only when the class is imported', 'It is a destructor called when the instance is garbage-collected'],0,'`__new__` creates the instance; `__init__` initializes it and normally returns `None`. It is invoked during a typical class call after instance creation.','Distinguish object creation from initialization.','hard'),
Q('A method defined in a class needs the instance it was called on. What does Python bind as the first argument when it is accessed through an instance?', ['That instance, conventionally named `self`', 'The class object, conventionally named `cls`', 'The method’s return value', 'The module object containing the class'],0,'An ordinary instance method is a function descriptor that binds the instance as the first argument. `self` is a convention, not a reserved keyword.','The method is accessed through an instance, not through the class.','easy'),
Q('Which decorator should be used when a method needs to receive the class itself as its first argument?', ['`@classmethod`', '`@staticmethod`', '`@property`', '`@abstractmethod`'],0,'A class method receives the class as its implicit first argument, conventionally called `cls`. It is useful for alternate constructors and class-level behavior.','The implicit first argument should be the class object.','medium'),
Q('A child class overrides a parent method but still needs to execute the parent implementation as part of its behavior. What is the intended tool?', ['`super()`', '`self.__class__.__base__` as a hard-coded parent call in every case', '`staticmethod()`', '`object.__del__()`'],0,'`super()` provides a proxy that follows the method resolution order. It supports cooperative multiple inheritance better than hard-coding a particular parent class.','Use the cooperative lookup mechanism that respects MRO.','hard'),
Q('In multiple inheritance, what does Python’s method resolution order (MRO) determine?', ['The order in which classes are searched for an attribute or method', 'The order in which object attributes are stored in memory', 'The order in which instances are created by the garbage collector', 'The order in which imported modules are written to disk'],0,'The MRO defines the lookup order for attributes and methods across a class hierarchy. Python uses C3 linearization to produce a consistent order.','The MRO is about lookup across base classes.','expert'),
Q('Why is `@property` useful when designing a public attribute such as `temperature`?', ['It exposes method-based logic through attribute access and can validate or compute values', 'It makes the attribute globally accessible from every module', 'It converts the attribute to a class variable automatically', 'It disables assignment to every attribute on the instance'],0,'A property provides controlled attribute access using getter/setter methods while preserving attribute-style syntax. This allows validation or computed values without changing the public interface.','Think about encapsulating behavior behind attribute syntax.','hard'),
Q('In a class definition, what does a decorator such as `@staticmethod` do?', ['It transforms the function through a decorator and stores the resulting descriptor in the class namespace', 'It executes the function immediately when the class is parsed', 'It makes the function a global function outside the class', 'It prevents the method from being called through an instance'],0,'A decorator is a callable applied to the function object at definition time. `staticmethod` wraps it so attribute access does not bind an instance or class argument.','A decorator transforms or wraps a function at definition time.','expert'),
Q('What is the purpose of name mangling for an attribute written as `self.__balance` inside class `Account`?', ['Python rewrites the name using the class name to reduce accidental subclass/name collisions', 'It encrypts the attribute so no code can ever access it', 'It makes the attribute a true private field enforced by the interpreter', 'It converts the attribute into a class-level constant'],0,'A double-leading-underscore name is mangled (for example, `_Account__balance`). This discourages accidental name collisions; it is not access control or encryption.','The mechanism changes the attribute name; it does not create absolute privacy.','hard'),
Q('What is method overriding?', ['A subclass provides its own implementation of a method inherited from a base class', 'A class defines two variables with the same value', 'A function calls itself with a smaller argument', 'A method is moved from one module into another'],0,'Overriding occurs when a subclass defines a method with the same name as an inherited method, changing the behavior used for instances of the subclass.','Look for a subclass replacing inherited behavior.','easy'),
Q('Which special method is commonly implemented to define how `a + b` behaves for instances of a custom class?', ['`__add__`', '`__sum__`', '`__plus__`', '`__concat_operator__`'],0,'The binary addition operator dispatches to special methods such as `__add__` (and possibly the reflected `__radd__`). This is operator overloading.','Find the data model method associated with binary addition.','hard'),
Q('A `Car` object uses separate `Engine` and `NavigationSystem` objects to perform its work. Which design relationship does this illustrate?', ['Composition: a car has or uses collaborating objects', 'Inheritance: a car is a kind of engine', 'Overriding: a car replaces the `int` implementation', 'Multiple dispatch: a car must inherit from every collaborator'],0,'Composition models a has-a or uses relationship and delegates work to collaborator objects. Inheritance is better reserved for a genuine is-a relationship.','Ask whether the relationship is “has a” or “is a”.','medium'),
Q('Two variables `a` and `b` are assigned the same instance. What happens when `b.value` is changed?', ['The change is visible through `a` because both names refer to the same object', 'Python automatically clones the object during attribute assignment', 'Only the variable name `b` changes; object state is unaffected', 'The instance becomes a class attribute shared with all future instances'],0,'Assignment of an object reference does not clone the object. Both names refer to the same instance, so mutation through either name is visible through the other.','Track references to the object, not the names alone.','medium'),
Q('Which pair of built-ins checks whether an object belongs to a class hierarchy and whether a class derives from another class?', ['`isinstance(obj, Class)` and `issubclass(Child, Parent)`', '`type(obj, Class)` and `is(Child, Parent)`', '`id(obj, Class)` and `super(Child, Parent)`', '`callable(obj)` and `hasattr(Child, Parent)`'],0,'`isinstance` checks an object against a class or tuple of classes. `issubclass` checks a class against a parent class or tuple of parents.','One checks an instance; the other checks a class relationship.','medium'),
],
'exceptions': [
Q('Why should a specific exception handler such as `except FileNotFoundError:` usually appear before `except Exception:`?', ['The broad handler would otherwise catch the specific exception first', 'Python requires every exception handler to be alphabetically ordered', 'A specific handler can catch exceptions only after a broad handler', 'The broad handler is executed only when the specific handler returns a value'],0,'Exception handlers are tested from top to bottom. A broad `Exception` handler placed first can intercept errors intended for more specific handlers, making those later handlers unreachable for those types.','Handlers are considered in source order from top to bottom.','hard'),
Q('When does a `try` statement’s `else` clause run?', ['When the `try` suite completes without raising an exception', 'Whenever any exception is caught by an `except` clause', 'Only when the `finally` clause raises an exception', 'Before the `try` suite begins'],0,'The `else` suite runs only if the `try` suite finishes without an exception. It separates success-path code from exception-handling code.','The `else` clause represents the no-exception path.','medium'),
Q('What is the primary guarantee of a `finally` clause?', ['It is used for cleanup and is normally executed whether or not the `try` suite raises', 'It runs only when an exception is caught', 'It runs only when the `try` suite contains a return statement', 'It suppresses all exceptions raised in the `try` suite'],0,'`finally` is intended for cleanup and normally runs as control leaves the `try` statement, including when an exception propagates. A return or exception inside `finally` can alter control flow.','Focus on cleanup across success and failure paths.','hard'),
Q('Which statement creates and raises a `ValueError` instance with a message?', ['`raise ValueError("invalid age")`', '`except ValueError("invalid age")`', '`return ValueError("invalid age")`', '`assert ValueError("invalid age")`'],0,'`raise` signals an exception. The exception class is instantiated with the supplied message and raised for the caller or an enclosing handler.','The required statement actively signals an exception.','easy'),
Q('A library defines `InvalidConfigurationError` for a configuration-specific failure. Which class should it normally inherit from?', ['`Exception`', '`str`', '`dict`', '`BaseModel`'],0,'Most application-specific exceptions inherit from `Exception` (directly or through a related custom exception base). This makes them part of the ordinary application exception hierarchy.','Use the standard base for application exceptions.','medium'),
Q('What is a limitation of using `assert` for validating user input in production code?', ['Assertions may be disabled with optimization and are intended mainly for internal invariants', 'Assertions always convert invalid input to a default value', 'Assertions catch every possible exception automatically', 'Assertions are evaluated only when the program is imported'],0,'Assertions are useful for developer assumptions and invariants, but Python may omit them under optimization (`-O`). Use explicit validation and raise suitable exceptions for external input.','Distinguish developer invariants from required runtime validation.','expert'),
Q('What is the purpose of exception chaining with `raise NewError(...) from exc`?', ['It records the original exception as the explicit cause of the new exception', 'It deletes the original traceback before raising', 'It turns the original exception into a return value', 'It retries the failing statement until it succeeds'],0,'The `from` clause sets the explicit cause (`__cause__`) and preserves the relationship between the lower-level failure and the higher-level error.','The original failure remains linked to the new exception.','expert'),
],
'modules': [
Q('What is the effect of `import pandas as pd`?', ['It binds the imported module to the local name `pd`', 'It imports only the DataFrame class as `pd`', 'It installs Pandas into the current environment', 'It runs every function defined in Pandas immediately'],0,'The `as` clause creates an alias for the imported module in the current namespace. Importing a module does not install it; installation is handled by a package manager.','Import aliases change the local name used to access a module.','easy'),
Q('Why can `from module import function` be convenient but sometimes make code less explicit?', ['It places the imported name directly in the current namespace, so its origin is less visible at the call site', 'It imports the function as a string that cannot be called', 'It prevents the imported function from being tested', 'It always imports every name in the module'],0,'A direct import allows `function()` rather than `module.function()`, but the source module is less apparent and name collisions are possible.','Think about the name that appears at the call site.','medium'),
Q('What is the value of `__name__` when a module is executed as the top-level script?', ['`"__main__"`', 'The file’s complete absolute path', 'The name of the Python executable', 'The name of the first imported package'],0,'When run directly, the module’s `__name__` is `"__main__"`; when imported, it is normally the module’s import name. This is the basis of the common entry-point guard.','Compare direct execution with importing the same file.','easy'),
Q('Which logging level is more severe: `WARNING` or `ERROR`?', ['`ERROR`', '`WARNING`', 'They have equal numeric severity in the standard logging module', 'The order changes alphabetically at runtime'],0,'The standard severity order is DEBUG, INFO, WARNING, ERROR, CRITICAL. ERROR is more severe than WARNING.','Recall the standard logging severity ladder.','easy'),
Q('A developer needs to pause execution at a breakpoint, inspect local variables, and execute one statement at a time. Which tool is designed for this?', ['A debugger', 'A package installer', 'A static code formatter', 'A database migration tool'],0,'A debugger supports breakpoints, stepping, and inspection of stack frames and variable values. A logger records events but does not provide interactive execution control.','Look for breakpoints and step-by-step runtime inspection.','medium'),
],
})
CORE_NEW.update({
'numpy-scipy': [
Q('A NumPy array is constructed from `[1, 2.5, 3]`. Why might the resulting array use a floating-point dtype for all elements?', ['NumPy chooses a common dtype that can represent the mixed numeric values', 'NumPy arrays must always store every Python value as an object', 'The array constructor converts all integers to strings by default', 'The last element determines the dtype and earlier values are discarded'],0,'A NumPy array is generally homogeneous. When input values have mixed numeric types, NumPy promotes them to a common dtype capable of representing the values.','Think about the single dtype shared by an ndarray.','medium'),
Q('An array has `shape == (4, 3, 2)`. What does `array.size` report?', ['24, the total number of elements', '3, the number of axes', '9, the number of rows and columns in the first two axes', '(4, 3, 2), the tuple of dimensions'],0,'`size` is the product of all dimensions: 4 × 3 × 2 = 24. `ndim` would be 3, and `shape` is the dimension tuple.','Multiply the lengths of all axes.','easy'),
Q('For a two-dimensional array with shape `(3, 4)`, what does `array.sum(axis=1)` produce?', ['One sum for each row, so the result has four? No: it has three values, one per row', 'One sum for each column, so the result has four values', 'A single scalar equal to the sum of the entire array', 'A copy of the array with shape `(3, 4)`'],0,'For a 2-D array, reducing `axis=1` collapses the column dimension and leaves one total per row. The result has shape `(3,)` for a `(3, 4)` input.','The reduced axis disappears from the result shape.','hard'),
Q('For NumPy broadcasting, which pair of shapes is compatible?', ['`(3, 1)` and `(1, 4)`, producing a result of shape `(3, 4)`', '`(3, 2)` and `(4, 3)`, because both arrays have three dimensions listed', '`(2, 3)` and `(2, 4)`, because their first dimensions match', '`(5,)` and `(3,)`, because one-dimensional arrays always broadcast'],0,'Broadcasting compares dimensions from the right. Each pair must be equal or one of them must be 1. `(3,1)` and `(1,4)` therefore expand to `(3,4)`.','Compare trailing dimensions; each must match or one must be 1.','expert'),
Q('What does `np.where(mask, x, y)` do when `mask`, `x`, and `y` are broadcast-compatible arrays?', ['Selects elements from `x` where the mask is true and from `y` where it is false', 'Returns only the indexes where the mask is true', 'Sorts `x` and `y` according to the mask', 'Replaces every false value in the mask with zero in place'],0,'`np.where(condition, x, y)` performs element-wise selection and returns a new array. It is not an in-place mutation and does not return indexes.','Think of a vectorized conditional expression.','hard'),
Q('What is generally true about the result of NumPy Boolean indexing such as `a[a > 0]`?', ['It returns a copy containing the selected elements', 'It always returns a view sharing the original array memory', 'It changes every non-positive value in `a` to zero', 'It returns a tuple containing the row and column indexes'],0,'Boolean or advanced indexing gathers selected values into a new array. Basic slicing commonly returns a view, so the two forms have different memory-sharing behavior.','Compare advanced indexing with ordinary slice notation.','expert'),
Q('A NumPy slice shares memory with its source array. Which operation explicitly creates independent array storage?', ['`a[1:4].copy()`', '`a[1:4]`', '`a.view()`', '`np.asarray(a[1:4])` in the ordinary case when the input is already an ndarray'],0,'Basic slicing often creates a view. Calling `.copy()` allocates independent storage; `.view()` explicitly shares the underlying data.','Choose the operation that allocates a new data buffer.','hard'),
Q('Why can vectorized NumPy expressions be faster than a Python loop over every element?', ['Many operations run in optimized compiled loops and avoid repeated Python-level iteration', 'Vectorization stores all arrays in GPU memory automatically', 'Vectorized expressions skip the mathematical operation for most elements', 'NumPy converts every operation into a database query'],0,'NumPy delegates element-wise work to optimized native code and reduces Python interpreter overhead. It does not imply that every operation runs on a GPU.','Focus on reduced Python-loop overhead and optimized native routines.','medium'),
Q('When is `np.linspace(0, 1, 5)` a better fit than `np.arange(0, 1, 0.25)`?', ['When the number of evenly spaced samples is the requirement and both endpoints should be included', 'When an exact step size is required and the stop must always be excluded', 'When the output must contain only integer values', 'When the input arrays need to be concatenated along a new axis'],0,'`linspace` specifies the number of samples and includes the endpoint by default. `arange` specifies a step and normally excludes the stop value; floating-point steps can also accumulate representation effects.','One function is count-based; the other is step-based.','hard'),
Q('A 1-D array contains 24 values and should become a matrix with 3 rows while letting NumPy infer the column count. Which call is valid?', ['`a.reshape(3, -1)`', '`a.reshape(3, 24)`', '`a.reshape(-1, -1)`', '`a.reshape(3, 7)`'],0,'One dimension in a reshape can be `-1` so NumPy infers it from the total element count. Only one dimension may be inferred, and the new shape must preserve the number of elements.','The inferred dimension is calculated from the original element count.','medium'),
Q('Why should code use `np.isnan(values)` rather than `values == np.nan` to locate NaN entries?', ['NaN is not equal to itself under IEEE floating-point comparison rules', 'NaN values compare equal only when they have the same array index', '`== np.nan` modifies all NaN entries before comparing them', '`np.isnan` checks only for infinity, not NaN'],0,'IEEE NaN compares unequal to every value, including itself. `np.isnan` performs the intended element-wise NaN test; use `np.isfinite` when checking both NaN and infinities.','Recall the unusual equality behavior of NaN.','hard'),
Q('Which SciPy subpackage would be a natural starting point for numerical optimization routines such as minimizing an objective function?', ['`scipy.optimize`', '`scipy.io.wavfile`', '`scipy.spatial.distance` only', '`scipy.constants`'],0,'SciPy groups numerical methods into subpackages. `scipy.optimize` contains optimization algorithms such as minimization and root finding; the other choices address different tasks.','Choose the SciPy namespace whose purpose is optimization.','medium'),
],
'pandas': [
Q('Which Pandas structure is designed to represent a two-dimensional table with labeled rows and columns?', ['`DataFrame`', '`Series`', '`Index`', '`Categorical`'],0,'A DataFrame is a two-dimensional labeled data structure. A Series is one-dimensional; an Index stores axis labels.','Distinguish the two-dimensional table from a single labeled vector.','easy'),
Q('A CSV file has a header row and should be loaded into a DataFrame. Which call is idiomatic?', ['`pd.read_csv(path)`', '`pd.to_csv(path)`', '`pd.DataFrame.read(path)`', '`pd.load_table(path, format="csv")`'],0,'`read_csv` parses a CSV file into a DataFrame. `to_csv` performs the reverse operation by writing tabular data.','Choose the file-reading function, not the export function.','easy'),
Q('A DataFrame uses labels `["A", "B", "C"]` as its index. Which expression selects the row whose label is `"B"`?', ['`df.loc["B"]`', '`df.iloc["B"]`', '`df.loc[1]` in all cases', '`df.index(1)`'],0,'`.loc` selects by index label. `.iloc` selects by integer position, so the label `"B"` is not an appropriate `.iloc` argument.','Use the label-based accessor.','medium'),
Q('Why is `df.loc[df["score"] < 0, "score"] = 0` preferable to an ambiguous chained assignment?', ['It explicitly selects rows and the target column in one `.loc` assignment', 'It creates a new DataFrame but never updates `df`', 'It selects columns by integer position rather than labels', 'It converts the `score` column into a Python list before assignment'],0,'A single `.loc` operation identifies both the row mask and column to update. Chained indexing can operate on an intermediate object and may not reliably update the original DataFrame.','Keep row selection and column assignment in one indexing operation.','hard'),
Q('What does `df.groupby("team")["points"].mean()` conceptually compute?', ['The mean points value separately for each team group', 'The total number of rows for every column', 'The mean of all numeric columns without grouping', 'A merge between the team column and the points column'],0,'`groupby` partitions rows by team, selects the points column, and computes a mean for each group. This is a split–apply–combine operation.','Identify the grouping key, selected column, and aggregation.','medium'),
Q('A numeric column contains missing values and should retain all rows while replacing missing entries with its median. Which operation is appropriate?', ['`df["amount"].fillna(df["amount"].median())`', '`df.dropna(subset=["amount"])`', '`df["amount"].drop_duplicates()`', '`df["amount"].notna().sum()`'],0,'`fillna` replaces missing values; calculating the median first provides a numeric imputation value. `dropna` would remove rows rather than retain them.','The requirement is replacement, not row deletion.','medium'),
Q('Two DataFrames share a key column `customer_id`. Which Pandas operation performs a relational join based on that key?', ['`pd.merge(left, right, on="customer_id", how="left")`', '`pd.concat([left, right], axis=0)`', '`left.append(right)`', '`left.join(right, on="customer_id", how="drop")`'],0,'`merge` performs database-style joins on one or more keys and supports inner, left, right, and outer joins. `concat` combines along an axis without performing a key-based relational join.','Look for a key-based join parameter.','hard'),
Q('What is the typical purpose of `pd.concat([jan, feb], axis=0)` when both frames have the same columns?', ['Stack the rows of the two DataFrames vertically', 'Join columns using a shared key and remove unmatched records', 'Aggregate all numeric columns into their averages', 'Convert both DataFrames into a single Series'],0,'`concat` combines objects along an axis. With `axis=0`, rows are stacked; with `axis=1`, columns are aligned and placed side by side.','Axis 0 means concatenation along the row axis.','medium'),
Q('What does `df.duplicated(keep=False)` identify?', ['Every row that belongs to a duplicated group, including the first occurrence', 'Only the first row of every duplicated group', 'Only the final row of every duplicated group', 'Rows containing at least one missing value'],0,'With `keep=False`, all occurrences in a duplicated group are marked `True`. The default `keep="first"` marks later duplicates but keeps the first occurrence unmarked.','The key parameter is `keep=False`, not the default.','hard'),
Q('When should `pivot_table` be chosen over a simple `pivot`?', ['When duplicate row/column combinations must be aggregated using a function such as sum or mean', 'When the data must be converted from rows into a plain Python list', 'When a DataFrame needs to be sorted by its original index', 'When every row is guaranteed to have a unique row/column pair and no aggregation is needed'],0,'`pivot_table` supports aggregation for repeated combinations. `pivot` reshapes without aggregating and requires unique index/column pairs.','The key distinction is how duplicate combinations are handled.','expert'),
Q('A column stores quantities as text and arithmetic is required. Which method is commonly used to convert its dtype after checking the values are valid?', ['`df["quantity"].astype("int64")`', '`df["quantity"].rename("int64")`', '`df["quantity"].groupby("int64")`', '`df["quantity"].reset_index("int64")`'],0,'`astype` casts a Series or DataFrame to a requested dtype. Invalid strings may raise an error; use numeric conversion with error handling when data are messy.','Find the dtype conversion method.','medium'),
Q('Which call converts a column of date-like strings into Pandas datetime values?', ['`pd.to_datetime(df["date"])`', '`pd.date_range(df["date"])`', '`df["date"].to_timedelta()`', '`pd.read_csv(df["date"])`'],0,'`to_datetime` parses date/time values and returns datetime-like data. `date_range` constructs a range of timestamps rather than parsing a data column.','Distinguish parsing existing text from generating a date sequence.','medium'),
Q('Why is a vectorized expression such as `df["total"] = df["price"] * df["quantity"]` often preferred to `DataFrame.apply` with a row-wise lambda?', ['It expresses the column operation directly and can use optimized array operations', 'It always launches one operating-system process per row', 'It converts the DataFrame into a relational database automatically', 'It avoids calculating the product for rows that contain numbers'],0,'Vectorized column arithmetic uses Pandas/NumPy array operations and usually avoids the overhead of repeatedly calling Python code for each row.','The calculation is element-wise and already supported by vectorized operators.','hard'),
Q('What does `df.reset_index(drop=True)` do?', ['Replaces the current index with a default integer index and discards the old index values', 'Sorts rows by their index labels and keeps the old labels as columns', 'Deletes every row that has a missing value', 'Converts the DataFrame into a NumPy array'],0,'`reset_index` creates a new default integer index. With `drop=True`, the previous index is discarded rather than inserted as a column.','The `drop` argument controls whether the old index becomes a column.','medium'),
],
})
CORE_NEW.update({
'visualization': [
Q('A dataset contains paired observations `(age, income)` and the analyst wants to inspect the relationship between the two numeric variables. Which chart is most appropriate?', ['A scatter plot, with one variable on each axis', 'A histogram, with both variables converted to category labels', 'A pie chart, with one slice per observation', 'A stacked bar chart that assumes the observations are ordered'],0,'A scatter plot displays paired numeric values and helps reveal association, clusters, and outliers. A histogram instead displays the distribution of one numeric variable.','Choose a chart that preserves the pair of numeric coordinates.','medium'),
Q('Which chart is designed to show the frequency distribution of a continuous numeric variable by grouping values into intervals?', ['A histogram', 'A line chart with categories on the x-axis', 'A pie chart of unique raw values', 'A box plot with one box for each individual observation'],0,'A histogram groups numeric observations into bins and displays the count or density in each interval. It is not the same as a bar chart of discrete categories.','Look for bins that cover numeric intervals.','easy'),
Q('In Matplotlib’s object-oriented API, what is the relationship between a `Figure` and an `Axes`?', ['A Figure is the overall canvas and contains one or more Axes plotting areas', 'An Axes contains the Figure and can own several separate Figures', 'A Figure is the legend, while an Axes is the color palette', 'They are two names for the same object and cannot be used separately'],0,'A Figure is the top-level container. Each Axes represents an individual plotting area with its own data limits, labels, and artists.','Remember canvas versus an individual plotting area.','medium'),
Q('What does `fig, axes = plt.subplots(2, 2)` create?', ['One Figure with a 2-by-2 arrangement of four Axes objects', 'Four independent Figure objects with no shared container', 'A single Axes whose x-axis has four tick labels', 'A 2-by-2 NumPy data array but no plotting objects'],0,'`subplots(2, 2)` creates one Figure containing four Axes arranged in two rows and two columns. The returned `axes` collection provides access to those plotting areas.','Count the rows and columns in the requested subplot grid.','medium'),
Q('Several plotted lines need a legend. Which requirement normally makes each line appear with a meaningful label?', ['Supply a `label` when creating each plotted artist and call `legend()`', 'Set the x-axis label only and Matplotlib infers each line name', 'Call `tight_layout()` before every plot', 'Use a different figure size for every line'],0,'The `label` argument provides the legend text for an artist, and `ax.legend()` or `plt.legend()` displays it. Axis labels describe axes, not individual plotted series.','Series labels and axis labels describe different things.','medium'),
Q('Which Seaborn plot is particularly useful for comparing the median, quartiles, spread, and potential outliers across several categories?', ['`sns.boxplot(data=df, x="group", y="value")`', '`sns.heatmap(df["group"])`', '`sns.lineplot(data=df, x="group", y="value")` only', '`sns.countplot(data=df, x="value")`'],0,'A box plot summarizes a numeric distribution using quartiles, median, whiskers, and possible outlier markers. Grouping by a category makes distributions easier to compare.','Choose the plot that summarizes a distribution rather than individual points only.','hard'),
Q('Why is Plotly often selected for dashboards that need hover tooltips, zooming, and pan interactions in a browser?', ['It provides interactive, browser-rendered visualizations', 'It is a database engine that stores dashboard records', 'It replaces Pandas by converting every DataFrame to SQL', 'It produces only fixed raster images with no interaction'],0,'Plotly produces interactive visualizations that support browser interactions such as hover, zoom, and pan. It can be combined with Dash for dashboard applications.','The required features are browser-side chart interactions.','medium'),
Q('What idea does the grammar-of-graphics approach used by libraries such as plotnine/ggplot emphasize?', ['Building a plot by mapping data variables to visual properties and combining layers/scales', 'Choosing a single plotting function without describing data mappings', 'Storing chart values only as pixel coordinates', 'Using SQL joins to determine every chart color'],0,'The grammar of graphics describes plots through data, aesthetic mappings, geometric layers, scales, and related components. This separates the data mapping from the final rendering.','Think of data-to-aesthetic mappings and layers.','expert'),
Q('A figure must be exported as a high-resolution PNG file. Which Matplotlib operation should be called with the destination path?', ['`fig.savefig("report.png", dpi=300)`', '`fig.read_csv("report.png")`', '`plt.imread("report.png")`', '`ax.legend("report.png")`'],0,'`savefig` writes the current Figure to a file. The `dpi` argument controls raster resolution for formats such as PNG.','Choose the Figure method used to save a rendered chart.','easy'),
],
'databases': [
Q('In the Python DB-API pattern, which object is generally used to execute SQL statements after obtaining a connection?', ['A cursor created from the database connection', 'A Pandas Series created from the query text', 'A Matplotlib Axes object created from the connection', 'The database file path passed directly to `fetchall`'],0,'A connection manages the database session and creates cursors. A cursor executes SQL and provides methods for fetching result rows.','Separate the session/connection from the statement execution object.','easy'),
Q('After `cursor.execute("SELECT name FROM users")`, which call retrieves the next single row from the result set?', ['`cursor.fetchone()`', '`cursor.commit()`', '`cursor.close()`', '`cursor.rollback()`'],0,'`fetchone` returns the next row or `None` when no rows remain. `fetchall` returns all remaining rows; commit and rollback control transactions.','Choose the method that fetches one row.','easy'),
Q('Why should user-supplied values be passed as query parameters instead of concatenated into SQL text?', ['The driver binds the value as data, reducing SQL injection risk and handling quoting', 'The database automatically encrypts the entire database file', 'Parameter binding makes every query run as a stored procedure', 'Concatenation is required for prepared statements to work'],0,'Parameterized queries keep data separate from SQL syntax. This helps prevent injection and lets the driver handle value quoting and types; placeholder syntax is driver-specific.','Keep user input separate from the SQL command text.','hard'),
Q('A transaction contains several updates that should either all be persisted or all be canceled. Which database property is most directly relevant?', ['Atomicity: the transaction is treated as an all-or-nothing unit', 'Availability: every row is copied to a public mirror', 'Serialization: all values become JSON strings', 'Normalization: every transaction is stored in a separate Python list'],0,'Atomicity is the “all or nothing” part of ACID transactions. A commit makes successful changes durable; rollback cancels uncommitted changes.','Think of all operations succeeding together or failing together.','expert'),
Q('A data import detects invalid records after making several uncommitted inserts. Which operation should cancel those pending changes?', ['`connection.rollback()`', '`connection.commit()`', '`cursor.fetchall()`', '`connection.cursor()`'],0,'Rollback reverses the uncommitted transaction changes. Commit would make the changes durable, while fetch methods retrieve query results.','The requirement is to cancel, not finalize, the transaction.','medium'),
Q('Which standard-library module provides a lightweight file-based relational database that is commonly used for Python exercises?', ['`sqlite3`', '`csv`', '`pickle`', '`logging`'],0,'`sqlite3` provides an interface to SQLite, a lightweight relational database engine stored in a file or in memory. It supports SQL, connections, cursors, and transactions.','Choose the built-in module that exposes SQLite.','easy'),
],
'web-frameworks': [
Q('A Flask view is decorated with `@app.route("/reports", methods=["GET"])`. What does the route declaration configure?', ['The URL path and HTTP methods that dispatch a request to the view function', 'The SQL table that stores all report data', 'The static folder used for Python package installation', 'The HTML template that every route must use'],0,'The route decorator registers a URL rule and allowed HTTP methods with the Flask application. When a matching request arrives, Flask calls the associated view function.','Look for URL dispatch and allowed HTTP methods.','medium'),
Q('A Django project needs database models, migrations, and a built-in administration interface. Which Django component is most directly involved in defining database entities?', ['Django models, which are commonly mapped to tables through the ORM', 'Django template filters, which define relational constraints', 'Django static files, which create database indexes', 'Django URL patterns, which replace database models'],0,'Django models define application data structures and are mapped to relational database tables by the ORM. Migrations track schema changes; the admin can use registered models.','The ORM starts with model classes.','medium'),
Q('In a typical web application, what is the relationship between a request and a response?', ['A client sends a request; the server processes it and returns a response', 'The server sends a response first and the client invents a request afterward', 'A request is always a SQL transaction and a response is always a CSV file', 'Requests and responses are interchangeable names for a Python function'],0,'The HTTP request carries a method, target, headers, and sometimes a body. The server processes it and returns a response with a status code, headers, and optional body.','Think about the direction of communication.','easy'),
Q('Why should server-rendered templates escape untrusted text by default?', ['To prevent user-controlled content from being interpreted as executable HTML or script', 'To make every database query execute faster', 'To automatically authenticate every visitor', 'To convert the template into a Python bytecode file'],0,'Escaping encodes special characters so untrusted text is displayed as text rather than parsed as markup or script. It is an important defense against cross-site scripting (XSS).','The risk is treating user text as browser-executable markup.','hard'),
],
'web-scraping': [
Q('A Python crawler needs to fetch HTML and inspect the server’s HTTP response code before parsing. Which separation of responsibilities is appropriate?', ['Use Requests or urllib for HTTP transport, then parse the returned content with an HTML parser', 'Use Matplotlib to send the GET request and Pandas to open the socket', 'Use Scrapy only as an HTML character encoding and avoid HTTP clients', 'Use `re.sub` to establish a TCP connection and download the page'],0,'An HTTP client obtains the response and exposes status, headers, and body. An HTML parser or Scrapy selector then extracts elements from the response content.','Separate downloading a page from parsing its markup.','medium'),
Q('Why should a crawler check a site’s robots policy and apply reasonable delays or rate limits?', ['To avoid overloading the service and to respect the site’s published crawling preferences', 'To guarantee that every page is indexed by search engines', 'To bypass authentication and access restricted pages', 'To make HTML parsing deterministic regardless of page content'],0,'Responsible crawling considers robots directives, terms, request frequency, and server load. A crawler should not assume that a technically accessible URL is unrestricted.','This is about responsible request behavior, not parsing syntax.','hard'),
Q('In Scrapy, what is the role of a selector such as `response.css("h1::text").get()`?', ['Extract the text content of the first `h1` element matched by the CSS selector', 'Send a POST request to the page and retry on a timeout', 'Create a database connection for storing scraped records', 'Compile the selector into a Python class definition'],0,'Scrapy selectors query the response document. The CSS selector targets `h1` elements, and `::text` selects their text nodes; `get()` returns the first result or `None`.','The selector operates on the downloaded response document.','medium'),
],
'integrated': [
Q('What is the difference between `type(obj) is SomeClass` and `isinstance(obj, SomeClass)`?', ['`isinstance` also accepts instances of subclasses; exact type identity does not', '`type` checks inheritance while `isinstance` checks memory identity', 'Both expressions always return the same result for all class hierarchies', '`isinstance` accepts only objects with no base class'],0,'`isinstance` follows the inheritance hierarchy. `type(obj) is SomeClass` checks that the object’s exact runtime type is that class.','Think about how subclasses are handled.','hard'),
Q('What does `zip(names, scores)` yield when the two iterables have different lengths in ordinary Python 3 use?', ['Pairs up items until the shortest iterable is exhausted', 'Raises `ValueError` as soon as the lengths differ', 'Repeats the shorter iterable until the longer one ends', 'Sorts both inputs before creating pairs'],0,'`zip` is lazy and stops when the shortest input iterable is exhausted by default. In Python versions that support it, `strict=True` can request a length mismatch error.','The default behavior is to stop at the shortest input.','medium'),
Q('Which statement distinguishes `sorted(values)` from `values.sort()` when `values` is a list?', ['`sorted` returns a new list; `list.sort` modifies the list in place and returns `None`', '`sorted` modifies the list in place; `list.sort` returns a copy', 'Both return a tuple and leave the list unchanged', '`sorted` works only on numbers while `list.sort` works only on strings'],0,'`sorted` accepts any iterable and creates a new sorted list. `list.sort` is a list method that sorts that list in place and returns `None`.','Compare return value and mutation behavior.','medium'),
Q('What does `any([False, 0, "", None, 5])` return?', ['`True`, because at least one element is truthy', '`False`, because the first element is false', 'The integer `5`, because any returns the first truthy item', '`None`, because the iterable contains None'],0,'`any` returns a Boolean indicating whether at least one item is truthy. It short-circuits at the first truthy item; it does not return the item itself.','The function returns a Boolean summary of the iterable.','medium'),
Q('What does `all([])` return, and what reasoning explains it?', ['`True`, because no element violates the requirement that every element be truthy', '`False`, because an empty collection contains no true values', '`None`, because there is no first element to inspect', 'It raises `ValueError` because an iterable must be non-empty'],0,'`all` returns true for an empty iterable by vacuous truth: there is no counterexample to the claim that all elements are truthy.','Ask whether there is any element that falsifies the “all” condition.','expert'),
Q('Which built-in gives the number of items in a list, tuple, string, dictionary, or many other containers?', ['`len(obj)`', '`id(obj)`', '`dir(obj)`', '`hash(obj)`'],0,'`len` returns the number of items in supported containers. For dictionaries it counts keys; `id` reports object identity information, and `dir` lists attributes.','Choose the built-in that reports container length.','easy'),
Q('A reusable Python module contains helper functions and should run a demo only when executed directly. What is the idiomatic guard?', ['`if __name__ == "__main__":`', '`if __file__ == "main":`', '`if __package__ is True:`', '`if importlib.is_script():`'],0,'The guard checks whether Python is executing the module as the top-level script. On import, the module’s `__name__` is normally its import name, so the demo block is skipped.','Compare the special module variable in direct execution and import.','medium'),
],
})
EXTENSION_NEW = {
'beyond-comprehensions': [
Q('In a list comprehension `[f(x) for x in values if keep(x)]`, which operation happens first for each input item?', ['The filter condition `keep(x)` is evaluated before `f(x)` for retained items', '`f(x)` is always evaluated before the filter condition', 'The full list is sorted before either expression runs', 'The filter condition is evaluated only once for the entire iterable'],0,'The comprehension evaluates its `for` clause, then the filter condition. The output expression runs only when the filter is truthy.','The `if` clause filters items before the output expression is evaluated.','medium'),
Q('What is the main memory advantage of a generator expression over a list comprehension for a large sequence?', ['It produces values lazily instead of building the entire result list at once', 'It stores every result twice so each value can be reused', 'It automatically distributes the work across CPU cores', 'It guarantees faster execution for every possible workload'],0,'A generator expression yields values on demand, which can reduce peak memory usage. It is generally single-pass and may not be faster in every situation.','Think about when the values are materialized.','medium'),
Q('What happens when `next()` is called again after a generator has raised `StopIteration` because it is exhausted?', ['It raises `StopIteration` again', 'It restarts the generator from its first statement', 'It returns the last value a second time', 'It creates a fresh generator automatically'],0,'An exhausted iterator remains exhausted. Further calls to `next` continue to raise `StopIteration`; call the generator function again to create a new generator.','An iterator is not automatically reset after exhaustion.','medium'),
Q('What is the difference between `enumerate(items)` and `range(len(items))` when iterating over a sequence?', ['`enumerate` yields each item together with its counter directly', '`enumerate` sorts the items and `range` preserves their order', '`range` yields values and indexes while `enumerate` yields only indexes', 'They are equivalent only when every item is an integer'],0,'`enumerate` yields `(index, item)` pairs and avoids a separate index lookup. `range(len(items))` yields integer positions that must be used to access items.','Look at the values yielded by each construct.','medium'),
Q('A generator function contains `yield` inside a loop. When is the function body executed?', ['As the returned generator is iterated, advancing to each yield point', 'Completely at the moment the function is called', 'Only after the generator is converted to a list by Python automatically', 'During module import, before the function is called'],0,'Calling a generator function creates a generator object without running the body to completion. Iteration resumes execution until the next `yield` or exhaustion.','A generator suspends and resumes rather than returning all values immediately.','hard'),
Q('What does the default `zip(a, b)` behavior do if `a` contains 5 items and `b` contains 3?', ['It yields 3 pairs and stops when `b` is exhausted', 'It yields 5 pairs and pads the last two values with `None`', 'It raises an exception before yielding any pairs', 'It repeats the values of `b` until five pairs are created'],0,'By default, `zip` stops at the shortest iterable, so only three pairs are produced. `itertools.zip_longest` is a separate tool for padding to the longest iterable.','Compare the lengths and recall the default stopping rule.','medium'),
Q('What does `itertools.groupby(records, key=...)` group by?', ['Consecutive runs of equal keys in the input sequence', 'All equal keys globally, even when they occur far apart', 'Dictionary keys after converting every record to JSON', 'Items with the same object identity regardless of key value'],0,'`groupby` groups adjacent items with equal keys; it does not automatically sort or collect all matching keys globally. Sort first if global grouping is required.','The groups are based on adjacent runs, not an entire unsorted collection.','expert'),
Q('When does `all(generator_expression)` return `False`?', ['As soon as it encounters a falsy generated value', 'Only when the generator yields no values', 'Only after it has consumed the generator twice', 'When any generated value is truthy'],0,'`all` consumes the iterable and short-circuits at the first falsy item. For an empty iterable it returns true.','Look for the first counterexample to “all values are truthy”.','hard'),
Q('A custom iterator class must support `next(obj)`. Which special method must its iterator object implement?', ['`__next__()`', '`__iterable__()`', '`__getitem__all__()`', '`__yield__()`'],0,'An iterator implements `__iter__` returning itself and `__next__` returning the next item or raising `StopIteration`.','The method is named for retrieving the next item.','hard'),
Q('What is the memory behavior of `itertools.chain(first, second)`?', ['It lazily yields items from the first iterable and then the second', 'It materializes both iterables into one list immediately', 'It merges the items by sorting their values', 'It discards the first iterable after reading its length'],0,'`chain` produces an iterator that yields from each input iterable in order without constructing a combined list.','Think of lazy sequential iteration over multiple sources.','medium'),
],
'beyond-files': [
Q('Why does `with open(path) as handle:` help manage file resources?', ['The context manager closes the file when the block exits, including when an exception propagates', 'It automatically retries every failed disk operation', 'It encrypts the file while it is open', 'It guarantees that the file contents are valid JSON'],0,'File objects implement the context manager protocol. Exiting the `with` block closes the file even when the block exits because of an exception.','The benefit is deterministic resource cleanup.','easy'),
Q('What is the risk of opening an existing file with mode `"w"`?', ['The file is truncated when opened, so prior contents can be lost', 'The file is opened only for reading and cannot be changed', 'The file is always created as a compressed archive', 'The file is appended to without changing the current contents'],0,'Write mode creates the file if needed and truncates an existing file. Use append mode `"a"` to add content without first truncating it.','Recall what opening in write mode does to an existing file.','medium'),
Q('What is a key difference between text mode and binary mode when opening a file?', ['Text mode decodes/encodes text; binary mode reads and writes bytes without text decoding', 'Binary mode automatically parses JSON while text mode stores bytes', 'Text mode is restricted to ASCII and binary mode is restricted to UTF-8', 'Binary mode always compresses file contents'],0,'Text mode uses an encoding to translate between bytes and `str`. Binary mode returns and accepts `bytes`, which is appropriate for images, archives, and other binary formats.','Focus on `str` versus `bytes`.','medium'),
Q('Which pair correctly distinguishes `json.load` and `json.loads`?', ['`load` reads JSON from a file-like object; `loads` parses JSON from a string or bytes object', '`load` parses a string; `loads` writes JSON to a file', 'Both accept only Python dictionaries and return JSON text', '`loads` converts arbitrary Python objects into pickle streams'],0,'The final “s” in `loads` indicates parsing from a string-like value. `dump` and `dumps` are the corresponding serialization functions.','Match each function to a file object or a string.','medium'),
Q('What is a practical advantage of `pathlib.Path` over manually joining path strings?', ['It provides path-aware operations that handle platform-specific separators and path components', 'It encrypts paths so they cannot be read by other processes', 'It executes any file represented by the path object', 'It ensures every path points to an existing file'],0,'`Path` models filesystem paths and provides readable methods such as `/` composition, `exists`, `read_text`, and `glob`. It does not guarantee a path exists.','Think about clearer, portable filesystem path operations.','medium'),
Q('Why must data from an untrusted source not be deserialized with `pickle.loads`?', ['Unpickling can execute attacker-controlled code during object reconstruction', 'Pickle accepts only primitive integers and rejects custom classes', 'Pickle automatically verifies the sender’s digital signature', 'Unpickling always deletes the source file'],0,'Pickle is a Python object serialization format, not a safe interchange format for untrusted input. Loading malicious pickle data can execute arbitrary code.','The concern is code execution during deserialization.','expert'),
Q('What does `readline()` return when reading a text file?', ['The next line as a string, usually including its newline if present', 'A list containing every remaining line', 'The total number of lines in the file', 'A bytes object regardless of the file mode'],0,'`readline` reads one line from the current file position. In text mode it returns a string and normally retains the line-ending character when present.','It reads one line, not the complete file.','easy'),
Q('Why is iterating over a file object often more memory-efficient than calling `read()` on a very large file?', ['Iteration processes lines incrementally instead of loading the entire file into memory', '`read()` automatically compresses the contents before returning', 'Iteration creates a separate process for each line', 'A file iterator skips lines that contain more than one character'],0,'A file object is an iterator over lines, allowing line-by-line processing with bounded memory. `read()` without a size requests the entire remaining content.','Consider peak memory when processing a large file.','medium'),
],
'beyond-quality': [
Q('What is the key purpose of a unit test?', ['To verify a small unit of behavior in isolation with controlled inputs and expected results', 'To measure the network throughput of the entire production system', 'To install every package required by the application', 'To create the application’s database schema from scratch'],0,'Unit tests target small units such as functions or methods and check behavior against expectations. Integration and end-to-end tests cover broader interactions.','The test scope is intentionally small and focused.','easy'),
Q('What do Python type hints provide by default?', ['Machine-readable annotations that tools can use; Python does not enforce them automatically at runtime', 'A runtime type checker that blocks every incompatible assignment', 'A compiler that translates Python into C before execution', 'A database schema that validates every external API request automatically'],0,'Annotations document intended types and support static analysis, editors, and optional runtime-validation frameworks. Standard Python execution does not automatically enforce them.','Distinguish static tooling support from runtime enforcement.','hard'),
Q('A project must reproduce an environment using the same installed package versions. Which command commonly writes installed package versions to a requirements-style file?', ['`python -m pip freeze`', '`python -m pip clean --all`', '`python -m pip cache purge`', '`python -m pip check --json`'],0,'`pip freeze` prints installed distributions in requirements format, which can be redirected to a file. It records the current environment; it does not guarantee every platform dependency is portable.','Choose the command that reports installed package versions.','medium'),
Q('In semantic versioning, what does an increase in the major version normally signal for a stable public API?', ['Potentially incompatible changes that may require consumers to adapt', 'Only documentation typo fixes with no behavior change', 'Only backward-compatible bug fixes', 'A change in the date on which the package was uploaded'],0,'Semantic versioning uses MAJOR.MINOR.PATCH. A major increment indicates incompatible API changes, while minor versions add backward-compatible functionality and patches contain backward-compatible fixes.','Recall the meaning of the first component in MAJOR.MINOR.PATCH.','medium'),
Q('Why should a project use a virtual environment rather than installing every dependency globally?', ['It isolates project dependencies and helps prevent version conflicts between projects', 'It makes Python code execute without an interpreter', 'It guarantees that the project has no security vulnerabilities', 'It automatically synchronizes package versions across all developers’ machines'],0,'Virtual environments provide isolated package installations for a project. They reduce cross-project conflicts, though teams still need dependency declarations and version control for reproducibility.','Think about dependency isolation.','easy'),
Q('What is the main role of a mock in a unit test?', ['Replace or simulate a dependency so the unit can be tested under controlled conditions', 'Convert a Python function into a compiled extension module', 'Generate production database records from a schema', 'Measure CPU cache misses during program execution'],0,'Mocks and other test doubles simulate collaborators such as APIs, clocks, or database clients. They help isolate a unit and test interactions without relying on a live dependency.','The mock stands in for a collaborator during a test.','medium'),
Q('What is a useful property of a `dataclass` for ordinary data-holding classes?', ['It can generate methods such as `__init__` and `__repr__` from annotated fields', 'It automatically creates a SQL database and migrations', 'It makes every field deeply immutable', 'It prevents instances from being subclassed'],0,'The `@dataclass` decorator generates common methods based on annotated fields. Mutability is still the default unless options such as `frozen=True` are used.','Think of boilerplate methods generated from field definitions.','medium'),
Q('What is the purpose of a lock when multiple threads access shared mutable state?', ['To ensure only one thread at a time enters a protected critical section', 'To make the shared object immutable for the rest of the program', 'To increase the number of concurrent writes to the same value', 'To restart a thread automatically whenever it blocks'],0,'A lock coordinates access to a critical section so operations on shared state do not interleave unsafely. Correct lock design must also avoid deadlocks and excessive contention.','A lock protects an operation on shared state.','hard'),
],
'beyond-algorithms': [
Q('What is the amortized time complexity of appending one item to the end of a Python list over many append operations?', ['Amortized O(1), although an individual resize can take O(n)', 'Always O(n) because every append copies the full list', 'Always O(log n) because lists are balanced trees', 'O(1) worst-case with no possible resizing'],0,'Python lists over-allocate capacity, so most appends are constant-time. Occasional resizing copies elements, making an individual append linear but the amortized cost constant.','Distinguish an individual worst-case resize from average amortized cost.','expert'),
Q('Why is inserting an item near the beginning of a Python list generally O(n)?', ['Existing elements must be shifted to make room for the new item', 'Python must sort the whole list after every insertion', 'Lists are implemented as linked lists and must traverse every pointer', 'The item is serialized to JSON before insertion'],0,'A Python list is a dynamic array. Inserting near the front shifts many subsequent references, so the cost grows with the number of elements.','Think about the contiguous array representation.','medium'),
Q('What does it mean for a sorting algorithm to be stable?', ['Equal-key elements preserve their original relative order after sorting', 'The output is guaranteed to use constant memory', 'The algorithm never compares two values with equal keys', 'The sorted result cannot be modified afterward'],0,'A stable sort preserves the relative order of elements whose sort keys compare equal. Stability is useful when sorting records by multiple fields in stages.','Focus on the order of items with equal keys.','hard'),
Q('Which data structure is a natural choice for repeatedly retrieving the smallest item efficiently?', ['A min-heap, such as the structure managed by Python’s `heapq` module', 'A stack, because it always returns the smallest value', 'A FIFO queue, because values are automatically sorted', 'A plain set, because iteration is guaranteed to be ascending'],0,'A min-heap keeps the smallest item at the root, making it efficient to inspect or pop the minimum. `heapq` implements a min-heap using a list.','Choose the structure that maintains the minimum at the root.','medium'),
Q('What is the key property of breadth-first search (BFS) on an unweighted graph?', ['It explores vertices in increasing distance from the start and can find shortest paths by edge count', 'It always explores the deepest path before considering siblings', 'It requires the graph to be a complete binary tree', 'It sorts all vertices alphabetically before visiting them'],0,'BFS explores a graph level by level using a queue. In an unweighted graph, the first discovered path to a vertex has the minimum number of edges.','BFS uses levels and a queue.','hard'),
Q('Which data structure is commonly used to implement depth-first search iteratively?', ['A stack, including the program’s own explicit stack of pending vertices', 'A priority queue ordered by numeric vertex labels only', 'A FIFO queue that forces level-order expansion', 'A hash table that automatically performs recursion'],0,'DFS explores one branch deeply before backtracking. An explicit stack can reproduce the behavior of recursive DFS.','Think about the last discovered vertex being explored first.','medium'),
Q('What is the average-case lookup complexity for a key in a well-distributed Python dictionary?', ['O(1) average case, with O(n) worst case under heavy collisions', 'O(n log n) average case because keys are always sorted', 'O(log n) average and worst case because dictionaries are balanced trees', 'O(1) worst case regardless of key distribution'],0,'Dictionary lookup is expected constant time under typical hashing assumptions. Adversarial or pathological collision patterns can degrade performance toward linear time.','Separate average-case hashing behavior from worst-case collisions.','hard'),
Q('Why can `collections.deque` be preferable to a list for a queue with frequent operations at both ends?', ['Appending and popping at either end are approximately O(1)', 'It keeps every item sorted automatically', 'It uses integer-only storage, reducing all operations to O(1)', 'It provides constant-time indexing at every possible position'],0,'A deque is optimized for appends and pops at both ends. A list is efficient at the right end but shifting elements makes repeated front removal expensive.','The workload repeatedly inserts and removes at the left as well as the right.','medium'),
],
'beyond-concurrency': [
Q('In conventional GIL-enabled CPython, why do multiple CPU-bound Python threads often fail to achieve linear speedup across cores?', ['The Global Interpreter Lock limits simultaneous execution of Python bytecode in one interpreter', 'Threads cannot share memory in Python', 'The operating system forces all Python threads to use one CPU instruction', 'The GIL disables all network and file operations'],0,'In conventional CPython builds, the GIL allows only one thread at a time to execute Python bytecode in an interpreter. Threads can still help with I/O-bound work; multiprocessing can use multiple processes for CPU-bound tasks.','The question is about Python bytecode execution in conventional CPython.','expert'),
Q('What is the major advantage of using multiple processes for CPU-bound work?', ['Separate processes can run Python code on multiple CPU cores independently', 'Processes always share one Python heap without serialization', 'Processes eliminate the need to handle failures', 'Processes make every task execute in constant time'],0,'Separate processes have separate interpreters and can execute on multiple cores. Communication and data transfer add overhead, so multiprocessing is not automatically faster for every task.','Think about independent process execution across CPU cores.','medium'),
Q('What is the role of an event loop in an asyncio application?', ['It schedules and resumes coroutines when asynchronous operations become ready', 'It executes every coroutine on a separate operating-system process', 'It converts all I/O-bound operations into synchronous calls', 'It guarantees that shared state cannot have race conditions'],0,'The event loop coordinates tasks and resumes suspended coroutines as awaited operations complete. It supports cooperative concurrency rather than creating one thread per coroutine.','Look for the component that schedules coroutine execution.','hard'),
Q('Why must an `async def` function generally be awaited or scheduled to perform its coroutine body?', ['Calling it creates a coroutine object; execution proceeds when it is awaited or scheduled', 'Calling it executes the entire function immediately and returns its final value', 'It can be called only from a different operating-system process', 'It automatically creates a background thread and waits for it'],0,'Calling an async function creates a coroutine object. The coroutine runs when awaited or scheduled on an event loop, rather than executing to completion immediately.','Distinguish creating a coroutine object from running it.','medium'),
Q('What problem does a race condition describe?', ['The result depends on the timing or interleaving of operations on shared state', 'A program consistently uses more memory than its input size', 'An algorithm sorts records in the wrong alphabetic order only', 'A thread is created before its parent process'],0,'A race condition occurs when timing or interleaving affects correctness, often because multiple tasks access shared mutable state without adequate coordination.','The key idea is nondeterministic interleaving of operations.','medium'),
Q('Which statement about `await` is accurate?', ['It suspends the current coroutine until the awaited awaitable completes, allowing the event loop to run other tasks', 'It blocks the entire operating system until every task in the process finishes', 'It can be used in any ordinary function without async context', 'It converts the awaited result into a new thread automatically'],0,'`await` suspends the current coroutine at an awaitable. While it is suspended, the event loop can run other ready tasks; it is not a general-purpose thread-creation operation.','Think about what happens to the current coroutine while waiting.','hard'),
Q('Why might adding `async` syntax around a CPU-intensive pure-Python loop not make the loop faster?', ['The loop does not yield while computing, so it can monopolize the event loop', 'Every `async` function automatically runs on the GPU', 'Asyncio requires every numeric operation to be performed in SQL', 'CPU-intensive work is always split across all available cores by `await`'],0,'Asyncio provides cooperative concurrency. A CPU-bound loop that does not await can block the event loop; offload CPU-heavy work to processes or another suitable executor.','An event loop can switch tasks only when control is yielded.','expert'),
Q('What is a deadlock in a concurrent program?', ['Two or more tasks wait indefinitely for resources held by one another', 'A program finishes all tasks successfully but returns them in a different order', 'A thread uses more memory than its parent process', 'A lock is acquired and released by the same thread normally'],0,'Deadlock occurs when tasks are stuck waiting on resources in a cycle or another unrecoverable wait condition. Lock ordering and careful resource design help prevent it.','Look for a circular wait involving resources.','hard'),
],
'beyond-security': [
Q('Which HTTP methods are defined as idempotent in typical HTTP semantics?', ['Methods such as GET, PUT, and DELETE are idempotent in intended effect', 'POST is always idempotent and GET is never idempotent', 'Every HTTP method is idempotent because requests are stateless', 'PATCH and POST are guaranteed to be idempotent for every API'],0,'An idempotent method has the same intended server effect when repeated. GET, PUT, and DELETE are defined as idempotent in HTTP semantics; an API may add application-specific behavior.','Think about whether repeating the same request changes the intended result again.','expert'),
Q('What is the main purpose of HTTPS for an API client?', ['Protect data in transit using TLS, including server authentication and connection confidentiality/integrity', 'Encrypt data stored in the server’s database automatically', 'Guarantee that the API response is free from malware', 'Replace authentication and authorization checks inside the application'],0,'HTTPS uses TLS to protect the connection, authenticate the server (when validated correctly), and provide confidentiality and integrity in transit. It does not secure server storage or replace application authorization.','The protection applies to the network connection.','medium'),
Q('An endpoint accepts a requested page size. Which validation is most appropriate before using it in a database query?', ['Check that it is an integer within a sensible permitted range', 'Trust the input because HTTP clients are always controlled by the server', 'Execute the string as Python code to determine the intended value', 'Remove all digits so the database receives plain text'],0,'Input validation should enforce type, format, and range constraints before values influence application logic or resource usage. Parameterized queries are still needed for SQL values.','Validate both the expected type and allowed range.','medium'),
Q('Why should an API client set a timeout on outbound HTTP requests?', ['To bound how long the program waits for connection or response activity', 'To guarantee that the remote server returns HTTP 200', 'To encrypt the request body before transmission', 'To retry the request forever until a response arrives'],0,'Timeouts prevent a request from waiting indefinitely and help services control resource use. Connection and read timeouts can be configured separately by clients such as Requests.','The goal is to bound waiting time, not guarantee success.','medium'),
Q('What does rate limiting protect an API from?', ['Excessive request volume from a client or group of clients over a period', 'A client sending a JSON object instead of an XML document', 'A server using a relational rather than document database', 'A user entering a value with the wrong Python type'],0,'Rate limits cap request frequency or volume and help protect availability, fairness, and backend resources. They are commonly enforced per key, user, IP, or route.','Focus on limiting request frequency or volume.','medium'),
Q('Which practice is safest for an API key used by a deployed Python service?', ['Load it from a secrets manager or protected environment configuration and never commit it to source control', 'Hard-code it in a public repository so every deployment uses the same value', 'Print it in logs to simplify future debugging', 'Place it in a public URL and commit the URL to project documentation'],0,'Secrets should be kept outside source control and exposed only to the runtime component that needs them. Logs and public URLs can leak credentials.','The key must remain outside source code and logs.','easy'),
Q('What does the principle of least privilege require for an application service account?', ['Grant only the permissions needed for the service’s specific tasks', 'Grant administrator rights so permission errors never occur', 'Share one root credential across all services', 'Disable access controls for requests from internal networks'],0,'Least privilege limits the impact of mistakes or compromise by granting only the access required for a task, ideally with narrow scope and limited duration.','Choose the smallest permission set that still allows the task.','medium'),
Q('An API client retries a request after a timeout but cannot tell whether the server processed the original request. Which design helps avoid duplicate creation?', ['An idempotency key that lets the server recognize repeated submissions as the same operation', 'A random new request body on every retry', 'A longer URL path with the user’s password included', 'Disabling all server-side request validation'],0,'For operations such as payment or resource creation, an idempotency key allows the server to return the prior outcome for a repeated logical request rather than applying it twice.','The client needs a stable identifier for retries of the same logical action.','expert'),
],
}

# The 100 code exercises keep their existing self-contained snippets and answer
# keys, but every stem now tells the learner exactly which behavior to trace.
CODE_PROMPTS = [
'With integer operands 8 and 3, which ordered pair is produced by floor division and modulo?',
'Because the left operand is a string, how does Python evaluate multiplying it by 2?',
'What does this print for the result of true division and the result’s runtime type?',
'After both augmented assignments execute, what final value is stored in x?',
'Which Boolean values are printed for zero, an empty string, and the non-empty string "0"?',
'Because `b` is an alias of `a`, what list contents are visible after `b += [3]`?',
'Python exponentiation is right-associative. What value does this expression calculate?',
'What Boolean result is produced when x is exactly equal to the strict upper bound?',
'What does Python print when the two floating-point expressions are compared for exact equality?',
'Which sequence of values is printed as `range(3)` is iterated?',
'What cumulative total is printed after adding the integers generated from 1 up to 4?',
'How does `continue` affect the iteration where n equals 2, and what values remain visible?',
'At n equal to 2, `break` is executed before the print statement. Which values have already been printed?',
'When the while condition becomes false normally, which part of the loop statement prints the completion message?',
'How does the nested loop order the six sums produced from the two outer and three inner iterations?',
'Does the loop-level `else` execute after a loop that reaches normal exhaustion, even though its body contains only `pass`?',
'Because `break` is reached when x equals 2, which output lines remain after the loop-level else is skipped?',
'Which branch is selected when x is 7: the first condition, the second condition, or the final else?',
'Which two characters are selected by the positive index 0 and the negative index -1?',
'Which substring is produced by the half-open slice from index 1 up to but excluding index 4?',
'How do the two chained string methods transform the whitespace-padded input before it is printed?',
'What exact text results when the three labels are joined using a hyphen separator?',
'When `replace` is limited to two replacements, which two occurrences of the target character change?',
'How does the f-string format specifier `03d` render the integer score?',
'What do the negative-step and step-two slices return from the same three-character string?',
'Why does appending `[3, 4]` as one argument create a nested list rather than two new top-level elements?',
'How does `extend` differ from `append` when the supplied iterable contains two values?',
'What are the sorted list and the return value of `list.sort()` after the call?',
'Which element is selected by index -2, and which values are selected by the slice 1:3?',
'Which values survive the comprehension filter, and what is the resulting list of their squares?',
'Why do all three rows display the changed first value after the list-multiplication construction?',
'What value does `pop(1)` return, and what remains in the list afterward?',
'Which value is retrieved when the dictionary is indexed with the existing key "b"?',
'What does `get` return when the requested key is missing and an explicit default of zero is supplied?',
'How many keys remain after updating an existing key and inserting a new one, and what is the updated value?',
'Which total is produced by summing the dictionary’s values rather than its keys?',
'Because `b` references the same dictionary as `a`, what change is visible through `a` after the update?',
'What value is returned by the function call with arguments 2 and 3?',
'Which default argument is used when `greet` is called without an explicit name?',
'How many positional values are collected into `args` by this function call?',
'Which keyword value is retrieved from `kwargs` when both mode and debug are supplied?',
'What number is printed when the lambda function squares the argument 5?',
'Does assigning x = x + 1 inside the function change the caller’s integer variable a?',
'How does the mutable default list behave across the two calls that omit the second argument?',
'What list is produced after the lambda doubles every input value through `map`?',
'How does `enumerate` pair each letter with a counter when the starting counter is 1?',
'Which element is retrieved from the tuple at index 1?',
'What value is printed after tuple unpacking assigns the two elements to a and b?',
'Which exception is raised when code attempts item assignment on an immutable tuple?',
'Can the list inside this tuple be mutated, and what exact nested structure is printed afterward?',
'Which string is returned by the instance method after a Dog object is created?',
'What value is read from the instance attribute initialized with the constructor argument 7?',
'Which inherited method implementation is used when the Child class does not override `show`?',
'Which implementation runs when the subclass overrides the parent method with the same name?',
'How does `super().__init__()` affect the attributes available on the child instance?',
'What string results when the child method extends the parent method’s result using `super()`?',
'Why does modifying the value through alias b also change the value read through alias a?',
'How does Python name-mangle the double-underscore attribute, and which `hasattr` check succeeds?',
'What value is returned when the static method is called directly on its class?',
'Which message is printed when converting the non-numeric string to an integer raises ValueError?',
'In what order do the try, else, and finally suites print when the try suite completes successfully?',
'Which output lines appear when division by zero is handled and the finally cleanup suite runs?',
'Why does the ValueError escape this try statement instead of being handled by its except clause?',
'Why is the success-path else output absent after the RuntimeError is raised and caught?',
'When this file is executed directly, what Boolean value does the comparison with `__main__` produce?',
'Which comparison result is printed when the numeric severity of ERROR is compared with WARNING?',
'What array values result from adding the scalar 2 to each element of the NumPy array?',
'What tuple does NumPy report for the shape of the two-row, two-column array?',
'Which elements are returned by the basic slice selecting indexes 1 and 2?',
'What column totals are produced by summing the matrix along axis 0?',
'Which scalar is selected from row index 1 and column index 2 of the reshaped array?',
'What Boolean list is generated by comparing each element with 1 and converting the mask to a list?',
'Why does assigning through this basic slice change the corresponding element in the original array?',
'Which three evenly spaced values does `linspace` generate when both endpoints are included?',
'What shape results when NumPy broadcasts a column vector of shape (3, 1) with a row vector of shape (2,)?',
'Which values remain after Boolean indexing selects only the even elements?',
'Why does reshaping five elements into a 2-by-2 array raise a ValueError?',
'Which scalar value is selected by `iloc[1]` from this Series with its default integer index?',
'What floating-point mean is computed from the three Age values in the DataFrame?',
'How many missing values does the `isna` mask count in the column?',
'Why does the label-based slice from row label 1 through row label 2 include both values?',
'What group-to-mean mapping is produced when score is grouped by team?',
'How many rows and columns remain after duplicate rows are removed from this one-column DataFrame?',
'What values replace the missing entry when `fillna(0)` is applied to this numeric column?',
'Which cell is returned by selecting row position 0 and column position 1 with `iloc`?',
'Which values are present after the `.loc` mask assigns zero to entries greater than 1?',
'Why does the inner join retain only the shared identifier and what shape does the result have?',
'What sum is returned for group "a" after the values are grouped and aggregated?',
'Which type of chart is created when `plt.hist` receives a sequence of numeric observations?',
'Which parts of the plot are affected by the two axis-label calls?',
'What plotting objects are created, and what does `ax.plot` draw on them?',
'What distribution comparison is encoded by mapping the group column to x and the numeric value to y in this Seaborn call?',
'What does this parameterized SQL statement retrieve, and what does the separate tuple supply?',
'What happens to pending transaction changes and the connection resource after these two calls?',
'Why is passing `user_name` as a separate SQL parameter safer than interpolating it into the query string?',
'Which URL path and HTTP method are registered for the Flask view function?',
'What module name is displayed by the Flask application object when the file is run as the main script?',
'Which HTTP operation is initiated when Requests calls `get` with the supplied URL?',
'What kind of response status causes `raise_for_status()` to raise an HTTPError?',
'Which practices in this request loop help bound waiting time and make crawling responsible?',
]

assert len(CORE_NEW['environment']) == 5
assert len(CORE_NEW['basics']) == 10
assert len(CORE_NEW['control']) == 10
assert len(CORE_NEW['strings']) == 9
assert len(CORE_NEW['dictionaries']) == 6
assert len(CORE_NEW['lists']) == 9
assert len(CORE_NEW['functions']) == 11
assert len(CORE_NEW['regex']) == 4
assert len(CORE_NEW['tuples']) == 5
assert len(CORE_NEW['oop']) == 14
assert len(CORE_NEW['exceptions']) == 7
assert len(CORE_NEW['modules']) == 5
assert len(CORE_NEW['numpy-scipy']) == 12
assert len(CORE_NEW['pandas']) == 14
assert len(CORE_NEW['visualization']) == 9
assert len(CORE_NEW['databases']) == 6
assert len(CORE_NEW['web-frameworks']) == 4
assert len(CORE_NEW['web-scraping']) == 3
assert len(CORE_NEW['integrated']) == 7
assert sum(map(len, CORE_NEW.values())) == 150
assert len(EXTENSION_NEW['beyond-comprehensions']) == 10
assert len(EXTENSION_NEW['beyond-files']) == 8
assert len(EXTENSION_NEW['beyond-quality']) == 8
assert len(EXTENSION_NEW['beyond-algorithms']) == 8
assert len(EXTENSION_NEW['beyond-concurrency']) == 8
assert len(EXTENSION_NEW['beyond-security']) == 8
assert sum(map(len, EXTENSION_NEW.values())) == 50
assert len(CODE_PROMPTS) == 100

# Expand short API/keyword-only distractors in the retained first questions of
# each pair. The option still names the exact Python construct, but now tests
# a learner's understanding rather than a one-word recognition guess.
ELABORATE = {
'int': '`int` — the built-in type for whole-number values',
'float': '`float` — the built-in type for floating-point numeric values',
'bool': '`bool` — the type with the truth values True and False',
'str': '`str` — an immutable sequence of Unicode text characters',
'list': '`list` — a mutable ordered sequence of elements',
'tuple': '`tuple` — an immutable ordered sequence of elements',
'dict': '`dict` — a mutable mapping from unique hashable keys to values',
'set': '`set` — a mutable collection of unique hashable elements',
'bytes': '`bytes` — an immutable sequence of byte values',
'complex': '`complex` — a numeric type with real and imaginary components',
'for': '`for` — iterate over items supplied by an iterable',
'while': '`while` — repeat a block while its condition remains true',
'if': '`if` — execute a block when its condition is truthy',
'break': '`break` — terminate the nearest enclosing loop immediately',
'continue': '`continue` — skip the rest of this iteration and proceed to the next',
'pass': '`pass` — a no-operation placeholder statement',
'elif': '`elif` — test another condition when earlier branches were false',
'finally': '`finally` — run cleanup code while leaving the try statement',
'raise': '`raise` — signal an exception to the caller or an enclosing handler',
'return': '`return` — send a value back from the current function',
'print': '`print` — write a textual representation to the output stream',
'strip()': '`strip()` — return a string with leading and trailing whitespace removed',
'split()': '`split()` — return a list of substrings separated by a delimiter or whitespace',
'join()': '`join()` — combine strings using the current string as a separator',
'replace()': '`replace()` — return a new string with selected occurrences substituted',
'find()': '`find()` — return the first matching position or -1 when absent',
'index()': '`index()` — return the first matching position or raise ValueError when absent',
'regex': 'A regular-expression pattern used to search or validate text',
'lambda': 'A concise anonymous function whose body is a single expression',
'NoneType': '`NoneType` — the type of the singleton value `None`',
'BaseModel': '`BaseModel` — a model class from a validation library, not a standard exception base',
'Exception': '`Exception` — the usual base class for application-defined exceptions',
'np.array(values)': '`np.array(values)` — construct a NumPy ndarray from the supplied values',
'np.list(values)': '`np.list(values)` — not a NumPy array-construction function',
'np.dataframe(values)': '`np.dataframe(values)` — not a NumPy ndarray constructor',
'np.frame(values)': '`np.frame(values)` — not a NumPy ndarray constructor',
'matplotlib.Figure': '`matplotlib.figure.Figure` — a plotting container, not NumPy’s array type',
'scipy.Table': 'A SciPy scientific data structure; SciPy does not define the core ndarray type',
'numpy.ndarray': '`numpy.ndarray` — NumPy’s homogeneous N-dimensional array object',
'pandas.DataFrame': '`pandas.DataFrame` — a labeled two-dimensional tabular structure',
'np.arange()': '`np.arange()` — create values using a start, stop, and step interval',
'np.linspace() only': '`np.linspace()` — generate a fixed number of evenly spaced samples',
'np.zeros()': '`np.zeros()` — allocate an array filled with zeros',
'np.eye()': '`np.eye()` — create a two-dimensional identity-like array',
'flatten()': '`flatten()` — return a flattened copy of an array',
'reshape()': '`reshape()` — change array dimensions while preserving element count',
'unique()': '`unique()` — return the distinct values in an array',
'sort()': '`sort()` — sort values in place along an array axis',
'axis=0': '`axis=0` — reduce down rows, leaving one result per column',
'axis=1': '`axis=1` — reduce across columns, leaving one result per row',
'axis=-1 only': '`axis=-1` — reduce along the last array axis',
'axis=None is required': '`axis=None` — reduce across all elements of the array',
'SciPy': 'SciPy — scientific algorithms such as optimization, integration, and statistics',
'Seaborn': 'Seaborn — statistical visualization built on top of Matplotlib',
'Scrapy': 'Scrapy — a framework for crawling websites and extracting structured data',
'Flask': 'Flask — a lightweight web framework for Python applications and APIs',
'Django': 'Django — a batteries-included web framework with an ORM and admin tools',
'Requests': 'Requests — an HTTP client library for sending requests and inspecting responses',
'requests': 'Requests — an HTTP client library for sending requests and inspecting responses',
'logging': '`logging` — the standard module for severity-based application logs',
'Cursor': 'A database cursor — the object used to execute statements and fetch rows',
'Flask route': 'A Flask route — URL dispatch configuration that maps requests to a view',
'NumPy axis': 'A NumPy axis — a dimension along which an array operation is performed',
'DataFrame': 'A Pandas DataFrame — a labeled two-dimensional table',
'Series': 'A Pandas Series — a labeled one-dimensional array',
'Figure': 'A Matplotlib Figure — the overall container for one or more Axes',
'Artist only': 'An Artist — a drawable element within a Matplotlib Figure or Axes',
'Legend entry': 'A legend entry — a label that identifies a plotted data series',
'Colorbar': 'A colorbar — a visual scale that maps numeric values to colors',
'loc': '`.loc` — select rows or columns by index/column labels',
'iloc': '`.iloc` — select rows or columns by integer position',
'ix in current Pandas': '`.ix` — a deprecated mixed label/position indexer, removed from modern Pandas',
'at only': '`.at` — access a single value by row and column labels',
'dropna()': '`dropna()` — remove rows or columns containing missing values',
'fillna()': '`fillna()` — replace missing values with supplied values or a fill method',
'drop_duplicates()': '`drop_duplicates()` — remove duplicate rows while keeping the first by default',
'reset_index()': '`reset_index()` — replace the index with a default integer index',
'merge()': '`merge()` — join DataFrames using shared key columns or indexes',
'pivot()': '`pivot()` — reshape data without aggregating duplicate index/column combinations',
'pivot_table()': '`pivot_table()` — reshape and aggregate values for repeated row/column combinations',
'melt()': '`melt()` — unpivot columns from wide form into long form',
'explode()': '`explode()` — turn list-like values in a column into separate rows',
'concat()': '`concat()` — combine Pandas objects along rows or columns',
'astype()': '`astype()` — cast a Series or DataFrame to a requested dtype',
'pd.read_csv()': '`pd.read_csv()` — parse a CSV file into a DataFrame',
'pd.to_csv()': '`pd.to_csv()` — write a DataFrame or Series to CSV',
'pd.ExcelWriter()': '`pd.ExcelWriter()` — configure writing data to an Excel workbook',
'pd.read_json() only': '`pd.read_json()` — read JSON data rather than a CSV file',
'plt.plot()': '`plt.plot()` — draw a line plot from x/y data',
'plt.boxplot()': '`plt.boxplot()` — summarize a numeric distribution with quartiles and whiskers',
'plt.hist()': '`plt.hist()` — show a numeric distribution using bins',
'plt.imshow() only': '`plt.imshow()` — display image-like or 2-D array data',
'commit()': '`commit()` — finalize the current transaction’s pending changes',
'fetchall()': '`fetchall()` — retrieve all remaining rows from a query result',
'close_cursor() only': '`close()` — release a cursor resource without committing a transaction',
'rollback()': '`rollback()` — cancel uncommitted transaction changes',
'connect()': '`connect()` — establish a database connection',
'execute()': '`execute()` — run a SQL statement through a cursor',
'zip()': '`zip()` — pair items from iterables until the shortest is exhausted',
'filter()': '`filter()` — lazily yield items whose predicate evaluates as true',
'map()': '`map()` — lazily apply a function to each item in an iterable',
'sorted()': '`sorted()` — return a new list containing the sorted items',
'all()': '`all()` — return whether every item in an iterable is truthy',
'any()': '`any()` — return whether at least one item in an iterable is truthy',
'id()': '`id()` — return an integer representing an object’s identity during its lifetime',
'dir()': '`dir()` — list names available on an object or in a namespace',
'help()': '`help()` — display documentation for an object or module',
'type()': '`type()` — return an object’s runtime class',
}

# Correct a wording glitch in the row-reduction distractor before assigning it.
CORE_NEW['numpy-scipy'][2]['options'][0] = 'A one-dimensional array containing three row totals'

# Replace the old duplicate even-numbered core records topic by topic.
for topic_id, specs in CORE_NEW.items():
    targets = [x for x in questions if x['bank'] == 'core' and x['topicId'] == topic_id and int(x['id'].split('-')[1]) % 2 == 0]
    targets.sort(key=lambda x: x['number'])
    if len(targets) != len(specs):
        raise ValueError(f'{topic_id}: expected {len(targets)} even questions, authored {len(specs)}')
    for old, spec in zip(targets, specs):
        old.update(spec)
        old['kind'] = 'concept'
        # Deterministically rotate choices so the correct answer is not biased
        # toward option A; the question ID and global number remain unchanged.
        shift = (int(old['id'].split('-')[1]) // 2) % 4
        old['options'] = old['options'][shift:] + old['options'][:shift]
        old['answerIndex'] = (old['answerIndex'] - shift) % 4

# Upgrade the retained odd-numbered first questions with explanatory options.
for item in questions:
    if item['bank'] == 'core' and int(item['id'].split('-')[1]) % 2 == 1:
        item['options'] = [ELABORATE.get(option, option) for option in item['options']]

# Replace the duplicate even-numbered extension questions with distinct
# adjacent skills while retaining their stable X IDs and global numbers.
for topic_id, specs in EXTENSION_NEW.items():
    targets = [x for x in questions if x['bank'] == 'extension' and x['topicId'] == topic_id and int(x['id'].split('-')[1]) % 2 == 0]
    targets.sort(key=lambda x: x['number'])
    if len(targets) != len(specs):
        raise ValueError(f'{topic_id}: expected {len(targets)} extension questions, authored {len(specs)}')
    for old, spec in zip(targets, specs):
        old.update(spec)
        old['kind'] = 'concept'
        shift = (int(old['id'].split('-')[1]) // 2) % 4
        old['options'] = old['options'][shift:] + old['options'][:shift]
        old['answerIndex'] = (old['answerIndex'] - shift) % 4

# Replace all repeated code-bank stems with prompts grounded in the snippet.
code_questions = sorted([x for x in questions if x['bank'] == 'code'], key=lambda x: x['number'])
if len(code_questions) != len(CODE_PROMPTS):
    raise ValueError('The code question count does not match the prompt map.')
for item, prompt in zip(code_questions, CODE_PROMPTS):
    item['question'] = prompt
    item['kind'] = 'code'
    if not item.get('code', '').strip():
        raise ValueError(f"{item['id']} is missing its code snippet")

# Final editorial pass: remove residual duplicate stems and replace weak, mismatched
# distractors with parallel, plausible alternatives from the same conceptual family.
def patch_options(qid, prompt, options, answer_index, explanation=None, hint=None):
    item = by_id[qid]
    assert len(options) == 4 and len(set(options)) == 4, qid
    assert 0 <= answer_index < 4, qid
    item['question'] = prompt
    item['options'] = options
    item['answerIndex'] = answer_index
    if explanation is not None:
        item['explanation'] = explanation
    if hint is not None:
        item['hint'] = hint

patch_options('S-003',
    'Which command asks the Python interpreter selected by the name `python` to display its version?',
    ['`python --version` — print the version of the selected interpreter', '`python -m pip --version` — print the version and location of pip', '`where python` — list matching executable paths on Windows', '`python --help` — display interpreter command-line help'],
    0,
    'Use `python --version` (or `python -V`) to print the interpreter version. `pip --version` reports pip details, `where python` locates executables on Windows, and `--help` displays usage information.',
    'Distinguish an interpreter-version query from a package-manager version or executable-path query.')
patch_options('S-021',
    'Which operator performs floor division in Python, returning the quotient rounded down toward negative infinity?',
    ['`/` — true division, which produces a floating-point quotient', '`//` — floor division, which rounds the quotient down', '`%` — modulo, which returns the remainder', '`**` — exponentiation, which raises one value to a power'],
    1,
    '`//` is floor division. For example, `17 // 5` is `3`, while `17 / 5` is `3.4`; with negative operands, floor means rounding toward negative infinity.',
    'Compare `/`, `//`, `%`, and `**` by the result each operator computes.')
patch_options('S-023',
    'Which operator returns the remainder after one integer is divided by another?',
    ['`//` — floor quotient without the remainder', '`**` — exponentiation', '`%` — modulo, which returns the remainder', '`/` — true division, which returns a floating-point quotient'],
    2,
    'The modulo operator `%` returns the remainder. A common divisibility test is `number % divisor == 0`.',
    'Choose the operator used in divisibility tests.')
patch_options('S-025',
    'Which operator tests whether two names refer to the very same object, rather than merely equal values?',
    ['`is` — test object identity', '`==` — compare values for equality', '`in` — test membership in a container', '`<=` — compare ordering'],
    0,
    '`is` tests identity. `==` tests equality according to the objects’ equality behavior; two distinct lists can compare equal while not being identical.',
    'Identity and equality are different questions: same object versus equivalent value.')
patch_options('S-027',
    'What does an explicit conversion such as `int("12")` do?',
    ['Type conversion — construct a value of the requested type from compatible input', 'Assignment — bind a variable name to an object', 'Comparison — evaluate whether two values are equal', 'String formatting — insert values into a text template'],
    0,
    '`int("12")` converts a valid numeric string into an integer. Invalid numeric text raises `ValueError`; conversion is not the same as assignment or comparison.',
    'The expression calls a type constructor with text as its input.')
patch_options('S-031',
    'Which Python keyword starts a conditional suite that runs only when its expression is truthy?',
    ['`for` — iterate over values from an iterable', '`if` — execute a suite when a condition is truthy', '`class` — define a new class object', '`def` — define a function'],
    1)
patch_options('S-033',
    'Which loop is designed to visit each item supplied by an iterable such as a list, tuple, or string?',
    ['`while` — repeat while a Boolean condition remains true', '`with` — manage a context such as a file resource', '`for` — iterate over values produced by an iterable', '`try` — define an exception-handling suite'],
    2)
patch_options('S-037',
    'Inside a nested loop, what does `break` terminate?',
    ['`continue` — skip the rest of the current iteration', '`pass` — execute a placeholder statement that does nothing', '`break` — exit the nearest enclosing loop', '`return` — leave the current function and return to its caller'],
    2)
patch_options('S-039',
    'A loop should skip the remaining statements in the current iteration but continue with the next item. Which statement does this?',
    ['`raise` — signal an exception', '`break` — exit the nearest enclosing loop', '`continue` — advance to the next iteration of the nearest loop', '`return` — leave the current function'],
    2)
patch_options('S-041',
    'Which keyword adds another condition to an existing `if` chain, evaluated only when earlier conditions were false?',
    ['`else` — provide the final fallback suite without a new condition', '`match` — select among structural patterns', '`elif` — test an additional conditional expression', '`except` — handle an exception raised in a `try` suite'],
    2)
patch_options('S-047',
    'Which statement can fill a syntactically required Python block while deliberately performing no operation?',
    ['`break` — terminate the nearest enclosing loop', '`pass` — a null statement that performs no operation', '`continue` — skip to the next loop iteration', '`assert` — raise `AssertionError` when a condition is false'],
    1)
patch_options('S-065',
    'What exact string is returned by `"-".join(["a", "b", "c"])`?',
    ['`"-abc"` — the separator appears only before the first item', '`"abc-"` — the separator appears only after the last item', '`"[a, b, c]"` — the list representation is returned unchanged', '`"a-b-c"` — the separator is placed between adjacent strings'],
    3,
    '`join` is called on the separator string and places that separator between successive string elements. It does not add a leading or trailing separator.')
patch_options('S-069',
    'Which literal creates an empty dictionary, rather than an empty list, tuple, or set?',
    ['`[]` — an empty list', '`{}` — an empty dictionary', '`()` — an empty tuple', '`set()` — an empty set'],
    1,
    '`{}` creates an empty dictionary. An empty set must be created with `set()` because empty braces are reserved for a dictionary.')
patch_options('S-071',
    'Which expression retrieves the value for key `"pen"` and raises `KeyError` if that key is absent?',
    ['`prices["pen"]` — dictionary subscription by key', '`prices.get("pen")` — return the value or `None` when absent', '`"pen" in prices` — test whether the key exists', '`prices.keys()` — return a view of the dictionary keys'],
    0,
    'Dictionary subscription retrieves the value and raises `KeyError` for a missing key. `get` is the alternative when a missing-key default is desired.')
patch_options('S-075',
    'When `key` is absent, what does `mapping.get(key, default)` do?',
    ['Returns `default` without inserting the key into the dictionary', 'Removes the last inserted key and returns its value', 'Deletes every key/value pair from the dictionary', 'Creates a new dictionary containing only the supplied key'],
    0,
    '`get` returns the supplied default when the key is missing and does not modify the dictionary. `pop` removes a key; `clear` removes all entries.')
patch_options('S-083',
    'Which list method adds its argument as one new element at the end of the list?',
    ['`extend(iterable)` — add each item from an iterable separately', '`insert(index, value)` — add one item at a specified position', '`append(value)` — add the supplied object as one final element', '`remove(value)` — delete the first matching value'],
    2)
patch_options('S-085',
    'What is the behavioral difference between `items.append([3, 4])` and `items.extend([3, 4])`?',
    ['Both calls add two separate top-level elements to the list', '`append` adds the list `[3, 4]` as one element; `extend` adds `3` and `4` separately', '`append` merges iterable elements; `extend` nests the entire iterable as one element', 'Both calls return a new list and leave `items` unchanged'],
    1,
    '`append` stores its argument as a single element. `extend` iterates over its argument and adds each yielded element to the list in place.')
patch_options('S-089',
    'After `items.sort()` completes, what value does the method call itself return?',
    ['`None` — `sort` modifies the existing list in place', 'A new sorted list — the behavior of the built-in `sorted(items)`', 'An iterator that yields the list in ascending order', 'The number of comparisons performed by the sorting algorithm'],
    0,
    '`list.sort()` sorts the list in place and returns `None`. Use `sorted(items)` when a new sorted list is required and the original should remain unchanged.')
patch_options('S-091',
    'For a list, what does the slice expression `items[::-1]` produce?',
    ['A shallow copy whose elements appear in reverse order', 'The original list after it has been reversed in place', 'A list containing only the final element', 'An empty list because a zero step is implied'],
    0,
    'A negative step traverses the sequence backward. Slicing creates a new list; `items.reverse()` instead mutates the original list and returns `None`.')
patch_options('S-099',
    'Which keyword introduces a named function definition in Python?',
    ['`def` — define a function with a statement suite', '`lambda` — create an anonymous function with one expression body', '`class` — define a class', '`return` — leave a function and optionally provide a value'],
    0)
patch_options('S-101',
    'What does executing a `return expression` statement inside a function do?',
    ['Ends the current function call and sends the expression value to its caller', 'Writes the expression as text to standard output', 'Pauses a generator and yields a value for the next iteration', 'Leaves the current loop but continues the same function'],
    0,
    '`return` ends the current function invocation and provides a result to the caller. `print` displays text, while `yield` suspends a generator.')
patch_options('S-103',
    'For `def greet(name="Guest")`, what value is bound to `name` when the caller invokes `greet()` with no arguments?',
    ['`"Guest"` — the declared default value', '`None` — Python’s automatic default for every omitted parameter', '`""` — an automatically generated empty string', '`"name"` — the parameter identifier itself'],
    0)
patch_options('S-105',
    'What makes an argument a keyword argument in a Python function call?',
    ['The caller supplies the parameter name, such as `timeout=5`', 'The caller supplies the value by position without naming the parameter', 'The function collects it into the tuple created by `*args`', 'The function receives it only through a `yield` expression'],
    0)
patch_options('S-107',
    'In `def collect(*args):`, what type of object is bound to the local name `args`?',
    ['A tuple containing the extra positional arguments', 'A dictionary containing the extra keyword arguments', 'A list containing only the first positional argument', 'A set that removes duplicate positional arguments'],
    0,
    '`*args` collects extra positional arguments into a tuple. The `**kwargs` convention collects extra keyword arguments into a dictionary.')
patch_options('S-109',
    'In `def collect(**kwargs):`, what type of object is bound to the local name `kwargs`?',
    ['A dictionary mapping extra keyword names to their values', 'A tuple containing every positional argument', 'A list containing keyword values but not their names', 'A set containing the distinct keyword names'],
    0,
    '`**kwargs` collects extra keyword arguments into a dictionary. Extra positional arguments are collected separately by `*args`.')
patch_options('S-115',
    'A data pipeline must retain only those input items for which a predicate returns a truthy value, without first building a list. Which built-in is intended?',
    ['`filter(predicate, iterable)` — lazily select items whose predicate is true', '`map(function, iterable)` — lazily transform every input item', '`enumerate(iterable)` — pair each item with an index', '`zip(a, b)` — combine corresponding items from multiple iterables'],
    0,
    '`filter` produces an iterator containing the items for which the predicate is true. `map` transforms each item; `enumerate` adds indexes; `zip` combines iterables.',
    'The task is selection by a predicate, not transformation or pairing.')
patch_options('S-121',
    'Which Python standard-library module provides regular-expression pattern matching and substitution?',
    ['`re` — compile patterns and search, match, split, or substitute text', '`textwrap` — wrap and format paragraphs of text', '`fnmatch` — match filename patterns using shell-style wildcards', '`string` — provide common string constants and formatting helpers'],
    0)
patch_options('S-125',
    'Which statement correctly distinguishes `re.match()` from `re.search()`?',
    ['`match` attempts a match at the beginning; `search` scans forward for a match anywhere', '`match` returns every occurrence; `search` returns only the final occurrence', '`match` ignores the pattern; `search` accepts only literal strings', '`match` scans from the end; `search` checks only the first character'],
    0,
    '`re.match` attempts to match at the beginning of the string. `re.search` scans the string until it finds a matching location or reaches the end.')
patch_options('S-129',
    'Which expression creates a tuple containing exactly one integer, 7?',
    ['`(7,)` — a tuple; the trailing comma makes it a one-item tuple', '`(7)` — an integer expression grouped by parentheses', '`[7]` — a one-element list', '`{7}` — a one-element set'],
    0,
    'The comma creates the one-element tuple. Parentheses alone group an expression; they do not create a tuple without a comma.')
patch_options('S-133',
    'What does tuple unpacking do in an assignment such as `a, b = (10, 20)`?',
    ['Assigns corresponding iterable elements to multiple target names', 'Combines separate values into a dictionary using automatic keys', 'Converts every tuple element into a class attribute', 'Sorts the tuple and returns a new tuple'],
    0)
patch_options('S-139',
    'Which keyword introduces a class definition, including its name and indented class body?',
    ['`class` — create a class definition', '`def` — define a function', '`object` — refer to the built-in base class', '`lambda` — create an anonymous function expression'],
    0)
patch_options('S-143',
    'What is the primary role of `__init__` in an ordinary Python class?',
    ['Initialize an already-created instance by setting its initial state', 'Allocate the new instance before it exists', 'Return the printable representation used by `repr()`', 'Destroy the instance when its reference count reaches zero'],
    0,
    '`__init__` initializes an instance after it has been created. `__new__` participates in creating the instance; `__repr__` provides its developer-facing representation.')
patch_options('S-145',
    'Which description best defines inheritance in object-oriented programming?',
    ['A class derives from a base class and can reuse or specialize its attributes and methods', 'An object hides its internal state and exposes a controlled interface', 'An object contains another object and delegates work to it', 'Different object types respond to the same operation through their own implementations'],
    0)
patch_options('S-147',
    'When a user-defined class wants `left + right` to perform a class-specific operation, which mechanism is normally implemented?',
    ['`__add__` — the special method used for the `+` operator', '`__init__` — initialize an instance after creation', '`__iter__` — return an iterator for the object', '`__enter__` — implement the entry step of a context manager'],
    0,
    'Operator overloading is commonly implemented through special methods such as `__add__`, which defines the behavior of `+`. It is distinct from overriding an inherited method.')
patch_options('S-149',
    'What is the main purpose of encapsulation in object-oriented design?',
    ['Bundle state and behavior while controlling how internal details are accessed', 'Create a subclass that inherits implementation from a base class', 'Allow one operation to work with objects of different types', 'Define multiple methods with the same name and different signatures'],
    0)
patch_options('S-153',
    'Which description best captures polymorphism in object-oriented programming?',
    ['Different object types can provide their own behavior for a shared interface or operation', 'A class must contain every field as a private attribute', 'A class can inherit from exactly one base class', 'A function must call itself until a base case is reached'],
    0)
patch_options('S-155',
    'In an inheritance hierarchy, what does calling `super()` provide?',
    ['A proxy that delegates attribute or method lookup to the next class in the method resolution order', 'A direct reference to the operating system’s superclass process', 'A new copy of every attribute defined by the parent class', 'An instruction to skip all remaining methods in the hierarchy'],
    0,
    '`super()` returns a proxy that follows the method resolution order (MRO). It is especially useful for cooperative inheritance and does not simply mean “call the parent” in every multiple-inheritance design.')
patch_options('S-159',
    'Which statement correctly distinguishes an instance method from a class method?',
    ['An instance method receives the instance as `self`; a class method receives the class as `cls`', 'An instance method receives `cls`; a class method receives an instance as `self`', 'Both receive no implicit first argument and are interchangeable with static methods', 'A class method can read class attributes but an instance method cannot'],
    0,
    'A bound instance method receives the instance as its first argument. A method decorated with `@classmethod` receives the class object as `cls`, including when called through an instance.')
patch_options('S-161',
    'What is the defining behavior of a method decorated with `@staticmethod`?',
    ['It receives no automatic `self` or `cls` argument when accessed through the class or an instance', 'It receives the current instance automatically as `self`', 'It receives the class automatically as `cls`', 'It can be called only from inside the class body'],
    0,
    'A static method is stored in the class namespace but has no implicit instance or class parameter. It is useful for a related utility that does not need object state.')
patch_options('S-169',
    'When does a `finally` suite run in a `try` statement?',
    ['When control leaves the try statement, whether execution succeeds or an exception is handled or propagates', 'Only when an exception is raised and no handler matches it', 'Only when the try suite completes successfully without an exception', 'Only when an `assert` statement evaluates to false'],
    0,
    'The `finally` suite is used for cleanup and ordinarily runs as control leaves the `try` statement, regardless of whether an exception occurred. Process termination or similar events can prevent it from running.')
patch_options('S-171',
    'What does executing `raise SomeError("message")` do?',
    ['Raises the specified exception so it can be handled or propagate to the caller', 'Skips the remaining statements in the current loop iteration', 'Creates an exception object but does not signal it', 'Defines a placeholder suite that performs no operation'],
    0,
    '`raise` signals an exception. A matching `except` handler may handle it; otherwise it propagates up the call stack.')
patch_options('S-181',
    'In Python, what is a module?',
    ['A Python unit of code—usually a `.py` file—that provides names which other code can import', 'A running operating-system process with its own address space', 'A single instance created from a class definition', 'A row stored in a relational database table'],
    0)
patch_options('S-185',
    'Which standard-library module is intended for application logs with severity levels, handlers, and formatters?',
    ['`logging` — provide configurable application logging', '`pdb` — provide an interactive source-level debugger', '`traceback` — format and inspect exception stack traces', '`warnings` — issue warning messages for noteworthy conditions'],
    0)
patch_options('S-187',
    'A developer needs breakpoints, variable inspection, and step-by-step execution. Which tool provides this capability?',
    ['A debugger — pause and inspect a program while it executes', 'A package manager — install and uninstall dependencies', 'A logger — record diagnostic events during execution', 'A formatter — rewrite source code into a consistent style'],
    0)
patch_options('S-197',
    'For `array = np.zeros((2, 3, 4))`, what value does `array.ndim` return?',
    ['`3` — the array has three axes or dimensions', '`24` — the total number of elements in the array', '`(2, 3, 4)` — the complete shape tuple', '`4` — the length of the final axis'],
    0,
    '`ndim` reports the number of axes. The array has three dimensions, 24 total elements, and shape `(2, 3, 4)`; its final axis has length four.')
patch_options('S-221',
    'What kind of information does `df.info()` display for a Pandas DataFrame?',
    ['A concise structural summary with columns, non-null counts, dtypes, index range, and memory use', 'Descriptive statistics such as mean, standard deviation, and quartiles', 'A pairwise correlation matrix for numeric columns', 'Frequency counts for the distinct values of one selected column'],
    0,
    '`info()` reports DataFrame structure and non-null counts. `describe()` gives descriptive statistics; `corr()` computes correlations; `value_counts()` counts distinct values in a Series.')
patch_options('S-223',
    'For numeric columns by default, what does `df.describe()` calculate?',
    ['Count, mean, standard deviation, minimum, quartiles, and maximum', 'Column names, dtypes, and non-null counts only', 'The number of duplicate rows in the DataFrame', 'The frequency of each category in every object column only'],
    0,
    '`describe()` summarizes numeric columns with statistics such as count, mean, standard deviation, minimum, quartiles, and maximum. Include non-numeric columns explicitly when needed.')
patch_options('S-235',
    'With its default arguments, how does `df.drop_duplicates()` treat duplicate rows?',
    ['Removes duplicate rows based on all columns and keeps the first occurrence', 'Removes every row that contains at least one missing value', 'Returns a Boolean mask that marks every member of each duplicate group', 'Keeps only rows whose values are unique in every individual column independently'],
    0,
    '`drop_duplicates()` considers all columns by default and keeps the first occurrence of each duplicate row. Use `subset` to compare selected columns and `keep` to change which occurrence is retained.')
patch_options('S-245',
    'A continuous numeric variable contains hundreds of observations. Which chart groups values into intervals to show their frequency distribution?',
    ['A histogram — divide the numeric range into bins and count observations per bin', 'A pie chart — show each category as a proportion of a whole', 'A Gantt chart — show tasks across a time schedule', 'A network graph — show nodes and relationships between them'],
    0)
patch_options('S-251',
    'Which library is designed for statistical data visualization and provides a high-level API built on Matplotlib?',
    ['Matplotlib — a general-purpose plotting library with Figure and Axes objects', 'Seaborn — a statistical visualization library with high-level plotting functions', 'Plotly — a library focused on interactive browser-rendered charts', 'Scrapy — a framework for crawling websites and extracting structured data'],
    1,
    'Seaborn provides statistical plotting functions and works closely with Pandas data. Matplotlib is the underlying plotting foundation; Plotly focuses on interactive charts; Scrapy is for crawling.')
patch_options('S-253',
    'Why is Plotly often selected for analytical dashboards viewed in a web browser?',
    ['It creates interactive charts with features such as hover details, zooming, and selection', 'It replaces Pandas and stores every DataFrame as a relational database', 'It is a Python package manager that installs visualization dependencies', 'It creates only static raster images and has no browser interaction'],
    0,
    'Plotly creates interactive, browser-rendered visualizations. It can be combined with Dash to build analytical dashboards.')
patch_options('S-255',
    'When comparing numeric distributions across categories, why might an analyst choose a box plot?',
    ['It summarizes median, quartiles, spread, and potential outliers for each group', 'It shows the exact time order of every observation as a continuous line', 'It divides a whole into categorical percentages that must sum to 100%', 'It displays the relationship between two numeric variables as individual points'],
    0,
    'A box plot summarizes a distribution using quartiles, median, whiskers, and often outlier markers. It is useful for comparing spread across groups, but hides individual observations unless overlaid.')
patch_options('S-271',
    'Why should a Python application close a database connection or manage it using a supported context manager?',
    ['To release database and operating-system resources promptly and avoid connection leaks', 'To commit every transaction automatically, regardless of the driver', 'To delete the database file after the final query has run', 'To disable rollback and prevent later queries from executing'],
    0,
    'Closing a connection releases resources. Transaction commit or rollback is a separate concern; do not assume that every driver context manager has identical commit semantics.')
patch_options('S-273',
    'Which description most accurately characterizes Flask?',
    ['A lightweight WSGI web framework with a small core and an extension ecosystem', 'A batteries-included framework with a built-in ORM, admin site, and authentication components', 'A web-crawling framework built around spiders and request scheduling', 'A numerical array library for multidimensional computation'],
    0)
patch_options('S-275',
    'Which description most accurately characterizes Django?',
    ['A batteries-included web framework with an ORM, admin interface, and integrated components', 'A microframework whose core is intentionally small and commonly extended with packages', 'An HTTP client used to send GET and POST requests to remote servers', 'A scientific plotting library for statistical graphics'],
    0)
patch_options('S-279',
    'What does Django’s object-relational mapper (ORM) allow a developer to do?',
    ['Work with database records through Python model classes and query APIs', 'Render HTML templates without loading or processing data', 'Serve static files directly from a WSGI gateway', 'Schedule HTTP requests for a web-crawling spider'],
    0,
    'Django’s ORM maps model classes and objects to relational database tables and provides query APIs. It does not replace the template system or web server.')
patch_options('S-281',
    'What is the common purpose of the third-party `requests` library?',
    ['Send HTTP requests and inspect responses using a user-friendly client API', 'Parse HTML documents into a navigable tree without making network requests', 'Schedule large crawling projects using spiders and item pipelines', 'Create statistical plots from DataFrames and NumPy arrays'],
    0,
    'Requests is an HTTP client. It sends requests and exposes response status, headers, content, and related information; it is not itself a crawler or HTML parser.')
patch_options('S-283',
    'What does HTTP status code `404` mean in a typical HTTP response?',
    ['`200 OK` — the request succeeded', '`301 Moved Permanently` — the resource has a permanent redirect', '`404 Not Found` — the requested resource was not found', '`500 Internal Server Error` — the server encountered an unexpected condition'],
    2)
patch_options('S-285',
    'Which tool is a full web-crawling framework that supports spiders, request scheduling, selectors, and item pipelines?',
    ['Requests — an HTTP client for sending requests and reading responses', 'Beautiful Soup — a library for parsing and navigating HTML or XML', 'Scrapy — a framework for building and running web crawlers', 'Flask — a web framework for building Python applications'],
    2,
    'Scrapy is a crawling and scraping framework with spiders, selectors, item pipelines, and request scheduling. Requests sends HTTP requests; Beautiful Soup parses markup.')
patch_options('S-299',
    'What does `all([])` return, and why?',
    ['`True` — there is no element that violates the “all are truthy” condition', '`False` — an empty iterable always fails a Boolean test', '`None` — no result can be determined without at least one item', '`ValueError` — `all` requires a non-empty iterable'],
    0,
    '`all` returns true when every element is truthy. For an empty iterable the condition is vacuously true because there is no counterexample.')

# Extension-bank alternatives are made parallel and meaningful, not merely package names.
patch_options('X-005',
    'What makes a Python function a generator function?',
    ['It contains `yield`, so calling it returns a generator that produces values lazily', 'It contains `return`, so every call automatically returns a list', 'It is decorated with `@staticmethod`, so it runs in a separate thread', 'It declares `global`, so its return values are cached between calls'],
    0)
patch_options('X-009',
    'What does `iter(obj)` do when `obj` supports the iterable protocol?',
    ['Returns an iterator for the object, normally by calling its `__iter__` method', 'Consumes and returns the next value by calling `__next__` exactly once', 'Creates an integer sequence from zero to the object’s length', 'Returns a slice of the object without accessing its elements'],
    0)
patch_options('X-013',
    'What is the purpose of `itertools.islice(iterable, start, stop, step)`?',
    ['Create a lazy iterator selecting positions from an iterable without requiring a full sliceable sequence', 'Reduce all elements to one accumulated value using a binary function', 'Walk a directory tree and return its file paths', 'Sort an iterable in place using a comparison algorithm'],
    0)
patch_options('X-023',
    'Which statement correctly distinguishes opening a text file with mode `"r"` versus `"w"`?',
    ['`r` opens an existing file for reading; `w` opens for writing and truncates an existing file', '`r` appends to the end; `w` reads without changing the file', '`r` creates a new empty file; `w` fails whenever the file already exists', '`r` opens binary data only; `w` opens compressed data only'],
    0)
patch_options('X-025',
    'What is JSON, and why is it commonly used when exchanging data between applications?',
    ['A text-based data-interchange format supporting objects, arrays, strings, numbers, booleans, and null', 'A binary executable format used to store compiled Python bytecode', 'An image compression format designed for photographs and transparency', 'A tabular spreadsheet format that requires fixed rows and columns'],
    0)
patch_options('X-027',
    'Which statement correctly distinguishes `json.dumps()` from `json.dump()`?',
    ['`dumps` serializes an object to a JSON string; `dump` writes JSON text to a file-like object', '`dump` parses a JSON string; `dumps` reads JSON from an open file', '`dumps` writes only binary data; `dump` creates a Python dictionary', 'Both functions deserialize JSON, but return different exception types'],
    0)
patch_options('X-029',
    'What is the purpose of `pathlib.Path` in modern Python code?',
    ['Represent filesystem paths with an object-oriented, cross-platform API', 'Open SQLite databases and execute SQL statements', 'Parse command-line options into a namespace object', 'Serialize arbitrary Python objects into binary pickle data'],
    0)
patch_options('X-037',
    'What does a unit test primarily verify?',
    ['A small unit of behavior, such as a function or method, under controlled conditions', 'The complete deployed application across all browsers and infrastructure', 'The security posture of a network against simulated attackers', 'The maximum number of concurrent users a production service can support'],
    0)
patch_options('X-041',
    'What is `pip` primarily used for in a Python development workflow?',
    ['Install and manage Python packages from package indexes or configured sources', 'Create isolated Python environments without invoking an environment tool', 'Execute a Python program one statement at a time in an interactive shell', 'Run a test suite and report assertion failures'],
    0)
patch_options('X-043',
    'What components appear in the common `MAJOR.MINOR.PATCH` form of semantic versioning?',
    ['Major for incompatible API changes, minor for backward-compatible functionality, and patch for compatible fixes', 'Year, month, and day of the release date', 'Build number, source branch name, and latest commit hash', 'Python language version, pip version, and operating-system version'],
    0)
patch_options('X-045',
    'Why is a `requirements.txt` file useful in a Python project?',
    ['It records project dependencies, often with version constraints, so an environment can be reproduced', 'It documents every function’s arguments and return values for end users', 'It stores application data rows in comma-separated format', 'It defines the Python interpreter’s syntax and compilation rules'],
    0)
patch_options('X-049',
    'What is a common benefit of decorating a class with `@dataclass`?',
    ['Generate methods such as `__init__` and `__repr__` from annotated fields, reducing boilerplate', 'Automatically turn every method into an abstract method that subclasses must override', 'Suppress every exception raised by methods defined in the class', 'Cache every function result regardless of its arguments or side effects'],
    0)
patch_options('X-053',
    'What is the usual average-case time complexity of looking up a key in a Python dictionary?',
    ['`O(1)` — expected constant-time lookup using the key’s hash', '`O(log n)` — logarithmic lookup by repeatedly halving a sorted key range', '`O(n)` — inspect each stored key in sequence', '`O(n log n)` — sort all keys before each lookup'],
    0,
    'Dictionary lookup is average-case O(1) because it uses a hash table. Worst-case behavior can be worse, and hash collisions are handled internally.')
patch_options('X-055',
    'A program examines each element of a list once and performs constant work per element. What is its time complexity?',
    ['`O(n)` — work grows linearly with the number of elements', '`O(1)` — work is independent of list length', '`O(log n)` — work grows with the logarithm of list length', '`O(n²)` — work grows with the square of list length'],
    0)
patch_options('X-059',
    'What is the time complexity of binary search on a sorted sequence with random access?',
    ['`O(log n)` — each comparison discards about half of the remaining search interval', '`O(n)` — every element must be checked in the worst case', '`O(n log n)` — the sequence must be sorted again after every comparison', '`O(2ⁿ)` — each element creates two recursive search branches'],
    0)
patch_options('X-065',
    'Why is `collections.deque` usually more suitable than a list for frequent insertions and removals at both ends?',
    ['A deque supports efficient appends and pops at either end without shifting the remaining elements', 'A list is immutable, while a deque permits elements to be changed', 'A deque stores items in sorted order and performs binary search automatically', 'A tuple supports efficient insertion and removal at either end'],
    0)
patch_options('X-067',
    'What is the worst-case time complexity of Python’s comparison-based Timsort implementation?',
    ['`O(n log n)` — the worst-case number of comparisons grows with n log n', '`O(1)` — sorting requires a fixed number of comparisons', '`O(log n)` — sorting examines only a logarithmic number of elements', '`O(n³)` — every sort must compare all triples of elements'],
    0,
    'Timsort has O(n log n) worst-case time complexity. It can run faster on data that already contains ordered runs.')
patch_options('X-069',
    'Which description best defines an operating-system process?',
    ['An executing program with its own process resources and virtual address space', 'A lightweight execution path that shares memory with other threads in a process', 'A coroutine that suspends at `await` and resumes under an event loop', 'A Python function that returns an iterator one element at a time'],
    0)
patch_options('X-071',
    'Which description best defines a thread?',
    ['An execution path within a process that shares the process’s memory and resources', 'A separate operating-system process with an independent address space', 'A lazily evaluated sequence created by a generator function', 'A separately installed Python package with its own import name'],
    0)
patch_options('X-075',
    'When is multiprocessing often a useful approach in Python?',
    ['For CPU-bound work that can be divided across processes and run on multiple cores', 'For every small task where creating process workers costs more than the computation', 'Only for waiting on network responses that are already handled asynchronously', 'When all tasks must share one mutable Python object without communication overhead'],
    0,
    'Separate processes have separate interpreters and can run CPU-bound Python work on multiple cores. They have higher startup and communication costs than threads or async I/O.')
patch_options('X-077',
    'What does an `async def` statement define, and what happens when that function is called?',
    ['An asynchronous coroutine function; calling it creates a coroutine object that must be awaited or scheduled', 'A new operating-system thread that starts running immediately', 'A synchronous function whose return value is always a list', 'A generator that can only be advanced with `next()` and never awaited'],
    0)
patch_options('X-079',
    'Inside a coroutine, what does `await operation()` do when the returned object is awaitable?',
    ['Suspends the current coroutine until the awaitable completes, allowing the event loop to run other tasks', 'Blocks the entire operating-system thread until every task in the event loop is finished', 'Starts a separate process and transfers all local variables into it', 'Terminates the current coroutine immediately without returning a result'],
    0)
patch_options('X-087',
    'What is the common purpose of an HTTP `POST` request?',
    ['Submit data for processing or request creation of a resource, depending on the API', 'Retrieve a representation of a resource without requesting a state change', 'Remove a specified resource from the server', 'Ask the server which communication options are supported'],
    0)
patch_options('X-091',
    'What does rate limiting control in an API or web service?',
    ['The number or frequency of requests a client may make during a time interval', 'The number of database columns returned by a SELECT statement', 'The maximum number of characters stored in each JSON string', 'The order in which a browser downloads image assets'],
    0)
patch_options('X-097',
    'Why should an HTTP client such as Requests specify a timeout for network operations?',
    ['To bound how long the client waits for connection or response activity instead of waiting indefinitely', 'To guarantee that the server returns a successful status code', 'To retry every failed request exactly ten times automatically', 'To change the server’s response encoding to UTF-8'],
    0,
    'A timeout bounds waiting during network operations. In Requests, a single timeout value applies to connect and read timeout behavior; it is not a universal total wall-clock deadline for an entire download.')
patch_options('X-099',
    'What does idempotency mean when describing an API operation?',
    ['Repeating the same operation has the same intended effect on server state as performing it once', 'The server caches every response forever, regardless of request parameters', 'The operation can be executed only once by a particular client', 'The operation runs concurrently on multiple threads without synchronization'],
    0)

patch_options('S-026',
    'A form supplies the text `"12.5"`. Which conversion creates a numeric value while preserving its fractional part?',
    ['`int("12.5")` — parse the text as an integer without a fractional component', '`bool("12.5")` — test whether the non-empty string is truthy', '`str(12.5)` — convert a numeric value back into text', '`float("12.5")` — parse the decimal text as a floating-point value'],
    3,
    '`float("12.5")` produces a floating-point number. `int("12.5")` raises `ValueError` because the text is not an integer literal; `bool` tests truthiness and `str` produces text.')
patch_options('S-058',
    'A log parser should accept a line only when the text begins with the exact prefix `ERROR:`. Which string method expresses that test directly?',
    ['`line.endswith("ERROR:")` — test the final characters of the line', '`line.find("ERROR:") == len(line)` — compare the match position with the line length', '`line.isalpha()` — test whether every character is an alphabetic letter', '`line.startswith("ERROR:")` — test the initial characters of the line'],
    3)
patch_options('S-063',
    'Which capability is provided specifically by an f-string such as `f"Total: {amount}"`?',
    ['Evaluate expressions inside braces while constructing a formatted string literal', 'Compile a regular expression and find matching substrings in the input', 'Encode text as UTF-8 bytes before writing it to a file', 'Select a substring by start, stop, and step indexes'],
    0)
patch_options('S-066',
    'Which expression combines the strings in `words` with exactly one space between adjacent items?',
    ['`words.join(" ")` — call join on the list and use a space as its argument', '`" ".split(words)` — split a space-delimited string using a list', '`str(words, " ")` — construct a string using a separator argument', '`" ".join(words)` — call join on the separator string'],
    3,
    '`join` is called on the separator, which inserts itself between strings from the iterable. Every item supplied must be a string.')
patch_options('S-068',
    'Which f-string format specifier displays a floating-point value with exactly two digits after the decimal point?',
    ['`{value:.2s}` — format as a string with a precision of two characters', '`{value:%2}` — use a percent-style date/time directive', '`{value:.2f}` — format as fixed-point with two digits after the decimal', '`{value:2d}` — format an integer in a field of width two'],
    2)
patch_options('S-100',
    'When a Python function reaches its end without executing a `return` statement, what value is returned to the caller?',
    ['`False` — the Boolean value used for a false condition', 'The last expression evaluated in the function body', '`None` — Python’s singleton for an absent return value', '`0` — the integer zero used as a default result'],
    2,
    'A function returns `None` when execution reaches the end without an explicit return value. Python does not implicitly return the last expression evaluated.')
patch_options('S-110',
    'A nested function must rebind a variable from its nearest enclosing function scope. Which declaration should it use?',
    ['`outer variable_name` — a declaration that creates a new outer function', '`nonlocal variable_name` — rebind a name in an enclosing function scope', '`global variable_name` — refer to a name in the module-level scope', '`static variable_name` — preserve a local value using a static declaration'],
    1,
    '`nonlocal` targets the nearest enclosing function binding. `global` targets the module namespace; `static` and `outer` are not Python variable-scope declarations.')
patch_options('S-126',
    'Given a successful match for `r"(?P<year>\\d{4})-(\\d{2})"`, how is the named four-digit group retrieved?',
    ['`match.find("year")` — search the original text for the group name', '`match.group("year")` — retrieve the captured text by its declared name', '`match.group(0)` — retrieve only the full match, never an individual capture', '`match["year"]` — subscript the original input string by a group name'],
    1,
    'A named capture group is retrieved with `match.group("year")` (or via the group dictionary). `group(0)` returns the full match, not the named capture specifically.')
patch_options('S-130',
    'Which expression creates a tuple containing exactly one integer, 5?',
    ['`(5)` — parentheses group the integer expression', '`[5,]` — create a one-element list', '`{5:}` — invalid dictionary syntax without a value', '`(5,)` — the trailing comma creates a one-element tuple'],
    3)
patch_options('S-136',
    'Which expression creates a new tuple by concatenating `("Python",)` and `("ML",)`?',
    ['`("Python",) + ("ML",)` — tuple concatenation creates a new tuple', '`("Python",).append("ML")` — lists support append, but tuples do not', '`("Python",).add("ML")` — sets provide add, but tuples do not', '`("Python",)[1] = "ML"` — tuple elements cannot be assigned'],
    0)
patch_options('S-146',
    'A method must receive the class object as its implicit first argument, conventionally named `cls`. Which decorator is appropriate?',
    ['`@staticmethod` — provide no implicit instance or class argument', '`@property` — expose a method through attribute access', '`@abstractmethod` — mark a method that subclasses are expected to implement', '`@classmethod` — bind the class object as the first argument'],
    3)
patch_options('S-148',
    'A subclass overrides a method but also needs to continue the cooperative implementation chain. Which tool is preferred over hard-coding a parent class name?',
    ['`staticmethod()` — remove implicit instance and class binding', '`object.__del__()` — invoke object finalization directly', '`super()` — delegate lookup to the next class in the method resolution order', '`self.__class__.__base__` — directly select one base class and bypass the MRO chain'],
    2,
    '`super()` follows the method resolution order, which is important for cooperative multiple inheritance. Hard-coding one base class can bypass the intended lookup chain.')
patch_options('S-160',
    'Which special method is normally invoked to implement the expression `a + b` when `a` is an instance of a user-defined class?',
    ['`__add__` — implement ordinary addition for the left operand', '`__radd__` — implement reflected addition when the right operand handles the operation', '`__iadd__` — implement in-place addition such as `a += b`', '`__mul__` — implement multiplication with the `*` operator'],
    0,
    '`a + b` normally tries `a.__add__(b)` first. Reflected and in-place operations use separate special methods such as `__radd__` and `__iadd__`.')
patch_options('S-176',
    'A custom exception represents an application-level configuration failure and no more specific built-in exception is suitable. Which base class should it usually inherit from?',
    ['`Exception` — the conventional base for application-defined errors', '`BaseException` — the broader root that also includes system-exiting exceptions', '`object` — the universal base class, but not an exception type', '`str` — the text type used for an error message'],
    0,
    'Most application-defined exceptions should inherit from `Exception`, not directly from `BaseException`. The latter also covers control-flow exceptions such as `SystemExit` and `KeyboardInterrupt`.')
patch_options('S-186',
    'What is the value of `__name__` in a Python module when that file is executed as the top-level script?',
    ['The absolute path of the source file', 'The name of the Python executable', 'The name of the first package imported by the file', '`"__main__"` — the special name used for the directly executed module'],
    3,
    'When Python executes a file as the main program, its global `__name__` is `"__main__"`. When imported, it normally has its module name instead.')
patch_options('S-188',
    'In Python’s standard `logging` module, which of these two levels has the higher severity?',
    ['They have equal numeric severity by default', 'The order depends on the order in which messages are emitted', '`ERROR` — its numeric level is higher than `WARNING`', '`WARNING` — its numeric level is higher than `ERROR`'],
    2)
patch_options('S-204',
    'A basic NumPy slice may share memory with its source array. Which operation explicitly creates an independent copy of the selected elements?',
    ['`a.view()` — create another array view over the same data buffer', '`np.asarray(a[1:4])` — usually reuse an existing ndarray without copying', '`a[1:4].copy()` — allocate independent storage for the selected elements', '`a[1:4]` — create a basic slice that can share the source memory'],
    2,
    'A basic slice commonly creates a view that shares memory with its source. Calling `.copy()` allocates independent storage; `view` and ordinary slicing do not guarantee that.')
patch_options('S-210',
    'A one-dimensional NumPy array contains 24 elements. Which call reshapes it into 3 rows while asking NumPy to infer the number of columns?',
    ['`a.reshape(3, 24)` — request 72 output positions', '`a.reshape(-1, -1)` — ask NumPy to infer two dimensions', '`a.reshape(3, 7)` — request 21 output positions', '`a.reshape(3, -1)` — infer the second dimension from the element count'],
    3,
    '`reshape(3, -1)` asks NumPy to infer one dimension. The inferred column count is eight because 24 elements must be arranged in three rows. Only one dimension may be inferred with `-1`.')
patch_options('S-214',
    'Which SciPy subpackage is the most appropriate starting point for numerical optimization routines such as minimizing an objective function?',
    ['`scipy.constants` — physical and mathematical constants', '`scipy.optimize` — optimization algorithms and solvers', '`scipy.io.wavfile` — read and write WAV audio files', '`scipy.spatial.distance` — distance calculations between spatial observations'],
    1)
patch_options('S-216',
    'Which Pandas structure represents a two-dimensional table with labeled rows and labeled columns?',
    ['`DataFrame` — a two-dimensional labeled table', '`Series` — a one-dimensional labeled array', '`Index` — an immutable sequence of axis labels', '`Categorical` — a one-dimensional representation of categorical values'],
    0)
patch_options('S-218',
    'A CSV file has a header row and should be loaded into a Pandas DataFrame. Which call is idiomatic?',
    ['`pd.to_csv(path)` — write a DataFrame to a CSV file', '`pd.read_excel(path)` — read a workbook from Excel format', '`pd.read_json(path)` — read JSON-formatted data', '`pd.read_csv(path)` — parse comma-separated values into a DataFrame'],
    3)
patch_options('S-220',
    'A DataFrame has row labels `"A"`, `"B"`, and `"C"`. Which expression selects the row whose index label is `"B"`?',
    ['`df.loc[1]` — select the row with label 1, if present', '`df.iloc["B"]` — select a row by integer position using a string', '`df.loc["B"]` — select the row by its index label', '`df["B"]` — select the column named B'],
    2,
    '`loc` selects by labels, so `df.loc["B"]` selects the row with label B. `iloc` selects by integer position, while `df["B"]` usually selects a column.')
patch_options('S-228',
    'Two DataFrames share a column named `customer_id`. Which operation performs a relational join using that column as the key?',
    ['`left.append(right)` — append rows using the legacy append API', '`left.join(right, on="customer_id", how="drop")` — use a join mode that Pandas does not support', '`pd.merge(left, right, on="customer_id", how="left")` — join rows by the shared key while preserving all left rows', '`pd.concat([left, right], axis=0)` — stack rows without matching records by key'],
    2,
    '`merge` performs database-style key joins. `concat` combines objects along an axis; it does not match records by key. A left merge retains all keys from the left DataFrame.')
patch_options('S-246',
    'Which chart groups a continuous numeric variable into intervals and displays the count or density of observations in each interval?',
    ['A box plot — summarize quartiles and potential outliers', 'A histogram — bin numeric values into intervals', 'A line chart — show a value trend across an ordered x-axis', 'A pie chart — show proportions of categories'],
    1)
patch_options('S-264',
    'After `cursor.execute("SELECT name FROM users")`, which DB-API cursor method retrieves the next single row?',
    ['`cursor.fetchone()` — fetch one next row or return `None` when exhausted', '`cursor.commit()` — commit a transaction on the connection', '`cursor.close()` — release the cursor resource', '`cursor.rollback()` — roll back uncommitted transaction changes'],
    0)
patch_options('S-270',
    'A data import has made several inserts but has not committed them. Validation then fails. Which connection method requests cancellation of the pending transaction changes?',
    ['`connection.cursor()` — create a cursor for executing statements', '`connection.rollback()` — roll back the current uncommitted transaction', '`connection.commit()` — make the pending transaction changes permanent', '`cursor.fetchall()` — retrieve remaining rows from a query result'],
    1)
patch_options('S-272',
    'Which Python standard-library module provides a lightweight file-based relational database commonly used in learning exercises?',
    ['`sqlite3` — connect to and query SQLite databases', '`csv` — read and write comma-separated text files', '`pickle` — serialize Python objects to a byte stream', '`logging` — record diagnostic events from an application'],
    0)
patch_options('S-298',
    'Which built-in returns the number of items in common containers such as lists, tuples, strings, and dictionaries?',
    ['`id(obj)` — return an identity value for an object during its lifetime', '`dir(obj)` — list names available on an object or namespace', '`hash(obj)` — return an object’s hash value when it is hashable', '`len(obj)` — return the number of items or characters'],
    3)
patch_options('X-018',
    'A custom iterator object must support `next(iterator)`. Which special method must the iterator implement?',
    ['`__iter__()` — return an iterator object from an iterable', '`__init__()` — initialize a newly created instance', '`__getitem__()` — retrieve an item by key or index', '`__next__()` — return the next item or raise `StopIteration` when exhausted'],
    3,
    'An iterator implements `__next__()` to produce the next item and raises `StopIteration` when exhausted. An iterable normally provides `__iter__()` to return an iterator.')


by_id['C-065'].update({
    'topicId': 'regex',
    'topic': 'Regular Expressions',
    'referenceId': 'regex',
    'difficulty': 'medium',
    'code': 'import re\ntext = "order_42 ready"\nmatch = re.search(r"\\d+", text)\nprint(match.group())'
})
patch_options('C-065',
    'What string does `match.group()` return after `re.search` locates the first one-or-more-digit match?',
    ['`"order"` — the first word before the underscore', '`"42"` — the contiguous digit sequence matched by `\\d+`', '`"ready"` — the word after the numeric suffix', '`None` — because `re.search` only checks the start of the string'],
    1,
    '`re.search` scans the string for the first location matching the pattern. `\\d+` matches one or more digits, so `group()` returns the text `42`.')

patch_options('C-021',
    'How do the two chained string methods transform the whitespace-padded input before it is printed?',
    ['`DATA SCIENCE` — surrounding whitespace is removed and letters are uppercased', '`  DATA SCIENCE  ` — letters are uppercased but surrounding whitespace remains', '`data science` — surrounding whitespace is removed but letter case is unchanged', '`  data science  ` — neither surrounding whitespace nor letter case is changed'],
    0,
    '`strip()` removes leading and trailing whitespace and returns a new string; `upper()` then converts its letters to uppercase. The chained result is `DATA SCIENCE`.')

# Replace the duplicate OOP prompt with the syllabus distinction between
# method overloading and overriding in Python.
patch_options('S-147',
    'Which statement accurately describes traditional signature-based method overloading in Python?',
    ['Defining the same method name again in a class replaces the earlier binding; Python does not select methods by signature automatically', 'Python creates a separate method for every argument count and dispatches by signature automatically', 'A subclass method with the same name is called method overloading, even when it replaces an inherited method', 'Python permits method overloading only when every overload has a different return type'],
    0,
    'Python supports method overriding through inheritance, but it does not provide Java-style signature-based method overloading by default. Defining the same method name repeatedly in one class replaces the earlier class-namespace binding. Flexible arguments or explicit dispatch can be used when behavior must vary by input.',
    'Separate overriding in a subclass from choosing an implementation by argument signature.')
# Replace the mismatched final code-bank item: the snippet does not demonstrate robots.txt or rate limiting.
by_id['C-100'].update({
    'question': 'What do `timeout=10` and `raise_for_status()` each contribute to this Requests loop?',
    'options': [
        'Set a request timeout and raise `HTTPError` for unsuccessful 4xx or 5xx responses',
        'Retry each request ten times and ignore unsuccessful HTTP responses',
        'Set the HTTP status to 10 and convert the response body to JSON automatically',
        'Read robots.txt and enforce the website’s crawl-delay directive automatically'
    ],
    'answerIndex': 0,
    'explanation': 'The timeout argument bounds how long Requests waits for connection or response activity. `raise_for_status()` raises `HTTPError` for unsuccessful HTTP responses (typically 4xx or 5xx); neither call automatically retries or reads robots.txt.'
})

# Give the app a cleaner explanation model: the selected and correct options are
# compared in the feedback area, while this explanation teaches the rule. Avoid
# emitting a repeated generic wrongAnswerFeedback sentence on every record.
for item in questions:
    item.pop('wrongAnswerFeedback', None)


questions.sort(key=lambda x: x['number'])
(DATA / 'questions.json').write_text(json.dumps(questions, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Curated content written:', len(questions))
print('Banks:', dict(Counter(x['bank'] for x in questions)))
print('Question levels:', dict(Counter(x['difficulty'] for x in questions)))
print('Unique prompts:', len({x['question'].strip().casefold() for x in questions}))
