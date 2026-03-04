import { Rect, getViewportForBounds } from '@xyflow/react'
import { toPng, toSvg } from 'html-to-image'

export function downloadImage(nodesBounds: Rect, format: 'png' | 'svg') {
  const imageWidth = nodesBounds.width
  const imageHeight = nodesBounds.height
  const { x, y, zoom } = getViewportForBounds(
    nodesBounds,
    imageWidth,
    imageHeight,
    0.2,
    2,
    0.1
  )
  const converter = format === 'svg' ? toSvg : toPng
  const options = {
    width: imageWidth,
    height: imageHeight,
    style: {
      width: String(imageWidth),
      height: String(imageHeight),
      transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    },
  }
  const downloadLink = (dataUrl: string) => {
    const a = document.createElement('a')

    a.setAttribute('download', `reactflow.${format}`)
    a.setAttribute('href', dataUrl)
    a.click()
  }

  converter(
    document.querySelector('.react-flow__viewport') as HTMLElement,
    options
  ).then(downloadLink)
}
