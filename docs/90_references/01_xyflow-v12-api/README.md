# @xyflow/react v12 — API Reference for Migration

Official migration guide: https://reactflow.dev/learn/troubleshooting/migrate-to-v12

## Key API changes from reactflow v11

| v11 | v12 | Notes |
|---|---|---|
| `import ReactFlow from 'reactflow'` | `import { ReactFlow } from '@xyflow/react'` | default → named |
| `reactflow/dist/style.css` | `@xyflow/react/dist/style.css` | CSS import path |
| `updateEdge` | `reconnectEdge` | function rename |
| `onEdgeUpdate` prop | `onReconnect` prop | component prop rename |
| `getRectOfNodes` | `getNodesBounds` | function rename |
| `getTransformForBounds(r,w,h,min,max)` | `getViewportForBounds(r,w,h,min,max,padding)` | rename + added padding arg; returns `{x,y,zoom}` not `[x,y,scale]` |
| `instance.project({x,y})` | `instance.screenToFlowPosition({x,y})` | method rename |
| `node.width / node.height` | `node.measured?.width / .height` | library sets measured dims in `node.measured` |
| `Node.data: Record<string,any>` | `Node<T>.data: T` (default `Record<string,unknown>`) | generic, stricter typing |
| `deleteElements(...)` (sync) | `deleteElements(...)` (returns Promise) | must `await` |
| `parentNode` field | `parentId` field | node property rename |
| `nodeInternals` store key | `nodeLookup` | internal store rename |
