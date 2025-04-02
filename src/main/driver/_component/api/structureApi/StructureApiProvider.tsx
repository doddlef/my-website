import {ReactNode, useCallback} from "react";
import {CreateFolderResult, StructureApiContext} from "./structureApiContext.ts";
import {refreshableRequest} from "../../../../../_lib/actions.ts";


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

    return (
        <StructureApiContext.Provider value={{ createFolder }}>
            {children}
        </StructureApiContext.Provider>
    );
}