import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import Icon from './Icon';

const handleStyle = { left: 10 };

function PiiSubjectNode({ data, isConnectable }: any): any {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="border border-black rounded p-1">
      <div className="flex items-center">
        <Icon name="pii_subject" />
        <div className="text-sm">PII Subject</div>
        <div className="flex-grow" />
        <Icon name="delete_button" />
      </div>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

export default PiiSubjectNode;
