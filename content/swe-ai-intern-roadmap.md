---
title: SWE
draft: true
description:
tags:
  - example-tag
---
# The 6-Month SWE / AI Engineer Intern Roadmap
### *From Basic Web Dev to Highly Competitive Candidate*

> **Author context:** 2nd-year B.Tech CSE | RTX 4060 + Intel i7-14700HX | CachyOS + Windows 11 dual-boot  
> **Target:** Software Engineer / AI Engineer internship at a product-focused tech company  
> **Philosophy:** *Build deeply, not broadly. Every week ships something real.*

---

## Table of Contents

1. [Master Timeline at a Glance](#master-timeline)
2. [Daily Routine Template](#daily-routine)
3. [Phase 1 — Advanced JavaScript & TypeScript (Weeks 1–4)](#phase-1)
4. [Phase 2 — React Ecosystem & Modern Frontend (Weeks 5–10)](#phase-2)
5. [Phase 3 — Backend APIs & Infrastructure (Weeks 11–16)](#phase-3)
6. [Phase 4 — Full-Stack AI Engineering (Weeks 17–22)](#phase-4)
7. [Phase 5 — System Design, Advanced AI & Interview Sprint (Weeks 23–28)](#phase-5)
8. [DSA Daily Track (All 28 Weeks)](#dsa-track)
9. [Portfolio Project Progression](#portfolio-projects)

---

## Master Timeline at a Glance {#master-timeline}

| Phase | Weeks | Core Focus | Milestone Deliverable |
|-------|-------|------------|-----------------------|
| 1 | 1–4 | Advanced JS / TypeScript | Type-safe CLI tool + Event Loop deep-dive blog |
| 2 | 5–10 | React Ecosystem + Next.js | Full-featured SPA with SSR, caching, and testing |
| 3 | 11–16 | FastAPI / Node.js Backend | Deployed REST API with auth, DB, and Docker |
| 4 | 17–22 | LLMs, RAG, Streaming AI | End-to-end AI app with streaming chat + RAG |
| 5 | 23–28 | System Design + Interview Sprint | Mock interviews, final portfolio, system design docs |

---

## Daily Routine Template {#daily-routine}

> Adapt block sizes based on exam/college load. This is the *engineering standard* day.

```
06:30 – 07:00  |  Wake + Review previous day's notes (Obsidian/Zed)
07:00 – 08:30  |  DSA Block — 1 LeetCode problem (targeted by current phase topic)
08:30 – 09:00  |  Breakfast / commute reading (engineering blogs, papers)
09:00 – 12:30  |  DEEP WORK Block 1 — Current week's primary technical topic
12:30 – 13:15  |  Lunch
13:15 – 14:00  |  Read / watch 1 resource from current topic's resource list
14:00 – 17:30  |  DEEP WORK Block 2 — Project implementation / lab exercises
17:30 – 18:00  |  System design reading (30 min, consistent every day from Week 11+)
18:00 – 18:30  |  Break
18:30 – 19:30  |  Review & document (write 1 small blog entry or Obsidian note)
19:30 – 20:00  |  Plan next day's tasks (GitHub issue tracker or Notion board)
```

**Weekend rhythm:**
- Saturday: Longer project session (5–6 hrs), attempt one harder DSA problem
- Sunday: Review week's learnings, write/publish technical blog post, rest

---

---

# PHASE 1 — Advanced JavaScript & TypeScript
## Weeks 1–4

> **Goal:** Move from "I know JS" to "I understand how JS *executes*." TypeScript becomes your default language. Every future project in this roadmap is written in TypeScript.

---

### Week 1–2: JavaScript Engine Internals & The Runtime Model

---

#### Topic: The JavaScript Event Loop & Runtime Execution Model

- **What:** The JS runtime is single-threaded and runs on an event loop composed of the Call Stack, Heap, Web APIs / Node APIs, the Callback Queue (macrotask queue), and the Microtask Queue. V8 compiles JS to bytecode via Ignition and then to optimized machine code via TurboFan (JIT compilation). Understanding this model explains every async behavior, performance bottleneck, and subtle bug you will ever encounter.

- **Why:** In scalable software architecture, misunderstanding the event loop causes dropped frames in UI, blocked I/O in servers, and race conditions in async code. Senior engineers reason about *why* code behaves the way it does, not just *what* it does. This is a non-negotiable mental model.

- **How to start:** Open the browser devtools Performance panel. Record a page load of any site. Find a long task (> 50ms). Identify what's blocking the main thread. Then open Node.js and write a script that deliberately starves the event loop to observe what breaks.

- **What questions to ask:**
  - What is the exact order of execution between a `setTimeout(fn, 0)`, a resolved `Promise.then()`, and a `queueMicrotask()` callback? Why?
  - What does V8's Ignition bytecode interpreter do that a naive interpreter doesn't?
  - What is "hidden class" optimization in V8, and how does adding properties to objects in inconsistent order de-optimize your code?
  - What is the difference between `process.nextTick()` and `Promise.resolve().then()` in Node.js?
  - How does `libuv`'s thread pool interact with the event loop for file I/O vs. network I/O?
  - What is "task starvation" and how does it manifest in a real Node.js server under load?
  - Why does `async/await` not make code parallel — it only makes it *non-blocking*?

- **Standard resources to look into:**
  - **Blogs/Articles:** Jake Archibald's "In The Loop" (jakearchibald.com); V8 blog (v8.dev) — "Ignition: An Interpreter for V8"; Lydia Hallie's "JavaScript Visualized" series (dev.to)
  - **Papers/Docs:** MDN Web Docs — "The Event Loop"; Node.js official docs — "The Node.js Event Loop, Timers, and process.nextTick()"; libuv documentation
  - **Books:** *You Don't Know JS Yet* by Kyle Simpson — "Async & Performance" (Chapters 1–3); *Node.js Design Patterns* by Casciaro & Mammino — Chapter 1
  - **YouTube Playlists:** Philip Roberts — "What the heck is the event loop anyway?" (JSConf EU); Anjana Vakil — "Immutable Data Structures" for adjacent V8 optimization context; Fireship — "JavaScript Under the Hood" series

- **How to get started immediately:**
```javascript
// Paste this in Node.js right now. Predict the output BEFORE running.
console.log('1: script start');

setTimeout(() => console.log('2: setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('3: promise 1'))
  .then(() => console.log('4: promise 2'));

queueMicrotask(() => console.log('5: microtask'));

console.log('6: script end');
// Expected: 1, 6, 3, 5, 4, 2  — can you explain each step?
```

- **Outcomes:**
  - *First pass:* Can explain synchronous vs. asynchronous execution, call stack, and why `setTimeout(fn, 0)` fires after promises.
  - *Second pass:* Can debug a real production-style async bug — e.g., a React `useEffect` that fires in an unexpected order — by tracing the microtask queue mentally.
  - *Third pass:* Write a custom scheduler in Node.js that batches microtasks deliberately, similar to how React 18's concurrent mode batches state updates.

- **What I can learn from it & Resources to generate:**
  - Write a blog post: *"Why Your setTimeout(0) Doesn't Fire Immediately — A V8 Deep Dive"*
  - Build an interactive SVG/canvas visualization of the event loop as a standalone HTML page — open-source it on GitHub
  - Create a cheat sheet: "JS Runtime Mental Model for Interviews" (Excalidraw diagram)

---

#### Topic: Closures, Scope, Prototypal Inheritance & `this` Binding

- **What:** Closures are functions that retain a reference to their *lexical environment* (the scope in which they were defined), even when invoked outside of it. Prototypal inheritance is JavaScript's native object model — every object has an internal `[[Prototype]]` link forming a chain. `this` is a runtime binding determined by call-site context (implicit, explicit via `call/apply/bind`, `new` binding, and the default/global binding), not by where a function is written.

- **Why:** These three concepts underpin every JavaScript abstraction you will ever write or read. React hooks rely on closures for state isolation. Class-based systems rely on prototype chains. Every framework internals document references `this` binding issues. Misunderstanding them makes you unable to debug your own code.

- **How to start:** Take one of your existing JavaScript functions and draw its scope chain on paper. Then trace the prototype chain of a class instance two levels deep.

- **What questions to ask:**
  - What is a "closure leak" and how can it cause memory issues in a long-running Node.js process?
  - What is the difference between `Object.create(proto)` and `new Constructor()`?
  - Why does `this` inside an arrow function refer to the enclosing lexical scope?
  - What does `Function.prototype.bind` actually return?
  - How does JavaScript's `class` syntax desugar to prototype-based code?
  - Why does `const obj = { fn: function() {} }` and `const obj = { fn: () => {} }` have different `this` behavior when used as event handlers?

- **Standard resources to look into:**
  - **Blogs/Articles:** JavaScript.info — "Closures", "Prototypes", "The `this` keyword"
  - **Papers/Docs:** ECMAScript specification sections on LexicalEnvironment and ExecutionContext (for the extremely curious)
  - **Books:** *You Don't Know JS Yet* — "Scope & Closures" (all chapters); "this & Object Prototypes" (all chapters)
  - **YouTube Playlists:** Fireship — "JavaScript Pro Tips"; Fun Fun Function — "Functional Programming in JavaScript" series (closures episodes)

- **How to get started immediately:**
```javascript
// Implement Function.prototype.bind from scratch.
// This forces you to understand closure + this + apply simultaneously.
Function.prototype.myBind = function(context, ...args) {
  const fn = this; // 'this' here is the function being bound
  return function(...callArgs) {
    return fn.apply(context, [...args, ...callArgs]);
  };
};
// Test it:
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const boundGreet = greet.myBind({ name: 'pvs' }, 'Hello');
console.log(boundGreet('!')); // "Hello, pvs!"
```

- **Outcomes:**
  - *First pass:* Can explain how a React `useState` hook uses closures to isolate state per component instance.
  - *Second pass:* Implement a memoization utility (`memoize`) from scratch using closures and a `Map` cache.
  - *Third pass:* Build a minimal dependency injection container using prototypal inheritance and closures — document it as a blog post.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Closures Aren't Magic — Here's How They Work in V8"*
  - Implement and publish a tiny utility library: `scope-utils` — `memoize`, `once`, `partial`, `curry` — all < 50 LOC each, fully typed in TypeScript.

---

### Week 3–4: Advanced TypeScript

---

#### Topic: TypeScript's Type System — Generics, Conditional Types, Template Literal Types

- **What:** TypeScript's type system is a *Turing-complete type-level programming language*. Generics parameterize types (like functions for types). Conditional types (`T extends U ? X : Y`) enable type-level branching. Template literal types (`type Route = \`/api/${string}\``) encode string shapes. Mapped types transform object shapes. `infer` extracts type information within conditional types. Together these form the primitives of advanced type safety used in frameworks like tRPC, Zod, and React's core types.

- **Why:** Type safety is not about satisfying the compiler — it is about making illegal states *unrepresentable*. A well-typed codebase prevents entire categories of bugs at compile time. In production systems, a single type error that slips into runtime can cascade into data corruption. Senior TS engineers write types that serve as *executable documentation*.

- **How to start:** Install `typescript` globally. Go to the TypeScript Playground (typescriptlang.org/play). Pick any utility type from `lib.es5.d.ts` (e.g., `Partial<T>`, `Required<T>`, `ReturnType<T>`) and re-implement it from scratch using only generics and mapped types.

- **What questions to ask:**
  - What is the difference between `interface` and `type` — when does it matter?
  - What is "structural typing" vs. "nominal typing" and how does TS's structural approach affect API design?
  - What is the `infer` keyword and how is it used in `ReturnType<T>` and `Parameters<T>`?
  - How do you write a type that makes certain object keys required based on the value of another key (discriminated unions)?
  - What is `satisfies` (TS 4.9+) and when is it better than a type annotation?
  - How does `const assertion` (`as const`) affect type inference and why is it critical for Redux-style action creators?
  - What is covariance vs. contravariance in TypeScript function parameters?

- **Standard resources to look into:**
  - **Blogs/Articles:** Matt Pocock's Total TypeScript blog (totaltypescript.com) — every article; TypeScript Weekly newsletter; Marius Schulz's TypeScript Evolution series
  - **Papers/Docs:** TypeScript official handbook — "Generics", "Conditional Types", "Mapped Types", "Template Literal Types"; `lib.es5.d.ts` source (read the standard utility types)
  - **Books:** *Effective TypeScript* by Dan Vanderkam — Items 6, 7, 14, 22, 26, 29, 50 (key chapters)
  - **YouTube Playlists:** Matt Pocock — "TypeScript Wizardry" on YouTube; Jack Herrington — "No BS TypeScript" full series

- **How to get started immediately:**
```typescript
// Re-implement these 4 standard utility types from scratch in the TS Playground.
// Use ONLY generics, mapped types, and conditional types. No cheating.

type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never;
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// Now write one that doesn't exist in the stdlib:
// DeepPartial<T> — makes all nested properties optional recursively
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

- **Outcomes:**
  - *First pass:* Can re-implement all standard utility types and write basic generic functions.
  - *Second pass:* Write a type-safe API route builder — a function where calling `route('/users/:id')` returns a typed object with `params: { id: string }`, inferred from the string literal.
  - *Third pass:* Use Zod for runtime schema validation that is 100% type-safe — the Zod inferred type matches the API contract type exactly, no manual duplication.

- **What I can learn from it & Resources to generate:**
  - Blog: *"TypeScript Is a Programming Language Inside a Programming Language"*
  - Open-source project: A type-safe environment variable validator (similar to `t3-env`) built from scratch with Zod + TS generics
  - Architectural diagram: "How tRPC Achieves End-to-End Type Safety" (Excalidraw)

---

#### Topic: Build Tools — Vite, esbuild, Module Systems (ESM vs CJS)

- **What:** A JavaScript build tool transforms source code (TS, JSX, CSS modules, assets) into browser-optimized bundles. Vite leverages native ES modules in development (no bundling, instant HMR) and esbuild/Rollup for production. esbuild is written in Go and is 10–100x faster than webpack due to parallelism and zero-overhead AST transformation. Understanding module systems — CommonJS (`require/module.exports`) vs. ES Modules (`import/export`) — matters because Node.js runs both, and mixing them incorrectly causes runtime errors.

- **Why:** Build tools are the foundation of your entire development experience. Configuration mistakes cause slow CI/CD pipelines, bloated bundles that hurt Core Web Vitals, and subtle production-only bugs from incorrect tree-shaking. Every frontend engineer is expected to be able to debug and optimize a build pipeline.

- **How to start:** Create a new Vite project from scratch (no framework template). Manually configure TypeScript, path aliases, and a CSS module. Then run `vite build --profile` and read the bundle analysis output.

- **What questions to ask:**
  - Why does Vite use esbuild for `dev` but Rollup for `build`? What are the tradeoffs?
  - What is "tree shaking" and why does it only work with static ES module imports?
  - What is the dual CJS/ESM package problem (the "dual package hazard") and how do library authors handle it with `package.json` `exports` field?
  - What is code splitting and how does Vite's Rollup handle dynamic `import()` boundaries?
  - What is a source map and why does it matter for production debugging?
  - What is HMR (Hot Module Replacement) and how does Vite implement it differently from webpack?

- **Standard resources to look into:**
  - **Blogs/Articles:** Vite official docs — "Why Vite"; Evan You's reasoning posts on the Vite GitHub; "Module systems in JavaScript" — Node.js official blog
  - **Papers/Docs:** Rollup docs — "Tree Shaking"; esbuild docs — "Architecture"; Node.js docs — "Modules: ECMAScript modules"
  - **Books:** *JavaScript: The Good Parts* for historical context; *Learning JavaScript Design Patterns* by Addy Osmani (free online) — Module pattern chapter
  - **YouTube Playlists:** Fireship — "Vite in 100 seconds"; Theo (t3.gg) — Build tools deep dives

- **How to get started immediately:**
```bash
# Right now, from scratch — no templates
mkdir vite-from-scratch && cd vite-from-scratch
npm init -y
npm install vite typescript

# Create index.html, src/main.ts manually.
# Configure vite.config.ts with path aliases:
# resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
# Then run: npx vite
# Observe: no bundling step in dev. Now run: npx vite build
# Inspect dist/ — count the chunks. Find the largest one.
```

- **Outcomes:**
  - *First pass:* Configure a Vite + TypeScript project from zero with path aliases and CSS modules.
  - *Second pass:* Write a custom Vite plugin that transforms a `.csv` file import into a typed array of objects at build time.
  - *Third pass:* Benchmark bundle sizes before/after manual code-splitting with `import()`. Write a CI step that fails if bundle exceeds a size budget.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Vite vs. Webpack — Why the Architecture Difference Matters"*
  - Open-source starter: A minimal, opinion-free Vite + TypeScript + CSS Modules template with bundle analysis built in

---

---

# PHASE 2 — React Ecosystem & Modern Frontend
## Weeks 5–10

> **Goal:** Understand React at the architecture level. Build UIs that are fast, testable, and maintainable. Ship a full Next.js application.

---

### Week 5–6: React Core Internals

---

#### Topic: React Fiber Architecture — Reconciliation, Rendering, and Commit

- **What:** React Fiber is the complete rewrite of React's core reconciliation engine (shipped in React 16). Fiber represents a unit of work as a linked-list tree of "fiber nodes." Reconciliation (the "render phase") is now interruptible and asynchronous — React can pause, abort, and resume rendering. The "commit phase" is synchronous and applies DOM mutations. React 18's concurrent features (transitions, `Suspense`, `useDeferredValue`) are built entirely on top of Fiber's ability to yield to the browser between units of work.

- **Why:** Every performance optimization you make in React (`memo`, `useMemo`, `useCallback`, `key` props) is meaningless unless you understand *what triggers a re-render* and *what the reconciler actually does* when comparing old and new fiber trees. This knowledge separates engineers who guess at React performance from those who reason about it.

- **How to start:** Install the React DevTools browser extension. Open any React app. Use the "Profiler" tab — record an interaction. Find the component that took the most time. Identify whether it was a "render" phase or "commit" phase issue.

- **What questions to ask:**
  - What is the difference between the render phase and the commit phase? Which one is safe to have side effects in?
  - What does React's "diffing algorithm" assume about your component tree? (Hint: it's O(n), not O(n³) — why?)
  - Why is the `key` prop critical for list reconciliation and what happens when you use array index as a key?
  - What is a "fiber node" and what fields does it contain? (Look at the React source: `ReactFiber.js`)
  - What is `startTransition` and how does it use Fiber's interruptibility?
  - What does `React.StrictMode` actually do in development and why does it double-invoke render functions?
  - How does `Suspense` suspend a component and what mechanism does it use internally (throwing a Promise)?

- **Standard resources to look into:**
  - **Blogs/Articles:** Lin Clark's "A Cartoon Intro to Fiber" (React Conf 2017 talk + blog); Rodrigo Pombo's "Build Your Own React" (pomb.us); Nir Kaufman's "Inside Fiber: in-depth overview"
  - **Papers/Docs:** React source code — `packages/react-reconciler/`; React official docs — "Render and Commit"; React 18 Changelog
  - **Books:** *Fluent React* by Tejas Kumar — Chapters on reconciliation and fiber
  - **YouTube Playlists:** Jack Herrington — "React 18 Deep Dives"; Theo (t3.gg) — "React Internals"

- **How to get started immediately:**
```tsx
// Build a minimal React from scratch following pomb.us.
// This is the most important exercise in all of Phase 2.
// Start with just createElement and render:

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}
// Continue building: renderToDom -> workLoop -> fiber tree -> hooks
// Goal: implement useState from scratch using a fiber's memoizedState linked list
```

- **Outcomes:**
  - *First pass:* Can build a minimal React with `createElement`, `render`, and a working `useState`.
  - *Second pass:* Add `useEffect` with the correct cleanup timing. Add a reconciliation step that diffs old vs. new fiber trees.
  - *Third pass:* Profile a real production React app, identify an unnecessary re-render, fix it with `memo`/`useMemo`, and write a before/after performance report.

- **What I can learn from it & Resources to generate:**
  - Blog post: *"I Built React From Scratch — Here's What I Learned About Fiber"*
  - Architectural diagram: "The React Render-Commit-Paint Pipeline" (Excalidraw)
  - Open-source: A "React Fiber visualizer" — a dev tool that renders the fiber tree as an interactive graph

---

#### Topic: React Hooks — Rules, Patterns, and Custom Hook Architecture

- **What:** React Hooks are functions that let you "hook into" React state and lifecycle from function components. They work by maintaining a linked list of "hook state" nodes attached to the current fiber node — each call to a hook reads/writes the next node in the list. This is why hooks *must be called in the same order* every render and cannot be inside conditionals. Custom hooks are plain functions prefixed with `use` that compose built-in hooks into reusable, testable logic units.

- **Why:** In production React codebases, the ability to extract complex state logic into well-named, composable custom hooks is the difference between spaghetti component files and clean, maintainable architecture. Custom hooks are the primary unit of logic reuse in modern React — not HOCs, not render props.

- **How to start:** Pick any component you've written before. Extract every piece of business logic (data fetching, form handling, event subscriptions) into named custom hooks. The component JSX should become almost entirely presentation after this.

- **What questions to ask:**
  - Why can't you call a hook inside an `if` statement? What specific internal mechanism breaks?
  - What is a "stale closure" in the context of `useEffect` and `useCallback`? How does `useRef` solve it?
  - What is the difference between `useMemo` and `useCallback`? When is each appropriate?
  - How does `useReducer` differ from `useState` architecturally? When should you prefer it?
  - What does the dependency array of `useEffect` actually do? What happens if you pass `[]` vs. nothing vs. `[dep]`?
  - How do you write a custom hook that synchronizes with an external subscription (e.g., a WebSocket)?
  - What is `useImperativeHandle` and when is it the *correct* tool despite looking like an anti-pattern?

- **Standard resources to look into:**
  - **Blogs/Articles:** Dan Abramov's "A Complete Guide to useEffect" (overreacted.io); "Making Sense of React Hooks" — Dan Abramov
  - **Papers/Docs:** React official docs — "Hooks Reference"; "Escape Hatches" section (useRef, useImperativeHandle)
  - **Books:** *Fluent React* by Tejas Kumar — Hook internals chapters
  - **YouTube Playlists:** Jack Herrington — "Custom Hooks" series; Fireship — "React Hook Form in 100 seconds"

- **How to get started immediately:**
```typescript
// Right now: implement these 3 custom hooks from scratch.
// useDebounce — delays updating a value until N ms have passed
// usePrevious — returns the previous render's value of any variable
// useLocalStorage — syncs state to localStorage with SSR safety

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup — why is this critical?
  }, [value, delay]);
  return debouncedValue;
}
// Now build the other two yourself.
```

- **Outcomes:**
  - *First pass:* Build `useDebounce`, `usePrevious`, `useLocalStorage`, `useEventListener`, `useOnClickOutside`.
  - *Second pass:* Build `useFetch` with loading/error/data states, cancellation via `AbortController`, and deduplication.
  - *Third pass:* Replace `useFetch` with TanStack Query and understand what it gives you for free (caching, background refetching, stale-while-revalidate).

- **What I can learn from it & Resources to generate:**
  - Open-source a custom hooks library: `@pvs/hooks` — ship it to npm with full TypeScript types and a Storybook docs page

---

### Week 7–8: State Management & Data Fetching

---

#### Topic: State Management — Zustand, Redux Toolkit, and the Flux Pattern

- **What:** Global state management solves the problem of sharing state between components without prop drilling. The Flux pattern (unidirectional data flow: Action → Dispatcher → Store → View) was invented by Facebook specifically for React. Redux Toolkit (RTK) is the modern, opinionated Redux — it eliminates boilerplate with `createSlice` and uses Immer for immutable updates. Zustand is a minimal (~1KB) state manager using closures and React's `useSyncExternalStore` hook under the hood. Jotai and Recoil offer atomic state models.

- **Why:** Choosing the right state management strategy significantly impacts application performance and maintainability. Server state (data from APIs) should be managed by TanStack Query, not Redux. Client UI state (modal open/closed, theme) belongs in Zustand or Context. Forms belong in React Hook Form. Putting everything in Redux is a classic junior mistake.

- **How to start:** Build a shopping cart. First implement it with `useState` + prop drilling (feel the pain). Then lift it to Context (see the re-render problem). Then move it to Zustand. Observe the difference in re-render counts via React DevTools Profiler.

- **What questions to ask:**
  - What is the "Context re-render problem" and why does moving state to Zustand fix it?
  - What does Immer's `produce` function do under the hood to enable "mutative" immutable updates?
  - What is the difference between Zustand's `subscribe` and `getState` for non-React usage?
  - Why is server state (API data) fundamentally different from client state, and why should it live in a separate layer?
  - What is the "selector pattern" in Redux and why does it exist? What does `reselect` provide?
  - When would you choose Redux Toolkit over Zustand in 2025?

- **Standard resources to look into:**
  - **Blogs/Articles:** Daishi Kato's blog (Zustand/Jotai author); Lenz Weber-Tronic's Redux posts on dev.to; Theo's "You Might Not Need Redux" article
  - **Papers/Docs:** Redux Toolkit docs; Zustand GitHub README (it's surprisingly comprehensive); Flux original documentation
  - **Books:** No dedicated book — RTK and Zustand docs are the best resource
  - **YouTube Playlists:** Jack Herrington — "Redux vs Zustand vs Jotai"; Theo — "State Management in 2024"

- **How to get started immediately:**
```typescript
// Build a Zustand store for a shopping cart RIGHT NOW.
// This is 30 lines that teaches you 80% of what you need to know.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem { id: string; name: string; price: number; qty: number; }
interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  total: () => number;
}
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set(state => ({
        items: state.items.some(i => i.id === item.id)
          ? state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
          : [...state.items, { ...item, qty: 1 }]
      })),
      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

- **Outcomes:**
  - *First pass:* Shopping cart with Zustand + `persist` middleware.
  - *Second pass:* Add RTK Query for fetching product catalog — observe how it coexists with Zustand without conflict.
  - *Third pass:* Build a complex form flow (multi-step checkout) where each step's state is a Zustand slice with validation.

- **What I can learn from it & Resources to generate:**
  - Blog: *"The Four Types of State in React and Where Each One Belongs"*
  - Architectural diagram: "State Management Decision Tree for React Apps in 2025"

---

#### Topic: TanStack Query (React Query) — Server State & Caching

- **What:** TanStack Query is a server-state management library that handles fetching, caching, background refetching, and synchronization of asynchronous data. It implements the `stale-while-revalidate` (SWR) caching strategy — serve stale cached data immediately while refetching in the background. It manages request deduplication, cache invalidation, optimistic updates, infinite queries, and prefetching. Under the hood it's a `QueryClient` (a cache store) + hooks that subscribe to cache entries.

- **Why:** Without a library like TanStack Query, engineers manually implement loading states, error states, caching, and refetching — and they almost always do it incorrectly (race conditions, memory leaks from unmounted components, no deduplication). TanStack Query solves the server state problem completely and its mental model is foundational to understanding Next.js's data fetching model.

- **How to start:** Take any `useEffect` + `fetch` combination you've written. Replace it entirely with `useQuery`. Observe: automatic loading/error states, automatic refetch on window focus, and zero memory leaks on unmount.

- **What questions to ask:**
  - What is `stale-while-revalidate` and how does TanStack Query implement it with `staleTime` and `gcTime`?
  - How does query deduplication work? What happens if two components `useQuery` with the same key simultaneously?
  - What is the difference between `invalidateQueries` and `refetchQueries`?
  - How do optimistic updates work in `useMutation` and what happens if the mutation fails?
  - What is the `queryKey` factory pattern and why is it important for cache management in large apps?
  - How does `useInfiniteQuery` differ from `useQuery` in terms of data structure?

- **Standard resources to look into:**
  - **Blogs/Articles:** TkDodo's "Practical React Query" series (tkdodo.eu/blog) — read ALL of them; they are the definitive reference
  - **Papers/Docs:** TanStack Query official docs; TanStack Query v5 migration guide (significant API changes)
  - **Books:** No dedicated book — TkDodo's blog + official docs are comprehensive
  - **YouTube Playlists:** Jack Herrington — "React Query" series; Dominik Dorfmeister (TkDodo) conference talks

- **How to get started immediately:**
```typescript
// Replace a useEffect fetch with useQuery. Right now.
// BEFORE (your old pattern — broken in many subtle ways):
// useEffect(() => { fetch('/api/users').then(r => r.json()).then(setUsers) }, []);

// AFTER:
import { useQuery } from '@tanstack/react-query';
const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],           // cache key — must be serializable
  queryFn: () => fetch('/api/users').then(r => {
    if (!r.ok) throw new Error('Network error');
    return r.json();
  }),
  staleTime: 60 * 1000,         // data is "fresh" for 1 minute
});
// Now add a mutation for creating a user with optimistic update.
```

- **Outcomes:**
  - *First pass:* Replace all `useEffect` fetches in a project with `useQuery`.
  - *Second pass:* Add `useMutation` with optimistic updates for a create/update operation.
  - *Third pass:* Implement infinite scroll with `useInfiniteQuery` + `IntersectionObserver`.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Why TanStack Query Makes useEffect Fetching Look Like a Bug"*
  - Architectural diagram: "TanStack Query Cache Lifecycle: Stale → Fetch → Fresh → Garbage Collected"

---

### Week 9–10: Next.js App Router & Testing

---

#### Topic: Next.js App Router — RSC, Streaming, Server Actions

- **What:** Next.js App Router (introduced in Next.js 13, stable in 14) is a file-system-based routing system built on React Server Components (RSC). RSC is a new React primitive: components that render *exclusively on the server* and stream HTML to the client — they have zero JavaScript bundle contribution. The App Router introduces: `layout.tsx` for nested layouts, `loading.tsx` for streaming Suspense boundaries, `error.tsx` for error boundaries, Server Actions for mutating data directly from server components without explicit API routes, and `use cache` for granular data caching.

- **Why:** Next.js App Router is the production standard for full-stack React applications in 2024–2025. Understanding RSC is mandatory because it fundamentally changes how you think about data fetching (fetch on the server, not the client), bundle sizes (server components ship zero JS), and security (secrets never leave the server). This is the architecture you will encounter at every modern tech company.

- **How to start:** Read the "Thinking in Server Components" guide from the Next.js docs. Then build one page: a blog post page where the post content is a Server Component (fetches from DB) and the like button is a Client Component.

- **What questions to ask:**
  - What is the fundamental difference between a React Server Component and a traditional SSR component?
  - Why can RSC never use `useState` or browser APIs? What does this mean architecturally?
  - How does Next.js implement "partial prerendering" — rendering static shells with dynamic RSC "holes"?
  - What is the "React Server Component payload" (RSC payload) and how does it differ from HTML?
  - What are Server Actions and how do they ensure security if the action function is server-only?
  - How does `use cache` differ from the old `getStaticProps` caching model?
  - How do you handle authentication in the App Router? Where does middleware run?

- **Standard resources to look into:**
  - **Blogs/Articles:** Vercel Engineering Blog — "Understanding React Server Components"; Josh Comeau — "Making Sense of React Server Components"; Lee Robinson's Next.js posts on vercel.com/blog
  - **Papers/Docs:** Next.js official docs (App Router section — read every page); React RSC RFC on GitHub
  - **Books:** No dedicated book yet — docs are the source of truth
  - **YouTube Playlists:** Theo — "Next.js App Router Deep Dives"; Jack Herrington — "RSC & App Router Masterclass"

- **How to get started immediately:**
```bash
npx create-next-app@latest my-app --typescript --app --tailwind
# Then immediately:
# 1. Create app/products/page.tsx as a SERVER component that fetches products
# 2. Create app/products/[id]/page.tsx with generateStaticParams
# 3. Create components/AddToCart.tsx as a CLIENT component ('use client')
# 4. Pass server-fetched product data as props to the client component
# Notice: the server component has no bundle size contribution.
# Use "next build" then check .next/analyze to verify.
```

- **Outcomes:**
  - *First pass:* A blog site with RSC for content, Client Components for interactive widgets, and `loading.tsx` Suspense boundaries.
  - *Second pass:* Add Server Actions for a contact form — no explicit API route needed. Validate with Zod.
  - *Third pass:* Add Partial Prerendering, an edge middleware for auth, and an ISR strategy for blog posts.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Server Components Changed How I Think About React — A First-Principles Breakdown"*
  - Architectural diagram: "Next.js App Router Request Lifecycle: Edge → RSC → Client Hydration"

---

#### Topic: Frontend Testing — Vitest, React Testing Library, Playwright

- **What:** A modern frontend test suite has three layers: Unit tests (pure functions, hooks — using Vitest), Integration/Component tests (rendering components with user interactions — using React Testing Library following "test as a user" principles), and End-to-End tests (full user flows in a real browser — using Playwright). React Testing Library's core philosophy is to test *behavior*, not *implementation* — query by accessible role, not by CSS class.

- **Why:** Un-tested UIs become unmaintainable at scale. Tests are the documentation that doesn't lie. In professional codebases, a PR without tests for new behavior is rejected. In interviews, being able to discuss testing strategy (what to test, what NOT to test, the testing pyramid) is a significant differentiator.

- **How to start:** Pick one custom hook you've already built (`useDebounce`). Write a Vitest unit test for it using `@testing-library/react-hooks`. Then write an RTL integration test for a component that uses it.

- **What questions to ask:**
  - What is "testing implementation details" and why does RTL actively discourage it?
  - What is the difference between `getBy`, `queryBy`, and `findBy` in RTL?
  - How do you test a component that makes an API call? (Mock Service Worker vs. `jest.mock`)
  - What is Mock Service Worker (MSW) and why is it superior to mocking `fetch` directly?
  - When is an E2E test appropriate vs. an integration test?
  - What is "test isolation" and why does each test need to clean up after itself?

- **Standard resources to look into:**
  - **Blogs/Articles:** Kent C. Dodds — "Common mistakes with React Testing Library"; "Write tests. Not too many. Mostly integration."; Testing Trophies article
  - **Papers/Docs:** Vitest docs; React Testing Library docs; Playwright docs; MSW v2 docs
  - **Books:** *Testing JavaScript* by Kent C. Dodds (testingjavascript.com)
  - **YouTube Playlists:** Laith Harb — "React Testing Library Full Course"; Jack Herrington — "Playwright" series

- **How to get started immediately:**
```typescript
// Write your first RTL test right now.
// Test: does a button increment a counter when clicked?
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

test('increments counter on button click', () => {
  render(<Counter initialValue={0} />);
  expect(screen.getByRole('heading', { name: /count: 0/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByRole('heading', { name: /count: 1/i })).toBeInTheDocument();
});
// Notice: no CSS selectors. No implementation details. Pure user-facing behavior.
```

- **Outcomes:**
  - *First pass:* Unit tests for all custom hooks. Integration tests for key interactive components.
  - *Second pass:* MSW integration for API-dependent components. Testing async states (loading, error, success).
  - *Third pass:* Playwright E2E tests for critical user flows (auth, checkout). GitHub Actions CI pipeline running all three test layers.

- **What I can learn from it & Resources to generate:**
  - Blog: *"The Testing Pyramid for Frontend Engineers — What Actually Belongs Where"*

---

---

# PHASE 3 — Backend APIs & Infrastructure
## Weeks 11–16

> **Goal:** Build production-quality backend services. Understand HTTP deeply. Own the full stack from browser to database to Docker container.

---

### Week 11–12: FastAPI & REST API Architecture

---

#### Topic: FastAPI — Async Python Web Framework

- **What:** FastAPI is a modern, high-performance Python web framework built on top of Starlette (ASGI) and Pydantic. It uses Python type hints for automatic request validation, serialization, and OpenAPI schema generation. It is fully async-native — route handlers can be `async def`, enabling non-blocking I/O for database calls and HTTP requests. It is one of the fastest Python frameworks (benchmarks comparable to Go/Node.js) due to its ASGI foundation and minimal overhead.

- **Why:** FastAPI is the de facto standard for Python AI/ML backends in 2024–2025 because it integrates naturally with the Python ML ecosystem (PyTorch, transformers, LangChain) while providing production-grade HTTP handling. Virtually every AI API backend you will build in Phase 4 will use FastAPI as its foundation.

- **How to start:** Build a `/api/predict` endpoint that takes a JSON body, runs a simple calculation (or a sklearn prediction), and returns a typed response. Define the request/response models with Pydantic and observe the auto-generated `/docs` OpenAPI UI.

- **What questions to ask:**
  - What is ASGI (Asynchronous Server Gateway Interface) and how does it differ from WSGI?
  - What is Pydantic v2 and how does it use Rust under the hood for validation performance?
  - When should you use `async def` vs. regular `def` for a FastAPI route? What happens if you block in an async route?
  - What is a FastAPI dependency (`Depends`) and how does it implement a form of dependency injection?
  - How does FastAPI's OpenAPI generation work? What is the difference between `response_model` and the return type annotation?
  - What is background tasks in FastAPI and when would you use it vs. a proper task queue (Celery/Redis)?
  - How do you handle database sessions safely with FastAPI's dependency system?

- **Standard resources to look into:**
  - **Blogs/Articles:** FastAPI official tutorial (fastapi.tiangolo.com) — read cover to cover; Redowan Delowar's FastAPI architecture posts
  - **Papers/Docs:** FastAPI docs; Starlette docs; Pydantic v2 docs; ASGI spec (asgi.readthedocs.io)
  - **Books:** *FastAPI* by Bill Lubanovic (O'Reilly); *Architecture Patterns with Python* by Percival & Gregory — for structuring large FastAPI apps
  - **YouTube Playlists:** ArjanCodes — "FastAPI Best Practices"; Patrick Loeber — "FastAPI Crash Course"

- **How to get started immediately:**
```python
# Build this in the next 10 minutes.
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="My First API", version="0.1.0")

class TextInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    language: str = Field(default="en")

class AnalysisResult(BaseModel):
    word_count: int
    char_count: int
    unique_words: int

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_text(body: TextInput) -> AnalysisResult:
    words = body.text.split()
    return AnalysisResult(
        word_count=len(words),
        char_count=len(body.text),
        unique_words=len(set(words))
    )
# Run: uvicorn main:app --reload
# Visit: http://localhost:8000/docs — observe the auto-generated UI
```

- **Outcomes:**
  - *First pass:* A text analysis API with Pydantic validation and OpenAPI docs.
  - *Second pass:* Add a PostgreSQL database with SQLAlchemy async sessions and a dependency-injected DB connection.
  - *Third pass:* Add rate limiting, structured logging (structlog), health check endpoints, and Dockerize with a multi-stage `Dockerfile`.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Why FastAPI Is the Perfect Backend for AI/ML Applications"*
  - Architectural diagram: "FastAPI Request Lifecycle: ASGI → Router → Dependency → Handler → Pydantic → Response"

---

#### Topic: REST API Design — HTTP Semantics, Versioning, Error Handling

- **What:** REST (Representational State Transfer) is an architectural style for distributed hypermedia systems defined by Roy Fielding in his 2000 dissertation. REST over HTTP uses the HTTP method semantics (GET = read/idempotent, POST = create, PUT = replace, PATCH = partial update, DELETE = remove), status codes (2xx success, 4xx client error, 5xx server error), and resources as the primary abstraction. A well-designed REST API is self-documenting, cache-friendly, and predictable.

- **Why:** REST API design is a core interviewing and real-world skill. Poorly designed APIs create cascading problems: clients over-fetch, under-fetch, break on updates, or make ambiguous requests. At scale, API design mistakes become expensive to fix — versioning, deprecation cycles, and client-side workarounds accumulate into technical debt.

- **How to start:** Design the REST API for a blogging platform on paper *before* writing any code. Define all resources, endpoints, HTTP methods, status codes, and error response shapes. Then critique your own design for idempotency, cacheability, and consistency.

- **What questions to ask:**
  - What makes an HTTP method "idempotent"? Which methods are idempotent and which are not?
  - What is the difference between `PUT` and `PATCH`? When should you use each?
  - How should you version a REST API? URI versioning vs. header versioning — tradeoffs?
  - What is HATEOAS and is it practical in 2025?
  - How do you design pagination that is cursor-based vs. offset-based? When does each fail?
  - What is the correct HTTP status code for "resource not found in a nested route" vs. "authentication required"?
  - What is idempotency key for POST requests and when do you need it (payment APIs)?

- **Standard resources to look into:**
  - **Blogs/Articles:** Stripe's API design documentation (stripe.com/docs/api — read it as a design reference, not just docs); Zalando's RESTful API Guidelines; Google's API Design Guide (aip.dev)
  - **Papers/Docs:** Roy Fielding's REST dissertation (ics.uci.edu — Chapter 5); RFC 7231 (HTTP/1.1 Semantics)
  - **Books:** *RESTful Web APIs* by Leonard Richardson — Chapters 1–5; *Designing Data-Intensive Applications* by Kleppmann — Chapter 4 (encoding and APIs)
  - **YouTube Playlists:** Arpit Bhayani — REST API design talks; ByteByteGo — API design videos

- **How to get started immediately:**
```
# Paper exercise — RIGHT NOW, no code:
# Design a REST API for a Twitter-like service.
# Define:
# - Resources: users, tweets, follows, likes, timelines
# - Endpoints: at least 10, with correct HTTP methods
# - Status codes for: success, not found, unauthorized, conflict, validation error
# - Pagination strategy: cursor-based for timeline (why not offset?)
# - Error response shape: { error: { code: string, message: string, details?: {} } }
# Time yourself: 20 minutes max.
# Then compare to the Twitter/X v2 API docs and see what you missed.
```

- **Outcomes:**
  - *First pass:* Design and implement a CRUD REST API with proper status codes and error responses.
  - *Second pass:* Add cursor-based pagination, field filtering (`?fields=id,name`), and `ETag`-based caching.
  - *Third pass:* Add API versioning strategy, deprecation headers, and generate an OpenAPI spec that could be published.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Designing REST APIs That Don't Make Developers Angry — Lessons from Stripe"*
  - Open-source: A FastAPI REST API starter kit with cursor pagination, versioning, structured error responses, and OpenAPI export

---

### Week 13–14: Databases & Authentication

---

#### Topic: PostgreSQL — Relational Databases, Indexes, and Query Planning

- **What:** PostgreSQL is an open-source, ACID-compliant relational database that supports complex queries, window functions, CTEs, JSON/JSONB columns, full-text search, and range types. Understanding the storage engine (heap files, TOAST, WAL), query planner (`EXPLAIN ANALYZE`), and indexing (B-tree, GIN, BRIN, partial indexes, covering indexes) is critical for writing queries that scale to millions of rows without becoming performance bottlenecks.

- **Why:** The database is almost always the bottleneck in a scaled web application. A 10x query optimization through an index addition or query rewrite costs nothing and is worth more than scaling horizontally. Every backend engineer is expected to understand SQL deeply — not just CRUD, but joins, aggregations, window functions, and query planning.

- **How to start:** Install PostgreSQL locally. Create a table with 1 million rows (use `generate_series`). Run a `SELECT` without an index and read the `EXPLAIN ANALYZE` output. Add an appropriate index. Re-run and compare the execution plan.

- **What questions to ask:**
  - What is the difference between a sequential scan and an index scan in PostgreSQL's query planner?
  - What is a B-tree index and why is it the default? When would you use a GIN index instead?
  - What is a "covering index" (or index-only scan) and when does it eliminate a heap access?
  - What is MVCC (Multi-Version Concurrency Control) and how does PostgreSQL use it to implement ACID transactions?
  - What is `EXPLAIN ANALYZE` vs. `EXPLAIN` and what do the key output fields mean (Seq Scan, rows, width, actual time)?
  - What is the N+1 query problem and how do you solve it in an ORM context?
  - What is connection pooling (PgBouncer) and why is it necessary for production PostgreSQL?

- **Standard resources to look into:**
  - **Blogs/Articles:** Brandur's "Building a Robust Live Reloading Server in Go" — PostgreSQL sections; Cybertec PostgreSQL blog; Laurenz Albe's PostgreSQL articles; Use The Index, Luke (use-the-index-luke.com) — entire site
  - **Papers/Docs:** PostgreSQL official docs — "The Query Planner", "Indexes"; `EXPLAIN` documentation; PostgreSQL MVCC documentation
  - **Books:** *Designing Data-Intensive Applications* by Kleppmann — Chapter 3 (storage engines), Chapter 7 (transactions); *PostgreSQL: Up and Running* by Regina Obe
  - **YouTube Playlists:** Hussein Nasser — "PostgreSQL" playlist; Arpit Bhayani — Database engineering series

- **How to get started immediately:**
```sql
-- Run this RIGHT NOW in psql. Generate test data and measure.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (email, name)
SELECT 'user' || i || '@example.com', 'User ' || i
FROM generate_series(1, 1000000) AS s(i);

-- Query WITHOUT index — note the time:
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user500000@example.com';
-- Note: "Seq Scan" — reads ALL rows

-- Add the index:
CREATE INDEX idx_users_email ON users(email);

-- Query WITH index — compare:
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user500000@example.com';
-- Note: "Index Scan" — reads 1 row. What's the speedup?
```

- **Outcomes:**
  - *First pass:* Design a normalized schema with foreign keys. Query with JOINs. Understand `EXPLAIN`.
  - *Second pass:* Add partial indexes, composite indexes. Identify and fix an N+1 query using `JOIN` or `IN` clause.
  - *Third pass:* Set up PgBouncer for connection pooling. Use `pg_stat_statements` to identify the slowest queries in a running app.

- **What I can learn from it & Resources to generate:**
  - Blog: *"I Generated 1 Million Rows and Learned More About Indexes Than Any Tutorial Taught Me"*
  - Architectural diagram: "PostgreSQL Index Types Decision Tree"

---

#### Topic: Authentication & Authorization — JWT, OAuth 2.0, Session Management

- **What:** Authentication (who are you?) and authorization (what can you do?) are distinct concerns. JWT (JSON Web Tokens) are self-contained, stateless tokens: a Base64-encoded header + payload + HMAC/RSA signature. They are "bearer tokens" — whoever holds one can authenticate. OAuth 2.0 is an authorization *framework* (not a protocol) for delegated access — it enables "Login with Google." OpenID Connect (OIDC) is a thin identity layer on top of OAuth 2.0. Session-based auth stores state server-side; JWT is stateless but can't be revoked without a blocklist.

- **Why:** Auth is the security foundation of every web application. Getting it wrong has catastrophic consequences. JWT vulnerabilities (the `alg: none` attack, weak secret keys, missing expiry) are common CVEs. Understanding OAuth 2.0 flows (Authorization Code + PKCE for SPAs, Client Credentials for machine-to-machine) is mandatory for integrating third-party services.

- **How to start:** Implement JWT auth from scratch in FastAPI — no library magic. Manually: sign a token, encode the payload, verify the signature on each request. Then intentionally break it (use `alg: none`) and see what happens.

- **What questions to ask:**
  - What are the three parts of a JWT and what does each contain?
  - Why is storing JWTs in `localStorage` a security risk vs. `HttpOnly` cookies?
  - What is the `alg: none` vulnerability and how does it arise?
  - What is PKCE (Proof Key for Code Exchange) and why is it necessary for SPAs using OAuth?
  - What is the difference between access tokens and refresh tokens? Why do access tokens have short lifetimes?
  - How do you implement JWT revocation without a server-side blocklist (hint: you can't really — discuss the tradeoffs)?
  - What is the OAuth 2.0 Authorization Code flow, step by step?

- **Standard resources to look into:**
  - **Blogs/Articles:** Auth0 blog — "JWT Security Best Practices", "OAuth 2.0 Flows Explained"; Okta Developer blog; "Stop using JWT for sessions" — joepie91's article (a key counterpoint)
  - **Papers/Docs:** RFC 6749 (OAuth 2.0); RFC 7519 (JWT); OWASP Authentication Cheat Sheet; OWASP Session Management Cheat Sheet
  - **Books:** *The Web Application Hacker's Handbook* — auth chapters; *OAuth 2.0 in Action* by Justin Richer
  - **YouTube Playlists:** Hussein Nasser — "Auth" playlist; ByteByteGo — "Session vs JWT" video

- **How to get started immediately:**
```python
# Implement JWT auth in FastAPI from scratch RIGHT NOW.
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt  # PyJWT
from datetime import datetime, timedelta, UTC

SECRET_KEY = "your-secret-must-be-long-and-random-in-production"
ALGORITHM = "HS256"

def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(UTC) + timedelta(minutes=30),
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

- **Outcomes:**
  - *First pass:* JWT login/register with password hashing (bcrypt). Protected routes via `Depends`.
  - *Second pass:* Add refresh token rotation. Store refresh tokens in DB. Implement logout (token blocklist in Redis).
  - *Third pass:* Add OAuth 2.0 "Login with GitHub" using Authorization Code + PKCE. Use `authlib` library.

- **What I can learn from it & Resources to generate:**
  - Blog: *"JWT is Not a Session — The Security Tradeoffs Nobody Tells You About"*

---

### Week 15–16: Docker & Deployment Fundamentals

---

#### Topic: Docker & Containerization — Images, Layers, Compose, Multi-Stage Builds

- **What:** Docker is a containerization platform that packages an application and its dependencies into a *container* — an isolated, reproducible runtime environment using Linux namespaces and cgroups. A Docker image is a read-only layered filesystem. Each `RUN`, `COPY`, `ADD` instruction in a `Dockerfile` creates a new layer, cached by Docker's build engine. Multi-stage builds allow you to use a large build image (with compilers, dev dependencies) to produce artifacts, then copy only the artifacts into a minimal runtime image — dramatically reducing final image size.

- **Why:** "It works on my machine" is not a deployment strategy. Containers are the universal packaging format for modern software. Every cloud deployment (AWS ECS, GCP Cloud Run, Railway, Render, Vercel) ultimately runs containers. Understanding image optimization (layer caching, multi-stage builds, `.dockerignore`) directly impacts CI/CD pipeline speed and cloud costs.

- **How to start:** Dockerize your FastAPI app. First do it naively (just `FROM python:3.12`, copy everything, install everything). Measure the image size. Then rewrite it with a multi-stage build. Compare sizes. Inspect layers with `docker image history`.

- **What questions to ask:**
  - What is the difference between a Docker image and a Docker container?
  - How does Docker layer caching work and how should you order `Dockerfile` instructions to maximize cache hits?
  - What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?
  - Why should you never run processes as root inside a Docker container in production?
  - What is `docker-compose` and when is it appropriate vs. Kubernetes?
  - What is a `.dockerignore` file and what happens if you forget to include `node_modules` in it?
  - How does Docker networking work? What is the difference between `bridge`, `host`, and `overlay` networks?

- **Standard resources to look into:**
  - **Blogs/Articles:** Docker official blog — "Best practices for writing Dockerfiles"; Fly.io blog on containerization; Brendan Burns's articles on containers
  - **Papers/Docs:** Docker official docs; OCI (Open Container Initiative) spec; `docker buildkit` docs
  - **Books:** *Docker Deep Dive* by Nigel Poulton; *Kubernetes in Action* by Marko Luksa — first two chapters for context
  - **YouTube Playlists:** TechWorld with Nana — "Docker Tutorial for Beginners" (complete course); NetworkChuck — Docker series

- **How to get started immediately:**
```dockerfile
# Stage 1: Multi-stage FastAPI Dockerfile — write this RIGHT NOW
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim AS runtime
# Security: run as non-root user
RUN useradd --create-home --no-log-init appuser
USER appuser
WORKDIR /home/appuser/app
COPY --from=builder /root/.local /home/appuser/.local
COPY . .
ENV PATH=/home/appuser/.local/bin:$PATH
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# Build: docker build -t my-api .
# Check size: docker image ls my-api
# Target: under 200MB. Compare to naive build (~800MB).
```

- **Outcomes:**
  - *First pass:* Dockerize FastAPI app. Dockerize Next.js app. Run both with `docker-compose`.
  - *Second pass:* Add PostgreSQL + Redis services to `docker-compose.yml`. Set up volumes for data persistence.
  - *Third pass:* Write a GitHub Actions workflow that builds, tests, and pushes your Docker image to GitHub Container Registry on every push to `main`.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Multi-Stage Docker Builds — How I Cut My Image Size by 75%"*
  - Open-source: A `docker-compose.yml` template for the standard full-stack AI stack (FastAPI + Next.js + PostgreSQL + Redis + pgAdmin)

---

---

# PHASE 4 — Full-Stack AI Engineering
## Weeks 17–22

> **Goal:** Build production AI features — not toy demos. Streaming, RAG, vector search, model evaluation. This phase is what gets you the AI Engineer title.

---

### Week 17–18: LLM APIs & Prompt Engineering

---

#### Topic: LLM APIs — OpenAI, Anthropic, and the Chat Completions Interface

- **What:** Large Language Models (LLMs) are transformer-based neural networks trained on massive text corpora via next-token prediction. The Chat Completions API exposes them as a stateless HTTP endpoint: you send an array of `messages` (system, user, assistant) and receive a completion. Key parameters: `temperature` (0–2, controls randomness/creativity), `max_tokens` (hard limit on output), `top_p` (nucleus sampling), `frequency_penalty`, `presence_penalty`. The API is inherently stateless — you must send the entire conversation history on every request. Function calling / tool use extends the interface to allow structured outputs and agent-like behaviors.

- **Why:** LLM APIs are the foundational primitive of AI engineering in 2024–2025. Understanding the API semantics — token limits, context windows, cost estimation, latency characteristics, and error modes (rate limiting, context overflow) — is the baseline for every AI feature you will build.

- **How to start:** Sign up for the Anthropic API. Build a minimal chat interface in 30 lines of Python — no frameworks. Manually count tokens using `tiktoken`. Intentionally overflow the context window and handle the error.

- **What questions to ask:**
  - What is a "token" in the context of LLMs and how does tokenization affect cost and context limits?
  - Why does higher `temperature` increase creativity but also increase hallucination risk?
  - What is "context window" and why is managing it explicitly important in a multi-turn chat application?
  - How does function calling / tool use work under the hood? What does the model actually return?
  - What is the difference between streaming (`stream: true`) and non-streaming completions? Why does streaming matter for UX?
  - What are the tradeoffs between prompt length and response quality?
  - How do you implement reliable structured output (e.g., always returning valid JSON) from an LLM?

- **Standard resources to look into:**
  - **Blogs/Articles:** Anthropic's "Prompt Engineering Guide" (docs.anthropic.com); Lilian Weng's "Prompting" blog post (lilianweng.github.io); Simon Willison's blog (simonwillison.net); Eugene Yan's AI engineering posts
  - **Papers/Docs:** Anthropic API docs; OpenAI API docs; "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (Wei et al.); OpenAI tokenizer docs
  - **Books:** *Building LLM-Powered Applications* by Valentina Alto; *AI Engineering* by Chip Huyen (2024)
  - **YouTube Playlists:** Andrej Karpathy — "Let's Build GPT" (for fundamentals); Prompt Engineering Guide YouTube channel; Fireship — AI integration videos

- **How to get started immediately:**
```python
# Build a minimal streaming chat TONIGHT.
import anthropic
client = anthropic.Anthropic()  # ANTHROPIC_API_KEY from env

def stream_chat(messages: list[dict]) -> None:
    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="You are a helpful engineering assistant.",
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
    print()  # newline at end

history = []
while True:
    user_input = input("You: ")
    history.append({"role": "user", "content": user_input})
    print("Claude: ", end="")
    stream_chat(history)
    # TODO: append the assistant response to history — how do you get it?
```

- **Outcomes:**
  - *First pass:* CLI chat with streaming, conversation history, and graceful context overflow handling.
  - *Second pass:* Add function/tool calling — a `search_web` tool that the LLM can invoke to answer real-time questions.
  - *Third pass:* Build a structured output pipeline: prompt the LLM to always return a specific JSON schema, validate with Pydantic, and retry on parse failure.

- **What I can learn from it & Resources to generate:**
  - Blog: *"LLM APIs Are Not Magic — Here's What's Actually Happening Under the Hood"*
  - Architectural diagram: "The Token Economy: Context Window Management in Multi-Turn Chat"

---

### Week 19–20: RAG — Retrieval-Augmented Generation

---

#### Topic: RAG Architecture — Embeddings, Vector Databases, and the Retrieval Pipeline

- **What:** Retrieval-Augmented Generation (RAG) grounds LLM responses in a specific knowledge base (documents, code, databases) by first *retrieving* relevant context and then *augmenting* the prompt with that context before generation. The pipeline: (1) **Ingestion** — chunk documents, generate embedding vectors for each chunk using an embedding model (e.g., `text-embedding-3-large`), store vectors in a vector database. (2) **Retrieval** — at query time, embed the user query, perform approximate nearest-neighbor (ANN) search to find top-K similar chunks. (3) **Generation** — inject retrieved chunks into the LLM prompt as context.

- **Why:** LLMs have a knowledge cutoff and cannot access your private data. RAG is the production solution for building AI systems over domain-specific knowledge (company docs, codebases, research papers). It is far cheaper than fine-tuning and more updatable. Understanding RAG deeply — chunking strategies, embedding model choice, re-ranking, hybrid search — is a core AI engineering skill.

- **How to start:** Take 10 markdown files (your own notes or this roadmap document). Build a minimal RAG pipeline with no external RAG framework: chunk → embed → store in SQLite with `sqlite-vss` → query → generate. Only use the raw LLM API and an embedding model directly.

- **What questions to ask:**
  - What is a vector embedding and why does cosine similarity measure semantic relevance?
  - What is the difference between semantic search and keyword search (BM25)? What is hybrid search?
  - What is chunking strategy? Why does chunk size matter for both retrieval accuracy and generation quality?
  - What is a re-ranker (cross-encoder) and when does adding one improve RAG quality?
  - What is "lost in the middle" — the LLM context window placement problem for retrieved chunks?
  - What is the difference between dense retrieval (embeddings) and sparse retrieval (BM25/TF-IDF)?
  - What is "naive RAG" vs. "advanced RAG" vs. "modular RAG"? What are the quality failure modes of each?
  - How do you evaluate RAG quality? What metrics exist (faithfulness, relevance, groundedness)?

- **Standard resources to look into:**
  - **Blogs/Articles:** Pinecone Learning Center (pinecone.io/learn); LlamaIndex blog; Cohere's RAG guide; Jason Liu's "Systematically Improving RAG Applications" (jxnl.co)
  - **Papers/Docs:** "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020) — original RAG paper; "Lost in the Middle" (Liu et al., 2023); ChromaDB docs; pgvector docs
  - **Books:** *AI Engineering* by Chip Huyen — RAG chapter; *Building LLM Applications* by Valentina Alto
  - **YouTube Playlists:** Sam Witteveen — RAG deep dives; James Briggs — "Pinecone" series; LlamaIndex YouTube

- **How to get started immediately:**
```python
# Build minimal RAG without any framework. RIGHT NOW.
# Prerequisites: pip install anthropic openai numpy
import numpy as np
from openai import OpenAI  # use openai for embeddings (cheap)

client_oai = OpenAI()

def embed(text: str) -> list[float]:
    return client_oai.embeddings.create(
        model="text-embedding-3-small", input=text
    ).data[0].embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Your "vector database" — just a list for now
documents = [
    "FastAPI is a modern Python web framework based on Starlette.",
    "PostgreSQL supports full-text search and vector operations via pgvector.",
    "RAG combines retrieval with language model generation.",
]
doc_embeddings = [embed(doc) for doc in documents]

def retrieve(query: str, top_k: int = 2) -> list[str]:
    q_emb = embed(query)
    scored = [(cosine_similarity(q_emb, e), doc) 
              for e, doc in zip(doc_embeddings, documents)]
    return [doc for _, doc in sorted(scored, reverse=True)[:top_k]]

query = "What database works well for AI applications?"
context = retrieve(query)
print("Retrieved:", context)
# Next: send context + query to Claude for generation
```

- **Outcomes:**
  - *First pass:* Minimal RAG pipeline over local documents: chunk, embed, cosine search, generate.
  - *Second pass:* Replace in-memory store with pgvector (PostgreSQL extension). Add hybrid search (semantic + BM25).
  - *Third pass:* Add a re-ranker. Evaluate using RAGAS (faithfulness + answer relevance). Build an evaluation dataset of 20 question-answer pairs and score your pipeline.

- **What I can learn from it & Resources to generate:**
  - Blog: *"I Built RAG Without LangChain — Here's What I Learned"*
  - Open-source: A minimal RAG starter template: FastAPI + pgvector + OpenAI embeddings + Claude generation — under 200 lines total

---

### Week 21–22: Real-Time AI — WebSockets, SSE, and AI Streaming UIs

---

#### Topic: Server-Sent Events (SSE) & WebSockets for AI Streaming UIs

- **What:** LLM streaming UIs require the server to push tokens to the client as they are generated, rather than waiting for the full response. Two protocols handle this: **Server-Sent Events (SSE)** — a unidirectional HTTP/1.1 stream (`text/event-stream` MIME type), ideal for LLM token streaming where the client only receives data; **WebSockets** — a full-duplex TCP connection over HTTP upgrade, required when the client needs to send real-time data back (e.g., voice, collaborative editing). For most LLM chat UIs, SSE is sufficient and simpler to implement.

- **Why:** Streaming is not a nice-to-have for AI applications — it is a core UX requirement. A ChatGPT-style interface that streams tokens creates the perception of a fast, responsive system even when generation takes 10–30 seconds. The difference between a streaming and non-streaming LLM UI is the difference between a product people use and one they abandon.

- **How to start:** Build a FastAPI endpoint that streams LLM tokens via SSE. Build a React frontend that reads the stream using the `EventSource` API or the `fetch` streaming API. See tokens appear word by word.

- **What questions to ask:**
  - What is the difference between HTTP/1.1 chunked transfer encoding and HTTP/2 streams?
  - When should you use SSE vs. WebSockets vs. long-polling?
  - How do you handle SSE reconnection and missed events using the `Last-Event-ID` header?
  - How do you implement backpressure when a FastAPI SSE stream is sending faster than the client can consume?
  - How do you implement "stop generation" — cancelling an in-flight LLM streaming response?
  - What is the `ReadableStream` API in browsers and how does the `fetch` streaming API use it?

- **Standard resources to look into:**
  - **Blogs/Articles:** Vercel AI SDK docs (sdk.vercel.ai) — streaming patterns; Anthropic streaming docs; Mozilla's SSE guide (MDN)
  - **Papers/Docs:** W3C Server-Sent Events spec; FastAPI `StreamingResponse` docs; Vercel AI SDK source code
  - **Books:** *High Performance Browser Networking* by Ilya Grigorik (free online) — Chapter 16 (SSE), Chapter 17 (WebSocket)
  - **YouTube Playlists:** Jack Herrington — "Vercel AI SDK" series; Sam Witteveen — AI streaming demos

- **How to get started immediately:**
```python
# FastAPI SSE streaming endpoint — build this RIGHT NOW
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import anthropic, json

app = FastAPI()
client = anthropic.Anthropic()

@app.post("/chat/stream")
async def chat_stream(body: dict):
    async def generate():
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=body.get("messages", []),
        ) as stream:
            for text in stream.text_stream:
                # SSE format: "data: {json}\n\n"
                yield f"data: {json.dumps({'token': text})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
```
```typescript
// React client — consume the SSE stream
async function streamChat(messages: Message[]) {
  const response = await fetch('/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    // Parse SSE lines: "data: {...}\n\n"
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.token) appendToken(data.token);  // update UI
      }
    }
  }
}
```

- **Outcomes:**
  - *First pass:* Streaming chat UI with word-by-word token display, matching the ChatGPT UX pattern.
  - *Second pass:* Add "stop generation" — an AbortController that cancels the in-flight fetch and signals the server to stop.
  - *Third pass:* Add WebSocket-based collaborative editing — two users editing a document, with LLM-assisted autocomplete that streams inline suggestions.

- **What I can learn from it & Resources to generate:**
  - Blog: *"Building a ChatGPT-Style Streaming UI From First Principles — SSE vs WebSockets"*
  - Architectural diagram: "AI Streaming Request Lifecycle: FastAPI → Anthropic API → SSE → React ReadableStream"

---

---

# PHASE 5 — System Design, Advanced AI & Interview Sprint
## Weeks 23–28

> **Goal:** Interview-ready. Can design systems at the whiteboard. DSA problems solved in under 25 minutes. Portfolio polished and deployed.

---

### Week 23–24: System Design Fundamentals

---

#### Topic: Scalable System Design — Load Balancers, Caches, Databases at Scale

- **What:** System design is the process of defining the architecture, components, interfaces, and data flow of a system to satisfy specified requirements. Core building blocks: **Load Balancers** (Layer 4 TCP vs. Layer 7 HTTP; round-robin, least-connections, consistent hashing); **Caches** (CDN edge caches, Redis/Memcached for read-through/write-through/write-behind patterns, cache stampede/thundering herd); **Databases at scale** (read replicas, sharding strategies — horizontal vs. vertical, range vs. hash sharding); **Message Queues** (Kafka, RabbitMQ — async decoupling, pub-sub); **CAP Theorem** (Consistency, Availability, Partition tolerance — pick two).

- **Why:** System design rounds are mandatory in SWE internship interviews at most top companies (Google, Meta, Amazon, tier-2 startups). Being able to design a URL shortener, a Twitter timeline, or a chat system in 45 minutes requires fluency with these building blocks. But more importantly, these concepts are what you will *apply daily* as a backend or full-stack engineer.

- **How to start:** Start the ByteByteGo "System Design Interview" book Chapter 1 (Scale from Zero to Millions). Then design a URL shortener from scratch on paper: estimate QPS, choose a database, design the schema, add a cache layer, handle edge cases.

- **What questions to ask:**
  - How would you design a system that needs to handle 100,000 requests per second? Where are the bottlenecks?
  - What is consistent hashing and why is it used for cache/shard key distribution?
  - What is the difference between horizontal scaling and vertical scaling? When does each hit a wall?
  - What is the CAP theorem and what does it mean practically for a database choice?
  - What is a CDN and how does it serve static assets? How does cache invalidation work at the CDN level?
  - What is a message queue and when would you use Kafka vs. RabbitMQ vs. Redis Streams?
  - How do you design a rate limiter? What algorithms exist (token bucket, leaky bucket, sliding window log)?

- **Standard resources to look into:**
  - **Blogs/Articles:** ByteByteGo newsletter (blog.bytebytego.com) — every issue is gold; Cloudflare Engineering Blog; Netflix Tech Blog; Uber Engineering Blog
  - **Papers/Docs:** Google Bigtable paper; Amazon Dynamo paper; Cassandra paper; "Dynamo: Amazon's Highly Available Key-Value Store"
  - **Books:** *System Design Interview* by Alex Xu — Chapters 1–12 (all); *Designing Data-Intensive Applications* by Kleppmann — Chapters 5, 6, 9 (replication, partitioning, consistency)
  - **YouTube Playlists:** ByteByteGo YouTube — system design videos; Gaurav Sen — "System Design" playlist; TechDummies Narendra L — system design explanations

- **How to get started immediately:**
```
# Paper exercise — 45 minutes, simulate an interview:
# Design a URL Shortener (like bit.ly)

# Step 1: Clarify requirements (5 min)
# - 100M URLs shortened per day, 10x reads vs. writes
# - URLs must be unique, < 8 chars, permanent

# Step 2: Capacity estimation (5 min)
# - QPS: 100M / 86400 = ~1160 writes/sec, 11600 reads/sec
# - Storage: 100M * 100 bytes = 10GB/day, 3.65TB/year

# Step 3: High-level design (15 min)
# - Client → Load Balancer → API servers → Cache (Redis) → DB (PostgreSQL)
# - Encode: base62(auto_increment_id) — 8 chars = 62^8 = 218 trillion URLs

# Step 4: Deep dive (15 min)
# - How to avoid hash collisions?
# - What if the DB is the bottleneck? (Add read replicas)
# - What if Redis goes down? (Cache-aside with DB fallback)

# Step 5: Identify bottlenecks + tradeoffs (5 min)
# Write this on paper. Time yourself. Do it again tomorrow with a different system.
```

- **Outcomes:**
  - *First pass:* Can design URL shortener, pastebin, and rate limiter fluently on paper.
  - *Second pass:* Can design Twitter timeline and Instagram feed with fan-out-on-write vs. fan-out-on-read.
  - *Third pass:* Can design a distributed chat system (WhatsApp) with WebSockets, message queues, and multi-region storage.

- **What I can learn from it & Resources to generate:**
  - Blog series: *"System Design Teardowns — How I'd Build [X] From Scratch"* (5-part series)
  - Architectural diagrams: clean Excalidraw system diagrams for URL shortener, chat system, and video streaming — published to GitHub

---

### Week 25–26: Advanced AI Engineering — Agents, Evals, and Observability

---

#### Topic: LLM Agents — Tool Use, Multi-Step Reasoning, and ReAct

- **What:** An LLM Agent is an LLM that decides, step-by-step, which tools to call and with what arguments to achieve a goal. The ReAct pattern (Reasoning + Acting) interleaves reasoning traces with tool calls: `Thought → Action → Observation → Thought → ...`. Modern agent frameworks (LangChain Agents, LlamaIndex Agents, Claude's tool use API) implement this loop. Key challenges: planning reliability, error recovery, infinite loops, cost runaway, and context management across many steps.

- **Why:** Agents are the current frontier of AI engineering and the most requested feature by enterprise AI customers. Building reliable agents — ones that complete tasks without hallucinating tool calls or getting stuck — requires deep understanding of both the LLM's capabilities and production engineering patterns (timeouts, retries, circuit breakers).

- **How to start:** Build a minimal agent loop from scratch using the Anthropic tool use API. No LangChain. The agent should have three tools: `search_web`, `calculate`, and `read_file`. Give it a task that requires using all three in sequence.

- **What questions to ask:**
  - What is the ReAct prompting pattern and why does interleaving reasoning with action improve agent reliability?
  - How do you prevent an agent from running infinitely? What stopping conditions exist?
  - What is "tool call validation" and why is it critical before executing a tool that has side effects?
  - What is the difference between a single-agent and multi-agent architecture? When would you use each?
  - How do you handle errors in agent tool calls — retry, fallback, or abort?
  - What is "agent memory" — how do long-running agents maintain context across many steps without overflowing the context window?

- **Standard resources to look into:**
  - **Blogs/Articles:** Anthropic's "Building Effective Agents" guide; Lilian Weng's "LLM-Powered Autonomous Agents" blog post; Simon Willison's agent observations; Harrison Chase (LangChain) blog
  - **Papers/Docs:** "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al.); "Toolformer: Language Models Can Teach Themselves to Use Tools"; Anthropic tool use API docs
  - **Books:** *AI Engineering* by Chip Huyen — Agents chapter; *Building LLM Applications* — Agent patterns
  - **YouTube Playlists:** Sam Witteveen — "LLM Agents" series; LangChain — YouTube channel

- **How to get started immediately:**
```python
# Minimal agent loop using Anthropic tool use. Build this TONIGHT.
import anthropic, json
client = anthropic.Anthropic()

tools = [{
    "name": "calculate",
    "description": "Evaluate a mathematical expression",
    "input_schema": {
        "type": "object",
        "properties": { "expression": { "type": "string" } },
        "required": ["expression"]
    }
}]

def run_tool(name: str, inputs: dict) -> str:
    if name == "calculate":
        try: return str(eval(inputs["expression"]))  # never use eval in prod!
        except: return "Error: invalid expression"
    return "Unknown tool"

def agent_loop(task: str) -> str:
    messages = [{"role": "user", "content": task}]
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514", max_tokens=1024,
            tools=tools, messages=messages
        )
        if response.stop_reason == "end_turn":
            return response.content[0].text
        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = run_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result", "tool_use_id": block.id, "content": result
                })
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
```

- **Outcomes:**
  - *First pass:* A minimal agent with 3 tools that completes multi-step tasks reliably.
  - *Second pass:* Add a web search tool (Tavily or Serper API). Build a research agent that answers questions by searching, reading URLs, and synthesizing.
  - *Third pass:* Build a multi-agent system: a "planner" agent that breaks a task into sub-tasks, and "executor" agents that each complete one sub-task.

- **What I can learn from it & Resources to generate:**
  - Blog: *"I Built a Research Agent Without LangChain — The Minimal ReAct Implementation"*
  - Open-source: A minimal agent framework starter: < 200 lines, full TypeScript types, no external agent dependencies

---

#### Topic: LLM Evaluation (Evals) — Measuring What Matters

- **What:** LLM Evals are systematic methods for measuring the quality, reliability, and safety of LLM outputs. They range from unit-test-style exact match checks (does the output contain "Paris"?) to LLM-as-judge evaluations (is this response helpful, on a 1–5 scale?) to dataset-based benchmarks (MMLU, HellaSwag, MT-Bench). For production AI systems, evals are the equivalent of unit tests — without them you cannot safely iterate on prompts, upgrade models, or change retrieval strategies.

- **Why:** "Vibe-checking" an LLM by hand does not scale. Engineers who can design and run rigorous evals for their AI systems are dramatically more effective. In AI engineering interviews and senior roles, the ability to discuss your evaluation methodology is as important as the implementation itself.

- **How to start:** Take your RAG pipeline from Week 19–20. Create 20 hand-labeled question-answer pairs from your document corpus. Write an LLM-as-judge evaluator that scores faithfulness (does the answer come from the retrieved context?) and relevance (does the answer actually address the question?).

- **What questions to ask:**
  - What is the difference between "offline evals" (benchmark on a dataset) and "online evals" (production monitoring)?
  - What is LLM-as-judge and what are its failure modes (self-preference bias, position bias, length bias)?
  - What is RAGAS and what metrics does it measure for RAG pipelines?
  - How do you build a regression test suite for a prompt — what do you check when upgrading from one model version to another?
  - What is a "golden dataset" and how do you construct one that is representative?

- **Standard resources to look into:**
  - **Blogs/Articles:** Eugene Yan's "Evaluating LLMs" series; Hamel Husain's "A Field Guide to LLM Evals"; Anthropic's model card evaluation methodology; Brex's prompt engineering guide
  - **Papers/Docs:** "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (Zheng et al.); RAGAS paper; Evals by OpenAI (GitHub); Anthropic Evals GitHub
  - **Books:** *AI Engineering* by Chip Huyen — Evaluation chapter (extensive)
  - **YouTube Playlists:** Hamel Husain — evals talks; Jason Liu — "Improving RAG" conference talks

- **How to get started immediately:**
```python
# LLM-as-judge eval RIGHT NOW. Evaluate any text generation task.
import anthropic
client = anthropic.Anthropic()

