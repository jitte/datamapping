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
import { newNodeIdNumber } from '@/projects/utils'

function EditMenu() {
  const { nodes, setNodes, reactFlowInstance } = useContext(DataFlowContext)
  const projects = useLocalStore((state) => state.projects)

  const handleCut = () => {
    cutNodes(nodes, reactFlowInstance)
  }

  const handleCopy = () => {
    copyNodes(nodes)
  }

  const handlePaste = async () => {
    pasteNodes(nodes, setNodes, newNodeIdNumber(projects))
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
      </MenubarContent>
    </MenubarMenu>
  )
}

export { EditMenu }
