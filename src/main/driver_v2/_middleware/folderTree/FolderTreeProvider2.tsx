import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDriverInfo } from "../driverInfo/DriverInfoContext.ts";
import { R } from "../../../../_lib/definitions.ts";
import { refreshableRequest } from "../../../../_lib/actions.ts";
import { itemApi } from "../../_api/CoreApi.ts";
import { FolderLabel, FolderTreeContext } from "./useFolderTree.ts";

type FolderStructure = {
    [folderId: string]: FolderLabel;
};

type AllFolderResult = R & {
    fields?: {
        structure: FolderStructure;
    };
};

const allFolderApi = async () => {
    return await refreshableRequest("/api/driver/folder-plain", { method: 'GET' }) as AllFolderResult;
};

export default function FolderTreeProvider({
                                               children,
                                               fallback = null,
                                           }: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { rootFolder } = useDriverInfo().info;
    const cache = useRef(new Map<number, FolderLabel>());
    const [map, setMap] = useState(new Map<number, FolderLabel>());
    const [mounted, setMounted] = useState(false);

    const debounceRef = useRef<number | null>(null);
    const debouncedUpdate = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            console.log("tree update");
            setMap(new Map(cache.current));
        }, 1000);
    }, []);

    const cachePut = useCallback((label: FolderLabel, map: Map<number, FolderLabel>) => {
        map.set(label.id, {
            ...label,
            name: label.id === rootFolder ? "My Driver" : label.name,
        });
    }, [rootFolder]);

    const refresh = useCallback(async () => {
        try {
            const r = await allFolderApi();
            if (r.code === 0 && r.fields?.structure) {
                const newCache = new Map<number, FolderLabel>();
                Object.values(r.fields.structure).forEach(label => {
                    cachePut(label, newCache);
                });
                cache.current = newCache;
                setMap(new Map(newCache));
            } else {
                console.error(r.message);
            }
        } catch (err) {
            console.error(err);
        }
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
                children: [id],
            };
            cache.current.set(label.id, label);
            debouncedUpdate();
            return label;
        }
        return null;
    }, [rootFolder, debouncedUpdate]);

    const getPath = useCallback(async (id: number): Promise<FolderLabel[]> => {
        const path: FolderLabel[] = [];
        const visited = new Set<number>();
        const MAX_DEPTH = 50;

        let current: FolderLabel | null = await getLabel(id);
        for (let depth = 0; current && depth < MAX_DEPTH && !visited.has(current.id); depth++) {
            path.unshift(current);
            visited.add(current.id);

            if (current.folderId === null) break;

            if (!cache.current.has(current.folderId)) {
                const parent = await getLabel(current.folderId);
                if (!parent) break;
            }

            current = cache.current.get(current.folderId) ?? null;
        }

        return path;
    }, [getLabel]);

    const getChildren = useCallback((id: number): FolderLabel[] => {
        const node = cache.current.get(id);
        return node?.children?.map(cid => cache.current.get(cid)!).filter(Boolean) ?? [];
    }, []);

    const cacheUpdate = useCallback((id: number, changes: Partial<FolderLabel>) => {
        const label = cache.current.get(id);
        if (!label || !label.folderId) return;

        const isSame = Object.entries(changes).every(
            ([key, value]) => label[key as keyof FolderLabel] === value
        );
        if (isSame) return;

        // Handle folder change
        if (changes.folderId && changes.folderId !== label.folderId) {
            const newFolder = cache.current.get(changes.folderId);
            if (newFolder) {
                const newChildren = [...(newFolder.children ?? []), id];
                cache.current.set(newFolder.id, { ...newFolder, children: newChildren });
            }

            const oldFolder = cache.current.get(label.folderId);
            if (oldFolder) {
                const newChildren = [...(oldFolder.children ?? [])].filter(i => i !== id);
                cache.current.set(oldFolder.id, { ...oldFolder, children: newChildren });
            }
        }

        cache.current.set(id, { ...label, ...changes });
    }, []);

    const update = useCallback((id: number, changes: Partial<FolderLabel>) => {
        cacheUpdate(id, changes);
        debouncedUpdate();
    }, [cacheUpdate, debouncedUpdate]);

    const put = useCallback((label: FolderLabel) => {
        if (cache.current.has(label.id)) return;

        cache.current.set(label.id, label);
        if (label.folderId) {
            const parent = cache.current.get(label.folderId);
            if (parent) {
                const children = new Set(parent.children ?? []);
                children.add(label.id);
                cache.current.set(label.folderId, { ...parent, children: Array.from(children) });
            }
        }
        debouncedUpdate();
    }, [debouncedUpdate]);

    const remove = useCallback((id: number) => {
        const label = cache.current.get(id);
        if (!label) return;

        if (label.folderId) {
            const parent = cache.current.get(label.folderId);
            if (parent) {
                const newChildren = (parent.children ?? []).filter(cid => cid !== id);
                cache.current.set(parent.id, { ...parent, children: newChildren });
            }
        }

        const removeRec = (id: number) => {
            
        }

        cache.current.delete(id);
        debouncedUpdate();
    }, [debouncedUpdate]);

    useEffect(() => {
        if (!mounted) {
            refresh().catch(console.error).finally(() => {
                console.log("folder tree built");
                setMounted(true);
            });
        }
    }, [mounted, refresh]);

    if (!mounted) return fallback;

    return (
        <FolderTreeContext.Provider value={{
            getPath,
            getLabel,
            getChildren,
            refresh,
            cache: map,
            mounted,

            update,
            put,
            remove,
        }}>
            {children}
        </FolderTreeContext.Provider>
    );
}