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

export function EditMenu() {
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
        <MenubarItem disabled>Cut</MenubarItem>
        <MenubarItem disabled>Copy</MenubarItem>
        <MenubarItem disabled>Paste</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
