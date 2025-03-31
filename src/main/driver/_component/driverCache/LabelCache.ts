import {createContext, useContext} from "react";
import {ItemLabel, ItemView} from "../../_lib/defitions.ts";

interface DriverCacheType {
    getPath: (id: number) => Promise<ItemLabel[]>;
    getLabel: (id: number) => Promise<ItemLabel | null>;
    getItem: (id: number) => Promise<ItemView | null>;
    getContent: (id: number) => Promise<ItemView[]>;
    rootFolder: number;
}

export const LabelCache = createContext<DriverCacheType | undefined>(undefined);

export const useLabelCache = () => {
    const context = useContext(LabelCache);

    if (!context) {
        throw new Error("useDriverCache must be used within DriverCache");
    }

    return context;
}