import React from "react";

interface PaginationContextType {
    /**
     * current page number
     */
    page: number;
    changePage: (page: number) => void;

    /**
     * have previous page
     */
    hasPrevious: boolean,
    /**
     * have next page
     */
    hasNext: boolean,
    /**
     * total page count
     */
    pageCount: number,
}

export const PaginationContext = React.createContext<PaginationContextType | undefined>(undefined);

const usePagination = (): PaginationContextType => {
    const context = React.useContext(PaginationContext);
    if (!context) {
        throw new Error("usePagination must be used within PaginationProvider");
    }
    return context;
};

export default usePagination;