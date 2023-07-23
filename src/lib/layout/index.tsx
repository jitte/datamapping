import { Node, Edge } from 'reactflow'
import { Vector, VectorType, XY, distance } from './vector'

type vNodeType = {
  original: Node
  position: VectorType
  radius: number
  sourceMap: mapType<Node>
  targetMap: mapType<Node>
  vector: Vector
}
type vEdgeType = {
  source: vNodeType
  target: vNodeType
}
type mapType<T> = {
  [key: string]: T
}

const alParamEpsilon = 0.1
const alParamTemperature = 100
const alParamDecayRate = 0.95
const alParamNodeRadius = 150
const alParamClipSize = 500
const alParamStressWeight: mapType<number> = {
  center: 10,
  tension: 10,
  collision: 50,
  crossing: 50,
  rotation: 10,
}

const stressCenter = (vnode: vNodeType, center: VectorType): Vector => {
  const vector = Vector.vector(vnode.position, center).normalize()
  //console.log('at: stressCenter', {vnode, center, vector})
  return vector
}

const stressTension = (vnode: vNodeType): Vector => {
  const stress = (nodeMap: mapType<Node>): Vector => {
    const keys: string[] = Object.keys(nodeMap)
    return Vector.sum(
      keys.map((key) =>
        Vector.vector(vnode.position, nodeMap[key].position).normalize()
      )
    )
  }
  return Vector.sum([stress(vnode.sourceMap), stress(vnode.targetMap)])
}

const stressGravity = (r: number, d: number): number => {
  // inner radius: linear decrease
  //   d = 0 : 2
  //   d = r : 1
  // outer radius: decrease by 1/d^2
  //   d = 2r : 1/4
  //   d = 3r : 1/9
  return d < r ? 2 - d / r : (r * r) / (d * d)
}

const stressCollision = (
  vnode: vNodeType,
  vnodes: vNodeType[],
  clip: number
): Vector => {
  const clippedVnodes: vNodeType[] = vnodes.filter(
    (vn) =>
      Math.abs(vn.position.x - vnode.position.x) < clip &&
      Math.abs(vn.position.y - vnode.position.y) < clip
  )
  const len: number = (clippedVnodes ?? []).length
  if (len < 2) return Vector.zero()

  const stress = (vn1: vNodeType, vn2: vNodeType): Vector => {
    if (vn1 === vn2) return Vector.zero()

    const r: number = vn1.radius + vn2.radius
    const vector: Vector = Vector.vector(vn2.position, vn1.position)
    const d: number = vector.r()
    const unit: number = stressGravity(r, d)
    return vector.normalize(unit)
  }

  const vectors = clippedVnodes.map((vn) => stress(vnode, vn), 0)
  //console.log('at: stressCollision', { vnode, vectors })
  return Vector.sum(vectors)
}

const perpendicular = <T extends VectorType>(
  source: T,
  target: T,
  center: T
): number => {
  const dx: number = target.x - source.x
  const dy: number = target.y - source.x
  const a: number = -dy
  const b: number = dx
  const c: number = source.x * dy - source.y * dx
  return (a * center.x + b * center.y + c) / Math.sqrt(a * a + b * b)
}

const stressCrossing = (
  vnode: vNodeType,
  vedges: vEdgeType[],
  clip: number
): Vector => {
  const np = vnode.position
  const clippedVedges: vEdgeType[] = vedges.filter((vedge) => {
    const sp: XY = vedge.source.position
    const tp: XY = vedge.target.position
    const minX: number = Math.min(sp.x, tp.x)
    const maxX: number = Math.max(sp.x, tp.x)
    const minY: number = Math.min(sp.y, tp.y)
    const maxY: number = Math.max(sp.y, tp.y)
    return !(
      minX > np.x + clip ||
      maxX < np.x - clip ||
      minY > np.y + clip ||
      maxY < np.y - clip
    )
  })
  const stress = (vedge: vEdgeType): Vector => {
    const sp: XY = vedge.source.position
    const tp: XY = vedge.target.position
    const d1: number = distance(np, sp)
    const d2: number = distance(np, tp)
    const d3: number = perpendicular(sp, tp, np)
    const dMin: number = Math.min(d1, d2, Math.abs(d3))
    //const r: number = vnode.radius
    //const unit: number = stressGravity(r, dMin)
    let vector: Vector
    switch (dMin) {
      case d1:
        vector = Vector.vector(np, sp)
        break
      case d2:
        vector = Vector.vector(np, tp)
        break
      default:
        vector = new Vector({
          x: sp.y - tp.y,
          y: tp.x - sp.x,
        })
        if (d3 < 0) vector.negate()
    }
    return vector.normalize()
  }
  const vectors: Vector[] = clippedVedges.map((ve) => stress(ve))
  return Vector.sum(vectors)
}

