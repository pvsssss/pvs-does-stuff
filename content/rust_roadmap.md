---
title: Rust
draft: true
description:
tags:
  - example-tag
---
# Rust Mastery Roadmap — 5–6 Months
> Target: B.Tech CSE, CachyOS, Python-intermediate, zero systems/low-level background.

---

## PHASE 0 — Pre-flight (Week 0, ~3 days)

---

### * Toolchain & Environment Setup
- **what**: Install Rust via `rustup`, configure `cargo`, set up a capable editor (VSCode + `rust-analyzer`, or Zed which you already use), and understand the Rust release channels.
- **why**: A broken or misconfigured environment kills momentum. `rustup` manages multiple toolchain versions (stable/nightly) and cross-compilation targets — understanding it early prevents confusion later.
- **how to start**: Open terminal → `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` → choose stable. Verify with `rustc --version` and `cargo --version`.
- **what questions to ask**:
  - What is the difference between `rustc`, `cargo`, and `rustup`?
  - What does a `Cargo.toml` file represent versus a `Cargo.lock`?
  - What is `rust-analyzer` doing that a regular LSP doesn't?
  - Why does Rust have stable/beta/nightly channels?
  - What is a compilation target triple (e.g., `x86_64-unknown-linux-gnu`)?
- **standard resources**:
  - *blogs/articles*: [The Rust Book — Ch.1](https://doc.rust-lang.org/book/ch01-00-getting-started.html), [rustup docs](https://rust-lang.github.io/rustup/)
  - *papers*: N/A at this stage
  - *books*: *The Rust Programming Language* (aka "The Book") — Ch. 1
  - *youtube playlists*: "Rust Crash Course" — Let's Get Rusty (YouTube)
- **how to get started immediately**: Run `cargo new hello_rust`, open `src/main.rs`, change the print statement, run `cargo run`. Done in 5 minutes.
- **outcomes**:
  - *first pass*: `rustup` installed, `cargo new` works, `cargo run` outputs to terminal, `rust-analyzer` shows completions in editor.
  - *second pass*: Understand `cargo build --release` vs debug, know where compiled binaries land (`target/`), configure `rust-analyzer` with inlay hints enabled.
  - *final pass*: Comfortable navigating `rustup target list`, adding components (`cargo add`, `clippy`, `rustfmt`), understanding that `Cargo.lock` should be committed for binaries and ignored for libraries.
- **what I can generate from this**:
  - Blog post: "Setting up a Rust dev environment on CachyOS in 2024"
  - Dotfiles/config snippet for Zed Rust tasks
  - README template for future Rust projects

---

## PHASE 1 — Language Foundations (Weeks 1–4)

---

### * Variables, Mutability, Primitive Types, and Control Flow
- **what**: Rust's type system, scalar/compound types, `let` bindings, `mut`, shadowing, `if`/`loop`/`while`/`for`, ranges, and `match` as a control primitive.
- **why**: Before ownership makes sense, you need fluency with how Rust expresses computation. Rust is expression-based (not statement-based like Python) — this changes how you write code.
- **how to start**: Read The Book Ch. 3. Write the same Python programs (FizzBuzz, factorial, sum of array) in Rust from memory.
- **what questions to ask**:
  - Why does Rust have both `let` shadowing and `mut` — what problem does each solve?
  - What is the difference between `i32`, `i64`, `u8`, `usize`? When do you reach for each?
  - Why are `if` and `match` expressions (they return values) rather than statements?
  - What happens at the machine level when you shadow a variable?
  - Why does Rust not have implicit type coercion (e.g., int → float)?
- **standard resources**:
  - *blogs/articles*: [Rust By Example — Variables](https://doc.rust-lang.org/rust-by-example/variable_bindings.html)
  - *books*: The Book Ch. 3, 5
  - *youtube*: Let's Get Rusty — "Variables & Data Types"
- **how to get started immediately**: Implement FizzBuzz using `match` instead of `if/else`. Then rewrite it using a `for` loop over a range. Time yourself.
- **outcomes**:
  - *first pass*: Can write simple arithmetic, loops, conditions without compiler errors.
  - *second pass*: Uses `match` naturally, understands expression-returns, uses ranges correctly.
  - *third pass*: Confident with integer overflow behavior (debug vs release), understands `usize` for indexing, uses `_` for unused variables without warnings.
- **what I can generate**:
  - "Rust vs Python: Syntax Rosetta Stone" cheatsheet
  - Anki deck for Rust type sizes and operators

---

### * Ownership — The Core Mental Model
- **what**: Rust's ownership system: every value has one owner, values are dropped when owner goes out of scope, values can be moved or copied.
- **why**: This is the single biggest conceptual hurdle. It replaces garbage collection and manual `malloc/free` with compile-time guarantees. Until this clicks, nothing else will.
- **how to start**: Read The Book Ch. 4.1. Deliberately write code that triggers ownership errors, read the error messages carefully. The compiler is your teacher here.
- **what questions to ask**:
  - What physically happens when a value is "moved"? What changes in memory?
  - Why do types like `i32` implement `Copy` but `String` does not?
  - What does "dropped" mean — what code does the compiler generate?
  - How is ownership different from Python's reference counting (CPython)?
  - What is a "move" at the assembly level?
- **standard resources**:
  - *blogs/articles*: [Visualizing Memory Layout of Rust's Data Types](https://cheats.rs/#memory-layout), [Jon Gjengset — "Crust of Rust: Ownership"](https://www.youtube.com/watch?v=8M0QfLUDaaA)
  - *books*: The Book Ch. 4, *Programming Rust* (Blandy & Orendorff) Ch. 4
  - *youtube*: "Rust Ownership Explained" — Doug Milford
- **how to get started immediately**: Write a function that takes a `String`, call it twice, observe the compiler error. Then fix it three ways: clone, reference, return ownership back.
- **outcomes**:
  - *first pass*: Can explain ownership in one sentence. Knows the "one owner" rule.
  - *second pass*: Understands move semantics vs copy semantics. Can identify which types are `Copy`.
  - *third pass*: Can predict compiler errors before running code. Knows what `Drop` does and when it's called.
  - *final pass*: Can draw a stack/heap diagram for any given Rust snippet. Understands `std::mem::drop` and why it exists.
- **what I can generate**:
  - Visual diagram: "Stack vs Heap in Rust — a Python programmer's guide"
  - Blog post: "Why Rust's ownership model is the hardest and most important thing you'll learn"

---

### * Borrowing, References, and Slices
- **what**: Shared references (`&T`), mutable references (`&mut T`), the borrow rules (many readers OR one writer), slices (`&[T]`, `&str`).
- **why**: Borrowing lets you use data without taking ownership — essential for writing real functions. Slices are how you work with contiguous memory regions without copying.
- **how to start**: The Book Ch. 4.2–4.3. Write a function that takes `&str` instead of `String` and understand why it's more flexible.
- **what questions to ask**:
  - Why can you have many `&T` references but only one `&mut T`?
  - What is a dangling reference and how does Rust prevent it?
  - What is the difference between `String`, `&String`, and `&str`?
  - What is a fat pointer, and why does a slice (`&[T]`) require one?
  - How does NLL (Non-Lexical Lifetimes) change borrow checking vs old Rust?
- **standard resources**:
  - *blogs/articles*: [Common Rust Lifetime Misconceptions](https://github.com/pretzelhammer/rust-blog/blob/master/posts/common-rust-lifetime-misconceptions.md)
  - *books*: The Book Ch. 4, *Programming Rust* Ch. 5
  - *youtube*: "Rust References and Borrowing" — Let's Get Rusty
- **how to get started immediately**: Write `fn first_word(s: &str) -> &str` that returns the first word of a string. Deliberately trigger a dangling reference compiler error, then fix it.
- **outcomes**:
  - *first pass*: Understands `&` vs `&mut`. Can write functions that borrow instead of taking ownership.
  - *second pass*: Comfortable with string slices. Can index into arrays/vecs using slices.
  - *third pass*: Understands that borrow rules enforce data race freedom at compile time.
- **what I can generate**:
  - Visual: "Reference rules as a traffic light" diagram
  - Cheatsheet: `String` vs `&str` vs `&String` — when to use which

---

### * Structs, Methods, and Associated Functions
- **what**: Defining custom data types with `struct`, implementing methods with `impl`, associated functions (constructors like `::new()`), and tuple structs.
- **why**: This is how you build domain models. Rust's `impl` blocks are where behavior lives — unlike Python classes, data and behavior are intentionally separate.
- **how to start**: The Book Ch. 5. Model something from your daily life (e.g., a `Course` with grade tracking) as a struct.
- **what questions to ask**:
  - What is the difference between a method (`self`) and an associated function (no `self`)?
  - How does `&self` vs `&mut self` vs `self` in method signatures map to borrow rules?
  - What is a unit struct and what is it used for?
  - How does Rust's `derive` macro work conceptually (e.g., `#[derive(Debug)]`)?
- **standard resources**:
  - *books*: The Book Ch. 5, *Programming Rust* Ch. 9
  - *blogs*: Rust By Example — Structs
- **how to get started immediately**: Create a `Rectangle` struct with `width` and `height`. Implement `area()`, `perimeter()`, and `is_square()`. Derive `Debug` and print it.
- **outcomes**:
  - *first pass*: Can define a struct and implement basic methods.
  - *second pass*: Uses `Self` as a return type, understands `::new()` pattern.
  - *third pass*: Comfortable with field shorthand init, struct update syntax (`..other`), and knows when to use tuple structs vs named structs.
- **what I can generate**:
  - Notes: "Python class → Rust struct translation guide"

---

### * Enums and Pattern Matching
- **what**: Algebraic data types with `enum`, `Option<T>`, `Result<T, E>`, exhaustive `match`, `if let`, `while let`, destructuring.
- **why**: Rust's enums are not C-style enums — they carry data. `Option` replaces `null`. `Result` replaces exceptions. These two types are in nearly every line of real Rust code.
- **how to start**: The Book Ch. 6. Implement a simple state machine (e.g., traffic light) using an enum with `match`.
- **what questions to ask**:
  - How is `Option<T>` safer than `null` in Python/C?
  - What does it mean for `match` to be exhaustive?
  - How does `if let` relate to `match` — when would you use one over the other?
  - What is the memory layout of an enum variant that holds data?
  - What's the difference between `unwrap()`, `expect()`, `?`, and proper match handling?
- **standard resources**:
  - *blogs*: [Rust Enums Are Better Than Most](https://www.shuttle.rs/blog/2023/11/23/enums-in-rust)
  - *books*: The Book Ch. 6, *Programming Rust* Ch. 10
  - *youtube*: "Rust Enums & Pattern Matching" — Let's Get Rusty
- **how to get started immediately**: Write a function that parses a `&str` to an `i32`, returning `Option<i32>`. Then call it and handle both cases with `match`. Rewrite using `if let`.
- **outcomes**:
  - *first pass*: Can define enums, write exhaustive `match` arms.
  - *second pass*: Comfortable with `Option` and `Result`, uses `?` operator.
  - *third pass*: Uses `match` guards, binding with `@`, nested destructuring.
  - *final pass*: Can design a type-safe state machine using enums.
- **what I can generate**:
  - "Option vs Result: Rust's error philosophy" blog post
  - Cheatsheet: Pattern matching syntax quick reference

---

## PHASE 2 — Core Language Mastery (Weeks 5–9)

---

### * Error Handling in Depth
- **what**: The `Result<T, E>` type, `?` operator, creating custom error types, `thiserror` crate, `anyhow` crate, when to use each strategy.
- **why**: Real programs fail. Rust forces you to handle errors explicitly — this produces more robust code than exception-based languages. Learning idiomatic error handling is what separates beginner from intermediate Rust.
- **how to start**: The Book Ch. 9. Write a program that reads a file, parses numbers from it, and sums them — handling every possible failure point.
- **what questions to ask**:
  - Why does Rust use `Result` instead of exceptions?
  - What does `?` desugar to?
  - When should you use `thiserror` vs `anyhow`?
  - What is the cost of `Box<dyn Error>` vs a concrete error type?
  - What does it mean for error types to implement `From<E>`?
- **standard resources**:
  - *blogs*: [Error Handling in Rust — A Deep Dive](https://www.lpalmieri.com/posts/error-handling-rust/), Nick Cameron's "Error Handling" post
  - *books*: The Book Ch. 9, *Zero to Production in Rust* (Palmieri) — error handling sections
  - *crates*: `thiserror`, `anyhow`
- **how to get started immediately**: Take your file-reading code using `unwrap()` everywhere. Refactor it step-by-step: first to `match`, then to `?`, then to a custom error enum with `thiserror`.
- **outcomes**:
  - *first pass*: Uses `?` correctly. Knows `unwrap()` is a panic, not error handling.
  - *second pass*: Defines custom error types with `thiserror`. Understands `From` impls.
  - *third pass*: Chooses appropriately between `anyhow` (applications) and `thiserror` (libraries).
- **what I can generate**:
  - Decision flowchart: "Which error handling strategy should I use?"
  - Blog: "Python exceptions vs Rust Result — a mental model shift"

---

### * Traits and Generics
- **what**: Defining shared behavior with `trait`, implementing traits for types, generic functions and structs, trait bounds (`T: Display + Clone`), `impl Trait` syntax, `where` clauses.
- **why**: Traits are Rust's answer to interfaces, abstract base classes, and duck typing — but resolved at compile time with zero runtime cost. Generics let you write code that works for many types without sacrificing performance.
- **how to start**: The Book Ch. 10. Implement a `Summary` trait for two different structs and write a generic function that accepts anything implementing it.
- **what questions to ask**:
  - How are Rust traits different from Python's duck typing or abstract base classes?
  - What is monomorphization and why does it matter for performance?
  - What is the difference between `impl Trait` (static dispatch) and `dyn Trait` (dynamic dispatch)?
  - When would you reach for a trait object (`Box<dyn Trait>`) over a generic?
  - What is coherence / the orphan rule, and why does it exist?
- **standard resources**:
  - *blogs*: [Rust Traits: A Deep Dive](https://oswalt.dev/2021/06/polymorphism-in-rust/), [dyn vs impl Trait](https://www.ncameron.org/blog/dyn-trait-and-impl-trait-in-rust/)
  - *books*: The Book Ch. 10, *Programming Rust* Ch. 11
  - *youtube*: Jon Gjengset — "Crust of Rust: Traits and Trait Objects"
- **how to get started immediately**: Write a generic `largest<T: PartialOrd>(list: &[T]) -> &T` function. Then write a `Drawable` trait with a `draw(&self)` method and implement it for `Circle` and `Square`. Compare static vs dynamic dispatch.
- **outcomes**:
  - *first pass*: Can define and implement a trait. Writes a basic generic function.
  - *second pass*: Uses trait bounds correctly. Understands `impl Trait` in function signatures.
  - *third pass*: Knows when to use `dyn Trait`. Uses standard traits (`Display`, `Debug`, `Clone`, `Iterator`).
  - *final pass*: Implements `Display`, `From`, `Into`, `Iterator` for own types. Understands blanket implementations.
- **what I can generate**:
  - Trait implementation cheatsheet (standard library traits)
  - Visual: "Static vs Dynamic dispatch — the vtable diagram"

---

### * Lifetimes
- **what**: Lifetime annotations (`'a`), lifetime elision rules, lifetime bounds on structs and functions, the `'static` lifetime, and relationship to borrow checking.
- **why**: Lifetimes make explicit what the borrow checker already knows implicitly. You only need to annotate them when the compiler can't infer — but understanding them fully is required for writing library code and anything that stores references.
- **how to start**: The Book Ch. 10.3. Write a function that takes two string slices and returns the longer one — observe where lifetime annotation is required and why.
- **what questions to ask**:
  - What does a lifetime annotation actually mean — does it change runtime behavior?
  - What are the three lifetime elision rules?
  - What is `'static` — is it always valid for the entire program duration?
  - Why can't a struct hold a reference without a lifetime annotation?
  - What is the relationship between lifetimes and ownership?
- **standard resources**:
  - *blogs*: [Rust Lifetime Misconceptions (pretzelhammer)](https://github.com/pretzelhammer/rust-blog/blob/master/posts/common-rust-lifetime-misconceptions.md) — essential reading
  - *books*: The Book Ch. 10.3, *Programming Rust* Ch. 5
  - *youtube*: Jon Gjengset — "Crust of Rust: Lifetime Annotations"
- **how to get started immediately**: Write a struct `Important<'a> { part: &'a str }` that holds a reference to a string slice. Write a method that returns a reference and annotate its lifetime.
- **outcomes**:
  - *first pass*: Understands what lifetime annotations communicate. Can annotate the `longest()` function correctly.
  - *second pass*: Writes structs that hold references with proper lifetime annotations.
  - *third pass*: Knows the elision rules and when annotation is required. Understands `'static`.
  - *final pass*: Uses Higher-Ranked Trait Bounds (`for<'a>`), understands lifetime variance (covariant/contravariant/invariant) conceptually.
- **what I can generate**:
  - Visual: "Lifetime scopes as nested boxes" diagram
  - "Lifetime annotations: the annotated annotation guide" reference card

---

### * Collections and Iterators
- **what**: `Vec<T>`, `HashMap<K, V>`, `HashSet<T>`, `BTreeMap`, `VecDeque`; the `Iterator` trait, iterator adaptors (`map`, `filter`, `fold`, `flat_map`, `chain`, `zip`), consuming adaptors (`collect`, `sum`, `count`), lazy evaluation.
- **why**: Iterators in Rust are zero-cost abstractions — they compile down to the same machine code as a hand-written loop. The iterator API is expressive, composable, and used everywhere in idiomatic Rust.
- **how to start**: The Book Ch. 8 & 13. Rewrite Python list comprehensions as Rust iterator chains.
- **what questions to ask**:
  - How does lazy evaluation work in Rust iterators? When is computation actually performed?
  - What is the difference between `iter()`, `iter_mut()`, and `into_iter()`?
  - How does `collect()` know what type to produce?
  - What does implementing `Iterator` require — just `next()`?
  - When would you use a `for` loop vs an iterator chain?
- **standard resources**:
  - *blogs*: [Rust Iterator Cheat Sheet](https://danielkeep.github.io/itercheat_baked.html)
  - *books*: The Book Ch. 13, *Programming Rust* Ch. 15
  - *youtube*: "Rust Iterators Beyond the Basics" — Jon Gjengset
- **how to get started immediately**: Take a Python list comprehension: `[x*x for x in range(10) if x % 2 == 0]`. Translate it to Rust using `.map()`, `.filter()`, `.collect()`. Then implement your own `Counter` struct that implements `Iterator`.
- **outcomes**:
  - *first pass*: Can use `map`, `filter`, `collect`, `sum` on vectors.
  - *second pass*: Understands lazy evaluation. Uses `chain`, `zip`, `enumerate`, `flat_map`.
  - *third pass*: Implements `Iterator` for a custom type. Uses `fold` to build reductions.
  - *final pass*: Writes custom iterator adaptors. Understands `IntoIterator` and `FromIterator`.
- **what I can generate**:
  - "Python comprehensions → Rust iterators" translation table
  - Iterator adaptor reference poster (Catppuccin Mocha themed)

---

### * Closures
- **what**: Anonymous functions, closure capture mechanics (`move`, capturing by reference vs value), `Fn`/`FnMut`/`FnOnce` trait bounds, closures as function arguments and return values.
- **why**: Closures power iterators, callbacks, and lazy evaluation. Understanding the three `Fn` traits is needed to write and use higher-order functions correctly.
- **how to start**: The Book Ch. 13.1. Write a closure that captures a variable from its environment, use it with `map` on a vector, observe what `move` does.
- **what questions to ask**:
  - What determines whether a closure implements `Fn`, `FnMut`, or `FnOnce`?
  - What does `move` do to a closure's capture — and what problem does it solve?
  - How is a closure's memory layout different from a function pointer?
  - Why can't you always return a closure from a function with a concrete type?
- **standard resources**:
  - *blogs*: [Finding Closure in Rust](https://huonw.github.io/blog/2015/05/finding-closure-in-rust/)
  - *books*: The Book Ch. 13, *Programming Rust* Ch. 14
- **how to get started immediately**: Write a function `apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32`. Test it with a closure that doubles its input. Then use `move` to capture a multiplier from the environment.
- **outcomes**:
  - *first pass*: Can write and pass closures. Uses them with iterators.
  - *second pass*: Understands the three `Fn` traits and when each applies.
  - *third pass*: Uses `move` closures correctly (e.g., in threads). Returns closures using `impl Fn`.
- **what I can generate**:
  - "Fn, FnMut, FnOnce: decision tree" diagram

---

## PHASE 3 — Memory, Smart Pointers, and the Type System (Weeks 10–14)

---

### * The Stack, the Heap, and Memory Layout
- **what**: What lives on the stack vs heap, how Rust's types map to memory, size of types (`std::mem::size_of`), alignment, padding, `Box<T>` as heap allocation.
- **why**: This is the conceptual bridge between Python (everything is a heap object with a reference count) and Rust (stack-first, explicit heap allocation). Without this mental model, smart pointers won't make sense.
- **how to start**: Write a program that uses `std::mem::size_of::<T>()` on various types. Draw the memory layout on paper. Read about how Python objects are laid out vs Rust.
- **what questions to ask**:
  - What is the stack pointer and how does it move on function calls/returns?
  - Why is stack allocation faster than heap allocation?
  - What does `Box<T>` actually do at the machine level?
  - What is the size of `Option<&T>` and why? (null pointer optimization)
  - How does Rust know the size of all types at compile time?
- **standard resources**:
  - *blogs*: [Visualizing Memory Layout of Rust's Data Types — cheats.rs](https://cheats.rs/#memory-layout), [Rust Memory Container Cheat-Sheet](https://github.com/usagi/rust-memory-container-cs)
  - *books*: *Programming Rust* Ch. 4, *Rust for Rustaceans* (Gjengset) Ch. 1
  - *youtube*: "Rust Memory, Lifetimes, and the Borrow Checker" — Systems with JT
- **how to get started immediately**: Probe sizes: `size_of::<i32>()`, `size_of::<Option<i32>>()`, `size_of::<Option<&i32>>()`, `size_of::<String>()`. Explain each result. Then make a recursive type fail to compile and fix it with `Box`.
- **outcomes**:
  - *first pass*: Knows what lives on stack vs heap for basic Rust types.
  - *second pass*: Can use `std::mem::size_of` and `align_of`. Understands `Box<T>`.
  - *third pass*: Understands null pointer optimization. Can explain fat pointers.
  - *final pass*: Can reason about struct layout, padding, `#[repr(C)]` vs `#[repr(packed)]`.
- **what I can generate**:
  - Memory layout diagram library for common Rust types
  - "Python object model vs Rust type model" explainer

---

### * Smart Pointers
- **what**: `Box<T>`, `Rc<T>`, `Arc<T>`, `RefCell<T>`, `Mutex<T>`, `Cell<T>`, interior mutability pattern, `Deref` and `Drop` traits.
- **why**: Smart pointers are how Rust handles cases where single ownership is too restrictive — shared ownership (`Rc`/`Arc`), runtime borrow checking (`RefCell`), thread-safe sharing (`Arc<Mutex<T>>`). These patterns are everywhere in real Rust.
- **how to start**: The Book Ch. 15. Build a simple linked list using `Box<T>`, then try shared ownership with `Rc<T>`.
- **what questions to ask**:
  - What does implementing `Deref` enable — why is it called "deref coercion"?
  - What is the runtime cost of `Rc<T>` vs `Arc<T>`?
  - Why does `RefCell<T>` exist — what rule does it relax and at what cost?
  - What is an `Rc` cycle and how does it cause a memory leak? How do `Weak<T>` references fix this?
  - When do you reach for `Mutex<T>` vs `RwLock<T>`?
- **standard resources**:
  - *blogs*: [Too Many Linked Lists (learning.rs)](https://rust-unofficial.github.io/too-many-lists/) — a classic
  - *books*: The Book Ch. 15, *Programming Rust* Ch. 22, *Rust for Rustaceans* Ch. 1
  - *youtube*: Jon Gjengset — "Crust of Rust: Smart Pointers and Interior Mutability"
- **how to get started immediately**: Read *Too Many Linked Lists* — implement at least the first two list variants. The exercise will force you through `Box`, ownership, and `Option` in a real data structure context.
- **outcomes**:
  - *first pass*: Can use `Box<T>` to allocate on heap, make recursive types.
  - *second pass*: Uses `Rc<T>` for shared ownership. Understands `Rc<RefCell<T>>` pattern.
  - *third pass*: Uses `Arc<Mutex<T>>` for thread-safe shared state.
  - *final pass*: Implements `Deref` and `Drop` for a custom smart pointer. Understands `Cow<T>`.
- **what I can generate**:
  - "Which smart pointer?" decision tree
  - Blog: "Building a linked list in Rust — why it's harder than you think"

---

### * Modules, Crates, and the Cargo Ecosystem
- **what**: Module system (`mod`, `use`, `pub`, `pub(crate)`), crate types (binary vs library), Cargo workspaces, features, dev-dependencies, build scripts (`build.rs`), publishing to crates.io.
- **why**: Real Rust projects are multi-file and multi-crate. Understanding the module system and Cargo is table stakes for anything beyond toy programs. Cargo is also one of Rust's greatest strengths.
- **how to start**: The Book Ch. 7. Take a single-file program and split it into modules across multiple files. Then add an external crate dependency.
- **what questions to ask**:
  - What is the difference between a module and a crate?
  - How does Rust resolve `mod foo` — where does it look for the file?
  - What does `pub(crate)` mean vs `pub`?
  - How do Cargo features enable conditional compilation?
  - What is a build script and when would you need one?
- **standard resources**:
  - *books*: The Book Ch. 7, [The Cargo Book](https://doc.rust-lang.org/cargo/)
  - *blogs*: [Rust Module System Explained](https://www.sheshbabu.com/posts/rust-module-system/)
- **how to get started immediately**: Create a library crate (`cargo new --lib`). Organize it into submodules. Write integration tests in `tests/`. Add `serde` as a dependency and serialize a struct to JSON.
- **outcomes**:
  - *first pass*: Can create multi-file Rust projects with modules.
  - *second pass*: Writes unit tests inline and integration tests in `tests/`. Uses `cargo test`.
  - *third pass*: Uses Cargo features, workspace with multiple crates, `cargo clippy`, `cargo fmt`.
- **what I can generate**:
  - Project template with standard structure
  - "Cargo.toml annotated reference" document

---

## PHASE 4 — Concurrency and Async (Weeks 15–19)

---

### * Fearless Concurrency — Threads and Shared State
- **what**: `std::thread::spawn`, thread ownership and `move` closures, `Arc<Mutex<T>>` for shared state, `RwLock`, `Barrier`, `Condvar`, data race prevention at compile time.
- **why**: Rust's ownership system directly prevents data races — this is provably guaranteed at compile time, unlike any other systems language. Understanding this is one of Rust's core value propositions.
- **how to start**: The Book Ch. 16. Spawn 10 threads, each incrementing a shared counter. Start with `Mutex`, observe the ownership requirements, understand why `Arc` is needed.
- **what questions to ask**:
  - What is a data race, and how does Rust prevent them while C++ cannot?
  - Why does `thread::spawn` require `'static` lifetimes?
  - What is the difference between `Mutex` poisoning and a deadlock?
  - When do you use `RwLock` over `Mutex`?
  - What are the `Send` and `Sync` marker traits — what do they guarantee?
- **standard resources**:
  - *blogs*: [Fearless Concurrency in Rust](https://blog.rust-lang.org/2015/04/10/Fearless-Concurrency.html) (official Rust blog)
  - *books*: The Book Ch. 16, *Programming Rust* Ch. 19, *Rust Atomics and Locks* (Mara Bos) — Ch. 1–4
  - *youtube*: "Crust of Rust: Atomics and Memory Ordering" — Jon Gjengset
- **how to get started immediately**: Build a parallel word counter: read a large text file, split it into chunks, spawn threads to count words in each chunk, merge results with `Arc<Mutex<HashMap>>`.
- **outcomes**:
  - *first pass*: Can spawn threads, pass data with `move`, join them.
  - *second pass*: Uses `Arc<Mutex<T>>` for shared mutable state. Handles `Mutex` poison.
  - *third pass*: Understands `Send` + `Sync`. Can reason about thread safety at the type level.
  - *final pass*: Uses `RwLock`, `Condvar`, `Barrier`. Knows the tradeoffs.
- **what I can generate**:
  - "Send + Sync: marker traits for thread safety" visual guide
  - Blog: "Writing a parallel file processor in Rust"

---

### * Message Passing with Channels
- **what**: `std::sync::mpsc` channels, `Sender`/`Receiver`, multiple producers, synchronous vs asynchronous channels, crossbeam channels.
- **why**: Channels provide an alternative concurrency model to shared state — communicate by sending data, not by sharing it. This is the Go-style approach to concurrency, and Rust supports it first-class.
- **how to start**: The Book Ch. 16.2. Build a producer-consumer pipeline with threads communicating through channels.
- **what questions to ask**:
  - What is the difference between bounded and unbounded channels?
  - How does `mpsc` ensure memory safety — what happens to data ownership when you send it?
  - When is message passing better than shared state?
  - What does `crossbeam-channel` offer that `std::sync::mpsc` doesn't?
- **standard resources**:
  - *books*: The Book Ch. 16.2, *Programming Rust* Ch. 19
  - *crates*: `crossbeam`, `flume`
- **how to get started immediately**: Build a simple pipeline: one thread generates numbers, sends through a channel, another thread filters even numbers and sends to a third that squares and prints.
- **outcomes**:
  - *first pass*: Uses `mpsc::channel()`, sends/receives values between threads.
  - *second pass*: Clones `Sender` for multiple producers. Uses `recv` vs `try_recv`.
  - *third pass*: Uses `crossbeam-channel` for select-style multi-channel receive.
- **what I can generate**:
  - "Concurrency primitives in Rust: a comparison table"

---

### * Async Rust and Tokio
- **what**: `async`/`await` syntax, `Future` trait, the executor model, Tokio runtime, `tokio::spawn`, `tokio::select!`, async I/O, `tokio::fs`, `tokio::net`.
- **why**: Async I/O is how you write high-performance networked applications without OS-thread-per-connection overhead. Tokio is the de facto async runtime and is used by virtually every major Rust web framework and network tool.
- **how to start**: [Tokio Tutorial](https://tokio.rs/tokio/tutorial). Write a simple async TCP client that reads from a server.
- **what questions to ask**:
  - What is a `Future` — what does `poll()` do and what does `Poll::Pending` mean?
  - How is async/await different from OS threads — what is the cost model?
  - What is a Tokio executor/reactor — how does `tokio::spawn` differ from `thread::spawn`?
  - What does `Pin<T>` do and why do `Future`s require pinning?
  - When is async worse than threads (small number of CPU-bound tasks)?
- **standard resources**:
  - *books*: [Async Book](https://rust-lang.github.io/async-book/), *Programming Rust* Ch. 20, *Zero to Production in Rust* (Palmieri)
  - *blogs*: [How Rust async works under the hood](https://bertptrs.nl/2023/04/09/how-does-async-rust-work.html), [Async: What is blocking?](https://ryhl.io/blog/async-what-is-blocking/)
  - *youtube*: Jon Gjengset — "The What and How of Futures and async/await in Rust"
- **how to get started immediately**: Complete the Tokio mini-tutorial (their official "mini-redis" project). It covers all the fundamentals in context.
- **outcomes**:
  - *first pass*: Writes basic `async fn`, uses `.await`, runs with `#[tokio::main]`.
  - *second pass*: Uses `tokio::spawn` for concurrent tasks. Handles errors in async context.
  - *third pass*: Uses `tokio::select!` for racing futures. Understands `Pin` basics.
  - *final pass*: Writes an async TCP server. Uses channels with async (`tokio::sync::mpsc`). Understands `Send` requirement for async tasks.
- **what I can generate**:
  - "Futures state machine" visual (how poll drives async computation)
  - Blog: "Building a concurrent web scraper with Tokio"

---

## PHASE 5 — Systems Programming Core (Weeks 20–23)

---

### * Unsafe Rust
- **what**: The `unsafe` keyword, raw pointers (`*const T`, `*mut T`), unsafe functions and blocks, dereferencing raw pointers, calling C FFI, implementing unsafe traits, `extern "C"`.
- **why**: You need `unsafe` to interface with C libraries, write OS-level code, implement data structures the borrow checker can't reason about, and access hardware registers. Understanding what `unsafe` unlocks — and what guarantees you must manually uphold — is essential for systems programming.
- **how to start**: The Book Ch. 19.1. Rust Nomicon (the primary reference). Write a function using raw pointers that swaps two values.
- **what questions to ask**:
  - What are the specific things only `unsafe` allows?
  - What invariants must you uphold when writing `unsafe` code (valid references, no aliasing of `&mut`, no data races)?
  - What is undefined behavior in Rust vs in C?
  - What is the relationship between `unsafe` blocks and soundness?
  - What is `UnsafeCell<T>` and why is it the foundation of interior mutability?
- **standard resources**:
  - *books*: [The Rustonomicon](https://doc.rust-lang.org/nomicon/) — THE reference for unsafe Rust, *Programming Rust* Ch. 21
  - *blogs*: [Unsafe Code Guidelines](https://rust-lang.github.io/unsafe-code-guidelines/)
  - *youtube*: Jon Gjengset — "Crust of Rust: Unsafe Code"
- **how to get started immediately**: Implement a simple `split_at_mut` function using raw pointers (the Nomicon walks through this). Then use `unsafe` to call a C standard library function via FFI.
- **outcomes**:
  - *first pass*: Understands what `unsafe` unlocks. Can dereference a raw pointer.
  - *second pass*: Writes a small unsafe abstraction with a safe public API. Understands invariants.
  - *third pass*: Implements a data structure (e.g., a simple arena allocator) using unsafe.
  - *final pass*: Understands `UnsafeCell`, variance, aliasing rules from the Nomicon.
- **what I can generate**:
  - "Unsafe Rust checklist — what to verify before writing unsafe"
  - Blog: "Writing a safe wrapper around an unsafe abstraction"

---

### * FFI — Interfacing with C
- **what**: `extern "C"` blocks, `#[no_mangle]`, `bindgen` tool, `cbindgen`, linking to C libraries, Rust calling C, C calling Rust, type correspondence (`c_int`, `c_char`, `CString`, `CStr`).
- **why**: The entire existing systems software ecosystem is written in C. Being able to call C libraries from Rust (and expose Rust as a C library) is essential for any real systems work: OS interfaces, hardware drivers, existing codebases.
- **how to start**: The Embedded Rust Book and Nomicon FFI chapter. Write a Rust program that calls `strlen` from libc. Then expose a Rust function to be called from C.
- **what questions to ask**:
  - What does `#[no_mangle]` do and why is it needed for FFI?
  - How does `CString` differ from Rust's `String` — what is the null terminator issue?
  - What is the role of `bindgen` — what does it automate?
  - What safety contract must you uphold when accepting a `*const c_char` from C?
  - How do you handle C callbacks (function pointers passed to C that call back into Rust)?
- **standard resources**:
  - *books*: [Nomicon FFI Chapter](https://doc.rust-lang.org/nomicon/ffi.html), *Programming Rust* Ch. 21
  - *crates*: `libc`, `bindgen`, `cbindgen`
  - *blogs*: [A practical guide to async in Rust](https://os.phil-opp.com/) (tangentially related for systems)
- **how to get started immediately**: Use `bindgen` to generate bindings for a small C header file you write. Call the C functions from Rust. Then use `cbindgen` to generate a header from a Rust library and call it from a small C program.
- **outcomes**:
  - *first pass*: Can call C functions using `extern "C"` blocks manually.
  - *second pass*: Uses `bindgen` to auto-generate bindings. Handles `CString`/`CStr` correctly.
  - *third pass*: Exposes Rust functions to C with `#[no_mangle]`. Builds a shared library.
- **what I can generate**:
  - "Rust ↔ C FFI type mapping table"
  - Template: Rust library with C bindings via cbindgen

---

### * Systems I/O — Files, Processes, Signals, and Syscalls
- **what**: `std::fs`, `std::process`, `std::os::unix`, `nix` crate for syscall wrappers, `mmap`, file descriptors, signals, `/proc` filesystem, `ioctl`.
- **why**: Systems programming is ultimately about interacting with the OS. This is where Rust's systems capabilities become concrete — spawning processes, memory-mapped I/O, reading `/proc`, handling UNIX signals.
- **how to start**: Use `std::process::Command` to spawn and capture output of external programs. Then use the `nix` crate to make `fork`/`exec` syscalls.
- **what questions to ask**:
  - What is a file descriptor? How does Rust's type system model resource lifetimes?
  - How does `mmap` differ from regular file I/O — when is it beneficial?
  - What is the UNIX process model (`fork`/`exec`) and how does it differ from threads?
  - What are signals and why are they notoriously hard to handle safely?
  - What does `OsStr` vs `str` vs `Path` model, and why are they separate types?
- **standard resources**:
  - *books*: *Programming Rust* Ch. 18, *Linux Programming Interface* (Kerrisk) for OS concepts
  - *crates*: `nix`, `libc`, `memmap2`
  - *blogs*: [Writing a Shell in Rust](https://www.joshmcguigan.com/blog/build-your-own-shell-rust/)
- **how to get started immediately**: Write a Rust program that recursively walks a directory, prints file sizes, and sorts by size. Then write one that spawns a child process and captures its stdout.
- **outcomes**:
  - *first pass*: Uses `std::fs` fluently. Spawns processes, captures output.
  - *second pass*: Uses `nix` for `fork`/`exec`, signal handling basics.
  - *third pass*: Uses `mmap` via `memmap2`. Reads `/proc/self/maps` programmatically.
- **what I can generate**:
  - "Building a mini shell in Rust" blog series
  - Systems programming reference card for Rust

---

## PHASE 6 — Advanced Topics and Specialization (Weeks 24–26)

---

### * Macros — Declarative and Procedural
- **what**: `macro_rules!` for declarative macros, procedural macros (`#[derive]`, attribute macros, function-like macros), `syn` and `quote` crates for proc macro development.
- **why**: Macros are Rust's metaprogramming system. They power `#[derive(Debug)]`, `vec![]`, `println!`, and most of the "magic" you've been using. Understanding them lets you write DSLs, reduce boilerplate, and understand third-party crates deeply.
- **how to start**: The Book Ch. 19.5. Write a `macro_rules!` macro that implements a simple DSL. Then write a custom `#[derive]` macro using `syn`.
- **what questions to ask**:
  - What is the difference between declarative and procedural macros?
  - What is a hygiene in macro contexts — why does it matter?
  - What does `syn` parse and what does `quote` generate?
  - What are the limitations of `macro_rules!` that require proc macros?
  - How do attribute macros differ from `#[derive]` macros?
- **standard resources**:
  - *books*: The Book Ch. 19.5, [The Little Book of Rust Macros](https://veykril.github.io/tlborm/)
  - *blogs*: [Procedural Macros Workshop](https://github.com/dtolnay/proc-macro-workshop) (dtolnay's workshop — do this)
  - *youtube*: Jon Gjengset — "Crust of Rust: Procedural Macros"
- **how to get started immediately**: Complete at least 2 exercises from dtolnay's proc-macro workshop. Start with the `derive(Builder)` exercise.
- **outcomes**:
  - *first pass*: Writes `macro_rules!` macros with pattern matching.
  - *second pass*: Writes a custom `#[derive]` macro using `syn` + `quote`.
  - *third pass*: Writes an attribute macro. Understands token streams.
- **what I can generate**:
  - Blog: "Writing your first procedural macro in Rust"
  - "macro_rules! pattern cheatsheet"

---

### * Performance, Profiling, and Benchmarking
- **what**: `criterion` benchmarking, `perf`/`flamegraph` profiling, SIMD with `std::simd` or `packed_simd`, cache behavior, `#[inline]`, LTO (Link-Time Optimization), PGO (Profile-Guided Optimization).
- **why**: Rust gives you the tools for C-level performance, but achieving it requires understanding what the compiler does and profiling before optimizing. "Don't guess, measure" is the mantra.
- **how to start**: Add `criterion` to a project. Write benchmarks for several algorithms. Profile with `cargo flamegraph`.
- **what questions to ask**:
  - What is the difference between wall-clock benchmarking and cycle counting?
  - What does LTO do and at what compile-time cost?
  - What is branch misprediction and how does Rust's match compilation affect it?
  - How does cache locality affect iterator performance vs indexing?
  - What is autovectorization and when does Rust/LLVM apply it?
- **standard resources**:
  - *blogs*: [The Rust Performance Book](https://nnethercote.github.io/perf-book/)
  - *crates*: `criterion`, `flamegraph`, `iai`
  - *youtube*: "Performance Matters" — Emery Berger; Jon Gjengset performance streams
- **how to get started immediately**: Benchmark three implementations of the same algorithm (e.g., sum of squares): naive loop, iterator chain, SIMD. Profile with `cargo flamegraph`. Generate a flamegraph SVG.
- **outcomes**:
  - *first pass*: Writes criterion benchmarks. Interprets results.
  - *second pass*: Generates flamegraphs. Identifies hot paths.
  - *third pass*: Applies `#[inline]`, LTO. Writes cache-aware algorithms.
- **what I can generate**:
  - "Rust performance optimization checklist"
  - Benchmark blog post comparing algorithm variants

---

### * no_std and Embedded Rust
- **what**: `#![no_std]`, `#![no_main]`, bare-metal programming, linker scripts, the `embedded-hal` abstraction layer, memory-mapped I/O, interrupt handlers, the ESP32 Rust ecosystem.
- **why**: You have an ESP32 (from your previous systems roadmap context). `no_std` Rust is how you write Rust for microcontrollers without an operating system. This is the frontier of systems programming with Rust.
- **how to start**: [The Embedded Rust Book](https://docs.rust-embedded.org/book/). Set up the ESP32 Rust toolchain (`espup`). Blink an LED.
- **what questions to ask**:
  - What does the standard library provide that `no_std` removes?
  - What is `alloc` and how does it enable heap allocation without the full `std`?
  - What is a linker script and what does it control?
  - How do interrupt handlers interact with ownership — what are the safety requirements?
  - What is the `embedded-hal` trait abstraction and why is it important?
- **standard resources**:
  - *books*: [The Embedded Rust Book](https://docs.rust-embedded.org/book/), [The Embedonomicon](https://docs.rust-embedded.org/embedonomicon/)
  - *blogs*: [esp-rs/esp-idf-hal](https://github.com/esp-rs/esp-idf-hal), [Awesome Embedded Rust](https://github.com/rust-embedded/awesome-embedded-rust)
  - *youtube*: "Embedded Rust Talks" — RustConf and Embedded World recordings
- **how to get started immediately**: Set up `espup` on CachyOS. Get a basic blink program compiling and running on your ESP32. Then read a GPIO pin and print its state via UART.
- **outcomes**:
  - *first pass*: Compiles and flashes Rust to ESP32. Blinks an LED.
  - *second pass*: Uses `embedded-hal` traits for GPIO, I2C, SPI.
  - *third pass*: Writes an interrupt handler. Uses RTIC framework.
- **what I can generate**:
  - "Setting up Rust for ESP32 on CachyOS/Linux" guide
  - Blog series: "ESP32 sensor logger in Rust"

---

## MILESTONE PROJECTS

> Projects are ordered from beginner to advanced. Each entry lists which roadmap topics it exercises.

---

### TIER 1 — Beginner (Weeks 2–6)

**P1: `rustify` — Python to Rust Concept Translator**
- A CLI that takes simple Python-style pseudo-operations (sorting, filtering, mapping) and prints the Rust equivalent iterator chain.
- *Topics*: Variables, control flow, enums, pattern matching, iterators, basic CLI with `std::env::args`.

**P2: `fstats` — File Statistics CLI**
- Recursively walks a directory, reports file count, total size, extension breakdown.
- *Topics*: `std::fs`, structs, `HashMap`, error handling with `?`, modules.

**P3: `brainfuck` — Brainfuck Interpreter**
- Implement a complete Brainfuck interpreter.
- *Topics*: Enums, pattern matching, `Vec` as tape, `HashMap` for bracket matching, error handling.

---

### TIER 2 — Intermediate (Weeks 7–14)

**P4: `kv` — Command-Line Key-Value Store**
- Persistent key-value store backed by a log-structured file. Supports `set`, `get`, `rm` commands.
- *Topics*: File I/O, serialization (`serde` + `serde_json`), error handling, custom errors (`thiserror`), `BTreeMap`, modules/crates.
- *Reference*: PingCAP's "Practical Networked Applications in Rust" (the `kvs` project).

**P5: `grep-rs` — A `ripgrep`-lite Clone**
- Recursive regex search over files with colored output and match counts.
- *Topics*: Iterators, `regex` crate, `std::fs`, error handling, closures, traits, `rayon` for parallel search.

**P6: `arena` — A Simple Arena Allocator**
- Implement a bump allocator that hands out references into a fixed buffer.
- *Topics*: Lifetimes (structs holding references), `unsafe` raw pointers, memory layout, `std::mem`.

---

### TIER 3 — Intermediate-Advanced (Weeks 15–20)

**P7: `mthreads` — Parallel Image Processing Pipeline**
- Load a set of images, apply filters (grayscale, blur) in parallel using a thread pool.
- *Topics*: Threads, `Arc<Mutex<T>>`, channels, `rayon`, `image` crate, performance benchmarking with `criterion`.

**P8: `tcp-chat` — Async Multi-Client Chat Server**
- A TCP chat server where multiple clients connect, send messages, and all receive broadcasts.
- *Topics*: Tokio, `async`/`await`, `tokio::net::TcpListener`, `Arc<Mutex<>>`, channels, error handling.

**P9: `proc-watcher` — Linux Process Monitor**
- Reads `/proc` filesystem to list processes, memory usage, CPU time. Refreshes live.
- *Topics*: `std::fs`, string parsing, `nix` crate, structs, error handling, `std::os::unix`.

---

### TIER 4 — Advanced (Weeks 21–26)

**P10: `elf-reader` — ELF Binary Inspector**
- Parse ELF binary headers and section tables. Print symbols, sections, and program headers.
- *Topics*: `unsafe` (reading binary data), raw pointers, memory layout, `#[repr(C)]`, FFI-style type correspondence, `std::fs` binary I/O.

**P11: `rshell` — A UNIX Shell**
- A basic shell: command execution, pipes, redirections, job control, builtins (`cd`, `exit`).
- *Topics*: `nix` syscalls (`fork`, `exec`, `pipe`, `dup2`), process groups, signal handling, `unsafe`, error handling, `std::process`.

**P12: `myalloc` — Custom Global Allocator**
- Implement a simple free-list allocator and register it as Rust's global allocator using `#[global_allocator]`.
- *Topics*: `unsafe`, `GlobalAlloc` trait, raw pointers, memory layout, atomics, `no_std` concepts.

**P13: `esp32-datalogger` — Embedded Sensor Logger**
- Reads temperature/humidity from a sensor over I2C, logs to flash, serves data over Wi-Fi HTTP.
- *Topics*: `no_std`, `embedded-hal`, ESP-IDF Rust bindings, async on embedded, FFI to C SDK.

**P14: `rhttp` — HTTP/1.1 Server from Scratch**
- A partial HTTP/1.1 server: parses request lines, headers, serves static files, handles connection keep-alive.
- *Topics*: Tokio async I/O, manual parsing (no `httparse` for the core), `Arc`, error handling, performance profiling.

---

## ONGOING PRACTICES

- **Daily**: 1–2 compiler error messages. Read them completely. They are documentation.
- **Weekly**: One chapter of *Programming Rust* (Blandy & Orendorff) — the deepest single-volume reference.
- **Monthly**: Read one blog post from [Jon Gjengset's blog](https://thesquareplanet.com/) or watch one "Crust of Rust" stream.
- **Throughout**: Maintain a `TIL.md` in your notes repo. One Rust insight per day.
- **Tooling**: `cargo clippy` on every project. Treat clippy lints as learning opportunities, not noise.

---

## CORE REFERENCE STACK

| Resource | Type | When |
|---|---|---|
| *The Rust Programming Language* (Brown Univ. edition) | Book | Phase 1–2 |
| *Programming Rust* — Blandy & Orendorff, 2nd ed. | Book | Phase 2–5 (ongoing) |
| *Rust for Rustaceans* — Jon Gjengset | Book | Phase 3–6 |
| *Rust Atomics and Locks* — Mara Bos | Book | Phase 4 |
| *The Rustonomicon* | Reference | Phase 5 |
| *The Embedded Rust Book* | Book | Phase 6 |
| cheats.rs | Cheatsheet | Always |
| doc.rust-lang.org/std | Reference | Always |

---
*Roadmap version: 2024. Targeting stable Rust. Assumes 3–4 hrs/day of active study + coding.*
