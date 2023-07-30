import {
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarCheckboxItem,
} from '@/components/ui/menubar'
import { Cog } from 'lucide-react'
import { useLocalStore } from '@/lib/store'

const PreferenceMenu = () => {
  const { preference, storePreference } = useLocalStore()

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
