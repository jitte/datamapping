import { useContext } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { NodeConfigContext } from '../types'

export function DescriptionComponent() {
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const description = nodeData.description ?? ''
  const showDescription = nodeData.showDescription ?? false
  function handleSwitch(showDescription: boolean) {
    setNodeData({ ...nodeData, showDescription })
  }
  function handleTextarea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNodeData({ ...nodeData, description: event.target.value })
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <div className="grow" />
        <Switch
          id="showDescription"
          checked={showDescription}
          onCheckedChange={handleSwitch}
        />
        <Label htmlFor="showDescription">Show</Label>
      </div>
      <Textarea
        id="description"
        defaultValue={description}
        onChange={handleTextarea}
      />
    </div>
  )
}
