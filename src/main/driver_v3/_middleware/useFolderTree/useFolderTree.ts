import {
    createContext,
    useContext
} from "react";

// Define the FolderNode type
export type FolderNode = {
    id: number;
    name: string;
    folderId: number | null;
};

// Define the context type
export interface FolderTreeContextType {
    map: Map<number, FolderNode>;
    getNode: (id: number) => Promise<FolderNode | null>;
    getPath: (id: number) => Promise<FolderNode[]>;
    refresh: () => Promise<void>;

    /**
     * update node with given id, skip if given id not exist
     */
    update: (id: number, changes: Partial<FolderNode>) => void;

    /**
     * insert given node into map, skip if given id already exist
     * @param node
     */
    insert: (node: FolderNode) => void;

    remove: (id: number) => void;
}

// Create the context
export const FolderTreeContext = createContext<FolderTreeContextType | undefined>(undefined);

// Hook to consume the context
const useFolderTree = () => {
    const context = useContext(FolderTreeContext);
    if (!context) {
        throw new Error("useFolderTree must be used within a FolderTreeProvider");
    }
    return context;
};

export default useFolderTree;