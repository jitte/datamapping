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

/*   
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/