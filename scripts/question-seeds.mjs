const Q = (topicId, difficulty, type, question, options, correctAnswer, rationale, wrongWhy, hint, code = undefined) => ({ topicId, difficulty, type, question, options, correctAnswer, rationale, wrongWhy, hint, ...(code ? { code } : {}) });

export const core = [
  Q('jvm','basic','concept','What does the Java compiler normally produce when it compiles a source file containing a class?',[
    'A class file containing JVM bytecode that a compatible JVM can load and execute',
    'A native executable permanently tied to the processor used during compilation',
    'A JavaScript bundle that the browser translates into machine instructions',
    'A compressed JAR archive containing every library the application may need'
  ],0,'javac translates Java source into class-file bytecode. A JVM implementation for the target platform loads and executes that bytecode, which is the basis for Java portability.',['A normal javac invocation emits class files, not a platform-specific executable.','Java source is not translated into JavaScript by javac.','A JAR is an archive packaging format and is not the compiler output for every class by default.'],'Trace the usual source → compiler → class-file → runtime sequence.'),
  Q('jvm','medium','concept','Why can a Just-In-Time compiler improve the performance of a long-running Java application?',[
    'It can compile frequently executed bytecode paths into optimised native machine code at runtime',
    'It changes every object into a primitive value before the first method call',
    'It removes the need for class loading and bytecode verification',
    'It converts the entire application into Java source code before execution'
  ],0,'A JIT compiler can use runtime profiling information to optimise hot methods and compile them to native code. The JVM may continue to interpret less frequently executed bytecode.',['JIT compilation does not change the Java object model or make all objects primitive.','Class loading and verification remain part of JVM execution.','JIT compiles code to machine code, not back to Java source.'],'Think about what the runtime learns after the program has executed for a while.'),
  Q('jvm','basic','concept','Which statement most accurately distinguishes the JDK from the JVM?',[
    'The JDK supplies development tools such as javac; the JVM is the execution engine for bytecode',
    'The JVM contains the Java compiler, while the JDK contains only application libraries',
    'The JDK is a virtual machine and the JVM is a source-code editor',
    'The two names refer to the same component and are interchangeable in every context'
  ],0,'The JDK is the development kit and includes tools for building Java programs. The JVM provides the runtime mechanism that loads and executes bytecode.',['The roles are reversed: javac is a JDK tool, not a core JVM component.','Neither term refers to a source editor, and the JVM is not the JDK.','They are related but describe different layers of the Java platform.'],'Separate development-time tools from runtime execution.'),
  Q('jvm','medium','concept','Which memory area is shared by all Java threads and primarily stores objects and arrays?',[
    'The heap, which stores allocated objects and arrays',
    'Each thread stack, which stores only that thread’s method frames',
    'The program counter register, which is maintained separately per thread',
    'A local-variable slot table that belongs to one active method frame'
  ],0,'The heap is shared across threads and is where objects and arrays are allocated. Each thread has its own JVM stack and program counter.',['A Java stack is per-thread, not the shared object heap.','The program counter is per-thread and tracks the current instruction position.','Local variables are held in a method frame on a thread stack.'],'Look for the runtime area that stores objects regardless of which thread refers to them.'),
  Q('jvm','hard','concept','A method is called recursively many times. Which statement best describes the stack frames created by those calls?',[
    'Each active invocation has its own frame on the calling thread’s JVM stack',
    'All invocations share one mutable frame because the method has only one definition',
    'Each invocation creates a new JVM process with an independent heap',
    'The recursive calls are stored as additional class metadata in Metaspace'
  ],0,'A method invocation creates a frame containing its local variables, operand stack and bookkeeping. Recursive calls therefore have separate frames on the thread stack.',['A method definition is shared, but each invocation has its own execution frame.','A recursive call does not create a new operating-system process or JVM.','Metaspace stores class metadata, not active recursive call frames.'],'Distinguish a method’s single definition from its many simultaneous invocations.'),
  Q('basics','basic','concept','Which variable must be definitely assigned before it is read inside a method?',[
    'A local variable declared inside the method or one of its blocks',
    'An instance field of an object created with the new operator',
    'A static field declared by a class',
    'An element of a newly allocated int array'
  ],0,'Java applies definite-assignment checks to local variables. Fields and array elements receive default values when their containing object or array is created.',['Instance fields receive default values before the constructor body completes.','Static fields receive default values during class initialisation.','Array elements receive their component type’s default value.'],'Compare compiler definite-assignment rules for locals with default initialisation of fields and array elements.'),
  Q('basics','medium','concept','A method parameter is named count and the class also has an instance field named count. How can the method explicitly read the field?',[
    'Use this.count to refer to the current object’s field',
    'Use static count because every field is accessed through the class name',
    'Use super.count because all fields are inherited from Object',
    'Use local.count because parameters are stored as local variables'
  ],0,'When a local variable or parameter shadows an instance field, this.count explicitly selects the field belonging to the current object.',['static count is not a general field-selection syntax and would refer to a static field only if declared.','super selects an accessible superclass member, not the current class field in general.','local is not a Java keyword or implicit variable qualifier.'],'Use the receiver reference that denotes the current object.'),
  Q('basics','medium','concept','What is the main purpose of a JavaDoc comment beginning with /**?',[
    'To document API declarations in a format that the javadoc tool can process',
    'To mark a block that the Java compiler must execute before the main method',
    'To suppress every compiler warning in the following class',
    'To import all classes mentioned in the comment into the source file'
  ],0,'JavaDoc comments are structured documentation comments associated with declarations. The javadoc tool extracts them into API documentation.',['Comments are not executable code or initialisation blocks.','JavaDoc does not act as a general warning-suppression annotation.','A comment cannot change imports or type resolution.'],'Identify the comment syntax specifically intended for generated API documentation.'),
  Q('oop-foundations','basic','concept','In Java, what is the relationship between a class and an object?',[
    'A class defines a type and construction blueprint; an object is a runtime instance of that class',
    'An object is the source file from which a class is compiled',
    'A class is a single runtime variable that stores one object reference',
    'A class and an object are identical terms for a package declaration'
  ],0,'A class describes fields and methods for a type. An object is a particular runtime instance with identity and state.',['An object is not a source file; a source file contains declarations.','A class is a type definition, not a variable.','Packages group related types and are distinct from both classes and objects.'],'Think of a class as the type definition and an object as one created instance.'),
  Q('oop-foundations','medium','concept','Which design choice most directly supports encapsulation of an object’s internal state?',[
    'Keep fields private and expose controlled operations that preserve valid state',
    'Make every field public so callers can change internal state without restrictions',
    'Store all fields as global static variables shared by unrelated objects',
    'Replace methods with comments that describe how callers should modify fields'
  ],0,'Encapsulation limits direct access to representation and allows methods to enforce invariants when state changes.',['Public mutable fields expose representation and bypass validation.','Static global state is shared and does not encapsulate each object’s state.','Comments do not enforce access control or invariants.'],'Look for controlled access rather than unrestricted access.'),
  Q('types-operators','basic','concept','Which set contains all eight Java primitive types?',[
    'boolean, byte, short, int, long, char, float and double',
    'Boolean, Byte, Short, Integer, Long, Character, Float and Double',
    'String, int, long, char, decimal, real, boolean and object',
    'byte, short, int, long, float, double, String and void'
  ],0,'Java has eight primitive types. The capitalised types in option B are wrapper classes, while String and Object are reference types.',['These are wrapper classes rather than primitive types.','String, decimal and object are not Java primitive types.','String is a reference type and void is not a value type that can be declared for a variable.'],'Recall the eight primitive keywords, including the less frequently used byte, short and char.'),
  Q('types-operators','medium','concept','What happens when an int expression divides one int value by another and the result is assigned to a double?',[
    'Integer division happens first, so the fractional part is already discarded before assignment',
    'The compiler automatically converts both operands to double before performing division',
    'The division always throws ArithmeticException when the quotient is not a whole number',
    'The result is stored as a rational number with an exact numerator and denominator'
  ],0,'The operand types determine the division operation. With two int operands, Java performs integer division and truncates toward zero; assigning that result to double cannot restore the fraction.',['Assignment conversion happens after the division; it does not retroactively promote operands.','A non-integral quotient does not cause ArithmeticException.','Java primitive numeric division does not produce a rational-number object.'],'Check the types of the operands before considering the destination variable.'),
  Q('types-operators','medium','concept','Why is an explicit cast sometimes required when assigning a double value to an int?',[
    'The conversion is narrowing and can discard the fractional part or overflow the int range',
    'The conversion is always lossless but Java requires casts only for style consistency',
    'An int variable can store only positive values whereas double supports negatives',
    'Java does not permit any conversion between floating-point and integral types'
  ],0,'A double has a wider range and fractional precision than int. Narrowing requires an explicit cast because information may be lost.',['The conversion is not guaranteed to be lossless.','int supports negative values.','Java permits floating-point-to-integral casts, with defined truncation and range behaviour.'],'Compare the precision and range of the source and destination types.'),
  Q('types-operators','hard','concept','A program unboxes an Integer reference whose value is null. What is the result?',[
    'A NullPointerException occurs when Java attempts to obtain the primitive int value',
    'The primitive int receives zero because all wrapper references default to zero',
    'The compiler replaces the null reference with Integer.valueOf(0)',
    'The unboxing operation is skipped and the variable remains a nullable primitive'
  ],0,'Unboxing calls the wrapper’s primitive-value conversion. A null wrapper has no value to unbox, so a NullPointerException is thrown.',['A null reference is not an Integer object with the value zero.','Java does not silently substitute zero for a null wrapper.','Primitive variables cannot hold null.'],'Ask what object the unboxing conversion would need to read from.'),
  Q('types-operators','medium','concept','Which comparison should normally be used to compare the character content of two String objects?',[
    'equals, because it compares the character sequence according to String content semantics',
    '==, because it always compares the characters in two separate String objects',
    'compareTo, because it returns true only when two strings are identical',
    'hashCode, because equal strings must have different hash codes'
  ],0,'String.equals compares content. == checks whether two references identify the same object. compareTo provides lexicographic ordering and returns an int.',['== compares reference identity for String references.','compareTo returns an integer ordering result, not a boolean equality result.','Equal strings must have equal hash codes, not different ones.'],'Distinguish object identity from value equality.'),
  Q('types-operators','medium','concept','What is the key evaluation difference between the boolean operators && and &?',[
    '&& short-circuits when the left operand determines the result; boolean & evaluates both operands',
    '& short-circuits while && always evaluates both operands',
    '&& works only with integer bit patterns while & works only with booleans',
    'The operators are identical in evaluation and differ only in visual style'
  ],0,'For boolean operands, && performs conditional evaluation. Boolean & evaluates both sides. The same symbols also have bitwise uses on integral types.',['This reverses the short-circuit behaviour.','The boolean forms accept boolean operands; bitwise forms operate on integral values.','The evaluation semantics are different and can affect side effects or exceptions.'],'Consider whether the right-hand expression must always run.'),
  Q('control-flow','basic','concept','Which loop guarantees that its body executes at least once?',[
    'do-while, because its condition is tested after the loop body',
    'while, because its condition is tested after the first iteration',
    'for, because its update expression always runs before the first iteration',
    'foreach, because every array must contain at least one element'
  ],0,'A do-while loop evaluates its condition after executing the body, so the body runs at least once even when the condition is initially false.',['A while loop tests the condition before entering the body.','A for loop tests its condition before the first body execution.','Arrays and collections may be empty, so enhanced for may execute zero times.'],'Compare when each loop form first checks its condition.'),
  Q('control-flow','medium','concept','Inside a nested loop, what does an unlabeled break statement terminate?',[
    'The nearest enclosing loop or switch statement',
    'Every enclosing loop and the method that contains them',
    'Only the current iteration, then execution continues with the next iteration',
    'The JVM process after flushing all output streams'
  ],0,'An unlabeled break exits the nearest enclosing loop or switch. A labelled break can transfer control out of a labelled enclosing statement.',['An ordinary break does not automatically exit all nested loops or the method.','Skipping the current iteration is the role of continue.','break is a language control-transfer statement, not a process termination command.'],'Find the closest enclosing breakable statement.'),
  Q('control-flow','medium','concept','What can happen in a traditional Java switch statement when a matching case completes without break, return or another transfer?',[
    'Execution can fall through into subsequent case sections until a transfer or the switch end',
    'The compiler always inserts an implicit break after every case label',
    'The next case label is treated as a nested if statement and never executed',
    'The entire switch is re-evaluated using the next case expression'
  ],0,'Traditional switch statements permit fall-through. Control continues into following statements unless an explicit transfer exits the switch.',['The compiler does not add an implicit break to traditional switch statements.','Case labels are labels within one switch body, not nested if statements.','The selector expression is not re-evaluated for each subsequent case.'],'Remember the historical fall-through behaviour of colon-style case labels.'),
  Q('packages','basic','concept','What does an import declaration do in a Java source file?',[
    'It allows an accessible type or static member to be referred to by a shorter name',
    'It copies the imported class bytecode into the current source file',
    'It creates a new package containing the imported class',
    'It automatically downloads the imported library from the internet during compilation'
  ],0,'Imports affect name resolution in source code. They do not copy bytecode, create packages or retrieve dependencies.',['Imports are source-level declarations and do not copy class files.','A package is declared separately and is not created by an import.','Dependency retrieval is handled by build tools or other distribution mechanisms, not import declarations.'],'Think about source-code naming rather than packaging or dependency management.'),
  Q('packages','medium','concept','Which package is implicitly available to Java source code without an explicit import?',[
    'java.lang, which contains common types such as String and Math',
    'java.util, which contains collections such as ArrayList and HashMap',
    'java.io, which contains streams and file APIs',
    'java.time, which contains LocalDate and Instant'
  ],0,'Types in java.lang are automatically available by simple name. Types in packages such as java.util, java.io and java.time normally require imports or qualified names.',['java.util is not implicitly imported.','java.io is not implicitly imported.','java.time is not implicitly imported.'],'Recall which standard package contains Object, String, Math and System.'),
  Q('arrays','basic','concept','For an array whose length is 5, which index range is valid?',[
    '0 through 4 inclusive, because Java array indexing starts at zero',
    '1 through 5 inclusive, because length is the highest valid index',
    '0 through 5 inclusive, because the length field is also an element',
    '-1 through 3 inclusive, because the final slot is reserved for metadata'
  ],0,'An array of length n has valid indices from 0 to n-1. The length field reports the number of elements, not the last index.',['Java arrays are zero-indexed.','The length value is one greater than the largest valid index.','Negative indexes are not valid array element positions.'],'Use length minus one as the final valid index.'),
  Q('arrays','medium','concept','What is a jagged two-dimensional Java array?',[
    'An array whose elements are references to row arrays that may have different lengths',
    'A single rectangular memory block where every row must have the same length',
    'An array that stores only primitive values and cannot contain references',
    'A matrix whose row and column indices both start at one'
  ],0,'Java multidimensional arrays are arrays of arrays. Each row is a separate array and can be allocated with a different length or left null.',['Java does not require all rows to have equal lengths.','An array of arrays may contain references to arrays, not only primitives.','Java array indexing starts at zero.'],'Think of the outer array as holding references to independently sized row arrays.'),
  Q('arrays','hard','concept','What is the most reliable precondition for using Arrays.binarySearch on an array?',[
    'The array must already be sorted according to the ordering used by the search',
    'The array must contain no duplicate values',
    'The array must have a length that is a power of two',
    'The array must contain only primitive values and no objects'
  ],0,'Binary search relies on ordered data so it can discard half of the remaining search interval at each step. The API does not require a power-of-two length or unique values.',['Duplicates are permitted; the method may return one matching position.','Array length need not be a power of two.','Object arrays can be searched when their ordering is appropriate.'],'Binary search chooses a half based on ordering, so the input must have an ordering.'),
  Q('strings','basic','concept','Why does calling String.toUpperCase() not change the original String object?',[
    'String is immutable, so the method returns a new String result instead of modifying the receiver',
    'The method changes only the String pool and never returns a value',
    'The JVM prohibits every String method from allocating another object',
    'String objects are mutable, but Java copies them before every method call'
  ],0,'String is immutable. Operations that appear to transform text return a result and leave the original String unchanged.',['toUpperCase returns a String value.','The JVM can allocate new strings; immutability is the key property.','Java does not automatically copy every String before every method call.'],'Check whether the API mutates the receiver or returns a transformed value.'),
  Q('strings','medium','concept','What is the main reason to use StringBuilder for repeated text appends inside a loop?',[
    'It mutates a character sequence and can avoid creating a new String for each append step',
    'It makes every append operation automatically thread-safe across all threads',
    'It stores text in a fixed-length array that cannot grow after construction',
    'It compares string contents faster than String.equals in every situation'
  ],0,'StringBuilder is mutable and designed for efficient sequential text construction. It is not synchronised; StringBuffer is the synchronised alternative.',['StringBuilder methods are not synchronised.','A StringBuilder can expand its capacity.','StringBuilder is not a replacement for String content comparison.'],'Look for mutability and reduced intermediate allocations.'),
  Q('strings','hard','concept','Two distinct String objects contain the characters "Java". Which statement is guaranteed?',[
    'Their equals method returns true, even if their references are not identical',
    'Their == comparison must return true because equal strings are interned automatically',
    'Their hashCode values must be different because the objects are distinct',
    'Their compareTo result must be positive because they are separate instances'
  ],0,'String.equals is based on character content. Distinct instances may compare equal while == is false. Equal strings have equal hash codes.',['Not every String construction is required to reuse the same reference.','Equal objects must have equal hash codes under the equals/hashCode contract.','compareTo returns zero for equal character sequences.'],'Separate content equality from object identity.'),
  Q('methods-encapsulation','basic','concept','Which statement about Java argument passing is correct?',[
    'Java always passes values; for an object parameter, the copied value is a reference to the same object',
    'Java passes objects by reference, so a method can reassign the caller’s variable directly',
    'Java passes primitive arguments by value but object arguments by reference',
    'Java copies every object deeply before passing it to a method'
  ],0,'Java is pass-by-value for all parameters. When the value is an object reference, the callee receives a copy of that reference and can mutate the same object, but cannot reassign the caller’s variable.',['Reassigning a parameter does not reassign the caller’s variable.','The language uses pass-by-value consistently for primitive and reference values.','The object itself is not automatically deep-copied.'],'Ask whether the parameter receives the object or a copy of the reference value.'),
  Q('methods-encapsulation','medium','concept','Which change alone cannot create a valid overload of an existing Java method?',[
    'Changing only the return type while keeping the method name and parameter types identical',
    'Adding a parameter while keeping the method name the same',
    'Changing a parameter type while keeping the method name the same',
    'Changing the number of parameters while keeping the method name the same'
  ],0,'Overload resolution uses the method name and parameter list. Return type alone does not distinguish overloads, because a call expression may not use the result.',['A different parameter count can create a distinct signature.','A different parameter type can create a distinct signature.','A different number of parameters can create a distinct signature.'],'Method selection is based on the signature, not just the declared result type.'),
  Q('methods-encapsulation','medium','concept','When does the compiler provide an implicit default no-argument constructor?',[
    'When the class declares no constructor of its own',
    'Whenever the class has at least one public method',
    'Whenever the class extends another class and overrides a method',
    'Whenever a constructor has been declared with one or more parameters'
  ],0,'If no constructor is declared, the compiler supplies a default no-argument constructor. Declaring any constructor suppresses this implicit constructor.',['Methods do not determine whether a default constructor is generated.','Inheritance and overriding do not cause a default constructor to be added.','A parameterised constructor is a declared constructor and suppresses the implicit default.'],'Check whether the class itself declares any constructor.'),
  Q('methods-encapsulation','hard','concept','Which combination is most appropriate when designing an immutable class that contains a mutable Date supplied by a caller?',[
    'Use private final state, copy the Date on input, and return a copy rather than the internal Date',
    'Use a public Date field and document that callers should not modify it',
    'Use a final Date field and return the same reference from every getter',
    'Use a static mutable Date so every instance observes the same value'
  ],0,'final prevents reassignment of the field but does not make the referenced Date immutable. Defensive copies prevent callers from changing internal state through retained or returned references.',['Documentation alone does not enforce immutability.','A final reference still refers to a mutable Date object.','Static mutable state is shared and remains mutable.'],'A final reference does not freeze the object it refers to.'),
  Q('inheritance','medium','concept','What is the relationship expressed by class ElectricCar extends Car?',[
    'ElectricCar is a subtype of Car and can inherit accessible instance members from Car',
    'Car becomes an object field stored inside every ElectricCar automatically',
    'ElectricCar inherits every private constructor and all private fields as accessible members',
    'Car and ElectricCar become unrelated classes that share only a package name'
  ],0,'extends declares class inheritance. The subclass is a subtype and inherits accessible members, but constructors are not inherited and private members are not directly accessible by name.',['Inheritance is not automatic composition of a Car field.','Constructors are not inherited; private members are not directly accessible to subclass code.','The classes are related by inheritance, not merely by package membership.'],'Interpret extends as a type relationship, not a field declaration.'),
  Q('inheritance','medium','concept','Why can a concrete subclass of an abstract class still fail to compile?',[
    'It has not implemented all inherited abstract methods with compatible signatures',
    'It inherits a concrete method from its abstract superclass',
    'It declares a constructor with the same name as the superclass',
    'It uses an interface in addition to its superclass'
  ],0,'A non-abstract subclass must provide implementations for inherited abstract methods, unless an implementation is already inherited from a suitable concrete superclass.',['Concrete methods do not create an obligation to implement them.','A constructor must use the subclass name; superclass construction is handled through super.','A class can implement interfaces while extending one class.'],'A concrete type must fulfil every remaining abstract contract.'),
  Q('inheritance','medium','concept','Which statement about Java interfaces is correct?',[
    'A class can implement multiple interfaces, allowing it to satisfy several type contracts',
    'A class can extend multiple classes if each superclass is abstract',
    'An interface can be instantiated directly with the new operator',
    'An interface can declare only fields and cannot declare methods'
  ],0,'Java supports single class inheritance but multiple interface implementation. Interfaces define contracts and may also include default, static and private helper methods.',['Java classes have only one direct superclass.','An interface is not directly instantiated.','Interfaces can declare abstract and several kinds of concrete methods.'],'Separate the single-superclass rule from the multiple-interface rule.'),
  Q('polymorphism','medium','concept','A variable is declared as Animal but refers to a Dog object. Which type determines which overridden instance method body runs?',[
    'The runtime class of the object, Dog, determines dynamic dispatch',
    'The declared reference type, Animal, always determines the method body',
    'The package containing the variable determines the method body',
    'The type of the variable name determines the method body at runtime'
  ],0,'For overridden instance methods, dynamic dispatch selects the most specific implementation available in the runtime class. The declared reference type still controls compile-time member accessibility.',['The reference type does not select the overriding implementation.','Package membership does not drive virtual method dispatch.','A variable name has no type semantics beyond its declaration.'],'Separate compile-time member lookup from runtime virtual dispatch.'),
  Q('polymorphism','hard','concept','A downcast from a Base reference to Derived compiles but the referenced object is actually a Base instance. What happens when the cast executes?',[
    'A ClassCastException is thrown because the runtime object is not a Derived instance',
    'The object is converted into a Derived instance by adding the missing fields',
    'The cast always succeeds because Derived inherits from Base',
    'The reference becomes null without an exception'
  ],0,'A downcast is checked at runtime. It succeeds only if the actual object is compatible with the target type; otherwise ClassCastException is thrown.',['Casting does not transform the runtime object or add subclass state.','The inheritance relationship makes the cast syntactically possible, not always safe at runtime.','A failed cast throws rather than silently returning null.'],'The compiler sees the declared type; the runtime checks the actual object.'),
  Q('polymorphism','medium','concept','How are fields and overridden instance methods resolved when a superclass reference points to a subclass object?',[
    'An overridden instance method uses runtime dispatch, while field access is resolved from the declared reference type',
    'Both field access and method calls always use the runtime object type',
    'Both field access and method calls always use the declared reference type',
    'Neither fields nor methods can be accessed through a superclass reference'
  ],0,'Java dynamically dispatches overridden instance methods. Field hiding is not polymorphic in the same way; the field selected is based on the compile-time reference type.',['Fields are not dynamically dispatched.','Overridden instance methods do use the runtime type.','A superclass reference can access members declared in its type, including virtual methods.'],'Remember that field hiding differs from method overriding.'),
  Q('exceptions','basic','concept','Which category must generally be caught or declared by a Java method?',[
    'Checked exceptions, such as IOException, unless the method handles them',
    'Every RuntimeException subclass, even if it is never thrown',
    'Every Error subclass, including virtual-machine errors',
    'All Throwable instances regardless of their inheritance branch'
  ],0,'Checked exceptions are subject to compile-time catch-or-declare rules. RuntimeException and Error subclasses are unchecked.',['RuntimeException subclasses are unchecked.','Error subclasses are unchecked and generally are not meant for application recovery.','The catch-or-declare rule applies to checked exceptions, not all Throwable values indiscriminately.'],'Identify the checked branch of the Throwable hierarchy.'),
  Q('exceptions','medium','concept','Why must a catch clause for FileNotFoundException appear before a later catch clause for IOException?',[
    'FileNotFoundException is a subclass of IOException, so the broader catch would otherwise make the specific catch unreachable',
    'Java always requires catch clauses to appear in alphabetical order',
    'IOException is a subclass of FileNotFoundException, so it must be caught first',
    'The compiler executes catch clauses in parallel and needs a priority order'
  ],0,'A catch for a superclass catches instances of its subclasses. Placing it first would prevent the more specific catch from ever being selected and makes the later clause unreachable.',['Catch ordering is based on exception hierarchy, not alphabetic order.','The inheritance direction is the reverse: FileNotFoundException extends IOException.','Catch clauses are considered in source order, not executed in parallel.'],'Order handlers from narrower exception types to broader ones.'),
  Q('exceptions','medium','concept','Which statement correctly distinguishes throw from throws?',[
    'throw raises a specific exception object; throws declares exception types in a method signature',
    'throw declares possible failures; throws creates and raises an exception instance',
    'throw handles an exception; throws suppresses the exception permanently',
    'The two keywords are interchangeable and have identical syntax'
  ],0,'throw is an executable statement that transfers control by throwing a Throwable. throws is part of a method or constructor declaration and documents declared exceptions, especially checked ones.',['This reverses the two keyword roles.','Neither keyword is itself an exception handler or suppression command.','They have different grammatical positions and meanings.'],'One keyword performs the action; the other appears in a declaration.'),
  Q('exceptions','hard','concept','In try-with-resources, both the try body and close() throw exceptions. Which exception is normally propagated as primary?',[
    'The exception thrown by the try body; the close exception is recorded as suppressed',
    'The exception thrown by close(); the body exception is discarded',
    'Both exceptions are combined into a new RuntimeException with no cause',
    'Neither exception propagates because resource closing always swallows failures'
  ],0,'When the body throws and resource closing also fails, the body exception remains primary. The close failure is attached as a suppressed exception and can be inspected with getSuppressed().',['The close failure does not normally replace the body failure.','Java preserves the primary and suppressed exceptions rather than fabricating an unrelated wrapper.','try-with-resources does not silently swallow close failures.'],'Remember that the original operation failure remains the primary failure.'),
  Q('enums-generics','basic','concept','What is the most appropriate use of an enum?',[
    'Represent a fixed, finite set of named values such as workflow states or directions',
    'Represent an unbounded collection of user-created records at runtime',
    'Represent a mutable key/value table that supports arbitrary keys',
    'Represent a method that can return different primitive types on every call'
  ],0,'An enum provides a type-safe set of predefined constants. It can also hold fields and methods, but the set of enum instances is fixed by the declaration.',['An enum is not a general dynamic record collection.','A Map is used for arbitrary key/value associations.','Java methods have one declared return type, not a new primitive type per invocation.'],'Look for a domain with a fixed set of legal values.'),
  Q('enums-generics','medium','concept','What is the primary benefit of declaring a variable as List<String> rather than a raw List?',[
    'The compiler can enforce String element types and callers can retrieve values without manual casts',
    'The list becomes immutable and rejects every add operation at runtime',
    'The list stores strings in a special compact memory region unavailable to raw lists',
    'The generic type is guaranteed to be available as a separate runtime class for reflection'
  ],0,'Generics provide compile-time type safety and reduce casts. They do not make collections immutable or guarantee a separately reified parameterised class at runtime.',['A List<String> remains mutable unless wrapped or designed otherwise.','Generics do not dictate a special memory region for element storage.','Java generics use type erasure for most runtime representation.'],'Focus on compile-time checking and eliminating casts.'),
  Q('enums-generics','hard','concept','Why is new T() not allowed in an ordinary generic class method when T has no additional bound or constructor metadata?',[
    'Type erasure means the runtime does not generally know which concrete T constructor should be invoked',
    'Generic type parameters can refer only to primitive types',
    'Every type parameter is automatically converted into an interface with no constructors',
    'Java allows construction of T only when T is a String'
  ],0,'Generic type parameters are erased. The compiler cannot emit a normal constructor call for an unknown T without a construction mechanism such as a supplied factory or constructor reference.',['Generic type arguments are reference types, not primitive types directly.','Erasure does not turn every type parameter into an interface.','There is no special String-only construction rule.'],'Ask what concrete constructor the bytecode would need to call.'),
  Q('enums-generics','medium','concept','Which statement about Map and Collection in the Java Collections Framework is correct?',[
    'Map is part of the framework but does not extend the Collection interface',
    'Map extends List because each key/value pair is stored at an integer index',
    'Map is a subtype of Set because keys are unique',
    'Collection extends Map so every List is also a key/value association'
  ],0,'Map models key/value associations and is separate from the Collection hierarchy. It can expose collection views such as keySet, values and entrySet.',['A map is not indexed by list position and does not extend List.','Unique keys do not make Map a subtype of Set.','Collection and Map are separate top-level abstractions.'],'Remember that Map does not inherit from Collection.'),
  Q('functional','basic','concept','Which description best fits a Predicate<T> functional interface?',[
    'It accepts a value of type T and produces a boolean test result',
    'It accepts a value of type T and transforms it into a value of type R',
    'It supplies a value of type T without accepting an input',
    'It accepts a value of type T and returns no result'
  ],0,'Predicate<T> represents a boolean-valued test. Function<T,R> transforms, Supplier<T> supplies and Consumer<T> consumes without returning a result.',['This describes Function<T,R>.','This describes Supplier<T>.','This describes Consumer<T>.'],'Match the interface to its input and output shape.'),
  Q('functional','medium','concept','Which property must a local variable have before it can be captured by a lambda expression?',[
    'It must be final or effectively final in the enclosing scope',
    'It must be declared static and public',
    'It must be an instance of a serializable class',
    'It must be reassigned at least once before the lambda is created'
  ],0,'A lambda may capture a local variable only when it is final or effectively final. This avoids ambiguity about the captured local value and its lifetime.',['Local variables do not need to be static or public.','Serialization is not a general requirement for lambda capture.','Reassignment would make the variable not effectively final.'],'Check whether the local variable is reassigned after initialisation.'),
  Q('functional','hard','concept','What is the main purpose of the @FunctionalInterface annotation?',[
    'It asks the compiler to verify that the interface satisfies the functional-interface rule',
    'It makes every method in the interface static',
    'It converts any interface into a class that can be instantiated',
    'It forces all implementations to use a lambda expression'
  ],0,'@FunctionalInterface is an optional annotation that documents intent and causes a compile-time error if the interface does not meet the single-abstract-method rule.',['It does not change method staticness.','An interface remains an interface and is not instantiated directly.','Implementations can use classes, method references or lambdas where suitable.'],'Think of it as a compile-time contract check, not a runtime transformation.'),
  Q('collections','medium','concept','Which collection is the natural choice when the application needs unique elements and sorted iteration?',[
    'TreeSet, which maintains elements in their natural or supplied comparator order',
    'ArrayList, which allows duplicates and preserves positional insertion order',
    'HashSet, which provides no general iteration-order guarantee',
    'LinkedList, which allows duplicates and is primarily a List and Deque implementation'
  ],0,'TreeSet implements NavigableSet and maintains sorted order while enforcing uniqueness. A comparator or natural ordering determines the order.',['ArrayList does not enforce uniqueness or automatically sort.','HashSet enforces uniqueness but does not promise sorted iteration.','LinkedList allows duplicates and does not sort elements automatically.'],'Match both requirements: uniqueness and sorted iteration.'),
  Q('collections','medium','concept','Why can indexed access to a LinkedList be slower than indexed access to an ArrayList?',[
    'LinkedList generally traverses nodes from an end, while ArrayList can index directly into its backing array',
    'ArrayList must scan every element to find an index, while LinkedList uses direct array addressing',
    'LinkedList stores all elements in a sorted tree and must rebalance after each read',
    'The Java language forbids direct index access on LinkedList'
  ],0,'ArrayList supports constant-time indexed access through its backing array. LinkedList must traverse links to reach an index, so indexed access is linear.',['This reverses the usual access characteristics.','LinkedList is node-based rather than tree-based.','LinkedList implements List and supports get(index), though it may be slower.'],'Consider the underlying storage representation.'),
  Q('collections','hard','concept','What is the main risk of structurally modifying an ArrayList directly inside an enhanced for loop over that same list?',[
    'The iterator can detect concurrent structural modification and throw ConcurrentModificationException',
    'The list automatically copies itself and changes the loop variable to the new list',
    'The loop becomes thread-safe because the list is being modified by one thread',
    'Every element is silently converted to null before the next iteration'
  ],0,'The enhanced for loop uses an Iterator. Structural modification outside the iterator’s supported remove operation can trigger fail-fast detection and ConcurrentModificationException.',['The list does not automatically make a copy to isolate the loop.','Single-threaded code can still violate iterator modification rules.','Modification does not automatically null every element.'],'Think about which iterator the enhanced for loop uses internally.'),
  Q('streams','medium','concept','Why are intermediate Stream operations such as filter and map described as lazy?',[
    'They build a pipeline description and generally do not process elements until a terminal operation is invoked',
    'They execute immediately but store every intermediate result in a permanent collection',
    'They run only when a stream is converted into an array of primitive values',
    'They are evaluated by the compiler before the Java program starts'
  ],0,'Intermediate operations are lazy. A terminal operation triggers traversal and pipeline evaluation, often allowing operations to be fused without materialising intermediate collections.',['Intermediate operations do not generally execute immediately or create permanent collections.','Streams can terminate in many ways, not only primitive arrays.','Stream elements are processed at runtime, not precomputed by the compiler.'],'Ask what event starts traversal of the stream source.'),
  Q('streams','medium','concept','When is flatMap more appropriate than map?',[
    'When each input element is transformed into zero or more elements that should be flattened into one stream',
    'When each input must be transformed into exactly one value of a different type',
    'When a stream must be sorted in reverse order without a comparator',
    'When a terminal operation must be postponed until a later method call'
  ],0,'map produces one mapped result for each input. flatMap maps each input to a stream and flattens those streams into a single output stream.',['This is the normal use case for map.','Sorting is handled by sorted with an ordering.','Laziness and terminal operations are separate concepts.'],'Consider whether each source element expands into a nested stream.'),
  Q('streams','hard','concept','Why should a reduction operation used with a parallel stream generally be associative?',[
    'The stream may combine partial results in different groupings, and associativity keeps the result consistent',
    'Associativity guarantees that every element is processed on the same thread',
    'Associativity prevents the stream from invoking its terminal operation',
    'Associativity forces all elements to be sorted before reduction'
  ],0,'Parallel reduction may partition data and combine partial results in a different grouping. An associative operation yields the same result regardless of grouping (subject to the operation’s identity and semantics).',['Associativity does not pin work to one thread.','A terminal operation is still required to evaluate a stream pipeline.','Reduction does not inherently sort elements.'],'Think about regrouping partial results during parallel execution.'),
  Q('datetime','basic','concept','Which java.time type represents a calendar date without a time or time zone?',[
    'LocalDate, which stores year, month and day fields',
    'Instant, which represents a point on the UTC timeline',
    'ZonedDateTime, which combines date-time with a time zone',
    'Duration, which represents a time-based amount'
  ],0,'LocalDate represents a date only. Instant is timeline-based, ZonedDateTime includes a zone, and Duration measures an amount of time.',['Instant is a moment on the timeline, not a calendar-only date.','ZonedDateTime includes time and zone information.','Duration represents an amount, not a date.'],'Choose the type whose name and data model are date-only.'),
  Q('datetime','medium','concept','Which type is usually more appropriate for measuring an elapsed number of hours than for adding one calendar month?',[
    'Duration, because it represents a time-based amount',
    'Period, because it represents date-based years, months and days',
    'LocalDate, because it stores a number of nanoseconds',
    'DateTimeFormatter, because it parses elapsed time values'
  ],0,'Duration measures time-based amounts, often seconds and nanoseconds. Period represents calendar-based years, months and days. A month has a variable number of days, so the types are not interchangeable.',['Period is date-based and better suited to calendar units.','LocalDate has no time-of-day or nanosecond amount.','DateTimeFormatter formats and parses; it is not an amount type.'],'Separate timeline duration from calendar period.'),
  Q('concurrency','basic','concept','What is the practical difference between calling Thread.start() and calling the same object’s run() method directly?',[
    'start() requests execution on a new thread; run() called directly is an ordinary call on the current thread',
    'run() creates a new thread while start() only invokes the method synchronously',
    'Both methods always create a new operating-system thread',
    'start() can be called repeatedly on the same Thread object to create additional threads'
  ],0,'start() transitions a Thread from NEW and arranges for the JVM to invoke run on a new thread of execution. A direct run() call does not start a new thread. A Thread instance cannot be started more than once.',['This reverses the behaviour.','A direct call does not create a new thread.','A Thread instance may be started only once.'],'Think about which method asks the runtime to schedule a new thread.'),
  Q('concurrency','medium','concept','Which set lists the actual values in the Java Thread.State enum?',[
    'NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING and TERMINATED',
    'CREATED, READY, RUNNING, PAUSED, STOPPED and FINISHED',
    'NEW, STARTED, SLEEPING, LOCKED, WAITING and DEAD',
    'READY, RUNNING, BLOCKED, SUSPENDED, EXITED and JOINED'
  ],0,'Thread.State defines six states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING and TERMINATED. RUNNABLE covers both executing and eligible-to-run conditions.',['These are not the Java enum identifiers.','SLEEPING and DEAD are not Thread.State enum values.','These names mix informal scheduling concepts with non-enum terms.'],'Memorise the six enum constants, especially RUNNABLE rather than RUNNING.'),
  Q('concurrency','hard','concept','What does entering and later leaving a synchronized block on the same monitor provide?',[
    'Mutual exclusion for that monitor and a happens-before relationship from unlock to a later lock',
    'A guarantee that the entire application runs on a single thread forever',
    'Automatic rollback of every field changed inside the block if an exception occurs',
    'A guarantee that no other thread can ever read the object again'
  ],0,'A monitor allows one thread at a time to hold the lock. Unlocking a monitor happens-before a subsequent lock of that same monitor, supporting visibility of prior writes.',['Synchronization does not make the whole application single-threaded.','A synchronized block is not a transaction and does not roll back state.','Other threads can read data; synchronization governs lock access and visibility when correctly used.'],'Recall both mutual exclusion and memory visibility guarantees.'),
  Q('reflection','medium','concept','Which reflection method returns fields declared directly by a class, including non-public fields?',[
    'getDeclaredFields(), which returns fields declared by that class',
    'getFields(), which returns every declared field at all access levels',
    'getInterfaces(), which returns the class’s data members',
    'getSuperclass(), which returns the class’s constructor parameters'
  ],0,'getDeclaredFields returns fields declared directly in the class, including those with non-public access. getFields returns public fields, including inherited public fields.',['getFields is limited to public fields and includes inherited public members.','getInterfaces returns implemented interfaces, not fields.','getSuperclass returns the direct superclass Class object.'],'Pay attention to the distinction between getFields and getDeclaredFields.'),
  Q('reflection','hard','concept','What is a common reason frameworks use reflection during object construction or configuration?',[
    'They can inspect class metadata and discover constructors, fields, methods or annotations at runtime',
    'They can change Java source code after javac has compiled it without loading classes',
    'They can guarantee access to every private member regardless of module boundaries',
    'They can convert a Java object into a JVM process without invoking constructors'
  ],0,'Frameworks can discover metadata at runtime to instantiate objects, inject dependencies, map fields or process annotations. Access remains subject to runtime and module rules.',['Reflection inspects loaded class metadata; it is not a source-code rewriting mechanism.','Private access is not universally guaranteed, especially with module encapsulation.','A Java object and a JVM process are different concepts.'],'Think about how a framework can learn about a class without hard-coding each class name.'),
  Q('nodejs','basic','concept','Which statement correctly distinguishes Node.js from Java?',[
    'Node.js is a JavaScript runtime; Java is a separate programming language commonly executed on a JVM',
    'Node.js is the latest name for the Java Virtual Machine',
    'Node.js is a Java package used to compile .java source files',
    'JavaScript and Java are the same language with different file extensions'
  ],0,'Node.js executes JavaScript outside the browser, while Java is a distinct language with its own class-file and JVM platform. Similar names do not imply shared language identity.',['Node.js is not a JVM implementation.','Node.js is not a Java package or compiler.','Java and JavaScript are separate languages.'],'Do not infer language identity from the word Java in the runtime name.'),
  Q('nodejs','medium','concept','What is a typical way to start the Node.js REPL?',[
    'Run the node command without a script filename to enter the interactive prompt',
    'Run javac with the --repl option to open a JavaScript shell',
    'Open the JavaDoc browser and enter JavaScript expressions in its search box',
    'Run the JVM with a .class file and replace Java statements with JavaScript'
  ],0,'The Node.js REPL is an interactive Read-Eval-Print Loop and is commonly started by running node without a script path.',['javac compiles Java; it does not provide the Node REPL.','JavaDoc is documentation tooling.','A .class file is JVM bytecode, not a Node.js REPL input.'],'The REPL belongs to the Node executable, not to the Java toolchain.'),
  Q('spring','basic','concept','What does Inversion of Control mean in the context of the Spring Framework?',[
    'The framework or container manages object creation and lifecycle rather than application code constructing every dependency itself',
    'The framework reverses every Java boolean value before invoking a component',
    'The JVM transfers control to the operating system whenever a method returns',
    'A controller must instantiate every repository and service with the new operator'
  ],0,'Inversion of Control shifts responsibility for wiring and lifecycle management to a container. Dependency Injection is a common technique used to realise IoC.',['IoC is an architectural control-flow concept, not boolean inversion.','This is unrelated to method return or OS scheduling.','Manual construction of every dependency is the opposite of container-managed wiring.'],'Look for which part of the system creates and connects collaborating objects.'),
  Q('spring','medium','concept','Which description best fits constructor injection in Spring?',[
    'A component declares required dependencies as constructor parameters and the container supplies them',
    'A component searches the entire classpath and creates dependencies with reflection in every method call',
    'A component stores all dependencies in public static fields so no container is needed',
    'A component receives its dependencies only after its first HTTP response is sent'
  ],0,'Constructor injection makes required collaborators explicit and lets the Spring container supply them when creating the bean. It improves testability and supports immutable dependencies.',['Dependency discovery and creation is handled by the container, not every method call.','Public static global state is not constructor injection.','Dependencies are normally supplied during object creation, not after an HTTP response.'],'Think about dependency values being passed at object construction time.'),
  Q('spring','medium','concept','What is the central role of DispatcherServlet in Spring MVC?',[
    'It acts as the front controller that coordinates request mapping and dispatches to the appropriate handler',
    'It compiles Java source code into JVM bytecode before every web request',
    'It manages Java thread stack memory and garbage collection',
    'It stores every application entity in a relational database table'
  ],0,'DispatcherServlet is Spring MVC’s front controller. It delegates to handler mappings, adapters, controllers and other strategies to process a request and build a response.',['Compilation is performed by the Java build toolchain.','Thread stacks and garbage collection are JVM responsibilities.','Persistence is handled by data access components, not the DispatcherServlet.'],'Think about the central coordinator in the HTTP request path.'),
  Q('spring','hard','concept','A controller contains complex business calculations and persistence logic. Which refactoring best aligns with common Spring layering?',[
    'Keep the controller focused on request handling and move business rules into a service component',
    'Move all business logic into static methods in DispatcherServlet',
    'Place database credentials and SQL statements in the controller’s public fields',
    'Replace dependency injection with repeated manual object construction in each endpoint'
  ],0,'A controller should coordinate web concerns. Service components encapsulate business logic, while repository or data-access components handle persistence. This separation improves testing and maintainability.',['DispatcherServlet is framework infrastructure, not an application business-logic holder.','Public fields expose configuration and couple persistence to web concerns.','Repeated manual construction defeats container-managed dependency injection.'],'Separate HTTP concerns, business rules and persistence responsibilities.'),

  Q('types-operators','medium','concept','What is the key characteristic of the char primitive in Java?',[
    'It stores a single 16-bit UTF-16 code unit and is not a general variable-length text string',
    'It stores an entire Unicode paragraph as a dynamically sized object',
    'It stores only ASCII characters and cannot represent code units above 127',
    'It is a wrapper class and therefore can hold null directly'
  ],0,'char is a 16-bit unsigned integral primitive representing a UTF-16 code unit. Some Unicode code points require a surrogate pair of two char values, so a char is not necessarily one complete user-perceived character.',['A char holds one code unit, not an entire text sequence.','Java char is not restricted to 7-bit ASCII.','Character is the wrapper class; char is primitive and cannot be null.'],'Think in terms of UTF-16 code units rather than grapheme clusters.'),
  Q('types-operators','hard','concept','What does the expression 5 / 2 * 2 evaluate to when all literals are int?',[
    '4, because integer division is evaluated before multiplication and truncates 2.5 to 2',
    '5, because multiplication cancels the division before truncation',
    '5.0, because Java automatically promotes arithmetic expressions to double',
    '2, because multiplication is ignored after integer division'
  ],0,'The operators / and * have equal precedence and are left-associative. Java evaluates (5 / 2) first, producing 2, then multiplies by 2 to produce 4.',['The expression is not algebraically rearranged to preserve the original fraction.','No floating-point operand is present.','The multiplication is still evaluated after the division.'],'Apply precedence and associativity before doing the arithmetic.'),
  Q('types-operators','medium','concept','Which statement about the conditional operator ?: is correct?',[
    'It evaluates a boolean condition and chooses one of two expressions, producing a value',
    'It executes both branches and combines their output into an array',
    'It can be used only as a replacement for a switch statement with integer selectors',
    'It changes the type of the variable declared before the condition'
  ],0,'The conditional operator uses a boolean test and evaluates either the second or third operand. The selected expression contributes the result of the overall expression.',['Only one branch expression is evaluated.','The operator is not restricted to switch-like integer selection.','The operator does not mutate a variable’s declared type.'],'Read it as condition ? value-if-true : value-if-false.'),
  Q('control-flow','medium','concept','When does continue in a traditional for loop proceed to the update expression?',[
    'After skipping the remainder of the current body, control proceeds to the update and then the next condition check',
    'It exits the loop and proceeds to the first statement after the loop',
    'It jumps directly to the first statement in the loop body without checking the condition',
    'It behaves exactly like break when used inside a nested loop'
  ],0,'For a traditional for loop, continue skips the remaining body statements and proceeds to the update expression, then checks the loop condition again.',['That is the behaviour of break, not continue.','The condition is evaluated before the next iteration.','continue and break have different control-transfer semantics.'],'Remember the for-loop sequence: initialisation, condition, body, update.'),
  Q('packages','medium','concept','Which access level is indicated when a class member has no explicit access modifier?',[
    'Package-private access, meaning code in the same package can access it subject to the member rules',
    'Private access, meaning only the declaring class can access it',
    'Protected access, meaning only subclasses can access it',
    'Public access, meaning every module can access it without restrictions'
  ],0,'A member with no access modifier has package-private access. It is accessible to code in the same package, subject to other language and module rules.',['private must be written explicitly.','protected must be written explicitly and also permits subclass access.','public must be written explicitly and is still subject to type/module accessibility.'],'No modifier is a distinct access level, not the same as private.'),
  Q('packages','hard','concept','Why can two classes with the same simple name coexist in a Java application?',[
    'They can be declared in different packages and identified by distinct fully qualified names',
    'The Java compiler silently renames one class when a duplicate simple name appears',
    'Every class name is automatically prefixed with the current operating-system username',
    'Java permits duplicate class names only when both classes are interfaces'
  ],0,'Packages provide namespaces. For example, com.example.alpha.User and com.example.beta.User are distinct fully qualified types even though their simple names match.',['The compiler does not silently rename classes to resolve collisions.','Operating-system identity is unrelated to type naming.','The rule applies to classes and interfaces generally.'],'Compare the complete package-qualified names.'),
  Q('arrays','medium','concept','What does assigning one array variable to another do in Java?',[
    'It copies the array reference, so both variables refer to the same array object',
    'It automatically clones every element into a new independent array',
    'It converts the array into an immutable List',
    'It copies only the array length and leaves both arrays uninitialised'
  ],0,'Array assignment copies the reference value. Both variables then refer to the same array, so a mutation through either reference is visible through the other.',['An explicit clone or copy operation is needed for a separate array object.','Array assignment does not change the declared array type.','The array remains initialised and shared.'],'Distinguish copying a reference from copying the referenced object.'),
  Q('strings','medium','concept','What does String.compareTo return when two strings have equal character content?',[
    'Zero, indicating that neither string is lexicographically before the other',
    'True, because compareTo is a boolean equality method',
    'A positive value equal to the length of the first string',
    'A unique identity number for each String object'
  ],0,'compareTo returns an integer ordering result. A return value of zero indicates that the strings are equal according to their lexicographic comparison.',['The method returns int, not boolean.','The result is not defined as the first string length.','compareTo does not return an object identity value.'],'A zero comparison result indicates ordering equality.'),
  Q('methods-encapsulation','hard','concept','Which statement about a static method is correct?',[
    'It belongs to the class and cannot directly use this to refer to a particular object',
    'It is invoked only after an instance constructor has completed',
    'It can directly access every instance field without receiving an object reference',
    'It is dynamically overridden in exactly the same way as an instance method'
  ],0,'A static method is associated with the class rather than a particular instance. It has no this reference and must use an object reference to access instance members. Static methods are hidden, not dynamically overridden.',['A static method can be called without constructing an instance.','Instance members require an object reference from a static context.','Static methods use compile-time method selection rather than virtual dispatch.'],'Ask whether the method has a current object receiver.'),
  Q('methods-encapsulation','medium','concept','What happens when a subclass declares a method with the same signature as a static method in its superclass?',[
    'The subclass method hides the superclass static method rather than overriding it dynamically',
    'The subclass method overrides the superclass method using runtime virtual dispatch',
    'The compiler always rejects the declaration as a duplicate method',
    'The superclass method is converted into an abstract instance method'
  ],0,'Static methods are resolved using the compile-time type and can be hidden by a static method with a compatible signature in a subclass. This differs from overriding instance methods.',['Static methods are not dynamically dispatched as overrides.','A compatible static declaration is allowed as method hiding.','The superclass method is not changed by the subclass declaration.'],'Check whether the method is static in both classes.'),
  Q('inheritance','hard','concept','What does a subclass constructor normally do if it does not write an explicit constructor invocation as its first statement?',[
    'The compiler inserts an implicit super() call when the superclass has an accessible no-argument constructor',
    'The JVM skips superclass initialisation and starts directly in the subclass constructor',
    'The compiler inserts this() with every possible constructor signature',
    'The compiler always calls the superclass constructor that has the largest number of parameters'
  ],0,'A constructor without an explicit this(...) or super(...) invocation implicitly invokes super(). Compilation fails if the superclass has no accessible no-argument constructor.',['Superclass construction is part of normal object initialisation.','An implicit super() call is not a recursive this() call.','The compiler cannot guess a parameterised constructor.'],'The implicit constructor invocation is a no-argument super call.'),
  Q('inheritance','medium','concept','What is the role of the default method in a Java interface?',[
    'It provides an inherited implementation that implementing classes may use or override',
    'It creates a constructor that runs before every implementing class constructor',
    'It forces every implementing class to declare the same method again',
    'It makes the interface directly instantiable with new'
  ],0,'A default method supplies an implementation in an interface. Implementing classes inherit it and may override it, subject to conflict-resolution rules.',['Interfaces do not declare constructors.','A default method exists to provide a body, so re-declaration is not universally required.','Interfaces remain non-instantiable directly.'],'Look for the keyword default and the method body it supplies.'),
  Q('polymorphism','hard','concept','What happens if a class inherits two unrelated interface default methods with the same signature and provides no override?',[
    'The class must resolve the conflict by overriding the method',
    'The JVM chooses whichever interface was loaded first',
    'The method is silently treated as abstract and the class remains concrete',
    'The two default methods are concatenated into one implementation'
  ],0,'A class inheriting conflicting unrelated defaults must resolve the conflict explicitly, typically by overriding the method and optionally calling a selected InterfaceName.super method.',['The language does not depend on class-loading order to resolve source-level ambiguity.','A concrete class cannot leave the conflict unresolved.','Method bodies are never concatenated automatically.'],'The implementing class must make the design choice explicit.'),
  Q('exceptions','medium','concept','Which statement about finally is most accurate?',[
    'It normally executes as control leaves the try statement, even when an exception is thrown',
    'It executes only when no exception occurs in the try block',
    'It executes only when a matching catch block returns normally',
    'It is guaranteed to execute even after abrupt JVM or operating-system termination'
  ],0,'finally normally runs during control transfer out of try/catch, including exceptional paths. It is not guaranteed after process termination or severe runtime failure, and abrupt completion in finally can override earlier control flow.',['finally is not limited to normal completion.','It is not dependent on a catch returning normally.','No Java construct can guarantee execution after process termination.'],'Think of normal language-level exit paths, not process destruction.'),
  Q('exceptions','hard','concept','Why should a method generally avoid returning from a finally block?',[
    'A return in finally can suppress a pending exception or replace a return value from try or catch',
    'A return in finally always causes the JVM to deadlock',
    'A return in finally is illegal Java syntax in all circumstances',
    'A return in finally automatically closes every object reachable from the method'
  ],0,'Abrupt completion of finally can override earlier completion of the try/catch statement. This can hide failures and make behaviour difficult to reason about.',['A return in finally does not inherently deadlock the JVM.','The construct is legal, though discouraged.','Returning does not recursively close all reachable objects.'],'Consider what exception or value was already pending when finally runs.'),
  Q('enums-generics','medium','concept','What does the Enum.valueOf method require as its name argument?',[
    'The exact declared identifier of an enum constant, including matching case',
    'The ordinal position of the enum constant as a decimal string',
    'The fully qualified class name of an unrelated Java type',
    'A display label returned by the enum’s toString method in every case'
  ],0,'Enum.valueOf looks up a constant using its exact declared name. The lookup is case-sensitive and throws IllegalArgumentException when no matching constant exists.',['The method is name-based, not ordinal-based.','The class name is not the constant name.','toString may be overridden and need not return the declared identifier.'],'Compare the provided value to the enum constant identifier, character for character.'),
  Q('functional','medium','concept','What does Consumer<T> represent in java.util.function?',[
    'An operation that accepts a T and returns no result',
    'An operation that accepts no input and supplies a T',
    'An operation that accepts T and returns a boolean test',
    'An operation that transforms T into a different result type R'
  ],0,'Consumer<T> has an accept(T) method that consumes an input and returns void. Supplier, Predicate and Function have different input/output shapes.',['This describes Supplier<T>.','This describes Predicate<T>.','This describes Function<T,R>.'],'Remember that Consumer accepts an input but produces no return value.'),
  Q('functional','hard','concept','What is a common benefit of using a method reference such as System.out::println?',[
    'It expresses delegation to an existing compatible method more concisely than an equivalent lambda',
    'It performs reflection and bypasses the method’s declared access level',
    'It automatically starts a new thread for the referenced method',
    'It allows the method to accept any parameter type without compile-time checking'
  ],0,'A method reference is concise syntax for a functional-interface implementation that delegates to an existing method. The target functional interface still constrains parameter and return types.',['Method references do not bypass access control.','They do not create threads.','Type compatibility is checked by the compiler.'],'Method references are shorthand, not dynamic unchecked invocation.'),
  Q('collections','medium','concept','Which Map view provides key/value pairs suitable for iterating over both keys and values?',[
    'entrySet(), which returns a Set of Map.Entry key/value pairs',
    'keySet(), which returns a List of values and keys interleaved',
    'values(), which returns a Set of immutable key/value pairs',
    'iterator(), which every Map implementation exposes directly'
  ],0,'entrySet returns a Set view of Map.Entry objects, which expose getKey and getValue. keySet returns keys and values returns mapped values.',['keySet contains keys only, not interleaved pairs.','values returns values only and is a Collection view.','Map itself does not define a direct iterator method.'],'Select the view that holds one Entry per key/value mapping.'),
  Q('collections','hard','concept','What is the usual complexity of contains on a HashSet when hash distribution is good?',[
    'Expected constant time, because hashing narrows the search to a bucket',
    'Guaranteed linear time, because every element must always be compared',
    'Guaranteed logarithmic time, because HashSet is always implemented as a balanced tree',
    'Constant time in every possible case, regardless of collisions or hostile inputs'
  ],0,'HashSet lookup is expected O(1) with good hash distribution. Heavy collisions can degrade performance, and modern implementations may treeify certain bins under conditions.',['A hash set normally does not scan every element.','HashSet is not simply a balanced tree implementation.','Expected constant time is not an unconditional worst-case guarantee.'],'Use expected complexity and account for hash collisions.'),
  Q('streams','hard','concept','What does Stream.distinct use to determine duplicate object elements in an ordinary object stream?',[
    'The elements’ equals and hashCode contracts to identify equal values',
    'The elements’ memory addresses only, regardless of equals',
    'The elements’ toString output and lexicographic ordering',
    'The number of times each element has been mapped in the pipeline'
  ],0,'For reference streams, distinct identifies duplicates according to Object equality semantics, which rely on equals and hashCode. Classes should implement those methods consistently.',['Reference identity is not the general distinct criterion.','toString is not used as a uniqueness contract.','Mapping count is unrelated to value equality.'],'Connect stream distinct to the equality contract used by hash-based collections.'),
  Q('streams','medium','concept','Why can a stream not normally be reused after a terminal operation?',[
    'A stream represents a one-use pipeline; after terminal evaluation it is consumed',
    'A terminal operation permanently locks the source collection against all future reads',
    'The JVM deletes the source collection as soon as a stream completes',
    'A stream can be reused only if its source contains primitive values'
  ],0,'Streams are designed for one traversal. After a terminal operation, attempting to reuse the same stream generally causes IllegalStateException. A new stream can be created from the source if it supports it.',['A terminal stream operation does not lock or delete the source collection.','The source collection remains available.','Primitive streams are also one-use.'],'Recreate a pipeline from the source rather than reusing a consumed stream.'),
  Q('datetime','medium','concept','What is the difference between LocalDateTime and ZonedDateTime?',[
    'ZonedDateTime includes zone rules and identifies a regional time context; LocalDateTime has no zone or offset',
    'LocalDateTime always stores UTC while ZonedDateTime stores local daylight time only',
    'ZonedDateTime contains only a calendar date and no time of day',
    'LocalDateTime is mutable while ZonedDateTime is immutable'
  ],0,'LocalDateTime contains local date and time fields without a zone or offset. ZonedDateTime includes a ZoneId and resolves the local date-time in that zone’s rules. Both are immutable.',['LocalDateTime has no UTC guarantee.','ZonedDateTime includes a time component.','Both types are immutable.'],'Look for the presence of ZoneId and zone rules.'),
  Q('concurrency','medium','concept','What does Thread.join() allow one thread to do?',[
    'Wait until another thread has terminated before continuing',
    'Acquire the intrinsic monitor of every object used by another thread',
    'Start a previously terminated thread for another run',
    'Interrupt all threads in the current thread group'
  ],0,'join waits for the target thread to terminate (or for a timeout when using a timed overload). It does not restart the target thread or interrupt unrelated threads.',['join is not a general monitor-acquisition operation.','A Thread object cannot be started again after termination.','interrupt is a separate operation and normally affects one target thread.'],'Think of join as waiting for thread completion.'),
  Q('concurrency','hard','concept','What is the purpose of Thread.interrupt()?',[
    'It requests interruption by setting the target thread’s interrupt status and may unblock interruptible waits',
    'It forcibly terminates the target thread immediately at an arbitrary instruction',
    'It pauses the target thread permanently until another thread calls start again',
    'It rolls back all changes made by the target thread since its last checkpoint'
  ],0,'interrupt is a cooperative cancellation signal. It sets interrupt status and causes certain blocking methods to throw InterruptedException. Code should handle or propagate interruption appropriately.',['Java does not provide safe arbitrary forced termination through interrupt.','The thread is not restarted by start after interruption.','Interrupt does not perform transactional rollback.'],'Treat interruption as a signal that the task should respond to cooperatively.'),
  Q('concurrency','medium','concept','What is the usual purpose of marking a worker thread as a daemon thread?',[
    'It indicates a background service thread that does not by itself keep the JVM alive after all user threads finish',
    'It makes the thread execute at a higher operating-system priority than every user thread',
    'It guarantees that the thread is interrupted when it accesses shared state',
    'It prevents the thread from calling synchronized methods'
  ],0,'The JVM may exit when only daemon threads remain. Daemon status is typically configured before start and is suitable for background support work, not tasks that must complete before shutdown.',['Daemon status is not a priority guarantee.','Daemon status does not automatically interrupt a thread.','Daemon threads can use synchronization.'],'Think about JVM shutdown behaviour when no non-daemon threads remain.'),
  Q('reflection','medium','concept','What does Class.getSuperclass() return for a class directly extending Object?',[
    'The Class object representing Object',
    'An array containing every implemented interface',
    'The Class object representing the current class itself',
    'The package name as a String'
  ],0,'getSuperclass returns the direct superclass as a Class object. For a class directly extending Object, that result represents Object. Interfaces and primitive types have special behaviours.',['Implemented interfaces are returned by getInterfaces.','The current class metadata is returned by getClass or a class literal.','The package name is available through package-related metadata methods.'],'It returns one parent type, not the interface list.'),
  Q('nodejs','medium','concept','What does Node.js’s event-driven, non-blocking I/O model aim to support?',[
    'Handling many I/O-bound operations without dedicating one JavaScript thread to wait synchronously for each operation',
    'Running every JavaScript callback simultaneously on a separate CPU core by default',
    'Eliminating asynchronous callbacks and promises from server applications',
    'Executing Java bytecode directly inside the V8 JavaScript engine'
  ],0,'Node.js uses an event loop and asynchronous I/O facilities to manage many concurrent I/O operations efficiently. JavaScript callbacks are normally executed on the event-loop thread unless work is delegated to other facilities.',['Node.js does not create one JavaScript thread per callback by default.','Asynchronous APIs remain a core part of Node.js.','V8 executes JavaScript, not JVM bytecode.'],'Focus on I/O concurrency and the event loop rather than one thread per request.'),
  Q('spring','hard','concept','What is a Spring bean scope?',[
    'A rule that determines the lifecycle and sharing behaviour of a bean instance, such as singleton or prototype',
    'A rule that determines the Java visibility modifier of every bean field',
    'A setting that changes the JVM heap into a separate region for each controller',
    'A declaration that makes the bean a Java enum constant'
  ],0,'Bean scope controls how the container creates and shares bean instances. Singleton is the default per bean definition per container; prototype requests a new instance from the container each time. Web scopes add request/session contexts.',['Scope does not determine Java member visibility.','Bean scope does not partition JVM heap memory.','A Spring bean is not converted into an enum.'],'Think about one shared object versus a newly created object per lookup/request.'),
  Q('spring','medium','concept','How does Spring Boot differ from the Spring Framework?',[
    'Spring Boot builds on Spring with opinionated auto-configuration, starters and convenient application packaging',
    'Spring Boot is a separate language that replaces Java for web applications',
    'The Spring Framework is only an IDE, while Boot is a database engine',
    'Spring Boot removes the need for the JVM and compiles Java into browser JavaScript'
  ],0,'Spring Boot simplifies creating and running Spring applications with auto-configuration, starter dependencies and embedded-server conventions. It uses the Spring Framework rather than replacing it.',['Spring Boot is not a programming language.','Spring Framework and Boot are application framework technologies, not IDE/database roles.','Boot still runs as a Java application on a JVM.'],'Think of Boot as an opinionated layer that simplifies Spring application setup.'),


  Q('basics','basic','concept','Why is an instance field of type boolean false before the constructor assigns another value?',[
    'Fields receive their type’s default value when an object is created, and false is the default for boolean',
    'All Java variables are automatically set to false before use',
    'The constructor always assigns false to every boolean field after running',
    'Boolean fields are reference types and default to null'
  ],0,'Instance fields are default-initialised before constructor code runs. The default for boolean is false; the wrapper Boolean is a reference type and defaults to null.',['Local variables are not automatically initialised in the same way.','The default value is supplied by object initialisation, not a constructor assignment.','boolean is primitive; Boolean is the wrapper type.'],'Distinguish primitive boolean from the Boolean wrapper class.'),
  Q('basics','medium','concept','What does declaring an instance field final guarantee?',[
    'The field can be assigned only once under Java’s definite-assignment rules, but a referenced object may still be mutable',
    'The field’s referenced object becomes deeply immutable automatically',
    'The field is shared by every instance of the class',
    'The field can be assigned repeatedly as long as the values are equal'
  ],0,'final prevents the variable or reference from being reassigned after its permitted initialisation. If it refers to a mutable object, that object’s internal state may still change.',['final does not recursively freeze the referenced object.','A field must also be static to belong to the class rather than each instance.','The final field cannot be repeatedly assigned after initialisation.'],'A final reference is not the same as an immutable object.'),
  Q('types-operators','medium','concept','What is binary numeric promotion used for?',[
    'To convert numeric operands to a common promoted type before many arithmetic operations',
    'To convert every numeric expression to a two-character String before evaluation',
    'To choose which overloaded method is called after the method body has run',
    'To turn all primitive values into wrapper objects permanently'
  ],0,'Binary numeric promotion determines a common numeric type for many arithmetic operations, such as promoting byte and short operands to int and handling mixed numeric types.',['Numeric operators do not convert operands into strings by default.','Overload resolution happens at compile time, not after the method body.','Promotion does not permanently box every primitive.'],'Consider what type the operands have before the arithmetic operation.'),
  Q('types-operators','hard','concept','Why can an expression involving byte values produce an int result?',[
    'Java promotes byte and short operands to int for many arithmetic operations',
    'The byte type is an alias for Integer and is converted to a wrapper object',
    'The JVM cannot execute arithmetic on values smaller than 32 bits',
    'All arithmetic expressions in Java are evaluated using double precision'
  ],0,'Unary numeric promotion and binary numeric promotion commonly promote byte, short and char operands to int. This is why assigning an arithmetic result back to byte may require a cast.',['byte is a primitive and not an alias for Integer.','The language’s type-promotion rules explain the result; it is not a CPU limitation.','Integer arithmetic is not universally evaluated as double.'],'Remember that small integral types are promoted to int in arithmetic.'),
  Q('types-operators','medium','concept','What is the result type of the expression 1 + 2L?',[
    'long, because the int operand is promoted to long before addition',
    'int, because the left operand appears first in the expression',
    'double, because mixed numeric operands always become double',
    'Integer, because arithmetic automatically boxes the result'
  ],0,'The long operand causes the int operand to be widened to long. The addition is performed as long arithmetic and produces a long value.',['Operand order does not force the result type to the first operand.','Mixed integral operands are not automatically promoted to double.','Primitive arithmetic does not automatically box its result.'],'The wider integral operand determines the promoted integral type.'),
  Q('types-operators','hard','concept','Which statement about NaN comparisons in Java floating-point arithmetic is correct?',[
    'NaN is unequal to every value, including itself, so NaN == NaN is false',
    'NaN compares equal to itself because it represents a single invalid number',
    'NaN is always greater than positive infinity',
    'NaN can occur only when an integer division by zero is performed'
  ],0,'IEEE 754 NaN semantics apply to Java float and double: equality comparisons involving NaN are false, including NaN == NaN. Use Float.isNaN or Double.isNaN to test for it.',['NaN is deliberately not equal to itself under floating-point comparison.','NaN is not ordered greater than infinity; ordered comparisons are false.','Integer division by zero throws ArithmeticException; floating-point operations can produce NaN.'],'Remember the special equality rule for Not-a-Number.'),
  Q('packages','medium','concept','What does an on-demand import such as import java.util.* make available?',[
    'Accessible types in java.util by simple name, but not types in its subpackages automatically',
    'Every class in java.util and every nested package beneath it recursively',
    'Only static methods declared by classes in java.util',
    'All Java libraries installed anywhere on the computer'
  ],0,'A package wildcard import makes accessible types in that package available by simple name. It does not recursively import subpackages and does not automatically import static members.',['Java package imports are not recursive.','Static imports use import static.','An import does not search every library installed on the machine.'],'A package wildcard does not include its subpackages.'),
  Q('packages','medium','concept','What is the effect of a static import?',[
    'It allows accessible static members to be referred to without qualifying them with the declaring type',
    'It converts an instance field into a static field at runtime',
    'It imports every static field from every package in the application',
    'It makes a method execute during class loading without being called'
  ],0,'A static import affects source-level name resolution for static members. It does not change whether the member is static or trigger it to execute.',['The declaration of a member determines whether it is static.','A static import names a particular type or wildcard package/type scope.','Importing a name does not invoke it.'],'Compare import Type with import static Type.member.'),
  Q('arrays','medium','concept','What does the length member of an array represent?',[
    'The fixed number of element slots in the array, available as a field without parentheses',
    'The index of the last element, available through a length() method',
    'The number of non-null elements currently stored in the array',
    'The number of bytes allocated for the array object'
  ],0,'Array length is a final field containing the number of slots. It is accessed as array.length, not array.length(). It does not count only non-null elements.',['The final index is length - 1 and there is no array length() method.','Null reference elements still count as array slots.','The field reports element count, not memory size in bytes.'],'Recall the syntax array.length and what it counts.'),
  Q('arrays','hard','concept','What is a possible state of a newly created int[][] array when only the outer dimension is specified?',[
    'The outer array exists, but each row reference is initially null until a row array is assigned',
    'Every row is automatically allocated with the same number of columns',
    'Every row contains an int value of zero but has no array object',
    'The declaration is invalid because Java requires all dimensions at creation time'
  ],0,'new int[3][] creates an outer array with three references to int[] rows. Those references are initially null until each row is allocated or assigned.',['The inner dimension is not specified, so row arrays are not created automatically.','The outer elements are references to arrays rather than int elements directly.','Java permits partial dimension allocation for multidimensional arrays.'],'Separate the outer array allocation from allocation of each row.'),
  Q('strings','medium','concept','What does String.isBlank() test?',[
    'Whether the string is empty or contains only whitespace code points as defined by the method',
    'Whether the string has exactly zero characters and nothing else',
    'Whether the string contains at least one space character anywhere',
    'Whether the string has been interned in the String pool'
  ],0,'isBlank returns true for an empty string or a string containing only whitespace code points. It differs from isEmpty, which checks only length zero.',['isEmpty tests whether the sequence has length zero.','A string containing a space and letters is not blank.','Interning is unrelated to blankness.'],'Compare isBlank with isEmpty.'),
  Q('strings','hard','concept','Why is repeated String concatenation in a large loop often less efficient than StringBuilder?',[
    'Each concatenation may create a new immutable String and copy prior content, while a builder can append into mutable storage',
    'StringBuilder stores its content in the JVM stack and avoids all memory allocation',
    'The Java compiler is forbidden from optimising any String concatenation expression',
    'String concatenation is always O(1), while StringBuilder append is always O(n squared)'
  ],0,'Because String is immutable, repeated concatenation may create intermediate strings and recopy accumulated content. StringBuilder reuses mutable capacity and is generally a better choice for iterative construction.',['StringBuilder is an object and uses heap memory; it does not avoid all allocations.','The compiler can optimise some concatenation expressions.','The stated complexity comparison is not generally correct.'],'Think about how much accumulated text must be copied on each iteration.'),
  Q('methods-encapsulation','medium','concept','Which statement about constructor overloading is correct?',[
    'A class may declare multiple constructors with different parameter lists to support different initialisation paths',
    'A class may declare only one constructor because constructor names must be unique',
    'Constructors are inherited by subclasses and can be overridden like instance methods',
    'A constructor must declare a return type of void'
  ],0,'Constructors can be overloaded by parameter list, allowing objects to be initialised in different ways. They are not inherited or overridden and have no return type.',['Different parameter lists distinguish constructors.','Constructors are not inherited or overridden.','A constructor declaration has the class name and no return type.'],'Constructors use the class name and can have distinct parameter lists.'),
  Q('methods-encapsulation','hard','concept','What does this() do when used as the first statement of a constructor?',[
    'It delegates construction to another constructor in the same class',
    'It invokes the superclass constructor with no arguments',
    'It calls the current object’s toString method before construction',
    'It allocates a second object of the same class'
  ],0,'this(...) is a constructor invocation that delegates to another constructor in the same class. It must be the first statement in the constructor body. super(...) invokes a superclass constructor.',['super(...) is the superclass constructor invocation.','toString is an ordinary method, not constructor delegation.','this(...) does not allocate a second object.'],'Distinguish this(...) from super(...).'),
  Q('methods-encapsulation','medium','concept','Which order describes Java’s ordinary access modifiers from most restrictive to least restrictive?',[
    'private, package-private, protected, public',
    'public, protected, package-private, private',
    'protected, private, public, package-private',
    'package-private, public, private, protected'
  ],0,'private limits ordinary member access to the declaring top-level class context, package-private allows same-package access, protected adds subclass access, and public is the broadest. Module and enclosing-type rules still apply.',['This is the reverse order.','The ordering places private and public incorrectly.','The ordering places package-private before public and other levels incorrectly.'],'Move from one class, to one package, to subclasses and broad accessibility.'),
  Q('inheritance','medium','concept','Can Java constructors be overridden by a subclass?',[
    'No, because constructors are not inherited and are not instance methods',
    'Yes, provided the subclass uses the same constructor parameter list',
    'Yes, but only when the superclass constructor is protected',
    'Only abstract superclass constructors can be overridden'
  ],0,'Constructors initialise an instance and are not inherited. A subclass declares its own constructors and may invoke superclass constructors with this(...) or super(...).',['Matching parameter lists do not create constructor overriding.','Access level affects constructor accessibility, not inheritance.','Abstract classes can declare constructors, but those constructors are not overridden.'],'Overriding applies to inherited instance methods, not constructors.'),
  Q('polymorphism','hard','concept','Which method is not dynamically dispatched through an object reference in the same way as an overridden instance method?',[
    'A static method, which is hidden and selected according to compile-time type',
    'An ordinary public instance method that is overridden in a subclass',
    'An abstract instance method implemented by the runtime subclass',
    'A protected instance method overridden with a compatible signature'
  ],0,'Static methods belong to classes and are hidden rather than dynamically overridden. Ordinary instance methods use virtual dispatch where applicable.',['This is a normal override and uses dynamic dispatch.','Abstract instance methods are implemented by concrete subclasses and dispatched dynamically.','Protected visibility does not prevent virtual dispatch.'],'Check the static modifier.'),
  Q('polymorphism','medium','concept','What is the purpose of the @Override annotation?',[
    'To ask the compiler to verify that a method actually overrides or implements an inherited method',
    'To force the JVM to execute the method before every superclass method',
    'To make a private method visible to subclasses',
    'To convert an overloaded method into an abstract method'
  ],0,'@Override documents intent and enables compile-time verification that the declaration overrides a superclass method or implements an interface method. It does not change visibility or dispatch.',['The annotation does not change invocation order.','It does not widen private access.','Overloading and abstractness are not changed by the annotation.'],'Think compile-time checking of the declared override relationship.'),
  Q('exceptions','medium','concept','What is a multi-catch clause in Java?',[
    'A single catch block that handles multiple exception types separated by the | character',
    'A try statement that allows only multiple finally blocks',
    'A catch block that catches every Throwable and automatically retries it',
    'A method declaration that lists multiple return types separated by commas'
  ],0,'Multi-catch allows one catch block to handle multiple unrelated exception types, written with |. The alternatives cannot be in a subtype relationship that makes one redundant.',['Multi-catch concerns multiple exception alternatives in one catch, not multiple finally blocks.','It does not automatically retry exceptions or catch all Throwable values.','Method return types are not declared as a comma-separated list.'],'Look for the vertical bar between exception type alternatives.'),
  Q('exceptions','hard','concept','Why should a custom exception usually include a message or meaningful context?',[
    'It helps callers and maintainers understand the failure condition without reconstructing it from unrelated state',
    'It allows the compiler to select a catch block using the message text',
    'It ensures the exception is always unchecked even when it extends Exception',
    'It automatically writes the exception into a persistent database log'
  ],0,'Exception messages provide diagnostic context. Catch matching is based on the exception type, not the message, and logging is a separate concern.',['Catch selection is based on type compatibility.','Checked versus unchecked depends on the inheritance hierarchy.','An exception message does not automatically persist to a database.'],'Messages aid diagnosis; they do not control exception type semantics.'),
  Q('enums-generics','medium','concept','What is autoboxing?',[
    'An automatic conversion from a primitive value to its corresponding wrapper object when a reference is expected',
    'An automatic conversion from any object to a primitive regardless of its class',
    'A process that stores all wrapper objects permanently in the String pool',
    'A mechanism that makes wrapper objects mutable after construction'
  ],0,'Autoboxing converts a primitive such as int to its corresponding wrapper Integer where a reference is required. The reverse conversion is unboxing.',['Not every object can be converted to every primitive.','Wrapper objects are not stored in the String pool.','Wrapper classes are immutable.'],'Autoboxing moves from primitive to wrapper.'),
  Q('enums-generics','hard','concept','Why can List<Integer> not be assigned to a variable of type List<Number>?',[
    'Generic types are invariant, so List<Integer> is not a subtype of List<Number>',
    'Integer is not a subtype of Number',
    'Lists cannot contain instances of wrapper classes',
    'Number is a primitive type and cannot be used as a type argument'
  ],0,'Integer extends Number, but Java generic types are invariant by default. If List<Integer> were a List<Number>, a Double could be inserted through the wider reference. Wildcards can express covariance for reading.',['Integer is a subtype of Number.','Collections can contain wrapper objects.','Number is an abstract reference class and may be a generic type argument.'],'The element subtype relationship does not automatically carry to parameterised collections.'),
  Q('collections','medium','concept','Which description best fits a Queue?',[
    'A collection abstraction designed for holding elements prior to processing, often using FIFO ordering',
    'A mapping from unique keys to arbitrary values',
    'A sorted collection that always stores elements in reverse alphabetical order',
    'A random-access list that guarantees constant-time retrieval by numeric index'
  ],0,'Queue models elements awaiting processing. Many queue implementations use FIFO order, though priority queues and other implementations may apply different ordering policies.',['This describes Map.','Queue ordering is not necessarily reverse alphabetical.','Random access is a List characteristic, not the Queue contract.'],'Think of elements waiting to be processed.'),
  Q('collections','hard','concept','What additional ordering guarantee does LinkedHashMap commonly provide over HashMap?',[
    'It maintains a predictable encounter order, typically insertion order unless configured for access order',
    'It sorts keys by natural order and rejects null values',
    'It stores every key and value in an immutable linked list',
    'It guarantees that each operation is logarithmic in the number of entries'
  ],0,'LinkedHashMap maintains a linked encounter order, normally insertion order. It can also be configured for access order, useful for cache-like policies.',['TreeMap is the sorted-map implementation.','LinkedHashMap remains mutable and does not use immutable lists as its storage contract.','Its expected operation costs are generally similar to HashMap.'],'Look for stable iteration order rather than sorted key order.'),
  Q('functional','medium','concept','What is the difference between Function<T,R> and UnaryOperator<T>?',[
    'UnaryOperator<T> is a specialised Function<T,T> whose input and result types are the same',
    'Function<T,R> accepts two values while UnaryOperator<T> accepts none',
    'UnaryOperator<T> always returns boolean while Function<T,R> returns void',
    'They are unrelated interfaces with no inheritance relationship'
  ],0,'UnaryOperator<T> extends Function<T,T> and represents an operation whose input and output types are the same.',['Function has one input and one output type parameter.','Predicate returns boolean and Consumer returns void.','UnaryOperator is a specialised Function.'],'The same type appears as both the input and output.'),
  Q('streams','medium','concept','What does anyMatch do on a stream?',[
    'It returns true when at least one element satisfies the predicate and may short-circuit',
    'It returns true only when every element satisfies the predicate',
    'It transforms each element into a new element and returns another stream',
    'It counts the number of elements that satisfy the predicate'
  ],0,'anyMatch is a terminal boolean operation that can stop as soon as one element satisfies the predicate. allMatch and count provide different semantics.',['allMatch requires every element to satisfy the predicate.','map transforms elements and returns a stream.','count returns the number of stream elements, not a boolean.'],'The word any means at least one.'),
  Q('streams','hard','concept','What does findFirst return from a stream?',[
    'An Optional describing the first element in encounter order, or empty when there is none',
    'The first element wrapped in a new List regardless of whether the stream is empty',
    'A boolean stating whether any element passed a predicate',
    'A sorted copy of the entire stream in a new array'
  ],0,'findFirst is a short-circuiting terminal operation that returns Optional<T>. It respects encounter order when one is defined and returns Optional.empty for an empty stream.',['A List is not the return type.','anyMatch is the predicate-based boolean operation.','findFirst does not sort or return every element.'],'Think optional presence of one selected element.'),
  Q('datetime','medium','concept','Why does LocalDate.plusDays(1) return a new LocalDate instead of changing the original?',[
    'java.time date-time classes are immutable, so operations return a new value representing the adjusted date',
    'LocalDate objects are shared global constants and cannot be changed by any program',
    'The method is static and creates a date in another thread',
    'The operation always changes the default system time zone'
  ],0,'java.time types are immutable. plusDays computes and returns a new temporal value while the original object remains unchanged.',['LocalDate values are ordinary immutable objects, not only global constants.','plusDays is an instance operation and does not start another thread.','Date arithmetic does not change the system time zone.'],'Check whether the API is immutable or mutable.'),
  Q('concurrency','medium','concept','What additional locking behaviour does a synchronized static method use?',[
    'It synchronizes on the Class object associated with the declaring class',
    'It synchronizes on every instance of the class at the same time',
    'It synchronizes on the current thread object only',
    'It uses no monitor because static methods cannot be synchronized'
  ],0,'A synchronized instance method uses the receiver object as its monitor. A synchronized static method uses the Class object for the declaring class. These are distinct locks.',['A class lock is not every instance lock.','The monitor is the Class object, not Thread.currentThread().','Static methods may be synchronized.'],'Compare the receiver lock for instance methods with the Class lock for static methods.'),
  Q('concurrency','hard','concept','Why is synchronizing on a publicly accessible String literal usually a poor lock choice?',[
    'The string may be interned and shared unexpectedly, allowing unrelated code to contend for the same monitor',
    'String objects cannot be used as monitors in Java',
    'A synchronized block accepts only primitive values as lock objects',
    'The compiler automatically changes String locks to ReentrantLock instances'
  ],0,'String literals may be interned and shared. Synchronizing on a public or externally visible String can create accidental lock sharing and deadlock risks. Use a private final lock object when an explicit monitor is needed.',['Any object reference can be used as a monitor.','Primitives cannot be used as intrinsic monitor locks.','The compiler does not replace monitor locks with ReentrantLock.'],'Choose a private lock object whose identity is controlled by the class.'),
  Q('reflection','medium','concept','Which Class method reports the interfaces directly implemented by a class?',[
    'getInterfaces(), which returns Class objects for directly implemented interfaces',
    'getSuperclass(), which returns every interface in the inheritance hierarchy',
    'getDeclaredFields(), which returns the interface names as fields',
    'getPackageName(), which returns an array of interface types'
  ],0,'getInterfaces returns the interfaces directly implemented by the class or extended by the interface. getSuperclass returns the direct superclass.',['getSuperclass returns one superclass, not interfaces.','getDeclaredFields returns fields.','getPackageName returns a String.'],'The method name directly indicates the metadata being queried.'),
  Q('nodejs','medium','concept','What is the basic REPL interaction cycle?',[
    'Read an input expression, evaluate it, print the result and wait for the next input',
    'Compile a Java class, install it on a server and restart the JVM',
    'Read a file, encrypt it, store it in a database and terminate Node',
    'Resolve an HTTP request, render an HTML page and close the browser tab'
  ],0,'REPL stands for Read-Eval-Print Loop. It is an interactive environment for evaluating expressions and inspecting results one at a time.',['This describes a build/deployment workflow, not a REPL.','This is unrelated to the Node interactive prompt.','This describes a web request lifecycle rather than a REPL.'],'Expand the acronym REPL.'),
  Q('spring','medium','concept','Which Spring module area is most directly associated with web application support and Spring MVC?',[
    'The web module area, which provides web infrastructure and MVC support',
    'The core container only, which is responsible for browser DOM rendering',
    'The JVM bytecode module, which handles HTTP routing',
    'The Java compiler module, which resolves controller URLs'
  ],0,'Spring’s web modules support web applications, including the Spring MVC web framework. The core container manages objects and dependencies, while the JVM and compiler have different responsibilities.',['The core container does not render browser DOM.','The JVM does not provide Spring MVC HTTP routing.','javac does not resolve web URLs.'],'Connect Spring MVC to Spring’s web infrastructure modules.'),

];

