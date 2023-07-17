import { useState, useRef, useEffect } from 'react'
import { Handle, Position, useUpdateNodeInternals } from 'reactflow'

import { NodeDataType } from './types'

export function FlowComponent({
  name,
  id,
  data,
}: {
  name: string,
  id: string,
  data: NodeDataType,
}): JSX.Element {
  const sourceId = 'source_' + name.toLowerCase().replace(/ /g, '_')
  const targetId = 'target_' + name.toLowerCase().replace(/ /g, '_')

  // set Handle position according to this component
  const ref: React.MutableRefObject<any> = useRef(null)
  const updateNodeInternals = useUpdateNodeInternals()
  const [position, setPosition] = useState(0)

  // step1: calculate offset from ref
  useEffect(() => {
    //console.log('at: FlowComponent/useEffect1')
    if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
      setPosition(ref.current.offsetTop + ref.current.clientHeight / 2)
      updateNodeInternals(id)
    }
  }, [data, ref, updateNodeInternals])

  // step2: then propagate position
  useEffect(() => {
    //console.log('at: FlowComponent/useEffect2')
    updateNodeInternals(id)
  }, [position, updateNodeInternals])

  return (
    <div ref={ref} className="flex py-1 m-1 bg-gray-100/80">
      <div className="w-full text-center">{name}</div>
      <Handle
        id={targetId}
        className="w-5 h-5 -ml-1.5 rounded-full border-2 border-gray-500 bg-white"
        type="target"
        position={Position.Left}
        style={{ top: position }}
      />
      <Handle
        id={sourceId}
        className="w-5 h-5 -mr-1.5 rounded-full border-2 border-gray-500 bg-white"
        type="source"
        position={Position.Right}
        style={{ top: position }}
      />
    </div>
  )
}
