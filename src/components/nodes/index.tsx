import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Cog } from 'lucide-react'

import TitleComponent from './TitleComponent'
import InputComponent from './InputComponent'
import ComboboxComponent from './ComboboxComponent'
import DataFlowComponent from './DataFlowComponent'
import { nodeInfo } from '@/constants'
import { CountryCombobox } from './country'

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ')
}

export type NodeParamType = {
  id: string
  data: NodeDataType
  type: string
  selected: boolean
}

export type NodeDataType = {
  entity_name?: string
  country_name?: string
  country?: string
  role?: string
  name?: string
  showName?: boolean
  icon?: string
  showIcon?: boolean
  description?: string
  showDescription?: boolean
  hasContract?: boolean
  hasPiiFlow?: boolean
  hasNonPiiFlow?: boolean
}

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from '@/components/ui/textarea'

const roleList: string[] = [
  'PII Principal',
  'PII Controller',
  'PII Processor',
  'Third Party'
]
export function GenericNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {

  function ConfigDialog() {
    const [open, setOpen] = useState(false)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
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
              <div className='flex flex-col gap-2'>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleList.map((role) => (
                      <SelectItem value="role">{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Country</Label>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-2">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="grow" />
                <Switch id="showName" />
                <Label htmlFor="showName">Show</Label>
              </div>
              <Input id="name" onChange={() => {}} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-2">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <div className="grow" />
                <Switch id="showDescription" />
                <Label htmlFor="showDescription">Show</Label>
              </div>
              <Textarea id="description" onChange={() => {}} />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Label htmlFor="icon" className="text-right">
                    Icon
                  </Label>
                  <div className="grow" />
                  <Switch id="showIcon" />
                  <Label htmlFor="showIcon">Show</Label>
                </div>
                <div></div>
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <Switch id="hasContractScheme" />
                    <Label htmlFor="hasContractScheme">Contract Scheme</Label>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Switch id="hasPiiFlow" />
                    <Label htmlFor="hasPiiFlow">PII Flow</Label>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Switch id="hasNonPiiFlow" />
                    <Label htmlFor="hasNonPiiFlow">Non PII Flow</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className='flex flex-row'>
            <Button variant="destructive" type="submit">
              Delete Node
            </Button>
            <div className='grow' />
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  function TitleComponent(): JSX.Element {
    const info = nodeInfo[type]
    return (
      <div
        className={cn(
          'flex flex-row items-center justify-between',
          'rounded-t-lg p-2 text-white font-medium bg-gradient-to-br',
          info.from, // gradient from
          info.to // gradient to
        )}
      >
        <CountryCombobox data={data} />
        <div className="text-lg">{info.title}</div>
        <ConfigDialog />
      </div>
    )
  }
  return (
    <div
      className={cn(
        'flex flex-col w-80 bg-white border border-black rounded-lg',
        selected ? 'border border-blue-500' : 'border dark:border-gray-700'
      )}
    >
      <TitleComponent />
      <div className="w-full pb-2">
        <ComboboxComponent name="country_name" caption="Country" data={data} />
        <DataFlowComponent name="Contract Scheme" id={id} />
        <DataFlowComponent name="PII Flow" id={id} />
        <DataFlowComponent name="Non PII Flow" id={id} />
      </div>
    </div>
  )
}

export function PiiSubjectNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {
  return (
    <div
      className={classNames(
        'flex flex-col w-80 bg-white border border-black rounded-lg',
        selected ? 'border border-blue-500' : 'border dark:border-gray-700'
      )}
    >
      <TitleComponent
        nodeType={type}
        description="Identified or identifiable natural person"
        nodeId={id}
      />
      <div className="w-full pb-2">
        <ComboboxComponent name="country_name" caption="Country" data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  )
}

export function PiiControllerNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {
  return (
    <div
      className={classNames(
        'flex flex-col w-80 bg-white border border-black rounded-lg',
        selected ? 'border border-blue-500' : 'border dark:border-gray-700'
      )}
    >
      <TitleComponent
        nodeType={type}
        description="Determines the purposes for which and the means by which personal data is processed"
        nodeId={id}
      />
      <div className="pb-2">
        <InputComponent name="entity_name" caption="Entity Name" data={data} />
        <ComboboxComponent name="country_name" caption="Country" data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  )
}

export function PiiProcessorNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {
  return (
    <div
      className={classNames(
        'flex flex-col w-80 bg-white border border-black rounded-lg',
        selected ? 'border border-blue-500' : 'border dark:border-gray-700'
      )}
    >
      <TitleComponent
        nodeType={type}
        description="Processes personal data only on behalf of the controller"
        nodeId={id}
      />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" data={data} />
        <ComboboxComponent name="country_name" caption="Country" data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  )
}

export function ThirdPartyNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {
  return (
    <div
      className={classNames(
        'flex flex-col w-80 bg-white border border-black rounded-lg',
        selected ? 'border border-blue-500' : 'border dark:border-gray-700'
      )}
    >
      <TitleComponent
        nodeType={type}
        description="Entity other than PII controller or PII processor"
        nodeId={id}
      />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" data={data} />
        <ComboboxComponent name="country_name" caption="Country" data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  )
}