export const practical = [
  Q('types-operators','medium','code','What is printed by the following Java 17 code?',[
    '12', '11', '13', '10'
  ],0,'The first operand a++ evaluates to 5 and then increments a to 6. The second operand ++a increments it to 7 and evaluates to 7. The sum is 12.',['11 would result from adding 5 and 6, but the second operand is pre-incremented.','13 treats the second operand as 8, which requires an extra increment.','10 ignores the incremented value of the second operand.'],'Trace the post-increment and pre-increment separately.','int a = 5;\nSystem.out.println(a++ + ++a);'),
  Q('types-operators','medium','code','Which numeric value does println display for result?',[
    '7.0', '8.0', '7.5', 'An ArithmeticException is thrown'
  ],0,'Both operands are int, so 15 / 2 uses integer division and yields 7. The result is then widened to double for assignment, so printing the value displays 7.0; this question’s options use the numeric value form.',['8 is rounding to the nearest integer, which integer division does not do.','7.5 would require floating-point division.','A nonzero integer divisor does not cause ArithmeticException.'],'Determine the arithmetic type before considering the result variable.','int total = 15;\ndouble result = total / 2;\nSystem.out.println(result);'),
  Q('types-operators','hard','code','What happens when this code executes?',[
    'It throws NullPointerException during unboxing of boxed',
    'It prints 0 because null wrappers unbox to their primitive default value',
    'It prints null because int can hold a null value',
    'It fails to compile because Java never permits Integer-to-int conversion'
  ],0,'The expression boxed.intValue() is effectively performed by unboxing. Because boxed is null, the conversion throws NullPointerException before value can be assigned.',['A null wrapper is not a primitive default value.','Primitive int cannot contain null.','Java supports automatic unboxing when the wrapper is non-null.'],'Find the exact moment where the wrapper must provide an int value.','Integer boxed = null;\nint value = boxed;\nSystem.out.println(value);'),
  Q('control-flow','basic','code','What is the output of the loop?',[
    '0 1 2 ', '1 2 3 ', '0 1 2 3 ', 'The loop never executes'
  ],0,'The loop begins with i = 0, tests i < 3, prints the current value and increments. It prints 0, 1 and 2, then stops when i becomes 3.',['The loop starts at zero, not one.','The condition excludes 3.','The initial condition 0 < 3 is true.'],'Track the initial value, condition and update in order.','for (int i = 0; i < 3; i++) {\n    System.out.print(i + " ");\n}'),
  Q('control-flow','medium','code','What is printed by this do-while loop?',[
    '1', '0', 'Nothing is printed', 'It loops forever'
  ],0,'A do-while loop executes its body before checking the condition. It increments n from 0 to 1 and prints 1; then n < 0 is false.',['The body changes n before printing it.','The body is executed once even though the condition is false afterward.','The condition becomes false after the first execution.'],'Remember that do-while checks at the end.','int n = 0;\ndo {\n    n++;\n} while (n < 0);\nSystem.out.println(n);'),
  Q('control-flow','medium','code','What output does the following loop produce?',[
    '1 3 ', '1 2 3 ', '2 ', '1 3 4 '
  ],0,'When i equals 2, continue skips the print statement for that iteration. The loop prints 1, then skips 2, then prints 3.',['The iteration with i = 2 is explicitly skipped.','2 is the value that is skipped, not printed.','The loop terminates at i = 3, so it cannot print 4.'],'Find which statement continue skips and where control resumes.','for (int i = 1; i <= 3; i++) {\n    if (i == 2) continue;\n    System.out.print(i + " ");\n}'),
  Q('arrays','basic','code','What does this code print?',[
    '0', 'null', '1', 'It throws NullPointerException'
  ],0,'A newly allocated int array initialises each element to the primitive default value 0. The array length is one, so values[0] is valid.',['null is the default for reference array elements, not int elements.','The length field is 1, but the element value is 0.','Reading a valid newly allocated int element does not throw NullPointerException.'],'Recall the default value for an int array element.','int[] values = new int[1];\nSystem.out.println(values[0]);'),
  Q('arrays','medium','code','What happens when the following statement executes?',[
    'ArrayIndexOutOfBoundsException is thrown because the only valid index is 0',
    'The value 0 is printed because arrays wrap invalid indexes',
    'The array automatically expands to include index 1',
    'The code fails to compile because the array length is not final'
  ],0,'An array created with length one has valid index range 0..0. Accessing index 1 is outside the array and throws ArrayIndexOutOfBoundsException at runtime.',['Java does not wrap array indexes.','Java arrays have fixed length after creation.','Array length being fixed does not make the code a compile-time error here.'],'For length n, the last valid index is n - 1.','int[] data = new int[1];\nSystem.out.println(data[1]);'),
  Q('arrays','hard','code','What is printed by this code with a jagged array?',[
    '2', '3', '1', 'NullPointerException'
  ],0,'The outer array contains two row references. The first row has length 2 and the second row has length 1. data[0].length therefore prints 2.',['The outer array length is 2, but that is not the expression being printed.','The second row has length 1; the first row has length 2.','The first row is initialised and non-null.'],'Read the selected row index before counting its elements.','int[][] data = new int[2][];\ndata[0] = new int[2];\ndata[1] = new int[1];\nSystem.out.println(data[0].length);'),
  Q('strings','medium','code','What value does the reference-identity comparison produce for these String variables?',[
    'false', 'true', 'Java', 'A compilation error occurs'
  ],0,'new String creates a distinct String object. The literal may refer to a pooled object, so the two references are not identical even though their contents are equal.',['Content equality does not imply reference identity.','The result of == is false for these separately created objects.','The expression prints a boolean, not the String contents.'],'Ask whether == compares content or object identity.','String first = new String("Java");\nString second = "Java";\nSystem.out.println(first == second);'),
  Q('strings','medium','code','What is printed after these statements?',[
    'Java', 'JAVA', 'java', 'An empty string'
  ],0,'String is immutable. toUpperCase returns a new String, but its result is ignored. The original variable continues to refer to "Java".',['The transformed result is not assigned back to the variable.','The original string remains unchanged.','toUpperCase does not convert the original object in place.'],'Check whether the method result is stored or used.','String word = "Java";\nword.toUpperCase();\nSystem.out.println(word);'),
  Q('strings','basic','code','What is printed by the StringBuilder code?',[
    'Java 17', 'Java', '17 Java', 'A new StringBuilder is created after each append'
  ],0,'append mutates the same StringBuilder. The second append adds a space followed by 17, so toString produces "Java 17".',['The second append is executed before conversion to String.','The builder is mutable; it does not retain only the first append.','append does not automatically create a new builder object.'],'Follow the mutation sequence on the same builder.','StringBuilder text = new StringBuilder("Java");\ntext.append(" 17");\nSystem.out.println(text);'),
  Q('methods-encapsulation','medium','code','What is printed after the method call?',[
    '4', '9', '0', 'The caller variable becomes null'
  ],0,'Java passes the reference value by value. The method parameter is reassigned to a new Box, but that does not change the caller’s variable. The original Box still contains 4.',['The caller reference is not reassigned, so the original object remains visible.','The new Box is created only in the method parameter after reassignment.','The caller variable is not modified to null.'],'Track the caller’s reference separately from the method parameter.','class Box { int value = 4; }\nstatic void change(Box b) { b = new Box(); b.value = 9; }\nBox box = new Box();\nchange(box);\nSystem.out.println(box.value);'),
  Q('methods-encapsulation','medium','code','Which overload is selected by this invocation?',[
    'The method with an int parameter, because an exact primitive match is available',
    'The method with a long parameter, because long is always preferred over int',
    'The method with a double parameter, because double has the widest numeric range',
    'The call is ambiguous because all three methods accept numeric values'
  ],0,'The argument expression is an int literal. The int overload is an exact match and is preferred over widening conversions to long or double.',['A widening conversion is unnecessary when an exact match exists.','A wider numeric type is not automatically preferred.','The exact match removes the ambiguity.'],'Check whether one overload matches the argument type exactly.','static void show(int x) { System.out.println("int"); }\nstatic void show(long x) { System.out.println("long"); }\nstatic void show(double x) { System.out.println("double"); }\nshow(5);'),
  Q('inheritance','medium','code','What is printed when run() is invoked through the Base reference?',[
    'Derived', 'Base', 'Object', 'The method call is rejected at compile time'
  ],0,'The declared type Base makes run() available at compile time. Because run() is overridden, runtime dynamic dispatch invokes Derived.run() for the actual Derived object.',['The Base implementation is overridden by the runtime class.','Object does not provide this application-specific run method.','The Base reference can call a method declared in Base.'],'Resolve member availability at compile time, then dispatch the override at runtime.','class Base { void run() { System.out.println("Base"); } }\nclass Derived extends Base { @Override void run() { System.out.println("Derived"); } }\nBase item = new Derived();\nitem.run();'),
  Q('polymorphism','hard','code','What is printed by the field and method accesses?',[
    'Base field, Derived method', 'Derived field, Derived method', 'Base field, Base method', 'Derived field, Base method'
  ],0,'Field access is resolved using the declared reference type Base, so item.name refers to Base.name. The overridden instance method is dynamically dispatched to Derived.show().',['The field is hidden rather than overridden, so Derived.name is not selected through Base.','The method call is dynamically dispatched, but the field is not.','Both results are not chosen solely from the declared type.'],'Remember the field-hiding versus method-overriding distinction.','class Base { String name = "Base field"; void show() { System.out.println("Base method"); } }\nclass Derived extends Base { String name = "Derived field"; @Override void show() { System.out.println("Derived method"); } }\nBase item = new Derived();\nSystem.out.println(item.name);\nitem.show();'),
  Q('exceptions','medium','code','Which catch block handles the exception from this statement?',[
    'The IOException catch block', 'The RuntimeException catch block', 'The NullPointerException catch block', 'No catch block can handle IOException'
  ],0,'FileNotFoundException extends IOException, so the IOException catch handles it. The runtime and null-pointer handlers are unrelated branches.',['IOException is the matching superclass for FileNotFoundException.','FileNotFoundException does not extend RuntimeException.','FileNotFoundException does not extend NullPointerException.'],'Follow the exception inheritance hierarchy.','try { throw new java.io.FileNotFoundException(); }\ncatch (java.io.IOException e) { System.out.println("IO"); }\ncatch (RuntimeException e) { System.out.println("Runtime"); }'),
  Q('exceptions','hard','code','What is the final value of result?',[
    '2', '1', '3', 'The method always throws because finally cannot complete normally'
  ],0,'The try block returns 1, but the finally block executes before the method completes and returns 2. A return in finally overrides the earlier return; this pattern is legal but strongly discouraged.',['The finally return replaces the earlier pending return value.','The finally block does not return 1.','The method completes with the finally return rather than throwing.'],'A return statement in finally can replace a pending return from try.','static int value() {\n    try { return 1; }\n    finally { return 2; }\n}\nint result = value();'),
  Q('exceptions','medium','code','What is printed when the resource is closed successfully?',[
    'closed', 'open', 'Nothing; close is never invoked automatically', 'The code does not compile because AutoCloseable cannot be used with try'
  ],0,'try-with-resources automatically invokes close() on a resource implementing AutoCloseable when control leaves the block. The resource is closed even when the block exits normally.',['The open method has no print statement, and close prints closed.','The close method is invoked automatically.','AutoCloseable is specifically supported by try-with-resources.'],'Look for the implicit close call at the end of the try block.','class Resource implements AutoCloseable {\n    public void close() { System.out.println("closed"); }\n}\ntry (Resource r = new Resource()) { }'),
  Q('enums-generics','medium','code','What is printed by this enum expression?',[
    'READY', '1', 'ready', 'The enum constant name is its ordinal number'
  ],0,'Enum.name() returns the exact declared constant identifier. ordinal() would return its zero-based position, but that method is not called.',['The output is the name rather than a numeric position.','No ordinal expression is used.','Enum names preserve the declared identifier casing.'],'Identify which enum method is invoked.','enum State { NEW, READY, DONE }\nSystem.out.println(State.READY.name());'),
  Q('functional','medium','code','What values are printed by the filter operation?',[
    '[4, 5, 6]', '[1, 2, 3]', '[2, 4, 6]', '[1, 3, 5]'
  ],0,'filter keeps elements for which the predicate is true. The predicate n > 3 retains 4, 5 and 6 in encounter order.',['These are the values that fail the predicate.','This would correspond to a different even-number predicate.','These are odd values and do not satisfy the condition.'],'A filter removes elements; it does not transform them.','List<Integer> values = List.of(1, 2, 3, 4, 5, 6);\nList<Integer> result = values.stream().filter(n -> n > 3).toList();\nSystem.out.println(result);'),
  Q('functional','hard','code','What does this lambda expression return for input 7?',[
    '14', '7', '49', 'true'
  ],0,'Function<Integer,Integer> represents a transformation. The lambda multiplies its input by two, so applying it to 7 returns 14.',['The lambda does not return the unchanged input.','The multiplication is by two, not by seven.','The result type is Integer, not boolean.'],'Read the expression after the arrow as the function body.','Function<Integer, Integer> twice = n -> n * 2;\nSystem.out.println(twice.apply(7));'),
  Q('collections','medium','code','What is the size of the HashSet after these additions?',[
    '2', '3', '1', 'HashSet preserves all three insertions as separate elements'
  ],0,'HashSet enforces uniqueness according to equals and hashCode. The two equal String values represent one set element, so the set contains "red" and "blue".',['The duplicate "red" is not stored twice.','The set contains two distinct values, not one.','Set semantics prevent duplicate equal values.'],'Count distinct values according to equality, not add calls.' ,'Set<String> colours = new HashSet<>();\ncolours.add("red");\ncolours.add("blue");\ncolours.add(new String("red"));\nSystem.out.println(colours.size());'),
  Q('collections','hard','code','What happens when this code removes an element from the list?',[
    'The iterator removes 2 safely and iteration can continue',
    'The list always throws ConcurrentModificationException on every iterator removal',
    'The loop removes 1 and 3 because remove() deletes the next element',
    'The code does not compile because Iterator has no remove method'
  ],0,'Iterator.remove() is the supported way to remove the current element during iteration for a modifiable collection. It updates the iterator’s expected modification state.',['Using the iterator’s own remove method is supported.','The iterator is specifically designed to support its remove operation where allowed.','remove() removes the last element returned by next(), not the next element.'],'Distinguish iterator.remove from list.remove performed outside the iterator.','List<Integer> values = new ArrayList<>(List.of(1, 2, 3));\nIterator<Integer> it = values.iterator();\nwhile (it.hasNext()) {\n    if (it.next() == 2) it.remove();\n}\nSystem.out.println(values);'),
  Q('streams','medium','code','How many elements reach the terminal count operation?',[
    '2', '3', '4', '0, because filter is lazy'
  ],0,'The pipeline keeps even values (2 and 4), then map doubles them. count is terminal and triggers evaluation. Two elements reach count.',['Only the two even elements pass filter.','Three source elements exist, but one is filtered out.','Four is the last mapped value, not the number of elements.'],'Count elements after filter, not before it.','long count = Stream.of(1, 2, 3, 4)\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * 2)\n    .count();\nSystem.out.println(count);'),
  Q('streams','hard','code','What is the result of flatMap for the given list of lists?',[
    '[a, b, c]', '[[a, b], [c]]', '[a, c]', 'A stream containing two Stream objects'
  ],0,'flatMap converts each inner list to a stream and flattens the nested streams into one sequence containing a, b and c.',['This is the original nested structure, which flatMap removes.','The value b is not filtered out by the pipeline.','flatMap produces the elements, not the stream objects themselves.'],'The key operation is flattening one level of nested sequences.','List<List<String>> groups = List.of(List.of("a", "b"), List.of("c"));\nList<String> all = groups.stream().flatMap(List::stream).toList();\nSystem.out.println(all);'),
  Q('streams','medium','code','What is printed by this stream pipeline?',[
    '10', '6', '4', 'The stream throws an exception because reduce cannot add integers'
  ],0,'The stream values are 2, 3 and 5. The reduction adds them, producing 10. The identity value 0 is the starting accumulator.',['6 omits the value 5.','4 omits the value 3 or miscalculates the total.','Integer addition is a standard reduction operation.'],'Add every stream element to the identity value.','int total = Stream.of(2, 3, 5).reduce(0, Integer::sum);\nSystem.out.println(total);'),
  Q('datetime','medium','code','What date is returned by this expression?',[
    '2024-03-01', '2024-02-29', '2024-03-02', 'The expression throws because February has no 29th day in a leap year'
  ],0,'2024 is a leap year, so February 29 exists. Adding one day to LocalDate.of(2024, 2, 29) produces March 1, 2024. LocalDate is immutable, and plusDays returns the new date.',['This is the starting date, not the result after plusDays(1).','One day after February 29 is March 1.','February 29 is valid in a leap year.'],'Check leap-year validity, then add one day.','LocalDate date = LocalDate.of(2024, 2, 29);\nSystem.out.println(date.plusDays(1));'),
  Q('concurrency','medium','code','What is the output of calling run() directly on this object?',[
    'main', 'worker', 'main and worker on separate threads', 'The JVM rejects direct invocation of run()'
  ],0,'Calling run() directly is a normal method invocation, so it executes on the current main thread. A new thread is created only by calling start().',['The run method body executes, but not on a new worker thread.','Only the current thread name is printed.','Direct method invocation is legal.'],'Compare the call site: run or start?','Thread task = new Thread(() -> System.out.println(Thread.currentThread().getName()));\ntask.run();'),
  Q('concurrency','hard','code','What is the most likely concurrency defect if two threads execute count++ repeatedly on the same unsynchronised shared int?',[
    'Lost updates can occur because increment is a read-modify-write sequence',
    'The counter is guaranteed to increase by exactly the total number of increments',
    'The JVM automatically converts the field to AtomicInteger when multiple threads access it',
    'Every increment creates a separate copy of the shared object'
  ],0,'count++ is not an atomic operation. Two threads can read the same old value and then both write the same incremented value, losing one update.',['Without coordination, updates can be lost.','The JVM does not implicitly provide atomicity for compound increments.','Primitive field access does not create a separate object per increment.'],'Break count++ into read, add and write steps.' ,'class Counter { int count; void increment() { count++; } }'),

  Q('types-operators','medium','code','What is printed by the wrapper comparison?',[
    'true, because boxing uses cached Integer instances for this value',
    'false, because every boxing operation must allocate a different Integer object',
    '127, because == returns the numeric value of the left wrapper',
    'A NullPointerException is thrown during comparison'
  ],0,'Java requires boxing conversions for certain small integral values to reuse cached wrapper instances; 127 is within the required Integer cache range. Therefore these references are identical in this case. For larger values, reference identity should not be used for numeric comparison.',['The language specifies caching for this range, so the references are identical here.','Boxing does not require a fresh instance for each conversion.','== between references yields a boolean identity result.'],'This value lies inside the mandatory Integer boxing cache range.','Integer left = 127;\nInteger right = 127;\nSystem.out.println(left == right);'),
  Q('types-operators','hard','code','What does the following expression print?',[
    'false', 'true', '1', 'A compile-time error occurs because booleans cannot use bitwise operators'
  ],0,'The left side of && is false, so Java short-circuits and does not evaluate the right side. The value remains false and the method call is skipped.',['The method call is not evaluated, so it cannot change the result.','The left operand is false, which determines the result of &&.','The expression is valid boolean syntax.'],'The left operand of && already determines the overall result.','static boolean check() { System.out.print("called"); return true; }\nSystem.out.println(false && check());'),
  Q('control-flow','medium','code','What is printed by this traditional switch statement?',[
    'BCD', 'B', 'BC', 'ABCD'
  ],0,'Execution starts at case 2 and falls through the subsequent case sections because there is no break between them. It prints B, C and D.',['A belongs to case 1, which is not selected.','There is no break after case 2 or 3, so later cases also execute.','The default section is reached after fall-through and prints D.'],'A colon-style switch can continue into following labels when no transfer exits it.','int n = 2;\nswitch (n) {\n  case 1: System.out.print("A");\n  case 2: System.out.print("B");\n  case 3: System.out.print("C");\n  default: System.out.print("D");\n}'),
  Q('arrays','medium','code','What is the content of copied after Arrays.copyOf runs?',[
    '[4, 8, 0, 0]', '[4, 8]', '[4, 8, 8, 8]', 'The copy operation throws because the new length is larger'
  ],0,'Arrays.copyOf creates a new array of the requested length. Existing elements are copied, and new int elements receive the default value 0.',['The requested length is 4, so the new array has two additional slots.','copyOf supports creating an array with a different length.','New primitive elements are default-initialised rather than copied from the last slot.'],'Compare the original length with the requested destination length.','int[] original = {4, 8};\nint[] copied = Arrays.copyOf(original, 4);\nSystem.out.println(Arrays.toString(copied));'),
  Q('arrays','hard','code','What is printed after modifying copy[0]?',[
    '1 9', '9 9', '1 2', 'The assignment is rejected because array clone is immutable'
  ],0,'clone creates a new array object. The primitive elements are copied, so changing copy[0] does not change original[0]. This is a shallow copy, which is sufficient to separate primitive elements.',['The original retains its initial first element.','Only the copy is modified.','The copy is mutable and its primitive slot can be assigned.'],'An array clone is a distinct array object even though it copies element values.','int[] original = {1, 2};\nint[] copy = original.clone();\ncopy[0] = 9;\nSystem.out.println(original[0] + " " + copy[0]);'),
  Q('methods-encapsulation','medium','code','Which line is printed first during construction of a Child object?',[
    'parent', 'child', 'main', 'The program does not compile because constructors are not inherited'
  ],0,'A Child constructor implicitly invokes super() first when no explicit constructor invocation appears. The Parent constructor therefore runs before the Child constructor body.',['The superclass constructor executes before the subclass constructor body.','The main method initiates construction, but its print statement is not shown.','Constructors are not inherited, but a subclass constructor still invokes a superclass constructor.'],'Follow the implicit super() call before the subclass constructor body.','class Parent { Parent() { System.out.println("parent"); } }\nclass Child extends Parent { Child() { System.out.println("child"); } }\nnew Child();'),
  Q('methods-encapsulation','hard','code','Which output occurs for the call made through reference a?',[
    'A', 'B', 'The call is dispatched to B at runtime', 'The code fails because static methods cannot be hidden'
  ],0,'The method is static, so the selected method is based on the compile-time reference type. The reference is declared as A, so A.say() is invoked even though the object is B.',['This is the compile-time reference type’s static method.','B.say hides A.say but does not override it dynamically.','Static method hiding is legal in Java.'],'Static methods are not dynamically dispatched like overridden instance methods.','class A { static void say() { System.out.println("A"); } }\nclass B extends A { static void say() { System.out.println("B"); } }\nA a = new B();\na.say();'),
  Q('polymorphism','medium','code','What is printed by the guarded downcast?',[
    'derived', 'base', 'false', 'ClassCastException is thrown before the if block'
  ],0,'The object is actually a Derived instance, so the instanceof test is true and the downcast is valid. The cast reference can invoke the Derived implementation.',['The runtime object is not merely a Base instance.','The instanceof test evaluates to true.','The cast is valid for this runtime object.'],'Check the actual object created by new before evaluating instanceof.','class Base { }\nclass Derived extends Base { void show() { System.out.println("derived"); } }\nBase value = new Derived();\nif (value instanceof Derived) ((Derived) value).show();'),
  Q('polymorphism','hard','code','What is the result of calling pick(null) when the class declares pick(String) and pick(Integer)?',[
    'The call is ambiguous at compile time because null matches both unrelated reference types',
    'The String overload is always selected because String is more common',
    'The Integer overload is always selected because it is a wrapper type',
    'A NullPointerException is thrown while the compiler selects the overload'
  ],0,'The null literal can be converted to either String or Integer. Neither type is more specific than the other, so overload resolution cannot choose one and the call is ambiguous.',['No rule makes String universally preferred over Integer.','Integer is not a subtype of String and vice versa.','Ambiguity is detected at compile time, before execution.'],'The two parameter types are unrelated reference types.' ,'static void pick(String value) { }\nstatic void pick(Integer value) { }\npick(null);'),
  Q('exceptions','hard','code','What happens when this pair of catch clauses appears in the same try statement?',[
    'Compilation fails because the later IOException catch is unreachable after the broader Exception catch',
    'The first catch handles only checked exceptions and the second catches runtime exceptions',
    'The compiler automatically swaps the catch clauses into a legal order',
    'Both catch blocks execute for every thrown IOException'
  ],0,'IOException extends Exception. Once the first catch handles Exception, the later IOException clause can never be selected and is therefore unreachable. Specific catches must precede broader superclass catches.',['Exception is broader than IOException.','The compiler does not reorder catch clauses.','Only one matching catch clause is selected.'],'Check the inheritance direction: IOException is a subtype of Exception.','try { work(); }\ncatch (Exception e) { handleAll(e); }\ncatch (IOException e) { handleIo(e); }'),
  Q('exceptions','medium','code','What does this try-with-resources block do when it exits normally?',[
    'It closes the resources automatically in reverse declaration order',
    'It closes the resources in the same order in which they were declared',
    'It leaves resources open unless close() is called manually',
    'It closes only the last declared resource and ignores earlier resources'
  ],0,'Java closes AutoCloseable resources automatically when the block exits. If multiple resources are declared, they are closed in reverse order of declaration.',['The language specifies reverse-order closing.','Manual close is not required for resources in the header.','All declared resources are closed.'],'Think of stack-like unwinding: the most recently declared resource closes first.','try (A first = new A(); B second = new B()) {\n    work();\n}'),
  Q('functional','medium','code','What is the result of composing these Function objects?',[
    '12', '9', '10', '21'
  ],0,'andThen applies the first function and then the next one. The input 5 is increased by 1 to 6, then multiplied by 2 to produce 12.',['The second function is applied after the first, not before it.','The first function changes 5 to 6; the second maps 6 to 12.','21 reverses or changes the arithmetic order.'],'Read andThen from left to right.','Function<Integer, Integer> addOne = n -> n + 1;\nFunction<Integer, Integer> doubleIt = n -> n * 2;\nSystem.out.println(addOne.andThen(doubleIt).apply(5));'),
  Q('collections','medium','code','What list remains after removeIf executes?',[
    '[1, 3, 5]', '[2, 4]', '[1, 2, 3, 4, 5]', '[]'
  ],0,'removeIf removes every element for which the supplied predicate is true. The predicate n % 2 == 0 removes even values, leaving 1, 3 and 5.',['This is the set of elements removed, not the remaining list.','The even values satisfy the removal predicate.','The list is modified by removeIf.'],'Read the predicate from the perspective of removal.' ,'List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5));\nnumbers.removeIf(n -> n % 2 == 0);\nSystem.out.println(numbers);'),
  Q('collections','hard','code','What does this map lookup return?',[
    'the value associated with key "b", namely 20',
    'the second key in insertion order, namely "b"',
    'null, because HashMap does not support String keys',
    'the number of entries currently stored in the map'
  ],0,'Map.get(key) returns the value mapped to the specified key. In this example, key "b" maps to integer 20. HashMap supports String keys.',['get returns the mapped value rather than the key.','HashMap supports arbitrary non-null object keys, including String.','size() returns the number of mappings.'],'Look at the method name and the mapping represented by the key.','Map<String, Integer> scores = new HashMap<>();\nscores.put("a", 10);\nscores.put("b", 20);\nSystem.out.println(scores.get("b"));'),
  Q('streams','medium','code','What is the result after sorted().limit(2) is applied to the stream?',[
    '[1, 2]', '[3, 1]', '[1, 2, 3]', '[2, 3]'
  ],0,'sorted uses natural ascending order for these integers, producing 1, 2, 3. limit(2) keeps the first two values, so the result is [1, 2].',['This is the original encounter order before sorting.','limit(2) restricts output to two elements.','The smallest two values are 1 and 2.'],'Apply sorted first, then limit.' ,'List<Integer> result = Stream.of(3, 1, 2).sorted().limit(2).toList();\nSystem.out.println(result);'),
  Q('streams','medium','code','What value does the primitive stream pipeline produce?',[
    '10', '4', '24', 'It returns a Stream<Integer> rather than a number'
  ],0,'mapToInt converts each element to an int stream. sum is a terminal reduction and adds 1 + 2 + 3 + 4 to produce 10.',['4 is the number of elements, not the sum.','24 is not the sum of the stream values.','sum returns a primitive int rather than another stream.'],'Add the mapped primitive values, not the number of elements.','int sum = List.of("1", "2", "3", "4").stream()\n    .mapToInt(Integer::parseInt)\n    .sum();\nSystem.out.println(sum);'),
  Q('datetime','medium','code','What does the expression Period.between(start, end).getDays() return for these dates?',[
    '1, the day component of the calendar period between the dates',
    '29, the total number of elapsed days between the dates',
    '30, because every month is treated as 30 days',
    'A value in seconds because Period stores time-of-day'
  ],0,'The period from 2024-01-31 to 2024-03-01 is represented as one month and one day according to calendar period decomposition. getDays returns the day component, 1, not the total elapsed day count.',['The method returns the days component, not total days.','Calendar months do not have a fixed 30-day length.','Period is date-based, not seconds-based.'],'getDays returns the component of the Period, not its total duration.','LocalDate start = LocalDate.of(2024, 1, 31);\nLocalDate end = LocalDate.of(2024, 3, 1);\nSystem.out.println(Period.between(start, end).getDays());'),
  Q('concurrency','hard','code','What exception results if start() is invoked a second time on the same Thread instance after its first start?',[
    'IllegalThreadStateException', 'InterruptedException', 'ConcurrentModificationException', 'ClassCastException'
  ],0,'A Thread object can be started only once. Calling start again after it has been started or terminated throws IllegalThreadStateException.',['InterruptedException relates to interruptible waiting methods.','ConcurrentModificationException relates to fail-fast collection iteration.','ClassCastException relates to invalid runtime reference casts.'],'A Thread instance has a one-time NEW-to-started lifecycle.' ,'Thread worker = new Thread(() -> { });\nworker.start();\nworker.join();\nworker.start();'),
  Q('concurrency','medium','code','What happens when the main thread calls worker.join() after starting worker?',[
    'The main thread waits until worker terminates, then continues',
    'The worker waits until the main thread terminates',
    'The worker starts again after the main thread has joined it',
    'Both threads are permanently blocked from acquiring monitors'
  ],0,'join is invoked on the target Thread object. The calling thread waits for that target thread to terminate, subject to a possible timeout for timed join.',['The caller, main, waits for worker.','join does not restart a thread.','join does not lock every monitor.'],'Identify which thread invokes join and which thread is the target.','Thread worker = new Thread(() -> doWork());\nworker.start();\nworker.join();\nSystem.out.println("main continues");'),
  Q('reflection','medium','code','Which name is returned by getSimpleName for the declared class CustomerRecord?',[
    'CustomerRecord', 'com.example.CustomerRecord', 'CustomerRecord.class', 'The fully qualified JVM descriptor'
  ],0,'getSimpleName returns the simple source-level name without the package. getName returns the binary name, usually including the package.',['The package is omitted by getSimpleName.','The fully qualified name is closer to getName for a top-level class.','A class literal syntax is not a returned class name.'],'Distinguish simple name from binary or fully qualified name.' ,'class CustomerRecord { }\nSystem.out.println(CustomerRecord.class.getSimpleName());'),
];

