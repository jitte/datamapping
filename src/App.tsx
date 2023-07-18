import { useState, useCallback, useRef, useEffect } from 'react'

import ReactFlow, { useReactFlow, ReactFlowProvider } from 'reactflow'
import { MiniMap, Controls, Background, BackgroundVariant } from 'reactflow'
import { Node, NodeChange, applyNodeChanges } from 'reactflow'
import { Edge, EdgeChange, applyEdgeChanges, addEdge, Connection } from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  GRID_SIZE,
  nodeTypes,
  edgeTypes,
  initialProject,
  roleInfo,
} from './constants'
import { GlobalContextProvider } from './contexts'
import { DataFlowContextProvider } from './contexts/dataFlowContext'
import { useLocalStore } from './lib/store'
import { MyMenubar } from './components/menu'
import { EdgeType } from './components/edges/utils'
import { cutNodes, copyNodes, pasteNodes } from './components/nodes/utils'
import { newNodeId, newNodeIdNumber } from './components/projects/utils'
import { ProjectType } from './components/projects/types'

function DataFlowView() {
  // load projects from localStore
  const {
    projects,
    storeProjects,
    currentProjectId,
    currentProject,
  } = useLocalStore()

  // reactflow states
  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow())
  const [nodes, setNodes] = useState(currentProject().nodes)
  const [edges, setEdges] = useState(currentProject().edges)

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
    const project = currentProject()
    setNodes(project.nodes)
    setEdges(project.edges)
    //console.log('at: useEffect(currentProjectId)', project)
  }, [currentProject, currentProjectId, setNodes, setEdges])

  // save projects after changing nodes and edges
  useEffect(() => {
    const project = projects.find((pj) => pj.id === currentProjectId) as ProjectType
    project.nodes = nodes
    project.edges = edges
    storeProjects(projects)
    console.log('at: useEffect(nodes/edges)', project)
  }, [nodes, edges, storeProjects])

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
      const newNode = {
        id: newNodeId(projects),
        type: 'genericNode',
        position,
        data: { ...roleInfo[role].defaults, role },
      }
      console.log('at: onDrop', { event, newNode })

      setNodes((nds: Node[]) => nds.concat(newNode))
    },
    [reactFlowInstance, projects, ref]
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
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
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
            <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1} />
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
