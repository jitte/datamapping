# xyflow Migration Test Strategy

## Context

Migrate `reactflow` (v11) to `@xyflow/react` (v12).
Test framework: **Vitest** (already configured).
Question: should we also add **Playwright** for E2E testing?

## Breaking API Changes to Verify

| v11 (`reactflow`) | v12 (`@xyflow/react`) | Affected file(s) |
|---|---|---|
| `updateEdge` | `reconnectEdge` | `src/App.tsx` |
| `getRectOfNodes` | `getNodesBounds` | `src/components/menu/file.tsx` |
| `getTransformForBounds` | `getViewportForBounds` | `src/lib/image.tsx` |
| `node.width` / `node.height` | `node.measured.width` / `.measured.height` | `src/lib/layout/index.tsx` |
| `deleteElements` (sync) | `deleteElements` (returns Promise) | `src/components/nodes/utils.tsx` |
| `reactflow/dist/style.css` | `@xyflow/react/dist/style.css` | `src/App.tsx` |

## Vitest: New/Updated Tests

### 1. `src/components/nodes/utils.test.ts` (new)

Pure functions — easy to unit test, high breakage risk during migration.

- `edgeType()` — country-based domestic/crossborder logic
- `addNode()` — verify generated Node shape matches v12 type
- `pasteNodes()` — edge ID naming pattern (may change in v12)

### 2. `src/lib/layout/index.test.ts` (update existing)

- `makeNode()` helper: add `measured: { width, height }` to match v12 Node type
- Check all references to `node.width` / `node.height` inside AutoLayout

### 3. `src/lib/image.test.ts` (new)

- Mock `getViewportForBounds` (renamed from `getTransformForBounds`)
- Verify argument mapping is preserved after rename

## Playwright: Recommendation

**Add, but keep scope narrow.**

| Factor | Assessment |
|---|---|
| ReactFlow renders to SVG/DOM (not canvas) | Elements are accessible via selectors → Playwright-friendly |
| Drag-to-connect edge creation | Complex to write, high maintenance cost → exclude |
| Smoke tests for migration | High value, low effort |
| Menu-driven node CRUD | Straightforward to test |

### Scenarios to cover (initial set)

```
e2e/
  smoke.spec.ts          # App loads, canvas is visible
  node-create.spec.ts    # Insert menu → node appears on canvas
  edge-type.spec.ts      # Setting different countries → crossborder class applied
```

Drag interactions and AutoLayout physics remain covered by unit tests only.

## Priority Order

1. `src/components/nodes/utils.test.ts` — pure functions, highest migration risk
2. Update `src/lib/layout/index.test.ts` — fix Node type for v12 (`measured`)
3. `src/lib/image.test.ts` — verify renamed API wrapper
4. Playwright `e2e/smoke.spec.ts` — one file to start, expand later
