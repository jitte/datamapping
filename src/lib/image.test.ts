// v11: getTransformForBounds(rect, w, h, minZoom, maxZoom) → [x, y, scale]
// v12 migration: rename to getViewportForBounds(rect, w, h, minZoom, maxZoom) → { x, y, zoom }
//   downloadImage() must update the destructure:
//     v11: const [tx, ty, scale] = getTransformForBounds(...)
//     v12: const { x: tx, y: ty, zoom: scale } = getViewportForBounds(...)
//   Also: CSS class '.react-flow__viewport' → '.react-flow__viewport' (unchanged in v12)
//         Rect type import moves from 'reactflow' to '@xyflow/react'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('reactflow', () => ({
  getTransformForBounds: vi.fn().mockReturnValue([10, 20, 0.5]),
}))

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
  toSvg: vi.fn().mockResolvedValue('data:image/svg+xml,mock'),
}))

import { getTransformForBounds } from 'reactflow'
import { toPng, toSvg } from 'html-to-image'
import { downloadImage } from './image'

const mockBounds = { x: 0, y: 0, width: 800, height: 600 }

describe('downloadImage', () => {
  let viewport: HTMLElement

  beforeEach(() => {
    viewport = document.createElement('div')
    viewport.className = 'react-flow__viewport'
    document.body.appendChild(viewport)
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.removeChild(viewport)
  })

  it('calls getTransformForBounds with nodesBounds, width, height, minZoom=0.2, maxZoom=2', () => {
    downloadImage(mockBounds, 'png')
    expect(getTransformForBounds).toHaveBeenCalledWith(mockBounds, 800, 600, 0.2, 2)
  })

  it('passes transform [x,y,scale] from getTransformForBounds into the image style', async () => {
    // mock returns [10, 20, 0.5] → transform: translate(10px, 20px) scale(0.5)
    downloadImage(mockBounds, 'png')
    await vi.waitFor(() => expect(toPng).toHaveBeenCalled())
    const options = vi.mocked(toPng).mock.calls[0][1] as { style: Record<string, string> }
    expect(options.style.transform).toBe('translate(10px, 20px) scale(0.5)')
  })

  it('uses toPng converter for png format', async () => {
    downloadImage(mockBounds, 'png')
    await vi.waitFor(() => expect(toPng).toHaveBeenCalled())
    expect(toSvg).not.toHaveBeenCalled()
  })

  it('uses toSvg converter for svg format', async () => {
    downloadImage(mockBounds, 'svg')
    await vi.waitFor(() => expect(toSvg).toHaveBeenCalled())
    expect(toPng).not.toHaveBeenCalled()
  })

  it('sets image dimensions equal to nodesBounds width and height', async () => {
    downloadImage(mockBounds, 'png')
    await vi.waitFor(() => expect(toPng).toHaveBeenCalled())
    const options = vi.mocked(toPng).mock.calls[0][1] as {
      width: number
      height: number
      style: Record<string, string>
    }
    expect(options.width).toBe(800)
    expect(options.height).toBe(600)
    expect(options.style.width).toBe('800')
    expect(options.style.height).toBe('600')
  })
})
