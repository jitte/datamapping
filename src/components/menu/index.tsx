import { Menubar } from '@/components/ui/menubar'

import { FileMenu } from './file'
import { EditMenu } from './edit'
import { AlignMenu } from './align'
import { FindMenu } from './find'
import { ViewMenu } from './ViewMenu'
import { ReuseMenu } from './ReuseMenu'
import { ProjectMenu } from './projects'
import { PreferenceMenu } from './preference'

export function MyMenubar() {
  return (
    <Menubar className="bg-white/50">
      <FileMenu />
      <EditMenu />
      <AlignMenu />
      <FindMenu />
      <ViewMenu />
      <ReuseMenu />
      <div className="grow" />
      <ProjectMenu />
      <div className="grow" />
      <PreferenceMenu />
    </Menubar>
  )
}
