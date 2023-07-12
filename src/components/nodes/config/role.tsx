import { useContext } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { NodeConfigContext } from '../types'

const roleList: string[] = [
  'PII Principal',
  'PII Controller',
  'PII Processor',
  'Third Party',
]

export function RoleCompoment() {
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const role = nodeData.role ?? ''
  function handleChange(role: string) {
    setNodeData({ ...nodeData, role })
  }
  return (
    <div className="flex flex-col gap-2">
      <Label>Role</Label>
      <Select defaultValue={role} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roleList.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
