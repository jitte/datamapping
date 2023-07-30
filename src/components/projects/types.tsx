import { Node, Edge } from 'reactflow'

export type ProjectType = {
  id: number
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
  autoLayout: boolean
}
