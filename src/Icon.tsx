import {
  UsersIcon,
  CogIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  Bars2Icon,
} from '@heroicons/react/24/outline';

export default function Icon({name, style={ color: '#777'}}: any): JSX.Element {
  const iconTypes: {[key: string]: any} = {
      piiSubject: UsersIcon,
      piiController: CogIcon,
      piiProcessor: CpuChipIcon,
      thirdParty: DocumentDuplicateIcon,
      dragHandle: Bars2Icon,
  };

  const IconComponent = iconTypes[name];
  return (
    <IconComponent className="h-6 w-6" style={style} />
  );
}