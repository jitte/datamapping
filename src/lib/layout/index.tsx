import { Node, Edge } from 'reactflow'
import { Vector, VectorType, XY, distance } from './vector'

type vNodeType = {
  original: Node
  position: VectorType
  width: number
  height: number
  radius: number
  sourceMap: mapType<vEdgeType>
  targetMap: mapType<vEdgeType>
  evaluate: mapType<Vector>
  vector: Vector
}
type vEdgeType = {
  original: Edge
  source: vNodeType
  target: vNodeType
  sourcePosition: VectorType
  targetPosition: VectorType
}
type mapType<T> = {
  [key: string]: T
}

const alParamEpsilon = 0.1
const alParamTemperature = 100
const alParamDecayRate = 0.95
const alParamOrbitRadius = 480
const alParamStressWeight: mapType<number> = {
  center: 1,
  collision: 1,
  crossing: 1,
  rotation: 1,
}

class AutoLayout {
  nodes: Node[] = []
  edges: Edge[] = []
  nodeMap: mapType<Node> = {}
  edgeMap: mapType<Edge> = {}
  vnodes: vNodeType[] = []
  vedges: vEdgeType[] = []
  vnodeMap: mapType<vNodeType> = {}
  vedgeMap: mapType<vEdgeType> = {}
  layoutWidth: number = 0
  layoutHeight: number = 0
  simulated: number = 0

  static temperature: number = 0
  static pinnedNodes: mapType<boolean> = {}
  static center: Vector = Vector.zero()

  constructor() {
    //console.log('at: AutoLayout/constructor')
  }

  trigger = (): AutoLayout => {
    AutoLayout.temperature = alParamTemperature
    //console.log('at: AutoLayout/trigger', AutoLayout.temperature)
    if (!this.vnodes || this.vnodes.length === 0) return this
    AutoLayout.center = Vector.center(
      this.vnodes.map((vnode) => vnode.position)
    )
    return this
  }

  prepare = (nodes: Node[], edges: Edge[]): AutoLayout => {
    this.nodes = nodes
    this.edges = edges
    this.prepareVnodes()
    this.prepareVedges()
    this.prepareMaps()
    this.prepareWidthHeight()
    //console.log('at: AutoLayout/prepare', { nodes, edges, this: this })
    return this
  }

  private prepareVnodes = (): void => {
    // nodeMap
    const nodeMap: mapType<Node> = {}
    this.nodes.forEach((node) => {
      nodeMap[node.id] = node
    })
    this.nodeMap = nodeMap

    // vnodes
    const vnodes: vNodeType[] = this.nodes.map((node) => {
      const { width, height } = this.getWidthHeight(node)
      return {
        original: node,
        position: {
          x: node.position.x + width / 2,
          y: node.position.y + height / 2,
        },
        width,
        height,
        radius: Math.max(width, height) / 2,
        sourceMap: {},
        targetMap: {},
        evaluate: {},
        vector: Vector.zero(),
      }
    })
    this.vnodes = vnodes

    // vnodeMap
    const vnodeMap: mapType<vNodeType> = {}
    this.vnodes.forEach((vnode) => {
      vnodeMap[vnode.original.id] = vnode
    })
    this.vnodeMap = vnodeMap
  }

  private prepareVedges = (): void => {
    // edgeMap
    const edgeMap: mapType<Edge> = {}
    this.edges.forEach((edge) => {
      edgeMap[edge.id] = edge
    })
    this.edgeMap = edgeMap

    // vedges
    const vedges: vEdgeType[] = this.edges.map((edge) => {
      const source = this.vnodeMap[edge.source]
      const target = this.vnodeMap[edge.target]
      const vedge: vEdgeType = {
        original: edge,
        source,
        target,
        sourcePosition: {
          x: source.position.x + source.width / 2,
          y: source.position.y + source.height / 2,
        },
        targetPosition: {
          x: target.position.x - target.width / 2,
          y: target.position.y + source.height / 2,
        },
      }
      return vedge
    })
    this.vedges = vedges
    // vedges
    const vedgeMap: mapType<vEdgeType> = {}
    this.vedges.forEach((vedge) => {
      vedgeMap[vedge.original.id] = vedge
    })
    this.vedgeMap = vedgeMap
  }

  private prepareMaps = (): void => {
    this.vnodes.map((vnode) => {
      const sourceMap: mapType<vEdgeType> = {}
      const targetMap: mapType<vEdgeType> = {}
      this.edges.forEach((edge) => {
        if (vnode.original.id === edge.source) {
          sourceMap[edge.target] = this.vedgeMap[edge.id]
        }
        if (vnode.original.id === edge.target) {
          targetMap[edge.source] = this.vedgeMap[edge.id]
        }
      })
      vnode.sourceMap = sourceMap
      vnode.targetMap = targetMap
    })
  }

  private prepareWidthHeight = (): void => {
    const xValues = this.vnodes.map((vnode) => vnode.position.x)
    const yValues = this.vnodes.map((vnode) => vnode.position.y)
    this.layoutWidth = Math.max(...xValues) - Math.min(...xValues)
    this.layoutHeight = Math.max(...yValues) - Math.min(...yValues)
  }

  private getWidthHeight = (node: Node): { width: number; height: number } => {
    const width = node.width ?? 0
    const height = node.height ?? 0
    return { width, height }
  }

