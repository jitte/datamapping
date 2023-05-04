import Icon from '../Icon';


export function TitleComponent(
  { nodeName, description }: { nodeName: string; description: string; }
): JSX.Element {
  const iconName = nodeName.toLowerCase().replace(/ /g, '_');
  return (
    <>
      <div className="flex items-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name={iconName} />
        <div className="text-sm">{nodeName}</div>
        <Icon name="delete_button" style={{ width: '18px', height: '18px' }} />
      </div>
      <div className="w-full text-gray-500 px-5 pb-3 text-sm">
        {description}
      </div>
    </>
  );
}
;
