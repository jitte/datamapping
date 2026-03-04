import { Node, Edge } from '@xyflow/react'

export type ProjectType = {
  id: number
  name: string
  description: string
  nodes: Node[]
  edges: Edge[]
  autoLayout: boolean
}
