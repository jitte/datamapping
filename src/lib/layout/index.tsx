import { Node, Edge, ReactFlowInstance, Viewport } from 'reactflow'
import { Vector, VectorType } from './vector'

export type vNodeType = {
  original: Node
  position: VectorType
  width: number
  height: number
  radius: number
  sourceMap: mapType<vEdgeType>
  targetMap: mapType<vEdgeType>
  evaluate: mapType<Vector>
  vector: Vector
  rank: number
  indegree: number
  outdegree: number
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
  weights: string[] = []

  static temperature: number = 0
  static pinnedNodes: mapType<boolean> = {}
  static center: VectorType = Vector.zero()
  static weightMap: mapType<number> = alParamStressWeight

  constructor(public reactflowInstance: ReactFlowInstance) {
    //console.log('at: AutoLayout/constructor')
  }

  trigger = (): AutoLayout => {
    AutoLayout.temperature = alParamTemperature

    const viewport: Viewport = this.reactflowInstance.getViewport()
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2
    AutoLayout.center = this.reactflowInstance.project({ x, y })
    if (false) {
      console.log(
        window.innerWidth,
        window.innerHeight,
        viewport,
        AutoLayout.center
      )
    }
    return this
  }

  prepare = (nodes: Node[], edges: Edge[]): AutoLayout => {
    this.nodes = nodes
    this.edges = edges
    this.weights =
      Object.keys(AutoLayout.weightMap).filter(
        (key) => AutoLayout.weightMap[key]
      ) ?? []
    this.prepareVnodes()
    this.prepareVedges()
    this.prepareMaps()
    this.prepareWidthHeight()
    this.prepareRank()
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

      const evaluate: mapType<Vector> = {}
      this.weights.forEach((key) => (evaluate[key] = Vector.zero()))

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
        evaluate: evaluate,
        vector: Vector.zero(),
        indegree: 0,
        outdegree: 0,
        rank: 0,
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
          y: source.position.y, // + source.height / 2,
        },
        targetPosition: {
          x: target.position.x - target.width / 2,
          y: target.position.y, // + source.height / 2,
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
      vnode.outdegree = Object.keys(sourceMap).length
      vnode.targetMap = targetMap
      vnode.indegree = Object.keys(targetMap).length
    })
  }

  private prepareWidthHeight = (): void => {
    const xValues = this.vnodes.map((vnode) => vnode.position.x)
    const yValues = this.vnodes.map((vnode) => vnode.position.y)
    this.layoutWidth = Math.max(...xValues) - Math.min(...xValues)
    this.layoutHeight = Math.max(...yValues) - Math.min(...yValues)
  }

  private prepareRank = (): void => {
    // exclude vnode without edge
    let vnodes = this.vnodes.filter((vn) => vn.indegree + vn.outdegree > 0)
    let currentRank = 1
    while (true) {
      const zeroDegree = vnodes.filter((vn) => vn.indegree === 0)
      if (zeroDegree.length === 0) break
      vnodes = vnodes.filter((vn) => vn.indegree > 0)

      zeroDegree.forEach((vn) => {
        vn.rank = currentRank
        const keys = Object.keys(vn.sourceMap)
        keys.forEach((key) => vn.sourceMap[key].target.indegree--)
      })
      currentRank++
    }
    //console.log(this.vnodes)
  }

  private getWidthHeight = (node: Node): { width: number; height: number } => {
    const width = node.width ?? 0
    const height = node.height ?? 0
    return { width, height }
  }

  simulate = (): AutoLayout => {
    this.evaluate()
    const arr: Vector[] = this.vnodes.map((vnode) => {
      const vector = Vector.sum(
        this.weights.map(
          (stress) => vnode.evaluate[stress]
          //new Vector(vnode.evaluate[stress]).multiple(
          //AutoLayout.weightMap[stress]
          //)
        )
      )
      vnode.vector = vector
      return vector
    })

    this.simulated = arr.reduce((acc, cur) => acc + cur.r(), 0)
    //console.log('at: AutoLayout/simulate', { arr, this: this })
    return this
  }

  private evaluate = (): void => {
    this.vnodes.forEach((vnode) => {
      this.weights.forEach((stress) => {
        switch (stress) {
          case 'center':
            this.stressCenter(vnode)
            return
          case 'collision':
            this.stressCollision(vnode)
            return
          case 'crossing':
            this.stressCrossing(vnode)
            return
          case 'rotation':
            this.stressRotation(vnode)
            return
        }
      })
    })
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

  private stressCenter = (vnode: vNodeType): void => {
    const stress: string = 'center'
    if (vnode.rank === 0) {
      vnode.evaluate[stress].add(
        Vector.vector(vnode.position, AutoLayout.center).normalize(
          AutoLayout.weightMap[stress]
        )
      )
    } else {
      vnode.evaluate[stress].add(
        Vector.vector(vnode.position, {
          x: vnode.rank * alParamOrbitRadius,
          y: vnode.position.y,
        }).multiple(0.5)
      )
    }
  }

  private stressCollision = (vnode: vNodeType): void => {
    const stress: string = 'collision'
    const len: number = (this.vnodes ?? []).length
    if (len < 2) return

    const collision = (vn1: vNodeType, vn2: vNodeType): Vector => {
      if (vn1 === vn2) return Vector.zero()

      const vector: Vector = Vector.vector(vn1.position, vn2.position)
      const d: number = vector.r()
      const orbit: number = alParamOrbitRadius
      if (d < orbit) {
        // push each other
        vector.normalize((d - orbit) / 2)
      } else {
        // pull each other
        vector.normalize(
          (1 - Math.pow(orbit / d, 3)) * AutoLayout.weightMap[stress]
        )
      }
      return vector
    }
    this.vnodes.forEach((vn) =>
      vnode.evaluate[stress].add(collision(vnode, vn))
    )
    //console.log('at: stressCollision', { vnode, vectors })
  }

  private stressCrossing = (vnode: vNodeType): void => {
    const stress: string = 'crossing'
    const np = vnode.position
    const crossing = (vedge: vEdgeType): void => {
      if (vnode === vedge.source || vnode === vedge.target) return

      const sp: VectorType = {...vedge.sourcePosition}
      const tp: VectorType = {...vedge.targetPosition}
      if (!Vector.crossing(sp, tp, np)) return

      const vector: Vector = Vector.perpendicular(sp, tp, np)
      const dp: number = vector.r()
      if (dp > alParamOrbitRadius) return

      const unit = (dp - alParamOrbitRadius) * 0.2
      vector.normalize(unit)
      vnode.evaluate[stress].add(vector)
      /*
      const edgeVector = new Vector(vector).multiple(-0.5)
      const pushback = (vn: vNodeType) => {
        vn.evaluate[stress].add(edgeVector)
      }
      pushback(vedge.source)
      pushback(vedge.target)
      */
    }
    this.vedges.forEach((ve) => crossing(ve))
  }

  private stressRotation = (vnode: vNodeType): void => {
    const stress: string = 'rotation'

    const rotation = (nodeMap: mapType<vEdgeType>, negate: boolean): void => {
      const keys: string[] = Object.keys(nodeMap)
      //const vectors: Vector[] =
      keys.map((key) => {
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

        const newTheta = Math.abs(vector.theta())
        const unit =
          (newTheta < 1 ? newTheta : newTheta * newTheta) *
          AutoLayout.weightMap[stress]
        vector.normalize(unit)
        vnode.evaluate[stress].add(vector)
      })
    }
    rotation(vnode.sourceMap, false)
    rotation(vnode.targetMap, true)
  }
}

export { AutoLayout, alParamTemperature }
