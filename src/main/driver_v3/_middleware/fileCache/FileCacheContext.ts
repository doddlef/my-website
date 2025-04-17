import { createContext, useContext } from "react";

export type ImageCacheContextType = {
    cacheable: (url: string) => Promise<string | null>;
    cacheEvict: (url: string) => void;
};

export const FileCacheContext = createContext<ImageCacheContextType | null>(null);

export const useFileCache = () => {
    const context = useContext(FileCacheContext);
    if (!context) throw new Error("useImageCache must be used within ImageCacheProvider");
    return context;
};

export default useFileCache;