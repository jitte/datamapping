import { useState, } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css'

import SideBarComponent from './components/SideBarComponent';
import { GlobalContextProvider } from './Contexts';

import DataFlowView from './DataFlowView';

export default function App() {
  const [currentMenu, setCurrentMenu] = useState('Data Flow');

  let viewElement;

  switch (currentMenu) {
    case 'Data Flow':
      viewElement = (
        <ReactFlowProvider>
          <DataFlowView />
        </ReactFlowProvider>
      );
      break;
    default:
      console.log('n/a');
  }

  return (
    <GlobalContextProvider value={{
      currentMenu,
      setCurrentMenu,
    }} >
      <div className="flex flex-row h-screen w-screen">
        <SideBarComponent />
        <main className="flex-1 h-full">
          {viewElement}
        </main>
      </div>
    </GlobalContextProvider>
  );
}