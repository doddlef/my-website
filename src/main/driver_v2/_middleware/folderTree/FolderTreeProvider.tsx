import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {useDriverInfo} from "../../_lib/driverInfo/DriverInfoContext.ts";
import {R} from "../../../../_lib/definitions.ts";
import {refreshableRequest} from "../../../../_lib/actions.ts";
import {itemApi} from "../../_api/CoreApi.ts";
import {FolderTreeContext} from "./useFolderTree.ts";

export type FolderLabel = {
    id: number;
    name: string;
    folderId: number | null;
    children?: number[];
};

type FolderStructure = {
    [folderId: string]: FolderLabel;
};

type AllFolderResult = R & {
    fields?: {
        structure: FolderStructure;
    };
};

// API call to get all folders
const allFolderApi = async () => {
    return await refreshableRequest("/api/driver/all/folder", {method: 'GET'}) as AllFolderResult;
};

export default function FolderTreeProvider({children}: {children: React.ReactNode}) {
    const {rootFolder} = useDriverInfo().info;
    const cache = useRef(new Map<number, FolderLabel>());

    const forceUpdate = useState(0)[1];

    const cachePut = useCallback((label: FolderLabel, map: Map<number, FolderLabel>) => {
        map.set(label.id, {
            ...label,
            name: label.id === rootFolder ? "My Driver" : label.name,
        });
    }, [rootFolder]);

    const refresh = useCallback(() => {
        allFolderApi()
            .then(r => {
                if (r.code === 0 && r.fields?.structure) {
                    const newCache = new Map<number, FolderLabel>();
                    Object.values(r.fields.structure).forEach(label => {
                        cachePut(label, newCache);
                    });
                    cache.current = newCache;
                    forceUpdate(n => n + 1);
                } else {
                    console.error(r.message);
                }
            })
            .catch(console.error);
    }, [cachePut, forceUpdate]);

    const getLabel = useCallback(async (id: number): Promise<FolderLabel | null> => {
        if (!id) return null;
        if (cache.current.has(id)) return cache.current.get(id) ?? null;

        const result = await itemApi(id);
        if (result.code === 0) {
            const item = result.fields.item;
            const label: FolderLabel = {
                id: item.id,
                name: item.id === rootFolder ? "My Driver" : item.name,
                folderId: item.folderId,
                children: [],
            };
            cache.current.set(label.id, label);
            return label;
        }
        return null;
    }, [rootFolder]);

    const getPath = useCallback(async (id: number): Promise<FolderLabel[]> => {
        const path: FolderLabel[] = [];
        const MAX_DEPTH = 50;

        let current: FolderLabel | null = await getLabel(id);
        for (let depth = 0; current && depth < MAX_DEPTH; depth++) {
            path.unshift(current);
            if (current.folderId === null) break;

            if (!cache.current.has(current.folderId)) {
                const parent = await getLabel(current.folderId);
                if (!parent) break;
            }

            current = cache.current.get(current.folderId) ?? null;
        }

        return path;
    }, [getLabel]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <FolderTreeContext.Provider value={{getPath, getLabel, refresh, cache: cache.current}}>
            {children}
        </FolderTreeContext.Provider>
    );
}