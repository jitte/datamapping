import { createContext } from "react";
import { ReactFlowInstance } from "reactflow";

// コンテキストとして共有する変数の型を宣言
type GlobalContextType = {
	reactFlowInstance: ReactFlowInstance|null;
	setReactFlowInstance: any;
  deleteNode: (id: string) => void;
}

// コンテキストの初期値（ダミー）
const initialValue : GlobalContextType = {
	reactFlowInstance: null,
	setReactFlowInstance: () => {},
  deleteNode: () => {}
};

// コンテキストを参照させる
export const GlobalContext = createContext<GlobalContextType>(initialValue);