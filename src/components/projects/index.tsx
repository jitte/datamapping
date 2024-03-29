import React, { useState, useContext } from 'react'
import { Copy, Trash2, Plus, Pencil } from 'lucide-react'
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
import { ColumnDef } from '@tanstack/react-table'

import { useLocalStore } from '@/lib/store'
import { DataFlowContext } from '@/lib/contexts'
import { duplicateProject, newProjectId } from './utils'
import { initialProject } from '@/lib/constants'
import { ProjectType } from './types'
import { DataTable } from './data-table'
import { EditDialog } from './edit'

const ProjectsTable = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { projects, storeProjects, currentProjectId, storeCurrentProjectId } =
    useLocalStore()
  const { incrementNodeId } = useContext(DataFlowContext)

  const columns: ColumnDef<ProjectType>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => {
        return (
          <Button
            variant="link"
            className="p-0 text-left"
            onClick={() => handleClickProject(row.original.id)}
          >
            {row.original.name}
          </Button>
        )
      },
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

  const handleClickProject = (id: number) => {
    storeCurrentProjectId(id)
    setOpen(false)
  }

  const handleDuplicate = (id: number) => {
    console.log('at: ProjectTable/handleDuplicate', id)
    const oldProject = projects.find((pj) => pj.id === id)
    if (oldProject) {
      const newId = newProjectId(projects)
      const newProject = duplicateProject(newId, oldProject, incrementNodeId)
      storeProjects([newProject, ...projects])
      storeCurrentProjectId(newId)
    }
  }

  function handleDelete(id: number) {
    console.log('at: ProjectTable/handleDelete', id)
    let newProjects = projects.filter((pj) => pj.id !== id)
    if (id === currentProjectId) {
      if (newProjects.length === 0) {
        newProjects = [initialProject(1)]
      }
      storeCurrentProjectId(newProjects[0].id)
    }
    storeProjects(newProjects)
  }

  function handleNew() {
    console.log('at: ProjectTable/handleNew')
    const newProject = initialProject(newProjectId(projects))
    storeProjects([newProject, ...projects])
    storeCurrentProjectId(newProject.id)
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
      <DialogTrigger>
        <Pencil size={20} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Projects</DialogTitle>
          <DialogDescription>
            Add, edit, duplicate or delete projects.
          </DialogDescription>
        </DialogHeader>
        <ProjectsTable setOpen={setOpen} />
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
