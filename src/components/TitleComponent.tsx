import { useContext } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { GlobalContext } from '../Contexts';
import Icon from '../Icon';

export default function TitleComponent(
  { name, description, nodeId } : { name: string, description: string, nodeId: string }
) : JSX.Element {
  const iconName = name.toLowerCase().replace(/ /g, '_');

  // グローバルコンテキストで作成した削除関数を使う
  const { deleteNode } = useContext(GlobalContext);
  return (
    <>
      <div className="flex flexitems-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name={iconName} />
        <div className="text-lg">{name}</div>
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