import { ReactNode, useCallback, useRef } from "react";
import { getUrl, refreshRequest } from "../../../../_lib/actions.ts";
import { FileCacheContext } from "./FileCacheContext.ts";
import { R } from "../../../../_lib/definitions.ts";

function FileCacheProvider({ children }: { children: ReactNode }) {
    const urlCache = useRef<Map<string, string>>(new Map());

    const fetchWithRefresh = async (url: string): Promise<Blob | null> => {
        const doFetch = async (): Promise<Response> => {
            return await fetch(getUrl(url), {
                method: "GET",
                credentials: "include",
            });
        };

        let response = await doFetch();
        if (response.ok) return await response.blob();

        try {
            const data = await response.json() as R;
            if (data.code !== 4 || !await refreshRequest()) return null;
        } catch {
            return null;
        }

        response = await doFetch();
        if (response.ok) return await response.blob();
        return null;
    };

    const cacheable = useCallback(async (url: string): Promise<string | null> => {
        const cachedUrl = urlCache.current.get(url);
        if (cachedUrl) return cachedUrl;

        const blob = await fetchWithRefresh(url);
        if (!blob) return null;

        const objectUrl = URL.createObjectURL(blob);
        urlCache.current.set(url, objectUrl);

        return objectUrl;
    }, []);

    const cacheEvict = useCallback((url: string) => {
        const objectUrl = urlCache.current.get(url);
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            urlCache.current.delete(url);
        }
    }, []);

    return (
        <FileCacheContext.Provider value={{ cacheable, cacheEvict }}>
            {children}
        </FileCacheContext.Provider>
    );
}

export default FileCacheProvider;