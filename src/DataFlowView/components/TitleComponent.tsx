import { useContext } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { DataFlowContext } from '../dataFlowContext';
import { nodeTitles } from './CustomNodes';

import Icon from '../../Icon';

export default function TitleComponent(
  { nodeType, description, nodeId } : { nodeType: string, description: string, nodeId: string }
) : JSX.Element {

  // グローバルコンテキストで作成した削除関数を使う
  const { deleteNode } = useContext(DataFlowContext);
  return (
    <>
      <div className="flex flexitems-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name={nodeType} />
        <div className="text-lg">{nodeTitles[nodeType]}</div>
        <button onClick={() => deleteNode(nodeId)}>
          <TrashIcon className="h-4 w-4" style={{color: '#777'}} />
        </button>
      </div>
      <div className="text-gray-500 px-5 py-2 text-xs">
        {description}
      </div>
    </>
  );
};