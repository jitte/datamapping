import React, { useState, useContext } from 'react'
import { Panel, Node } from 'reactflow'
import { Menu, Combobox } from '@headlessui/react'
import { PlusIcon, MagnifyingGlassIcon, Bars2Icon } from '@heroicons/react/24/outline'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { GlobalContext } from '../contexts'
import { DataFlowContext } from '../contexts/dataFlowContext'
import { useLocalStore, allNodes } from '../lib/store'
import { nodeInfo } from '../constants'

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
    <Menu as="div" className="w-full text-left">
      <Menu.Button onClick={
        () => setEntityMenuOpen(!entityMenuOpen)
      }
      className="inline-flex w-full gap-2 p-2 text-sm font-medium bg-white rounded-md hover:text-white hover:bg-blue-500">
        <IconElement className="w-5 h-5" />
        {name}
      </Menu.Button>
      { entityMenuOpen ?
        <Menu.Items static className="absolute mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="m-1 text-xs text-gray-500">
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
    return { name: nodeInfo[type].title, type }
  })

  return (
    <DraggableMenu
      name="New"
      icon={PlusIcon}
      items={items}
    />
  )
}

function ReuseMenu() {
  // imports from global context
  const { entityMenuOpen, setEntityMenuOpen, currentProject } =
    useContext(GlobalContext)

  // imports from dataflow context
  const { setNodes } = useContext(DataFlowContext)

  // all projects and nodes that has own entity name
  const projects = useLocalStore((state) => state.projects)
  const nodes = allNodes(projects).filter(
    (node) =>
      (node.data.entity_name ?? '').length > 0 &&
      !currentProject.nodes.find((nd) => nd.id === node.id)
  )

  // current option for combobox
  const [selectedNode, setSelectedNode] = useState(nodes[0])

  // current query
  const [query, setQuery] = useState('')

  // all nodes that includes current query
  const filteredNode =
    query === ''
      ? nodes
      : nodes.filter((node) => {
          return node.data.entity_name
            .toLowerCase()
            .includes(query.toLowerCase())
        })
  console.log('at: ReuseMenu', { selectedNode, query })

  function handleClick(node: Node) {
    setNodes((nds) => nds.concat(node))
  }
  function entityMenuClose() {
    if (entityMenuOpen) setEntityMenuOpen(false)
  }
  return (
    <Combobox value={selectedNode} onChange={setSelectedNode}>
      <div className="relative">
        <div className="flex flex-row items-center">
          <MagnifyingGlassIcon className="absolute w-5 h-5 left-3" />
          <Combobox.Input
            className="px-10 text-sm border-none rounded-md"
            onChange={(event) => {
              setQuery(event.target.value)
              entityMenuClose()
            }}
            placeholder="Search Entity"
            /*displayValue={(node: Node) => node.data.entity_name}*/
          />
          <Combobox.Button
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            onClick={entityMenuClose}
          >
            <ChevronUpDownIcon className="w-5 h-5" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg nowheel max-h-60">
          {filteredNode.length === 0 ? (
            <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
              Nothing found.
            </div>
          ) : (
            <>
              <div className="m-1 text-xs text-gray-500">
                Click item to reuse entity
              </div>
              {filteredNode.map((node: Node) => (
                <Combobox.Option key={node.id} value={node}>
                  {({ active }) => (
                    <button
                      onClick={() => handleClick(node)}
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      }
                      flex flex-row gap-2 text-left w-full rounded-md px-2 py-2 text-sm
                      cursor-grab active:cursor-grabbing`}
                    >
                      {node.data.entity_name}
                    </button>
                  )}
                </Combobox.Option>
              ))}
            </>
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
        <div className="inline-flex items-center text-sm font-medium bg-white rounded-md shadow-md">
          <EntityMenu />
        </div>
        <div className="inline-flex items-center text-sm font-medium bg-white rounded-md shadow-md">
          <ReuseMenu />
        </div>
      </div>
    </Panel>
  )
}