def evaluate_response(question: str, context: str, answer: str) -> dict:
    """Score an RAG answer on faithfulness and relevance (1-5 each)."""
    prompt = f"""You are an expert evaluator. Score this RAG system response.

Question: {question}
Retrieved Context: {context}
System Answer: {answer}

Score on two dimensions (1-5 each, be strict):
1. Faithfulness: Is every claim in the answer supported by the context?
2. Relevance: Does the answer actually address the question?

Respond ONLY with valid JSON: {{"faithfulness": N, "relevance": N, "reasoning": "..."}}"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514", max_tokens=256,
        messages=[{"role": "user", "content": prompt}]
    )
    import json
    return json.loads(response.content[0].text)
```

- **Outcomes:**
  - *First pass:* LLM-as-judge evaluator for RAG pipeline. Score 20 hand-labeled examples.
  - *Second pass:* Build a regression test suite — run evals before and after any prompt change. Block deploys if score drops below threshold.
  - *Third pass:* Set up LangSmith or Weights & Biases for continuous eval monitoring in production.

---

### Week 27–28: Interview Sprint & Portfolio Polish

---

#### Topic: DSA Interview Sprint — Patterns, Time Complexity, Live Coding

- **What:** Technical interviews for SWE/AI internships require solving algorithmic problems under time pressure. The most common patterns tested: Two Pointers, Sliding Window, BFS/DFS (trees and graphs), Heap/Priority Queue, Dynamic Programming (1D and 2D), Binary Search, Stack/Monotonic Stack, and Union Find. Mastery means: recognizing the pattern from the problem statement in < 2 minutes, coding the solution in < 15 minutes, and articulating time and space complexity clearly.

- **Why:** DSA is a non-negotiable gate in most internship hiring processes. A candidate who builds impressive AI projects but cannot reverse a linked list in an interview will be rejected. The goal is not to memorize solutions but to internalize patterns so deeply that new problems feel like variations of things you've solved before.

- **How to start:** (This topic has been running daily throughout the roadmap — this sprint is about pressure-testing everything you've accumulated.) Do 2 LeetCode problems daily for these two weeks, timed strictly at 25 minutes each. If you don't solve it in 25 minutes, look at the hint, solve it, then re-do it from memory 24 hours later.

- **What questions to ask:**
  - Can you identify which of the 10 core patterns this problem belongs to within 2 minutes of reading?
  - Can you derive the time complexity formula for your solution from first principles?
  - Can you articulate *why* your approach works, not just *that* it works?
  - What is the brute force solution first — and then what optimization reduces it to the optimal complexity?
  - Can you code the solution in a language you're comfortable with within 15 minutes while talking through it?

- **Standard resources to look into:**
  - **Blogs/Articles:** NeetCode.io (neetcode.io) — the best curated problem list by pattern; Blind 75 and Neetcode 150 lists
  - **Papers/Docs:** LeetCode problem editorial sections
  - **Books:** *Cracking the Coding Interview* by Gayle Laakmann McDowell — interview strategy chapters; *Elements of Programming Interviews* by Aziz, Lee, Prakash
  - **YouTube Playlists:** NeetCode — entire YouTube channel (solutions with explanations); Back to Back SWE — algorithm explanations; Abdul Bari — "Algorithms" full course (for theory)

- **How to get started immediately:**
```
# The 25-Minute Rule — start RIGHT NOW:
# Problem: "Two Sum" (LeetCode #1) — trivial, but trace through it like an interview.
# Step 1 (2 min): Restate the problem in your own words.
# Step 2 (3 min): Brute force? O(n²). Optimal? O(n) with a hash map.
# Step 3 (2 min): Why does the hash map work? What's stored in it?
# Step 4 (10 min): Code it cleanly. No bugs. Edge cases.
# Step 5 (3 min): State time complexity O(n), space O(n). Could space be O(1)? No, why?
# Step 6: Repeat with #3 Longest Substring Without Repeating Characters (sliding window).
```

- **Outcomes:**
  - *First pass:* Fluent in easy LeetCode across all 10 patterns.
  - *Second pass:* Consistent on medium LeetCode — can solve 80%+ within 25 minutes.
  - *Third pass:* 5 mock interviews completed (Pramp, Interviewing.io, or with a friend). Recorded at least 2.

---

---

# DSA Daily Track — All 28 Weeks {#dsa-track}

> Run this in parallel with every phase above. One problem per day, minimum.

| Weeks | Focus Pattern | LeetCode Problems |
|-------|--------------|-------------------|
| 1–2 | Arrays & Strings | Two Sum, Valid Anagram, Contains Duplicate, Best Time to Buy Stock |
| 3–4 | Two Pointers | Valid Palindrome, 3Sum, Container With Most Water |
| 5–6 | Sliding Window | Longest Substring Without Repeating Chars, Minimum Window Substring |
| 7–8 | Stack & Queue | Valid Parentheses, Daily Temperatures, Min Stack, Decode String |
| 9–10 | Binary Search | Search in Rotated Sorted Array, Find Minimum in Rotated Array |
| 11–12 | Linked Lists | Reverse LL, Merge Two Sorted Lists, LRU Cache |
| 13–14 | Trees (BFS/DFS) | Max Depth, Level Order Traversal, Validate BST, LCA |
| 15–16 | Graphs | Number of Islands, Course Schedule (topological sort), Clone Graph |
| 17–18 | Heaps/Priority Queue | Kth Largest, Top K Frequent Elements, Merge K Sorted Lists |
| 19–20 | DP 1D | Climbing Stairs, House Robber, Coin Change |
| 21–22 | DP 2D | Unique Paths, Longest Common Subsequence, Edit Distance |
| 23–28 | Mixed Hard + Mock | Random medium/hard, 2 mock interviews per week |

**Weekly DSA goal:** 7 problems/week minimum, 10 stretch target. Review all previous week's problems every Sunday.

---

---

# Portfolio Project Progression {#portfolio-projects}

> These projects are ordered by complexity and are designed to tell a coherent engineering story on your resume. Each project builds on skills from the previous one.

---

## Project 1 — TypeScript Utility Library + NPM Package
**Timeline:** End of Phase 1 (Week 4)  
**Domain:** Developer tooling / open-source  
**Impact:** Demonstrates TypeScript mastery, open-source contribution, package publishing

### Architecture
A well-tested, fully-typed npm package containing custom hooks, type utilities, and functional programming helpers. Published to npm. Documented with TypeDoc or a minimal Docusaurus site.

### Tech Stack
- TypeScript 5.x (strict mode)
- Vitest for unit testing
- `tsup` for dual CJS/ESM build output
- GitHub Actions for CI (lint + test + publish on tag)
- Semantic versioning + `changeset` for release management

### Core Engineering Problems
- Designing a type API that is both correct and ergonomic (the main tension in utility library design)
- Implementing dual CJS/ESM package output without the "dual package hazard"
- Writing tests that verify both runtime behavior and TypeScript type inference
- Automated publishing pipeline via GitHub Actions + npm tokens

### Key files to build
```
packages/
├── hooks/         # useDebounce, useLocalStorage, usePrevious, useEventListener
├── types/         # DeepPartial, Nullable, AsyncReturnType, etc.
├── utils/         # memoize, throttle, curry, pipe, compose
└── README.md      # with badge: tests passing, npm version, bundle size
```

---

## Project 2 — Full-Stack Blog Platform with CMS
**Timeline:** End of Phase 2 (Week 10)  
**Domain:** Content management / full-stack web  
**Impact:** Demonstrates React, Next.js App Router, SSR/SSG, database integration

### Architecture
A production-grade blog platform: Next.js App Router frontend, a PostgreSQL database for posts and authors, a minimal admin dashboard (protected by JWT auth) for creating/editing posts, and full-text search. Deployed on Vercel (frontend) + Railway (database).

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App Router                │
│  ┌──────────────┐    ┌──────────────────────────┐  │
│  │  RSC Pages   │    │  Client Components        │  │
│  │  (blog posts,│    │  (search, like button,    │  │
│  │   home, tags)│    │   comment form)            │  │
│  └──────┬───────┘    └──────────────┬────────────┘  │
└─────────┼──────────────────────────┼────────────────┘
          │ fetch (server-side)       │ TanStack Query
          ▼                           ▼
┌─────────────────────┐    ┌──────────────────────┐
│  FastAPI / Next.js  │    │  Next.js Server       │
│  API Routes         │◄───│  Actions              │
└──────────┬──────────┘    └──────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  PostgreSQL (Neon/Railway)               │
│  Tables: posts, authors, tags, comments  │
│  Full-text search: tsvector index        │
└──────────────────────────────────────────┘
```

### Tech Stack
- Next.js 15 (App Router, RSC, Server Actions)
- PostgreSQL + Drizzle ORM (type-safe SQL, not an abstraction)
- Tailwind CSS + shadcn/ui with Catppuccin theme
- TanStack Query for client-side caching
- JWT authentication with `iron-session`
- Playwright E2E tests for auth + posting flows
- Deployed: Vercel + Neon Postgres

### Core Engineering Problems
- Understanding RSC boundaries: which components are server vs. client and why
- Implementing full-text search in PostgreSQL with `tsvector` and `to_tsquery`
- Optimistic UI updates for likes/bookmarks without race conditions
- Handling image uploads to Cloudflare R2 from Server Actions
- Draft/published post state machine with proper DB constraints

---

## Project 3 — REST API Backend with Auth, RBAC, and Rate Limiting
**Timeline:** End of Phase 3 (Week 16)  
**Domain:** Backend infrastructure  
**Impact:** Demonstrates production backend engineering — auth, DB, Docker, CI/CD

### Architecture
A standalone REST API backend for a project management tool (think a simplified Linear or Jira): user registration/login with JWT + refresh tokens, teams and roles (RBAC: owner/admin/member), projects/tasks/comments CRUD, rate limiting per user, structured logging, health checks, and full Docker deployment.

```
Client Request
     │
     ▼
┌────────────┐    ┌──────────────┐
│  Nginx     │───►│  FastAPI     │
│ (reverse   │    │  (Uvicorn)   │
│  proxy,    │    └──────┬───────┘
│  SSL term) │           │
└────────────┘    ┌──────▼────────────────────────┐
                  │  Middleware Stack               │
                  │  1. Request ID injection        │
                  │  2. Rate Limiter (Redis)        │
                  │  3. JWT Authentication          │
                  │  4. RBAC Authorization          │
                  │  5. Structured logging          │
                  └──────┬────────────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        PostgreSQL     Redis     Celery
         (primary)   (cache +   (async
                    rate limit)  jobs)
```

### Tech Stack
- FastAPI + SQLAlchemy 2.0 (async)
- PostgreSQL (Alembic for migrations)
- Redis (rate limiting + session storage)
- JWT (access token 15min + refresh token 7 days with rotation)
- Docker Compose for local dev
- GitHub Actions: lint → test → build Docker image → push to GHCR
- Deployed: Railway or Fly.io

### Core Engineering Problems
- Implementing refresh token rotation with a Redis blocklist (security correctness)
- Designing an RBAC system that is enforced at the database row level (row-level security in PostgreSQL)
- Implementing a sliding window rate limiter using Redis ZSET + `ZADD` + `ZCOUNT`
- Writing an async database session factory that is safe under concurrent requests
- Integration testing with a real PostgreSQL in Docker (`testcontainers` library)

---

## Project 4 — Full-Stack AI Chat Application with RAG
**Timeline:** End of Phase 4 (Week 22)  
**Domain:** AI Engineering / Full-stack  
**Impact:** The centerpiece AI project — streaming, RAG, vector search, LLM orchestration

### Architecture
An AI chat application where users can upload their own documents (PDF, markdown, text) and chat with them. The assistant retrieves relevant chunks from the user's documents using semantic search, generates streaming responses with inline source citations, and allows users to share chat sessions.

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                        │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Chat UI         │  │  Document    │  │  Source      │  │
│  │  (streaming SSE) │  │  Upload      │  │  Citation    │  │
│  └────────┬─────────┘  └──────┬───────┘  │  Sidebar     │  │
└───────────┼──────────────────┼───────────┴──────────────┘  │
            │                  │
            ▼                  ▼
┌─────────────────────────────────────────────────────┐
│                     FastAPI Backend                 │
│  /chat/stream  /documents/upload  /documents/list   │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┼────────────────────┐
    ▼          ▼                    ▼
 Anthropic  pgvector (retrieval)  PostgreSQL
  Claude    ────────────────────  (metadata,
  API       Embedding model:      chat history,
  (stream)  text-embedding-3-small user sessions)
            ─────────────────────
            Chunking pipeline:
            (LangChain text splitter
             or custom recursive)
```

### Tech Stack
- **Frontend:** Next.js 15, Tailwind, Vercel AI SDK (for streaming hooks)
- **Backend:** FastAPI, SQLAlchemy async, Alembic
- **AI:** Anthropic Claude (generation), OpenAI embeddings
- **Vector DB:** pgvector extension on PostgreSQL (no separate infra)
- **File Storage:** Cloudflare R2 or AWS S3
- **Auth:** Clerk (production-grade, fast to integrate)
- **Deployment:** Vercel (frontend) + Railway (backend + DB)
- **Observability:** LangSmith for LLM tracing

### Core Engineering Problems
- Document processing pipeline: PDF extraction → recursive chunking → parallel embedding → batch upsert to pgvector
- Hybrid search: combining pgvector cosine similarity + PostgreSQL full-text search (BM25) with RRF (Reciprocal Rank Fusion) re-ranking
- Context window management: ranking and selecting chunks that fit within the model's context limit while maximizing relevance
- Streaming with source attribution: mapping which citation corresponds to which retrieved chunk, injected into the streamed response
- Handling large document uploads asynchronously (Celery background task for processing)

---

## Project 5 — AI Engineering Agent with Tool Use & Web Interface
**Timeline:** End of Phase 5 (Week 28)  
**Domain:** AI Agents / Advanced full-stack  
**Impact:** Resume capstone — demonstrates agentic AI, systems thinking, production engineering

### Architecture
An autonomous research and task agent with a real-time streaming web interface. The agent can: search the web, read URLs, run code (sandboxed), manage files, write to and read from a persistent memory store, and break complex tasks into sub-tasks. The UI shows the agent's reasoning trace in real-time (thoughts, tool calls, observations).

```
User: "Research the top 5 vector databases in 2025,
       benchmark them conceptually, write a comparison
       report, and save it as a markdown file."

       ┌─────────────────────────────────────────┐
       │         Agent Orchestration Loop        │
       │                                         │
       │  Thought: I need to search for recent   │
       │  vector DB comparisons...               │
       │  Action: search_web("vector database    │
       │    comparison 2025 benchmark")          │
       │  Observation: [results...]              │
       │  Thought: I should read the top 3 URLs  │
       │  Action: read_url("https://...")        │
       │  ...                                    │
       │  Thought: I have enough info to write   │
       │  Action: write_file("comparison.md",    │
       │    content=...)                         │
       │  Final: Here's the report I created...  │
       └─────────────────────────────────────────┘

Real-time UI: streaming reasoning trace
User sees each Thought/Action/Observation as it happens
```

### Tech Stack
- **Backend:** FastAPI + async agent loop
- **LLM:** Claude with tool use API
- **Tools:** Tavily Search API, Playwright (headless browser), E2B (code sandbox), custom file system tool
- **Frontend:** Next.js + real-time SSE for agent trace streaming
- **Memory:** Redis (short-term) + PostgreSQL (long-term episodic memory)
- **Deployment:** Fly.io (always-on, needed for WebSocket/SSE persistence)
- **Observability:** LangSmith trace logging (every agent run logged)

### Core Engineering Problems
- Building a robust agent loop that handles tool call errors gracefully (retry, fallback, abort with explanation)
- Implementing a sandboxed code execution environment (E2B or Docker-based) so the agent can safely run Python
- Designing the streaming UI to differentiate between reasoning traces (thoughts), tool calls, and final responses
- Agent memory architecture: what goes in short-term context, what gets summarized to long-term memory
- Cost and latency management: estimating cost per task upfront, killing runs that exceed limits

---

## Resume Impact Summary

After completing this roadmap and these 5 projects, your resume has:

| Project | What It Proves | Technologies |
|---------|----------------|-------------|
| TypeScript Utility Library | Type system mastery, open-source discipline | TypeScript, npm, CI/CD |
| Full-Stack Blog Platform | End-to-end web dev, RSC, SSR/SSG | Next.js, PostgreSQL, Vercel |
| REST API Backend | Production backend, auth, DevOps | FastAPI, Docker, Redis |
| RAG Chat Application | AI engineering, vector search, streaming | LLMs, pgvector, SSE |
| Autonomous Agent | Agentic AI, systems thinking, real-time UI | Tool use, agents, observability |

Every project is **deployed** (live URL), **open-source** (GitHub with clean commits), and has a **technical blog post** explaining the architecture decisions. The combination is a portfolio that demonstrates competence from low-level JavaScript runtime semantics to production AI system design — precisely the range that makes a 2nd-year student stand out against 3rd and 4th-year candidates.

---

## Final Advice: The Three Habits That Compound

1. **Write every week.** One technical blog post per week, even short. Over 28 weeks, you will have 28 artifacts that prove you can think and communicate like an engineer. This is what gets you past HR filters.

2. **Build in public.** Every project goes on GitHub. Commit daily. When a recruiter looks at your profile, they should see green squares and real code, not a portfolio website.

3. **Teach to learn.** The moment you understand something well enough to explain it to someone else — in a blog post, a Discord server, a study group — you've actually learned it. Use that as the bar.

---

*This roadmap was designed for pvs — 2nd-year B.Tech CSE, RTX 4060, CachyOS/Windows — to reach a highly competitive SWE/AI intern level in 6 months through disciplined, first-principles engineering.*
