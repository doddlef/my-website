import {
    createContext,
    useContext
} from "react";

export type FolderLabel = {
    id: number;
    name: string;
    folderId: number | null;
    children?: number[];
};

// Context value type
type FolderTreeContextValue = {
    getLabel: (id: number) => Promise<FolderLabel | null>;
    getPath: (id: number) => Promise<FolderLabel[]>;
    refresh: () => Promise<void>;
    cache: Map<number, FolderLabel>;
    update: (id: number, changes: Partial<FolderLabel>) => void;
};

// Create context
export const FolderTreeContext = createContext<FolderTreeContextValue | null>(null);

// Hook to use it
export const useFolderTree = () => {
    const ctx = useContext(FolderTreeContext);
    if (!ctx) throw new Error("useFolderTree must be used inside FolderTreeProvider");
    return ctx;
};


export default useFolderTree;