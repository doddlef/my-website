import {ItemView} from "../../definations.ts";
import {createContext, useContext} from "react";

interface PaginationContextType {
    currentFolder: number;
    items: ItemView[];
    refresh: () => void;
    update: (id: number, change: Partial<ItemView>) => void;
}

export const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const usePagination = () => {
    const context = useContext(PaginationContext);

    if (!context) {
        throw new Error("usePagination must be used within PaginationProvider");
    }

    return context;
}