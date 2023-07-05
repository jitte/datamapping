import { useState, useContext } from 'react'
import { Button } from '@/components/ui/button'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

import { useLocalStore } from '@/lib/store'
import { GlobalContext } from '@/contexts'
import ProjectPage from '@/projects/page'

function ProjectsDialog() {
  const [open, setOpen] = useState(false)
  return (
    <MenubarSub>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger className="w-full pl-8 pr-2 py-1.5 text-left text-sm hover:bg-accent rounded-sm">
          Edit...
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Projects
            </DialogTitle>
            <DialogDescription>
              Add, Edit, Duplicate or Delete projects.
            </DialogDescription>
          </DialogHeader>
          <ProjectPage />
          <DialogFooter>
            <Button type="submit" onClick={() => setOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MenubarSub>
  )
}

export function ProjectMenu() {
  const { setShowProjectModal, currentProject, setCurrentProject } =
    useContext(GlobalContext)
  const projects = useLocalStore((state) => state.projects)

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
      <MenubarTrigger>Projects</MenubarTrigger>
      <MenubarContent>
        <ProjectList />
        <MenubarSeparator />
        <MenubarItem inset onClick={() => setShowProjectModal(true)}>
          Edit...
        </MenubarItem>
        <MenubarSeparator />
        <ProjectsDialog />
      </MenubarContent>
    </MenubarMenu>
  )
}
