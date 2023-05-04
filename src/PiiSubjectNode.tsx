import {
  useCallback,
} from 'react';
import {
  TitleComponent,
  InputComponent,
  DataFlowComponent,
} from './NodeComponent'

export default function PiiSubjectNode(
  { data } : {data: any}
) : JSX.Element {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="flex flex-col w-50 bg-white border border-black rounded-lg">
      <TitleComponent nodeName="PII Subject" description="Identified or identifiable natural person" />
      <InputComponent name="entity_name" caption="Entity Name" onChange={onChange} />
      <InputComponent name="country_name" caption="Country" onChange={onChange} />
      <DataFlowComponent name="PII flow" data={data} />
      <DataFlowComponent name="Non PII flow" data={data} />
      <div className="h-2"  />
    </div>
  );
};