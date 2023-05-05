import { useCallback, } from 'react';
import TitleComponent from "./components/TitleComponent";
import InputComponent from "./components/InputComponent";
import ComboboxComponent from "./components/ComboboxComponent";
import DataFlowComponent from './components/DataFlowComponent';

const countryList = [
  "Japan", "USA", "EU", "China", "Singapore", "India", "Other"
];

export function PiiSubjectNode(
  { data } : {data: any}
) : JSX.Element {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        name="PII Subject"
        description="Identified or identifiable natural person" />
      <div className="w-full pb-2">
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} onChange={onChange} />
        <DataFlowComponent name="PII flow" data={data} />
        <DataFlowComponent name="Non PII flow" data={data} />
      </div>
    </div>
  );
};

export function PiiControllerNode(
  { data } : {data: any}
) : JSX.Element {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        name="PII Controller"
        description="Determines the purposes for which and the means by which personal data is processed" />
      <div className="pb-2">
        <InputComponent name="entity_name" caption="Entity Name" onChange={onChange} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} onChange={onChange} />
        <DataFlowComponent name="PII flow" data={data} />
        <DataFlowComponent name="Non PII flow" data={data} />
      </div>
    </div>
  );
};

export function PiiProcessorNode(
  { data } : {data: any}
) : JSX.Element {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        name="PII Processor"
        description="Processes personal data only on behalf of the controller" />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" onChange={onChange} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} onChange={onChange} />
        <DataFlowComponent name="PII flow" data={data} />
        <DataFlowComponent name="Non PII flow" data={data} />
      </div>
    </div>
  );
};

export function ThirdPartyNode(
  { data } : {data: any}
) : JSX.Element {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-80 bg-white border border-black rounded-lg">
      <TitleComponent
        name="Third Party" description="Entity other than PII controller or PII processor" />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" onChange={onChange} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} onChange={onChange} />
        <DataFlowComponent name="PII flow" data={data} />
        <DataFlowComponent name="Non PII flow" data={data} />
      </div>
    </div>
  );
};