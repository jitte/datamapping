import {
  MenubarContent,
  MenubarMenu,
  MenubarItem,
  MenubarTrigger,
  MenubarSeparator,
  MenubarCheckboxItem,
} from '@/components/ui/menubar'
import { Cog } from 'lucide-react'
import { ProjectsDialog } from '@/components/projects'
import { useLocalStore } from '@/lib/store'

const PreferenceMenu = () => {
  const { preference, storePreference } = useLocalStore()

  const handleEnableAutoLayout = () => {
    storePreference({
      ...preference,
      enableAutoLayout: !preference.enableAutoLayout,
    })
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>
        <Cog size={16} />
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem asChild>
          <ProjectsDialog />
        </MenubarItem>
        <MenubarSeparator />
        <MenubarCheckboxItem
          onCheckedChange={handleEnableAutoLayout}
          checked={preference.enableAutoLayout}
        >
          Enable Auto Layout{' '}
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { PreferenceMenu }
