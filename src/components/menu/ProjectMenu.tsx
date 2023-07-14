import { useContext } from 'react'
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
  const { currentProject, setCurrentProject } =
    useContext(GlobalContext)

  function ProjectList() {
    function handleChange(value: string) {
      const project = projects.find((project) => project.id === Number(value))
      if (project) setCurrentProject(project)
    }
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
