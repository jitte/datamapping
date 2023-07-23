import { useContext } from 'react'
import { Menubar } from '@/components/ui/menubar'
import { Button } from '../ui/button'
import { Flame } from 'lucide-react'

import { FileMenu } from './file'
import { EditMenu } from './edit'
import { AlignMenu } from './align'
import { FindMenu } from './find'
import { ProjectMenu } from './projects'
import { PreferenceMenu } from './preference'

import { DataFlowContext } from '@/contexts/dataFlowContext'
import { AutoLayout } from '@/lib/layout'

export function MyMenubar() {
  const { setLayout } = useContext(DataFlowContext)

  const handleTemperature = () => {
    const layout = new AutoLayout()
    layout.trigger()
    setLayout(layout)
  }
  return (
    <Menubar className="bg-white/50">
      <FileMenu />
      <EditMenu />
      <AlignMenu />
      <FindMenu />
      <div className="grow" />
      <ProjectMenu />
      <div className="grow" />
      <Button
        variant="ghost"
        onClick={handleTemperature}
        className="flex flex-row items-center gap-2"
      >
        <Flame size={20} />
        {AutoLayout.temperature.toFixed(2)}
      </Button>
      <PreferenceMenu />
    </Menubar>
  )
}
