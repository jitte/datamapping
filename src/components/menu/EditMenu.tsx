import { useContext } from 'react'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarShortcut,
} from '@/components/ui/menubar'

import { DataFlowContext } from '@/contexts/dataFlowContext'
import { useLocalStore } from '@/lib/store'
import { cutNodes, copyNodes, pasteNodes } from '@/components/nodes/utils'

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
    cutNodes(nodes, reactFlowInstance)
  }

  const handleCopy = () => {
    copyNodes(nodes)
  }

  const handlePaste = async () => {
    pasteNodes(nodes, setNodes, newNodeId())
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
        <MenubarItem onClick={handleCut}>
          Cut
          <MenubarShortcut>^X</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={handleCopy}>
          Copy
          <MenubarShortcut>^C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={handlePaste}>
          Paste
          <MenubarShortcut>^V</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
