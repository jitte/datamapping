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
