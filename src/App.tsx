import { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  useReactFlow,
  ReactFlowProvider,
  useViewport,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  NodeChange,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  applyEdgeChanges,
  addEdge,
  updateEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import { useHotkeys } from 'react-hotkeys-hook'

import { useLocalStore } from './lib/store'
import { GlobalContextProvider } from './contexts'
import { DataFlowContextProvider } from './contexts/dataFlowContext'
import { MyMenubar } from './components/menu'
import {
  cutNodes,
  copyNodes,
  pasteNodes,
  addNode,
} from './components/nodes/utils'
import { EdgeType } from './components/edges/utils'
import { newNodeIdNumber } from './components/projects/utils'
import { AutoLayout } from './lib/layout'
import { GRID_SIZE, nodeTypes, edgeTypes, initialProject } from './constants'

function DataFlowView() {
  // project states
  const { projects, storeProjects, currentProjectId, currentProject } =
    useLocalStore()

  // reactflow states
  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow())
  const [project, setProject] = useState(currentProject())
  const [nodes, setNodes] = useState(project.nodes)
  const [edges, setEdges] = useState(project.edges)

  // layout state
  const [layout, setLayout] = useState(new AutoLayout(reactFlowInstance))

  const { x: vpX, y: vpY, zoom: vpZ } = useViewport()

  useEffect(() => {
    //console.log(vpX, vpY, vpZ)
  }, [vpX, vpY, vpZ])

  // creating ref
  const ref: React.MutableRefObject<any> = useRef(null)

  useHotkeys('ctrl+x', () => {
    console.log('Ctrl+X pressed')
    cutNodes(nodes, reactFlowInstance)
  })

  useHotkeys('ctrl+c', () => {
    console.log('Ctrl+C pressed')
    copyNodes(nodes)
  })

  useHotkeys('ctrl+v', () => {
    console.log('Ctrl+V pressed')
    pasteNodes(nodes, setNodes, newNodeIdNumber(projects))
  })

  // update nodes and edges after changing current project
  useEffect(() => {
    const project = projects.find((pj) => pj.id === currentProjectId)
    if (project) {
      setProject(project)
      setNodes(project.nodes)
      setEdges(project.edges)
    }
    //console.log('at: useEffect(currentProjectId)', currentProjectId, project)
  }, [currentProjectId, setNodes, setEdges])

  // autolayout and save projects after changing nodes and edges
  useEffect(() => {
    const updateProject = () => {
      project.nodes = nodes
      project.edges = edges
      setProject(project)
      storeProjects(projects)
    }
    if (project.autoLayout) {
      layout.prepare(nodes, edges).simulate()

      if (layout.stable()) {
        updateProject()
      } else {
        layout.update()
        setNodes([...nodes])
      }
    } else {
      updateProject()
    }
    //console.log('at: useEffect(nodes/edges)', nodes, edges, project, layout)
  }, [nodes, edges, layout])

  // callbacks
  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, nodeParam: Node, nodesParam: Node[]) => {
      if (false)
        console.log('at: onNodeDragStart', event, nodeParam, nodesParam)
      layout.pin(nodesParam)
    },
    [layout]
  )
  const onNodeDrag = useCallback(
    //(event: React.MouseEvent, nodeParam: Node, nodesParam: Node[]) => {
    //console.log('at: onNodeDrag', event, nodeParam, nodesParam)
    () => {
      layout.trigger() // set highest temperature
    },
    [layout]
  )
  const onNodeDragStop = useCallback(
    //(event: React.MouseEvent, nodeParam: Node, nodesParam: Node[]) => {
    //console.log('at: onNodeDragStop', event, nodeParam, nodesParam)
    () => {
      layout.pin([])
    },
    [layout]
  )
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
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  )
  const onConnect = useCallback(
    (connection: Connection) => {
      const type = EdgeType(
        connection.source ?? '',
        connection.target ?? '',
        nodes
      )
      console.log('at: onConnect', { connection, type })
      setEdges((eds: Edge[]) => addEdge({ ...connection, type }, eds))
    },
    [nodes, setEdges]
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
      const id = newNodeIdNumber(projects)
      addNode(id, position, role, setNodes)
      console.log('at: onDrop', { event, id, role, position })
      layout.trigger()
    },
    [reactFlowInstance, ref, projects, layout]
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
        layout,
        setLayout,
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
            edgeTypes={edgeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            defaultEdgeOptions={{
              animated: true,
              style: { strokeWidth: 8 },
            }}
            fitView
            minZoom={0.2}
            snapGrid={[GRID_SIZE, GRID_SIZE]}
            snapToGrid
            multiSelectionKeyCode={['Meta', 'Control']}
          >
            <Controls />
            <MiniMap />
            <Background
              variant={BackgroundVariant.Dots}
              gap={GRID_SIZE}
              size={1}
            />
          </ReactFlow>
        </div>
      </div>
    </DataFlowContextProvider>
  )
}

export default function App() {
  const { projects, storeProjects, currentProjectId, storeCurrentProjectId } =
    useLocalStore()
  const [projectUpdated, setProjectUpdated] = useState(false)

  if (projects.length === 0) {
    storeProjects([initialProject(1)])
    storeCurrentProjectId(1)
  }
  if (!currentProjectId) {
    storeCurrentProjectId(projects[0].id)
  }

  return (
    <GlobalContextProvider
      value={{
        projectUpdated,
        setProjectUpdated,
      }}
    >
      <ReactFlowProvider>
        <DataFlowView />
      </ReactFlowProvider>
    </GlobalContextProvider>
  )
}
