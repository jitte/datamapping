import { useContext } from 'react'
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
import { useLocalStore } from '@/lib/store'
import { GlobalContext } from '@/contexts'
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
    <Menubar>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
      <div className="grow" />
      <ProjectMenu />
    </Menubar>
  )
}
