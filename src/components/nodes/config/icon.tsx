import { useContext } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { NodeConfigContext } from '../types'

export function IconComponent() {
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  //const icon = nodeData.icon ?? ''
  const showIcon = nodeData.showIcon ?? false
  function handleSwitch(showIcon: boolean) {
    setNodeData({ ...nodeData, showIcon })
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Switch
          id="showIcon"
          checked={showIcon}
          onCheckedChange={handleSwitch}
        />
        <Label htmlFor="showIcon">Show Icon</Label>
      </div>
      <div></div>
    </div>
  )
}
