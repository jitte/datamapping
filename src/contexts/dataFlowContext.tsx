import { createContext, ReactNode } from "react";
import { Node, Edge, ReactFlowInstance } from "reactflow";

type DataFlowContextType = {
	reactFlowInstance: ReactFlowInstance|null;
	setReactFlowInstance: any;
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  edges: Edge[],
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  deleteNode: (id: string) => void;
};

export const DataFlowContext = createContext<DataFlowContextType>({
	reactFlowInstance: null,
	setReactFlowInstance: () => {},
  nodes: [],
  setNodes: () => {},
  edges: [],
  setEdges: () => {},
  deleteNode: () => {}
});

export function DataFlowContextProvider(
	{ value, children }: { value: DataFlowContextType, children: ReactNode }
): JSX.Element {
	return (
    <DataFlowContext.Provider value={value}>
      {children}
		</DataFlowContext.Provider>
	);
}