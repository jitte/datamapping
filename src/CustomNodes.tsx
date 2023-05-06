import TitleComponent from "./components/TitleComponent";
import InputComponent from "./components/InputComponent";
import ComboboxComponent from "./components/ComboboxComponent";
import DataFlowComponent from './components/DataFlowComponent';
import './App.css'

export const nodeTypes: {[key: string]: any}= {
  piiSubject:    PiiSubjectNode,
  piiController: PiiControllerNode,
  piiProcessor:  PiiProcessorNode,
  thirdParty:    ThirdPartyNode,
};

export const nodeTitles: {[key: string]: string} = {
  piiSubject:    "PII Subject",
  piiController: "PII Controller",
  piiProcessor:  "PII Processor",
  thirdParty:    "Third Party",
}

const countryList = [
  "Japan", "USA", "EU", "China", "Singapore", "India", "Other"
];

type NodeParamType = {
  id: string,
  data: any,
}

export function PiiSubjectNode( { id, data }: NodeParamType) : JSX.Element {
  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        nodeType="piiSubject"
        description="Identified or identifiable natural person"
        nodeId={id}
      />
      <div className="w-full pb-2">
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  );
};

export function PiiControllerNode( { id, data } : NodeParamType) : JSX.Element {
  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        nodeType="piiController"
        description="Determines the purposes for which and the means by which personal data is processed"
        nodeId={id}
      />
      <div className="pb-2">
        <InputComponent name="entity_name" caption="Entity Name" data={data} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  );
};

export function PiiProcessorNode( { id, data }: NodeParamType): JSX.Element {
  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        nodeType="piiProcessor"
        description="Processes personal data only on behalf of the controller"
        nodeId={id}
      />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" data={data} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  );
};

export function ThirdPartyNode( { id, data }: NodeParamType): JSX.Element {
  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        nodeType="thirdParty"
        description="Entity other than PII controller or PII processor"
        nodeId={id}
      />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" data={data} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} data={data} />
        <DataFlowComponent name="PII flow" id={id} />
        <DataFlowComponent name="Non PII flow" id={id} />
      </div>
    </div>
  );
};