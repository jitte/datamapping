import { useState, ChangeEventHandler } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';


export function ComboboxComponent(
  { name, caption, itemList, onChange }: { name: string; caption: string; itemList: string[]; onChange: ChangeEventHandler; }
): JSX.Element {
  //  選択されたアイテム
  const [selectedItem, setSelectedItem] = useState(itemList[0]);
  // 入力欄の検索テキスト
  const [query, setQuery] = useState('');
  // 検索テキストにマッチするアイテム（小文字でフィルタ）
  const filteredList = query === ''
    ? itemList
    : itemList.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <div className="w-full flex flex-wrap justify-between items-center bg-gray-50 mt-1 px-5 py-2">
      <div className="text-sm w-full ">
        {caption}
      </div>
      <div className="mt-2 w-full text-gray-500 nodrag">
        <Combobox name={name} value={selectedItem} onChange={setSelectedItem}>
          <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
          <Combobox.Options>
            {filteredList.map((item) => (
              <Combobox.Option
                key={item}
                value={item}
                className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
              >
                <CheckIcon className="hidden ui-selected:block" />
                {item}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </div>
  );
}
