import { useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { countries } from 'countries-list'
import { ReactCountryFlag } from 'react-country-flag'

const countryInfo:
{ [key: string] : { name: string, emoji: string } } = {
  EU: { name: 'European Union', emoji: String.fromCodePoint(0x1F1EA, 0x1F1FA) },
  ...countries
}
export const countryList = Object.keys(countryInfo).sort()

type ComboboxType = {
  name: string,
  caption: string,
  itemList: string[],
  data: any,
};

export default function ComboboxComponent( { name, caption, itemList, data }: ComboboxType): JSX.Element {
  //  選択されたアイテム
  const [selectedItem, setSelectedItem] = useState(data[name] ?? '');
  // 入力欄の検索テキスト
  const [query, setQuery] = useState('');
  // 検索テキストにマッチするアイテム（小文字でフィルタ）
  const filteredList = query === ''
    ? itemList
    : itemList.filter((item) => {
      const itemLong = `${item}: ${countryInfo[item]['name']}`.toLowerCase()
      return itemLong.includes(query.toLowerCase());
    });
  // 変更された値を処理するイベントハンドラ
  function handleCombobox(value: string) {
    setSelectedItem(value);
    data[name] = value;
    console.log({at: 'ComboboxComponent/handleCombobox', value , data});
  }
  function flagAndCountry(countryCode: string) {
    const data = countryInfo[countryCode]
    return data == undefined ? '' : 
      <div className="flex flex-row items-center gap-2">
        <ReactCountryFlag svg countryCode={countryCode} className="border" style={{ width: '20px', height: '15px' }} />
        {data['name']}
      </div>
  }

  return (
    <div className="w-full flex flex-col bg-gray-50 mt-1 px-5 py-2">
      <div className="text-xs">
        {caption}
      </div>
      <div className="mt-2">
        <Combobox name={name} value={selectedItem} onChange={handleCombobox}>
          {({ open }) => (
            <div className="relative">
              <div className="flex flex-row items-center w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow">
                { !open && selectedItem !== '' &&
                  <ReactCountryFlag svg countryCode={selectedItem} className="absolute left-3 border" style={{ width: '20px', height: '15px' }} />
                }
                <Combobox.Input
                  className="nodrag w-full border-none py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 rounded-lg"
                  placeholder="Choose an option"
                  displayValue={() => (countryInfo[selectedItem] ?? [])['name']}
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
                          `relative cursor-default select-none py-2 pl-3 pr-10 ${
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
                              {flagAndCountry(item)}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 right-3 flex items-center pl-3 ${
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
          )}
        </Combobox>
      </div>
    </div>
  )
}