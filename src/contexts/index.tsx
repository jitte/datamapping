import { useState, createContext, ReactNode } from 'react'
import { ProjectType } from '../modals/projectsModal';

// Context Types
type GlobalContextType = {
  currentProject: ProjectType,
  setCurrentProject: React.Dispatch<React.SetStateAction<ProjectType>>,
  projectUpdated: boolean,
  setProjectUpdated: React.Dispatch<React.SetStateAction<boolean>>,
  showProjectModal: boolean,
  setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>,
  showExportModal: boolean,
  setShowExportModal: React.Dispatch<React.SetStateAction<boolean>>,
}
type PopUpContextType = {
	openPopUp: (popUpElement: JSX.Element) => void;
	closePopUp: () => void;
}

// Contexts
export const GlobalContext = createContext<GlobalContextType>({
  currentProject: { id: 0, name: '', description: '', nodes: [], edges: [] },
  setCurrentProject: () => {},
  projectUpdated: false,
  setProjectUpdated: () => {},
  showProjectModal: false,
  setShowProjectModal: () => {},
  showExportModal: false,
  setShowExportModal: () => {},
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