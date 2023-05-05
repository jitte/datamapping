import { useState, ChangeEventHandler, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export default function ComboboxComponent(
  { name, caption, itemList, value = "", onChange } : { name: string, caption: string, itemList: string[], value: string, onChange: ChangeEventHandler }
): JSX.Element {
  //  選択されたアイテム
  const [selectedItem, setSelectedItem] = useState(value === "" ? "Choose an option" : value);
  // 入力欄の検索テキスト
  const [query, setQuery] = useState('');
  // 検索テキストにマッチするアイテム（小文字でフィルタ）
  const filteredList = query === ''
    ? itemList
    : itemList.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <div className="w-full flex flex-col bg-gray-50 mt-1 px-5 py-2">
      <div className="text-xs">
        {caption}
      </div>
      <div className="mt-2">
        <Combobox name={name} value={selectedItem} onChange={setSelectedItem}>
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow">
              <Combobox.Input
                className="nodrag w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 rounded-lg"
                displayValue={() => selectedItem}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute nowheel mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg">
                {filteredList.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredList.map((item) => (
                    <Combobox.Option
                      key={item}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {item}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-teal-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
}