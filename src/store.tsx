import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ProjectType } from "./modals/projectsModal"

export type LocalStoreType = {
  projects: ProjectType[],
  setProjects: (projects: ProjectType[]) => void,
  newProjectId: () => number,
  newNodeId: () => string,
}

export const useLocalStore = create(
  persist<LocalStoreType>(
    (set, get) => ({
      projects: [],
      setProjects: (projects: ProjectType[]) => {
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