import { useContext } from 'react'
import { Menubar } from '@/components/ui/menubar'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Flame } from 'lucide-react'

import { FileMenu } from './file'
import { InsertMenu } from './insert'
import { EditMenu } from './edit'
import { AlignMenu } from './align'
import { FindMenu } from './find'
import { ProjectMenu } from './projects'
import { PreferenceMenu } from './preference'

import { useLocalStore } from '@/lib/store'
import { DataFlowContext } from '@/contexts/dataFlowContext'
import { AutoLayout } from '@/lib/layout'

export function MyMenubar() {
  const { layout, setLayout, reactFlowInstance } = useContext(DataFlowContext)
  const { preference } = useLocalStore()

  const handleTemperature = () => {
    if (reactFlowInstance) {
      const layout = new AutoLayout(reactFlowInstance)
      layout.trigger()
      setLayout(layout)
    }
  }
  const DebugInfo = () => {
    const viewport = reactFlowInstance?.getViewport()
    const vpx = viewport?.x
    const vpy = viewport?.y
    const vpz = viewport?.zoom
    const centerX = AutoLayout.center.x.toFixed(2)
    const centerY = AutoLayout.center.y.toFixed(2)

    return preference.showDebugInfo ? (
      <HoverCardContent className='bg-white/90'>
        <div className="text-xs text-left">
          <h2>Reactflow Instance</h2>
          <ul className='ml-2 text-gray-500'>
            <li>viewport: ({`${vpx}, ${vpy}, ${vpz}`})</li>
            <li></li>
          </ul>
          <h2>Auto Layout</h2>
          <ul className="ml-2 text-gray-500">
            <li>center: ({`${centerX}, ${centerY}`})</li>
            <li>layoutWidth: {layout?.layoutWidth.toFixed(2)}</li>
            <li>layoutHeight: {layout?.layoutHeight.toFixed(2)}</li>
          </ul>
        </div>
      </HoverCardContent>
    ) : null
  }

  return (
    <Menubar className="bg-white/50">
      <FileMenu />
      <InsertMenu />
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
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex flex-row items-center">
              <Flame size={20} />
              {AutoLayout.temperature.toFixed(2)}
            </div>
          </HoverCardTrigger>
          <DebugInfo />
        </HoverCard>
      </Button>
      <PreferenceMenu />
    </Menubar>
  )
}
