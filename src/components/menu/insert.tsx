import React from 'react'
import { Grip } from 'lucide-react'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { roleInfo, roleList } from '@/constants'

const InsertMenu = () => {
  const items = roleList

  function EntityItems() {
    const onDragStart = (event: React.DragEvent, role: string) => {
      event.dataTransfer.setData('application/reactflow', role)
      event.dataTransfer.effectAllowed = 'move'
    }
    return items.map((item) => {
      const Icon = roleInfo[item].icon
      return (
        <MenubarItem
          key={item}
          draggable
          onDragStart={(event) => onDragStart(event, item)}
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
