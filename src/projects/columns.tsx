import { Node, Edge } from 'reactflow'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Copy, Trash2 } from 'lucide-react'

export type Project = {
  id: number
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
}

export const columns: ColumnDef<Project>[] = [
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
        <>
          <button onClick={() => handleEdit(pj.id)}>
            <Pencil className="h-5 w-5 m-0.5" />
          </button>
          <button onClick={() => handleDuplicate(pj.id)}>
            <Copy className="h-5 w-5 m-0.5" />
          </button>
          <button onClick={() => handleDelete(pj.id)}>
            <Trash2 className="h-5 w-5 m-0.5" />
          </button>
        </>
      )
    },
  },
]

function handleEdit(id: number) {}
function handleDuplicate(id: number) {}
function handleDelete(id: number) {}
