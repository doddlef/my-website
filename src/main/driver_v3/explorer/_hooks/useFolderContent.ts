import { createContext, useContext } from "react";
import { ItemView } from "../../definitions.ts";

export interface FolderContextType {
    currentFolder: number;

    items: ItemView[];
    files: ItemView[];
    folders: ItemView[];

    refresh: () => Promise<void>;
    loading: boolean;

    update: (id: number, change: Omit<Partial<ItemView>, "id">) => void;
    remove: (id: number) => void;
}

export const FolderContext = createContext<FolderContextType | undefined>(undefined);

const useFolderContent = (): FolderContextType => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("useFolder must be used within a FolderProvider");
    }
    return context;
};

export default useFolderContent;