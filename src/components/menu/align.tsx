import { useContext } from 'react'
import { Node } from 'reactflow'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
} from 'lucide-react'
import { DataFlowContext } from '@/contexts/dataFlowContext'

const selectedNodes = (nodes: Node[]) => {
  return nodes.filter((node: Node) => node.selected)
}

const alignLeft = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const minX = Math.min(...nds.map((node: Node) => node.position.x))
  nds.forEach((node: Node) => {
    node.position.x = minX
  })
  setNode([...nodes])
}

const alignCenter = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const minX = Math.min(...nds.map((node: Node) => node.position.x))
  const maxX = Math.max(...nds.map((node: Node) => node.position.x))
  nds.forEach((node: Node) => {
    node.position.x = (minX + maxX) / 2
  })
  setNode([...nodes])
}

const alignRight = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const maxX = Math.max(...nds.map((node: Node) => node.position.x))
  nds.forEach((node: Node) => {
    node.position.x = maxX
  })
  setNode([...nodes])
}

const alignTop = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const minY = Math.min(...nds.map((node: Node) => node.position.y))
  nds.forEach((node: Node) => {
    node.position.y = minY
  })
  setNode([...nodes])
}

const alignMiddle = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const minY = Math.min(...nds.map((node: Node) => node.position.y))
  const maxY = Math.max(
    ...nds.map((node: Node) => node.position.y + (node.height ?? 0))
  )
  nds.forEach((node: Node) => {
    node.position.y = (minY + maxY - (node.height ?? 0)) / 2
  })
  setNode([...nodes])
}

const alignBottom = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const maxY = Math.max(
    ...nds.map((node: Node) => node.position.y + (node.height ?? 0))
  )
  nds.forEach((node: Node) => {
    node.position.y = maxY - (node.height ?? 0)
  })
  setNode([...nodes])
}

const justifyHorizontal = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const len = nds.length
  if (len < 2) return

  nds.sort((a, b) => a.position.x - b.position.x)
  const minX = Math.min(...nds.map((node) => node.position.x))
  const maxX = Math.max(...nds.map((node) => node.position.x))
  const step = (maxX - minX) / (len - 1)
  nds.forEach((node, i: number) => {
    node.position.x = minX + step * i
  })
  setNode([...nodes])
}

const justifyVertical = (
  nodes: Node[],
  setNode: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const nds = selectedNodes(nodes)
  const len = nds.length
  if (len < 2) return

  nds.sort((a, b) => a.position.y - b.position.y)
  const minY = Math.min(...nds.map((node) => node.position.y))
  const maxY = Math.max(
    ...nds.map((node) => node.position.y + (node.height ?? 0))
  )
  const totalHeight = nds.reduce((sum, node) => {
    return sum + (node.height ?? 0)
  }, 0)
  const step = (maxY - minY - totalHeight) / (len - 1)
  let y = minY
  nds.forEach((node) => {
    node.position.y = y
    y = y + (node.height ?? 0) + step
  })
  setNode([...nodes])
}

const AlignMenu = () => {
  const { nodes, setNodes } = useContext(DataFlowContext)
  return (
    <MenubarMenu>
      <MenubarTrigger>Align</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => alignLeft(nodes, setNodes)}>
          <AlignStartVertical size={16} className="mr-2" />
          Left
        </MenubarItem>
        <MenubarItem onClick={() => alignCenter(nodes, setNodes)}>
          <AlignCenterVertical size={16} className="mr-2" />
          Center
        </MenubarItem>
        <MenubarItem onClick={() => alignRight(nodes, setNodes)}>
          <AlignEndVertical size={16} className="mr-2" />
          Right
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => alignTop(nodes, setNodes)}>
          <AlignStartHorizontal size={16} className="mr-2" />
          Top
        </MenubarItem>
        <MenubarItem onClick={() => alignMiddle(nodes, setNodes)}>
          <AlignCenterHorizontal size={16} className="mr-2" />
          Middle
        </MenubarItem>
        <MenubarItem onClick={() => alignBottom(nodes, setNodes)}>
          <AlignEndHorizontal size={16} className="mr-2" />
          Bottom
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => justifyHorizontal(nodes, setNodes)}>
          <AlignHorizontalSpaceBetween size={16} className="mr-2" />
          Justify Horizontal
        </MenubarItem>
        <MenubarItem onClick={() => justifyVertical(nodes, setNodes)}>
          <AlignVerticalSpaceBetween size={16} className="mr-2" />
          Justify Vertical
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { AlignMenu }
