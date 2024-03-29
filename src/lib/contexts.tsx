import { createContext, ReactNode } from 'react'
import { Node, Edge, ReactFlowInstance } from 'reactflow'
import { AutoLayout } from '@/lib/layout'

type DataFlowContextType = {
  reactFlowInstance: ReactFlowInstance | null
  setReactFlowInstance: any
  nodes: Node[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  edges: Edge[]
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  layout: ()=> AutoLayout | null
  setLayout: (layout: AutoLayout) => void
  incrementNodeId: () => number
}

export const DataFlowContext = createContext<DataFlowContextType>({
  reactFlowInstance: null,
  setReactFlowInstance: () => {},
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  layout: () => null,
  setLayout: () => {},
  incrementNodeId: () => 0,
})

export function DataFlowContextProvider({
  value,
  children,
}: {
  value: DataFlowContextType
  children: ReactNode
}): JSX.Element {
  return (
    <DataFlowContext.Provider value={value}>
      {children}
    </DataFlowContext.Provider>
  )
}
