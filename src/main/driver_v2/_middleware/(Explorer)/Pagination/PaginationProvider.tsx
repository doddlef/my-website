import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useDriverInfo} from "../../../_lib/driverInfo/DriverInfoContext.ts";
import {ItemView} from "../../../definations.ts";
import {useContentCache} from "../../ContentCache/ContentCache.ts";
import {PaginationContext} from "./PaginationContext.ts";
import {contentApi} from "../../../_api/CoreApi.ts";
import {useUploadApi} from "../../uploadApi2/UploadApiContext.ts";
import {debounce} from "lodash";

export default function PaginationProvider({children} : {children: React.ReactNode}) {
    const { onSuccess } = useUploadApi();
    const { rootFolder } = useDriverInfo().info;
    const { refreshInfo } = useDriverInfo();
    const { cachePutItem } = useContentCache();
    const [searchParams] = useSearchParams();

    const [items, setItems] = useState<ItemView[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const folders = useMemo(() => items.filter(i => i.folder), [items]);
    const files = useMemo(() => items.filter(i => !i.folder), [items]);

    const currentFolder = useMemo(
        () =>  Number(searchParams.get("folder")) || rootFolder,
        [searchParams, rootFolder]
    );

    const getContent = useCallback(async (id: number, offset=0, limit=60) => {
        const result = await contentApi(id, {offset, limit});
        if (result.code === 0) {
            result.fields.list
                .filter(item => item.fileType === "FOLDER")
                .forEach(item => cachePutItem(item));
            setItems(result.fields.list);
            setHasMore(result.fields.hasNext)
        } else {
            setItems([]);
            setHasMore(false);
        }
    }, [cachePutItem]);

    const initContent = useCallback(async (id: number) => {
        getContent(id).catch(console.error);
    }, [getContent]);

    const refresh = useCallback(async () => {
        getContent(currentFolder, 0, items.length < 60 ? 60 : items.length).catch(console.error);
    }, [currentFolder, getContent, items.length]);

    const isLoading = useRef(false);
    const loadMore = useCallback(async () => {
        if (!hasMore || isLoading.current) return;
        isLoading.current = true;

        const result = await contentApi(currentFolder, {offset: items.length, limit: 60});
        if (result.code === 0) {
            result.fields.list
                .filter(item => item.fileType === "FOLDER")
                .forEach(item => cachePutItem(item));
            setItems(prev => [...prev, ...result.fields.list]);
            setHasMore(result.fields.hasNext)
        } else {
            setItems([]);
            setHasMore(false);
        }

        isLoading.current = false;
    }, [cachePutItem, currentFolder, hasMore, items.length]);

    const update = useCallback((id: number, change: Partial<ItemView>) => {
        setItems(prev => prev.map(i => i.id === id ? {...i, ...change } : i));
    }, [])

    const remove = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    useEffect(() => {
        isLoading.current = false;
        initContent(currentFolder).catch(console.error);
    }, [currentFolder, initContent])

    useEffect(() => {
        const reportSuccess = debounce((_: string, folder: number) => {
            if (folder === currentFolder) refresh().then(() => console.log("upload refresh"));
            refreshInfo();
        }, 1000);

        onSuccess(reportSuccess);

        return () => {
            onSuccess(() => {})
        }
    }, [currentFolder, onSuccess, refresh, refreshInfo]);

    return (
        <PaginationContext.Provider
            value={{
                currentFolder,
                items,
                folders,
                files,
                refresh,
                loadMore,
                hasMore,
                update,
                remove,
        }}>
            {children}
        </PaginationContext.Provider>
    );
}