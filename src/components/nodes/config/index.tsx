import { useState, useContext } from 'react'
import { useNodeId, Node } from 'reactflow'
import { Cog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { GlobalContext } from '@/contexts'
import { DataFlowContext } from '@/contexts/dataFlowContext'

import { NodeConfigContext, NodeDataType } from '../types'

import { RoleCompoment } from './role'
import { NameComponent } from './name'
import { DescriptionComponent } from './description'
import { IconComponent } from './icon'

export function ConfigDialog({ data }: { data: NodeDataType }) {
  const [open, setOpen] = useState(false)
  const [nodeData, setNodeData] = useState({ ...data })
  const { setProjectUpdated } = useContext(GlobalContext)
  const { nodes, setNodes } = useContext(DataFlowContext)
  const nodeId = useNodeId()

  console.log('at: ConfigDialog', { data, nodeData })

  function handleSubmit() {
    console.log('at: ConfigDialog/handleSubmit', nodeData)
    const currentNode = nodes.find((node: Node) => node.id === nodeId) as Node
    currentNode.data = nodeData
    const otherNodes = nodes.filter(
      (node: Node) => node.id !== nodeId
    ) as Node[]
    setNodes([...otherNodes, currentNode])
    setProjectUpdated(true)
    setOpen(false)
  }

  return (
    <NodeConfigContext.Provider
      value={{
        nodeData,
        setNodeData,
      }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Cog className="w-5 h-5" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Node Settings</DialogTitle>
            <DialogDescription>
              Make changes to your node here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <RoleCompoment />
              <div>
                <Label>Country</Label>
              </div>
            </div>
            <NameComponent />
            <DescriptionComponent />
            <div className="grid grid-cols-2 gap-8">
              <IconComponent />
              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <Switch id="hasContractScheme" />
                    <Label htmlFor="hasContractScheme">Contract Scheme</Label>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Switch id="hasPiiFlow" />
                    <Label htmlFor="hasPiiFlow">PII Flow</Label>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Switch id="hasNonPiiFlow" />
                    <Label htmlFor="hasNonPiiFlow">Non PII Flow</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-row">
            <Button variant="destructive" type="submit">
              Delete Node
            </Button>
            <div className="grow" />
            <Button type="submit" onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NodeConfigContext.Provider>
  )
}
