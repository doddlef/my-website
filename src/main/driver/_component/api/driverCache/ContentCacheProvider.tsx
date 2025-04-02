import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { useDriverInfo } from "../../infoProvider/DriverInfoContext.ts";
import { R } from "../../../../../_lib/definitions.ts";
import { refreshableRequest } from "../../../../../_lib/actions.ts";
import { ContentCache } from "./ContentCache.ts";
import {ItemLabel, ItemView} from "../../../_lib/defitions.ts";
import {useSearchParams} from "react-router-dom";
import {useUploadApi} from "../uploadApi2/UploadApiContext.ts";

type ItemApiResult = R & {
    fields: {
        item: ItemView;
    };
};

type ContentApiResult = R & {
    fields: {
        list: ItemView[];
    };
};

const itemApi = async (id: number): Promise<ItemApiResult> => {
    return await refreshableRequest(`/api/driver/item/${id}`, { method: "GET" }) as ItemApiResult;
};

const contentApi = async (id: number): Promise<ContentApiResult> => {
    return await refreshableRequest(`/api/driver/children/${id}`, { method: "GET" }) as ContentApiResult;
};

const ContentCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { rootFolder } = useDriverInfo().info;
    const { onSuccess } = useUploadApi();
    const [searchParams] = useSearchParams();

    const cache = useRef(new Map<number, ItemLabel>());
    const [items, setItems] = useState<ItemView[]>([]);

    const currentFolder = useMemo(() =>  Number(searchParams.get("folder")) || rootFolder,
        [searchParams, rootFolder])

    const constructItemLabel = useCallback((item: ItemView): ItemLabel => (
        {
            id: item.id,
            name: item.id === rootFolder ? "My Drive" : item.name,
            url: item.id === rootFolder ? "/driver" : `/driver?folder=${item.id}`,
            type: item.fileType,
            folderId: item.folderId,
        }
    ), [rootFolder])

    const getItem = useCallback(async (id: number) => {
        if (!id) return null;

        const result = await itemApi(id);
        if (result.code === 0) {
            cache.current.set(id, constructItemLabel(result.fields.item));
            return result.fields.item;
        }
        return null;
    }, [constructItemLabel]);

    const getLabel = useCallback(async (id: number) => {
        if (!id) return null;
        if (cache.current.has(id)) return cache.current.get(id) ?? null;

        const result = await itemApi(id);
        if (result.code === 0) {
            const label = constructItemLabel(result.fields.item);
            cache.current.set(id, label);
            return label;
        }
        return null;
    }, [constructItemLabel])

    const getContent = useCallback(async (id: number) => {
        if (!id) return [];

        const result = await contentApi(id);
        if (result.code === 0) {
            result.fields.list
                .filter(item => item.fileType === "FOLDER")
                .forEach(item => cache.current.set(item.id, constructItemLabel(item)));
            setItems(result.fields.list);
        } else {
            setItems([]);
        }
    }, [constructItemLabel]);

    const refresh = useCallback(
        () => getContent(currentFolder), [currentFolder, getContent]
    );

    useEffect(() => {
        refresh().then(() => console.log("init refresh"));
    }, [refresh]);

    useEffect(() => {
        onSuccess((_, folder) => {
            if (folder === currentFolder) refresh().then(() => console.log("upload refresh"));
        });

        return () => {
            onSuccess(() => {})
        }
    }, [currentFolder, onSuccess, refresh]);

    const getPath = useCallback(async (id: number) => {
        const path: ItemLabel[] = [];
        const MAX_DEPTH = 50;

        let current: null | undefined | ItemLabel = await getLabel(id);
        for (let depth = 0; current && depth < MAX_DEPTH; depth++) {
            path.unshift(current);

            if (!cache.current.has(current.folderId)) {
                const parent = await getLabel(current.folderId);
                if (!parent) break;
            }

            current = cache.current.get(current.folderId);
        }

        return path;
    }, [getLabel]);

    const cachePut = useCallback((label: ItemLabel) => {
        cache.current.set(label.id, label);
    }, [])

    return (
        <ContentCache.Provider value={{ getPath, getLabel, getItem, cachePut, refresh, items, currentFolder, rootFolder }}>
            {children}
        </ContentCache.Provider>
    );
};

export default ContentCacheProvider;