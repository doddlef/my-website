import {createContext, useContext} from "react";

type ItemPreviewContextType = {
    previewFile: (id: number) => void;
    close: () => void;
}

export const ItemPreviewContext = createContext<ItemPreviewContextType | undefined>(undefined);

export const useItemPreview = () => {
    const context = useContext(ItemPreviewContext);

    if (!context) {
        throw new Error('useItemPreview must be used within ItemPreview');
    }

    return context;
}