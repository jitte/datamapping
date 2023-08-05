import { useEffect } from 'react'
import { useReactFlow } from 'reactflow'
import { MenubarMenu } from '@/components/ui/menubar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useLocalStore } from '@/lib/store'
import { ProjectsDialog } from '@/components/projects'

export function ProjectMenu() {
  const { projects, currentProject, currentProjectId, storeCurrentProjectId } =
    useLocalStore()
  const { fitView } = useReactFlow()

  useEffect(() => {
    setTimeout(() => {
      fitView({ duration: 500 })
    }, 100)
  }, [currentProjectId])

  function handleChange(value: string) {
    console.log('at: ProjectMenu/handleChange', value)
    storeCurrentProjectId(Number(value))
  }

  return (
    <MenubarMenu>
      <div className="flex flex-row items-center gap-2">
        <Select value={String(currentProjectId)} onValueChange={handleChange}>
          <SelectTrigger className="h-8 focus:ring-0">
            <SelectValue>{currentProject().name}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={String(project.id)}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ProjectsDialog />
      </div>
    </MenubarMenu>
  )
}
