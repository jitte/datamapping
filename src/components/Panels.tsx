import React, { useState, useContext } from 'react'
import { Panel, Node } from 'reactflow'
import { Menu, Listbox, Combobox } from '@headlessui/react'
import { PlusIcon, CogIcon, MagnifyingGlassIcon, Bars2Icon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { GlobalContext } from '../contexts'
import { useLocalStore, allNodes } from '../store'
import { nodeTitles } from '../constants'

function ProjectList() {
  // load projects from localStore
	const projects = useLocalStore((state) => state.projects)

  // current project from global context
  const { currentProject, setCurrentProject, setEntityMenuOpen } = useContext(GlobalContext)

  //console.log({ at: 'ProjectList', projects, currentProject })
  return (
    <Listbox value={currentProject} onChange={setCurrentProject}>
      <Listbox.Button
        onClick={()=>setEntityMenuOpen(false)}
        className="w-52 text-left py-2 px-3"
      >
        <div className="flex flex-row gap-2">
          <div className="grow">{currentProject.name}</div>
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
    </Listbox>
  )
}

function DraggableMenu({ name, icon, items }:
  { name: string, icon: React.ElementType, items: any[] })
{
  const { entityMenuOpen, setEntityMenuOpen } = useContext(GlobalContext)
  const IconElement = icon
  // Draggable menu item
  function MenuItem({ name, type }:
    { name: string,
      type: string,
    })
  {
    const onDragStart = (event: React.DragEvent, type: string) => {
      event.dataTransfer.setData('application/reactflow', type);
      event.dataTransfer.effectAllowed = 'move';
    }
    return (
      <Menu.Item>
        {({ active }) => (
          <div
            className={
              `${active ? 'bg-blue-500 text-white' : 'text-gray-900'}
              flex flex-row gap-2 text-left w-full rounded-md px-2 py-2 text-sm
              cursor-grab active:cursor-grabbing`
            }
            draggable
            onDragStart={(event) => onDragStart(event, type)}
          >
            {name}
            <div className="flex-grow" />
            <Bars2Icon className="w-5 h-5" />
          </div>
        )}
      </Menu.Item>
    )
  }
  return (
    <Menu as="div" className="text-left w-full">
      <Menu.Button onClick={
        () => setEntityMenuOpen(!entityMenuOpen)
      }
      className="
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
      { entityMenuOpen ?
        <Menu.Items static className="
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
          <div className="text-xs text-gray-500 m-1">
            Drag item to create entity
          </div>
          {items.map((item) => (
            <MenuItem name={item.name} key={item.name} type={item.type} />
          ))}
        </Menu.Items>
      : ''
      }
    </Menu>
  )
}

function EntityMenu() {
  const entityList = [
    'piiSubject',
    'piiController',
    'piiProcessor',
    'thirdParty',
  ]
  const items = entityList.map((type) => {
    return { name: nodeTitles[type], type }
  })

  return (
    <DraggableMenu
      name="New"
      icon={PlusIcon}
      items={items}
    />
  )
}

function GenericMenu({ name, icon, items }: { name: string, icon: React.ElementType, items: any[] }) {
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
  const {
    setShowProjectModal,
    setShowExportModal
  } = useContext(GlobalContext)

  const items = [
    { name: 'Projects', onClick: () => setShowProjectModal(true) },
    { name: 'Export', onClick: () => setShowExportModal(true) },
  ]
  return (
    <GenericMenu
      name="Config"
      icon={CogIcon}
      items={items}
    />
  )
}

function ReuseMenu() {
  const projects = useLocalStore((state) => state.projects)
  const { entityMenuOpen, setEntityMenuOpen } = useContext(GlobalContext)
  const nodes = allNodes(projects).filter((node)=>(node.data.entity_name ?? '').length > 0)
  const [selectedNode, setSelectedNode] = useState(nodes[0])
  const [query, setQuery] = useState('')
  const filteredNode = query === ''
    ? nodes
    : nodes.filter((node) => {
      return node.data.entity_name.toLowerCase().includes(query.toLowerCase())
    })
  console.log('at: ReuseMenu', {projects, nodes, selectedNode, query, filteredNode })

  return (
    <Combobox value={selectedNode} onChange={setSelectedNode}>
      <div className="relative">
        <div className="flex flex-row items-center">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3" />
          <Combobox.Input
            className="border-none rounded-md text-sm px-10"
            onChange={(event) => {
              setQuery(event.target.value)
              if (entityMenuOpen) setEntityMenuOpen(false)
            }}
            placeholder="Search Entity"
            /*displayValue={(node: Node) => node.data.entity_name}*/
          />
          <Combobox.Button
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            onClick={() => {if (entityMenuOpen) setEntityMenuOpen(false)}}
          >
            <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute nowheel mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg">
          <div className="text-xs text-gray-500 m-1">
            Click item to reuse entity
          </div>
          {filteredNode.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredNode.map((node: Node) => (
              <Combobox.Option key={node.id} value={node}>
                {({ active }) => (
                  <div
                    className={
                      `${active ? 'bg-blue-500 text-white' : 'text-gray-900'}
                      flex flex-row gap-2 text-left w-full rounded-md px-2 py-2 text-sm
                      cursor-grab active:cursor-grabbing`
                    }
                  >
                    {node.data.entity_name}
                  </div>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}

export function TopLeftPanel() {
  return (
    <Panel position='top-left'>
      <div className="flex flex-row items-center gap-2">
        <div className="rounded-md shadow-md text-sm font-medium bg-white inline-flex items-center">
          <EntityMenu />
        </div>
        <div className="rounded-md shadow-md text-sm font-medium bg-white inline-flex items-center">
          <ReuseMenu />
        </div>
      </div>
    </Panel>
  )
}

export function TopRightPanel() {
  return (
    <Panel position='top-right'>
      <div className="flex flox-row gap-2">
        <div className="
          relative cursor-default rounded-lg bg-white
          shadow-md focus:outline-none focus-visible:border-indigo-500
          focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
          focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm
        ">
          <ProjectList />
        </div>
        <div className="rounded-md shadow-md text-sm font-medium bg-white inline-flex items-center">
          <ConfigMenu />
        </div>
      </div>
    </Panel>
  )
}