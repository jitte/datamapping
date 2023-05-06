import { useState, createContext, ReactNode } from "react";
import { ReactFlowInstance } from "reactflow";

type GlobalContextType = {
	reactFlowInstance: ReactFlowInstance|null;
	setReactFlowInstance: any;
  deleteNode: (id: string) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
	reactFlowInstance: null,
	setReactFlowInstance: () => {},
  deleteNode: () => {}
});

type PopUpContextType = {
	openPopUp: (popUpElement: JSX.Element) => void;
	closePopUp: () => void;
};

export const PopUpContext = createContext<PopUpContextType>({
  openPopUp: () => {},
  closePopUp: () => {},
});

const PopUpContextProvider = ({ children }: { children: ReactNode }) => {
  const [popUpElements, setPopUpElements] = useState<JSX.Element[]>([]);

  const openPopUp = (element: JSX.Element) => {
    setPopUpElements(prevPopUps => [element, ...prevPopUps]);
  };

  const closePopUp = () => {
    setPopUpElements(prevPopUps => prevPopUps.slice(1));
  };

  return (
    <PopUpContext.Provider value={{ openPopUp, closePopUp }}>
      {children}
      {popUpElements[0]}
    </PopUpContext.Provider>
  );
};

export function GlobalContextProvider(
	{ value, children }: { value: GlobalContextType, children: ReactNode }
): JSX.Element {
	return (
    <GlobalContext.Provider value={value}>
			<PopUpContextProvider>
				{children}
			</PopUpContextProvider>
		</GlobalContext.Provider>
	);
}