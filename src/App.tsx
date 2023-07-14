import { useState, useContext, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  useReactFlow,
  Node,
  NodeChange, applyNodeChanges,
  Edge,
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
import { useLocalStore } from './lib/store'
import { initialProject } from './constants'
import { MyMenubar } from './components/menu'
import { roleInfo } from './constants'

function DataFlowView() {
  // load projects from localStore
  const projects = useLocalStore((state) => state.projects)
  const storeProjects = useLocalStore((state) => state.storeProjects)
  const newNodeId = useLocalStore((state) => state.newNodeId)

  // current project from global context
  const {
    currentProject,
    projectUpdated,
    setProjectUpdated,
  } = useContext(GlobalContext)

  // reactflow states
  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow())
  const [nodes, setNodes] = useState(currentProject.nodes)
  const [edges, setEdges] = useState(currentProject.edges)

  // creating ref
  const ref: React.MutableRefObject<any> = useRef(null)

  //console.log('at: DataFlowView', { projects, currentProject, nodes, edges })

  // update nodes and edges after changing current project
  useEffect(() => {
    setNodes(currentProject.nodes)
    setEdges(currentProject.edges)
    console.log('at: useEffect(currentProject)', { currentProject, projects })
  }, [currentProject, setNodes, setEdges])

  // save projects after changing nodes and edges
  useEffect(() => {
    currentProject.nodes = nodes
    currentProject.edges = edges
    setProjectUpdated(true)
    console.log('at: useEffect(nodes/edges)', { currentProject, projects })
  }, [nodes, edges, storeProjects])

  // save project if project is updated
  useEffect(() => {
    if (projectUpdated) {
      console.log('at: useEffect(projectUpated)', { currentProject, projects })
      storeProjects(projects)
      setProjectUpdated(false)
    }
  }, [projectUpdated, setProjectUpdated])

  // utility function
  function deleteNode(deleteId: string): void {
    console.log('at: deleteNode', { deleteId, reactFlowInstance })
    // 指定されたidのノードを削除
    reactFlowInstance.setNodes(
      reactFlowInstance.getNodes().filter((nds: any) => nds.id !== deleteId)
    )
    // 指定されたidにつながっているエッジを削除
    reactFlowInstance.setEdges(
      reactFlowInstance
        .getEdges()
        .filter(
          (nds: any) => nds.source !== deleteId && nds.target !== deleteId
        )
    )
  }
  // callbacks
  const onNodesChange = useCallback(
    (changes: NodeChange[]): void => {
      //console.log('at: onNodesChange', { changes })
      setNodes(function (nds: Node[]) {
        return applyNodeChanges(changes, nds)
      })
    },
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      //console.log('at: onEdgesChange', { changes })
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )
  const onConnect = useCallback(
    (connection: Connection) => {
      console.log({ at: 'onConnect', connection })
      setEdges((eds: Edge[]) => addEdge(connection, eds))
    },
    [setEdges]
  )
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = ref.current.getBoundingClientRect()
      const role = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof role === 'undefined' || !role) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      const newNode = {
        id: newNodeId(),
        type: 'genericNode',
        position,
        data: { ...roleInfo[role].defaults, role },
      }
      console.log('at: onDrop', { event, newNode })

      setNodes((nds: Node[]) => nds.concat(newNode))
    },
    [reactFlowInstance]
  )

  return (
    <DataFlowContextProvider
      value={{
        reactFlowInstance,
        setReactFlowInstance,
        nodes,
        setNodes,
        edges,
        setEdges,
        deleteNode,
      }}
    >
      <div className="flex flex-col">
        <div className="z-10">
          <MyMenubar />
        </div>
        <div className="fixed w-screen h-screen" ref={ref}>
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
              style: { strokeWidth: 8 },
            }}
            fitView
            minZoom={0.2}
            snapGrid={[12, 12]}
            snapToGrid
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </DataFlowContextProvider>
  )
}

export default function App() {
	const projects  = useLocalStore((state) => state.projects)
	const storeProjects = useLocalStore((state) => state.storeProjects)

  if (projects.length === 0) {
    storeProjects([initialProject(1)])
  }
  const [currentProject, setCurrentProject] = useState(projects[0])
  const [projectUpdated, setProjectUpdated] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <GlobalContextProvider value={{
      currentProject, setCurrentProject,
      projectUpdated, setProjectUpdated,
      showProjectModal, setShowProjectModal,
      showExportModal, setShowExportModal,
    }} >
      <ReactFlowProvider>
        <DataFlowView />
      </ReactFlowProvider>
    </GlobalContextProvider>
  )
}