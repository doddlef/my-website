import React, { useState, useCallback } from "react";
import {SelectedContext} from "./SelectedContext";

const SelectedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selected, setSelected] = useState<number[]>([]);

    const select = useCallback((id: number) => {
        setSelected([id]);
    }, [])

    const add = useCallback((id: number) => {
        setSelected(prev => [ ...prev, id]);
    }, [])

    const deselect = useCallback((id: number) => {
        setSelected(prev => prev.filter((i) => i !== id));
    }, [])

    const clear = useCallback(() => setSelected([]), []);

    return (
        <SelectedContext.Provider
            value={{ selected, select, add, deselect, clear }}
        >
            {children}
        </SelectedContext.Provider>
    );
};

export default SelectedProvider;