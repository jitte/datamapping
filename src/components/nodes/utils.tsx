import React from 'react'
import { Node, ReactFlowInstance, XYPosition } from 'reactflow'

import { writeClipboard, readClipboard } from '@/lib/clipboard'
import { roleInfo } from '@/constants'

const findNode = (nodes: Node[], id: string): Node => {
  return nodes.find((node: Node) => node.id === id) as Node
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
  newNodeIdNumber: number
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
      node.position.x = node.position.x + 12
      node.position.y = node.position.y + 12
    } else {
      node.position = { x: 0, y: 0 }
    }
    node.id = `node_${newNodeIdNumber}`
    newNodeIdNumber++
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
  newNodeIdNumber: number,
  position: XYPosition,
  role: string,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const newNode: Node = {
    id: `node_${newNodeIdNumber}`,
    type: 'genericNode',
    position,
    data: { ...roleInfo[role].defaults, role },
  }
  setNodes((nds: Node[]) => nds.concat(newNode))
}

export { findNode, copyNodes, cutNodes, pasteNodes, deleteNodes, selectNodes, addNode }
