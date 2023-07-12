import { useContext } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { NodeConfigContext } from '../types'

export function NameComponent() {
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const name = nodeData.name ?? ''
  const showName = nodeData.showName ?? false
  function handleSwitch(showName: boolean) {
    setNodeData({ ...nodeData, showName })
  }
  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setNodeData({ ...nodeData, name: event.target.value })
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <div className="grow" />
        <Switch
          id="showName"
          checked={showName}
          onCheckedChange={handleSwitch}
        />
        <Label htmlFor="showName">Show</Label>
      </div>
      <Input id="name" defaultValue={name} onChange={handleInput} />
    </div>
  )
}
