// v12: getViewportForBounds(rect, w, h, minZoom, maxZoom) → { x, y, zoom }
// Migration complete: getTransformForBounds([x,y,scale]) → getViewportForBounds({x,y,zoom})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@xyflow/react', () => ({
  getViewportForBounds: vi.fn().mockReturnValue({ x: 10, y: 20, zoom: 0.5 }),
}))

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
  toSvg: vi.fn().mockResolvedValue('data:image/svg+xml,mock'),
}))

import { getViewportForBounds } from '@xyflow/react'
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

  it('calls getViewportForBounds with nodesBounds, width, height, minZoom=0.2, maxZoom=2, padding=0.1', () => {
    downloadImage(mockBounds, 'png')
    expect(getViewportForBounds).toHaveBeenCalledWith(mockBounds, 800, 600, 0.2, 2, 0.1)
  })

  it('passes {x,y,zoom} from getViewportForBounds into the image style', async () => {
    // mock returns { x: 10, y: 20, zoom: 0.5 } → transform: translate(10px, 20px) scale(0.5)
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
