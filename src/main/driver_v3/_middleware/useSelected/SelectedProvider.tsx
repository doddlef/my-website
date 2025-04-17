import React, { useCallback, useState } from "react";
import { SelectedContext, normalize } from "./useSelected";

interface SelectedProviderProps {
    children: React.ReactNode;
}

export function SelectedProvider({ children }: SelectedProviderProps) {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const add = useCallback((id: number | number[]) => {
        const ids = normalize(id);
        setSelected(prev => {
            const next = new Set(prev);
            ids.forEach(i => next.add(i));
            return next;
        });
    }, []);

    const toggle = useCallback((id: number | number[]) => {
        const ids = normalize(id);
        setSelected(prev => {
            const next = new Set(prev);
            ids.forEach(i => {
                if (next.has(i)) {
                    next.delete(i);
                } else {
                    next.add(i);
                }
            });
            return next;
        });
    }, []);

    const select = useCallback((id: number | number[]) => {
        const ids = normalize(id);
        setSelected(new Set(ids));
    }, []);

    const deselect = useCallback((id: number | number[]) => {
        const ids = normalize(id);
        setSelected(prev => {
            const next = new Set(prev);
            ids.forEach(i => next.delete(i));
            return next;
        });
    }, []);

    const clear = useCallback(() => {
        setSelected(new Set());
    }, []);

    return (
        <SelectedContext.Provider value={{ selected, add, toggle, select, deselect, clear }}>
            {children}
        </SelectedContext.Provider>
    );
}

export default SelectedProvider;