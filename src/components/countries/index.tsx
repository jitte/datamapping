import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Globe } from 'lucide-react'
import { ReactCountryFlag } from 'react-country-flag'

import { countries as originalCountries } from 'countries-list'
// add type annotation
const countries: { [key: string]: { name: string } } = {
  ...originalCountries,
  EU: { name: 'European Union' },
}

const countryData: CountryTableType[] = Object.keys(countries).map((key) => ({
  id: key,
  name: countries[key].name,
}))

import { useLocalStore } from '@/lib/store'
import { columns, CountryTableType } from './columns'
import { DataTable } from './data-table'

const CountryFlag = ({
  countryCode,
  showName = false,
}: {
  countryCode: string | undefined
  showName?: boolean
}) => {
  const data = countries[countryCode ?? '']
  const flag = countryCode ? (
    <ReactCountryFlag
      svg
      countryCode={countryCode}
      className="border-2"
      style={{ width: '32px', height: '24px' }}
    />
  ) : (
    <Globe className="w-5 h-5 mx-[6px]" />
  )
  return showName ? (
    <div className="flex flex-row items-center gap-2 text-sm">
      {flag}
      {data ? data.name : 'n/a'}
    </div>
  ) : (
    <>{flag}</>
  )
}

const CountryDialog = () => {
  const [open, setOpen] = useState(false)

  const { preference, storePreference } = useLocalStore()
  const initialCountries = preference.selectedCountries ?? []

  const selection: { [key: string]: boolean } = {}
  countryData.forEach((country, index) => {
    if (initialCountries.find((id) => country.id === id)) {
      selection[index] = true
    }
  })

  const setSelection = (selection: { [key: string]: boolean }) => {
    const selectedCountries: string[] = []
    Object.keys(selection).forEach((key) => {
      if (selection[key]) selectedCountries.push(countryData[Number(key)].id)
    })
    console.log(selection, selectedCountries)
    storePreference({ ...preference, selectedCountries })
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className="w-full pl-8 py-1.5 text-left text-sm hover:bg-accent rounded-sm">
        Choose Countries...
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Countries Dialog</DialogTitle>
          <DialogDescription>Select countries for nodes.</DialogDescription>
        </DialogHeader>
        <DataTable
          columns={columns}
          data={countryData}
          selection={selection}
          setSelection={setSelection}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

export { CountryDialog, CountryFlag, countries }
