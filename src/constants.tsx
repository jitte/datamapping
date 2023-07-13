import {
  UsersIcon,
  CogIcon,
  CpuChipIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';


import {
  GenericNode,
  PiiSubjectNode,
  PiiControllerNode,
  PiiProcessorNode,
  ThirdPartyNode,
} from './components/nodes'
import { NodeParamType } from './components/nodes/types';

export const nodeTypes: {
  [key: string]: (param: NodeParamType) => JSX.Element
} = {
  genericNode: GenericNode,
  piiSubject: PiiSubjectNode,
  piiController: PiiControllerNode,
  piiProcessor: PiiProcessorNode,
  thirdParty: ThirdPartyNode,
}

type nodeInfoType = {
  title: string
  icon: any
	from: string
	to: string
}

export const nodeInfo: { [key: string]: nodeInfoType } = {
  genericNode: {
    title: 'Generic Node',
    icon: UsersIcon,
    from: 'from-rose-600',
    to: 'to-purple-600',
  },
  piiSubject: {
    title: 'PII Subject',
    icon: UsersIcon,
    from: 'from-rose-600',
    to: 'to-purple-600',
  },
  piiController: {
    title: 'PII Controller',
    icon: CogIcon,
    from: 'from-orange-600',
    to: 'to-yellow-600',
  },
  piiProcessor: {
    title: 'PII Processor',
    icon: CpuChipIcon,
    from: 'from-lime-600',
    to: 'to-teal-600',
  },
  thirdParty: {
    title: 'Third Party',
    icon: DocumentDuplicateIcon,
    from: 'from-blue-600',
    to: 'to-cyan-600',
  },
}

export function initialProject(id: number) {
	const node1 = `pj_${id}_node_1`
	const node2 = `pj_${id}_node_2`
	const node3 = `pj_${id}_node_3`
	const node4 = `pj_${id}_node_4`
	return (
		{
			id: id ,
			name: 'New Project',
			description: '',
			nodes:  [
				{ id: node1, type: 'piiSubject'   , position: { x:  50, y: 250}, data: {}},
				{ id: node2, type: 'piiController', position: { x: 450, y:  50}, data: {}},
				{ id: node3, type: 'piiProcessor' , position: { x: 850, y:  50}, data: {}},
				{ id: node4, type: 'thirdParty'   , position: { x: 450, y: 450}, data: {}},
			],
			edges: [
				{ id: `pj_${id}_edge_1-2`,
					source: node1, sourceHandle: 'source_pii_flow',
					target: node2, targetHandle: 'target_pii_flow',
				},
				{ id: `pj_${id}_edge_2-3`,
					source: node2, sourceHandle: 'source_pii_flow',
					target: node3, targetHandle: 'target_pii_flow',
				},
				{ id: `pj_${id}_edge_1-4`,
					source: node1, sourceHandle: 'source_non_pii_flow',
					target: node4, targetHandle: 'target_non_pii_flow',
				},
			]
		}
	)
}