import useDriver from "../_hooks/useDriver.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { PaginationContext } from "../_hooks/usePagination.ts";
import {ItemView} from "../definitions.ts";
import {contentApi} from "../apis.ts";
import useFolderTree from "../_middleware/useFolderTree/useFolderTree.ts";
import {FolderContext} from "./_hooks/useFolderContent.ts";
import {debounce} from "lodash";
import {useUploadApi} from "../_middleware/uploadApi2/UploadApiContext.ts";
import {enqueueSnackbar} from "notistack";
import useSelected from "../_middleware/useSelected/useSelected.ts";
import Page from "./Page.tsx";
import SelectedProvider from "../_middleware/useSelected/SelectedProvider.tsx";

const DEFAULT_PAGE_SIZE = 80;

type PaginationInfo = {
    hasPrevious: boolean,
    hasNext: boolean,
    pageCount: number,
}

function Layout() {
    const { rootFolder, refresh: refreshUsage } = useDriver();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { insert } = useFolderTree();

    /****************************pagination part*****************************/
    const page = useMemo(() => (
        Number(searchParams.get("page")) || 1
    ), [searchParams]);

    const [pagination, setPagination] = useState<PaginationInfo>({
       hasPrevious: false,
       hasNext: true,
       pageCount: 0,
    });

    const changePage = useCallback((newPage: number) => {
        if (newPage < 1 || newPage > pagination.pageCount) return;

        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPage));
        navigate({ search: params.toString() });
    }, [navigate, pagination.pageCount, searchParams]);

    /****************************folder content part*************************/
    const currentFolder = useMemo(() => (
        Number(searchParams.get("folder")) || rootFolder
    ), [searchParams, rootFolder]);

    const [items, setItems] = useState<ItemView[]>([]);
    const folders = useMemo(() => items.filter(i => i.folder), [items]);
    const files = useMemo(() => items.filter(i => !i.folder), [items]);

    const loadingRef = useRef(false);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (loadingRef.current) return;

        const targetFolder = currentFolder;
        const targetPage = page;

        loadingRef.current = true;
        setLoading(true);

        try {
            const r = await contentApi({
                folder: targetFolder,
                pageNum: targetPage,
                pageSize: DEFAULT_PAGE_SIZE,
            });

            if (r.code === 0 && r.fields) {
                setItems(r.fields.list);
                setPagination(r.fields.pagination);

                r.fields.list
                    .filter(item => item.folder)
                    .forEach(item => insert({ ...item }));
            } else {
                enqueueSnackbar(r.message, { variant: "warning" });
                setItems([]);
                setPagination({ hasNext: false, hasPrevious: false, pageCount: 0 });
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                enqueueSnackbar(error.message, { variant: "error" });
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [currentFolder, insert, page]);

    const update = useCallback((id: number, change: Omit<Partial<ItemView>, "id">) => {
        setItems(prev => prev.map(i => i.id === id ? {...i, ...change} : i));
    }, [])

    const remove = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    // reset loading state when un-mounted
    useEffect(() => {
        loadingRef.current = false;
        setLoading(false);
    }, []);

    // automatically generate folder content when page change
    useEffect(() => {
        refresh().then(() => console.log("change page change content"))
    }, [refresh, page]);

    /****************************selected part**********************************/
    // clear selected when page / folder change
    const { clear } = useSelected();
    useEffect(() => {
        clear()
    }, [clear, page, currentFolder]);

    /****************************render part*************************/

    // refresh when upload finished
    const { onSuccess } = useUploadApi();

    useEffect(() => {
        const reportSuccess = debounce((_: string, folder: number) => {
            if (folder === currentFolder) refresh().then(() => console.log("upload refresh content"));
            refreshUsage().catch(console.error);
        }, 1000);

        onSuccess(reportSuccess);

        return () => onSuccess(() => {});
    }, [currentFolder, onSuccess, refresh, refreshUsage]);

    return (
        <PaginationContext.Provider value={{...pagination, page, changePage}}>
            <FolderContext.Provider value={{currentFolder, items, files, folders, refresh, loading, update, remove}}>
                <Page />
            </FolderContext.Provider>
        </PaginationContext.Provider>
    );
}

function LayoutWrapper() {
    return (
        <SelectedProvider>
            <Layout />
        </SelectedProvider>
    )
}

export default LayoutWrapper;