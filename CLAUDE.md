# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint (0 warnings allowed)
```

No test framework is configured.

## Architecture

This is a React + TypeScript + Vite app for drawing cross-border data transfer flow diagrams using [ReactFlow](https://reactflow.xyflow.com/).

### State Management

Two layers of state:

- **Zustand store** (`src/lib/store.tsx`): Persisted to `localStorage` under key `"data mapping"`. Holds `projects[]`, `currentProjectId`, and `preference`. This is the source of truth across sessions.
- **React state in `App.tsx`**: Local `nodes` and `edges` state derived from the current project. Changes are debounced and flushed back to the Zustand store after 1 second.

### Context

`DataFlowContext` (`src/lib/contexts.tsx`) bridges `App.tsx` state down to menu components that need to mutate nodes/edges (e.g., `FindMenu` uses `setNodes` to select a node).

### Node Roles & Edge Types

Roles are defined in `src/lib/constants.tsx` (`roleInfo`). Two categories:
- **Entities**: PII Principals, PII Controller, PII Processor, Third Party — have country assignment, contracts, PII/non-PII flow flags
- **Flow components**: Server, Gateway, Smartphone, PC, Product — infrastructure nodes

All nodes use the single `GenericNode` component (`src/components/nodes/index.tsx`). Old node types (`piiSubject`, etc.) are aliased to `genericNode` for backward compatibility.

Edge type (`domestic` vs `crossborder`) is determined automatically in `edgeType()` (`src/components/nodes/utils.tsx`): if both endpoints have different non-empty `country` codes, the edge becomes `crossborder` and is styled differently.

### Auto Layout

`AutoLayout` (`src/lib/layout/index.tsx`) is a physics simulation engine with four stress functions:
- **center**: pulls unranked nodes to viewport center; ranked nodes to rank × orbit radius
- **collision**: repels nearby nodes, attracts distant ones
- **crossing**: pushes nodes away from edges they cross
- **rotation**: aligns edges toward horizontal

Simulation runs every ~33ms when temperature > epsilon. Temperature decays by `decayRate` each step. Dragging a node pins it temporarily and triggers a new simulation.

### Data Persistence

Projects are auto-saved to `localStorage` 1 second after any node/edge change. The `Data_mapping.json` file in the repo root is a sample data file (not loaded automatically).

### Node IDs

- Initial project nodes: `pj_{projectId}_node_{n}`
- Nodes added at runtime: `node_{n}` (counter tracked via `nodeIdRef`, initialized to max existing ID across all projects)

## Documentation (`docs/`)

Plans and explanations are stored under `docs/` with numbered subdirectories:

```
docs/
  nn_plan-name/
    README.md       # English — source of truth, used by Claude to minimize token usage
    README_jp.md    # Japanese — human-readable explanation for the same plan
```

**Rules:**
- `README.md` must be written in **English only** — Claude reads this file during sessions to understand intent without paying the cost of translating Japanese text
- `README_jp.md` is for human readers and is **never loaded automatically** by Claude
- When adding a new plan, create a new subdirectory `nn_plan-name/` where `nn` is the next sequential number
