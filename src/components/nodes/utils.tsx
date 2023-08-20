import React from 'react'
import { Node, Edge, ReactFlowInstance, XYPosition } from 'reactflow'

import { writeClipboard, readClipboard } from '@/lib/clipboard'
import { roleInfo } from '@/lib/constants'

const findNode = (nodes: Node[], id: string): Node => {
  return nodes.find((node: Node) => node.id === id) as Node
}

const findEdge = (edges: Edge[], id: string): Edge => {
  return edges.find((edge: Edge) => edge.id === id) as Edge
}

const selectedNodesAndEdges = (nodes: Node[], edges: Edge[]) => {
  const selectedNodes = nodes.filter((node) => node.selected)
  const selectedEdges = edges.filter((edge) => {
    const source = findNode(selectedNodes, edge.source)
    const target = findNode(selectedNodes, edge.target)
    return source && target
  })
  return { selectedNodes, selectedEdges }
}

const cutNodes = (
  nodes: Node[],
  edges: Edge[],
  reactFlowInstance: ReactFlowInstance | null
) => {
  const { selectedNodes, selectedEdges } = selectedNodesAndEdges(nodes, edges)
  const value = JSON.stringify(
    { nodes: selectedNodes, edges: selectedEdges },
    null,
    '  '
  )
  writeClipboard(value)
  reactFlowInstance?.deleteElements({ nodes: selectedNodes })
}

const copyNodes = (nodes: Node[], edges: Edge[]) => {
  const { selectedNodes, selectedEdges } = selectedNodesAndEdges(nodes, edges)
  const value = JSON.stringify(
    { nodes: selectedNodes, edges: selectedEdges },
    null,
    '  '
  )
  writeClipboard(value)
}

const pasteNodes = async (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  incrementNodeId: () => number,
  offset: XYPosition = { x: 0, y: 0 }
) => {
  const value = await readClipboard()
  let newNodes: Node[]
  let newEdges: Edge[]
  try {
    const result = JSON.parse(value)
    newNodes = result.nodes
    newEdges = result.edges
  } catch (e) {
    console.log('JSON.parse error', e)
    return
  }
  if (!Array.isArray(newNodes)) return

  setNodes((nodes) => {
    for (const node of nodes) {
      node.selected = false
    }
    const nodeMap: { [key: string]: string } = {}
    newNodes = newNodes.map<Node>((node: Node) => {
      if (node.position) {
        node.position.x = node.position.x + offset.x
        node.position.y = node.position.y + offset.y
      } else {
        node.position = { x: 0, y: 0 }
      }
      const oldId = node.id
      node.id = `node_${incrementNodeId()}`
      nodeMap[oldId] = node.id
      return node
    })
    setEdges((edges: Edge[]) => {
      for (const edge of newEdges) {
        edge.source = nodeMap[edge.source]
        edge.target = nodeMap[edge.target]
        edge.id = `reactflow__edge-${edge.source}${edge.sourceHandle}-${edge.target}${edge.targetHandle}`
      }
      return edges.concat(newEdges)
    })
    return nodes.concat(newNodes)
  })
}

const deleteNodes = (
  nodes: Node[],
  reactFlowInstance: ReactFlowInstance | null
) => {
  const selectedNodes = nodes.filter((node) => node.selected)
  reactFlowInstance?.deleteElements({ nodes: selectedNodes })
}

const selectNodes = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  selected: boolean
) => {
  setNodes((nodes) => {
    for (const node of nodes) {
      node.selected = selected
    }
    return [...nodes]
  })
}

const addNode = (
  id: number,
  position: XYPosition,
  role: string,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const newNode: Node = {
    id: `node_${id}`,
    type: 'genericNode',
    position,
    data: { ...roleInfo[role].defaults, role },
    selected: true,
  }
  setNodes((nds: Node[]) => nds.concat(newNode))
}

const edgeType = (source: string, target: string, nodes: Node[]) => {
  const sourceNode = findNode(nodes, source)
  const targetNode = findNode(nodes, target)
  //console.log('at: edgeType', {source, target, nodes, sourceNode, targetNode})
  if (sourceNode === undefined || targetNode === undefined) return 'domestic' // default

  const sourceCountry = sourceNode.data.country ?? ''
  const targetCountry = targetNode.data.country ?? ''
  if (sourceCountry === '' || targetCountry === '') return 'domestic' // default

  return sourceCountry === targetCountry ? 'domestic' : 'crossborder'
}

export {
  findNode,
  findEdge,
  copyNodes,
  cutNodes,
  pasteNodes,
  deleteNodes,
  selectNodes,
  addNode,
  edgeType,
}
