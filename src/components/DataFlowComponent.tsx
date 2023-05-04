import {
  useState,
  useRef,
  useEffect,
} from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

;

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
      <div className="text-sm w-full text-center">
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
