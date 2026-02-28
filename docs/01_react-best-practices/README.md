# React Enhancement Plan

Based on `vercel-react-best-practices` skill analysis of this codebase.

**Status: All complete — 2026-02-27**

## Testing

**Goal:** `npm run lint` passes with 0 errors and 0 warnings.

**Current:** 27 errors, 13 warnings (as of 2026-02-27)

### Errors to fix

| File | Line | Rule | Issue |
|------|------|------|-------|
| `App.tsx` | 177 | `no-constant-condition` | Unexpected constant condition |
| `lib/layout/index.tsx` | 70, 201, 289 | `no-constant-condition` | Unexpected constant condition |
| `lib/layout/index.tsx` | 49–54, 301, 319, 347, 376 | `no-inferrable-types` | Remove trivially inferred type annotations |
| `lib/layout/vector.tsx` | 52, 77, 78 | `no-inferrable-types` | Remove trivially inferred type annotations |
| `lib/contexts.tsx` | 19, 21, 23, 25 | `no-empty-function` | Empty method stubs in context defaults |
| `nodes/types.tsx` | 61 | `no-empty-function` | Empty method stub |
| `nodes/config/index.tsx` | 50 | `prefer-const` | Use `const` instead of `let` |
| `projects/utils.tsx` | 5, 18, 61 | `prefer-const` | Use `const` instead of `let` |
| `ui/command.tsx` | 24 | `no-empty-interface` | Interface with no members |
| `ui/input.tsx` | 5 | `no-empty-interface` | Interface with no members |
| `ui/textarea.tsx` | 5 | `no-empty-interface` | Interface with no members |

### Warnings to fix

| File | Rule | Issue |
|------|------|-------|
| `App.tsx`, `nodes/flow.tsx`, `lib/contexts.tsx` | `no-explicit-any` | Replace `any` with proper types |
| `App.tsx`, `menu/projects.tsx`, `nodes/flow.tsx` | `exhaustive-deps` | Add missing useEffect dependencies |
| `countries/index.tsx`, `ui/badge.tsx`, `ui/button.tsx`, `lib/contexts.tsx`, `lib/layout/index.tsx`, `lib/layout/vector.tsx` | `only-export-components` | Move non-component exports to separate files |

---

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
