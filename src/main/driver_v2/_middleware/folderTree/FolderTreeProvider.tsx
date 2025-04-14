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
import {FolderLabel, FolderTreeContext} from "./useFolderTree.ts";

type FolderStructure = {
    [folderId: string]: FolderLabel;
};

type AllFolderResult = R & {
    fields?: {
        structure: FolderStructure;
    };
};

const allFolderApi = async () => {
    return await refreshableRequest("/api/driver/all/folder", {method: 'GET'}) as AllFolderResult;
};

export default function FolderTreeProvider({children}: {children: React.ReactNode}) {
    const {rootFolder} = useDriverInfo().info;
    const cache = useRef(new Map<number, FolderLabel>());
    const [map, setMap] = useState(new Map<number, FolderLabel>());

    const cachePut = useCallback((label: FolderLabel, map: Map<number, FolderLabel>) => {
        map.set(label.id, {
            ...label,
            name: label.id === rootFolder ? "My Driver" : label.name,
        });
    }, [rootFolder]);

    const refresh = useCallback(async () => {
        allFolderApi()
            .then(r => {
                if (r.code === 0 && r.fields?.structure) {
                    const newCache = new Map<number, FolderLabel>();
                    Object.values(r.fields.structure).forEach(label => {
                        cachePut(label, newCache);
                    });
                    cache.current = newCache;
                    setMap(newCache);
                } else {
                    console.error(r.message);
                }
            })
            .catch(console.error);
    }, [cachePut]);

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
            setMap(cache.current);
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

    const update = useCallback(async (id: number, changes: Partial<FolderLabel>) => {
        const label = cache.current.get(id);
        if (!label) return;
        cache.current.set(id, {...label, ...changes });
        setMap(cache.current);
    }, []);

    useEffect(() => {
        refresh().catch(console.error);
    }, [refresh]);

    return (
        <FolderTreeContext.Provider value={{getPath, getLabel, refresh, cache: map, update}}>
            {children}
        </FolderTreeContext.Provider>
    );
}