import {
  UsersIcon,
  CogIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  Bars2Icon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const icon_name :any = {
    'pii_subject': UsersIcon,
    'pii_controller': CogIcon,
    'pii_processor': CpuChipIcon,
    'third_party': DocumentDuplicateIcon,
    'drag_handle': Bars2Icon,
    'delete_button': TrashIcon,
};

export default function Icon({name, style={ color: '#777'}}: any): JSX.Element {
    const IconName = icon_name[name];
    return (
      <IconName width='24px' height='24px' style={style} />
    );
};