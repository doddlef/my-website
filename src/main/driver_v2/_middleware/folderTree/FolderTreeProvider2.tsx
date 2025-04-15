import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {useDriverInfo} from "../driverInfo/DriverInfoContext.ts";
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
    const [mounted, setMounted] = useState(false);

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

    const cacheUpdate = useCallback((id: number, changes: Partial<FolderLabel>) => {
        const label = cache.current.get(id);
        if (!label || !label.folderId) return;

        if (changes.folderId) {
            const newFolder = cache.current.get(changes.folderId);
            if (newFolder) {
                const newChildren = newFolder.children ? [...newFolder.children, id] : [id];
                cache.current.set(newFolder.id, {...newFolder, children: newChildren});
            }

            const oldFolder = cache.current.get(label.folderId);
            if (oldFolder) {
                const newChildren = oldFolder.children?.filter(i => i !== id);
                cache.current.set(oldFolder.id, {...oldFolder, children: newChildren});
            }
        }

        cache.current.set(id, {...label, ...changes });

    }, [])

    const update = useCallback((id: number, changes: Partial<FolderLabel>) => {
        cacheUpdate(id, changes);
        console.log("tree update");
        setMap(new Map<number, FolderLabel>(cache.current));
    }, [cacheUpdate]);

    const batchUpdate = useCallback((requests: {id: number, changes: Partial<FolderLabel>}[]) => {
        requests.forEach(r => cacheUpdate(r.id, r.changes));
        console.log("tree update");
        setMap(new Map<number, FolderLabel>(cache.current));
    }, [cacheUpdate])

    useEffect(() => {
        if (!mounted) {
            refresh().catch(console.error).finally(() => {
                console.log("folder tree built");
                setMounted(true);
            });
        }
    }, [mounted, refresh]);

    if (!mounted) return <div>building folder tree</div>;

    return (
        <FolderTreeContext.Provider value={{getPath, getLabel, refresh, cache: map, update, batchUpdate, mounted}}>
            {children}
        </FolderTreeContext.Provider>
    );
}