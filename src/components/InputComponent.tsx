import { ChangeEventHandler } from 'react';

export default function InputComponent(
  { name, caption, onChange }: { name: string; caption: string; onChange: ChangeEventHandler; }
): JSX.Element {
  return (
    <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 mt-1 px-5 py-2">
      <div className="text-xs text-black">
        {caption}
      </div>
      <div className="mt-2 w-full">
        <input
          name={name}
          type="text"
          className="nodrag w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 rounded-lg"
          placeholder="Type a text"
          onChange={onChange} />
      </div>
    </div>
  );
};