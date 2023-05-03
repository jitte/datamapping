import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import Icon from './Icon';

const handleStyle = { left: 10 };

function PiiSubjectNode({ data, isConnectable }: any): any {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-50 bg-white border border-black rounded-lg">
      <div className="flex items-center justify-between bg-gray-50 rounded-t-lg p-2">
        <Icon name="pii_subject" />
        <div className="text-sm">PII Subject</div>
        <Icon name="delete_button" style={{width: '18px', height: '18px'}}/>
      </div>
      <div className="w-full text-gray-500 px-5 pb-3 text-sm">
        Identified or identifiable natural person
      </div>
      <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 mt-1 px-5 py-2">
        <div className="text-sm truncate w-full ">
          Country
        </div>
        <div className="mt-2 w-full">
          <div className="">
            <input
              id="text"
              name="text"
              type="text"
              className="nodrag block w-full form-input rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Type a text"
              onChange={onChange} />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 dark:bg-gray-800 dark:text-white mt-1 px-5 py-2">
        <div className="text-sm truncate w-full text-end">
          PII source
          <span className="text-red-600"></span>
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 dark:bg-gray-800 dark:text-white mt-1 px-5 py-2">
        <div className="text-sm truncate w-full text-end">
          Non-PII source
          <span className="text-red-600"></span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
      <div className="h-2"  />
    </div>
  );
};

export default PiiSubjectNode;
