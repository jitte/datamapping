import { useEffect, useContext } from 'react'
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
import { GlobalContext } from '@/contexts'
import { ProjectsDialog } from '@/projects'

export function ProjectMenu() {
  const projects = useLocalStore((state) => state.projects)
  const { currentProject, setCurrentProject } = useContext(GlobalContext)
  const { fitView } = useReactFlow()

  useEffect(() => {
    //console.log('at: ProjectMenu/useEffect')
    setTimeout(() => {
      fitView({ duration: 500 })
    }, 100)
  }, [currentProject])

  function handleChange(value: string) {
    //console.log('at: ProjectMenu/handleChange')
    const project = projects.find((project) => project.id === Number(value))
    if (project) setCurrentProject(project)
  }
  function ProjectList() {
    return (
      <MenubarRadioGroup
        value={String(currentProject.id)}
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
          {currentProject.name}
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
