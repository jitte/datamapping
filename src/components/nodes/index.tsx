import { useState, useContext } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

import { roleInfo } from '@/constants'
import { NodeParamType, NodeConfigContext } from './types'
import { FlowComponent } from './flow'
import { ConfigDialog } from './config'
import { CountryFlag } from './config/country'

import { useLocalStore } from '@/lib/store'
import { DataFlowContext } from '@/contexts/dataFlowContext'
import { vNodeType } from '@/lib/layout'

export function GenericNode({
  id,
  data,
  type,
  selected,
}: NodeParamType): JSX.Element {
  const { layout } = useContext(DataFlowContext)
  const { preference } = useLocalStore()

  const [nodeData, setNodeData] = useState({ ...data })
  const role = data.role ?? 'Other'
  const info = roleInfo[role]
  const Icon = info.icon

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
    return data.showDescription && data.description ? (
      <div className="text-sm">{data.description}</div>
    ) : null
  }

  const DebugInfo = () => {
    const vnode: vNodeType | undefined = layout()?.vnodes.find(
      (vn) => vn.original.id === id
    )

    const NodeInfo = () => {
      if (vnode) {
        const posX: string = vnode.original.position.x.toFixed(2)
        const posY: string = vnode.original.position.y.toFixed(2)
        return (
          <>
            <h2>Node Information</h2>
            <ul className="ml-2 text-gray-500">
              <li>id: {id}</li>
              <li>position: ({`${posX}, ${posY}`})</li>
              <li>width: {vnode.width}</li>
              <li>height: {vnode.height}</li>
            </ul>
          </>
        )
      } else {
        return (
          <>
            <h2>Node Information</h2>
            <ul className="ml-2 text-gray-500">
              <li>id: {id}</li>
            </ul>
          </>
        )
      }
    }

    const LayoutInfo = () => {
      if (vnode) {
        const vposX: string = vnode.position.x.toFixed(2)
        const vposY: string = vnode.position.y.toFixed(2)
        const keys = Object.keys(vnode.evaluate)
        const vectorX: string = vnode.vector.x.toFixed(2)
        const vectorY: string = vnode.vector.y.toFixed(2)
        return (
          <>
            <h2 className="mt-2">Auto Layout</h2>
            <ul className="ml-2 text-gray-500">
              <li>position: ({`${vposX}, ${vposY}`})</li>
              <li>rank: {vnode.rank}</li>
              <li>
                evaluate:
                <ul className="ml-2">
                  {keys.map((key) => {
                    const vector = vnode.evaluate[key]
                    const x = vector.x.toFixed(2)
                    const y = vector.y.toFixed(2)
                    return <li key={key}>{`${key}: ${x}, ${y}`}</li>
                  })}
                </ul>
              </li>
              <li>vector: ({`${vectorX}, ${vectorY}`})</li>
            </ul>
          </>
        )
      } else {
        return null
      }
    }

    return preference.showDebugInfo ? (
      <HoverCardContent className="bg-white/90">
        <div className="text-xs text-left">
          <NodeInfo />
          <LayoutInfo />
        </div>
      </HoverCardContent>
    ) : null
  }

  return (
    <NodeConfigContext.Provider
      value={{
        nodeData,
        setNodeData,
      }}
    >
      <div
        className={cn(
          'flex flex-col w-60 bg-white border border-black rounded-lg drop-shadow-2xl',
          selected
            ? 'bg-gradient-to-br from-yellow-50 to-yellow-200 '
            : 'border dark:border-gray-700'
        )}
      >
        <div
          className={cn(
            'flex flex-row items-center justify-between',
            'rounded-t-lg p-2 text-white font-medium',
            [
              'bg-gradient-to-br',
              info.from, // gradient from
              info.to, // gradient to
            ]
          )}
        >
          <CountryFlag countryCode={data.country} />
          <div hidden>{type}</div>
          <HoverCard>
            <HoverCardTrigger>
              <div className="text-lg">{role}</div>
            </HoverCardTrigger>
            <DebugInfo />
          </HoverCard>
          <ConfigDialog data={data} />
        </div>
        <div className="w-full pb-2">
          <div className="flex flex-col items-center m-2">
            <NameComponent />
            <div className="flex flex-row items-center gap-2 m-2">
              <IconComponent />
              <DescriptionComponent />
            </div>
          </div>
          {data.hasContract ? (
            <FlowComponent name="Contract Flow" id={id} data={data} />
          ) : null}
          {data.hasPiiFlow ? (
            <FlowComponent name="PII Flow" id={id} data={data} />
          ) : null}
          {data.hasNonPiiFlow ? (
            <FlowComponent name="Non PII Flow" id={id} data={data} />
          ) : null}
        </div>
      </div>
    </NodeConfigContext.Provider>
  )
}
