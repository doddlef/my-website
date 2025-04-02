import {createContext, useContext} from "react";
import {ItemLabel, ItemView} from "../../../_lib/defitions.ts";

interface DriverCacheType {
    getPath: (id: number) => Promise<ItemLabel[]>;
    getLabel: (id: number) => Promise<ItemLabel | null>;
    getItem: (id: number) => Promise<ItemView | null>;
    cachePut: (label: ItemLabel) => void;

    refresh: () => void;
    items: ItemView[];
    currentFolder: number;
    rootFolder: number;
}

export const ContentCache = createContext<DriverCacheType | undefined>(undefined);

export const useContentCache = () => {
    const context = useContext(ContentCache);

    if (!context) {
        throw new Error("useDriverCache must be used within DriverCache");
    }

    return context;
}