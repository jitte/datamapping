import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import Icon from './Icon';

import 'reactflow/dist/style.css';
import './App.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="container">
      <nav style={{ width: '20vw', height: '100vh'}}>
        Entities
        <div className="entity" id="pii_subject">
          <Icon name='pii_subject' />
          PII Subject
          <span className="menuitem">
            <Icon name="bars_3" />
          </span>
        </div>
        <div className="entity" id="pii_controller">
          <Icon name='pii_controller' />
          PII Controller
          <span className="menuitem">
            <Icon name="bars_3" />
          </span>
        </div>
        <div className="entity" id="pii_processor">
          <Icon name='pii_processor' />
          PII Processor
          <span className="menuitem">
            <Icon name="bars_3" />
          </span>
          </div>
        <div className="entity" id="third_party">
          <Icon name='third_party' />
          Third Party
          <span className="menuitem">
            <Icon name="bars_3" />
          </span>
        </div>
      </nav>
      <main style={{ width: '80vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
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
