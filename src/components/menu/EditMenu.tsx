import { useContext } from 'react'
import { Node } from 'reactflow'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'

import { DataFlowContext } from '@/contexts/dataFlowContext'
import { useLocalStore } from '@/lib/store'
import { readClipboard, writeClipboard } from '@/lib/clipboard'

/* node JSON sample
{
  "id": "pj_1_node_2",
  "type": "genericNode",
  "position": {
    "x": 456,
    "y": 60
  },
  "data": {
    "showName": true,
    "showIcon": true,
    "showDescription": false,
    "hasContract": true,
    "hasPiiFlow": true,
    "hasNonPiiFlow": true,
    "role": "PII Controller",
    "country": "JP"
  },
  "width": 240,
  "height": 286,
  "selected": true,
  "dragging": false,
  "positionAbsolute": {
    "x": 456,
    "y": 60
  }
}
*/

export function EditMenu() {
  const { nodes, setNodes, reactFlowInstance } = useContext(DataFlowContext)
  const newNodeId = useLocalStore((state) => state.newNodeId)

  const handleCut = () => {
    const selectedNodes = nodes.filter((node) => node.selected)
    const value = JSON.stringify(selectedNodes, null, '  ')
    writeClipboard(value)
    reactFlowInstance?.deleteElements({ nodes: selectedNodes })
  }

  const handleCopy = () => {
    const selectedNodes = nodes.filter((node) => node.selected)
    const value = JSON.stringify(selectedNodes, null, '  ')
    writeClipboard(value)
  }

  const handlePaste = async () => {
    const value = await readClipboard()
    let newNodes: Node[]
    try {
      newNodes = JSON.parse(value)
    } catch (e) {
      console.log('JSON.parse error', e)
      return
    }
    if (!Array.isArray(newNodes)) return

    newNodes = newNodes.map<Node>((node: Node) => {
      if (node.position) {
        node.position.x = node.position.x + 12
        node.position.y = node.position.y + 12
      } else {
        node.position = { x: 0, y: 0 }
      }
      node.id = newNodeId()
      return node
    })
    setNodes((nds: Node[]) => nds.concat(newNodes))
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>Find</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem disabled>Search the web</MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>Find...</MenubarItem>
            <MenubarItem disabled>Find Next</MenubarItem>
            <MenubarItem disabled>Find Previous</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem onClick={handleCut}>Cut</MenubarItem>
        <MenubarItem onClick={handleCopy}>Copy</MenubarItem>
        <MenubarItem onClick={handlePaste}>Paste</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
