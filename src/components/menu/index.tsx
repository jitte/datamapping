import { Menubar } from '@/components/ui/menubar'

import { FileMenu } from './FileMenu'
import { EditMenu } from './edit'
import { AlignMenu } from './align'
import { ViewMenu } from './ViewMenu'
import { ReuseMenu } from './ReuseMenu'
import { ProjectMenu } from './ProjectMenu'

export function MyMenubar() {
  return (
    <Menubar className="bg-white/50">
      <FileMenu />
      <EditMenu />
      <AlignMenu />
      <ViewMenu />
      <div className="grow" />
      <ReuseMenu />
      <div className="grow" />
      <ProjectMenu />
    </Menubar>
  )
}
