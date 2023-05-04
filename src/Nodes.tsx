import { useCallback, } from 'react';
import { TitleComponent } from "./components/TitleComponent";
import { InputComponent } from "./components/InputComponent";
import { ComboboxComponent } from "./components/ComboboxComponent";
import { DataFlowComponent, } from './components/DataFlowComponent';

const countryList = [
  "Japan", "USA", "EU", "China", "Singapore", "India", "Other"
];

export default function PiiSubjectNode(
  { data } : {data: any}
) : JSX.Element {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-50 bg-white border border-black rounded-lg">
      <TitleComponent nodeName="PII Subject" description="Identified or identifiable natural person" />
      <div className="w-full pb-2">
        <InputComponent name="entity_name" caption="Entity Name" onChange={onChange} />
        <ComboboxComponent name="country_name" caption="Country" itemList={countryList} onChange={onChange} />
        <DataFlowComponent name="PII flow" data={data} />
        <DataFlowComponent name="Non PII flow" data={data} />
      </div>
    </div>
  );
};