import React, {useCallback, useEffect, useRef, useState} from "react";
import {FolderNode, FolderTreeContext} from "./useFolderTree.ts";
import {contentApi, itemApi} from "../../apis.ts";
import useDriver from "../../_hooks/useDriver.ts";

const UPDATE_DELAY = 1000;
const MAX_DEPTH = 50;

type FolderTreeProviderProps = {
    children: React.ReactNode;
    fallback?: React.ReactNode
}

export default function FolderTreeProvider({children, fallback=null}: FolderTreeProviderProps) {
    const { rootFolder } = useDriver();

    /***********************folder tree part*********************************/
    const cache = useRef(new Map<number, FolderNode>());
    const [map, setMap] = useState(cache.current);

    const debounceRef = useRef<number | null>(null);
    const debouncedUpdate = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            console.log("tree update");
            setMap(new Map(cache.current));
        }, UPDATE_DELAY);
    }, []);

    const getNode = useCallback(async (id: number): Promise<FolderNode | null> => {
        if (!id) return null;
        if (cache.current.has(id)) return cache.current.get(id) ?? null;

        const result = await itemApi(id);
        if (result.code === 0 && result.fields?.item) {
            const item = result.fields.item;
            const node: FolderNode = {
                id: item.id,
                name: item.id === rootFolder ? "My Driver" : item.name,
                folderId: item.id,
            };
            if (item.folder) {
                cache.current.set(id, node);
                debouncedUpdate();
            }

            return node;
        }
        console.error(result.message);
        return null;
    }, [debouncedUpdate, rootFolder]);

    const getPath = useCallback(async (id: number): Promise<FolderNode[]> => {
        const path: FolderNode[] = [];
        const visited = new Set<number>();

        let current: FolderNode | null = await getNode(id);
        for (let depth = 0; current && depth < MAX_DEPTH && !visited.has(current.id); depth++) {
            path.unshift(current);
            visited.add(current.id);

            if (current.folderId === null) break;

            if (!cache.current.has(current.folderId)) {
                const parent = await getNode(current.folderId);
                if (!parent) break;
            }

            current = cache.current.get(current.folderId) ?? null;
        }

        return path;
    }, [getNode]);

    const refresh = useCallback(async () => {
        const result = await contentApi({pageNum: 1, pageSize: 999, fileType: "FOLDER"});
        if (result.code === 0 && result.fields) {
            const newCache = new Map<number, FolderNode>();
            Object.values(result.fields.list).forEach(item => newCache.set(item.id, {...item}));
            cache.current = newCache;
            setMap(new Map(cache.current));
        } else {
            console.error(result.message);
        }
    }, []);

    const update = useCallback((id: number, changes: Omit<Partial<FolderNode>, "id">) => {
        const oldVar = cache.current.get(id);
        if (!oldVar) return;
        cache.current.set(id, {...oldVar, ...changes});
        debouncedUpdate();
    }, [debouncedUpdate]);

    const insert = useCallback((node: FolderNode) => {
        if (cache.current.has(node.id)) return;
        cache.current.set(node.id, node);
        debouncedUpdate();
    }, [debouncedUpdate]);

    const remove = useCallback((id: number) => {
        cache.current.delete(id);
        debouncedUpdate();
    }, [debouncedUpdate]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        if (!mounted) {
            refresh().catch(console.error).finally(() => {
                console.info("folder tree init");
                setMounted(true);
            });
        }
    }, [mounted, refresh]);

    /***********************render part*********************************/

    if (!mounted) return fallback;

    return (
        <FolderTreeContext.Provider value={{map, getNode, getPath, refresh, update, insert, remove }}>
            {children}
        </FolderTreeContext.Provider>
    );
}