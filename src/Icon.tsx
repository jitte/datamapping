import {
  UsersIcon,
  CogIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
  Bars2Icon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const icon_svg :any = {
    'pii_subject': <UsersIcon />,
    'pii_controller': <CogIcon />,
    'pii_processor': <CpuChipIcon />,
    'third_party': <DocumentDuplicateIcon />,
    'drag_handle': <Bars2Icon />,
    'delete_button': <TrashIcon />,
};

export default function Icon({name}: any) {
    return (
      <div className="icon flex">
        {icon_svg[name]}
      </div>
    );
};