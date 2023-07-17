import {
  MenubarContent,
  MenubarMenu,
  MenubarSub,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Cog } from 'lucide-react'
import { ProjectsDialog } from '@/components/projects'

const PreferenceMenu = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        <Cog size={16} />
      </MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <ProjectsDialog />
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { PreferenceMenu }
