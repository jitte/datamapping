import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProjectType } from '@/projects/types'

export type LocalStoreType = {
  projects: ProjectType[]
  storeProjects: (projects: ProjectType[]) => void
}

const useLocalStore = create(
  persist<LocalStoreType>(
    (set) => ({
      projects: [],
      storeProjects: (projects: ProjectType[]) => {
        set({ projects })
      },
    }),
    { name: 'data mapping' }
  )
)

export { useLocalStore }
