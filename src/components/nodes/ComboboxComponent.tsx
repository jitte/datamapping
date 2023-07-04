import { useState, useContext, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ReactCountryFlag } from 'react-country-flag'
import { countryInfo, countryList } from '../../constants'
import { GlobalContext } from '../../contexts';

type ComboboxType = {
  name: string,
  caption: string,
  data: any,
}

export default function ComboboxComponent( { name, caption, data }: ComboboxType): JSX.Element {
  //  選択されたアイテム
  const [selectedItem, setSelectedItem] = useState(data[name] ?? '')
  // global context
  const { setProjectUpdated } = useContext(GlobalContext)
  // 入力欄の検索テキスト
  const [query, setQuery] = useState('')
  // 検索テキストにマッチするアイテム（小文字でフィルタ）
  const filteredList = query === ''
    ? countryList
    : countryList.filter((item) => {
      const itemLong = `${item}: ${countryInfo[item]['name']}`.toLowerCase()
      return itemLong.includes(query.toLowerCase())
    })
  // 変更された値を処理するイベントハンドラ
  function handleCombobox(value: string) {
    if (data[name] !== value) {
      data[name] = value
      setSelectedItem(value)
      setProjectUpdated(true)
      console.log('at: handleCombobox', { value , data })
    }
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
    <div className="flex flex-col w-full px-5 py-2 mt-1 bg-gray-50">
      <div className="text-xs">
        {caption}
      </div>
      <div className="mt-2">
        <Combobox name={name} value={selectedItem} onChange={handleCombobox}>
          {({ open }) => (
            <div className="relative">
              <div className="flex flex-row items-center w-full overflow-hidden text-left bg-white rounded-lg shadow cursor-default">
                { !open && selectedItem !== '' &&
                  <ReactCountryFlag svg countryCode={selectedItem} className="absolute border left-3" style={{ width: '20px', height: '15px' }} />
                }
                <Combobox.Input
                  className="w-full py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 border-none rounded-lg nodrag"
                  placeholder="Choose an option"
                  displayValue={() => (countryInfo[selectedItem] ?? [])['name']}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="w-5 h-5" aria-hidden="true" />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg nowheel max-h-60">
                  {filteredList.length === 0 && query !== '' ? (
                    <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
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
                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
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