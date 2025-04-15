import {ItemLabel, ItemView} from "../../definations.ts";
import {createContext, useContext} from "react";

interface ContentCacheType {
    getPath: (id: number) => Promise<ItemLabel[]>;
    getLabel: (id: number) => Promise<ItemLabel | null>;
    cachePutLabel: (label: ItemLabel) => void;
    cachePutItem: (item: ItemView) => void;
}

export const ContentCache = createContext<ContentCacheType | undefined>(undefined);

export const useContentCache = () => {
    const context = useContext(ContentCache);

    if (!context) {
        throw new Error("useDriverCache must be used within DriverCache");
    }

    return context;
}