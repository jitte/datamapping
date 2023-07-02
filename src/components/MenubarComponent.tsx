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

function FileMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>New Entity</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>PII Subject</MenubarItem>
            <MenubarItem>PII Controller</MenubarItem>
            <MenubarItem>PII Processor</MenubarItem>
            <MenubarItem>Third Party</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem>Import...</MenubarItem>
        <MenubarItem>Export...</MenubarItem>
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
  return (
    <MenubarMenu>
      <MenubarTrigger>Projects</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup value="benoit">
          <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
          <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
          <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarItem inset>Edit...</MenubarItem>
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
