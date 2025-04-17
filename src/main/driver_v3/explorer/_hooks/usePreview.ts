import {createContext, useContext} from "react";

type PreviewContextType = {
    preview: (id: number) => void;
    close: () => void;
}

export const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

const usePreview = () => {
    const context = useContext(PreviewContext);

    if (!context) {
        throw new Error('useItemPreview must be used within ItemPreview');
    }

    return context;
}

export default usePreview;