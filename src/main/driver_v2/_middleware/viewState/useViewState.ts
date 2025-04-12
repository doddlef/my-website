import { createContext, useContext } from "react";
import { FileType } from "../../definations.ts";

export type ViewMethod = "grid" | "list";
export type TypeFilter = null | FileType;
export type TimeFilter = null | "today" | "week" | "month" | "year";
export type OrderMethod = null | "editTime" | "createTime" | "size" | "name";

interface ViewStateContextType {
    viewMethod: ViewMethod;
    setViewMethod: (viewMethod: ViewMethod) => void;

    typeFilter: TypeFilter;
    setTypeFilter: (typeFilter: TypeFilter) => void;

    timeFilter: TimeFilter;
    setTimeFilter: (timeFilter: TimeFilter) => void;

    orderMethod: OrderMethod;
    setOrderMethod: (orderMethod: OrderMethod) => void;
}

export const UseViewState = createContext<ViewStateContextType | undefined>(undefined);

export const useViewState = (): ViewStateContextType => {
    const context = useContext(UseViewState);
    if (!context) {
        throw new Error("useViewState must be used within a ViewStateProvider");
    }
    return context;
};

export default useViewState;