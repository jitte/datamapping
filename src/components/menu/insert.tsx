import React, { useContext } from 'react'
import { XYPosition } from 'reactflow'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Grip } from 'lucide-react'

import { roleInfo } from '@/lib/constants'
import { addNode, selectNodes } from '../nodes/utils'
import { DataFlowContext } from '@/lib/contexts'
import { AutoLayout, alParamTemperature } from '@/lib/layout'

const InsertMenu = () => {
  const { setNodes, reactFlowInstance, incrementNodeId } =
    useContext(DataFlowContext)
  const roles = Object.keys(roleInfo)

  function EntityItems() {
    const onDragStart = (event: React.DragEvent, role: string) => {
      event.dataTransfer.setData('application/reactflow', role)
      event.dataTransfer.effectAllowed = 'move'
    }

    const handleClick = (role: string) => {
      let position: XYPosition = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      }
      if (reactFlowInstance) {
        position = reactFlowInstance.project(position)
      }
      selectNodes(setNodes, false)
      addNode(incrementNodeId(), position, role, setNodes)
      AutoLayout.temperature = alParamTemperature
    }

    return roles.map((role) => {
      const Icon = roleInfo[role].icon
      return (
        <MenubarItem
          key={role}
          draggable
          onDragStart={(event) => onDragStart(event, role)}
          onClick={() => handleClick(role)}
        >
          <div className="flex flex-row items-center w-full gap-2">
            <Icon size={16} />
            {role}
            <div className="grow" />
            <Grip size={10} />
          </div>
        </MenubarItem>
      )
    })
  }
  return (
    <MenubarMenu>
      <MenubarTrigger>Insert</MenubarTrigger>
      <MenubarContent>
        <div className="text-xs">Drag item to create node</div>
        <MenubarSeparator />
        <EntityItems />
      </MenubarContent>
    </MenubarMenu>
  )
}

export { InsertMenu }
