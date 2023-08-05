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
import { roleInfo } from '@/lib/constants'

export function RoleCompoment() {
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const roles = Object.keys(roleInfo)
  const currentRole = nodeData.role ?? ''
  function handleChange(role: string) {
    setNodeData({ ...nodeData, role })
  }
  return (
    <div className="flex flex-col gap-2">
      <Label>Role</Label>
      <Select defaultValue={currentRole} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
