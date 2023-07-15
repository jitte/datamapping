import { Node } from 'reactflow'

export function findNode(nodes: Node[], id: string): Node {
  return nodes.find((node: Node) => node.id === id) as Node
}
