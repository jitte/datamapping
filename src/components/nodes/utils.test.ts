import { describe, it, expect, vi } from 'vitest'
import { Edge, Node } from 'reactflow'
import { findNode, findEdge, edgeType, addNode } from './utils'

const makeNode = (id: string, country = ''): Node => ({
  id,
  type: 'genericNode',
  position: { x: 0, y: 0 },
  data: { country },
})

const makeEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
})

// --- findNode ---

describe('findNode', () => {
  it('returns the node with matching id', () => {
    const nodes = [makeNode('a', 'JP'), makeNode('b', 'US')]
    expect(findNode(nodes, 'a').id).toBe('a')
  })

  it('returns undefined (typed as Node) when id is not found', () => {
    expect(findNode([], 'x')).toBeUndefined()
  })
})

// --- findEdge ---

describe('findEdge', () => {
  const edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'c')]

  it('returns the edge with matching id', () => {
    expect(findEdge(edges, 'e1').id).toBe('e1')
    expect(findEdge(edges, 'e2').source).toBe('b')
  })

  it('returns undefined (typed as Edge) when id is not found', () => {
    expect(findEdge(edges, 'x')).toBeUndefined()
  })
})

// --- edgeType ---

describe('edgeType', () => {
  it('returns domestic when both nodes have the same country', () => {
    const nodes = [makeNode('a', 'JP'), makeNode('b', 'JP')]
    expect(edgeType('a', 'b', nodes)).toBe('domestic')
  })

  it('returns crossborder when nodes have different non-empty countries', () => {
    const nodes = [makeNode('a', 'JP'), makeNode('b', 'US')]
    expect(edgeType('a', 'b', nodes)).toBe('crossborder')
  })

  it('returns domestic when source country is empty string', () => {
    const nodes = [makeNode('a', ''), makeNode('b', 'US')]
    expect(edgeType('a', 'b', nodes)).toBe('domestic')
  })

  it('returns domestic when target country is empty string', () => {
    const nodes = [makeNode('a', 'JP'), makeNode('b', '')]
    expect(edgeType('a', 'b', nodes)).toBe('domestic')
  })

  it('returns domestic when data.country is undefined', () => {
    const nodes: Node[] = [
      { id: 'a', type: 'genericNode', position: { x: 0, y: 0 }, data: {} },
      { id: 'b', type: 'genericNode', position: { x: 0, y: 0 }, data: {} },
    ]
    expect(edgeType('a', 'b', nodes)).toBe('domestic')
  })

  it('returns domestic when source node is not found', () => {
    const nodes = [makeNode('b', 'US')]
    expect(edgeType('a', 'b', nodes)).toBe('domestic')
  })

  it('returns domestic when target node is not found', () => {
    const nodes = [makeNode('a', 'JP')]
    expect(edgeType('a', 'b', nodes)).toBe('domestic')
  })

  it('returns domestic when node list is empty', () => {
    expect(edgeType('a', 'b', [])).toBe('domestic')
  })
})

// --- addNode ---

describe('addNode', () => {
  it('appends a genericNode with the correct id and position', () => {
    const added: Node[] = []
    const setNodes = vi.fn((fn: (nodes: Node[]) => Node[]) => {
      added.push(...fn([]))
    })
    addNode(42, { x: 10, y: 20 }, 'PII Controller', setNodes as never)
    expect(added).toHaveLength(1)
    expect(added[0].id).toBe('node_42')
    expect(added[0].type).toBe('genericNode')
    expect(added[0].position).toEqual({ x: 10, y: 20 })
    expect(added[0].selected).toBe(true)
  })

  it('sets role in node.data', () => {
    const added: Node[] = []
    const setNodes = vi.fn((fn: (nodes: Node[]) => Node[]) => {
      added.push(...fn([]))
    })
    addNode(1, { x: 0, y: 0 }, 'PII Controller', setNodes as never)
    expect(added[0].data.role).toBe('PII Controller')
  })

  it('concatenates to existing nodes', () => {
    const existing = [makeNode('old')]
    let result: Node[] = []
    const setNodes = vi.fn((fn: (nodes: Node[]) => Node[]) => {
      result = fn(existing)
    })
    addNode(5, { x: 0, y: 0 }, 'PII Processor', setNodes as never)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('old')
    expect(result[1].id).toBe('node_5')
  })
})
