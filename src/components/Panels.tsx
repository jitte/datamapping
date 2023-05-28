import React, { useState, useContext } from 'react'
import { Panel } from 'reactflow'
import { Listbox, Menu } from '@headlessui/react'
import { PlusIcon, CogIcon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ProjectModal } from '../modals/projectsModal'
import { PopUpContext } from '../contexts'
import { useLocalStore } from '../store'

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

function GenericMenu({ name, icon, items}: { name: string, icon: React.ElementType, items: any[] }) {
  const IconElement = icon
  function MenuItem({ name, onClick }: { name: string, onClick: any }) {
    return (
      <Menu.Item>
        {({ active }) => (
          <button
            className={
              `${active ? 'bg-blue-500 text-white' : 'text-gray-900'}
              text-left w-full rounded-md px-2 py-2 text-sm`
            }
            onClick={onClick}
          >
            {name}
          </button>
        )}
      </Menu.Item>
    )
  }
  return (
    <Menu as="div" className="text-left w-full">
      <Menu.Button className="
        inline-flex
        w-full
        rounded-md
        p-2
        gap-2
        text-sm
        font-medium
        bg-white
        hover:text-white
        hover:bg-blue-500
      ">
        <IconElement className="h-5 w-5" />
        {name}
      </Menu.Button>
      <Menu.Items className="
        absolute mt-2
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
        {items.map((item) => (
          <MenuItem name={item.name} key={item.name} onClick={item.onClick} />
        ))}
      </Menu.Items>
    </Menu>
  )
}

function ConfigMenu() {
	const { openPopUp, closePopUp } = useContext(PopUpContext)
  const localStore = useLocalStore()
	//const projects  = useLocalStore((state) => state.projects)
	//const setProjects = useLocalStore((state) => state.setProjects)
	//const newProjectId = useLocalStore((state) => state.newProjectId)

  const items = [
    { name: 'Projects', onClick: () => ProjectModal(openPopUp, closePopUp, localStore ) },
    { name: 'Entities', onClick: () => {} },
  ]
  return (
    <GenericMenu
      name="Config"
      icon={CogIcon}
      items={items}
    />
  )
}

function EntityMenu() {
  const items = [
    { name: 'PII Subject', onClick: () => {} },
    { name: 'PII Controller', onClick: () => {} },
    { name: 'PII Processor', onClick: () => {} },
    { name: 'Third Party', onClick: () => {} },
  ]
  return (
    <GenericMenu
      name="Entity"
      icon={PlusIcon}
      items={items}
    />
  )
}

export function TopLeftPanel() {
  return (
    <Panel position='top-left'>
      <div className="flex flex-row items-center gap-2">
        <ProjectList />
        <div className="w-32 rounded-md shadow-md text-sm font-medium bg-white inline-flex items-center">
          <EntityMenu />
        </div>
      </div>
    </Panel>
  )
}

export function TopRightPanel() {
  return (
    <Panel position='top-right'>
      <div className="rounded-md shadow-md text-sm font-medium bg-white inline-flex items-center">
        <ConfigMenu />
      </div>
    </Panel>
  )
}