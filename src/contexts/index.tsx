import { useState, createContext, ReactNode } from "react"

// Context Types
type GlobalContextType = {
  showProjects: boolean,
  setShowProjects: React.Dispatch<React.SetStateAction<boolean>>,
  showEntities: boolean,
  setShowEntities: React.Dispatch<React.SetStateAction<boolean>>,
}
type PopUpContextType = {
	openPopUp: (popUpElement: JSX.Element) => void;
	closePopUp: () => void;
}

// Contexts
export const GlobalContext = createContext<GlobalContextType>({
  showProjects: false,
  setShowProjects: () => {},
  showEntities: false,
  setShowEntities: () => {},
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