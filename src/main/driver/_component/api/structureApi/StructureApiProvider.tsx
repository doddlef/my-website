import {ReactNode, useCallback} from "react";
import {CreateFolderResult, StructureApiContext} from "./structureApiContext.ts";
import {refreshableRequest} from "../../../../../_lib/actions.ts";
import {R} from "../../../../../_lib/definitions.ts";


export default function StructureApiProvider({children} : {children: ReactNode}) {

    const createFolder = useCallback(async (folder: number, name: string) => {
        return await refreshableRequest("/api/driver/folder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({folder, name}),
        }) as CreateFolderResult;
    }, [])

    const renameItem = useCallback(async (id: number, name: string) => {
        return await refreshableRequest("/api/driver/rename", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id, name})
        }) as R;
    }, []);

    return (
        <StructureApiContext.Provider value={{ createFolder, renameItem }}>
            {children}
        </StructureApiContext.Provider>
    );
}