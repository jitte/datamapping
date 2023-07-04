import React, { useState } from 'react'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useLocalStore } from '@/lib/store'
import { nodeInfo } from '@/constants'

function ExportProjects() {
  const projects = useLocalStore((state) => state.projects)
  const [fileName, setFileName] = useState('Data mapping')
  const [open, setOpen] = useState(false)

  function normalCaseToSnakeCase(str: string) {
    return str
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word[0].toUpperCase() + word.slice(1).toLowerCase()
        }
        return word.toLowerCase()
      })
      .join('_')
  }

  function downloadFlow() {
    // create a data URI with the current flow data
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(projects, null, '\t')
    )}`

    // create a link element and set its properties
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `${normalCaseToSnakeCase(fileName)}.json`

    // simulate a click on the link element to trigger the download
    link.click()
    setOpen(false)
  }

  return (
    <MenubarSub>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent rounded-sm">
          Export...
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export projects</DialogTitle>
            <DialogDescription>
              Export all projects in JSON format.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <div>Filename</div>
              <Input
                id="name"
                className="col-span-3"
                value={fileName}
                onChange={(event) => {
                  setFileName(event.target.value)
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={downloadFlow}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MenubarSub>
  )
}

export function FileMenu() {
  const entityList = [
    'piiSubject',
    'piiController',
    'piiProcessor',
    'thirdParty',
  ]
  const items = entityList.map((type) => {
    return { name: nodeInfo[type].title, type }
  })
  function EntityItems() {
    const onDragStart = (event: React.DragEvent, type: string) => {
      event.dataTransfer.setData('application/reactflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }
    return (
      <MenubarSubContent>
        {items.map((item) => (
          <MenubarItem
            key={item.type}
            draggable
            onDragStart={(event) => onDragStart(event, item.type)}
          >
            {item.name}
          </MenubarItem>
        ))}
      </MenubarSubContent>
    )
  }
  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>New Entity</MenubarSubTrigger>
          <EntityItems />
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem>Import...</MenubarItem>
        <ExportProjects />
      </MenubarContent>
    </MenubarMenu>
  )
}
