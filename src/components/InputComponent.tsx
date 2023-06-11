import { useState, useContext } from 'react';
import { GlobalContext } from '../contexts';

type InputType = {
  name: string,
  caption: string,
  data: any,
};

export default function InputComponent( { name, caption, data }: InputType): JSX.Element {
  const [text, setText] = useState(data[name] ?? '');
  const { setProjectUpdated } = useContext(GlobalContext)

  // 変更された値を処理するイベントハンドラ
  function handleInput(event: any) {
    setText(event.target.value)
    data[name] = event.target.value
    setProjectUpdated(true)
    console.log('at: handleInput', { event, data })
  }

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
          value={text}
          onChange={handleInput} />
      </div>
    </div>
  );
};