import { cn } from '@/lib/utils'

import TitleComponent from './TitleComponent'
import InputComponent from './InputComponent'
import ComboboxComponent from './ComboboxComponent'
import DataFlowComponent from './DataFlowComponent'

import { nodeInfo } from '@/constants'
import { CountryFlag } from './config/country'
import { ConfigDialog } from './config'
import { NodeParamType } from './types'

export function GenericNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {

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
        <CountryFlag countryCode={data.country} />
        <div className="text-lg">{data.role ?? 'No Role'}</div>
        <ConfigDialog data={data}/>
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
        <div className='flex flex-col items-center'>
          <div className='m-2 text-lg'>
            {data.showName ? (data.name ?? 'No name') : null}
          </div>
          <div className='flex flex-row items-center m-2'>
            <div className='text-sm'>
              {data.showDescription ? (data.description ?? '') : null}
            </div>
          </div>
        </div>
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
      className={cn(
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
      className={cn(
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
      className={cn(
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
      className={cn(
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
