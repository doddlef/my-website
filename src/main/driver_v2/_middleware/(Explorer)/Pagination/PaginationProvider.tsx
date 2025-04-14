import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import {useDriverInfo} from "../../../_lib/driverInfo/DriverInfoContext.ts";
import {ItemView} from "../../../definations.ts";
import {PaginationContext, PaginationInfo} from "./PaginationContext.ts";
import {contentApi} from "../../../_api/CoreApi.ts";
import {useUploadApi} from "../../uploadApi2/UploadApiContext.ts";
import {debounce} from "lodash";

export default function PaginationProvider({children} : {children: React.ReactNode}) {
    const { onSuccess } = useUploadApi();
    const { rootFolder } = useDriverInfo().info;
    const { refreshInfo } = useDriverInfo();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [items, setItems] = useState<ItemView[]>([]);
    const folders = useMemo(() => items.filter(i => i.folder), [items]);
    const files = useMemo(() => items.filter(i => !i.folder), [items]);

    const currentFolder = useMemo(() =>  Number(searchParams.get("folder")) || rootFolder,
        [searchParams, rootFolder]);

    const page = useMemo(() => Number(searchParams.get("page")) || 1, [searchParams]);

    const [pagination, setPagination] = useState<PaginationInfo>({
        hasPrevious: false,
        hasNext: true,
        pageCount: 0,
    });

    const isLoading = useRef(false);
    const [loading, setLoading] = useState(false);
    const refresh = useCallback(async () => {
        if (isLoading.current) return;
        isLoading.current = true;
        setLoading(true)

        try {
            const result = await contentApi(currentFolder, {pageNum: page, pageSize: 80});
            if (result.code === 0) {
                setItems(result.fields.list);
                setPagination(result.fields.pagination);
            } else {
                setItems(result.fields.list);
                setPagination({hasNext: false, hasPrevious: false, pageCount: 0})
            }
        } finally {
            isLoading.current = false;
            setLoading(false);
        }
    }, [currentFolder, page]);

    const changePage = useCallback((newPage: number) => {
        if (newPage < 1 || newPage > pagination.pageCount) return;

        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPage));
        navigate({ search: params.toString() });
    }, [navigate, pagination.pageCount, searchParams]);

    const update = useCallback((id: number, change: Partial<ItemView>) => {
        setItems(prev => prev.map(i => i.id === id ? {...i, ...change } : i));
    }, []);

    const remove = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    useEffect(() => {
        isLoading.current = false;
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh().catch(console.error);
    }, [refresh, page]);

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
                currentFolder, page, pagination,
                items, folders, files,
                refresh, changePage, loading,
                update, remove,
        }}>
            {children}
        </PaginationContext.Provider>
    );
}