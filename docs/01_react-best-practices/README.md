# React Enhancement Plan

Based on `vercel-react-best-practices` skill analysis of this codebase.

**Status: All complete (incl. #9 unit tests) — 2026-02-28**

## Summary

| # | Issue | File | Rule | Impact | Status |
|---|-------|------|------|--------|--------|
| 1 | Stale closures in useCallback | `App.tsx` | rerender-functional-setstate | Medium | ✅ Done |
| 2 | `offset` state → ref | `App.tsx` | rerender-use-ref-transient-values | Medium | ✅ Done |
| 3 | Inline components in FindMenu | `menu/find.tsx` | rerender-memo | Medium | ✅ Done |
| 4 | O(n²) in prepareMaps | `layout/index.tsx` | js-index-maps | Low-Medium | ✅ Done |
| 5 | Static JSX not hoisted | `App.tsx` | rendering-hoist-jsx | Low | ✅ Done |
| 6 | Empty useEffect | `App.tsx` | — | Low | ✅ Done |
| 7 | No localStorage schema guard | `lib/store.tsx` | client-localstorage-schema | Low | ✅ Done |
| 8 | Lint: 27 errors, 13 warnings | multiple files | various | Low | ✅ Done |
| 9 | No unit tests | `lib/layout/` | — | Low | ✅ Done |

---

## Priority 1 — Re-render Fixes (High Impact)

### 1. Use functional setState in `App.tsx` callbacks
**Rule:** `rerender-functional-setstate`

Several `useCallback` hooks reference state directly, causing stale closures or unnecessary re-creations:

- `copyNodes` callback depends on `[nodes, setOffset]` — `nodes` dependency triggers recreation on every node change
- `cutNodes` callback depends on `[nodes, reactFlowInstance]` — same issue
- `onDrop` unnecessarily depends on `projects` (line 247)

**Fix:** Use functional update form `setOffset(prev => ...)` to remove `nodes` from dependency arrays.

---

### 2. Move `offset` from state to ref in `App.tsx`
**Rule:** `rerender-use-ref-transient-values`
**File:** `src/App.tsx:63`

```tsx
const [offset, setOffset] = useState({ x: 12, y: 12 })
```

`offset` is only read inside `pasteNodes()` (a hotkey handler) and never affects rendering. Storing it in state causes unnecessary re-renders on every paste.

**Fix:**
```tsx
const offsetRef = useRef({ x: 12, y: 12 })
// in Ctrl+C handler:
offsetRef.current = { x: 12, y: 12 }
// in Ctrl+V handler:
pasteNodes(setNodes, setEdges, incrementNodeId, offsetRef.current)
offsetRef.current = { x: offsetRef.current.x + 12, y: offsetRef.current.y + 12 }
```

---

### 3. Extract and memoize inner components in `FindMenu`
**Rule:** `rerender-memo`
**File:** `src/components/menu/find.tsx:51–97`

`NodeMenubarItem`, `NodeMenubarItems`, and `ProjectMenubarSub` are defined inside `FindMenu`. They are recreated on every render of `FindMenu`.

**Fix:** Extract them as module-level components and wrap with `memo()`:

```tsx
const NodeMenubarItem = memo(function NodeMenubarItem({ node }: { node: Node }) { ... })
const NodeMenubarItems = memo(function NodeMenubarItems({ project, preference }: ...) { ... })
```

---

## Priority 2 — Performance Optimizations (Medium Impact)

### 4. Build index maps in `AutoLayout` for node lookups
**Rule:** `js-index-maps`
**File:** `src/lib/layout/index.tsx:176–192`

`prepareMaps()` iterates all edges for every vnode (`O(nodes × edges)`). The `vnodeMap` and `vedgeMap` already exist — the inner loop can use them instead of re-iterating `this.edges`.

---

### 5. Hoist static ReactFlow child JSX in `App.tsx`
**Rule:** `rendering-hoist-jsx`
**File:** `src/App.tsx:292–300`

`<Controls />`, `<MiniMap />`, and `<Background />` are fully static — no props that change. They are recreated on every render of `DataFlowView`.

**Fix:**
```tsx
const flowControls = <Controls />
const flowMinimap = <MiniMap />
const flowBackground = (
  <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} />
)
```

---

## Priority 3 — Code Quality

### 6. Remove empty `useEffect` in `App.tsx`
**File:** `src/App.tsx:67`

```tsx
useEffect(() => {}, [vpX, vpY, vpZ]) // somehow need this to get update
```

This is a workaround that triggers re-renders by subscribing to viewport changes. Understand why it's needed and replace with a proper ReactFlow viewport event handler (`onViewportChange` or `useOnViewportChange`).

---

### 7. Add localStorage schema validation
**Rule:** `client-localstorage-schema`
**File:** `src/lib/store.tsx:53–78`

The Zustand persist store reads raw JSON from `localStorage` with no validation. If the schema changes or data is corrupted, the app silently breaks.

**Fix:** Add a `migrate` function to the Zustand persist config to handle version mismatches and validate shape at load time.

---

## 8. Testing

**Goal:** `npm run lint` passes with 0 errors and 0 warnings.

**Result: ✅ Pass** (as of 2026-02-27)

### Errors fixed

| File | Rule | Fix applied |
|------|------|-------------|
| `App.tsx` | `no-constant-condition` | Removed `if (false)` dead code |
| `lib/layout/index.tsx` | `no-constant-condition` | Removed `if (false)` blocks; `while (true)` suppressed with disable comment |
| `lib/layout/index.tsx` | `no-inferrable-types` | Removed trivially inferred type annotations |
| `lib/layout/vector.tsx` | `no-inferrable-types` | Removed trivially inferred type annotations |
| `lib/contexts.tsx` | `no-empty-function` | Wrapped context defaults with eslint-disable block |
| `nodes/types.tsx` | `no-empty-function` | Wrapped context defaults with eslint-disable block |
| `nodes/config/index.tsx` | `prefer-const` | `let` → `const` in for-of loop |
| `projects/utils.tsx` | `prefer-const` | `let` → `const` for array/object literals |
| `ui/command.tsx` | `no-empty-interface` | `interface` → `type` alias |
| `ui/input.tsx` | `no-empty-interface` | `interface` → `type` alias |
| `ui/textarea.tsx` | `no-empty-interface` | `interface` → `type` alias |

### Warnings fixed

| File | Rule | Fix applied |
|------|------|-------------|
| `App.tsx` | `no-explicit-any` | `MutableRefObject<any>` → `useRef<HTMLDivElement>(null)` |
| `nodes/flow.tsx` | `no-explicit-any` | Same as above |
| `lib/contexts.tsx` | `no-explicit-any` | `any` → `(instance: ReactFlowInstance \| null) => void` |
| `App.tsx` | `exhaustive-deps` | Added `currentProjectId`, `storeProjects` to deps; `setTimerRef` suppressed |
| `menu/projects.tsx` | `exhaustive-deps` | Added `fitView` to deps |
| `nodes/flow.tsx` | `exhaustive-deps` | Added `id` to both useEffect deps arrays |
| `countries/index.tsx`, `ui/badge.tsx`, `ui/button.tsx`, `lib/contexts.tsx`, `lib/layout/index.tsx`, `lib/layout/vector.tsx` | `only-export-components` | Added eslint-disable comments on mixed-export lines |

---

## 9. Unit Tests

**Goal:** Add Vitest, write unit tests for pure logic modules.

**Result: ✅ Pass — 66 tests, 0 failures** (as of 2026-02-28)

### Setup

- **Framework:** [Vitest](https://vitest.dev/) v4 (native Vite integration)
- **Environment:** jsdom
- **Scripts:** `npm test` (run once), `npm run test:coverage` (with v8 coverage)
- **Config:** added `test` block to `vite.config.ts`

### Test files

| File | Tests | Coverage target |
|------|-------|-----------------|
| `src/lib/layout/vector.test.ts` | 46 | `Vector` class — all instance and static methods |
| `src/lib/layout/index.test.ts` | 20 | `AutoLayout` — `prepare`, `stable`, `pin`, `update` |

### Key decisions

- **Scope:** Pure logic only (no React rendering, no DOM). `Vector` and `AutoLayout` are the only modules without React or browser API dependencies at the tested method level.
- **`indegree` is consumed by `prepareRank()`:** The topological sort in `prepareRank()` decrements `indegree` to 0 as it processes nodes. Tests check `targetMap` keys instead of `indegree` after `prepare()`.
- **`-0` vs `0`:** JavaScript's `Object.is(-0, 0)` is `false`. Tests use `toBeCloseTo(0)` for values that may become `-0` through negation.
