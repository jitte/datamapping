import { createContext } from 'react'

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

export type DataContextType = {
  nodeData: NodeDataType
  setNodeData: (data: NodeDataType) => void
}

export const NodeConfigContext = createContext<DataContextType>({
  nodeData: {},
  setNodeData: () => {},
})
