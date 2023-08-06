import {
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { Cog } from 'lucide-react'
import { useLocalStore } from '@/lib/store'
import { CountryDialog } from '@/components/countries'

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
        <CountryDialog />
        <MenubarSeparator />
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
