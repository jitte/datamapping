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

import { roleInfo, roleList } from '@/constants'
import { addNode } from '../nodes/utils'
import { DataFlowContext } from '@/contexts/dataFlowContext'
import { AutoLayout, alParamTemperature } from '@/lib/layout'

const InsertMenu = () => {
  const { setNodes, reactFlowInstance, incrementNodeId } =
    useContext(DataFlowContext)
  const items = roleList

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
      addNode(incrementNodeId(), position, role, setNodes)
      AutoLayout.temperature = alParamTemperature
    }

    return items.map((item) => {
      const Icon = roleInfo[item].icon
      return (
        <MenubarItem
          key={item}
          draggable
          onDragStart={(event) => onDragStart(event, item)}
          onClick={() => handleClick(item)}
        >
          <div className="flex flex-row items-center w-full gap-2">
            <Icon size={16} />
            {item}
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
        <div className="text-xs">Drag item to create item</div>
        <MenubarSeparator />
        <EntityItems />
      </MenubarContent>
    </MenubarMenu>
  )
}

export { InsertMenu }
