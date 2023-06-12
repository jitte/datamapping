/*
import { useContext } from "react"
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline"
import Icon from '../Icon'
import { nodeTitles } from './CustomNodes'
import { GlobalContext, PopUpContext } from '../contexts'
import ImportModal from '../modals/importModal'
import ExportModal from '../modals/exportModal'

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
  )
}

function OldSideBarComponent() {
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
  )
}

export default function SideBarComponent() {
  const { setCurrentMenu } = useContext(GlobalContext)

  function SidebarItem({ icon=ListBulletIcon, label='', onClick, children}): JSX.Element {
    const IconElement = icon
    return (
      <button onClick={onClick} className="flex flex-row items-center justify-between p-2 gap-2 w-full">
        <IconElement className="w-5 h-5" style={{color: '#777'}} />
        {children}
        <div className="grow" />
        {label === '' ? '' :
          <div className="bg-blue-300 text-blue-900 text-sm rounded-lg px-1">{label}</div>
        }
      </button>
    )
  }
  return (
    <div className="w-fit justify-stretch bg-gray-50 p-2">
      <SidebarItem
        onClick={() => setCurrentMenu('Projects')}
        label="n/a">
        Dashboard
      </SidebarItem>
      <SidebarItem
        onClick={() => setCurrentMenu('Projects')}
        label="n/a">
        Assets
      </SidebarItem>
      <SidebarItem
        onClick={() => setCurrentMenu('Projects')}
        label="n/a">
        Storages
      </SidebarItem>
      <SidebarItem
        onClick={() => setCurrentMenu('Projects')}
        label="n/a">
        Entities
      </SidebarItem>
      <SidebarItem
        onClick={() => setCurrentMenu('Projects')}
        label="n/a">
        Projects
      </SidebarItem>
      <SidebarItem
        onClick={() => setCurrentMenu('Data Flow')} >
        Data Flow
      </SidebarItem>
      <SidebarItem
        onClick={() => setCurrentMenu('Data Flow')}
        label="n/a">
        Risks
      </SidebarItem>
    </div>
  )
}
*/