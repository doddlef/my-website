import {BinItemView} from "../../../definations.ts";
import {createContext, useContext} from "react";

export type RecycleBinContextType = {
    items: BinItemView[],
    removeItem: (ids: number[]) => void,
    refresh: () => void;
}

export const RecycleBinContext = createContext<RecycleBinContextType | undefined>(undefined);

const useRecycleBin = (): RecycleBinContextType => {
    const ctx = useContext(RecycleBinContext);
    if (!ctx) {
        throw new Error("useRecycleBin must be used within a RecycleBinProvider");
    }
    return ctx;
};

export default useRecycleBin;
