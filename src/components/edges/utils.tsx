import { Node, Edge } from 'reactflow'
import { NodeDataType } from '../nodes/types'
import { findNode } from '../nodes/utils'

export function findEdge(edges: Edge[], id: string): Edge {
  return edges.find((edge: Edge) => edge.id === id) as Edge
}

export function EdgeType(source: string, target: string, nodes: Node[]) {
  const sourceNode = findNode(nodes, source)
  const targetNode = findNode(nodes, target)
  return (sourceNode.data as NodeDataType).country ===
    (targetNode.data as NodeDataType).country
    ? 'domestic'
    : 'crossborder'
}
