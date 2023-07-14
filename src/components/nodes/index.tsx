import { cn } from '@/lib/utils'

import DataFlowComponent from './DataFlowComponent'

import { roleInfo } from '@/constants'
import { CountryFlag } from './config/country'
import { ConfigDialog } from './config'
import { NodeParamType } from './types'

export function GenericNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {

  const role = data.role ?? 'Other'
  const info = roleInfo[role]
  const Icon = info.icon

  function TitleComponent(): JSX.Element {
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
        <div hidden>{type}</div>
        <div className="text-lg">{role}</div>
        <ConfigDialog data={data}/>
      </div>
    )
  }

  function NameComponent() {
    return data.showName ? (
      <div className="text-lg text-center">{data.name ?? 'No name'}</div>
    ) : null
  }

  function IconComponent() {
    return data.showIcon ? (
      <div>
        <Icon size={64} />
      </div>
    ) : null
  }

  function DescriptionComponent() {
    return (data.showDescription && data.description) ? (
      <div className="text-sm">{data.description}</div>
    ) : null
  }

  return (
    <div
      className={cn(
        'flex flex-col w-60 bg-white border border-black rounded-lg',
        selected ? 'border border-blue-500' : 'border dark:border-gray-700'
      )}
    >
      <TitleComponent />
      <div className="w-full pb-2">
        <div className="flex flex-col items-center m-2">
          <NameComponent />
          <div className="flex flex-row items-center gap-2 m-2">
            <IconComponent />
            <DescriptionComponent />
          </div>
        </div>
        {data.hasContract ? (
          <DataFlowComponent name="Contract Flow" id={id} />
        ) : null}
        {data.hasPiiFlow ? <DataFlowComponent name="PII Flow" id={id} /> : null}
        {data.hasNonPiiFlow ? (
          <DataFlowComponent name="Non PII Flow" id={id} />
        ) : null}
      </div>
    </div>
  )
}
