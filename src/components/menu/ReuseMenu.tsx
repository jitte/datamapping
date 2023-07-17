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
import { DataFlowContext } from '@/contexts/dataFlowContext'
import { newNodeId } from '@/projects/utils'

export function ReuseMenu() {
  const { projects, currentProjectId } = useLocalStore()
  const { nodes, setNodes } = useContext(DataFlowContext)
  const [open, setOpen] = useState(false)

  let filteredNodes: Node[] = []
  projects
    .filter((pj) => pj.id !== currentProjectId)
    .forEach((pj) => {
      const namedNodes = pj.nodes.filter((node) => node.data.name)
      filteredNodes.push(...namedNodes)
    })

  function handleSelect(node: Node) {
    console.log('at: ReuseMenu', { node, nodes })
    const newNode: Node = {
      id: newNodeId(projects),
      type: node.type,
      position: { ...node.position },
      data: { ...node.data }
    }
    setNodes((nds) => nds.concat(newNode))
    setOpen(false)
  }

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
                {node.data.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </MenubarContent>
    </MenubarMenu>
  )
}
