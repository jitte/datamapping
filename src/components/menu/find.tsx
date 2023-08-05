import { useContext } from 'react'
import { Node } from 'reactflow'
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

import { useLocalStore } from '@/lib/store'
import { DataFlowContext } from '@/contexts/dataFlowContext'
import { ProjectType } from '@/components/projects/types'
import { CountryFlag } from '../nodes/config/country'

const FindMenu = () => {
  const {
    projects,
    storeProjects,
    currentProjectId,
    storeCurrentProjectId,
    preference,
    storePreference,
  } = useLocalStore()
  const { setNodes } = useContext(DataFlowContext)

  const handleShowOnlyNamedNode = () => {
    storePreference({
      ...preference,
      showOnlyNamedNode: !preference.showOnlyNamedNode,
    })
  }

  const handleClick = (project: ProjectType, node: Node) => {
    //node.selected = true
    project.nodes.map((nd: Node) => (nd.selected = nd.id === node.id))
    if (project.id !== currentProjectId) {
      storeProjects([...projects])
      storeCurrentProjectId(project.id)
    } else {
      setNodes([...project.nodes])
    }
  }

  const NodeMenubarItem = ({ node }: { node: Node }) => {
    return (
      <div className="flex flex-row items-center gap-1">
        <CountryFlag countryCode={node.data.country} />
        <Badge variant="outline">{node.data.role}</Badge>
        {node.data.name}
      </div>
    )
  }

  const NodeMenubarItems = ({ project }: { project: ProjectType }) => {
    const nodes = project.nodes.filter(
      (node) => !preference.showOnlyNamedNode || node.data.name
    )
    return (
      <MenubarSubContent>
        {nodes.length > 0 ? (
          nodes.map((node) => (
            <MenubarItem
              key={`pj_${project.id}_${node.id}`}
              onClick={() => handleClick(project, node)}
            >
              <NodeMenubarItem node={node} />
            </MenubarItem>
          ))
        ) : (
          <div className='px-2 text-sm'>Nothing to show</div>
        )}
      </MenubarSubContent>
    )
  }

  const ProjectMenubarSub = () => {
    return projects.map((project) => (
      <MenubarSub key={`pj_${project.id}`}>
        {project.id === currentProjectId ? (
          <MenubarSubTrigger>
            <Check size={16} className="mr-2" />
            {project.name}
          </MenubarSubTrigger>
        ) : (
          <MenubarSubTrigger inset>{project.name}</MenubarSubTrigger>
        )}
        <NodeMenubarItems project={project} />
      </MenubarSub>
    ))
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>Find</MenubarTrigger>
      <MenubarContent>
        <ProjectMenubarSub />
        <MenubarSeparator />
        <MenubarCheckboxItem
          onCheckedChange={handleShowOnlyNamedNode}
          checked={preference.showOnlyNamedNode}
        >
          Show Only Named Node
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  )
}

export { FindMenu }