const stressRotation = (vnode: vNodeType): Vector => {
  const stress = (nodeMap: mapType<Node>): Vector[] => {
    const keys: string[] = Object.keys(nodeMap)
    return keys.map((key) => {
      const vector = Vector.vector(
        vnode.position,
        nodeMap[key].position
      ).normalize()
      vector.x = 0
      return vector
    })
  }
  return Vector.sum([...stress(vnode.sourceMap), ...stress(vnode.targetMap)])
}

class AutoLayout {
  nodes: Node[] = []
  edges: Edge[] = []
  vnodes: vNodeType[] = []
  vedges: vEdgeType[] = []
  center: Vector = Vector.zero()
  simulated: number = 0
  static temperature: number = 0
  static pinnedNodes: mapType<boolean> = {}

  constructor() {
    //console.log('at: AutoLayout/constructor')
  }

  reset = (): AutoLayout => {
    this.nodes = []
    this.edges = []
    this.vnodes = []
    this.vedges = []
    this.center = Vector.zero()
    this.simulated = 0
    AutoLayout.temperature = 0
    AutoLayout.pinnedNodes = {}
    return this
  }

  trigger = (): AutoLayout => {
    AutoLayout.temperature = alParamTemperature
    //console.log('at: AutoLayout/trigger', AutoLayout.temperature)
    return this
  }

  prepare = (nodes: Node[], edges: Edge[]): AutoLayout => {
    this.nodes = nodes
    this.edges = edges
    this.vnodes = this.prepareVnodes()
    this.vedges = this.prepareVedges()
    this.center = Vector.average(this.vnodes.map((vnode) => vnode.position))
    //console.log('at: AutoLayout/prepare', { nodes, edges, this: this })
    return this
  }

  private prepareVnodes = (): vNodeType[] => {
    const nodeMap: mapType<Node> = {}
    this.nodes.forEach((node) => {
      nodeMap[node.id] = node
    })
    const vnodes: vNodeType[] = this.nodes.map((node) => {
      const sourceMap: mapType<Node> = {}
      const targetMap: mapType<Node> = {}
      this.edges.forEach((edge) => {
        if (node.id === edge.source) {
          sourceMap[node.id] = nodeMap[edge.target]
        }
        if (node.id === edge.target) {
          targetMap[node.id] = nodeMap[edge.source]
        }
      })
      return {
        original: node,
        position: {
          x: node.position.x,
          y: node.position.y + (node.height ?? 0),
        },
        radius: alParamNodeRadius,
        sourceMap: sourceMap,
        targetMap: targetMap,
        vector: Vector.zero(),
      }
    })
    return vnodes
  }

  private prepareVedges = (): vEdgeType[] => {
    const vnodeMap: mapType<vNodeType> = {}
    this.vnodes.forEach((vnode) => {
      vnodeMap[vnode.original.id] = vnode
    })
    const vedges: vEdgeType[] = this.edges.map((edge) => {
      return { source: vnodeMap[edge.source], target: vnodeMap[edge.target] }
    })
    return vedges
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
          return stressCenter(vnode, this.center)
        case 'tension':
          return stressTension(vnode)
        case 'collision':
          return stressCollision(vnode, this.vnodes, alParamClipSize)
        case 'crossing':
          return stressCrossing(vnode, this.vedges, alParamClipSize)
        case 'rotation':
          return stressRotation(vnode)
        default:
          return Vector.zero()
      }
    }
    return Vector.sum(keys.map((key) => stress(key)))
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
    /*
    console.log('at: AutoLayout/stable', {
      epsilon,
      temperature: AutoLayout.temperature,
      stable: epsilon < alParamEpsilon,
      this: this,
    })
    */
    return epsilon < alParamEpsilon
  }
}

export { AutoLayout }
