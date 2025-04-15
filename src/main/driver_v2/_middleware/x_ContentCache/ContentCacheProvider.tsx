import React, {useCallback, useRef} from "react";
import {useDriverInfo} from "../driverInfo/DriverInfoContext.ts";
import {itemApi} from "../../_api/CoreApi.ts";
import {ContentCache} from "./ContentCache.ts";
import {ItemLabel, ItemView} from "../../definations.ts";

const ContentCacheProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { rootFolder } = useDriverInfo().info;
    const cache = useRef(new Map<number, ItemLabel>());

    const constructItemLabel = useCallback((item: ItemView): ItemLabel => (
        {
            id: item.id,
            name: item.id === rootFolder ? "My Drive" : item.name,
            url: item.id === rootFolder ? "/driver" : `/driver?folder=${item.id}`,
            type: item.fileType,
            folderId: item.folderId,
        }
    ), [rootFolder])

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

    const cachePutLabel = useCallback((label: ItemLabel) => {
        cache.current.set(label.id, label);
    }, [])

    const cachePutItem = useCallback((item: ItemView) => {
        cache.current.set(item.id, constructItemLabel(item));
    }, [constructItemLabel])

    return (
        <ContentCache.Provider
            value={{
                getPath, getLabel, cachePutLabel, cachePutItem,
            }}
        >
            {children}
        </ContentCache.Provider>
    )
}

export default ContentCacheProvider;