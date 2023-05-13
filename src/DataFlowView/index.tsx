import {
  useState,
  useCallback,
  useRef,
} from 'react';
import ReactFlow, {
  useReactFlow,
  Node, NodeChange, applyNodeChanges,
  Edge, EdgeChange, applyEdgeChanges, addEdge,
  Connection,
  MiniMap, Controls,
  Background, BackgroundVariant,
} from 'reactflow';

import { nodeTypes } from './components/CustomNodes';
import { DataFlowContextProvider } from './dataFlowContext';

const initialNodes: Node[] = [
  { id: 'node-1', type: 'piiSubject'   , position: { x:  50, y: 250}, data: {}},
  { id: 'node-2', type: 'piiController', position: { x: 450, y:  50}, data: {}},
  { id: 'node-3', type: 'piiProcessor' , position: { x: 850, y:  50}, data: {}},
  { id: 'node-4', type: 'thirdParty'   , position: { x: 450, y: 450}, data: {}},
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

let nodeNumber = 0;
const newNodeId = () => `node_${nodeNumber++}`;

export default function DataFlowView() {

  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow());
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // creating ref
  const ref: React.MutableRefObject<any> = useRef(null);

  // utility function
  function deleteNode(deleteId : string) : void {
    console.log({at: 'deleteNode', deleteId: deleteId, reactFlowInstance: reactFlowInstance});
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

  // callbacks
  const onNodesChange = useCallback(
    (changes: NodeChange[]): void => {
      console.log({at: 'onNodesChange', changes});
      setNodes(function (nds) {
        return applyNodeChanges(changes, nds);
      });
    }, [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log({at: 'onEdgesChange', changes});
      setEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      console.log({at: 'onConnect', connection});
      setEdges((eds) => addEdge(connection, eds))
    }, [setEdges]
  );
  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []
  );
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = ref.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: newNodeId(),
        type,
        position,
        data: {},
      };
      console.log({at: 'onDrop', event, newNode});

      setNodes((nds) => nds.concat(newNode));
    }, [reactFlowInstance]
  );

  return (
    <DataFlowContextProvider value={{
      reactFlowInstance, 
      setReactFlowInstance,
      nodes,
      setNodes,
      edges,
      setEdges,
      deleteNode
      }}
    >
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </DataFlowContextProvider>
  );
}
