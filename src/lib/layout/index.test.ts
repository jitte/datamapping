import { describe, it, expect, beforeEach } from 'vitest'
import { Node, Edge, ReactFlowInstance } from 'reactflow'
import { AutoLayout, alParamTemperature } from './index'
import { Vector } from './vector'

const mockRFI = {
  project: ({ x, y }: { x: number; y: number }) => ({ x, y }),
} as unknown as ReactFlowInstance

// v11: width/height are set directly on the node by the library after measurement.
// v12 migration: the library writes measured dimensions to node.measured.width / node.measured.height.
//   AutoLayout.getWidthHeight() must change to: node.measured?.width ?? node.width ?? 0
const makeNode = (
  id: string,
  x: number,
  y: number,
  width = 100,
  height = 80
): Node => ({
  id,
  type: 'genericNode',
  position: { x, y },
  data: {},
  width,
  height,
})

const makeEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
})

describe('AutoLayout', () => {
  let layout: AutoLayout

  beforeEach(() => {
    AutoLayout.temperature = 0
    AutoLayout.pinnedNodes = {}
    AutoLayout.weightMap = { center: 1, collision: 1, crossing: 1, rotation: 1 }
    layout = new AutoLayout(mockRFI)
  })

  describe('prepare()', () => {
    it('creates one vnode per node', () => {
      layout.prepare([makeNode('a', 0, 0), makeNode('b', 100, 0)], [])
      expect(layout.vnodes).toHaveLength(2)
    })

    it('populates vnodeMap keyed by node id', () => {
      layout.prepare([makeNode('a', 0, 0), makeNode('b', 100, 0)], [])
      expect(layout.vnodeMap['a']).toBeDefined()
      expect(layout.vnodeMap['b']).toBeDefined()
    })

    it('creates one vedge per edge', () => {
      const nodes = [makeNode('a', 0, 0), makeNode('b', 200, 0)]
      layout.prepare(nodes, [makeEdge('e1', 'a', 'b')])
      expect(layout.vedges).toHaveLength(1)
    })

    it('sets vnode center position as node.position + width/2, height/2', () => {
      layout.prepare([makeNode('a', 0, 0, 100, 80)], [])
      expect(layout.vnodeMap['a'].position.x).toBe(50)
      expect(layout.vnodeMap['a'].position.y).toBe(40)
    })

    it('sets radius to max(width, height) / 2', () => {
      layout.prepare([makeNode('a', 0, 0, 100, 60)], [])
      expect(layout.vnodeMap['a'].radius).toBe(50)
    })

    it('sets outdegree for source node', () => {
      const nodes = [makeNode('a', 0, 0), makeNode('b', 200, 0)]
      layout.prepare(nodes, [makeEdge('e1', 'a', 'b')])
      expect(layout.vnodeMap['a'].outdegree).toBe(1)
      expect(layout.vnodeMap['a'].indegree).toBe(0)
    })

    it('records incoming edge in targetMap for target node', () => {
      // Note: indegree is consumed to 0 by prepareRank() topological sort,
      // so check targetMap keys instead
      const nodes = [makeNode('a', 0, 0), makeNode('b', 200, 0)]
      layout.prepare(nodes, [makeEdge('e1', 'a', 'b')])
      expect(Object.keys(layout.vnodeMap['b'].targetMap)).toContain('a')
      expect(layout.vnodeMap['b'].outdegree).toBe(0)
    })

    it('assigns rank 1 to source and rank 2 to target in a simple chain', () => {
      const nodes = [makeNode('a', 0, 0), makeNode('b', 200, 0)]
      layout.prepare(nodes, [makeEdge('e1', 'a', 'b')])
      expect(layout.vnodeMap['a'].rank).toBe(1)
      expect(layout.vnodeMap['b'].rank).toBe(2)
    })

    it('leaves rank 0 for isolated nodes (no edges)', () => {
      layout.prepare([makeNode('solo', 0, 0)], [])
      expect(layout.vnodeMap['solo'].rank).toBe(0)
    })

    it('computes layoutWidth and layoutHeight from vnode center positions', () => {
      // node a center: (50, 40), node b center: (250, 140)
      layout.prepare(
        [makeNode('a', 0, 0, 100, 80), makeNode('b', 200, 100, 100, 80)],
        []
      )
      expect(layout.layoutWidth).toBe(200)
      expect(layout.layoutHeight).toBe(100)
    })

    it('handles three nodes in a linear chain: a→b→c', () => {
      const nodes = [makeNode('a', 0, 0), makeNode('b', 100, 0), makeNode('c', 200, 0)]
      const edges = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'c')]
      layout.prepare(nodes, edges)
      expect(layout.vnodeMap['a'].rank).toBe(1)
      expect(layout.vnodeMap['b'].rank).toBe(2)
      expect(layout.vnodeMap['c'].rank).toBe(3)
    })
  })

  describe('stable()', () => {
    it('returns true when temperature is 0', () => {
      AutoLayout.temperature = 0
      layout.simulated = 1000
      // epsilon = 1000 * 0 / 100 = 0 < 0.1
      expect(layout.stable()).toBe(true)
    })

    it('returns false when simulated * temperature / alParamTemperature >= 0.1', () => {
      AutoLayout.temperature = alParamTemperature // 100
      layout.simulated = 1
      // epsilon = 1 * 100 / 100 = 1.0 >= 0.1
      expect(layout.stable()).toBe(false)
    })

    it('returns true when simulated is 0', () => {
      AutoLayout.temperature = alParamTemperature
      layout.simulated = 0
      // epsilon = 0 * 100 / 100 = 0 < 0.1
      expect(layout.stable()).toBe(true)
    })
  })

  describe('pin()', () => {
    it('sets pinnedNodes for all provided nodes', () => {
      const nodes = [makeNode('a', 0, 0), makeNode('b', 100, 0)]
      layout.pin(nodes)
      expect(AutoLayout.pinnedNodes['a']).toBe(true)
      expect(AutoLayout.pinnedNodes['b']).toBe(true)
    })

    it('replaces previous pinnedNodes entirely', () => {
      layout.pin([makeNode('a', 0, 0)])
      layout.pin([makeNode('b', 0, 0)])
      expect(AutoLayout.pinnedNodes['a']).toBeUndefined()
      expect(AutoLayout.pinnedNodes['b']).toBe(true)
    })
  })

  describe('update()', () => {
    it('applies vector to node position scaled by temperature rate', () => {
      AutoLayout.temperature = alParamTemperature // rate = 1.0
      layout.prepare([makeNode('a', 0, 0)], [])
      layout.vnodes[0].vector = new Vector({ x: 10, y: 5 })
      layout.update()
      expect(layout.vnodes[0].original.position.x).toBeCloseTo(10)
      expect(layout.vnodes[0].original.position.y).toBeCloseTo(5)
    })

    it('applies half-rate when temperature is 50', () => {
      AutoLayout.temperature = alParamTemperature / 2 // rate = 0.5
      layout.prepare([makeNode('a', 20, 10)], [])
      layout.vnodes[0].vector = new Vector({ x: 20, y: 20 })
      layout.update()
      expect(layout.vnodes[0].original.position.x).toBeCloseTo(30) // 20 + 20*0.5
      expect(layout.vnodes[0].original.position.y).toBeCloseTo(20) // 10 + 20*0.5
    })

    it('skips pinned nodes', () => {
      AutoLayout.temperature = alParamTemperature
      layout.prepare([makeNode('a', 0, 0)], [])
      AutoLayout.pinnedNodes['a'] = true
      layout.vnodes[0].vector = new Vector({ x: 50, y: 50 })
      layout.update()
      expect(layout.vnodes[0].original.position.x).toBe(0)
      expect(layout.vnodes[0].original.position.y).toBe(0)
    })

    it('decays temperature by 0.95 per update', () => {
      AutoLayout.temperature = 100
      layout.prepare([makeNode('a', 0, 0)], [])
      layout.vnodes[0].vector = new Vector({ x: 0, y: 0 })
      layout.update()
      expect(AutoLayout.temperature).toBeCloseTo(95)
    })
  })

  // v12 migration target: AutoLayout.getWidthHeight()
  // v11: reads node.width / node.height directly
  // v12: must read node.measured?.width ?? node.width (library stores measured dims in node.measured)
  describe('getWidthHeight() via prepare() — v11 behavior', () => {
    it('derives radius from node.width and node.height (max/2)', () => {
      layout.prepare([makeNode('a', 0, 0, 120, 80)], [])
      expect(layout.vnodeMap['a'].radius).toBe(60) // max(120,80)/2
    })

    it('uses height when height > width', () => {
      layout.prepare([makeNode('a', 0, 0, 60, 100)], [])
      expect(layout.vnodeMap['a'].radius).toBe(50) // max(60,100)/2
    })

    it('falls back to 0 when width and height are both 0', () => {
      layout.prepare([makeNode('a', 0, 0, 0, 0)], [])
      expect(layout.vnodeMap['a'].radius).toBe(0)
    })
  })
})
