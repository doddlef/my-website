import {ItemView} from "../../../definations.ts";
import {createContext, useContext} from "react";

export type PaginationInfo = {
    hasPrevious: boolean,
    hasNext: boolean,
    pageCount: number,
}

interface PaginationContextType {
    currentFolder: number;
    page: number;
    pagination: PaginationInfo;

    items: ItemView[];
    folders: ItemView[];
    files: ItemView[];

    refresh: () => Promise<void>;
    changePage: (page: number) => void;
    loading: boolean;

    update: (id: number, change: Partial<ItemView>) => void;
    remove: (id: number) => void;
}

export const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const usePagination = () => {
    const context = useContext(PaginationContext);

    if (!context) {
        throw new Error("usePagination must be used within PaginationProvider");
    }

    return context;
}