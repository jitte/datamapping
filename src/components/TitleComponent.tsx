import Icon from '../Icon';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function TitleComponent(
  { name, description }: { name: string; description: string; }
): JSX.Element {
  const iconName = name.toLowerCase().replace(/ /g, '_');
  return (
    <>
      <div className="flex flexitems-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name={iconName} />
        <div className="text-lg">{name}</div>
        <TrashIcon className="h-4 w-4" style={{color: '#777'}} />
      </div>
      <div className="text-gray-500 px-5 py-2 text-xs">
        {description}
      </div>
    </>
  );
};