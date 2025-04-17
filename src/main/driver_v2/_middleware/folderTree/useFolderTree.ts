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

type FolderTreeContextValue = {
    getPath: (id: number) => Promise<FolderLabel[]>;
    getLabel: (id: number) => Promise<FolderLabel | null>;
    getChildren: (id: number) => FolderLabel[];
    refresh: () => Promise<void>;
    cache: Map<number, FolderLabel>;
    mounted: boolean;

    update: (id: number, changes: Partial<FolderLabel>) => void;
    put: (label: FolderLabel) => void;
    remove: (id: number) => void;
};

export const FolderTreeContext = createContext<FolderTreeContextValue | null>(null);

export const useFolderTree = () => {
    const ctx = useContext(FolderTreeContext);
    if (!ctx) throw new Error("useFolderTree must be used inside FolderTreeProvider");
    return ctx;
};


export default useFolderTree;