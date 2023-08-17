import { useState, useContext } from 'react'
import { useNodeId } from 'reactflow'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { useLocalStore } from '@/lib/store'
import { NodeConfigContext } from '../types'
import { DataFlowContext } from '@/lib/contexts'
import { CountryFlag } from '@/components/countries'
import { findNode } from '../utils'
import { edgeType } from '../utils'

const PopoverContentCountry = ({
  country,
  onSelect,
}: {
  country: string
  onSelect: (country: string) => void
}) => {
  const { preference } = useLocalStore()
  let countryList: string[] = ['']
  if (preference.selectedCountries) {
    countryList = [...preference.selectedCountries, '']
  }
  return (
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandInput placeholder="Search country..." />
        <CommandEmpty>No such country.</CommandEmpty>
        <CommandGroup>
          {countryList.map((cc) => (
            <CommandItem key={cc} onSelect={() => onSelect(cc)}>
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  country === cc ? 'opacity-100' : 'opacity-0'
                )}
              />
              <CountryFlag countryCode={cc} showName />
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  )
}

const CountryComponentLong = () => {
  const [open, setOpen] = useState(false)
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const country = nodeData.country ?? ''

  const handleSelect = (country: string) => {
    setNodeData({ ...nodeData, country })
    setOpen(false)
  }
  return (
    <div className="flex flex-col gap-2">
      <Label>Country</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-row items-center justify-between"
          >
            <CountryFlag countryCode={country} showName />
            <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContentCountry country={country} onSelect={handleSelect} />
      </Popover>
    </div>
  )
}

const CountryComponentShort = () => {
  const [open, setOpen] = useState(false)
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const { nodes, setNodes, edges, setEdges } =
    useContext(DataFlowContext)
  const nodeId = useNodeId() ?? ''
  const currentNode = findNode(nodes, nodeId)
  if (!currentNode || !currentNode.data) return null

  const country = currentNode.data.country ?? ''

  const updateNodes = (country: string) => {
    const currentNode = findNode(nodes, nodeId)
    currentNode.data.country = country
    setNodes((nodes) => [
      ...nodes.filter((node) => node.id !== nodeId),
      currentNode,
    ])
  }

  const updateEdges = () => {
    for (const edge of edges) {
      edge.type = edgeType(edge.source, edge.target, nodes)
    }
    setEdges([...edges])
  }

  const handleSelect = (country: string) => {
    updateNodes(country)
    updateEdges()
    setNodeData({ ...nodeData, country })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <CountryFlag countryCode={country} />
        </PopoverTrigger>
        <PopoverContentCountry country={country} onSelect={handleSelect} />
      </Popover>
    </div>
  )
}

const CountryComponent = ({ showName = false }: { showName?: boolean }) => {
  return showName ? <CountryComponentLong /> : <CountryComponentShort />
}

export { CountryComponent }
