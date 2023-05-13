import { useState, useRef, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export default function DataFlowComponent(
  {name, id}: {name: string, id: string}
): JSX.Element {
  const sourceId = 'source_' + name.toLowerCase().replace(/ /g, '_');
  const targetId = 'target_' + name.toLowerCase().replace(/ /g, '_');

  // set Handle position according to this component
  const ref : React.MutableRefObject<any> = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [position, setPosition] = useState(0);

  // step1: calculate offset from ref
  useEffect(() => {
    if (ref.current && ref.current.offsetTop && ref.current.clientHeight) {
      setPosition(ref.current.offsetTop + ref.current.clientHeight / 2);
      updateNodeInternals(id);
    }
  }, [ref, updateNodeInternals]);

  // step2: then propagate position
  useEffect(() => {
    updateNodeInternals(id);
  }, [position, updateNodeInternals]);

  return (
    <div
      ref={ref}
      className="flex bg-gray-50 mt-1 px-5 py-2">
      <div className="w-full text-center">
        {name}
      </div>
      <Handle
        id={targetId}
        className="w-3 h-3 -ml-0.5 rounded-full border-2 border-black bg-white"
        type="target"
        position={Position.Left}
        style={{top: position}} />
      <Handle
        id={sourceId}
        className="w-3 h-3 -mr-0.5 rounded-full border-2 border-black bg-white"
        type="source"
        position={Position.Right}
        style={{top: position}} />
    </div>
  );
};