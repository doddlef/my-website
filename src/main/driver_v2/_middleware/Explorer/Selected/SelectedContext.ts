import { createContext, useContext } from "react";
import {ItemView} from "../../../definations.ts";

export interface SelectedContextType {
    selected: ItemView[];
    firstItem: ItemView | null;
    select: (item: ItemView) => void;
    add: (item: ItemView) => void;
    deselect: (id: number) => void;
    clear: () => void;
}

export const SelectedContext = createContext<SelectedContextType | null>(null);

export const useSelected = (): SelectedContextType => {
    const ctx = useContext(SelectedContext);
    if (!ctx) {
        throw new Error("useSelected must be used within a SelectedProvider");
    }
    return ctx;
};

export default useSelected;