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
import { CountryComponent } from './country'
import { NameComponent } from './name'
import { DescriptionComponent } from './description'
import { IconComponent } from './icon'

export function ConfigDialog({ data }: { data: NodeDataType }) {
  const [open, setOpen] = useState(false)
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const { setProjectUpdated } = useContext(GlobalContext)
  const { nodes, setNodes } = useContext(DataFlowContext)
  const nodeId = useNodeId()

  function handleDelete() {
    const otherNodes = nodes.filter(
      (node: Node) => node.id !== nodeId
    ) as Node[]
    setNodes(otherNodes)
    setProjectUpdated(true)
    setOpen(false)
  }

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
    <Dialog
      open={open}
      onOpenChange={(newState) => {
        if (newState === false) {
          // dialog is closing
          setNodeData({ ...data }) // reset to original data
        }
        setOpen(newState)
      }}
    >
      <DialogTrigger>
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
            <CountryComponent />
            <RoleCompoment />
          </div>
          <NameComponent />
          <DescriptionComponent />
          <div className="grid grid-cols-2 gap-8">
            <IconComponent />
            <div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Switch
                    id="hasContractScheme"
                    disabled
                    defaultChecked={data.hasContract}
                  />
                  <Label htmlFor="hasContractScheme">Contract Scheme</Label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Switch
                    id="hasPiiFlow"
                    disabled
                    defaultChecked={data.hasPiiFlow}
                  />
                  <Label htmlFor="hasPiiFlow">PII Flow</Label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Switch
                    id="hasNonPiiFlow"
                    disabled
                    defaultChecked={data.hasNonPiiFlow}
                  />
                  <Label htmlFor="hasNonPiiFlow">Non PII Flow</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Node
          </Button>
          <div className="grow" />
          <Button type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
