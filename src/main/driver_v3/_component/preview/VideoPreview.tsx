import {getUrl} from "../../../../_lib/actions.ts";

type VideoPreviewProps = {
    fileId: number;
    className?: string;
};


export default function VideoPreview({fileId, className}: VideoPreviewProps) {
    return (
        <div>
            <video controls autoPlay={true} className={`max-h-[90vh] max-w-[90vw] object-contain ${className || ""}`}>
                <source src={getUrl(`/preview/${fileId}/v2`)} type="video/mp4"/>
            </video>
        </div>
    )
}