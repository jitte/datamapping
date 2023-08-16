import { useContext } from 'react'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarShortcut,
} from '@/components/ui/menubar'
import { DataFlowContext } from '@/lib/contexts'
import {
  cutNodes,
  copyNodes,
  pasteNodes,
  deleteNodes,
  selectNodes,
} from '@/components/nodes/utils'

function EditMenu() {
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    reactFlowInstance,
    incrementNodeId,
  } = useContext(DataFlowContext)

  const handleCut = () => {
    cutNodes(nodes, edges, reactFlowInstance)
  }

  const handleCopy = () => {
    copyNodes(nodes, edges)
  }

  const handlePaste = async () => {
    pasteNodes(setNodes, setEdges, incrementNodeId)
  }

  const handleDelete = () => {
    deleteNodes(nodes, reactFlowInstance)
  }

  const handleSelect = () => {
    selectNodes(nodes, setNodes, true)
  }
  
  const handleUnSelect = () => {
    selectNodes(nodes, setNodes, false)
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
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
        <MenubarSeparator />
        <MenubarItem onClick={handleDelete}>
          Delete
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={handleSelect}>
          Select All
        </MenubarItem>
        <MenubarItem onClick={handleUnSelect}>
          UnSelect All
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { EditMenu }
