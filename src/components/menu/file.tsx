import React, { useState } from 'react'
import { useReactFlow, getRectOfNodes } from 'reactflow'
import { Grip } from 'lucide-react'
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
import { roleInfo, roleList } from '@/constants'
import { downloadImage } from '@/lib/image'

function DownloadMenu() {
  const { getNodes } = useReactFlow()

  function onClick(format: 'svg' | 'png') {
    downloadImage(getRectOfNodes(getNodes()), format)
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>Download</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem className="download-btn" onClick={() => onClick('png')}>
          PNG Image
        </MenubarItem>
        <MenubarItem className="download-btn" onClick={() => onClick('svg')}>
          SVG Image
        </MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  )
}

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
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>New Entity</MenubarSubTrigger>
          <MenubarSubContent>
            <div className="text-xs">Drag item to create item</div>
            <MenubarSeparator />
            <EntityItems />
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <DownloadMenu />
        <MenubarSeparator />
        <MenubarItem disabled>Import...</MenubarItem>
        <ExportProjects />
      </MenubarContent>
    </MenubarMenu>
  )
}
