import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useDriverInfo} from "../../../_lib/driverInfo/DriverInfoContext.ts";
import {ItemView} from "../../../definations.ts";
import {useContentCache} from "../../ContentCache/ContentCache.ts";
import {PaginationContext} from "./PaginationContext.ts";
import {contentApi} from "../../../_api/CoreApi.ts";
import {useUploadApi} from "../../uploadApi2/UploadApiContext.ts";

export default function PaginationProvider({children} : {children: React.ReactNode}) {
    const { onSuccess } = useUploadApi();
    const { rootFolder } = useDriverInfo().info;
    const { refreshInfo } = useDriverInfo();
    const { cachePutItem } = useContentCache();
    const [searchParams] = useSearchParams();

    const [items, setItems] = useState<ItemView[]>([]);

    const folders = useMemo(() => items.filter(i => i.folder), [items]);
    const files = useMemo(() => items.filter(i => !i.folder), [items]);

    const currentFolder = useMemo(
        () =>  Number(searchParams.get("folder")) || rootFolder,
        [searchParams, rootFolder]
    );

    const getContent = useCallback(async (id: number) => {
        if (!id) return [];

        const result = await contentApi(id);
        if (result.code === 0) {
            result.fields.list
                .filter(item => item.fileType === "FOLDER")
                .forEach(item => cachePutItem(item));
            setItems(result.fields.list);
        } else {
            setItems([]);
        }
    }, [cachePutItem]);

    const refresh = useCallback(
        () => getContent(currentFolder), [currentFolder, getContent]
    );

    useEffect(() => {
        getContent(currentFolder).catch(console.error);
    }, [currentFolder, getContent])

    const update = useCallback((id: number, change: Partial<ItemView>) => {
        setItems(prev => prev.map(i => i.id === id ? {...i, ...change } : i));
    }, [])

    const remove = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    useEffect(() => {
        onSuccess((_, folder) => {
            if (folder === currentFolder) refresh().then(() => console.log("upload refresh"));
            refreshInfo();
        });

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
                update,
                remove,
        }}>
            {children}
        </PaginationContext.Provider>
    );
}