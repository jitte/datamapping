import * as React from 'react'
import { useState, useContext } from 'react'
import { Node } from 'reactflow'
import { ChevronsUpDown } from 'lucide-react'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
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

import { useLocalStore, allNodes } from '@/lib/store'
import { GlobalContext } from '@/contexts'
import { DataFlowContext } from '@/contexts/dataFlowContext'
import { nodeInfo } from '@/constants'

function FileMenu() {
  const { setShowExportModal } = useContext(GlobalContext)
  const entityList = [
    'piiSubject',
    'piiController',
    'piiProcessor',
    'thirdParty',
  ]
  const items = entityList.map((type) => {
    return { name: nodeInfo[type].title, type }
  })
  function EntityItems() {
    const onDragStart = (event: React.DragEvent, type: string) => {
      event.dataTransfer.setData('application/reactflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }
    return (
      <MenubarSubContent>
        {items.map((item) => (
          <MenubarItem
            key={item.type}
            draggable
            onDragStart={(event) => onDragStart(event, item.type)}
          >
            {item.name}
          </MenubarItem>
        ))}
      </MenubarSubContent>
    )
  }
  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>New Entity</MenubarSubTrigger>
          <EntityItems />
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem>Import...</MenubarItem>
        <MenubarItem onClick={() => setShowExportModal(true)}>
          Export...
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function ReuseMenu() {
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
          className="w-[200px] justify-between"
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

function EditMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          Undo <MenubarShortcut>⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Find</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>Search the web</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Find...</MenubarItem>
            <MenubarItem>Find Next</MenubarItem>
            <MenubarItem>Find Previous</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem>Cut</MenubarItem>
        <MenubarItem>Copy</MenubarItem>
        <MenubarItem>Paste</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function ViewMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
        <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarItem inset>
          Reload <MenubarShortcut>⌘R</MenubarShortcut>
        </MenubarItem>
        <MenubarItem disabled inset>
          Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem inset>Toggle Fullscreen</MenubarItem>
        <MenubarSeparator />
        <MenubarItem inset>Hide Sidebar</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

function ProjectMenu() {
  const { setShowProjectModal, currentProject, setCurrentProject } =
    useContext(GlobalContext)
  const projects = useLocalStore((state) => state.projects)

  function ProjectList() {
    function handleChange(value: string) {
      const project = projects.find((project) => project.id === Number(value))
      if (project) setCurrentProject(project)
    }
    return (
      <MenubarRadioGroup
        value={String(currentProject.id)}
        onValueChange={(value) => handleChange(value)}
      >
        {projects.map((project) => (
          <MenubarRadioItem value={String(project.id)} key={String(project.id)}>
            {project.name}
          </MenubarRadioItem>
        ))}
      </MenubarRadioGroup>
    )
  }
  return (
    <MenubarMenu>
      <MenubarTrigger>Projects</MenubarTrigger>
      <MenubarContent>
        <ProjectList />
        <MenubarSeparator />
        <MenubarItem inset onClick={() => setShowProjectModal(true)}>
          Edit...
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem inset>Add Profile...</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export function MyMenubar() {
  return (
    <div className="z-10">
    <Menubar className='bg-white/50'>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
      <div className="grow" />
      <ReuseMenu />
      <div className="grow" />
      <ProjectMenu />
    </Menubar>
    </div>
  )
}
