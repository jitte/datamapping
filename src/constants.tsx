import { countries } from 'countries-list'

export const countryInfo:
{ [key: string] : { name: string, emoji: string } } = {
  EU: { name: 'European Union', emoji: String.fromCodePoint(0x1F1EA, 0x1F1FA) },
  ...countries
}
export const countryList = Object.keys(countryInfo).sort()

import {
  PiiSubjectNode,
  PiiControllerNode,
  PiiProcessorNode,
  ThirdPartyNode,
} from './components/CustomNodes'

export const nodeTypes: {[key: string]: any}= {
  piiSubject:    PiiSubjectNode,
  piiController: PiiControllerNode,
  piiProcessor:  PiiProcessorNode,
  thirdParty:    ThirdPartyNode,
}

export const nodeTitles: {[key: string]: string} = {
  piiSubject:    "PII Subject",
  piiController: "PII Controller",
  piiProcessor:  "PII Processor",
  thirdParty:    "Third Party",
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