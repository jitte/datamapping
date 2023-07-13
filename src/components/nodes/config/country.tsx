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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ReactCountryFlag } from 'react-country-flag'
import { countries } from 'countries-list'
import { NodeConfigContext } from '../types'

export const countryInfo: { [key: string]: { name: string; emoji: string } } = {
  EU: { name: 'European Union', emoji: String.fromCodePoint(0x1f1ea, 0x1f1fa) },
  ...countries,
}

export const countryList = Object.keys(countryInfo).sort()

export function CountryFlag({
  countryCode,
}: {
  countryCode: string | undefined
}) {
  return countryCode ? (
    <ReactCountryFlag
      svg
      countryCode={countryCode}
      className="border-2"
      style={{ width: '32px', height: '24px' }}
    />
  ) : (
    <Globe className="w-5 h-5" />
  )
}

function FlagAndCountry({ countryCode }: { countryCode: string | undefined }) {
  const data = countryInfo[countryCode ?? '']
  const flag = <CountryFlag countryCode={countryCode} />

  return (
    <div className="flex flex-row items-center gap-2 text-sm">
      {flag}
      {data ? data.name : 'Unknown country'}
    </div>
  )
}

export function CountryComponent() {
  const { nodeData, setNodeData } = useContext(NodeConfigContext)
  const country = nodeData.country ?? ''
  const [open, setOpen] = useState(false)

  function handleSelect(country: string) {
    setNodeData({ ...nodeData, country })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Country</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex flex-row items-center justify-between"
          >
            <FlagAndCountry countryCode={country} />
            <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
          </Button>
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
                      country === cc ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <FlagAndCountry countryCode={cc} />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
