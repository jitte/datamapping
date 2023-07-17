import { useEffect } from 'react'
import { useReactFlow } from 'reactflow'
import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Share2 } from 'lucide-react'

import { useLocalStore } from '@/lib/store'
import { ProjectsDialog } from '@/projects'

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
  function ProjectList() {
    return (
      <MenubarRadioGroup
        value={String(currentProjectId)}
        onValueChange={(value) => handleChange(value)}
      >
        {projects.map((project) => (
          <MenubarRadioItem value={String(project.id)} key={String(project.id)}>
            {project.name}
          </MenubarRadioItem>
        ))}
      </MenubarRadioGroup>
    )
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>
        <div className="flex flex-row items-center gap-2">
          <Share2 />
          {currentProject().name}
        </div>
      </MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <ProjectsDialog />
        </MenubarSub>
        <MenubarSeparator />
        <ProjectList />
      </MenubarContent>
    </MenubarMenu>
  )
}
