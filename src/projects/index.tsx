import { useState, useContext } from 'react'
import { Node, Edge } from 'reactflow'
import { Cog, Pencil, Copy, Trash2, Plus } from 'lucide-react'
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
import { ColumnDef } from '@tanstack/react-table'

import { useLocalStore } from '@/lib/store'
import { GlobalContext } from '@/contexts'
import { initialProject } from '@/constants'
import { DataTable } from './data-table'

export type ProjectType = {
  id: number
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
}

function ProjectsTable() {
  const projects = useLocalStore((state) => state.projects)
  const storeProjects = useLocalStore((state) => state.storeProjects)
	const newProjectId = useLocalStore((state) => state.newProjectId)
  const { currentProject, setCurrentProject } = useContext(GlobalContext)

  const columns: ColumnDef<ProjectType>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const pj = row.original
        return (
          <div className="flex flex-row">
            <EditDialog id={pj.id} />
            <button onClick={() => handleDuplicate(pj.id)}>
              <Copy className="h-5 w-5 m-0.5" />
            </button>
            <button onClick={() => handleDelete(pj.id)}>
              <Trash2 className="h-5 w-5 m-0.5" />
            </button>
          </div>
        )
      },
    },
  ]

  function EditDialog({ id }: { id: number }) {
    const [open, setOpen] = useState(false)
		const project = projects.find((pj) => pj.id === id) as ProjectType
    const [name, setName] = useState(project.name)
    const [description, setDescription] = useState(project.description)

		function onSubmit() {
			const newProject = { ...project, name, description }
			console.log('at: onSubmit', { newProject })
			setCurrentProject(newProject)
			storeProjects([newProject, ...projects.filter((pj) => pj.id !== project.id)])
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

	function handleDuplicate(id: number) {
		console.log('at: handleDuplicate', { id })
		const oldProject = projects.find((pj) => pj.id === id) as ProjectType
		const newId = newProjectId()
		const newProject = {
			id: newId,
			name: `${oldProject.name} (${newId})`,
			description: oldProject.description,
			nodes: [...oldProject.nodes],
			edges: [...oldProject.edges]
		}
		storeProjects([newProject, ...projects])
	}

  function handleDelete(id: number) {
    console.log('at: handleDelete', { id, projects, currentProject })
    let newProjects = projects.filter((pj) => pj.id !== id)
    if (id === currentProject.id) {
      if (newProjects.length === 0) {
        newProjects = [initialProject(1)]
      }
      setCurrentProject(newProjects[0])
    }
    storeProjects(newProjects)
  }

  function handleNew() {
    const newProject = initialProject(newProjectId())
    setCurrentProject(newProject)
    storeProjects([newProject, ...projects])
  }

  return (
    <>
      <Button variant="secondary" type="submit" onClick={handleNew}>
        <Plus className="w-5 h-5" /> Project
      </Button>
      <DataTable columns={columns} data={projects} />
    </>
  )
}

export function ProjectsDialog() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full pl-2 pr-2 py-1.5 text-left text-sm hover:bg-accent rounded-sm">
        <div className="flex flex-row items-center gap-2">
          <Cog size={16}/>
          Edit Projects...
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Projects</DialogTitle>
          <DialogDescription>
            Add, edit, duplicate or delete projects.
          </DialogDescription>
        </DialogHeader>
        <ProjectsTable />
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}