import {
  useState,
  useCallback,
} from 'react';
import ReactFlow, {
  useReactFlow,
  Node, NodeChange, applyNodeChanges,
  Edge, EdgeChange, applyEdgeChanges, addEdge,
  Connection,
  MiniMap, Controls,
  Background, BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css'

import SideBarComponent from './components/SideBarComponent';
import { nodeTypes } from './CustomNodes';
import { GlobalContext } from './Contexts';

const initialNodes: Node[] = [
  { id: 'node-1', type: 'piiSubject'   , position: { x:  50, y: 250}, data: { value: 123 }},
  { id: 'node-2', type: 'piiController', position: { x: 450, y:  50}, data: { value: 123 }},
  { id: 'node-3', type: 'piiProcessor' , position: { x: 850, y:  50}, data: { value: 123 }},
  { id: 'node-4', type: 'thirdParty'   , position: { x: 450, y: 450}, data: { value: 123 }},
];
const initialEdges: Edge[] = [
  { id: 'edge-1-2',
    source: 'node-1', sourceHandle: 'source_pii_flow',
    target: 'node-2', targetHandle: 'target_pii_flow'},
  { id: 'edge-2-3',
    source: 'node-2', sourceHandle: 'source_pii_flow',
    target: 'node-3', targetHandle: 'target_pii_flow'},
  { id: 'edge-1-4',
    source: 'node-1', sourceHandle: 'source_non_pii_flow',
    target: 'node-4', targetHandle: 'target_non_pii_flow'},
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]): void => {
      console.log({at: 'onNodesChange', changes: changes});
      setNodes(function (nds) {
        return applyNodeChanges(changes, nds);
      });
    }, [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log({at: 'onEdgesChange', changes: changes});
      setEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      console.log({at: 'onConnect', connection: connection});
      setEdges((eds) => addEdge(connection, eds))
    }, [setEdges]
  );
  // App()の外側をReactFlowProviderで囲むことで、useReactFlow()が使える
  // reactFlowInstanceをdeleteNode()で使う
  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow());

  function deleteNode(deleteId : string) : void {
    console.log(`deleteNode(${deleteId})`);
    console.log(reactFlowInstance);
    // 指定されたidのノードを削除
    reactFlowInstance.setNodes(
      reactFlowInstance.getNodes().filter(
        (nds : any) => nds.id !== deleteId
      )
    );
    // 指定されたidにつながっているエッジを削除
    reactFlowInstance.setEdges(
      reactFlowInstance.getEdges().filter(
        (nds : any) => nds.source !== deleteId && nds.target !== deleteId
      )
    );
  };
  
  return (
    <GlobalContext.Provider value={{
      reactFlowInstance, 
      setReactFlowInstance,
      deleteNode
    }} >
      <div className="flex flex-row h-screen w-screen">
        <SideBarComponent />
        <main className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </main>
      </div>
    </GlobalContext.Provider>
  );
}