import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow'
import './style.css'

export function DomesticEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    markerEnd,
  } = props

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return <BaseEdge path={edgePath} markerEnd={markerEnd}  />
}

export function CrossBorderEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    markerEnd,
  } = props

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return <BaseEdge path={edgePath} markerEnd={markerEnd}  />
}
