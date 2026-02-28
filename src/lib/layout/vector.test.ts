import { describe, it, expect } from 'vitest'
import { Vector } from './vector'

describe('Vector', () => {
  describe('constructor', () => {
    it('initializes x and y from {x, y}', () => {
      const v = new Vector({ x: 3, y: 4 })
      expect(v.x).toBe(3)
      expect(v.y).toBe(4)
    })

    it('initializes from another Vector instance', () => {
      const v1 = new Vector({ x: 1, y: 2 })
      const v2 = new Vector(v1)
      expect(v2.x).toBe(1)
      expect(v2.y).toBe(2)
    })
  })

  describe('add', () => {
    it('adds another vector in place', () => {
      const v = new Vector({ x: 1, y: 2 })
      v.add({ x: 3, y: 4 })
      expect(v.x).toBe(4)
      expect(v.y).toBe(6)
    })

    it('returns this (chainable)', () => {
      const v = new Vector({ x: 1, y: 2 })
      expect(v.add({ x: 0, y: 0 })).toBe(v)
    })
  })

  describe('negate', () => {
    it('negates both components in place', () => {
      const v = new Vector({ x: 3, y: -5 })
      v.negate()
      expect(v.x).toBe(-3)
      expect(v.y).toBe(5)
    })

    it('negate of zero vector stays zero', () => {
      const v = new Vector({ x: 0, y: 0 })
      v.negate()
      // -0 === 0 mathematically; use toBeCloseTo to avoid Object.is(-0, 0) === false
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(0)
    })
  })

  describe('r()', () => {
    it('returns 5 for (3, 4)', () => {
      expect(new Vector({ x: 3, y: 4 }).r()).toBe(5)
    })

    it('returns 0 for zero vector', () => {
      expect(new Vector({ x: 0, y: 0 }).r()).toBe(0)
    })

    it('handles negative components', () => {
      expect(new Vector({ x: -3, y: -4 }).r()).toBe(5)
    })

    it('returns 1 for unit vectors', () => {
      expect(new Vector({ x: 1, y: 0 }).r()).toBe(1)
      expect(new Vector({ x: 0, y: 1 }).r()).toBe(1)
    })
  })

  describe('theta()', () => {
    it('returns 0 for positive x-axis (1, 0)', () => {
      expect(new Vector({ x: 1, y: 0 }).theta()).toBeCloseTo(0)
    })

    it('returns PI/2 for positive y-axis (0, 1)', () => {
      expect(new Vector({ x: 0, y: 1 }).theta()).toBeCloseTo(Math.PI / 2)
    })

    it('returns -PI/2 for negative y-axis (0, -1)', () => {
      expect(new Vector({ x: 0, y: -1 }).theta()).toBeCloseTo(-Math.PI / 2)
    })

    it('returns PI/4 for (1, 1)', () => {
      expect(new Vector({ x: 1, y: 1 }).theta()).toBeCloseTo(Math.PI / 4)
    })

    it('returns -PI/4 for (1, -1)', () => {
      expect(new Vector({ x: 1, y: -1 }).theta()).toBeCloseTo(-Math.PI / 4)
    })
  })

  describe('rotate', () => {
    it('rotates (1, 0) by PI/2 → (0, 1)', () => {
      const v = new Vector({ x: 1, y: 0 })
      v.rotate(Math.PI / 2)
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(1)
    })

    it('rotates (0, 1) by PI → (0, -1)', () => {
      const v = new Vector({ x: 0, y: 1 })
      v.rotate(Math.PI)
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(-1)
    })

    it('preserves magnitude after rotation', () => {
      const v = new Vector({ x: 3, y: 4 })
      const before = v.r()
      v.rotate(1.23)
      expect(v.r()).toBeCloseTo(before)
    })
  })

  describe('normalize', () => {
    it('scales to unit length 1 by default', () => {
      const v = new Vector({ x: 3, y: 4 })
      v.normalize()
      expect(v.r()).toBeCloseTo(1)
    })

    it('scales to given unit length', () => {
      const v = new Vector({ x: 3, y: 4 })
      v.normalize(10)
      expect(v.r()).toBeCloseTo(10)
    })

    it('preserves direction after normalize', () => {
      const v = new Vector({ x: 3, y: 4 })
      const thetaBefore = v.theta()
      v.normalize(7)
      expect(v.theta()).toBeCloseTo(thetaBefore)
    })

    it('does not modify zero vector', () => {
      const v = new Vector({ x: 0, y: 0 })
      v.normalize()
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })
  })

  describe('multiple', () => {
    it('scales both components by factor', () => {
      const v = new Vector({ x: 2, y: 3 })
      v.multiple(4)
      expect(v.x).toBe(8)
      expect(v.y).toBe(12)
    })

    it('multiple by 0 produces zero vector', () => {
      const v = new Vector({ x: 5, y: 7 })
      v.multiple(0)
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('multiple by -1 negates', () => {
      const v = new Vector({ x: 3, y: -2 })
      v.multiple(-1)
      expect(v.x).toBe(-3)
      expect(v.y).toBe(2)
    })
  })

  describe('Vector.vector (static)', () => {
    it('creates vector from source to target', () => {
      const v = Vector.vector({ x: 1, y: 2 }, { x: 4, y: 6 })
      expect(v.x).toBe(3)
      expect(v.y).toBe(4)
    })

    it('returns zero vector for identical points', () => {
      const v = Vector.vector({ x: 5, y: 5 }, { x: 5, y: 5 })
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('handles negative coordinates', () => {
      const v = Vector.vector({ x: -3, y: -2 }, { x: 1, y: 2 })
      expect(v.x).toBe(4)
      expect(v.y).toBe(4)
    })
  })

  describe('Vector.zero (static)', () => {
    it('returns {x: 0, y: 0}', () => {
      const v = Vector.zero()
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('each call returns a new instance', () => {
      const a = Vector.zero()
      const b = Vector.zero()
      expect(a).not.toBe(b)
    })
  })

  describe('Vector.sum (static)', () => {
    it('sums all position vectors', () => {
      const v = Vector.sum([{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }])
      expect(v.x).toBe(9)
      expect(v.y).toBe(12)
    })

    it('returns zero vector for empty array', () => {
      const v = Vector.sum([])
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('returns the single vector for a one-element array', () => {
      const v = Vector.sum([{ x: 7, y: -3 }])
      expect(v.x).toBe(7)
      expect(v.y).toBe(-3)
    })
  })

  describe('Vector.average (static)', () => {
    it('computes average of two positions', () => {
      const v = Vector.average([{ x: 0, y: 0 }, { x: 4, y: 6 }])
      expect(v.x).toBe(2)
      expect(v.y).toBe(3)
    })

    it('returns zero vector for empty array', () => {
      const v = Vector.average([])
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('returns the single point for one-element array', () => {
      const v = Vector.average([{ x: 10, y: 20 }])
      expect(v.x).toBe(10)
      expect(v.y).toBe(20)
    })
  })

  describe('Vector.distance (static)', () => {
    it('computes Euclidean distance (3-4-5 triangle)', () => {
      expect(Vector.distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
    })

    it('returns 0 for identical points', () => {
      expect(Vector.distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0)
    })

    it('is symmetric', () => {
      const d1 = Vector.distance({ x: 1, y: 2 }, { x: 5, y: 5 })
      const d2 = Vector.distance({ x: 5, y: 5 }, { x: 1, y: 2 })
      expect(d1).toBeCloseTo(d2)
    })
  })

  describe('Vector.perpendicular (static)', () => {
    it('returns zero vector for a zero-length line', () => {
      const v = Vector.perpendicular({ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 3 })
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
    })

    it('returns vector pointing from horizontal line to point above it', () => {
      // line (0,0)→(10,0), center (5,3): perpendicular should point downward (toward line)
      const v = Vector.perpendicular({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 3 })
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(-3)
    })

    it('returns zero for a point on the line itself', () => {
      // line (0,0)→(10,0), center (5,0): no perpendicular offset
      const v = Vector.perpendicular({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 0 })
      expect(v.x).toBeCloseTo(0)
      expect(v.y).toBeCloseTo(0)
    })
  })

  describe('Vector.crossing (static)', () => {
    it('returns true for a zero-length line', () => {
      expect(Vector.crossing({ x: 1, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 0 })).toBe(true)
    })

    it('returns true when the center projection falls between source and target', () => {
      // horizontal line (0,0)→(10,0), center (5, 100) — y-projection of center is between 0 and 10 along x
      expect(Vector.crossing({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 100 })).toBe(true)
    })

    it('returns false when center is beyond the target along the line direction', () => {
      // horizontal line (0,0)→(10,0), center (20,0) — beyond target
      expect(Vector.crossing({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 })).toBe(false)
    })

    it('returns false when center is before the source along the line direction', () => {
      // horizontal line (0,0)→(10,0), center (-5,0) — before source
      expect(Vector.crossing({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: -5, y: 0 })).toBe(false)
    })
  })
})
