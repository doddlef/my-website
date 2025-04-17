import {useEffect, useState} from "react";
import useFileCache from "../../_middleware/fileCache/FileCacheContext.ts";
import {getUrl} from "../../../../_lib/actions.ts";

type AudioPreviewProps = {
    fileId: number;
    size: number | null;
    className?: string;
};

export default function AudioPreview({fileId, size, className}: AudioPreviewProps) {
    const [src, setSrc] = useState<string | null>(null);
    const { cacheable } = useFileCache();

    useEffect(() => {
        let mounted = true;
        const loadAudio = async () => {
            const objectUrl = await cacheable(`/api/driver/preview/${fileId}`);
            if (mounted) setSrc(objectUrl);
        }

        if (size && size < 20 * 1024 * 1024) loadAudio().catch(e => console.error(e));
        else setSrc(getUrl(`/api/driver/preview/${fileId}/v2`));

        return () => {mounted = false;};
    }, [cacheable, fileId, size]);

    if (!src) {
        return <div className="text-white text-sm">Loading image...</div>;
    }

    return (
        <div className={className}>
            <audio src={src} controls autoPlay={true}/>
        </div>
    )
}