import { useEffect, useState } from "react";
import useFileCache from "../../../_middleware/fileCache/FileCacheContext.ts";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

type ImagePreviewProps = {
    fileId: number;
    className?: string;
    alt?: string;
};

function ImagePreview({ fileId, className, alt = "Preview unavailable" }: ImagePreviewProps) {
    const [src, setSrc] = useState<string | null>(null);
    const { cacheable } = useFileCache();

    useEffect(() => {
        let mounted = true;
        const loadImage = async () => {
            const objectUrl = await cacheable(`/api/driver/preview/${fileId}`);
            if (mounted) setSrc(objectUrl);
        };

        loadImage().catch(error => console.error(error));

        return () => {
            mounted = false;
        };
    }, [cacheable, fileId]);

    if (!src) {
        return <div className="text-white text-sm">Loading image...</div>;
    }

    return (
        <TransformWrapper
            initialScale={1}
            minScale={0.2}
            maxScale={5}
            centerOnInit
            wheel={{ step: 0.1 }}
        >
            <TransformComponent>
                <img
                    src={src}
                    alt={alt}
                    className={`max-h-[90vh] max-w-[90vw] object-contain ${className || ""}`}
                />
            </TransformComponent>
        </TransformWrapper>
    )
}

export default ImagePreview;