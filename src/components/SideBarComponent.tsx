import { nodeTitles } from '../CustomNodes';
import Icon from '../Icon'

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
  return (
    <nav className="w-52 h-full flex flex-col border-r" >
      <span className="text-center">Entities</span>
      <EntityComponent nodeType="piiSubject" />
      <EntityComponent nodeType="piiController" />
      <EntityComponent nodeType="piiProcessor" />
      <EntityComponent nodeType="thirdParty" />
    </nav>
  );
}