export const extension = [
  Q('jvm','medium','concept','What is the purpose of a Java classpath in a traditional class-based application?',[
    'It tells the launcher and class loader where to locate user classes and libraries',
    'It selects the garbage collector and heap size for every JVM process',
    'It controls the order in which Java statements execute inside a method',
    'It stores compiled machine instructions inside the CPU cache'
  ],0,'The classpath identifies locations such as directories and JAR files from which classes and resources can be found. It is separate from runtime memory and scheduling options.',['Heap and collector settings are configured with JVM options, not the classpath.','Control flow is defined by program statements and language semantics.','The classpath does not manage CPU caches.'],'Think about class and resource discovery at launch/runtime.'),
  Q('jvm','hard','concept','What is the main goal of garbage collection in a managed Java runtime?',[
    'Reclaim heap memory occupied by objects that are no longer reachable from live roots',
    'Delete every object immediately after its constructor finishes',
    'Free local variables from a thread stack while the method is still executing',
    'Guarantee that application code never retains an object longer than necessary'
  ],0,'Garbage collectors reclaim memory for unreachable heap objects. Reachability is determined from roots such as active stack references, static references and runtime references. GC does not guarantee that logically unwanted but reachable objects are reclaimed.',['Objects can remain alive after construction if reachable.','Local variable frames are managed through method execution, not ordinary heap garbage collection.','A memory leak can occur when an application unintentionally keeps references.'],'Focus on reachability rather than whether the program still wants an object.'),
  Q('types-operators','medium','concept','What does the Java var keyword mean when used for a local variable declaration?',[
    'The compiler infers the local variable’s static type from its initializer; the variable remains statically typed',
    'The variable can change its type whenever a new value is assigned',
    'The variable becomes an untyped dynamic object stored in the heap',
    'The variable is implicitly declared as Object regardless of its initializer'
  ],0,'var enables local-variable type inference. The compiler determines one static type from the initializer, and later assignments must be compatible with that type.',['Java does not make var variables dynamically typed.','The compiler infers a concrete static type rather than an untyped object.','The type is not always Object; it is inferred from the initializer.'],'Type inference is a compile-time feature, not dynamic typing.'),
  Q('inheritance','medium','concept','What is the purpose of a Java record?',[
    'To declare a compact data-carrier class with generated component fields, accessors and value-oriented methods',
    'To declare a thread-safe mutable database table that can be edited without methods',
    'To replace interfaces with multiple class inheritance',
    'To store arbitrary binary files inside a JVM class loader'
  ],0,'Records are concise data-carrier classes. The compiler generates component fields, accessors, canonical constructor and value-oriented equals, hashCode and toString methods. Records are shallowly immutable: referenced objects may still be mutable.',['A record is a Java type declaration, not a database table.','Records do not introduce multiple class inheritance.','Class loaders load classes and resources, not record-managed binary files.'],'Think of records as concise nominal data carriers.'),
  Q('inheritance','hard','concept','What is the purpose of a sealed class in Java 17?',[
    'To restrict which classes or interfaces may directly extend or implement it',
    'To make every instance deeply immutable regardless of its fields',
    'To prevent all methods from being overridden in every subclass',
    'To allow a class to extend several unrelated superclasses'
  ],0,'A sealed type controls its direct permitted subtypes using permits (or same-file inference in applicable cases). It helps model closed type hierarchies.',['Sealed does not imply deep immutability.','Permitted subclasses can still override methods unless other rules prevent it.','Java still allows only one direct superclass.'],'The key word is restriction of the permitted subtype set.'),
  Q('enums-generics','hard','concept','What does the PECS guideline recommend for generic wildcards?',[
    'Use extends when a parameter produces values for the caller and super when it consumes values from the caller',
    'Use super for every producer and extends for every consumer',
    'Avoid wildcards because they always disable compile-time type checking',
    'Use an unbounded wildcard whenever a collection must accept arbitrary writes'
  ],0,'PECS means Producer Extends, Consumer Super. A ? extends T source is useful for reading T values, while ? super T can accept T values for writing. Neither form is universally writable/readable in the same way.',['This reverses the mnemonic.','Wildcards preserve type safety; they do not disable it.','An unbounded wildcard generally does not allow adding arbitrary non-null values.'],'Ask whether the generic parameter produces values or consumes them.'),
  Q('enums-generics','medium','concept','What is a common reason to use Optional<T> as a method return type?',[
    'To make the possible absence of a result explicit in the method’s return contract',
    'To allow the method to return two unrelated objects at the same time',
    'To guarantee that a value is never null anywhere in the application',
    'To replace every collection and array in the Java language'
  ],0,'Optional represents either a present value or an empty result and can make absence explicit at an API boundary. It does not eliminate all nulls or replace collections.',['Optional contains at most one value, not a pair of unrelated results.','Other APIs and variables can still use null.','Collections and arrays remain important data structures.'],'Think about optional presence rather than multiple values or universal null elimination.'),
  Q('packages','medium','concept','What is the main purpose of the Java Platform Module System introduced in Java 9?',[
    'To define named modules with explicit dependencies and controlled package exposure',
    'To replace all Java packages with operating-system processes',
    'To guarantee that every class is loaded into a separate JVM',
    'To make import declarations automatically download dependencies from Maven Central'
  ],0,'The module system adds explicit module boundaries, dependency declarations and exported packages. It complements packages and classpath-based applications.',['Modules are not operating-system processes.','Classes within a module still run in a JVM process.','Dependency downloads are a build-tool responsibility.'],'Look for stronger encapsulation and dependency declarations.'),
  Q('packages','hard','concept','What is the key difference between a JAR and a Java module?',[
    'A JAR is an archive format; a module is a logical unit with defined dependencies and package boundaries',
    'A JAR is a JVM instruction set; a module is a Java primitive type',
    'A JAR can contain only one class, while a module can contain unlimited operating-system processes',
    'A module is always a compressed file and a JAR is always a source-code directory'
  ],0,'A JAR packages files and classes. A module describes a named unit with dependencies and exposed packages; a modular JAR may include module-info.class.',['Neither term describes an instruction set or primitive type.','A JAR can contain many classes and resources.','A module is a logical runtime unit and may be packaged in a JAR.'],'Separate physical archive packaging from logical module boundaries.'),
  Q('arrays','medium','concept','Why can Arrays.asList(array) be surprising when array is a String[]?',[
    'It returns a fixed-size list backed by the array, so element replacement is visible but size-changing operations are unsupported',
    'It always returns a deep copy that can grow and shrink independently',
    'It converts every String into a character array and stores each character as an element',
    'It returns an immutable List.of result regardless of the input array'
  ],0,'Arrays.asList creates a fixed-size list backed by the supplied array. set is supported and affects the array, while add/remove are unsupported.',['The list is backed by the array rather than an independent growable copy.','The elements remain String values; the method does not split them into characters.','Arrays.asList and List.of have different behaviours.'],'Distinguish a fixed-size view backed by an array from an independent growable list.'),
  Q('strings','medium','concept','What is the purpose of String.intern()?',[
    'It returns the canonical pooled representation for an equal string value',
    'It permanently locks the string so no thread can read it',
    'It converts the string into a primitive char value',
    'It guarantees that every string comparison in the program uses == safely'
  ],0,'intern returns a canonical representation from the string pool for equal content. It should not replace equals as the general content-comparison method.',['Interning is unrelated to locking or synchronisation.','A String remains a reference type; intern does not produce a char.','Not all strings are automatically interned, and == is not a general content test.'],'Think canonicalisation of equal string values.'),
  Q('methods-encapsulation','hard','concept','What is a covariant return type in method overriding?',[
    'An overriding method may return a subtype of the return type declared by the overridden method',
    'An overriding method may return any unrelated type if the method name is unchanged',
    'An overriding method may change a primitive return type from int to long',
    'An overloaded method may omit its return type to inherit the parent return value'
  ],0,'Java permits an overriding reference-returning method to narrow its return type to a subtype. This is a covariant return type and preserves substitutability.',['The return type must be compatible, not arbitrary.','Primitive return types do not support covariant narrowing.','Every method declaration must have a return type or void; constructors are different.'],'Look for a more specific reference type, not an unrelated one.'),
  Q('methods-encapsulation','medium','concept','Why should a public API generally avoid exposing a mutable internal collection directly?',[
    'Callers could modify internal state without the class enforcing its invariants',
    'A returned collection can never be iterated by external code',
    'Java automatically serialises every returned collection into a database table',
    'Public collections prevent the JVM from performing garbage collection'
  ],0,'Returning an internal mutable collection exposes the object’s representation. Callers can add, remove or replace elements unexpectedly. Defensive copies or unmodifiable views may be more appropriate depending on the API.',['External code can iterate a collection.','Returning a collection does not automatically persist it.','Garbage collection is not disabled by public collection access.'],'Consider what an external caller can mutate through the returned reference.'),
  Q('exceptions','medium','concept','What is the purpose of a suppressed exception?',[
    'It preserves an additional failure that occurred while another exception was already being propagated',
    'It permanently disables an exception class in the JVM',
    'It converts a checked exception into a return value automatically',
    'It prevents a finally block from executing'
  ],0,'Suppressed exceptions retain secondary failures, commonly from closing AutoCloseable resources when a primary exception is already in flight. They can be inspected through getSuppressed().',['Suppression preserves a secondary failure; it does not disable exception classes.','The caller still handles or propagates the primary exception.','Suppression does not control whether finally runs.'],'Think of a secondary failure that should not replace the primary one.'),
  Q('functional','medium','concept','What is a method reference in Java?',[
    'A compact syntax that refers to an existing method or constructor where a functional interface target supplies the invocation shape',
    'A reflection object that can invoke any private method without access checks',
    'A variable that stores the source-code line number of a method',
    'A special kind of annotation that changes method bytecode at compile time'
  ],0,'Method references such as String::trim or System.out::println are compact functional-interface implementations when a compatible target type is known. They do not inherently bypass access checks.',['A method reference is not the same as a reflective Method object.','It does not store line-number metadata.','Method references are expressions, not annotations.'],'Think of it as shorthand for a lambda that delegates to an existing method.'),
  Q('collections','hard','concept','Why must objects used as HashMap keys have a stable equals/hashCode relationship while stored in the map?',[
    'Changing equality- or hash-relevant state can make an entry difficult to find in the bucket where it was placed',
    'HashMap recomputes the entire hash table on every get call and ignores key equality',
    'HashMap uses object identity only and never calls equals or hashCode',
    'A key’s hash code must be globally unique across every Java process'
  ],0,'HashMap uses hashCode to select a bucket and equals to distinguish keys. Mutating fields that influence these methods after insertion can make lookup fail or behave unexpectedly.',['HashMap does not rebuild the whole table on every lookup.','HashMap uses both hashCode and equals for normal key semantics.','Hash codes are not required to be globally unique.'],'Consider what happens if a key’s hash changes after insertion.'),
  Q('collections','medium','concept','What is the primary difference between Collections.unmodifiableList(list) and List.copyOf(list)?',[
    'unmodifiableList is an unmodifiable view of the supplied list, while copyOf creates an unmodifiable list snapshot of the elements',
    'Both always return a mutable deep copy of every nested object',
    'List.copyOf permits add and remove, while unmodifiableList blocks only sorting',
    'unmodifiableList deep-clones every element, while copyOf keeps the original list mutable through the wrapper'
  ],0,'An unmodifiable view reflects changes made through the underlying list reference. List.copyOf creates an unmodifiable list containing the input elements at the time of the call. Neither operation deep-copies mutable element objects.',['Neither operation performs a deep copy of nested objects.','Both returned lists are unmodifiable.','The deep-copy and mutability descriptions are reversed or inaccurate.'],'Distinguish a live view from an unmodifiable snapshot of list membership.'),
  Q('streams','hard','concept','Why is mutating shared external state inside a parallel stream operation risky?',[
    'Multiple workers may update the same state concurrently, creating races and nondeterministic results',
    'Parallel streams execute every lambda exactly once in source order on the main thread',
    'A stream automatically synchronizes every variable captured by a lambda',
    'The terminal operation disables all intermediate operations when shared state is detected'
  ],0,'Parallel pipelines may execute actions on multiple threads. Shared mutable state requires appropriate coordination; stateless operations and proper reductions are safer.',['Parallel execution does not guarantee one thread or encounter-order side effects.','Captured variables are not automatically synchronized.','The stream API does not detect and disable every unsafe side effect.'],'Ask whether two workers can mutate the same object at the same time.'),
  Q('streams','medium','concept','Which statement about parallel streams is most accurate?',[
    'They can improve throughput for suitable workloads, but overhead and ordering costs can make them slower',
    'They are always faster than sequential streams regardless of input size',
    'They guarantee deterministic side-effect order for every terminal operation',
    'They remove the need for thread-safety in any object used by the pipeline'
  ],0,'Parallel streams can help with sufficiently large, decomposable workloads, but splitting, coordination, ordering and contention have costs. Correctness still depends on safe operations.',['Parallelism is not a universal speed guarantee.','Side-effect ordering is not generally guaranteed for parallel execution.','Shared state still needs safe coordination.'],'Performance depends on workload shape and pipeline semantics.'),
  Q('datetime','hard','concept','Why should a server store a globally meaningful event timestamp as Instant rather than LocalDateTime?',[
    'Instant represents a point on the UTC timeline and is not ambiguous due to a missing time-zone offset',
    'LocalDateTime automatically includes the server’s current time zone and UTC offset',
    'Instant stores a calendar month but not a clock time',
    'LocalDateTime can represent only dates before 1970'
  ],0,'Instant models a unique point on the UTC timeline. LocalDateTime has no zone or offset, so the same local wall time can correspond to different instants in different zones or around daylight-saving transitions.',['LocalDateTime deliberately contains no zone/offset.','Instant represents a moment, not a calendar month.','LocalDateTime has no 1970 boundary.'],'Think about whether the value must identify one global moment.'),
  Q('concurrency','hard','concept','What is the purpose of the volatile keyword on a shared field?',[
    'It provides visibility and ordering guarantees for reads and writes to that variable, but does not make compound updates atomic',
    'It makes all operations on the object graph atomic and mutually exclusive',
    'It prevents the field from being read by any thread except the writer',
    'It automatically starts a dedicated thread whenever the field changes'
  ],0,'volatile establishes visibility and happens-before guarantees for writes and subsequent reads of the same variable. It does not make compound operations such as count++ atomic.',['volatile does not provide mutual exclusion for arbitrary operations.','Other threads can read a volatile field.','volatile does not create event-driven threads.'],'Separate visibility of a value from atomicity of a multi-step update.'),
  Q('concurrency','medium','concept','What is a deadlock?',[
    'A situation where threads wait indefinitely for resources held by one another so none can proceed',
    'A thread that is temporarily sleeping for a fixed number of milliseconds',
    'A thread that completes its run method normally',
    'A collection iterator that detects a structural modification'
  ],0,'Deadlock commonly arises from cyclic lock dependencies. Each thread holds a resource while waiting for another resource that cannot be released.',['Sleeping is a timed waiting state, not necessarily a deadlock.','Normal thread completion is termination, not deadlock.','ConcurrentModificationException is unrelated to lock cycles.'],'Look for a circular wait among threads and locks.'),
  Q('concurrency','hard','concept','Which approach most directly reduces deadlock risk when multiple locks must be acquired?',[
    'Use a consistent global lock acquisition order in every code path',
    'Acquire locks in random order so no thread can predict another thread',
    'Hold each lock permanently so that other threads cannot acquire it in a different order',
    'Catch every RuntimeException and retry the lock acquisition without a limit'
  ],0,'Consistent lock ordering prevents cycles in the lock-wait graph when all code follows the same order. Other approaches include timeouts and reducing nested lock usage.',['Random order can create cycles more readily.','Permanent locks can block the application.','Unbounded retries can cause livelock and do not guarantee deadlock avoidance.'],'Prevent circular wait by enforcing an acquisition order.'),
  Q('reflection','hard','concept','What is the difference between Class.getMethods() and Class.getDeclaredMethods()?',[
    'getMethods returns public methods including inherited public methods; getDeclaredMethods returns methods declared directly by the class at all access levels',
    'getMethods returns private fields; getDeclaredMethods returns public constructors',
    'Both return identical arrays but in different alphabetical orders',
    'getDeclaredMethods returns only methods inherited from Object'
  ],0,'The methods differ in both visibility and inheritance scope. getMethods returns public methods, including inherited ones; getDeclaredMethods returns methods declared in that class regardless of access, but not inherited methods.',['These methods retrieve method metadata, not fields or constructors.','They differ in scope and visibility, not merely ordering.','Declared methods are those on the class itself, not only those inherited from Object.'],'Look at the words public and declared in the method names.'),
  Q('nodejs','medium','concept','Which API is normally available in Node.js but not as a standard browser global?',[
    'The Node.js process object, which exposes information and control related to the current process',
    'The document object, which represents the browser page DOM',
    'The window object, which represents a browser window',
    'The location object, which exposes the current browser URL'
  ],0,'Node.js exposes process as a runtime global. document, window and browser location APIs are provided by browsers, not by the standard Node.js runtime.',['document is a browser DOM API, not a default Node global.','window is a browser global; Node.js does not provide the browser window.','location is associated with browser navigation APIs.'],'Identify the runtime environment-specific API.'),
  Q('spring','medium','concept','What is the typical purpose of Spring AOP?',[
    'To modularise cross-cutting concerns such as logging, security checks or transaction boundaries around method execution',
    'To replace the JVM garbage collector with an application-level object cache',
    'To create HTML pages by compiling Java classes into CSS',
    'To replace all application interfaces with database tables'
  ],0,'Aspect-oriented programming separates cross-cutting concerns from business logic. Spring AOP commonly applies advice at method-execution join points through proxies.',['AOP does not replace garbage collection.','HTML and CSS generation is not the purpose of Spring AOP.','Interfaces and database tables are different abstractions.'],'Look for behaviour applied across many components, such as transactions or logging.'),
  Q('spring','hard','concept','What is the main benefit of Spring constructor injection compared with field injection?',[
    'Required dependencies are explicit, can be final, and are easy to provide in unit tests without container reflection',
    'The component can be constructed without any dependencies even when they are required',
    'The constructor is automatically invoked on every HTTP request',
    'Constructor injection disables the Spring container and creates a global singleton'
  ],0,'Constructor injection makes dependencies visible in the type’s public construction contract. It supports final fields and straightforward unit testing with direct instantiation.',['Required dependencies are still needed; injection does not remove them.','A bean is normally created by the container according to its scope, not per request unless configured.','Constructor injection is a form of container-managed injection, not a container bypass.'],'Think about compile-time visibility and testability of required collaborators.'),
  Q('spring','medium','concept','What is a Spring bean?',[
    'An object managed by the Spring IoC container, including its creation and configured lifecycle',
    'Any Java object allocated with new, even if Spring never manages or knows about it',
    'A compiled .class file stored inside a JAR archive',
    'A database row that must always have a primary key named bean_id'
  ],0,'A Spring bean is an object instantiated, assembled and otherwise managed by the Spring container. Not every object in a Spring application is automatically a bean.',['An arbitrary object is not a Spring bean unless managed by the container.','A class file is metadata/bytecode, not a managed object.','The term bean is not a database-row convention.'],'Focus on container-managed objects.'),
  Q('spring','hard','concept','What is the purpose of @Transactional in Spring applications?',[
    'To declare that a method or class should execute within transaction management rules configured by Spring',
    'To guarantee that all method calls execute on a separate thread',
    'To automatically convert every checked exception into a successful return value',
    'To generate a database schema from every Java field without persistence configuration'
  ],0,'@Transactional marks transaction boundaries. Spring’s transaction infrastructure uses a configured transaction manager and typically proxy-based interception to begin, commit or roll back transactions according to rules.',['Transactions and thread creation are separate concerns.','Transactional handling does not convert exceptions into successful return values.','Schema generation depends on persistence configuration, not this annotation alone.'],'Think atomic commit/rollback boundaries around data operations.'),

  Q('enums-generics','medium','concept','What is a prepared statement in JDBC primarily used for?',[
    'To execute parameterised SQL while separating SQL structure from supplied values',
    'To store a Java class in the JVM method area before it is loaded',
    'To create a new operating-system process for every database row',
    'To convert every SQL query into a Java Stream automatically'
  ],0,'PreparedStatement represents a precompiled or parameterised SQL statement. Bound parameters are supplied separately, improving clarity and helping prevent SQL injection when used correctly.',['Prepared statements are a JDBC database access feature.','They do not manage JVM class metadata or processes.','JDBC does not automatically translate every query into a Stream.'],'The key distinction is binding values separately from SQL text.'),
  Q('enums-generics','medium','concept','Why is PreparedStatement generally safer than building SQL by concatenating untrusted user input?',[
    'Bound parameters are treated as data values rather than executable SQL syntax',
    'It encrypts the entire database connection using a fixed secret key',
    'It prevents all database users from reading returned rows',
    'It removes the need to validate data types and business rules'
  ],0,'Parameter binding keeps supplied values separate from SQL syntax, preventing input from changing the statement structure in common injection scenarios. Validation remains necessary for business rules.',['PreparedStatement does not by itself guarantee transport encryption.','It does not change database authorisation or visibility.','Input validation and business rules are still important.'],'Look for separation between SQL code and user-supplied values.'),
  Q('packages','medium','concept','What is the purpose of java.nio.file.Path?',[
    'To represent a filesystem path in a provider-independent way for file-system operations',
    'To represent a Java thread’s execution path through bytecode instructions',
    'To represent a network route between two IP addresses only',
    'To represent a sequence of method calls stored in a stack trace'
  ],0,'Path represents a path in a filesystem and is used with the Files API for operations such as reading, writing, copying and checking attributes. It is not limited to one operating system path syntax.',['Thread execution is not represented by java.nio.file.Path.','Network routing is not the class’s purpose.','Stack traces are represented by StackTraceElement and related APIs.'],'Think filesystem navigation and the java.nio.file package.'),
  Q('packages','hard','concept','What is a major advantage of try-with-resources when working with file or database resources?',[
    'It ensures AutoCloseable resources are closed as control leaves the block, even when an exception occurs',
    'It guarantees that every I/O operation succeeds without throwing an exception',
    'It permanently caches every opened file descriptor to avoid repeated system calls',
    'It converts checked I/O exceptions into unchecked exceptions automatically'
  ],0,'try-with-resources gives deterministic resource cleanup for AutoCloseable resources. It does not guarantee successful I/O or change checked-exception rules.',['I/O can still fail and throw exceptions.','Resources are closed rather than permanently cached.','Checked exceptions still need to be caught or declared.'],'Focus on deterministic cleanup rather than successful I/O.'),
  Q('basics','medium','concept','What is a Java annotation used for?',[
    'To attach structured metadata to declarations for compilers, tools or runtime frameworks',
    'To execute a method automatically every time a class is imported',
    'To replace every access modifier with a runtime security policy',
    'To define a new primitive type that can store arbitrary objects'
  ],0,'Annotations provide metadata that can be processed at source, compile or runtime. Their effect depends on annotation retention and the tool or framework that reads them.',['Importing a class does not automatically execute annotated methods.','Annotations do not replace Java access modifiers.','Annotations do not define primitive data types.'],'Think metadata that can be consumed by tools or frameworks.'),
  Q('basics','hard','concept','What does RetentionPolicy.RUNTIME allow for an annotation?',[
    'The annotation is retained in class metadata and can be inspected through reflection at runtime',
    'The annotation is removed before bytecode is generated',
    'The annotation is stored only in source comments and ignored by the compiler',
    'The annotation is automatically converted into a Spring bean'
  ],0,'RUNTIME retention makes the annotation available to runtime reflection. SOURCE retention is discarded by the compiler, while CLASS is retained in the class file but not necessarily exposed by runtime reflection.',['RUNTIME annotations are not discarded before class-file generation.','Annotations are language metadata, not ordinary comments.','Retention does not automatically register the annotated class as a bean.'],'Compare SOURCE, CLASS and RUNTIME retention.'),
  Q('basics','medium','concept','What is the main role of a unit-testing framework such as JUnit?',[
    'To organise and run automated tests that verify small units of application behaviour',
    'To compile a Java application into a native operating-system kernel',
    'To manage the JVM heap and schedule garbage collection cycles',
    'To provide a database schema migration engine by itself'
  ],0,'JUnit provides a programming model and runner/platform for automated tests. It can verify behaviour through assertions and lifecycle methods, but it does not replace the compiler or database migration tools.',['JUnit is not an operating-system kernel compiler.','Heap management remains a JVM responsibility.','Database migrations are usually managed by dedicated tools such as Flyway or Liquibase.'],'Think automated verification of expected behaviour.'),
  Q('packages','medium','concept','What is Maven’s primary role in a Java project?',[
    'To manage project builds, dependencies, plugins and lifecycle phases through a declarative project model',
    'To provide the Java runtime engine that executes bytecode',
    'To replace Java packages with a global registry of object instances',
    'To serve HTTP requests from Spring MVC controllers'
  ],0,'Maven is a build and dependency-management tool. Its POM describes project metadata, dependencies, plugins and build configuration; its lifecycle defines standard phases.',['The JVM executes bytecode.','Packages remain a Java language namespace feature.','A web server/framework serves HTTP requests.'],'Look for dependency resolution and build lifecycle management.'),
  Q('packages','medium','concept','What is Gradle commonly used for in Java development?',[
    'A flexible build automation system that declares tasks and manages dependencies',
    'A JVM garbage collector that compacts the old generation',
    'A Java primitive type that stores build timestamps',
    'A browser runtime for executing JavaScript modules'
  ],0,'Gradle automates compilation, testing, packaging and other build tasks. Build logic can be written using Groovy or Kotlin DSLs.',['Garbage collectors are JVM components, not build tools.','Gradle is not a Java type.','Node.js and browsers execute JavaScript.'],'Think build tasks and dependency resolution.'),
  Q('concurrency','medium','concept','What is the primary purpose of ExecutorService?',[
    'To manage task execution using a pool or other execution policy and provide lifecycle controls',
    'To define the inheritance rules for Java interfaces',
    'To make every method in a class synchronized automatically',
    'To parse Java source files into an abstract syntax tree'
  ],0,'ExecutorService separates task submission from thread management. It supports task execution, shutdown and Future-based tracking, reducing the need to manage raw Thread objects directly.',['Inheritance is handled by the Java type system.','ExecutorService does not synchronize every method.','Parsing source is a compiler/tooling task.'],'Think task submission and thread-pool lifecycle.'),
  Q('concurrency','medium','concept','What is the difference between Callable<V> and Runnable?',[
    'Callable returns a result and may throw checked exceptions; Runnable returns no result',
    'Runnable returns a result while Callable can only signal completion',
    'Callable must extend Thread while Runnable must extend Object directly',
    'They are identical except that Callable can be used only with GUI applications'
  ],0,'Callable<V> has call() that returns V and may throw Exception. Runnable has run() returning void. ExecutorService can submit either, with Callable submissions typically producing a Future result.',['This reverses their return-value behaviour.','Neither interface requires extending Thread.','They are general task abstractions, not GUI-only.'],'Compare their single abstract method signatures.'),
  Q('concurrency','hard','concept','What does Future.get() do when called before the associated task has completed?',[
    'It waits for completion and then returns the result or throws an exception describing task failure',
    'It immediately returns null without waiting for the task',
    'It starts the task a second time to obtain a second result',
    'It cancels the task and returns its thread identifier'
  ],0,'Future represents a pending or completed asynchronous result. get waits until the result is available, subject to interruption or execution failure.',['get does not return a default null just because work is pending.','Future.get does not restart the task.','Cancellation is a separate operation and Future does not return a thread ID.'],'Think of get as retrieving a result that may not be ready yet.'),
  Q('concurrency','hard','concept','What is the main benefit of AtomicInteger compared with an ordinary shared int for incrementing a counter?',[
    'It provides atomic operations such as incrementAndGet without requiring the caller to use a synchronized block',
    'It makes every operation on every field of the containing object atomic',
    'It guarantees that increments are executed in a specific order across different JVM processes',
    'It prevents the counter from ever overflowing its int range'
  ],0,'AtomicInteger provides atomic read-modify-write operations using low-level concurrency primitives. It protects that variable’s operations, not arbitrary state, and it still has the int range.',['AtomicInteger does not make unrelated object fields atomic.','Atomicity is within the relevant process/runtime memory model, not a cross-process ordering guarantee.','An int can still overflow according to integer arithmetic rules.'],'Focus on atomic compound updates to one variable.'),
  Q('concurrency','medium','concept','Why use ConcurrentHashMap in a multithreaded application?',[
    'It supports concurrent retrievals and updates with thread-safe operations designed for concurrent access',
    'It sorts keys lexicographically and forbids null values only to save memory',
    'It makes all mutable objects stored as values automatically thread-safe',
    'It guarantees that iteration observes one globally locked snapshot of every value'
  ],0,'ConcurrentHashMap supports safe concurrent access and scalable updates. Its values may still be mutable and need their own coordination; iteration is weakly consistent rather than a global locked snapshot.',['It does not promise sorted iteration.','Thread-safe map operations do not make arbitrary value objects thread-safe.','Its iterators do not represent a fully locked snapshot.'],'Separate map-level concurrency from the thread safety of stored values.'),
  Q('jvm','hard','concept','What is a Java class loader responsible for?',[
    'Loading class definitions into the JVM when they are needed and participating in class identity and delegation',
    'Executing every method body directly as a database transaction',
    'Converting Java objects to source files each time a method is called',
    'Assigning a unique operating-system process to each Java class'
  ],0,'Class loaders locate and define classes. Class identity depends on both the binary name and the defining class loader, and delegation helps maintain platform class loading rules.',['Class loading and transaction management are separate concerns.','The JVM executes methods; it does not decompile objects for every call.','Classes share a JVM process rather than receiving one process each.'],'Think discovery and definition of classes in the runtime.'),
  Q('jvm','medium','concept','What is a common cause of a memory leak in a Java application despite automatic garbage collection?',[
    'The application retains references to objects that are no longer logically needed, keeping them reachable',
    'The garbage collector fails to detect every object created with new',
    'Every String object is permanently stored in the string pool',
    'The JVM automatically converts all local variables into static fields'
  ],0,'Garbage collection reclaims unreachable objects, not objects that an application has forgotten logically but still references through caches, listeners, collections or static fields.',['The collector uses reachability; it is not expected to reclaim reachable objects.','Not every String is interned permanently.','Local variables are not automatically converted into static fields.'],'Ask whether an unwanted object is still reachable from a GC root.'),
  Q('spring','medium','concept','What is the purpose of @RestController in Spring MVC?',[
    'It combines controller semantics with response-body handling so methods commonly return data directly for message conversion',
    'It declares a class as a Java record that cannot have methods',
    'It forces every endpoint to render a server-side JSP view',
    'It configures a database transaction manager without any other settings'
  ],0,'@RestController is a composed annotation equivalent to @Controller plus @ResponseBody. Return values are handled through HTTP message converters rather than resolved as view names by default.',['It does not make a class a record.','It commonly returns response bodies rather than requiring JSP views.','Transaction management is a separate concern.'],'Think HTTP response body rather than view-name resolution.'),
  Q('spring','hard','concept','What is the key distinction between Spring Framework and Spring Data JPA?',[
    'Spring Framework provides core application infrastructure; Spring Data JPA adds repository abstractions for JPA-based data access',
    'Spring Data JPA is a Java compiler, while Spring Framework is a JVM implementation',
    'Spring Framework manages only HTML templates, while Spring Data JPA manages Java threads',
    'They are two names for the same Spring module and have identical responsibilities'
  ],0,'Spring Framework provides core IoC, AOP, web and other infrastructure. Spring Data JPA builds on JPA and Spring Data repository abstractions to reduce repetitive persistence code.',['Neither is a Java compiler or JVM.','These responsibilities are incorrectly assigned.','They are related but distinct projects with different roles.'],'Separate core application infrastructure from the persistence abstraction layer.'),

];

// Reserve the expert tier for nuanced language/runtime behaviour and non-trivial trade-offs.
// These seed positions are stable; append future questions instead of reordering existing entries.
const expertPositions = {
  core: [40, 53, 79, 102, 118, 126],
  practical: [38],
  extension: [17, 23, 40],
};
for (const [bankName, positions] of Object.entries(expertPositions)) {
  const bank = { core, practical, extension }[bankName];
  for (const position of positions) {
    if (bank[position]) bank[position].difficulty = 'expert';
  }
}
