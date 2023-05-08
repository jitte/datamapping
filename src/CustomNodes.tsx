import TitleComponent from "./components/TitleComponent";
import InputComponent from "./components/InputComponent";
import ComboboxComponent from "./components/ComboboxComponent";
import DataFlowComponent from './components/DataFlowComponent';

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

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

type NodeParamType = {
  id: string,
  data: any,
  type: string,
  selected: boolean,
}

export function PiiSubjectNode({ id, data, type, selected }: NodeParamType): JSX.Element {
  return (
    <div className={classNames(
      "flex flex-col w-80 bg-white border border-black rounded-lg",
      selected ? "border border-blue-500" : "border dark:border-gray-700"
    )}>
      <TitleComponent
        nodeType={type}
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

export function PiiControllerNode({ id, data, type, selected }: NodeParamType): JSX.Element {
  return (
    <div className={classNames(
      "flex flex-col w-80 bg-white border border-black rounded-lg",
      selected ? "border border-blue-500" : "border dark:border-gray-700"
    )}>
      <TitleComponent
        nodeType={type}
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

export function PiiProcessorNode({ id, data, type, selected }: NodeParamType): JSX.Element {
  return (
    <div className={classNames(
      "flex flex-col w-80 bg-white border border-black rounded-lg",
      selected ? "border border-blue-500" : "border dark:border-gray-700"
    )}>
      <TitleComponent
        nodeType={type}
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

export function ThirdPartyNode({ id, data, type, selected }: NodeParamType): JSX.Element {
  return (
    <div className={classNames(
      "flex flex-col w-80 bg-white border border-black rounded-lg",
      selected ? "border border-blue-500" : "border dark:border-gray-700"
    )}>
      <TitleComponent
        nodeType={type}
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