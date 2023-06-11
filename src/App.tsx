import { useState, useContext, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  useReactFlow,
  NodeChange, applyNodeChanges,
  EdgeChange, applyEdgeChanges, addEdge,
  Connection,
  MiniMap, Controls,
  Background, BackgroundVariant,
  ReactFlowProvider,
} from 'reactflow'

import 'reactflow/dist/style.css'
import './App.css'

import { nodeTypes } from './constants'
import { GlobalContext, GlobalContextProvider } from './contexts'
import { DataFlowContextProvider } from './contexts/dataFlowContext'
import { TopLeftPanel, TopRightPanel } from './components/Panels'
import ProjectsModal from './modals/projectsModal'
import { useLocalStore } from './store'
import { initialProject } from './constants'

function DataFlowView() {
	// load projects from localStore
	const projects  = useLocalStore((state) => state.projects)
	const setProjects = useLocalStore((state) => state.setProjects)
  const newNodeId = useLocalStore((state) => state.newNodeId)

  // current project from global context
  const { currentProject, setEntityMenuOpen } = useContext(GlobalContext)

  // reactflow states
  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow());
  const [nodes, setNodes] = useState(currentProject.nodes);
  const [edges, setEdges] = useState(currentProject.edges);

  // creating ref
  const ref: React.MutableRefObject<any> = useRef(null);

  console.log('at: DataFlowView', { projects, currentProject, nodes, edges })

  // update nodes and edges after changing current project
  useEffect(() => {
    setNodes(currentProject.nodes)
    setEdges(currentProject.edges)
    console.log('at: useEffect', { currentProject })
  }, [currentProject, setNodes, setEdges])

  // save projects after changing nodes and edges
  useEffect(() => {
    currentProject.nodes = nodes
    currentProject.edges = edges
    setProjects(projects)
    console.log('at: useEffect', { nodes, edges })
  }, [nodes, edges, setProjects])

  // utility function
  function deleteNode(deleteId : string) : void {
    console.log('at: deleteNode', { deleteId, reactFlowInstance })
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
    )
  }
  // callbacks
  const onNodesChange = useCallback(
    (changes: NodeChange[]): void => {
      console.log('at: onNodesChange', { changes })
      setNodes(function (nds) {
        return applyNodeChanges(changes, nds)
      })
    }, [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log('at: onEdgesChange', { changes })
      setEdges((eds) => applyEdgeChanges(changes, eds))
    }, [setEdges]
  )
  const onConnect = useCallback(
    (connection: Connection) => {
      console.log({at: 'onConnect', connection});
      setEdges((eds) => addEdge(connection, eds))
    }, [setEdges]
  );
  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }, []
  )
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
      })
      const newNode = {
        id: newNodeId(),
        type,
        position,
        data: {},
      }
      console.log('at: onDrop', { event, newNode })

      setNodes((nds) => nds.concat(newNode))
      setEntityMenuOpen(false)
    }, [reactFlowInstance]
  )

  return (
    <DataFlowContextProvider value={{
      reactFlowInstance, setReactFlowInstance,
      nodes, setNodes,
      edges, setEdges,
      deleteNode
      }}
    >
      <div className="w-screen h-screen" ref={ref}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          defaultEdgeOptions={{
            animated: true,
            style: { strokeWidth: 8 }
          }}
          fitView
        >
          <TopLeftPanel />
          <TopRightPanel />
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <ProjectsModal />
        </ReactFlow>
      </div>
    </DataFlowContextProvider>
  )
}

export default function App() {
	const projects  = useLocalStore((state) => state.projects)
	const setProjects = useLocalStore((state) => state.setProjects)

  if (projects.length === 0) {
    setProjects([initialProject(1)])
  }
  const [currentProject, setCurrentProject] = useState(projects[0])
  const [showProjects, setShowProjects] = useState(false)
  const [entityMenuOpen, setEntityMenuOpen] = useState(false)

  return (
    <GlobalContextProvider value={{
      currentProject, setCurrentProject,
      showProjects, setShowProjects,
      entityMenuOpen, setEntityMenuOpen,
    }} >
      <div className="flex flex-row h-screen w-screen">
        <ReactFlowProvider>
          <DataFlowView />
        </ReactFlowProvider>
      </div>
    </GlobalContextProvider>
  );
}