  simulate = (): AutoLayout => {
    const arr: Vector[] = this.vnodes.map((vnode) => {
      const vector = this.evaluate(vnode)
      vnode.vector = vector
      return vector
    })

    this.simulated = arr.reduce((acc, cur) => acc + cur.r(), 0)
    //console.log('at: AutoLayout/simulate', { arr, this: this })
    return this
  }

  private evaluate = (vnode: vNodeType): Vector => {
    const weight: mapType<number> = alParamStressWeight
    const keys: string[] =
      Object.keys(weight).filter((key) => weight[key]) ?? []
    const stress = (name: string): Vector => {
      switch (name) {
        case 'center':
          return this.stressCenter(vnode)
        case 'collision':
          return this.stressCollision(vnode)
        case 'crossing':
          return this.stressCrossing(vnode)
        case 'rotation':
          return this.stressRotation(vnode)
        default:
          return Vector.zero()
      }
    }
    const vectors: Vector[] = keys.map((key) => {
      const vector = stress(key).multiple(weight[key])
      vnode.evaluate[key] = vector
      return vector
    })
    return Vector.sum(vectors)
  }

  update = (): AutoLayout => {
    const rate = AutoLayout.temperature / alParamTemperature
    this.vnodes.forEach((vnode) => {
      if (AutoLayout.pinnedNodes[vnode.original.id]) return
      const x = vnode.original.position.x + vnode.vector.x * rate
      const y = vnode.original.position.y + vnode.vector.y * rate
      vnode.original.position = { x, y }
    })
    AutoLayout.temperature = AutoLayout.temperature * alParamDecayRate
    //console.log('at: AutoLayout/update', { rate, this: this })
    return this
  }

  pin = (nodes: Node[]): AutoLayout => {
    const pinnedNodes: mapType<boolean> = {}
    nodes.forEach((node) => {
      pinnedNodes[node.id] = true
    })
    AutoLayout.pinnedNodes = pinnedNodes
    //console.log('at: AutoLayout/pin', { nodes, pinnedNodes, this: this })
    return this
  }

  stable = (): boolean => {
    const epsilon =
      (this.simulated * AutoLayout.temperature) / alParamTemperature
    if (false) {
      console.log('at: AutoLayout/stable', {
        epsilon,
        temperature: AutoLayout.temperature,
        stable: epsilon < alParamEpsilon,
        this: this,
      })
    }
    return epsilon < alParamEpsilon
  }

  private stressCenter = (vnode: vNodeType): Vector => {
    const orphan: boolean = !this.edges.find(
      (edge) =>
        edge.source === vnode.original.id || edge.target === vnode.original.id
    )

    if (orphan) {
      return Vector.vector(vnode.position, AutoLayout.center).normalize()
    } else {
      return Vector.zero()
    }
  }

  private stressCollision = (vnode: vNodeType): Vector => {
    const len: number = (this.vnodes ?? []).length
    if (len < 2) return Vector.zero()

    const stress = (vn1: vNodeType, vn2: vNodeType): Vector => {
      if (vn1 === vn2) return Vector.zero()

      const vector: Vector = Vector.vector(vn1.position, vn2.position)
      const d: number = vector.r()
      const orbit: number = alParamOrbitRadius
      if (d < orbit) {
        // push each other
        vector.normalize(d / orbit - 2)
      } else {
        // pull each other
        vector.normalize(2 - (orbit * orbit) / (d * d))
      }
      return vector
    }

    const vectors = this.vnodes.map((vn) => stress(vnode, vn), 0)
    //console.log('at: stressCollision', { vnode, vectors })
    return Vector.sum(vectors)
  }

  private stressCrossing = (vnode: vNodeType): Vector => {
    const np = vnode.position
    const stress = (vedge: vEdgeType): Vector => {
      if (vnode === vedge.source || vnode === vedge.target) return Vector.zero()

      const sp: XY = vedge.source.position
      const tp: XY = vedge.target.position
      const vector: Vector = Vector.perpendicular(sp, tp, np)

      const ds: number = distance(np, sp)
      const dt: number = distance(np, tp)
      const dp: number = vector.r()
      const dm: number = Math.min(ds, dt, dp)
      if (dm === ds || dm === dt) return Vector.zero()
      if (dp > alParamOrbitRadius) return Vector.zero()

      const unit = 1 - dp / alParamOrbitRadius
      return vector.normalize(unit)
    }
    const vectors: Vector[] = this.vedges.map((ve) => stress(ve))
    return Vector.sum(vectors)
  }

  private stressRotation = (vnode: vNodeType): Vector => {
    const stress = (nodeMap: mapType<vEdgeType>, negate: boolean): Vector[] => {
      const keys: string[] = Object.keys(nodeMap)
      const vectors: Vector[] = keys.map((key) => {
        // raw vector
        const vector = Vector.vector(
          nodeMap[key].sourcePosition,
          nodeMap[key].targetPosition
        )
        const theta = vector.theta()
        // rotate according to vector theta and edge connection
        let rotate = Math.PI / 2
        if (theta < 0) rotate = -rotate
        if (negate) rotate = -rotate
        vector.rotate(rotate)
        // stable near horizontal theta
        const newTheta = Math.abs(vector.theta())
        const unit = newTheta < 1 ? newTheta : newTheta * newTheta
        vector.normalize(unit)
        return vector
      })
      return vectors
    }
    return Vector.sum([
      ...stress(vnode.sourceMap, false),
      ...stress(vnode.targetMap, true),
    ])
  }
}

export { AutoLayout }
