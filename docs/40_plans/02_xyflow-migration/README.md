# xyflow Migration Plan

Migrate package `reactflow` (v11.7) → `@xyflow/react` (v12.x).

## Step 0 — Package swap

```bash
npm uninstall reactflow
npm install @xyflow/react
```

No other changes yet. All imports will break — intentional; the compiler errors drive the remaining steps.

---

## Step 1 — Global find-and-replace (mechanical)

These are pure string substitutions with no logic change.

| Old | New | Notes |
|---|---|---|
| `from 'reactflow'` | `from '@xyflow/react'` | all 17 files |
| `import 'reactflow/dist/style.css'` | `import '@xyflow/react/dist/style.css'` | `App.tsx` |
| `import ReactFlow,` | `import { ReactFlow,` | default → named export |

After this step `npm run build` should compile with only the breaking-API errors listed below.

---

## Step 2 — Breaking API changes (file by file)

### `src/App.tsx`

| Change | Detail |
|---|---|
| `updateEdge` → `reconnectEdge` | rename import and usage |
| `onEdgeUpdate` prop → `onReconnect` | ReactFlow component prop renamed |
| `reactFlowInstance.project({x,y})` → `reactFlowInstance.screenToFlowPosition({x,y})` | used in `onDrop` (line 236) |

```tsx
// before
const position = reactFlowInstance.project({ x: ..., y: ... })
// after
const position = reactFlowInstance.screenToFlowPosition({ x: ..., y: ... })
```

### `src/components/menu/file.tsx`

| Change | Detail |
|---|---|
| `getRectOfNodes` → `getNodesBounds` | rename import and call in `DownloadMenu` |

```tsx
// before
downloadImage(getRectOfNodes(getNodes()), format)
// after
downloadImage(getNodesBounds(getNodes()), format)
```

### `src/lib/image.tsx`

| Change | Detail |
|---|---|
| `Rect` → `Rect` | type name unchanged |
| `getTransformForBounds(...)` → `getViewportForBounds(...)` | rename |
| Return type `[x, y, scale]` → `{ x, y, zoom }` | destructure changes |

```tsx
// before
const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.2, 2)
// style uses: transform[0], transform[1], transform[2]

// after
const { x, y, zoom } = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.2, 2)
// style uses: x, y, zoom
```

Also update test mock in `src/lib/image.test.ts`:
- Mock `getViewportForBounds` returning `{ x: 10, y: 20, zoom: 0.5 }`
- Update style assertion: `translate(10px, 20px) scale(0.5)`

### `src/lib/layout/index.tsx`

| Change | Detail |
|---|---|
| `node.width ?? 0` → `node.measured?.width ?? node.width ?? 0` | `getWidthHeight()` method |
| `node.height ?? 0` → `node.measured?.height ?? node.height ?? 0` | same method |

```tsx
// before (line 222–223)
const width = node.width ?? 0
const height = node.height ?? 0

// after
const width = node.measured?.width ?? node.width ?? 0
const height = node.measured?.height ?? node.height ?? 0
```

Also update test in `src/lib/layout/index.test.ts`:
- `makeNode()` helper: add `measured: { width, height }` field to match v12 Node type
- Update migration comment from "must change to" → "done"

### `src/components/nodes/config/index.tsx` and `src/components/nodes/utils.tsx`

`deleteElements` now returns a Promise in v12. All three call sites must be awaited.

```tsx
// before
reactFlowInstance?.deleteElements({ nodes: [node] })

// after
await reactFlowInstance?.deleteElements({ nodes: [node] })
```

Call sites:
- `config/index.tsx:36` — `handleDelete()`  → mark async
- `utils.tsx:37` — `cutNodes()` → mark async, update callers
- `utils.tsx:107` — `deleteNodes()` → mark async, update callers

---

## Step 3 — CSS class changes (Playwright)

In v12 the `.react-flow__renderer` class is still present. Verify `e2e/smoke.spec.ts` passes after migration.

If any CSS selector in `smoke.spec.ts` breaks, update to the v12 class name.

---

## Step 4 — Verify and clean up

```bash
npm run build     # TypeScript + Vite, must be clean
npm run lint      # 0 warnings
npm run test      # 89 tests must pass
npm run test:e2e  # smoke suite must pass (requires running dev server)
```

---

## Step 5 — Documentation

Update `docs/` to reflect the completed migration.

- **`docs/40_plans/02_xyflow-migration/README.md`** (this file): mark each step complete with date
- **`docs/40_plans/01_xyflow-migration-test-strategy/README.md`**: update mock targets (`getViewportForBounds`, `reconnectEdge`) to match v12 names
- **`CLAUDE.md`**: update architecture section — replace `reactflow` references with `@xyflow/react`, note `node.measured.width/height`
- **`docs/90_references/`**: add a reference entry for the official v12 migration guide URL

---

## File change summary

| File | Type of change |
|---|---|
| `package.json` | uninstall reactflow, install @xyflow/react |
| `src/App.tsx` | import path, default→named, updateEdge→reconnectEdge, onEdgeUpdate→onReconnect, project→screenToFlowPosition |
| `src/components/edges/index.tsx` | import path only |
| `src/components/menu/align.tsx` | import path only |
| `src/components/menu/file.tsx` | import path + getRectOfNodes→getNodesBounds |
| `src/components/menu/find.tsx` | import path only |
| `src/components/menu/insert.tsx` | import path only |
| `src/components/menu/projects.tsx` | import path only |
| `src/components/nodes/config/country.tsx` | import path only |
| `src/components/nodes/config/index.tsx` | import path + await deleteElements |
| `src/components/nodes/flow.tsx` | import path only |
| `src/components/nodes/utils.tsx` | import path + await deleteElements (×2) |
| `src/components/projects/types.tsx` | import path only |
| `src/components/projects/utils.tsx` | import path only |
| `src/lib/contexts.tsx` | import path only |
| `src/lib/image.tsx` | import path + getTransformForBounds→getViewportForBounds + return type |
| `src/lib/layout/index.tsx` | import path + node.measured?.width/height |
| `src/lib/layout/vector.tsx` | import path only |
| `src/lib/layout/index.test.ts` | import path + makeNode measured field + comment update |
| `src/lib/image.test.ts` | mock rename + return type update |
| `e2e/smoke.spec.ts` | verify CSS selectors still match |
