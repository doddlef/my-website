import {createContext, useContext} from "react";
import {R} from "../../../../../_lib/definitions.ts";

export type CreateFolderResult = R & {
    fields?: {
        id: number;
    }
}

interface StructureApi {
    createFolder: (folder: number, name: string) => Promise<CreateFolderResult>;
}

export const StructureApiContext = createContext<StructureApi | undefined>(undefined);

export const useStructureApi = () =>{
    const context = useContext(StructureApiContext);

    if (!context) {
        throw new Error("useStructureApi must be used within StructureApiProvider");
    }

    return context;
}