# xyflow Migration Plan

Migrate package `reactflow` (v11.7) → `@xyflow/react` (v12.x).

**Status: Complete — 2026-03-02**

---

## Step 0 — Package swap ✅

```bash
npm uninstall reactflow
npm install @xyflow/react
```

---

## Step 1 — Global find-and-replace (mechanical) ✅

Pure string substitutions with no logic change.

| Old | New | Notes |
|---|---|---|
| `from 'reactflow'` | `from '@xyflow/react'` | all 17 files |
| `import 'reactflow/dist/style.css'` | `import '@xyflow/react/dist/style.css'` | `App.tsx` |
| `import ReactFlow,` | `import { ReactFlow,` | default → named export |

---

## Step 2 — Breaking API changes ✅

### `src/App.tsx`

| Change | Detail |
|---|---|
| `updateEdge` → `reconnectEdge` | renamed import and usage |
| `onEdgeUpdate` prop → `onReconnect` | ReactFlow component prop renamed |
| `reactFlowInstance.project()` → `reactFlowInstance.screenToFlowPosition()` | used in `onDrop` |

### `src/components/menu/file.tsx`

| Change | Detail |
|---|---|
| `getRectOfNodes` → `getNodesBounds` | renamed import and call |

### `src/lib/image.tsx`

| Change | Detail |
|---|---|
| `getTransformForBounds(...)` → `getViewportForBounds(..., padding)` | rename + added `padding` arg (0.1) |
| Return `[x, y, scale]` → `{ x, y, zoom }` | destructure updated |

### `src/lib/layout/index.tsx`

| Change | Detail |
|---|---|
| `node.width ?? 0` → `node.measured?.width ?? node.width ?? 0` | `getWidthHeight()` |
| `node.height ?? 0` → `node.measured?.height ?? node.height ?? 0` | same |
| `reactflowInstance.project()` → `.screenToFlowPosition()` | used in `trigger()` |

### `src/components/menu/insert.tsx`

| Change | Detail |
|---|---|
| `reactFlowInstance.project()` → `.screenToFlowPosition()` | missed in plan, found during build |

### `src/components/nodes/config/index.tsx` and `src/components/nodes/utils.tsx`

`deleteElements` now returns a Promise — all three call sites marked `async`/`await`.

### `src/components/menu/find.tsx` and `src/components/nodes/config/country.tsx`

`Node.data` is now `Record<string, unknown>` in v12 (was `Record<string, any>`).
- `find.tsx`: use `Node<NodeDataType>` generic
- `country.tsx`: cast `currentNode.data as NodeDataType`

---

## Step 3 — CSS class changes ✅

`.react-flow__viewport` class unchanged in v12. `e2e/smoke.spec.ts` selectors remain valid.

---

## Step 4 — Verify ✅

```
npm run build  → ✓ 1603 modules, clean
npm run test   → 89/89 passed
npm run lint   → 42 pre-existing issues (unchanged from before migration)
```

---

## Step 5 — Documentation ✅

- `CLAUDE.md`: updated package name, commands, `node.measured` note
- `docs/40_plans/01_xyflow-migration-test-strategy/README.md`: mock targets now reflect v12 API
- `docs/90_references/`: xyflow migration guide reference (see `01_xyflow-v12-api/`)
- This file: marked all steps complete
