import {ItemView} from "../../../_lib/defitions.ts";
import {createContext, useContext} from "react";

interface SelectedContextType {
    selected: ItemView | null;
    select: (item: ItemView) => void;
    clear: () => void;
}

export const SelectedContext = createContext<SelectedContextType | undefined>(undefined);

export const useSelected = () => {

    const context = useContext(SelectedContext);

    if (!context) {
        throw new Error("useSelected must be used within a Selected context");
    }

    return context;
}