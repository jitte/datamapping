import { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap, Controls, Background,
  addEdge, applyEdgeChanges, applyNodeChanges, BackgroundVariant,
} from 'reactflow';
import Icon from './Icon';

import 'reactflow/dist/style.css';
import './App.css'

import {
  PiiSubjectNode,
  PiiControllerNode,
  PiiProcessorNode,
  ThirdPartyNode,
 } from './Nodes';

const nodeTypes = {
  piiSubject:    PiiSubjectNode,
  piiController: PiiControllerNode,
  piiProcessor:  PiiProcessorNode,
  thirdParty:     ThirdPartyNode,
};

const initialNodes = [
  { id: 'node-1', type: 'piiSubject'   , position: { x:   0, y:   0}, data: { value: 123 }},
  { id: 'node-2', type: 'piiController', position: { x: 100, y: 100}, data: { value: 123 }},
  { id: 'node-3', type: 'piiProcessor' , position: { x: 200, y: 200}, data: { value: 123 }},
  { id: 'node-4', type: 'thirdParty'   , position: { x: 300, y: 300}, data: { value: 123 }},
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes(
      (nds) => applyNodeChanges(changes, nds)
    ),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges(
      (eds) => applyEdgeChanges(changes, eds)
    ),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: any) => setEdges(
      (eds) => addEdge(connection, eds)
    ),
    [setEdges]
  );

  function EntityItem({text}: any): JSX.Element {
    const name = text.toLowerCase().replace(/ /g, '_');
    return (
      <div className="flex border border-solid border-black rounded-lg border-l-4 p-1 m-1 items-center gap-2" id={name}>
        <Icon name={name} />
        <div className="text-sm">{text}</div>
        <div className="flex-grow" />
        <Icon name="drag_handle" />
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen w-screen">
      <nav className="w-52 h-full flex flex-col border-r" >
        <span className="text-center">Entities</span>
        <EntityItem text="PII Subject" />
        <EntityItem text="PII Controller" />
        <EntityItem text="PII Processor" />
        <EntityItem text="Third Party" />
      </nav>
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
  );
}
