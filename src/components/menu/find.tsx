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
import { useLocalStore } from '@/lib/store'
import { ProjectType } from '@/projects/types'

const FindMenu = () => {
  const { projects, preference, storePreference } = useLocalStore()

  const handleShowOnlyNamedNode = () => {
    console.log('at: FindMenu/handleShowOnlyNamedNode', preference)
    storePreference({
      ...preference,
      showOnlyNamedNode: !preference.showOnlyNamedNode,
    })
    console.log('and so?', preference)
  }

  const NodeMenubarItems = ({ project }: { project: ProjectType }) => {
    return (
      <MenubarSubContent>
        {project.nodes.map((node: Node) =>
          preference.showOnlyNamedNode ? (
            node.data.name ? (
              <MenubarItem key={node.id}>{node.data.name}</MenubarItem>
            ) : null
          ) : (
            <MenubarItem key={node.id}>
              {node.data.name ?? 'No Name'}
            </MenubarItem>
          )
        )}
      </MenubarSubContent>
    )
  }

  const ProjectMenubarSub = () => {
    return projects.map((pj) => (
      <MenubarSub key={pj.id}>
        <MenubarSubTrigger inset>{pj.name}</MenubarSubTrigger>
        <NodeMenubarItems project={pj} />
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
