import {ReactNode, useState} from "react";
import {UseViewState, OrderMethod, TimeFilter, TypeFilter, ViewMethod} from "./useViewState.ts";

export const ViewStateProvider = ({ children }: { children: ReactNode }) => {
    const [viewMethod, setViewMethod] = useState<ViewMethod>("grid");
    const [typeFilter, setTypeFilter] = useState<TypeFilter>(null);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>(null);
    const [orderMethod, setOrderMethod] = useState<OrderMethod>(null);

    return (
        <UseViewState.Provider value={{
            viewMethod,
            setViewMethod,
            typeFilter,
            setTypeFilter,
            timeFilter,
            setTimeFilter,
            orderMethod,
            setOrderMethod,
        }}>
            {children}
        </UseViewState.Provider>
    );
};
