import Icon from '../Icon';

export default function TitleComponent(
  { name, description }: { name: string; description: string; }
): JSX.Element {
  const iconName = name.toLowerCase().replace(/ /g, '_');
  return (
    <>
      <div className="flex flexitems-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name={iconName} />
        <div className="text-lg">{name}</div>
        <Icon name="delete_button" style={{ width: '18px', height: '18px' }} />
      </div>
      <div className="text-gray-500 px-5 pb-3 text-xs">
        {description}
      </div>
    </>
  );
};