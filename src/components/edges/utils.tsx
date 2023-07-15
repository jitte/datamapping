import { Node, Edge } from 'reactflow'
import { findNode } from '../nodes/utils'

export function findEdge(edges: Edge[], id: string): Edge {
  return edges.find((edge: Edge) => edge.id === id) as Edge
}

export function EdgeType(source: string, target: string, nodes: Node[]) {
  const sourceNode = findNode(nodes, source)
  const targetNode = findNode(nodes, target)
  if (sourceNode === undefined || targetNode === undefined) return 'domestic' // default

  const sourceCountry = sourceNode.data.country ?? ''
  const targetCountry = targetNode.data.country ?? ''
  if (sourceCountry === '' || targetCountry === '') return 'domestic' // default

  return sourceCountry === targetCountry ? 'domestic' : 'crossborder'
}
