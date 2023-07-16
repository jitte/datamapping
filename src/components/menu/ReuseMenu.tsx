import { useState, useContext } from 'react'
import { Node } from 'reactflow'
import { ChevronsUpDown } from 'lucide-react'
import {
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

import { useLocalStore } from '@/lib/store'
import { allNodes } from '@/projects/utils'
import { GlobalContext } from '@/contexts'
import { DataFlowContext } from '@/contexts/dataFlowContext'

export function ReuseMenu() {
  // imports from global context
  const { currentProject } = useContext(GlobalContext)

  // imports from dataflow context
  const { nodes, setNodes } = useContext(DataFlowContext)

  // all projects and nodes that has own entity name
  const projects = useLocalStore((state) => state.projects)
  const filteredNodes = allNodes(projects).filter(
    (node) =>
      (node.data.entity_name ?? '').length > 0 &&
      !currentProject.nodes.find((nd) => nd.id === node.id)
  )
  function handleSelect(node: Node) {
    console.log('at: ReuseMenu', { node, nodes })
    setNodes((nds) => nds.concat(node))
    setOpen(false)
  }

  const [open, setOpen] = useState(false)
  return (
    <MenubarMenu>
      <MenubarTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] h-8 justify-between"
        >
          Search entity
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </MenubarTrigger>
      <MenubarContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Filter..." />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
            {filteredNodes.map((node) => (
              <CommandItem key={node.id} onSelect={() => handleSelect(node)}>
                {node.data.entity_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </MenubarContent>
    </MenubarMenu>
  )
}
