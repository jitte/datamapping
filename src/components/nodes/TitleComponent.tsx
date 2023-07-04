import { useContext } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { DataFlowContext } from '../../contexts/dataFlowContext'
import { nodeInfo } from '../../constants'

export default function TitleComponent({
  nodeType,
  description,
  nodeId,
}: {
  nodeType: string
  description: string
  nodeId: string
}): JSX.Element {
  // グローバルコンテキストで作成した削除関数を使う
  const { deleteNode } = useContext(DataFlowContext)
  const info = nodeInfo[nodeType]
  const IconElement = info.icon
  return (
    <>
      <div
        className={`flex flexitems-center justify-between rounded-t-lg p-2
        text-white font-medium bg-gradient-to-br ${info.from} ${info.to}`}
      >
        <IconElement className="w-6 h-6" />
        <div className="text-lg">{info.title}</div>
        <button onClick={() => deleteNode(nodeId)}>
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="text-gray-500 px-5 py-2 text-xs">{description}</div>
    </>
  )
}
