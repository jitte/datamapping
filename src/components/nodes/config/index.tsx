import { useState, useContext } from 'react'
import { useNodeId, Node } from 'reactflow'
import { Pencil } from 'lucide-react'
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

import { DataFlowContext } from '@/lib/contexts'
import { NodeConfigContext, NodeDataType } from '@/components/nodes/types'
import { findNode } from '@/components/nodes/utils'
import { edgeType } from '@/components/nodes/utils'
import { RoleCompoment } from './role'
import { CountryComponent } from './country'
import { NameComponent } from './name'
import { DescriptionComponent } from './description'
import { IconComponent } from './icon'

export function ConfigDialog({ data }: { data: NodeDataType }) {
  const [open, setOpen] = useState(false)
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const { nodes, setNodes, edges, setEdges, reactFlowInstance } =
    useContext(DataFlowContext)
  const nodeId = useNodeId() ?? ''

  function handleDelete() {
    const node = findNode(nodes, nodeId)
    reactFlowInstance?.deleteElements({ nodes: [node] })
    setOpen(false)
  }

  function updateNodes(currentNode: Node) {
    currentNode.data = nodeData
    const otherNodes = nodes.filter(
      (node: Node) => node.id !== nodeId
    ) as Node[]
    setNodes([...otherNodes, currentNode])
  }

  function updateEdges() {
    console.log('at ConfigDialog/updateEdges', { edges })
    for (let edge of edges) {
      edge.type = edgeType(edge.source, edge.target, nodes)
      console.log(`${edge.source} and ${edge.target} is ${edge.type}`)
    }
    console.log('at ConfigDialog/updateEdges', { edges })
    setEdges([...edges])
  }

  function handleSubmit() {
    console.log('at: ConfigDialog/handleSubmit', nodeData)
    const currentNode = findNode(nodes, nodeId)
    updateNodes(currentNode)
    updateEdges()
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
        <Pencil className="w-5 h-5 mx-1" />
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
