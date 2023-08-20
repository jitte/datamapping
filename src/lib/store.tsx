import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { persist } from 'zustand/middleware'
import { ProjectType } from '@/components/projects/types'

export type LocalStoreType = {
  projects: ProjectType[]
  storeProjects: (projects: ProjectType[]) => void
  currentProjectId: number
  storeCurrentProjectId: (id: number) => void
  currentProject: () => ProjectType
  preference: PreferenceType
  storePreference: (preference: PreferenceType) => void
}

export type PreferenceType = {
  showOnlyNamedNode: boolean
  selectedCountries: string[]
  layoutParam: {
    epsilon: number
    decayRate: number
    nodeRadius: number
    clipSize: number
    stressWeight: {
      center: number
      tension: number
      collision: number
      crossing: number
      rotation: number
    }
  }
  showDebugInfo: boolean
}
const initialPreference: PreferenceType = {
  showOnlyNamedNode: true,
  selectedCountries: ['JP', 'US', 'EU'],
  layoutParam: {
    epsilon: 0.1,
    decayRate: 0.95,
    nodeRadius: 150,
    clipSize: 500,
    stressWeight: {
      center: 10,
      tension: 10,
      collision: 50,
      crossing: 50,
      rotation: 10,
    },
  },
  showDebugInfo: false,
}

const useLocalStore = createWithEqualityFn(
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
      preference: initialPreference,
      storePreference: (preference: PreferenceType) => {
        set({ preference })
      },
    }),
    { name: 'data mapping' }
  ),
  shallow
)

export { useLocalStore }
