import { useState, useContext } from 'react'
import { Check, ChevronsUpDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ReactCountryFlag } from 'react-country-flag'

import { countryInfo, countryList } from '@/constants'
import { GlobalContext } from '@/contexts'
import { NodeDataType } from './types'

export function CountryCombobox({ data }: { data: NodeDataType }) {
  const countryCode =
    countryList.find(
      (cc) => countryInfo[cc]['name'] === (data.country ?? '')
    ) ?? ''
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(countryCode)

  const { setProjectUpdated } = useContext(GlobalContext)

  function flagAndCountry(value: string) {
    const data = countryInfo[value]
    return data == undefined ? (
      ''
    ) : (
      <div className="flex flex-row items-center gap-2">
        <ReactCountryFlag
          svg
          countryCode={value}
          className="border"
          style={{ width: '20px', height: '15px' }}
        />
        {data['name']}
      </div>
    )
  }

  function handleSelect(value: string) {
    const name = countryInfo[value]['name']
    if (data.country !== name) {
      data.country = name
      setValue(value)
      setProjectUpdated(true)
      setOpen(false)
      console.log('at: handleSelect', { value, data })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="flex flex-row items-center gap-1">
          {value ? (
            <ReactCountryFlag
              svg
              countryCode={value}
              className="border-2"
              style={{ width: '32px', height: '24px' }}
            />
          ) : (
            <Globe className="w-5 h-5" />
          )}
          <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No such country.</CommandEmpty>
          <CommandGroup>
            {countryList.map((cc) => (
              <CommandItem key={cc} onSelect={() => handleSelect(cc)}>
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === cc ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {flagAndCountry(cc)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
