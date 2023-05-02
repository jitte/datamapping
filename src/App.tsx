import { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap, Controls, Background,
  addEdge, applyEdgeChanges, applyNodeChanges,
} from 'reactflow';
import Icon from './Icon';

import 'reactflow/dist/style.css';
import './App.css'

import PiiSubjectNode from './PiiSubjectNode';
// TODO: useMemoの使い方を習得する
//const nodeTypes = useMemo(() => { piiSubject: PiiSubjectNode }, []);
const nodeTypes = { piiSubject: PiiSubjectNode };

const initialNodes = [
  { id: 'node-1', type: 'piiSubject', position: { x: 0, y: 0}, data: { value: 123 }},
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
    <div className="flex border border-solid border-black rounded border-l-4 p-1 m-1 items-center" id={name}>
      <Icon name={name} />
      <div className="text-sm">{text}</div>
      <div className="flex-grow" />
      <Icon name="drag_handle" />
    </div>
    );
  }

  return (
    <div className="flex">
      <nav style={{ width: '20vw', height: '100vh'}}>
        <div className="text-center">Entities</div>
        <EntityItem text="PII Subject" />
        <EntityItem text="PII Controller" />
        <EntityItem text="PII Processor" />
        <EntityItem text="Third Party" />
      </nav>
      <main style={{ width: '80vw', height: '100vh' }}>
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
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </main>
    </div>
  );
}
