import { createContext, useContext } from "react";

export interface SelectedContextType {
    selected: number[];
    select: (id: number) => void;
    add: (id: number) => void;
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