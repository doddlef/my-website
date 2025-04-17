import { createContext, useContext } from "react";

interface SelectedContextType {
    selected: Set<number>;

    add: (id: number | number[]) => void;
    toggle: (id: number | number[]) => void;
    select: (id: number | number[]) => void;
    deselect: (id: number | number[]) => void;
    clear: () => void;
}

export const normalize = (id: number | number[]): number[] => Array.isArray(id) ? id : [id];

export const SelectedContext = createContext<SelectedContextType | undefined>(undefined);

export const useSelected = () => {
    const context = useContext(SelectedContext);
    if (!context) throw new Error("useSelected must be used within SelectedProvider");
    return context;
};

export default useSelected;