import { useState } from 'react'
import { Panel } from 'reactflow'
import { Listbox, Menu } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const projects = [
  { id: 1, name: 'Project 1'},
  { id: 2, name: 'Project 2'},
  { id: 3, name: 'Project 3'},
]

function ProjectList() {
  const [selectedProject, setSelectedProject] = useState(projects[0])
  return (
    <Listbox value={selectedProject} onChange={setSelectedProject}>
      <div className="relative">
        <Listbox.Button className="
          relative w-52 cursor-default rounded-lg bg-white py-2 pl-3 pr-3
          text-left shadow-md focus:outline-none focus-visible:border-indigo-500
          focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
          focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm
        ">
          <div className="flex flex-row gap-2">
            <div className="grow">{selectedProject.name}</div>
            <ChevronUpDownIcon className="h-5 w-5" />
          </div>
        </Listbox.Button>
        <Listbox.Options className="
          absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1
          text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
        ">
          {projects.map((project) => (
            <Listbox.Option
              key={project.id}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                }`
              }
              value={project}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {project.name}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

function EntityMenu() {
  function MenuItem({ name }: { name: string }) {
    return (
      <Menu.Item>
        {({ active }) => (
          <button className={`${
            active ? 'bg-blue-500 text-white' : 'text-gray-900'
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
          >
        {name}
        </button>
        )}
      </Menu.Item>
    )
  }
  return (
    <Menu as="div" className="relative inline-block text-left shadow-md">
      <div className="relative">
        <Menu.Button className="
          inline-flex
          w-full
          justify-center
          rounded-md
          pl-2 pr-4
          py-2
          gap-2
          text-sm
          font-medium
          text-white
          bg-blue-700
          hover:bg-blue-800
        ">
          <PlusIcon className="h-5 w-5" />
          Entity
        </Menu.Button>
      </div>
      <Menu.Items className="
        absolute mt-2 w-52
        divide-y
        divide-gray-100
        rounded-md
        bg-white
        shadow-lg
        ring-1
        ring-black
        ring-opacity-5
        focus:outline-none
      ">
        <MenuItem name="PII Subject" />
        <MenuItem name="PII Controller" />
        <MenuItem name="PII Processor" />
        <MenuItem name="Third Party" />
      </Menu.Items>
    </Menu>
  )
}

export function TopLeftPanel() {
  return (
    <Panel position='top-left'>
      <div className="flex flex-row items-center gap-2">
        <ProjectList />
        <EntityMenu />
      </div>
    </Panel>
  )
}

export function TopRightPanel() {
  return (
    <Panel position='top-right'>
      Import | Export | Config | Help
    </Panel>
  )
}