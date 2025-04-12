import React, {useState, useCallback, useMemo} from "react";
import {SelectedContext} from "./SelectedContext.ts";
import {ItemView} from "../../definations.ts";

const SelectedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selected, setSelected] = useState<ItemView[]>([]);

    const select = useCallback((item: ItemView) => {
        setSelected([item]);
    }, [])

    const add = useCallback((item: ItemView) => {
        setSelected(prev => [ ...prev, item]);
    }, [])

    const deselect = useCallback((id: number) => {
        setSelected(prev => prev.filter((i) => i.id !== id));
    }, [])

    const clear = useCallback(() => setSelected([]), []);

    const firstItem = useMemo(() => selected.length > 0 ? selected[0] : null, [selected]);

    return (
        <SelectedContext.Provider
            value={{ selected, select, add, deselect, clear, firstItem }}
        >
            {children}
        </SelectedContext.Provider>
    );
};

export default SelectedProvider;