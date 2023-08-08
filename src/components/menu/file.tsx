import { useState, useContext } from 'react'
import { useReactFlow, getRectOfNodes } from 'reactflow'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import { useLocalStore } from '@/lib/store'
import { downloadImage } from '@/lib/image'
import { DataFlowContext } from '@/lib/contexts'
import { ProjectType } from '@/components/projects/types'
import { newProjectId } from '@/components/projects/utils'

const DownloadMenu = () => {
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

const ExportProjects = () => {
  const projects = useLocalStore((state) => state.projects)
  const [fileName, setFileName] = useState('Data mapping')
  const [open, setOpen] = useState(false)

  const normalCaseToSnakeCase = (str: string) => {
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

  const downloadFlow = () => {
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
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent rounded-sm">
        Export...
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Dialog</DialogTitle>
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
  )
}

const ImportProjects = () => {
  const { projects, storeProjects } = useLocalStore()
  const { incrementNodeId } = useContext(DataFlowContext)
  const [open, setOpen] = useState(false)
  const [preserve, setPreserve] = useState(true)
  const [preview, setPreview] = useState('')
  let newProjects: ProjectType[] = []

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    if (!target.files) return
    const file = target.files[0]
    console.log(file)
    // check if the file type is application/json
    if (!file || file.type !== 'application/json') {
      setPreview(
        '**ERROR** File format is not JSON.'
      )
      return
    }
    file
      .text()
      .then((text) => {
        setPreview(text)
      })
      .catch((reason) => {
        setPreview(reason)
      })
  }

  const handleImport = () => {
    try {
      newProjects = JSON.parse(preview) as ProjectType[]
    } catch {
      setPreview('***ERROR*** Could not parse JSON.')
      return
    }
    if (preserve) {
      let id = newProjectId(projects)
      for (const pj of newProjects) {
        pj.id = id++
        const nodeMap: { [key: string]: string } = {}
        pj.nodes.forEach((node) => {
          const newId = `node_${incrementNodeId()}`
          nodeMap[node.id] = newId
          node.id = newId
        })
        pj.edges.forEach((edge) => {
          edge.source = nodeMap[edge.source]
          edge.target = nodeMap[edge.target]
        })
      }
      storeProjects([...newProjects, ...projects])
    } else {
      storeProjects(newProjects)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent rounded-sm">
        Import...
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Dialog</DialogTitle>
          <DialogDescription>
            Import projects from local JSON file.
          </DialogDescription>
        </DialogHeader>
        <Label>Select File</Label>
        <Input type="file" onChange={handleUpload} />
        <Label>Preview Data </Label>
        <div className="w-full h-20 p-4 overflow-scroll text-xs text-gray-500 border rounded-md">
          {preview}
        </div>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            id="preserve"
            checked={preserve}
            onCheckedChange={(value) => setPreserve(!!value)}
          />
          <Label htmlFor="preserve">Preserve current projects</Label>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const FileMenu = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <DownloadMenu />
        <MenubarSeparator />
        <MenubarSub>
          <ImportProjects />
        </MenubarSub>
        <MenubarSub>
          <ExportProjects />
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { FileMenu }
