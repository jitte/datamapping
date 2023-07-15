import { useState, useContext } from 'react'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@radix-ui/react-menubar'

import { useLocalStore } from '@/lib/store'
import { GlobalContext } from '@/contexts'
import { ProjectType } from './types'

export function EditDialog({ id }: { id: number }) {
  const [open, setOpen] = useState(false)
  const projects = useLocalStore((state) => state.projects)
  const project = projects.find((pj) => pj.id === id) as ProjectType
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description)
  const { setCurrentProject } = useContext(GlobalContext)
  const storeProjects = useLocalStore((state) => state.storeProjects)

  function onSubmit() {
    const newProject = { ...project, name, description }
    console.log('at: onSubmit', { newProject })
    setCurrentProject(newProject)
    storeProjects([
      newProject,
      ...projects.filter((pj) => pj.id !== project.id),
    ])
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <button>
          <Pencil className="h-5 w-5 m-0.5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Edit name and description of project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input
              id={`name_${id}`}
              value={name}
              onChange={(event) => {
                setName(event.target.value)
              }}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              id={`desc_${id}`}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value)
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            Submit
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
