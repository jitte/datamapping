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
import { DataFlowContextProvider } from './lib/contexts'
import { MyMenubar } from './components/menu'
import {
  cutNodes,
  copyNodes,
  pasteNodes,
  addNode,
  selectNodes,
} from './components/nodes/utils'
import { edgeType } from './components/nodes/utils'
import { maxNodeId } from './components/projects/utils'
import { AutoLayout } from './lib/layout'
import { GRID_SIZE, nodeTypes, edgeTypes, initialProject } from './lib/constants'

function DataFlowView() {
  // local store
  const {
    projects,
    storeProjects,
    currentProjectId,
    storeCurrentProjectId,
    currentProject,
  } = useLocalStore()

  if (projects.length === 0) {
    storeProjects([initialProject(1)])
    storeCurrentProjectId(1)
  }
  if (!currentProjectId) {
    storeCurrentProjectId(projects[0].id)
  }

  // creating state and accessor
  const [reactFlowInstance, setReactFlowInstance] = useState(useReactFlow())
  const project = currentProject()
  const [nodes, setNodes] = useState(project.nodes)
  const [edges, setEdges] = useState(project.edges)
  const [offset, setOffset] = useState({ x: 12, y: 12 })

  // receive viewport update
  const { x: vpX, y: vpY, zoom: vpZ } = useViewport()
  useEffect(() => {}, [vpX, vpY, vpZ]) // somehow need this to get update

  // creating ref and accessor
  const domRef: React.MutableRefObject<any> = useRef(null)
  const nodeIdRef: React.MutableRefObject<number> = useRef(maxNodeId(projects))
  const incrementNodeId = (): number => {
    nodeIdRef.current++
    return nodeIdRef.current
  }
  const layoutRef: React.MutableRefObject<AutoLayout> = useRef(
    new AutoLayout(reactFlowInstance)
  )
  const layout = (): AutoLayout => {
    return layoutRef.current
  }
  const setLayout = (layout: AutoLayout) => {
    layoutRef.current = layout
  }
  const timerRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null)
  const setTimerRef = (callback: () => void, ms: number): void => {
    if (timerRef.current) clearTimerRef()
    timerRef.current = setTimeout(callback, ms)
  }
  const clearTimerRef = () => {
    clearTimeout(timerRef.current as NodeJS.Timeout)
    timerRef.current = null
  }

  // hotkeys
  useHotkeys(
    'ctrl+x',
    () => {
      console.log('Ctrl+X pressed')
      cutNodes(nodes, edges, reactFlowInstance)
    },
    [nodes, reactFlowInstance]
  )
  useHotkeys(
    'ctrl+c',
    () => {
      console.log('Ctrl+C pressed')
      copyNodes(nodes, edges)
      setOffset({ x: 12, y: 12 })
    },
    [nodes, setOffset]
  )
  useHotkeys(
    'ctrl+v',
    () => {
      console.log('Ctrl+V pressed')
      //if (layout().stable()) {
      pasteNodes(setNodes, setEdges, incrementNodeId, offset)
      setOffset((offset) => ({ x: offset.x + 12, y: offset.y + 12 }))
      //}
    },
    [nodes, setNodes, offset, setOffset]
  )

  // update nodes and edges after changing current project
  useEffect(() => {
    const project = projects.find((pj) => pj.id === currentProjectId)
    if (project) {
      setNodes([...project.nodes])
      setEdges([...project.edges])
    }
    //console.log('at: useEffect(currentProjectId)', currentProjectId)
  }, [projects, currentProjectId, setNodes, setEdges])

  // autolayout and save projects after changing nodes and edges
  useEffect(() => {
    const project = projects.find((pj) => pj.id === currentProjectId)
    if (!project) return
    const updateProject = () => {
      setTimerRef(() => {
        project.nodes = nodes
        project.edges = edges
        storeProjects(projects)
        console.log('projects saved', new Date())
      }, 1000)
    }
    if (project.autoLayout) {
      layout().prepare(nodes, edges).simulate()
      if (!layout().stable()) {
        layout().update()
        setTimerRef(() => {
          setNodes([...nodes])
        }, 1000 / 30)
      } else {
        updateProject()
      }
    } else {
      updateProject()
    }
    //console.log('at: useEffect(nodes/edges)', nodes, edges, project, layout)
  }, [projects, nodes, edges, setNodes])

  // callbacks
  const onNodeDragStart = useCallback(
    (event: React.MouseEvent, nodeParam: Node, nodesParam: Node[]) => {
      if (false)
        console.log('at: onNodeDragStart', event, nodeParam, nodesParam)
      layout().pin(nodesParam)
    },
    []
  )
  const onNodeDrag = useCallback(
    //(event: React.MouseEvent, nodeParam: Node, nodesParam: Node[]) => {
    //console.log('at: onNodeDrag', event, nodeParam, nodesParam)
    () => {
      layout().trigger() // set highest temperature
    },
    []
  )
  const onNodeDragStop = useCallback(
    //(event: React.MouseEvent, nodeParam: Node, nodesParam: Node[]) => {
    //console.log('at: onNodeDragStop', event, nodeParam, nodesParam)
    () => {
      layout().pin([])
    },
    []
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
      const type = edgeType(
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

      const reactFlowBounds = domRef.current.getBoundingClientRect()
      const role = event.dataTransfer.getData('application/reactflow')

      // check if the dropped element is valid
      if (typeof role === 'undefined' || !role) {
        return
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      const id = incrementNodeId()
      selectNodes(setNodes, false)
      addNode(id, position, role, setNodes)
      console.log('at: onDrop', { event, id, role, position })
      layout().trigger()
    },
    [reactFlowInstance, domRef, projects]
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
        incrementNodeId,
      }}
    >
      <div className="flex flex-col">
        <div className="z-10">
          <MyMenubar />
        </div>
        <div className="fixed w-screen h-screen" ref={domRef}>
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
  return (
    <ReactFlowProvider>
      <DataFlowView />
    </ReactFlowProvider>
  )
}
