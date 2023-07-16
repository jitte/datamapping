import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProjectType } from '@/projects/types'
import { Node, Edge } from 'reactflow'

export type LocalStoreType = {
  projects: ProjectType[],
  storeProjects: (projects: ProjectType[]) => void,
  newProjectId: () => number,
  newNodeId: () => string,
}

export function allNodes(projects: ProjectType[]) {
  let nodes: Node[] = []

  for (const project of projects) {
    for (const node of project.nodes) {
      if (!nodes.find((addedNode) => addedNode.id === node.id)) {
        nodes.push(node)
      }
    }
  }
  return nodes
}

export function allEdges(projects: ProjectType[]) {
  let edges: Edge[] = []

  for (const project of projects) {
    for (const edge of project.edges) {
      if (!edges.find((addedEdge) => addedEdge.id === edge.id)) {
        edges.push(edge)
      }
    }
  }
  return edges
}

export const useLocalStore = create(
  persist<LocalStoreType>(
    (set, get) => ({
      projects: [],
      storeProjects: (projects: ProjectType[]) => {
        set({ projects })
      },
      newProjectId: () => {
        return 1 + Math.max(0, ...get().projects.map((project)=>project.id))
      },
      newNodeId: () => {
        // ['node_1', 'node_2', ...]
        const nodeIds = get().projects.map((project: ProjectType) => 
          (project.nodes ?? []).map((node) => node.id)
        ).reduce((acc, ele) => acc.concat(ele))
        // [1, 2, ...]
        const ids = nodeIds.map((nodeId: string) => {
          const id = Number(nodeId.replace('node_', ''))
          return Number.isNaN(id) ? 0 : id
        })
        return 'node_' + (1 + Math.max(0, ...ids))
      }
    }),
    {
      name: "data mapping",
    }
  )
)