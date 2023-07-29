import {
  MenubarContent,
  MenubarMenu,
  MenubarSub,
  MenubarTrigger,
  MenubarSeparator,
  MenubarCheckboxItem,
} from '@/components/ui/menubar'
import { Cog } from 'lucide-react'
import { ProjectsDialog } from '@/components/projects'
import { useLocalStore } from '@/lib/store'

const PreferenceMenu = () => {
  const { preference, storePreference } = useLocalStore()

  const handleEnableAutoLayout = (flag: boolean) => {
    storePreference({
      ...preference,
      enableAutoLayout: flag,
    })
  }

  const handleShowDebugInfo = (flag: boolean) => {
    storePreference({
      ...preference,
      showDebugInfo: flag,
    })
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>
        <Cog size={16} />
      </MenubarTrigger>
      <MenubarContent>
        <MenubarSub >
          <ProjectsDialog />
        </MenubarSub>
        <MenubarSeparator />
        <MenubarCheckboxItem
          onCheckedChange={handleEnableAutoLayout}
          checked={preference.enableAutoLayout}
        >
          Enable Auto Layout
        </MenubarCheckboxItem>
        <MenubarCheckboxItem
          onCheckedChange={handleShowDebugInfo}
          checked={preference.showDebugInfo}
        >
          Show Debug Information
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { PreferenceMenu }
