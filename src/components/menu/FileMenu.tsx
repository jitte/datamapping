import React, { useState } from 'react'
import { useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow'
import { toPng } from 'html-to-image'
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

function DownloadImage() {
  const imageWidth = 2048
  const imageHeight = 1536
  const { getNodes } = useReactFlow()

  function downloadImage(dataUrl: string) {
    const a = document.createElement('a')

    a.setAttribute('download', 'reactflow.png')
    a.setAttribute('href', dataUrl)
    a.click()
  }

  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes())
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    )

    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      width: imageWidth,
      height: imageHeight,
      style: {
        width: String(imageWidth),
        height: String(imageHeight),
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage)
  }

  return (
    <MenubarItem className="download-btn" onClick={onClick}>
      Download Image
    </MenubarItem>
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
            <div className="text-xs">Drag item to create node</div>
            <EntityItems />
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <DownloadImage />
        <MenubarSeparator />
        <MenubarItem disabled>Import...</MenubarItem>
        <ExportProjects />
      </MenubarContent>
    </MenubarMenu>
  )
}
