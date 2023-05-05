import {
  useState,
  useCallback,
} from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge, BackgroundVariant,
  MiniMap, Controls, Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import SideBarComponent from './components/SideBarComponent';
import {
  PiiSubjectNode,
  PiiControllerNode,
  PiiProcessorNode,
  ThirdPartyNode,
} from './CustomNodes';
import { GlobalContext } from './Contexts';
import './App.css'
const nodeTypes = {
  piiSubject:    PiiSubjectNode,
  piiController: PiiControllerNode,
  piiProcessor:  PiiProcessorNode,
  thirdParty:    ThirdPartyNode,
};

const initialNodes = [
  { id: 'node-1', type: 'piiSubject'   , position: { x:  50, y:  50}, data: { value: 123 }},
  { id: 'node-2', type: 'piiController', position: { x: 150, y: 150}, data: { value: 123 }},
  { id: 'node-3', type: 'piiProcessor' , position: { x: 250, y: 250}, data: { value: 123 }},
  { id: 'node-4', type: 'thirdParty'   , position: { x: 350, y: 350}, data: { value: 123 }},
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (connection: any) => setEdges(
      (eds) => addEdge(connection, eds)
    ),
    [setEdges]
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