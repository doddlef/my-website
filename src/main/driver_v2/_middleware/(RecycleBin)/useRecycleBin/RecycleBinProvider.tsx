import {ReactNode, useCallback, useEffect, useState} from "react";
import {BinItemView} from "../../../definations.ts";
import { RecycleBinContext } from "./useRecycleBin.ts";
import {binContent} from "../../../_lib/RecycleApi.ts";
import {enqueueSnackbar} from "notistack";

const RecycleBinProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<BinItemView[]>([]);

    const refresh = useCallback(() => {
        binContent()
            .then(r => {
                if (r.code === 0) setItems(r.fields.list);
                else {
                    enqueueSnackbar(r.message, {variant: "error"});
                    setItems([]);
                }
            })
            .catch(console.error);
    }, []);

    const removeItem = useCallback((ids: number[]) => {
        setItems(prev => prev.filter(i => !ids.some(id => id === i.id)));
    }, [])

    useEffect(() => {
        refresh();
    }, []);

    return (
        <RecycleBinContext.Provider value={{ items, refresh, removeItem }}>
            {children}
        </RecycleBinContext.Provider>
    );
};

export default RecycleBinProvider;