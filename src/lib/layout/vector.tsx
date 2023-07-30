import { XYPosition } from 'reactflow'

export type XY = XYPosition
export type VectorType = Vector | XY

class Vector {
  public x: number
  public y: number

  constructor(vector: VectorType) {
    this.x = vector.x
    this.y = vector.y
  }

  /**
   * instance methods
   */
  add = (vector: VectorType): Vector => {
    this.x = this.x + vector.x
    this.y = this.y + vector.y
    return this
  }

  negate = (): Vector => {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  r = (): number => {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  theta = (): number => {
    if (this.y > 0) {
      // 0 < theta < PI
      return Math.acos(this.x / this.r())
    } else {
      // -PI <= theta <= 0
      return -Math.acos(this.x / this.r())
    }
  }

  rotate = (dTheta: number): Vector => {
    const newTheta = this.theta() + dTheta
    const r = this.r()
    this.x = r * Math.cos(newTheta)
    this.y = r * Math.sin(newTheta)
    return this
  }

  normalize = (unit: number = 1): Vector => {
    if (this.x === 0 && this.y === 0) return this

    this.multiple(unit / this.r())
    return this
  }

  multiple = (unit: number): Vector => {
    this.x = this.x * unit
    this.y = this.y * unit
    return this
  }

  /**
   * class methods
   */
  static vector = (source: VectorType, target: VectorType): Vector => {
    return new Vector({ x: target.x - source.x, y: target.y - source.y })
  }

  static zero = (): Vector => {
    return new Vector({ x: 0, y: 0 })
  }

  static sum = (positions: VectorType[]): Vector => {
    let x: number = 0
    let y: number = 0
    positions.forEach((pos) => {
      x = x + pos.x
      y = y + pos.y
    })
    return new Vector({ x, y })
  }

  static average = (positions: VectorType[]): Vector => {
    const vec = Vector.sum(positions)
    const len = positions.length
    return len === 0
      ? Vector.zero()
      : new Vector({ x: vec.x / len, y: vec.y / len })
  }

  static center = Vector.average

  static distance = (pos1: VectorType, pos2: VectorType): number => {
    return Vector.vector(pos1, pos2).r()
  }

  static perpendicular = (
    source: VectorType,
    target: VectorType,
    center: VectorType
  ): Vector => {
    const dx: number = target.x - source.x
    const dy: number = target.y - source.y
    if (dx === 0 && dy === 0) return Vector.zero()

    const dx2 = dx * dx
    const dy2 = dy * dy
    const dxdy = dx * dy
    const x =
      (dxdy * (center.y - source.y) - dy2 * (center.x - source.x)) / (dx2 + dy2)
    const y =
      (dxdy * (center.x - source.x) - dx2 * (center.y - source.y)) / (dx2 + dy2)
    return new Vector({ x, y })
  }

  static crossing = (
    source: VectorType,
    target: VectorType,
    center: VectorType
  ): boolean => {
    const dx: number = target.x - source.x
    const dy: number = target.y - source.y
    if (dx === 0 && dy === 0) return true

    const equation = (pos: VectorType) => {
      return dx * (pos.x - center.x) + dy * (pos.y - center.y)
    }
    return equation(source) * equation(target) <= 0
  }
}

const distance = Vector.distance

export { Vector, distance }
