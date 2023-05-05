import Icon from '../Icon'

export default function SideBarComponent() {
  function EntityItem({text} : any) : JSX.Element {
    const name = text.toLowerCase().replace(/ /g, '_');
    return (
      <div className="flex border border-solid border-black rounded-lg border-l-4 p-1 m-1 items-center gap-2" id={name}>
        <Icon name={name} />
        <div className="text-sm">{text}</div>
        <div className="flex-grow" />
        <Icon name="drag_handle" />
      </div>
    );
  }
  return (
    <nav className="w-52 h-full flex flex-col border-r" >
      <span className="text-center">Entities</span>
      <EntityItem text="PII Subject" />
      <EntityItem text="PII Controller" />
      <EntityItem text="PII Processor" />
      <EntityItem text="Third Party" />
    </nav>
  );
};