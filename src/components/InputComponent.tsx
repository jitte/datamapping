import { ChangeEventHandler } from 'react';


export function InputComponent(
  { name, caption, onChange }: { name: string; caption: string; onChange: ChangeEventHandler; }
): JSX.Element {
  return (
    <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 mt-1 px-5 py-2">
      <div className="text-sm w-full ">
        {caption}
      </div>
      <div className="mt-2 w-full">
        <input
          name={name}
          type="text"
          className="nodrag block w-full form-input rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Type a text"
          onChange={onChange} />
      </div>
    </div>
  );
}
;
