import {ReactNode, useCallback, useState} from "react";
import {ItemView} from "../../../_lib/defitions.ts";
import {SelectedContext} from "./SelectedContext.ts";

export default function SelectedProvider({children} : {children: ReactNode}) {
    const [selected, setSelected] = useState<ItemView | null>(null);

    const select = useCallback((item: ItemView) => {
        setSelected(item);
    }, []);

    const clear = useCallback(() => {
        setSelected(null);
    }, []);

    return (
        <SelectedContext.Provider value={{ selected, select, clear }}>
            {children}
        </SelectedContext.Provider>
    )
}