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

const cutNodes = (
  nodes: Node[],
  reactFlowInstance: ReactFlowInstance | null
) => {
  const selectedNodes = nodes.filter((node) => node.selected)
  const value = JSON.stringify(selectedNodes, null, '  ')
  writeClipboard(value)
  reactFlowInstance?.deleteElements({ nodes: selectedNodes })
}

const copyNodes = (nodes: Node[]) => {
  const selectedNodes = nodes.filter((node) => node.selected)
  const value = JSON.stringify(selectedNodes, null, '  ')
  writeClipboard(value)
}

const pasteNodes = async (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  incrementNodeId: () => number,
  offset: XYPosition = { x: 0, y: 0 }
) => {
  const value = await readClipboard()
  let newNodes: Node[]
  try {
    newNodes = JSON.parse(value)
  } catch (e) {
    console.log('JSON.parse error', e)
    return
  }
  if (!Array.isArray(newNodes)) return

  nodes.map((node) => {
    node.selected = false
  })
  newNodes = newNodes.map<Node>((node: Node) => {
    if (node.position) {
      node.position.x = node.position.x + offset.x
      node.position.y = node.position.y + offset.y
    } else {
      node.position = { x: 0, y: 0 }
    }
    node.id = `node_${incrementNodeId()}`
    return node
  })
  setNodes((nds: Node[]) => nds.concat(newNodes))
}

const deleteNodes = (
  nodes: Node[],
  reactFlowInstance: ReactFlowInstance | null
) => {
  const selectedNodes = nodes.filter((node) => node.selected)
  reactFlowInstance?.deleteElements({ nodes: selectedNodes })
}

const selectNodes = (
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  selected: boolean
) => {
  nodes.map((node) => {
    node.selected = selected
  })
  setNodes([...nodes])
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
