import { useContext } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import Icon from '../Icon'
import { nodeTitles } from '../CustomNodes';
import { PopUpContext } from '../Contexts';
import ImportModal from '../modals/importModal';
import ExportModal from '../modals/exportModal';

function EntityComponent({nodeType}: {nodeType: string}) : JSX.Element {
  const onDragStart = (event: any, type: any) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex border border-solid border-black rounded-lg border-l-4 p-1 m-1 items-center gap-2"
      onDragStart={(event) => onDragStart(event, nodeType)}
      draggable
    >
      <Icon name={nodeType} />
      <div className="text-sm">{nodeTitles[nodeType]}</div>
      <div className="flex-grow" />
      <Icon name="dragHandle" />
    </div>
  );
}

export default function SideBarComponent() {
  const { openPopUp } = useContext(PopUpContext);
  return (
    <nav className="w-52 h-full flex flex-col border-r" >
      <span className="text-center">Entities</span>
      <EntityComponent nodeType="piiSubject" />
      <EntityComponent nodeType="piiController" />
      <EntityComponent nodeType="piiProcessor" />
      <EntityComponent nodeType="thirdParty" />
      <div className="flex-grow"></div>
      <div className="flex flex-row m-2 p-2 justify-center">
        <button
          onClick={() => openPopUp(<ImportModal />)}
          className="flex items-center p-2 gap-1 text-sm text-gray-600 border-r"
        >
          Import <ArrowUpTrayIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => openPopUp(<ExportModal />)}
          className="flex items-center p-2 gap-1 text-sm text-gray-600"
        >
          Export <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}