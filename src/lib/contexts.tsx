import { createContext, ReactNode } from 'react'
import { Node, Edge, ReactFlowInstance } from '@xyflow/react'
import { AutoLayout } from '@/lib/layout'

type DataFlowContextType = {
  reactFlowInstance: ReactFlowInstance<Node, Edge> | null
  setReactFlowInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance<Node, Edge>>>
  nodes: Node[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  edges: Edge[]
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  layout: ()=> AutoLayout | null
  setLayout: (layout: AutoLayout) => void
  incrementNodeId: () => number
}

// eslint-disable-next-line react-refresh/only-export-components
export const DataFlowContext = createContext<DataFlowContextType>({
  reactFlowInstance: null,
  setReactFlowInstance: () => { /* noop */ },
  nodes: [],
  setNodes: () => { /* noop */ },
  edges: [],
  setEdges: () => { /* noop */ },
  layout: () => null,
  setLayout: () => { /* noop */ },
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
