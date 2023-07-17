import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProjectType } from '@/projects/types'

export type LocalStoreType = {
  projects: ProjectType[]
  storeProjects: (projects: ProjectType[]) => void
  currentProjectId: number
  storeCurrentProjectId: (id: number) => void
  currentProject: () => ProjectType
}

const useLocalStore = create(
  persist<LocalStoreType>(
    (set, get) => ({
      projects: [],
      storeProjects: (projects: ProjectType[]) => {
        set({ projects })
      },
      currentProjectId: 0,
      storeCurrentProjectId: (currentProjectId: number) => {
        set({ currentProjectId })
      },
      currentProject: () => {
        const { projects, currentProjectId } = get()
        return projects.find(
          (project: ProjectType) => project.id === currentProjectId
        ) as ProjectType
      },
    }),
    { name: 'data mapping' }
  )
)

export { useLocalStore }
