# 4-Month C/C++ Systems Programming Roadmap
### From Engineering Student → Advanced Low-Level Systems Developer
**Target Environment:** Intel i7-14700HX · RTX 4060 · Ubuntu 24.04 LTS (WSL2) · ESP32 IoT Ecosystem

---

> **How to use this document:** Every topic follows the same rigid template. Work through each phase sequentially. Do not skip the "How to get started immediately" sections — they are deliberately 5-minute tasks designed to anchor the theory to your fingers. Revisit Outcomes passes as you spiral back through material.

---

## Table of Contents

- [Phase 0 — Environment & Foundations (Week 0–1)](#phase-0)
- [Phase 1 — C Mastery: Memory, Pointers & the Machine (Weeks 1–4)](#phase-1)
- [Phase 2 — Systems Programming: OS Interfaces, Concurrency & Build Systems (Weeks 5–8)](#phase-2)
- [Phase 3 — C++ for Systems Work & Hardware Interfaces (Weeks 9–12)](#phase-3)
- [Phase 4 — Advanced Internals: Compilers, Linking, Assembly & Embedded (Weeks 13–16)](#phase-4)
- [Project Progression](#projects)

---

## Phase 0 — Environment & Foundations {#phase-0}
### Weeks 0–1 | Goal: Forge your development environment into a precision instrument

---

### * Toolchain Setup & WSL2 Awareness

- **What:** The collection of programs (compiler, assembler, linker, debugger, profiler) that transform source code into runnable binaries. On your WSL2 Ubuntu 24.04 environment, this means GCC/Clang, GNU Binutils, GDB, Valgrind, and related tools.
- **Why:** Your toolchain *is* the lens through which you understand the machine. A misconfigured environment teaches you nothing. Understanding what `gcc -v` actually emits versus `clang` builds professional instinct early.
- **How to start:** Run `sudo apt install build-essential gdb valgrind clang clang-tools lldb cmake ninja-build` on your WSL2 instance. Then run `gcc --version`, `ld --version`, and `as --version` to confirm the full GNU toolchain is coherent.
- **What questions to ask:**
  - What is the difference between the *compiler* (cc1), *assembler* (as), and *linker* (ld) phases in GCC?
  - What does `-v` in `gcc -v hello.c` actually print, and what does each line mean?
  - Why does WSL2 use a Linux kernel but still interact with the Windows filesystem, and what are the performance implications for I/O-heavy builds?
  - What is the purpose of `build-essential` as a meta-package — what does it actually install?
  - What is the difference between `gcc` and `cc` on a modern Ubuntu system (hint: `ls -la /usr/bin/cc`)?
  - When would you choose Clang/LLVM over GCC, and vice versa, for a systems project?
- **Standard resources to look into:**
  - Blogs/Articles: "GCC Internals" on gcc.gnu.org; "An Introduction to the LLVM Compiler Infrastructure" llvm.org/docs; search "WSL2 Linux kernel performance filesystem"
  - Papers: "A Brief History of GCC" — GNU project internal documentation
  - Books: *Computer Systems: A Programmer's Perspective* (CS:APP) Ch. 1 — "A Tour of Computer Systems"; *The Linux Command Line* (Shotts) Ch. 8–9
  - YouTube Playlists: "Compiler Explorer (Godbolt)" channel; "Jacob Sorber" — C programming setup videos
- **How to get started immediately:**
  ```bash
  # Write this, compile it two ways, then diff the assembly outputs
  # hello.c
  #include <stdio.h>
  int main(void) { printf("Hello, machine.\n"); return 0; }

  gcc -O0 -S hello.c -o hello_gcc_O0.s
  gcc -O2 -S hello.c -o hello_gcc_O2.s
  diff hello_gcc_O0.s hello_gcc_O2.s
  # Ask yourself: what disappeared? What changed? Why?
  ```
- **Outcomes:**
  - First pass: GCC, Clang, GDB, Valgrind all installed and producing correct output on a "hello world" program.
  - Second pass: You can compile with explicit flags (`-std=c11`, `-Wall`, `-Wextra`, `-pedantic`, `-g`, `-O2`) and understand what each flag does to the binary.
  - Third pass: You can examine intermediate build artifacts — `.i` (preprocessed), `.s` (assembly), `.o` (object), final ELF — and explain how each step transforms the source.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "GCC/Clang flag reference for systems programming"
  - Write a blog post: "Why I now always compile with `-Wall -Wextra -pedantic` from day one"
  - Create an internal doc: "WSL2 toolchain setup guide for embedded + systems development"

---

### * Version Control Discipline (Git for Systems Projects)

- **What:** Git is a distributed version control system. For systems projects, this includes understanding `.gitignore` hygiene for build artifacts, tagging ABI-breaking changes, and using `git bisect` to hunt bugs introduced in assembly or linker changes.
- **Why:** Systems bugs can be introduced across dozens of files and build configurations. `git bisect` is the professional tool for regression hunting. You also need to manage object files, generated code, and cross-compiled artifacts cleanly.
- **How to start:** `git init` a directory called `systems_lab/`. Add a `.gitignore` that ignores `*.o`, `*.a`, `*.so`, `build/`, and ELF binaries. Make your first commit.
- **What questions to ask:**
  - What is the difference between a Git blob, tree, and commit object at the byte level?
  - How do you use `git bisect` to find the commit that introduced a segfault?
  - What should a `.gitignore` for a C/CMake project include?
  - Why is storing compiled binaries in Git almost always wrong?
- **Standard resources to look into:**
  - Blogs/Articles: "gitignore.io" for C/CMake templates; "Pro Git" book (free online) Ch. 7 on git tools
  - Books: *Pro Git* (Chacon & Straub) — available free at git-scm.com
  - YouTube Playlists: "The Modern Coder" — Git internals series
- **How to get started immediately:**
  ```bash
  mkdir ~/systems_lab && cd ~/systems_lab
  git init
  curl https://www.toptal.com/developers/gitignore/api/c,cmake,linux > .gitignore
  git add .gitignore && git commit -m "chore: initialize systems lab repository"
  ```
- **Outcomes:**
  - First pass: Repository initialized, `.gitignore` configured, first commit made.
  - Second pass: Each phase of this roadmap lives in its own directory under `systems_lab/` with meaningful commits at each milestone.
  - Third pass: You use `git bisect` to locate a deliberate regression you introduced into a toy program.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Git workflows for systems programmers — beyond basic commits"

---

## Phase 1 — C Mastery: Memory, Pointers & the Machine {#phase-1}
### Weeks 1–4 | Goal: Understand every byte your program touches

---

### * Fundamental Types, Sizes & Undefined Behavior

- **What:** C's type system maps directly onto the machine's word sizes. `int` is not 32 bits on all platforms. Signed integer overflow, reading uninitialised memory, and out-of-bounds access are *undefined behavior* — the compiler is allowed to assume they never happen and will optimize accordingly, often catastrophically.
- **Why:** The single biggest source of security vulnerabilities and mysterious bugs in systems software is undefined behavior exploited by aggressive optimizers. Understanding this at the source level is non-negotiable.
- **How to start:** Include `<stdint.h>` and `<limits.h>` in every program. Use `int32_t`, `uint8_t`, `size_t` instead of raw `int`/`unsigned`. Print `sizeof` every fundamental type and compare against your architecture.
- **What questions to ask:**
  - What does the C standard actually say about the size of `int`, `long`, and `pointer`?
  - What is the difference between `unsigned int` overflow (well-defined: wraps) and `signed int` overflow (undefined)?
  - What is the strict aliasing rule, and why does it allow the compiler to reorder memory accesses?
  - What does `-fno-strict-aliasing` do, and when would a systems programmer use it?
  - What is the difference between `size_t` and `ptrdiff_t`? When must you use each?
  - What is integer promotion and how can it cause bugs in bitfield manipulation?
  - How does `volatile` interact with the compiler's optimizer, and when is it actually needed?
- **Standard resources to look into:**
  - Blogs/Articles: "A Guide to Undefined Behavior in C and C++" — John Regehr (blog.regehr.org); "Undefined Behavior: Every C Programmer Should Know" — LLVM blog
  - Papers: "Towards optimization-safe systems: analyzing the impact of undefined behavior" (Wang et al., SOSP 2013)
  - Books: *C Programming Language* (K&R 2nd Ed.) Ch. 2; *C: A Reference Manual* (Harbison & Steele) Ch. 5–6; *Effective C* (Seacord) Ch. 3
  - YouTube Playlists: "CS:APP Lecture Series" — CMU OpenCourseWare
- **How to get started immediately:**
  ```c
  // types_sizes.c — run this and study every output
  #include <stdio.h>
  #include <stdint.h>
  #include <limits.h>
  int main(void) {
      printf("char:     %zu bytes, signed range [%d, %d]\n",
             sizeof(char), CHAR_MIN, CHAR_MAX);
      printf("short:    %zu bytes\n", sizeof(short));
      printf("int:      %zu bytes\n", sizeof(int));
      printf("long:     %zu bytes\n", sizeof(long));
      printf("long long:%zu bytes\n", sizeof(long long));
      printf("pointer:  %zu bytes\n", sizeof(void*));
      printf("size_t:   %zu bytes\n", sizeof(size_t));
      printf("int32_t:  %zu bytes (guaranteed)\n", sizeof(int32_t));
      return 0;
  }
  // gcc -O2 types_sizes.c -o types_sizes && ./types_sizes
  ```
- **Outcomes:**
  - First pass: Can explain the output of the above program. Knows why `long` is 8 bytes on Linux x86-64 but 4 bytes on Windows (LP64 vs LLP64).
  - Second pass: Can identify at least three UB patterns in a code review. Uses `gcc -fsanitize=undefined` (UBSan) to catch them at runtime.
  - Third pass: Understands how Clang's `-fsanitize=address,undefined` instruments code and can interpret its reports to find bugs in a real codebase.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "C integer types — sizes, ranges, and when to use each"
  - Write a blog post: "The undefined behavior that cost me 3 hours and one corrupted buffer"

---

### * Pointers, Arrays, and the Address Space

- **What:** A pointer is a variable that holds the *address* of another variable. Arrays in C are fundamentally pointer arithmetic. Understanding the process address space (stack, heap, BSS, data, text segments) is foundational.
- **Why:** Every systems program manipulates raw memory. Device drivers write to memory-mapped I/O addresses. Network stacks parse byte streams. Embedded systems like the ESP32 have no MMU on some cores — you are writing to physical addresses. You cannot do this safely without a deep pointer model.
- **How to start:** Draw the memory layout of a small C program on paper before running it. Include stack frames, heap allocation, and global variables.
- **What questions to ask:**
  - What is the difference between `int *p` and `int (*p)[10]`? What does the spiral rule parse?
  - Why does `sizeof(array)` return the full array size, but `sizeof(ptr_to_array)` return only the pointer size?
  - What is pointer provenance, and why does it matter for compiler optimizations and security?
  - What is the difference between `NULL`, `0`, and `(void*)0`?
  - What does `restrict` do to a pointer, and why does it enable critical vectorization?
  - What happens to a dangling pointer when the stack frame it pointed to is popped?
  - How does the OS lay out the virtual address space of a process on x86-64 Linux?
- **Standard resources to look into:**
  - Blogs/Articles: "Pointers Are Complicated" — Ralf Jung (ralfj.de); "Everything you need to know about pointers in C" — Peter Hosey
  - Papers: "A Provenance-aware Memory Object Model for C" — ISO C WG14 N2676
  - Books: *K&R* Ch. 5 (Pointers and Arrays); *CS:APP* Ch. 3 (Machine-Level Representation); *Understanding and Using C Pointers* (Reese) — entire book
  - YouTube Playlists: "Low Level Learning" — pointer series; "Jacob Sorber" — pointer videos
- **How to get started immediately:**
  ```c
  // pointer_map.c — examine addresses of every segment
  #include <stdio.h>
  #include <stdlib.h>
  int global_var = 42;           // .data segment
  int bss_var;                   // .bss segment (zero-initialized)
  void some_function(void) {}    // .text segment
  int main(void) {
      int stack_var = 7;         // stack
      int *heap_var = malloc(4); // heap
      *heap_var = 99;
      printf("Text  (function): %p\n", (void*)some_function);
      printf("Data  (global):   %p\n", (void*)&global_var);
      printf("BSS   (uninit):   %p\n", (void*)&bss_var);
      printf("Stack (local):    %p\n", (void*)&stack_var);
      printf("Heap  (malloc):   %p\n", (void*)heap_var);
      free(heap_var);
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: Can draw the virtual address space layout from the output above and explain why addresses appear in that order.
  - Second pass: Can implement `my_memmove` (handling overlapping regions correctly), `my_strlen`, and `my_memcpy` from scratch using only pointer arithmetic.
  - Third pass: Can explain pointer provenance in the context of LLVM IR and understand why `-fno-strict-aliasing` is sometimes required for correct hardware register access in drivers.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "Pointer declarations — reading them with the spiral rule"
  - Write a blog post: "Drawing the memory map — what happens when your C program starts"

---

### * Dynamic Memory Management (Heap)

- **What:** `malloc`, `calloc`, `realloc`, `free` are the C standard library interface to the heap allocator. The heap is a region of virtual memory managed by a runtime allocator (e.g., `ptmalloc2` in glibc). Memory leaks, double-frees, and heap corruption are endemic to systems code.
- **Why:** You will write custom allocators for embedded systems (the ESP32's heap is fragmented and finite), for real-time systems where `malloc` latency is unacceptable, and for debugging. Understanding what `malloc` does internally is the only way to debug heap corruption.
- **How to start:** Implement a naive bump allocator (a.k.a. arena allocator) using a static array and a pointer. It should support `alloc(size)` but not `free` (simplest case first).
- **What questions to ask:**
  - What is the internal structure of a `malloc` chunk in glibc's ptmalloc2? What are the `prev_size`, `size`, and `fd`/`bk` fields?
  - What is the difference between internal fragmentation and external fragmentation?
  - Why is `calloc` safer than `malloc + memset` in practice (hint: check the glibc source)?
  - What is a slab allocator, and why does the Linux kernel use one for frequently-allocated objects?
  - How does `brk`/`sbrk` differ from `mmap` for heap expansion? Which does glibc choose and when?
  - What is a memory arena in the context of a game engine or a request-scoped web server?
  - How do you write a thread-safe arena allocator? What is the TLS (thread-local storage) trick?
- **Standard resources to look into:**
  - Blogs/Articles: "Memory Allocators 101" — sploitfun.github.io; "Understanding glibc malloc" — sploitfun; "Writing a Memory Allocator" — ibob.github.io
  - Papers: "A Fast, Space-Efficient Heap Allocator" — Lea (dlmalloc paper)
  - Books: *CS:APP* Ch. 9 (Virtual Memory); *The Art of Writing Efficient Programs* (Pikus) Ch. 4; *Hacking: The Art of Exploitation* Ch. 3 (heap exploitation context teaches internal layout)
  - YouTube Playlists: "Malloc Internals" — series on YouTube by various security researchers
- **How to get started immediately:**
  ```c
  // arena.c — a 5-minute bump allocator
  #include <stdio.h>
  #include <stdint.h>
  #include <assert.h>
  #define ARENA_SIZE (1024 * 1024)  // 1 MB static arena
  static uint8_t arena[ARENA_SIZE];
  static size_t  offset = 0;
  void *arena_alloc(size_t size) {
      // Align to 8 bytes
      size = (size + 7) & ~7ULL;
      assert(offset + size <= ARENA_SIZE);
      void *ptr = arena + offset;
      offset += size;
      return ptr;
  }
  void arena_reset(void) { offset = 0; }
  int main(void) {
      int *arr = arena_alloc(10 * sizeof(int));
      for (int i = 0; i < 10; i++) arr[i] = i * i;
      for (int i = 0; i < 10; i++) printf("%d ", arr[i]);
      printf("\nArena used: %zu bytes\n", offset);
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: Working bump allocator as above. Can explain why it cannot free individual allocations.
  - Second pass: Add a free-list to your allocator supporting `arena_free`. Implement first-fit, best-fit, and compare fragmentation.
  - Third pass: Write a pool allocator for fixed-size objects (critical pattern for ESP32 where heap fragmentation causes crashes). Benchmark it against `malloc` using `clock_gettime`.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Three allocator patterns every embedded developer should know"
  - Write a cheat sheet: "Arena vs Pool vs Free-list allocators — trade-offs at a glance"

---

### * Structs, Unions, Bitfields & Memory Layout

- **What:** Structs aggregate heterogeneous data. The compiler inserts *padding* bytes between fields to satisfy alignment requirements. Unions overlay multiple types on the same bytes. Bitfields pack multiple logical values into a single word.
- **Why:** Network protocol headers, hardware register maps, file format parsers, and ESP32 peripheral registers are all defined as packed/bitfield structs. Getting the layout wrong silently corrupts data.
- **How to start:** Write a struct with mixed-size fields, print `sizeof` and `offsetof` for each field, then re-order fields to minimize padding.
- **What questions to ask:**
  - What alignment requirement does each primitive type have on x86-64 Linux (System V ABI)?
  - What does `__attribute__((packed))` do, and why can it cause SIGBUS on non-x86 architectures?
  - How do you correctly parse a network packet header (big-endian) using a struct without UB?
  - What is the difference between `union` used for type punning and `memcpy`-based type punning — which is defined behavior in C?
  - How do ESP32 peripheral registers map to `volatile` struct pointers in the ESP-IDF SDK?
  - What is a *flexible array member* and when should you use it?
- **Standard resources to look into:**
  - Blogs/Articles: "The Lost Art of Structure Packing" — Eric S. Raymond (catb.org); "Struct padding and packing" — search term
  - Papers: System V Application Binary Interface, AMD64 Architecture Processor Supplement (x86-64 ABI document)
  - Books: *K&R* Ch. 6; *C: A Reference Manual* (Harbison & Steele) Ch. 8
  - YouTube Playlists: "Low Level Learning" — ABI and struct layout videos
- **How to get started immediately:**
  ```c
  // padding.c
  #include <stdio.h>
  #include <stddef.h>
  struct Wasteful {
      char  a;    // 1 byte
      // 7 bytes padding
      double b;   // 8 bytes
      char  c;    // 1 byte
      // 7 bytes padding
      int   d;    // 4 bytes — wait, does the compiler reorder?
  };
  struct Efficient {
      double b;   // 8 bytes
      int    d;   // 4 bytes
      char   a;   // 1 byte
      char   c;   // 1 byte
      // 2 bytes padding
  };
  int main(void) {
      printf("Wasteful:  %zu bytes\n", sizeof(struct Wasteful));
      printf("Efficient: %zu bytes\n", sizeof(struct Efficient));
      printf("offsetof(Wasteful, b) = %zu\n", offsetof(struct Wasteful, b));
      printf("offsetof(Wasteful, d) = %zu\n", offsetof(struct Wasteful, d));
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: Can explain every byte of padding in `struct Wasteful` above.
  - Second pass: Write a struct that models an Ethernet frame header with correct field sizes, and use it to parse a raw captured packet.
  - Third pass: Write a struct that mirrors an ESP32 GPIO register (from the Technical Reference Manual), access it via a `volatile` pointer, and toggle a GPIO pin via register-direct access.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "x86-64 struct alignment rules and padding patterns"
  - Write a blog post: "How I accidentally corrupted a register by not reading the alignment rules"

---

### * The Preprocessor, Macros & Conditional Compilation

- **What:** The C preprocessor (cpp) is a text-substitution engine that runs *before* the compiler. It handles `#include`, `#define`, `#ifdef`, `#pragma`, and token concatenation via `##`.
- **Why:** Systems code is saturated with macros — hardware abstraction layers (HALs), platform-specific code paths, debug/release builds, and ESP32 SDK code use preprocessor directives extensively. Misunderstanding macros is a source of subtle bugs.
- **How to start:** Run `gcc -E source.c` to see what the preprocessor emits *before* compilation. Do this on a file with a few `#include` and `#define` directives.
- **What questions to ask:**
  - Why can a function-like macro with no parentheses around its argument cause operator precedence bugs?
  - What is the `do { ... } while(0)` idiom for multi-statement macros, and why is it necessary?
  - What does `#pragma once` do vs `#ifndef HEADER_H` guards — and which do systems projects prefer?
  - What is `X-macro` technique and when is it genuinely useful for embedded systems (e.g., auto-generating enum + string tables for register names)?
  - What is the difference between `#if`, `#ifdef`, and `#if defined()`?
  - How does the ESP-IDF use `CONFIG_*` defines generated by KConfig/menuconfig?
- **Standard resources to look into:**
  - Blogs/Articles: "C Preprocessor tricks, tips, and idioms" — C FAQ; "X-Macro Technique" — Wikipedia and Dr. Dobb's
  - Books: *K&R* Ch. 4 (Functions and Program Structure); *C: A Reference Manual* Ch. 3
  - YouTube Playlists: "Jacob Sorber" — preprocessor videos
- **How to get started immediately:**
  ```c
  // Dangerous macro — can you spot the bug?
  #define SQUARE(x)  x * x
  // Safe macro:
  #define SQUARE_SAFE(x)  ((x) * (x))

  int a = SQUARE(1 + 2);       // expands to 1 + 2 * 1 + 2 = 5, not 9!
  int b = SQUARE_SAFE(1 + 2);  // expands to ((1+2) * (1+2)) = 9

  // Run: gcc -E -P this_file.c | grep SQUARE
  // to see the raw expansion
  ```
- **Outcomes:**
  - First pass: Can explain macro expansion pitfalls and write correct function-like macros.
  - Second pass: Implement an X-macro table that generates both an enum and a `const char*` name array for a set of ESP32 error codes.
  - Third pass: Write a platform abstraction header using `#ifdef` that provides the same API for both your Linux (WSL2) test harness and ESP32 target.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "Safe macro patterns in C — the 7 rules"
  - Write a blog post: "Cross-platform HAL with the C preprocessor"

---

### * Strings and the Standard C Library (libc)

- **What:** C strings are null-terminated `char` arrays. The standard library (`string.h`, `stdio.h`, `stdlib.h`, `math.h`) provides routines that every systems programmer must know at the implementation level — not just usage level.
- **Why:** Buffer overflows from unsafe string functions (`gets`, `strcpy`, `sprintf`) are the oldest class of exploitable vulnerability. Systems code on resource-constrained devices like the ESP32 must use these functions carefully within tight memory bounds.
- **How to start:** Implement `strlen`, `strcpy`, `strcmp`, and `strcat` from scratch using only pointer arithmetic and array indexing. Compare your implementation to `man 3 strlen`.
- **What questions to ask:**
  - Why is `gets()` undefined behavior waiting to happen and removed from C11?
  - What is the difference between `strncpy` and `strlcpy`? Why does `strncpy` not guarantee null-termination?
  - What does `printf("%s", user_input)` vs `printf(user_input)` mean for security (format string vulnerability)?
  - How does `strtol` differ from `atoi`, and why should you always prefer `strtol` in systems code?
  - What does `memchr` return when the character is not found, and how does mishandling this cause bugs?
- **Standard resources to look into:**
  - Blogs/Articles: "Safe C string functions" — openwall.com; "The Safe C Library" — libsafec.sourceforge.net
  - Books: *K&R* Ch. 5, 7; *Effective C* (Seacord) Ch. 7–8
  - YouTube Playlists: "Jacob Sorber" — string series
- **How to get started immediately:**
  ```c
  // Implement and test your own strlen
  #include <assert.h>
  size_t my_strlen(const char *s) {
      const char *p = s;
      while (*p != '\0') p++;
      return (size_t)(p - s);
  }
  int main(void) {
      assert(my_strlen("hello") == 5);
      assert(my_strlen("") == 0);
      assert(my_strlen("a\0b") == 1);  // null terminator stops here
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: Reimplemented `strlen`, `strcpy`, `strcmp`, `memcpy`, `memmove` from scratch. All pass tests.
  - Second pass: Write a safe string library with `checked_strncpy` that always null-terminates and returns an error code on truncation.
  - Third pass: Profile `memcpy` at different sizes against the glibc implementation. Understand why glibc uses SIMD intrinsics for large copies.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "C string functions — safe vs unsafe, with replacements"

---

### * Error Handling Patterns in C

- **What:** C has no exceptions. Error handling is done through return values (`-1`, `NULL`, custom enum codes), `errno`, and `setjmp`/`longjmp`. Consistent error handling is a hallmark of professional C code.
- **Why:** Every system call can fail. Every `malloc` can return `NULL`. Every file operation can produce an error. Ignoring return values is a top cause of production outages and security vulnerabilities.
- **How to start:** Write a function that opens a file, reads it into a buffer, and closes it — with correct error handling at every step using `errno` and `perror`.
- **What questions to ask:**
  - What is `errno` and why is it thread-local? How does it interact with signal handlers?
  - Why should you always save `errno` before calling another function if you need to report it?
  - What is the `goto cleanup` pattern and why is it idiomatic in the Linux kernel for resource cleanup?
  - What is the difference between recoverable and non-recoverable errors? When should you call `abort()` vs `exit()` vs `return -1`?
  - How does ESP-IDF's `esp_err_t` return type system work, and how does `ESP_ERROR_CHECK` macro use it?
- **Standard resources to look into:**
  - Blogs/Articles: "Error handling in C" — search; Linux kernel coding style (kernel.org) — error handling section
  - Books: *The Linux Programming Interface* (Kerrisk) Ch. 3; *Effective C* (Seacord) Ch. 9
  - YouTube Playlists: "Low Level Learning" — error handling in C
- **How to get started immediately:**
  ```c
  #include <stdio.h>
  #include <stdlib.h>
  #include <errno.h>
  #include <string.h>

  int read_file(const char *path, char **out, size_t *len) {
      FILE *f = fopen(path, "rb");
      if (!f) { perror("fopen"); return -1; }
      if (fseek(f, 0, SEEK_END) != 0) { perror("fseek"); fclose(f); return -1; }
      long sz = ftell(f);
      if (sz < 0) { perror("ftell"); fclose(f); return -1; }
      rewind(f);
      *out = malloc((size_t)sz + 1);
      if (!*out) { fclose(f); return -ENOMEM; }
      *len = fread(*out, 1, (size_t)sz, f);
      (*out)[*len] = '\0';
      fclose(f);
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: All system call return values in your code are checked. No silent failure paths.
  - Second pass: Implement the `goto cleanup` pattern for multi-resource acquisition (file + memory + socket).
  - Third pass: Design an `esp_err_t`-style typed error system for a multi-module C project.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "The `goto cleanup` pattern — why the Linux kernel uses `goto` and you should too"
  - Write a cheat sheet: "C error handling idioms — a decision tree"

---

## Phase 2 — Systems Programming: OS Interfaces, Concurrency & Build Systems {#phase-2}
### Weeks 5–8 | Goal: Command the OS; build software that scales

---

### * Linux System Calls & the POSIX API

- **What:** System calls are the boundary between user space and kernel space. On x86-64 Linux, a syscall instruction transfers control to the kernel. POSIX wraps these in standard C library functions (`open`, `read`, `write`, `mmap`, `fork`, `exec`, etc.).
- **Why:** Every I/O operation, process creation, thread creation, and file operation ultimately becomes a system call. In WSL2, understanding when calls cross the virtual kernel boundary is essential. For ESP32, the analogous layer is FreeRTOS + ESP-IDF HAL calls.
- **How to start:** Use `strace -e trace=all ./your_program` to see every system call your program makes. Do this on a simple `printf("hello\n")` program and count how many syscalls it takes.
- **What questions to ask:**
  - What is the mechanism of a system call on x86-64? Which registers carry the syscall number and arguments (System V ABI)?
  - What is the difference between a blocking and non-blocking syscall?
  - What is the difference between `read()` returning 0 vs -1 with `errno == EINTR`?
  - What does the `O_CLOEXEC` flag do on `open()` and why does it matter in programs that `fork`?
  - How does `epoll` differ from `select`/`poll` for I/O multiplexing, and why does it scale better?
  - What does `strace` actually do at the OS level to intercept syscalls (hint: `ptrace`)?
- **Standard resources to look into:**
  - Blogs/Articles: "Linux System Call Table" — syscall.sh; "The Definitive Guide to Linux System Calls" — packagecloud.io blog
  - Papers: "A Measurement Study of the Linux Kernel System Call Interface" (academic)
  - Books: *The Linux Programming Interface* (Kerrisk) — the definitive reference, Ch. 1–5, 13, 18; *Advanced Programming in the Unix Environment* (Stevens/Rago) Ch. 3
  - YouTube Playlists: "Live Overflow" — syscall internals; "CS 537 Wisconsin" lecture recordings
- **How to get started immediately:**
  ```bash
  # Trace syscalls on hello world — you'll be surprised
  gcc -o hello hello.c
  strace ./hello 2>&1 | head -30

  # Write a hello world using ONLY raw syscalls, no libc:
  # hello_raw.asm or via syscall() wrapper:
  ```
  ```c
  // raw_hello.c — uses syscall() directly, bypassing printf
  #include <unistd.h>
  #include <sys/syscall.h>
  int main(void) {
      const char msg[] = "Hello via raw syscall!\n";
      syscall(SYS_write, STDOUT_FILENO, msg, sizeof(msg) - 1);
      syscall(SYS_exit, 0);
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: Can trace syscalls of any program with `strace` and interpret the output.
  - Second pass: Implement a minimal `cat` utility using only `open`, `read`, `write`, `close` — no `fopen`/`fread`.
  - Third pass: Implement a simple TCP echo server using `socket`, `bind`, `listen`, `accept`, `read`, `write` — handle `EINTR` correctly.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "Essential POSIX file I/O syscalls with error handling templates"
  - Write a blog post: "What does `printf('hello')` actually do? A syscall journey"

---

### * Processes, Signals & IPC

- **What:** A process is an isolated execution unit with its own address space. Signals are software interrupts. Inter-process communication (IPC) mechanisms include pipes, FIFOs, shared memory, message queues, and sockets.
- **Why:** Daemon processes, shell pipelines, watchdog timers, graceful shutdown handlers — these are the backbone of systems software. Understanding `fork`/`exec`/`waitpid` and signal safety is mandatory.
- **How to start:** Write a program that `fork`s a child process, has the child `exec` a command (e.g., `ls`), and has the parent `waitpid` for it. Then install a `SIGTERM` handler that does a graceful cleanup.
- **What questions to ask:**
  - What is a zombie process, and how does `waitpid` with `WNOHANG` prevent them?
  - What is async-signal safety? What functions are safe to call from a signal handler?
  - What is `SA_RESTART` on `sigaction`, and why does it matter for syscalls that can return `EINTR`?
  - What is the difference between `pipe` and `socketpair`? When would you use `AF_UNIX` sockets for IPC?
  - What is the `self-pipe trick` and why is it used to handle signals in event loops?
  - How does `vfork` differ from `fork`, and when would you use it?
- **Standard resources to look into:**
  - Blogs/Articles: "Signals: A Brief and Incomplete Introduction" — daemonforums.org; "Write-up on Unix signal handling" — search
  - Books: *The Linux Programming Interface* Ch. 20–24 (Signals), Ch. 26 (Child Processes), Ch. 44–46 (Pipes & FIFOs, IPC)
  - YouTube Playlists: "CS 537 Wisconsin" — processes and IPC
- **How to get started immediately:**
  ```c
  #include <stdio.h>
  #include <stdlib.h>
  #include <unistd.h>
  #include <signal.h>
  #include <sys/wait.h>

  static volatile sig_atomic_t running = 1;
  void sigterm_handler(int sig) { (void)sig; running = 0; }

  int main(void) {
      signal(SIGTERM, sigterm_handler);
      signal(SIGINT,  sigterm_handler);
      pid_t pid = fork();
      if (pid == 0) {
          // child
          execlp("ls", "ls", "-la", NULL);
          perror("execlp"); exit(1);
      }
      waitpid(pid, NULL, 0);
      printf("Child finished. Parent running: %d\n", running);
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: Working fork/exec/waitpid. Signal handler that sets a flag.
  - Second pass: Implement a shell pipeline: `cmd1 | cmd2` using `pipe()`, `dup2()`, `fork()`, and `exec()`.
  - Third pass: Implement a simple process supervisor (like a minimal `supervisord`) that restarts crashed child processes, with a named pipe for control commands.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Building a minimal process supervisor in C"

---

### * POSIX Threads (pthreads) & Concurrency

- **What:** POSIX threads (`pthreads`) provide threading primitives: `pthread_create`, `pthread_join`, mutexes (`pthread_mutex_t`), condition variables (`pthread_cond_t`), and reader-writer locks. These are the foundation for all higher-level concurrency abstractions.
- **Why:** Multi-core systems (your i7-14700HX has 20 cores) require correct concurrent programming. Race conditions, deadlocks, and priority inversions are the hardest class of bugs to reproduce and fix. ESP32's dual-core FreeRTOS environment has analogous issues with tasks, queues, and semaphores.
- **How to start:** Write a program with two threads incrementing a shared counter without any synchronization. Observe the race condition. Then fix it with a mutex.
- **What questions to ask:**
  - What is the difference between a data race and a race condition? Why can a data race cause UB in C11?
  - What is the difference between a mutex and a spinlock? When is a spinlock preferable?
  - What is the ABA problem in lock-free programming?
  - What are the conditions for deadlock (Coffman conditions), and how does lock ordering prevent it?
  - What is a condition variable, and why does it always need to be used with a mutex and a `while` loop (not `if`)?
  - What is `pthread_cond_broadcast` vs `pthread_cond_signal`? When must you use broadcast?
  - How does `pthread_mutex_trylock` differ from `pthread_mutex_lock`, and what is the risk of using it incorrectly?
- **Standard resources to look into:**
  - Blogs/Articles: "POSIX Threads Programming" — Lawrence Livermore labs (hpc.llnl.gov/training/tutorials/pthreads); "Concurrency Bugs" — Morning Paper blog
  - Papers: "Experience with Processes and Monitors in Mesa" (Lampson & Redell 1980) — foundational
  - Books: *The Linux Programming Interface* Ch. 29–33 (Threads); *Programming with POSIX Threads* (Butenhof) — the definitive reference; *C++ Concurrency in Action* (Williams) Ch. 1–5
  - YouTube Playlists: "Multithreading in C" — search on YouTube; "CS 162 Berkeley" — concurrency lectures
- **How to get started immediately:**
  ```c
  #include <stdio.h>
  #include <pthread.h>
  #define NUM_THREADS 4
  #define INCREMENTS  1000000

  static long counter = 0;
  static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;

  void *increment(void *arg) {
      (void)arg;
      for (int i = 0; i < INCREMENTS; i++) {
          pthread_mutex_lock(&mtx);
          counter++;
          pthread_mutex_unlock(&mtx);
      }
      return NULL;
  }
  int main(void) {
      pthread_t threads[NUM_THREADS];
      for (int i = 0; i < NUM_THREADS; i++)
          pthread_create(&threads[i], NULL, increment, NULL);
      for (int i = 0; i < NUM_THREADS; i++)
          pthread_join(threads[i], NULL);
      printf("Expected: %ld, Got: %ld\n", (long)NUM_THREADS * INCREMENTS, counter);
      return 0;
  }
  // Compile: gcc -O2 -pthread -o threads threads.c && ./threads
  ```
- **Outcomes:**
  - First pass: Race condition demonstrated, then fixed with a mutex. Counter is always correct.
  - Second pass: Implement a thread-safe bounded queue using mutex + two condition variables (producer/consumer pattern). This is the foundation of every thread pool.
  - Third pass: Implement a fixed-size thread pool that accepts arbitrary work items (function pointer + void* arg). Profile the overhead vs sequential execution at different task sizes and counts.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Building a thread pool from scratch in C — with a condition variable deep dive"
  - Write a cheat sheet: "pthreads API quick reference — the 15 functions you need"

---

### * Memory-Mapped I/O & `mmap`

- **What:** `mmap` maps a file or device into the process's virtual address space. Memory-mapped I/O allows device registers to be accessed like ordinary memory pointers. On Linux, `/dev/mem` exposes physical memory.
- **Why:** This is the mechanism by which device drivers, GPU programming (your RTX 4060), database engines (mmap for data files), and embedded systems (register access on ESP32) work. Understanding `mmap` bridges OS theory to hardware reality.
- **How to start:** Use `mmap` to map a file into memory and print its first 64 bytes. Then modify a byte and observe that the underlying file changes (for `MAP_SHARED`).
- **What questions to ask:**
  - What is the difference between `MAP_SHARED` and `MAP_PRIVATE`? What is copy-on-write (COW)?
  - What causes a page fault, and how does the OS handle it for an `mmap`-ed region?
  - What is `msync`, and when is it required?
  - What is `MAP_ANONYMOUS` used for, and how does it relate to `malloc`?
  - How does hardware register access via `mmap` of `/dev/mem` work on embedded Linux?
  - What is `mlock`/`munlock`, and why do real-time systems use it?
- **Standard resources to look into:**
  - Blogs/Articles: "mmap and memory management" — search term; "Using mmap for IPC" — various
  - Books: *The Linux Programming Interface* Ch. 49–50 (mmap); *CS:APP* Ch. 9
  - YouTube Playlists: "OS Dev" — virtual memory and mmap
- **How to get started immediately:**
  ```c
  #include <stdio.h>
  #include <stdlib.h>
  #include <fcntl.h>
  #include <sys/mman.h>
  #include <sys/stat.h>
  #include <unistd.h>
  int main(int argc, char *argv[]) {
      if (argc < 2) { fprintf(stderr, "Usage: %s <file>\n", argv[0]); return 1; }
      int fd = open(argv[1], O_RDONLY);
      if (fd < 0) { perror("open"); return 1; }
      struct stat st;
      fstat(fd, &st);
      char *map = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
      if (map == MAP_FAILED) { perror("mmap"); close(fd); return 1; }
      fwrite(map, 1, st.st_size < 64 ? st.st_size : 64, stdout);
      munmap(map, st.st_size);
      close(fd);
      return 0;
  }
  ```
- **Outcomes:**
  - First pass: File mapping with `MAP_PRIVATE`, reading content.
  - Second pass: Use `MAP_SHARED | MAP_ANONYMOUS` to create a shared memory region between a parent and child process, passing messages.
  - Third pass: Implement a memory-mapped ring buffer for inter-process communication between a logger and an application.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "mmap internals — from page fault to your pointer"

---

### * CMake & Build Systems

- **What:** CMake is a meta-build system that generates platform-specific build files (Makefiles, Ninja files, Visual Studio projects). Make is a build automation tool. Understanding both is essential because the ESP-IDF uses CMake as its primary build system.
- **Why:** A professional systems project is never a single file compiled with `gcc file.c`. It has multiple libraries, test targets, cross-compilation toolchains, and conditional compilation. Not understanding your build system means you cannot debug build failures, optimize compilation times, or set up CI/CD.
- **How to start:** Create a CMakeLists.txt for a project with a library (`libcore.a`), an executable that links against it, and a test binary. Build it with `cmake -B build -G Ninja && ninja -C build`.
- **What questions to ask:**
  - What is the difference between `target_include_directories(... PUBLIC)` vs `PRIVATE` vs `INTERFACE`?
  - What is a *generator expression* in CMake and when do you need one?
  - What is the difference between `add_library(mylib STATIC ...)` vs `SHARED` vs `INTERFACE`?
  - How do you cross-compile for an ARM target (ESP32) from an x86-64 host using CMake toolchain files?
  - What does `cmake --build . --target clean` do, and why should you prefer `rm -rf build/`?
  - How does the ESP-IDF component build system map onto standard CMake concepts?
  - What is `compile_commands.json`, and how does it power IDE integration (clangd, Zed)?
- **Standard resources to look into:**
  - Blogs/Articles: "Modern CMake" — cliutils.gitlab.io/modern-cmake (free online); "An Introduction to Modern CMake" — hsf.github.io
  - Books: *Professional CMake* (Craig Scott) — the definitive reference
  - YouTube Playlists: "Cpp Weekly" (Jason Turner) — CMake episodes; "Code, Tech, and Tutorials" — CMake series
- **How to get started immediately:**
  ```cmake
  # CMakeLists.txt for a minimal multi-target project
  cmake_minimum_required(VERSION 3.20)
  project(SystemsLab C)
  set(CMAKE_C_STANDARD 11)
  set(CMAKE_C_STANDARD_REQUIRED ON)
  set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

  # Static library
  add_library(core STATIC src/arena.c src/strings.c)
  target_include_directories(core PUBLIC include/)
  target_compile_options(core PRIVATE -Wall -Wextra -Wpedantic)

  # Main executable
  add_executable(main src/main.c)
  target_link_libraries(main PRIVATE core)

  # Test executable
  enable_testing()
  add_executable(test_core tests/test_core.c)
  target_link_libraries(test_core PRIVATE core)
  add_test(NAME CoreTests COMMAND test_core)
  ```
  ```bash
  mkdir build && cmake -B build -G Ninja && ninja -C build && ctest --test-dir build
  ```
- **Outcomes:**
  - First pass: Multi-target CMake build. Library, executable, and test binary all build cleanly.
  - Second pass: Add a CMake toolchain file for cross-compilation to `arm-none-eabi` (ESP32 GCC toolchain). Verify headers are found correctly.
  - Third pass: Add a `compile_commands.json` export, configure it in Zed editor, and confirm clangd provides accurate jump-to-definition across your project.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Modern CMake for ESP32 — from WSL2 development to cross-compilation"
  - Write a cheat sheet: "CMake target properties — PUBLIC vs PRIVATE vs INTERFACE explained"

---

### * Debugging: GDB, Sanitizers & Valgrind

- **What:** GDB is the GNU debugger. Sanitizers (AddressSanitizer, UBSan, ThreadSanitizer) are LLVM/GCC compiler instrumentation frameworks that detect bugs at runtime. Valgrind is a dynamic analysis framework with Memcheck as its primary tool.
- **Why:** `printf` debugging does not scale. In systems software, the bug is often non-deterministic (race condition), spatially distant from the symptom (heap corruption from earlier), or only manifests under load. Professional debugging requires professional tools.
- **How to start:** Deliberately introduce a heap buffer overflow, a use-after-free, and a race condition into toy programs. Then find each one using AddressSanitizer, Valgrind Memcheck, and ThreadSanitizer respectively.
- **What questions to ask:**
  - What is the GDB command sequence to: set a breakpoint on a function, step into it, print a local variable, print all frames in the call stack, and inspect a memory address?
  - What is a *watchpoint* in GDB? When is it more useful than a breakpoint?
  - What does AddressSanitizer's shadow memory technique do, and what is its memory overhead?
  - Why does Valgrind's Memcheck not detect certain classes of bugs that ASan does, and vice versa?
  - What does ThreadSanitizer output when it detects a race condition, and how do you interpret its race report?
  - What is GDB's `reverse-debugging` capability (record and replay), and when would you use it?
- **Standard resources to look into:**
  - Blogs/Articles: "AddressSanitizer: A Fast Address Sanity Checker" — Google; "GDB Cheat Sheet" — multiple sources; "Valgrind Quick Start Guide" — valgrind.org
  - Papers: "AddressSanitizer: A Fast Address Sanity Checker" (Serebryany et al., USENIX ATC 2012)
  - Books: *Debugging with GDB* — the GDB manual (sourceware.org/gdb/documentation); *The Art of Debugging with GDB, DDD, and Eclipse* (Matloff & Salzman)
  - YouTube Playlists: "Greg Law — Debug your code with GDB" (CppCon talk); "Low Level Learning" — debugging series
- **How to get started immediately:**
  ```bash
  # Step 1: Introduce a bug
  cat > buggy.c << 'EOF'
  #include <stdlib.h>
  int main(void) {
      int *p = malloc(5 * sizeof(int));
      p[5] = 42;  // heap buffer overflow
      free(p);
      return p[0];  // use-after-free
  }
  EOF

  # Step 2: Catch it with ASan
  gcc -fsanitize=address,undefined -g -O1 -o buggy buggy.c
  ./buggy
  # Read the report — it tells you exact location, allocation site, and access

  # Step 3: Catch it with Valgrind
  gcc -g -O0 -o buggy_plain buggy.c
  valgrind --leak-check=full ./buggy_plain
  ```
- **Outcomes:**
  - First pass: Can navigate a program in GDB (breakpoints, step/next/continue, print, backtrace).
  - Second pass: Can diagnose a heap-use-after-free report from ASan and fix the underlying bug.
  - Third pass: Can use GDB's remote debugging protocol to debug a program running in a different process (foundational skill for debugging on ESP32 via OpenOCD + GDB stub).
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "GDB command reference for systems debugging"
  - Write a blog post: "Three sanitizers, three bug classes — my debugging workflow"

---

### * Profiling & Performance Analysis

- **What:** `perf` is the Linux performance analysis tool. `gprof` is the classic GCC profiler. Flamegraphs are a visualization technique. `cachegrind` (Valgrind) simulates cache behavior.
- **Why:** Your i7-14700HX has a complex cache hierarchy (L1/L2/L3), out-of-order execution, and branch prediction. Systems code that ignores the hardware pays a 10–100× performance penalty. On ESP32, profiling is essential because you have 520KB of SRAM and a 240MHz clock.
- **How to start:** Write a matrix multiplication in the naive order (ijk) and the cache-friendly order (ikj). Profile both with `perf stat` and compare L1 cache miss rates.
- **What questions to ask:**
  - What is a CPU cache hierarchy, and what are typical L1/L2/L3 sizes and latencies on Alder Lake (your i7-14700HX)?
  - What is the difference between a cache miss and a TLB miss?
  - What is false sharing, and how does it cause performance degradation in multi-threaded code?
  - What is a CPU pipeline stall caused by a branch misprediction, and how do you write branch-predictor-friendly code?
  - What does the `perf stat -e cache-misses,branch-misses` output tell you?
  - What is a flamegraph, and how do you generate one from `perf record` output?
- **Standard resources to look into:**
  - Blogs/Articles: "Brendan Gregg's Linux Performance page" — brendangregg.com; "What every programmer should know about memory" — Ulrich Drepper (PDF, LWN.net)
  - Papers: "What Every Programmer Should Know About Memory" — Drepper 2007
  - Books: *Computer Organization and Design* (Patterson & Hennessy) Ch. 5; *The Art of Writing Efficient Programs* (Pikus) — entire book
  - YouTube Playlists: "CppCon" — performance talks by Chandler Carruth; "Brendan Gregg" channel
- **How to get started immediately:**
  ```bash
  # Install perf
  sudo apt install linux-tools-generic linux-tools-$(uname -r)
  # Note: in WSL2 you may need the custom Microsoft perf kernel module
  # Alternative: use valgrind --tool=callgrind for profiling in WSL2
  ```
  ```c
  // matrix.c — compare ijk vs ikj cache behavior
  #define N 512
  static double A[N][N], B[N][N], C_ijk[N][N], C_ikj[N][N];
  void mult_ijk(void) {
      for (int i=0;i<N;i++) for (int j=0;j<N;j++) for (int k=0;k<N;k++)
          C_ijk[i][j] += A[i][k] * B[k][j];
  }
  void mult_ikj(void) {
      for (int i=0;i<N;i++) for (int k=0;k<N;k++) for (int j=0;j<N;j++)
          C_ikj[i][j] += A[i][k] * B[k][j];
  }
  // Time both with clock_gettime(CLOCK_MONOTONIC, ...) and compare
  ```
- **Outcomes:**
  - First pass: Can time functions with `clock_gettime`. Observes the ijk vs ikj performance difference.
  - Second pass: Generates a flamegraph from a real program and identifies the hottest function.
  - Third pass: Uses `perf stat -e cache-misses,cache-references` to quantify the cache improvement from the ikj reorder. Applies the same principle to a real data structure in your project.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Why loop order matters — a 4× speedup from cache-friendliness"
  - Write a cheat sheet: "perf and Valgrind cachegrind — your WSL2 profiling toolkit"

---

## Phase 3 — C++ for Systems Work & Hardware Interfaces {#phase-3}
### Weeks 9–12 | Goal: Apply modern C++ where it improves correctness and performance; maintain C compatibility for embedded targets

---

### * C++ Object Model: Classes, RAII & The Rule of Five

- **What:** C++ adds classes, constructors, destructors, copy/move semantics, and operator overloading on top of C. RAII (Resource Acquisition Is Initialization) ties resource lifetime to object lifetime, making resource leaks structurally impossible with correct design.
- **Why:** Modern C++ systems code (game engines, OS utilities, embedded middleware) uses RAII for every resource: file handles, mutexes, memory, sockets. ESP-IDF has a C++ API layer. Understanding the object model — specifically vtable layout, copy elision, and move semantics — prevents subtle bugs.
- **How to start:** Write a `File` class that opens a file in its constructor and closes it in its destructor. Then intentionally break the Rule of Three by copying it and observe the double-close.
- **What questions to ask:**
  - What is the Rule of Three? Rule of Five? Rule of Zero? When does each apply?
  - What is a vtable, and where is it stored in memory? What is the overhead of a virtual function call?
  - What is the difference between `std::move` and `std::forward`, and what does "perfect forwarding" mean?
  - When does copy elision (NRVO/RVO) eliminate copy/move constructors entirely?
  - What is the difference between `noexcept` on a move constructor and its performance implications in `std::vector`?
  - Why is a destructor in a base class almost always `virtual`?
- **Standard resources to look into:**
  - Blogs/Articles: "Fluent C++" — fluentcpp.com; "C++ Core Guidelines" — isocpp.github.io/CppCoreGuidelines
  - Books: *Effective Modern C++* (Meyers) — Items 17–23 (special member functions, move semantics); *C++ Primer* (Lippman) Ch. 13; *Inside the C++ Object Model* (Lippman) — for vtable internals
  - YouTube Playlists: "CppCon" — "Back to Basics" series; "The Cherno" — C++ series
- **How to get started immediately:**
  ```cpp
  // raii_file.cpp — RAII done right
  #include <cstdio>
  #include <stdexcept>
  #include <utility>  // std::move

  class File {
  public:
      explicit File(const char *path, const char *mode) {
          f_ = std::fopen(path, mode);
          if (!f_) throw std::runtime_error("cannot open file");
      }
      ~File() { if (f_) std::fclose(f_); }

      // Disable copy — a file handle cannot be shared
      File(const File&)            = delete;
      File& operator=(const File&) = delete;

      // Enable move — ownership can transfer
      File(File&& other) noexcept : f_(other.f_) { other.f_ = nullptr; }
      File& operator=(File&& other) noexcept {
          if (this != &other) { if (f_) std::fclose(f_); f_ = other.f_; other.f_ = nullptr; }
          return *this;
      }
      std::FILE* get() const { return f_; }
  private:
      std::FILE *f_;
  };
  ```
- **Outcomes:**
  - First pass: `File`, `Lock` (mutex RAII wrapper), and `Buffer` (heap RAII wrapper) classes, all with correct Rule of Five.
  - Second pass: Template the `Lock` class to work with any lockable type. Implement `std::lock_guard` and `std::unique_lock` from scratch.
  - Third pass: Profile a C++ program where move semantics eliminate a measurable number of copies in a vector of large objects. Use Compiler Explorer (godbolt.org) to verify move vs copy constructor selection.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "RAII in embedded C++ — managing ESP32 resources without exceptions"
  - Write a cheat sheet: "Rule of Five — the decision flowchart"

---

### * Templates & Generic Programming

- **What:** C++ templates enable compile-time polymorphism (zero-cost abstractions). Function templates, class templates, variadic templates, and template specialization are the foundation of the STL and modern C++ libraries.
- **Why:** Systems code uses templates for type-safe containers without runtime overhead, compile-time dispatch (no vtable), and policy-based design (e.g., a sorted container that accepts a custom comparator). On ESP32, templates replace heap-allocated virtual dispatch.
- **How to start:** Write a template `RingBuffer<T, N>` (fixed-size circular buffer) that works for `uint8_t`, `uint32_t`, and a custom struct without a single virtual function or heap allocation.
- **What questions to ask:**
  - What is template instantiation, and why does it cause code bloat if used naively?
  - What is SFINAE (Substitution Failure Is Not An Error)? Why has `if constexpr` largely replaced it in C++17?
  - What is the difference between `typename` and `class` in a template parameter? Is there any semantic difference?
  - What is a *type trait*, and how does `std::is_trivially_copyable<T>` affect how you should copy an object?
  - What is template specialization vs partial specialization? Give a hardware example of why you'd specialize a template.
  - What is CRTP (Curiously Recurring Template Pattern) and how does it provide static polymorphism?
- **Standard resources to look into:**
  - Blogs/Articles: "C++ Template Metaprogramming" — Barton & Nackman; "Fluent C++" — template articles
  - Books: *C++ Templates: The Complete Guide* (Vandevoorde, Josuttis, Gregor) — the definitive reference; *Effective Modern C++* (Meyers) — Items 24–29
  - YouTube Playlists: "CppCon" — template metaprogramming talks by Hana Dusikova, etc.
- **How to get started immediately:**
  ```cpp
  // ring_buffer.hpp — zero-allocation, template-safe ring buffer for ESP32 tasks
  #include <cstdint>
  #include <cstddef>
  template <typename T, std::size_t N>
  class RingBuffer {
      static_assert(N > 0 && (N & (N-1)) == 0, "N must be a power of 2");
  public:
      bool push(const T& item) {
          if (full()) return false;
          buf_[head_ & (N-1)] = item;
          head_++;
          return true;
      }
      bool pop(T& item) {
          if (empty()) return false;
          item = buf_[tail_ & (N-1)];
          tail_++;
          return true;
      }
      bool empty() const { return head_ == tail_; }
      bool full()  const { return (head_ - tail_) == N; }
      std::size_t size() const { return head_ - tail_; }
  private:
      T buf_[N]{};
      std::size_t head_{0}, tail_{0};
  };
  ```
- **Outcomes:**
  - First pass: Working `RingBuffer<T, N>` with push/pop/empty/full. Verify no heap allocation via `valgrind --tool=massif`.
  - Second pass: Add iterator support to `RingBuffer` so it works with range-based for loops and `<algorithm>`.
  - Third pass: Implement CRTP-based static polymorphism for a sensor interface: `Sensor<Derived>` base with a static `read()` dispatch. Use on WSL2 for a software sensor stub and plan adaptation for ESP32.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Zero-allocation data structures for ESP32 in C++ using templates"

---

### * The STL: Containers, Algorithms & Iterators

- **What:** The C++ Standard Template Library provides generic containers (`vector`, `map`, `unordered_map`, `deque`, `array`) and algorithms (`sort`, `find`, `transform`, `accumulate`). Understanding their complexity guarantees and memory layout is essential for systems use.
- **Why:** Using `std::vector` in performance-critical systems code requires knowing that its reallocation is amortized O(1) but causes all pointers/references to be invalidated. Using `std::map` when you need O(1) lookup is a classic systems programming mistake.
- **How to start:** Write a benchmark comparing `std::map<int,int>` vs `std::unordered_map<int,int>` for 1M insertions and 1M lookups. Measure with `clock_gettime`. Then inspect the assembly output in Compiler Explorer.
- **What questions to ask:**
  - What is the internal data structure of `std::map` vs `std::unordered_map`? What are their cache characteristics?
  - What is the difference between `std::vector::push_back` and `emplace_back`? When does `emplace_back` avoid a copy?
  - Why is `std::deque` not cache-friendly? What is its internal structure?
  - What is the difference between `std::sort`, `std::stable_sort`, and `std::partial_sort`?
  - Why is `std::string` often heap-allocated and what is SSO (Small String Optimization)?
  - What is `std::string_view` and why is it critical for systems code that parses binary data?
- **Standard resources to look into:**
  - Blogs/Articles: "C++ container cheat sheet" — cppreference.com; "Sean Parent's Range Algorithms" talk slides
  - Books: *Effective STL* (Meyers) — all items; *C++ Standard Library* (Josuttis) — the definitive reference
  - YouTube Playlists: "CppCon" — "Better Code" series by Sean Parent; "CppNorth" — container internals
- **How to get started immediately:**
  ```cpp
  #include <algorithm>
  #include <vector>
  #include <numeric>
  #include <iostream>
  int main() {
      std::vector<int> v(1'000'000);
      std::iota(v.begin(), v.end(), 0);      // fill 0..999999
      std::shuffle(v.begin(), v.end(), ...); // need <random>
      std::sort(v.begin(), v.end());
      // Now find the 1000th element using binary search:
      auto it = std::lower_bound(v.begin(), v.end(), 1000);
      std::cout << *it << "\n";
  }
  // Use valgrind --tool=callgrind and kcachegrind to visualize hotspots
  ```
- **Outcomes:**
  - First pass: Benchmarks comparing map vs unordered_map. Understanding the performance cliff.
  - Second pass: Implement a custom hash function for a domain-specific key (e.g., a 4-byte sensor ID) that outperforms the default hash.
  - Third pass: Write a parser for a binary protocol format (e.g., a simplified MQTT fixed header parser) using `std::string_view` and `<algorithm>` with zero heap allocation.
- **What I can learn from it & Resources to generate:**
  - Write a cheat sheet: "STL container selection guide — by complexity and cache characteristics"

---

### * Modern C++ for Embedded Systems (C++17/20 on ESP32)

- **What:** Modern C++ features including `constexpr`, `if constexpr`, `std::span`, `std::variant`, `std::optional`, structured bindings, and `[[nodiscard]]` can dramatically improve embedded systems code safety and expressiveness with zero runtime cost.
- **Why:** The ESP-IDF supports C++17. Features like `constexpr` move computation to compile time (no runtime overhead, no RAM usage). `std::optional<Sensor::Reading>` replaces sentinel values like `-1` or `NULL` for "no valid reading available". `[[nodiscard]]` catches ignored error returns at compile time.
- **How to start:** Take one of your C error-handling patterns from Phase 1 and refactor it to use `std::optional<T>` and `[[nodiscard]]`. Verify it compiles cleanly and observe the improved call-site ergonomics.
- **What questions to ask:**
  - What does `constexpr` guarantee about evaluation at compile time vs runtime?
  - What is `std::span<T>` and why does it replace raw pointer + length pairs in function signatures?
  - What is `std::variant` and how does it implement a tagged union? How does its size compare to a C union?
  - What does `[[nodiscard]]` do and why should every function returning an error code have it?
  - What are C++ *designated initializers* (C++20) and why are they useful for hardware register config structs?
  - What does `[[likely]]`/`[[unlikely]]` tell the branch predictor, and how does it interact with GCC's `__builtin_expect`?
- **Standard resources to look into:**
  - Blogs/Articles: "Embedded C++ — a practical guide" — Barr Group; "C++17 for embedded systems" — various Modular C++
  - Books: *A Tour of C++* (Stroustrup, 3rd Ed.) — entire book; *Effective Modern C++* (Meyers) Items 1–16
  - YouTube Playlists: "CppCon" — "Embedded Friendly Modern C++" talks
- **How to get started immediately:**
  ```cpp
  #include <optional>
  #include <cstdint>
  struct Reading { float temperature; uint32_t timestamp_ms; };

  // Before: error-prone C pattern
  int sensor_read_c(Reading *out) { /* returns -1 on error */ return -1; }

  // After: type-safe C++17 pattern
  [[nodiscard]] std::optional<Reading> sensor_read() {
      // If sensor not ready:
      return std::nullopt;
      // If successful:
      // return Reading{ 23.5f, get_tick_ms() };
  }

  int main() {
      auto result = sensor_read();
      if (result) {
          // result->temperature is valid here
      }
      // Ignoring the return value of sensor_read()
      // now produces a compiler warning due to [[nodiscard]]
  }
  ```
- **Outcomes:**
  - First pass: One C error-handling pattern refactored to `std::optional`. `[[nodiscard]]` on all error-returning functions.
  - Second pass: Design a sensor abstraction layer using `std::variant<TemperatureReading, HumidityReading, ErrorCode>` as a discriminated union return type.
  - Third pass: Write a compile-time register layout validator using `constexpr` that ensures your ESP32 GPIO config struct fits in a single 32-bit register word at compile time, not runtime.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Modern C++ in ESP32 firmware — zero-cost abstractions that improve safety"
  - Write a cheat sheet: "C++17/20 features for embedded systems — quick reference"

---

### * UART, SPI, I2C & Hardware Protocols (ESP32 Focus)

- **What:** UART, SPI, and I2C are the three universal serial communication protocols for embedded systems. UART is asynchronous (no clock), SPI is synchronous full-duplex, and I2C is synchronous half-duplex with addressing. Every ESP32 project uses at least one.
- **Why:** Real hardware development requires reading datasheets, understanding timing diagrams, and writing protocol drivers. The gap between "blinking LEDs" and "communicating with a real sensor" is crossed here. Understanding the software side (ESP-IDF drivers, register-direct access) requires the systems programming knowledge from earlier phases.
- **How to start:** Obtain an ESP32 development board. Set up ESP-IDF on WSL2. Write a UART loopback test (TX connected to RX via a wire) that sends a buffer and verifies reception — this exercises the full UART driver path.
- **What questions to ask:**
  - What is the baud rate, and what is its relationship to bit timing? What happens when both ends disagree by 5%?
  - What is the SPI clock polarity (CPOL) and clock phase (CPHA)? Why do they matter when connecting a specific sensor?
  - What is I2C clock stretching, and which ESP32 I2C master implementation handles it correctly?
  - What is DMA (Direct Memory Access) and how does ESP32's UART DMA mode reduce CPU load during high-throughput transfers?
  - How do you read the ESP32 Technical Reference Manual to understand the UART FIFO threshold registers?
  - What is a logic analyzer, and how would you use one (or PulseView with a cheap USB analyzer) to verify your SPI timing?
- **Standard resources to look into:**
  - Blogs/Articles: "ESP-IDF UART documentation" — docs.espressif.com; "I2C in a nutshell" — interrupt.memfault.com; "SPI demystified" — various
  - Papers: I2C specification (NXP UM10204); SPI specification
  - Books: *Making Embedded Systems* (White) — entire book; *Programming Embedded Systems* (Barr & Massa)
  - YouTube Playlists: "Espressif Systems" YouTube channel; "Phil's Lab" — protocol deep dives; "EEVblog" — protocol fundamentals
- **How to get started immediately:**
  ```c
  // ESP-IDF UART minimal setup (from ESP-IDF examples)
  // Place in an ESP-IDF project's main/main.c
  #include "driver/uart.h"
  #include "string.h"

  #define UART_NUM    UART_NUM_0
  #define BUF_SIZE    (1024)

  void app_main(void) {
      uart_config_t cfg = {
          .baud_rate  = 115200,
          .data_bits  = UART_DATA_8_BITS,
          .parity     = UART_PARITY_DISABLE,
          .stop_bits  = UART_STOP_BITS_1,
          .flow_ctrl  = UART_HW_FLOWCTRL_DISABLE,
      };
      uart_param_config(UART_NUM, &cfg);
      uart_driver_install(UART_NUM, BUF_SIZE * 2, 0, 0, NULL, 0);
      const char *test = "Hello UART\r\n";
      uart_write_bytes(UART_NUM, test, strlen(test));
  }
  ```
- **Outcomes:**
  - First pass: UART loopback test passing. SPI read of a single register from a common sensor (e.g., MPU6050 via I2C, or BME280 via SPI).
  - Second pass: Full driver for a sensor over I2C/SPI, returning `std::optional<Reading>` from C++ wrapper.
  - Third pass: DMA-based UART receive with an interrupt-driven ring buffer, suitable for receiving NMEA GPS data at 9600 baud without busy-waiting.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Writing a register-level I2C driver for the MPU6050 on ESP32 — without using the library"
  - Write a cheat sheet: "UART/SPI/I2C — protocol selection guide and ESP-IDF API reference"

---

## Phase 4 — Advanced Internals: Compilers, Linking, Assembly & Embedded RTOS {#phase-4}
### Weeks 13–16 | Goal: Know the machine better than the compiler does; build real embedded systems

---

### * ELF Format, Linkers & Linker Scripts

- **What:** ELF (Executable and Linkable Format) is the binary format for executables, shared libraries, and object files on Linux (and ESP32). A linker script (`*.ld`) controls how sections are mapped to memory addresses.
- **Why:** ESP32 has a complex memory layout (IRAM, DRAM, FLASH, RTC_IRAM, RTC_SLOW_MEM). The linker script places code and data in the correct region. Optimizing for instruction cache performance, placing hot functions in IRAM, or placing a DMA buffer in specific SRAM banks all requires understanding linker scripts.
- **How to start:** Run `readelf -a` on a compiled binary. Identify the `.text`, `.data`, `.bss`, `.rodata`, and `.eh_frame` sections. Then run `objdump -d` to disassemble `.text`.
- **What questions to ask:**
  - What is the difference between a section and a segment in an ELF file?
  - What does the linker do that the compiler cannot? Why must linking be a separate step?
  - What is a symbol, and what is a *symbol table*? What is the difference between a local, global, and weak symbol?
  - What is *position-independent code* (PIC), and how does it use the GOT (Global Offset Table) and PLT (Procedure Linkage Table)?
  - What does `KEEP()` do in a linker script, and why is it needed for interrupt vector tables?
  - How does the ESP32 linker script place the interrupt vector table at a specific physical address in flash?
  - What is link-time optimization (LTO), and what is its trade-off?
- **Standard resources to look into:**
  - Blogs/Articles: "Linkers and Loaders" — Ian Lance Taylor's series (lwn.net); "ELF format" — man 5 elf; "Linker Scripts" — sourceware.org/binutils/docs/ld/Scripts.html; "Anatomy of an ELF" — search
  - Papers: "How To Write Shared Libraries" — Drepper 2011
  - Books: *Linkers and Loaders* (Levine) — the definitive reference; *Computer Systems: A Programmer's Perspective* (CS:APP) Ch. 7
  - YouTube Playlists: "CS:APP Video Lectures" — linking chapter
- **How to get started immediately:**
  ```bash
  gcc -c -o foo.o foo.c
  readelf -a foo.o        # examine sections, symbols, relocations
  objdump -d foo.o        # disassemble machine code
  nm foo.o                # list symbols
  size foo.o              # text/data/bss sizes

  # See what the full link produces:
  gcc -o foo foo.c
  readelf -l foo          # segment headers (the runtime view)
  objdump -d foo | less   # full disassembly
  ```
- **Outcomes:**
  - First pass: Can interpret `readelf -a` and `objdump -d` output on a simple program.
  - Second pass: Write a minimal linker script for a bare-metal ARM target that places a `.vector_table` section at address `0x00000000` and `.text` immediately after.
  - Third pass: Modify the ESP-IDF project's linker script to place a timing-critical ISR function in IRAM instead of flash, and verify the placement with `readelf`.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Reading ELF files — what's actually in your firmware?"
  - Write a cheat sheet: "Linker script MEMORY and SECTIONS commands — reference card"

---

### * Inline Assembly & Intrinsics

- **What:** Inline assembly (`__asm__` in GCC/Clang) embeds raw assembly instructions inside C/C++ code. Compiler intrinsics are C functions that map 1:1 to specific machine instructions (e.g., SSE/AVX SIMD intrinsics on x86, NEON on ARM).
- **Why:** Some operations simply have no C equivalent: reading CPU cycle counters (`RDTSC`), atomic test-and-set, SIMD vectorization, cache prefetch hints, memory barriers, and coprocessor access on embedded MCUs. Your i7-14700HX has AVX-512 capabilities worth exploiting.
- **How to start:** Use `__asm__` to implement a `read_tsc()` function that reads the x86 Time Stamp Counter (RDTSC). Compare its timing resolution against `clock_gettime(CLOCK_MONOTONIC)`.
- **What questions to ask:**
  - What are the GCC extended `asm` constraint characters (`=r`, `r`, `m`, `g`, `+r`) and what do they mean?
  - What is a *memory clobber* (`"memory"`) in an `asm` statement, and when must you include it?
  - What is a *memory barrier*, and why must it surround any lock-free atomic operation?
  - What is the difference between `_mm_load_ps` and `_mm_loadu_ps` in SSE intrinsics?
  - On ESP32/Xtensa, how do you use inline assembly to read/write Special Registers (e.g., `LITBASE`, `VECBASE`)?
  - What is RDTSC serialization, and why do you need `CPUID` before `RDTSC` for accurate timing?
- **Standard resources to look into:**
  - Blogs/Articles: "GCC-Inline-Assembly-HOWTO" — ibiblio.org; "x86 Intrinsics Guide" — intel.com/content/www/us/en/docs/intrinsics-guide; "Agner Fog's optimization manuals" — agner.org/optimize
  - Books: *Computer Systems: A Programmer's Perspective* (CS:APP) Ch. 3; *The Art of Writing Efficient Programs* (Pikus) Ch. 7–9; *Intel 64 and IA-32 Architectures Software Developer's Manual* Vol. 2 (instruction reference)
  - YouTube Playlists: "CppCon" — SIMD and intrinsics talks; "Chandler Carruth" performance talks
- **How to get started immediately:**
  ```c
  #include <stdint.h>
  #include <stdio.h>

  static inline uint64_t read_tsc(void) {
      uint32_t lo, hi;
      __asm__ __volatile__(
          "rdtsc"
          : "=a"(lo), "=d"(hi)
          :
          : // no clobbers needed for rdtsc
      );
      return ((uint64_t)hi << 32) | lo;
  }

  int main(void) {
      uint64_t start = read_tsc();
      volatile int x = 0;
      for (int i = 0; i < 1000000; i++) x++;
      uint64_t end = read_tsc();
      printf("Loop took %llu cycles\n", (unsigned long long)(end - start));
      return 0;
  }
  // gcc -O2 -o tsc tsc.c && ./tsc
  ```
- **Outcomes:**
  - First pass: `read_tsc()` working. Can use it to benchmark small code sections with cycle accuracy.
  - Second pass: Write a SIMD-accelerated `memcpy` using SSE2 128-bit loads/stores (`_mm_load_si128`, `_mm_store_si128`). Benchmark against `glibc memcpy` at various sizes.
  - Third pass: Write a vectorized dot-product using AVX2 256-bit YMM registers. Verify the compiler's auto-vectorized version produces equivalent assembly via Compiler Explorer.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Reading the cycle counter — CPU timing with RDTSC"
  - Write a cheat sheet: "GCC inline assembly constraint reference"

---

### * FreeRTOS on ESP32 — Real-Time OS Concepts

- **What:** FreeRTOS is a real-time operating system (RTOS) kernel used by ESP-IDF. It provides tasks (threads), queues (type-safe message passing), semaphores, mutexes, event groups, timers, and direct-to-task notifications.
- **Why:** All nontrivial ESP32 firmware is structured as FreeRTOS tasks. Understanding task priority, stack size allocation, inter-task communication, and the scheduler (preemptive, tick-based) is fundamental to writing correct, non-crashing embedded firmware.
- **How to start:** Create three FreeRTOS tasks at different priorities. Have a high-priority task use a semaphore to signal a low-priority task when data is available. Observe the scheduling on the ESP32's UART console.
- **What questions to ask:**
  - What is priority inversion, and what is priority inheritance? Does ESP32's mutex (`xSemaphoreCreateMutex`) implement priority inheritance?
  - What is the FreeRTOS tick rate, and what is the relationship between tick rate, `vTaskDelay`, and power consumption?
  - What is the difference between `xQueueSendFromISR` and `xQueueSend`, and why must you use the ISR variant in an interrupt handler?
  - What is the watermark of a task stack, and how do you check it with `uxTaskGetStackHighWaterMark`?
  - What is a critical section in FreeRTOS (`taskENTER_CRITICAL`) and how does it interact with interrupts on dual-core ESP32?
  - What is the difference between FreeRTOS tasks on core 0 (protocol CPU) vs core 1 (app CPU) on ESP32?
- **Standard resources to look into:**
  - Blogs/Articles: "FreeRTOS documentation" — freertos.org; "Mastering the FreeRTOS Real Time Kernel" (free PDF — FreeRTOS.org); "ESP-IDF FreeRTOS guide" — docs.espressif.com
  - Books: *Using the FreeRTOS Real Time Kernel* (Barry) — free PDF; *Making Embedded Systems* (White) Ch. 6–8
  - YouTube Playlists: "Digi-Key" — FreeRTOS tutorial series; "Embedded Systems with ARM" — FreeRTOS tasks
- **How to get started immediately:**
  ```c
  // FreeRTOS producer/consumer via queue (ESP-IDF)
  #include "freertos/FreeRTOS.h"
  #include "freertos/task.h"
  #include "freertos/queue.h"
  #include "esp_log.h"
  static QueueHandle_t q;
  void producer_task(void *arg) {
      int i = 0;
      for (;;) {
          xQueueSend(q, &i, portMAX_DELAY);
          i++;
          vTaskDelay(pdMS_TO_TICKS(500));
      }
  }
  void consumer_task(void *arg) {
      int val;
      for (;;) {
          if (xQueueReceive(q, &val, portMAX_DELAY)) {
              ESP_LOGI("CONSUMER", "Got: %d", val);
          }
      }
  }
  void app_main(void) {
      q = xQueueCreate(10, sizeof(int));
      xTaskCreate(producer_task, "prod", 2048, NULL, 5, NULL);
      xTaskCreate(consumer_task, "cons", 2048, NULL, 4, NULL);
  }
  ```
- **Outcomes:**
  - First pass: Two tasks communicating via queue. Stack watermarks monitored.
  - Second pass: Implement a sensor polling task that reads an I2C sensor every 100ms, places readings in a queue, and a display task that consumes readings and formats them for UART output — using separate stack sizes tuned by watermark analysis.
  - Third pass: Implement a watchdog-monitored multi-task system where any task failure triggers a graceful reset. Use FreeRTOS task notifications for low-overhead signaling between an ISR and a processing task.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "FreeRTOS task design patterns — the queue, the semaphore, and the event group"
  - Write a cheat sheet: "FreeRTOS API quick reference — the 20 functions every ESP32 developer needs"

---

### * Writing Device Drivers (Linux Kernel Modules — Introduction)

- **What:** A Linux kernel module (LKM) is a piece of code that can be loaded into the kernel at runtime to add functionality — typically device drivers. Kernel modules run in Ring 0 (kernel space) with unrestricted hardware access and no memory protection from bugs.
- **Why:** This is the final frontier of systems programming. Understanding kernel module structure, `file_operations`, `ioctl`, interrupt handlers, DMA setup, and `sysfs` connects everything from Phase 1–4. Even if you primarily do embedded work, kernel driver concepts map directly to ESP32 driver development and ESP-IDF component architecture.
- **How to start:** Write a "Hello, World" kernel module that prints a message to the kernel log on load (`insmod`) and unload (`rmmod`). This requires WSL2 with a custom kernel or a Linux VM.
- **What questions to ask:**
  - What is the difference between kernel space and user space at the hardware level (privilege rings on x86-64)?
  - What is the `module_init` / `module_exit` macro pattern, and what happens when `insmod` calls `module_init`?
  - Why can you not use `printf` in a kernel module (hint: libc), and what replaces it?
  - What is a `file_operations` struct, and how does it implement the "everything is a file" Unix abstraction?
  - What is `copy_to_user` / `copy_from_user`, and why can you not simply dereference a userspace pointer in the kernel?
  - What is a spinlock vs a mutex in the kernel context, and why can a kernel mutex not be used in an interrupt handler?
- **Standard resources to look into:**
  - Blogs/Articles: "The Linux Kernel Module Programming Guide" — sysprog21.github.io/lkmpg (free, up to date); "Linux Device Drivers, 3rd Ed." — free online (LDD3)
  - Papers: Linux Kernel documentation — kernel.org/doc/html/latest
  - Books: *Linux Device Drivers* (Corbet, Rubini, Kroah-Hartman, 3rd Ed.) — free online; *Linux Kernel Development* (Love, 3rd Ed.) — Ch. 1–8, 13–16
  - YouTube Playlists: "Johannes 4GNU/Linux" — kernel module tutorials; "The Linux Foundation" — kernel development talks
- **How to get started immediately:**
  ```c
  // hello_module.c — minimal kernel module
  // NOTE: Requires a real Linux kernel (compile in a VM if WSL2 headers unavailable)
  #include <linux/init.h>
  #include <linux/module.h>
  #include <linux/kernel.h>

  MODULE_LICENSE("GPL");
  MODULE_AUTHOR("pvs");
  MODULE_DESCRIPTION("Hello, Kernel");

  static int __init hello_init(void) {
      printk(KERN_INFO "hello_module: loaded\n");
      return 0;
  }
  static void __exit hello_exit(void) {
      printk(KERN_INFO "hello_module: unloaded\n");
  }
  module_init(hello_init);
  module_exit(hello_exit);
  ```
  ```makefile
  # Kbuild Makefile
  obj-m += hello_module.o
  all:
  	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules
  clean:
  	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
  ```
- **Outcomes:**
  - First pass: Module loads and unloads. `dmesg | tail` shows your messages.
  - Second pass: Implement a character device driver (`/dev/hello`) that allows userspace to `read` a counter that increments each time it's read.
  - Third pass: Implement an interrupt-driven character device that signals userspace via `poll`/`select` when a software-triggered interrupt fires — the pattern used by real hardware drivers.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "Writing your first Linux kernel module — a systems programmer's walkthrough"
  - Write a cheat sheet: "Kernel space vs user space — what you can and cannot do"

---

### * Networking Internals: TCP/IP Stack & Raw Sockets

- **What:** Raw sockets allow direct construction of IP/TCP/UDP packets, bypassing the OS network stack. Understanding the TCP/IP stack internals — packet buffering, socket buffer sizes, the `TCP_NODELAY` option, connection teardown — is essential for network systems programming.
- **Why:** Writing network daemons, embedded MQTT clients on ESP32, custom protocols, or network monitoring tools all requires understanding what happens below `send()`/`recv()`. Netif (LwIP on ESP32) is a full TCP/IP stack embedded in firmware.
- **How to start:** Write a TCP echo server and client from scratch using POSIX sockets. Then add `SO_REUSEADDR` and `TCP_NODELAY` and measure the latency difference.
- **What questions to ask:**
  - What is the TCP three-way handshake in terms of actual syscalls and kernel state transitions?
  - What is the difference between `send`/`recv` and `write`/`read` on a socket?
  - What is `SO_REUSEADDR` and why should a server always set it?
  - What is Nagle's algorithm, and why does `TCP_NODELAY` disable it? When does this help vs hurt?
  - What is the socket receive buffer (`SO_RCVBUF`), and what happens when it fills?
  - How does ESP32's LwIP stack handle TCP flow control in firmware?
- **Standard resources to look into:**
  - Blogs/Articles: "Beej's Guide to Network Programming" — beej.us/guide/bgnet (free, excellent); "The Illustrated TCP/IP" — various
  - Books: *Unix Network Programming* (Stevens) Vol. 1 — the definitive reference; *TCP/IP Illustrated* (Stevens) Vol. 1
  - YouTube Playlists: "Hussein Nasser" — networking fundamentals; "David Bombal" — deep networking
- **How to get started immediately:**
  ```c
  // minimal_server.c — echo server in ~50 lines
  #include <stdio.h>
  #include <string.h>
  #include <stdlib.h>
  #include <unistd.h>
  #include <netinet/in.h>
  #include <netinet/tcp.h>
  #include <sys/socket.h>
  int main(void) {
      int srv = socket(AF_INET, SOCK_STREAM, 0);
      int opt = 1;
      setsockopt(srv, SOL_SOCKET,  SO_REUSEADDR, &opt, sizeof(opt));
      setsockopt(srv, IPPROTO_TCP, TCP_NODELAY,  &opt, sizeof(opt));
      struct sockaddr_in addr = { .sin_family=AF_INET, .sin_port=htons(8080),
                                  .sin_addr.s_addr=INADDR_ANY };
      bind(srv, (struct sockaddr*)&addr, sizeof(addr));
      listen(srv, 5);
      printf("Listening on :8080\n");
      for (;;) {
          int cli = accept(srv, NULL, NULL);
          char buf[1024];
          ssize_t n;
          while ((n = read(cli, buf, sizeof(buf))) > 0)
              write(cli, buf, n);
          close(cli);
      }
  }
  ```
- **Outcomes:**
  - First pass: TCP echo server and client working. `nc localhost 8080` sends and receives.
  - Second pass: Add `epoll`-based non-blocking I/O to handle multiple clients concurrently without threads.
  - Third pass: Port the echo server logic to ESP32's LwIP socket API and test end-to-end over WiFi.
- **What I can learn from it & Resources to generate:**
  - Write a blog post: "From `socket()` to TCP echo server — every syscall explained"

---

---

## Project Progression {#projects}

### Progression Philosophy
Projects are ordered on three axes: (1) concept density, (2) hardware complexity, and (3) system integration breadth. Each project builds directly on the previous. Every project includes build tool, test strategy, and WSL2/ESP32 notes.

---

### Tier 0 — Absolute Beginner (Week 1–2)

#### Project 0.1 — `libtiny`: A Custom C String Library
- **Concepts required:** Pointers, arrays, null-terminated strings, `sizeof`, `strlen`, `strcpy`, `strcmp`, basic error handling
- **Build tools:** `Makefile` with `$(CC)`, `$(CFLAGS)`, `make test` target
- **WSL2 testing:** `gcc -fsanitize=address,undefined` on all test binaries; `valgrind --leak-check=full`
- **Description:** Implement `tiny_strlen`, `tiny_strcpy`, `tiny_strcmp`, `tiny_strdup`, `tiny_trim` (strips whitespace), and `tiny_split` (splits on a delimiter, returns a `NULL`-terminated array of `char*`). Write a test file with at least 20 assertions using a hand-rolled `ASSERT` macro.
- **Extension:** Add `tiny_base64_encode` and `tiny_base64_decode`. This pattern appears verbatim in embedded systems (encoding sensor data for transmission).

#### Project 0.2 — `arena`: A Bump Allocator Library
- **Concepts required:** Dynamic memory, pointer arithmetic, alignment, `sizeof`, `assert`, `mmap` (for the backing store)
- **Build tools:** `CMakeLists.txt` with a `core` static library and a `test_arena` executable
- **WSL2 testing:** `ctest` via CMake; Valgrind massif to verify zero heap usage
- **Description:** Implement an arena allocator backed by `mmap(MAP_ANONYMOUS)`. Support `arena_alloc(size)`, `arena_reset()`, `arena_destroy()`. Template it for typed allocations with a macro: `ARENA_ALLOC(arena, Type)`. Benchmark allocation speed vs `malloc` for 10M small objects.

---

### Tier 1 — Foundational Systems (Week 3–6)

#### Project 1.1 — `minicat`: A Feature-Complete `cat` Implementation
- **Concepts required:** `open`/`read`/`write`/`close` syscalls, command-line argument parsing, error handling, `stat`, file descriptors
- **Build tools:** CMake; `compile_commands.json` for clangd in Zed
- **WSL2 testing:** Compare output byte-for-byte against system `cat` using `diff <(./minicat file) <(cat file)`
- **Description:** Implement `cat` supporting `-n` (line numbers), `-v` (show non-printing characters), and `-e` (show `$` at line ends). Handle stdin when no file argument is given. All syscalls must have error-checked return values.

#### Project 1.2 — `threadpool`: A Generic C Thread Pool
- **Concepts required:** pthreads, mutex, condition variables, function pointers, producer/consumer queue, dynamic memory
- **Build tools:** CMake with `-pthread`; AddressSanitizer and ThreadSanitizer build targets
- **WSL2 testing:** ThreadSanitizer must report zero races; run with 1M tasks to stress-test
- **Description:** Thread pool accepting `void (*fn)(void*)` + `void *arg` work items. Configurable worker count. Graceful shutdown that drains the queue before joining threads. Benchmark against sequential execution with matrix multiplication tasks.

#### Project 1.3 — `watchd`: A Simple Process Supervisor Daemon
- **Concepts required:** `fork`/`exec`/`waitpid`, signals, `SIGTERM`/`SIGCHLD`, named pipes or Unix domain sockets for control, daemonization
- **Build tools:** CMake; `systemd` unit file for WSL2 testing
- **WSL2 testing:** Launch `watchd` managing three child processes; kill one; verify restart within 1 second
- **Description:** Reads a config file listing processes to manage. Forks and execs each one. On child exit, logs the exit code and restarts after a configurable delay. Accepts `watchd-ctl stop <name>` commands via a Unix domain socket. This is a minimal `supervisord`.

---

### Tier 2 — Intermediate Systems (Week 7–10)

#### Project 2.1 — `hexdump`: A Feature-Complete Binary Inspector
- **Concepts required:** `mmap`, bitwise operations, struct layout, formatted output, file metadata
- **Build tools:** CMake; `ctest` with golden-file comparison against `/usr/bin/xxd`
- **WSL2 testing:** Run on ELF binaries, image files, and crafted binary test files
- **Description:** Implements `xxd`-compatible hex + ASCII display. Supports `-s offset`, `-l length`, `-e` (endian-swap 32-bit words). Add an ELF section header summary mode: `hexdump --elf binary` prints section names, addresses, and sizes. This forces you to parse raw ELF structures.

#### Project 2.2 — `rbuf`: A Lock-Free Ring Buffer (Single Producer, Single Consumer)
- **Concepts required:** C11 atomics (`_Atomic`, `atomic_load`, `atomic_store`), memory ordering (`memory_order_acquire`, `memory_order_release`), cache line alignment (`__attribute__((aligned(64)))`), performance measurement
- **Build tools:** CMake; ThreadSanitizer must validate; benchmark harness using `clock_gettime`
- **WSL2 testing:** Benchmark at 1M ops/sec across thread counts; compare latency vs mutex-based ring buffer
- **Description:** Single-producer/single-consumer lock-free ring buffer using only acquire/release semantics on head and tail indices. Add cache-line padding between producer-owned and consumer-owned state to eliminate false sharing. Plot throughput vs buffer size.

#### Project 2.3 — `esp32-sensor-node`: First Real Hardware Project
- **Concepts required:** ESP-IDF CMake, FreeRTOS tasks/queues, I2C driver, UART, JSON serialization, `std::optional` (C++)
- **Build tools:** ESP-IDF CMake build system; `idf.py build flash monitor`
- **WSL2 testing:** Host-side mock library that substitutes ESP-IDF HAL calls for unit testing on Linux
- **Hardware:** ESP32 dev board + BME280 or AHT20 temperature/humidity sensor
- **Description:** Three FreeRTOS tasks: (1) sensor task reads BME280 every 500ms via I2C, places `Reading` struct into a queue; (2) format task consumes readings, formats as JSON string; (3) UART output task sends JSON lines at 115200 baud. Watchdog-monitored. Stack watermarks printed to console on startup.

---

### Tier 3 — Advanced Systems (Week 11–14)

#### Project 3.1 — `memtrace`: A Heap Allocation Tracker Using `LD_PRELOAD`
- **Concepts required:** Shared libraries, `dlsym`, `LD_PRELOAD`, function interposition, backtrace (`<execinfo.h>`), thread-local storage, output formatting
- **Build tools:** CMake `SHARED` library target; test with `LD_PRELOAD=./libmemtrace.so ./target_program`
- **WSL2 testing:** Run against `minicat` and `watchd` from earlier projects; verify all allocations are tracked and freed
- **Description:** Shared library that interposes `malloc`, `calloc`, `realloc`, `free`. Records every allocation (address, size, backtrace hash). On `SIGUSR1`, dumps a live allocation report to stderr. On program exit, prints total allocated bytes, peak usage, and any leaked allocations with their call sites. This is how Valgrind-like tools work at user level.

#### Project 3.2 — `softrouter`: A User-Space Packet Filter
- **Concepts required:** Raw sockets (`AF_PACKET`), `pcap` library, struct parsing (Ethernet/IP/TCP headers), netfilter concepts, multi-threading, ring buffers
- **Build tools:** CMake with `libpcap`; `sudo` required for raw socket tests on WSL2
- **WSL2 testing:** Capture loopback traffic from your `minicat`/`watchd` tests; verify packet counts
- **Description:** Captures raw Ethernet frames, parses Ethernet/IP/TCP headers using packed structs, counts packets by (src_ip, dst_ip, dst_port) tuple in an `unordered_map`, and prints a live traffic summary every second. Add a BPF-like filter language with an expression evaluator: `proto TCP and dst_port 8080`.

#### Project 3.3 — `esp32-gateway`: WiFi IoT Data Pipeline
- **Concepts required:** ESP-IDF WiFi (station mode), LwIP TCP sockets, MQTT protocol, FreeRTOS, TLS (mbedTLS), NVS (non-volatile storage), OTA update partitions
- **Build tools:** ESP-IDF CMake; host-side Python MQTT broker (`mosquitto`) for integration testing
- **Hardware:** ESP32 + BME280 sensor + breadboard LED
- **Description:** Extends Project 2.3. Connects to WiFi, establishes TLS MQTT connection to a broker, publishes sensor readings as JSON every 10 seconds, subscribes to a command topic for LED control. Credentials stored in NVS, not hard-coded. Supports OTA firmware update triggered by a special MQTT message. This is production-grade IoT firmware architecture.

---

### Tier 4 — Advanced Architecture (Week 15–16 and Beyond)

#### Project 4.1 — `kmod-chardev`: A Linux Kernel Character Device Driver
- **Concepts required:** Linux kernel module structure, `file_operations`, `copy_to/from_user`, `ioctl`, `misc_register`, `sysfs` attributes, spinlocks, interrupt handlers (software IRQ via `request_irq`)
- **Build tools:** Kbuild system; test with `insmod`/`rmmod` in a Linux VM; `dmesg` for kernel logs
- **Testing:** Python `pytest` suite using `/dev/chardev0` from userspace; fuzz with random ioctl parameters
- **Description:** Implements `/dev/chardev0`, a character device that maintains an in-kernel circular buffer. Userspace can `write` data in and `read` data out. `ioctl(CHARDEV_CLEAR)` clears the buffer. `ioctl(CHARDEV_STATS)` returns a stats struct. Add a `sysfs` attribute that exposes the current buffer fill level. This is the complete driver development workflow.

#### Project 4.2 — `minishell`: A POSIX-Compliant Shell
- **Concepts required:** `fork`/`exec`/`waitpid`, pipes (`dup2`), signal handling, job control (`SIGTSTP`/`SIGCONT`), lexer/parser for shell grammar, `glob.h`, environment variable expansion, heredoc
- **Build tools:** CMake; test against a comprehensive POSIX shell test suite
- **WSL2 testing:** Run your shell inside itself; test with `bash` comparison tests
- **Description:** Implements command execution, pipes (`cmd1 | cmd2 | cmd3`), I/O redirection (`<`, `>`, `>>`), background jobs (`&`), `Ctrl-Z` suspend and `fg`/`bg`, environment variable expansion, and a basic built-in set (`cd`, `exit`, `export`, `unset`, `jobs`). This project ties together every systems programming concept from the roadmap.

#### Project 4.3 — `rtos-os`: A Toy Preemptive RTOS for ARM Cortex-M
- **Concepts required:** ARM Cortex-M architecture, SysTick timer, PendSV exception for context switching, stack frame layout, inline assembly, linker script, startup file, bare-metal C (no libc)
- **Build tools:** `arm-none-eabi-gcc`; QEMU (`qemu-system-arm`) for emulation in WSL2; optional real hardware (STM32 Nucleo board)
- **Testing:** Task switching verified with QEMU semihosting output; cycle-accurate timing with DWT cycle counter
- **Description:** Implements a preemptive round-robin RTOS kernel from scratch: startup code (vector table, `.bss` zero-init, stack setup), SysTick ISR for time slicing, PendSV handler for context switch (save/restore all Cortex-M registers), `task_create`, `task_yield`, `task_delay`, and a minimal mutex using `LDREX`/`STREX` exclusive access instructions. This is the capstone project — connecting every layer from machine instruction to OS abstraction.

---

## Appendix A — Recommended Book Stack (Priority Order)

1. *The C Programming Language* — K&R (2nd Ed.) — read cover-to-cover, twice
2. *Computer Systems: A Programmer's Perspective* — Bryant & O'Hallaron — the undergraduate bible
3. *The Linux Programming Interface* — Kerrisk — the POSIX reference
4. *Effective Modern C++* — Meyers — items are dense, read slowly
5. *Programming with POSIX Threads* — Butenhof — concurrency bible
6. *Linkers and Loaders* — Levine — once you're ready for Phase 4
7. *Making Embedded Systems* — White — accessible embedded intro
8. *Linux Device Drivers* (3rd Ed.) — Corbet et al. — free online; the kernel driver reference

## Appendix B — WSL2-Specific Notes

- **`perf` in WSL2:** The generic perf tool may not work against the WSL2 kernel. Use `valgrind --tool=callgrind` + KCachegrind as an alternative. Or build the WSL2 custom kernel with perf support from `microsoft/WSL2-Linux-Kernel`.
- **Raw sockets in WSL2:** `AF_PACKET` raw sockets require elevated privileges. Use `sudo` or set `CAP_NET_RAW` on the binary with `setcap`.
- **Kernel modules in WSL2:** WSL2's kernel does not support loading arbitrary modules by default. Use a VirtualBox/QEMU Linux VM (Ubuntu) for kernel module development. QEMU can run inside WSL2.
- **Serial ports / USB in WSL2:** Use `usbipd-win` (Windows tool) to forward USB devices (including USB-UART adapters for ESP32) into WSL2. After forwarding, `/dev/ttyUSB0` appears normally.
- **Cross-compilation for ESP32 from WSL2:** Install ESP-IDF into `~/esp/esp-idf`. The `idf.py` tool manages the Xtensa GCC toolchain automatically. Runs natively in WSL2 Ubuntu without Docker.

## Appendix C — Daily Practice Recommendation

| Time | Activity |
|------|----------|
| 30 min | Read (book or paper) |
| 60 min | Write code (topic exercises) |
| 30 min | Read a related open-source project's source (Linux kernel, FreeRTOS, ESP-IDF) |
| 15 min | Write in your learning journal (captures what questions to ask is a skill) |

The most important habit: **every time you write a line of C, ask "what assembly does this compile to?"** Use [godbolt.org](https://godbolt.org) relentlessly. The path from "C programmer" to "systems programmer" is measured in how clearly you can see the machine through the source code.

---

*End of Roadmap — Revision 1.0 | Generated for pvs | April 2026*
