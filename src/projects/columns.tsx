import { Node, Edge } from 'reactflow'
import { ColumnDef } from '@tanstack/react-table'

export type Project = {
  id: number
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
]
