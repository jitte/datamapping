import { Node, Edge } from "reactflow"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type ProjectType = {
  id: number,
  name: string,
  description: string,
  flow?: {
    nodes: Node[],
    edges: Edge[],
  }
}

type LocalStoreType = {
  projects: ProjectType[],
  setProjects: (projects: ProjectType[]) => void,
  newProjectId: () => number,
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
      }
    }),
    {
      name: "data mapping",
    }
  )
)