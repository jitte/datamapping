import {
  useState,
  useRef,
  useEffect,
  ChangeEventHandler,
} from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import Icon from './Icon';

export function TitleComponent(
  {nodeName, description} : {nodeName: string, description: string}
) : JSX.Element {
  const iconName = nodeName.toLowerCase().replace(/ /g, '_');
  return (
    <>
      <div className="flex items-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name={iconName} />
        <div className="text-sm">{nodeName}</div>
        <Icon name="delete_button" style={{width: '18px', height: '18px'}}/>
      </div>
      <div className="w-full text-gray-500 px-5 pb-3 text-sm">
        {description}
      </div>
    </>
  );
};

export function InputComponent(
  {name, caption, onChange} : {name: string, caption: string, onChange: ChangeEventHandler}
) : JSX.Element {
  return (
    <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 mt-1 px-5 py-2">
      <div className="text-sm truncate w-full ">
        {caption}
      </div>
      <div className="mt-2 w-full">
        <div className="">
          <input
            name={name}
            type="text"
            className="nodrag block w-full form-input rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Type a text"
            onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

export function DataFlowComponent(
  {name, data}: {name: string, data: any}
): JSX.Element {
  const sourceId = 'source_' + name.toLowerCase().replace(/ /g, '_');
  const targetId = 'target_' + name.toLowerCase().replace(/ /g, '_');

  // set Handle position according to this component
  const ref : React.MutableRefObject<any> = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [position, setPosition] = useState(0);
  useEffect(() => {
    if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
      setPosition(ref.current.offsetTop + ref.current.clientHeight / 2);
      updateNodeInternals(data.id);
    }
  }, [data.id, ref, updateNodeInternals]);
  useEffect(() => {
    updateNodeInternals(data.id);
  }, [data.id, position, updateNodeInternals]);

  return (
    <div
      ref={ref}
      className="w-full flex flex-wrap justify-between items-center bg-gray-50 dark:bg-gray-800 dark:text-white mt-1 px-5 py-2">
      <div className="text-sm truncate w-full text-center">
        {name}
      </div>
      <Handle
        id={sourceId}
        className="w-3 h-3 -ml-0.5 rounded-full border-2 border-black bg-white"
        type="source"
        position={Position.Left}
        style={{top: position}} />
      <Handle
        id={targetId}
        className="w-3 h-3 -mr-0.5 rounded-full border-2 border-black bg-white"
        type="target"
        position={Position.Right}
        style={{top: position}} />
    </div>
  );
};
