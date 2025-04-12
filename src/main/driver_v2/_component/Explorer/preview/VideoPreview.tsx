import {getUrl} from "../../../../../_lib/actions.ts";
import {useEffect, useState} from "react";
import useFileCache from "../../../_middleware/fileCache/FileCacheContext.ts";

type VideoPreviewProps = {
    fileId: number;
    size: number;
    className?: string;
};


export default function VideoPreview({fileId, size, className}: VideoPreviewProps) {
    const [src, setSrc] = useState<string | null>(null);
    const { cacheable } = useFileCache();

    useEffect(() => {
        let mounted = true;
        const loadVideo = async () => {
            const objectUrl = await cacheable(`/api/driver/preview/${fileId}`);
            if (mounted) setSrc(objectUrl);
        }

        if (size < 20 * 1024 * 1024) loadVideo().catch(e => console.error(e));
        else setSrc(getUrl(`/api/driver/preview/${fileId}/v2`));

        return () => {mounted = false;};
    }, [cacheable, fileId, size]);

    if (!src) {
        return <div className="text-white text-sm">Loading image...</div>;
    }

    return (
        <div>
            <video controls autoPlay={true} className={`max-h-[90vh] max-w-[90vw] object-contain ${className || ""}`}>
                <source src={src} type="video/mp4"/>
            </video>
        </div>
    )
}