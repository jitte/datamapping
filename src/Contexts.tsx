import { useState, createContext, ReactNode } from "react"
import { Node, Edge } from "reactflow"

// Data Types
type FlowType = {
  nodes: Node[],
  edges: Edge[],
}
type ProjectType = {
  id: number,
  name: string,
  description: string,
  flow: FlowType,
}

// Context Types
type GlobalContextType = {
  currentMenu: string,
  setCurrentMenu: React.Dispatch<React.SetStateAction<string>>,
  projects: ProjectType[],
  setProjects: React.Dispatch<React.SetStateAction<ProjectType>>,
}
type PopUpContextType = {
	openPopUp: (popUpElement: JSX.Element) => void;
	closePopUp: () => void;
}

// Contexts
export const GlobalContext = createContext<GlobalContextType>({
  currentMenu: '',
	setCurrentMenu: () => {},
  projects: [],
  setProjects: () => {},
})
export const PopUpContext = createContext<PopUpContextType>({
  openPopUp: () => {},
  closePopUp: () => {},
})

// Context Provider
const PopUpContextProvider = ({ children }: { children: ReactNode }) => {
  const [popUpElements, setPopUpElements] = useState<JSX.Element[]>([]);

  const openPopUp = (element: JSX.Element) => {
    setPopUpElements(prevPopUps => [element, ...prevPopUps]);
  }

  const closePopUp = () => {
    setPopUpElements(prevPopUps => prevPopUps.slice(1));
  }

  return (
    <PopUpContext.Provider value={{ openPopUp, closePopUp }}>
      {children}
      {popUpElements[0]}
    </PopUpContext.Provider>
  )
}
export function GlobalContextProvider(
	{ value, children }: { value: GlobalContextType, children: ReactNode }
): JSX.Element {
	return (
    <GlobalContext.Provider value={value}>
			<PopUpContextProvider>
				{children}
			</PopUpContextProvider>
		</GlobalContext.Provider>
	)
}