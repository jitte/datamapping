import { createContext } from 'react'

export type NodeParamType = {
  id: string
  data: NodeDataType
  type: string
  selected: boolean
}

export type NodeDataType = {
  entity_name?: string // backward compatibility
  country_name?: string // backward compatibility
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

/* node JSON sample
{
  "id": "pj_1_node_2",
  "type": "genericNode",
  "position": {
    "x": 456,
    "y": 60
  },
  "data": {
    "showName": true,
    "showIcon": true,
    "showDescription": false,
    "hasContract": true,
    "hasPiiFlow": true,
    "hasNonPiiFlow": true,
    "role": "PII Controller",
    "country": "JP"
  },
  "width": 240,
  "height": 286,
  "selected": true,
  "dragging": false,
  "positionAbsolute": {
    "x": 456,
    "y": 60
  }
}
*/
export type DataContextType = {
  nodeData: NodeDataType
  setNodeData: (data: NodeDataType) => void
}

export const NodeConfigContext = createContext<DataContextType>({
  nodeData: {},
  setNodeData: () => {},
})
