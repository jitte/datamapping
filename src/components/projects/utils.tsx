import { Node, Edge } from 'reactflow'
import { ProjectType } from './types'

function allNodes(projects: ProjectType[]) {
  let nodes: Node[] = []

  for (const project of projects) {
    for (const node of project.nodes) {
      if (!nodes.find((addedNode) => addedNode.id === node.id)) {
        nodes.push(node)
      }
    }
  }
  return nodes
}

function allEdges(projects: ProjectType[]) {
  let edges: Edge[] = []

  for (const project of projects) {
    for (const edge of project.edges) {
      if (!edges.find((addedEdge) => addedEdge.id === edge.id)) {
        edges.push(edge)
      }
    }
  }
  return edges
}

const newProjectId = (projects: ProjectType[]): number => {
  return 1 + Math.max(0, ...projects.map((project) => project.id))
}

const newNodeId = (projects: ProjectType[]): string => {
  return 'node_' + newNodeIdNumber(projects)
}

const newNodeIdNumber = (projects: ProjectType[]): number => {
  return 1 + maxNodeId(projects)
}

const maxNodeId = (projects: ProjectType[]): number => {
  const nodeIds = projects
    .map((project: ProjectType) => (project.nodes ?? []).map((node) => node.id))
    .reduce((acc, ele) => acc.concat(ele))
  // [1, 2, ...]
  const ids = nodeIds.map((nodeId: string) => {
    const id = Number(nodeId?.replace('node_', ''))
    return Number.isNaN(id) ? 0 : id
  })
  return Math.max(0, ...ids)
}

const duplicateProject = (
  id: number,
  oldProject: ProjectType,
  incrementNodeId: () => number
): ProjectType => {
  const nodes: Node[] = oldProject.nodes.map((node) => ({...node}))
  const edges: Edge[] = oldProject.edges.map((edge) => ({...edge}))
  let nodeMap: { [key: string]: string } = {}

  nodes.forEach((node) => {
    const newId = `node_${incrementNodeId()}`
    nodeMap[node.id] = newId
    node.id = newId
  })
  edges.forEach((edge) => {
    edge.source = nodeMap[edge.source]
    edge.target = nodeMap[edge.target]
  })
  const newProject = {
    ...oldProject,
    id,
    name: `${oldProject.name} (${id})`,
    nodes,
    edges,
  }
  return newProject
}

export {
  allNodes,
  allEdges,
  newProjectId,
  newNodeId,
  newNodeIdNumber,
  maxNodeId,
  duplicateProject,
}
