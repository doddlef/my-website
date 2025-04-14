import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ItemPreviewContext } from "../../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";
import { PaginationInfo, usePagination } from "../../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import { FileType } from "../../../definations.ts";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImagePreview from "./ImagePreview.tsx";
import VideoPreview from "./VideoPreview.tsx";
import AudioPreview from "./AudioPreview.tsx";

type FilePreview = {
    id: number;
    name: string;
    fileType: FileType;
    size: number;
};

function ItemPreviewProvider({ children }: { children: ReactNode }) {
    const { files, page, pagination, changePage } = usePagination();
    const [index, setIndex] = useState<number>(-1);

    // Use `useMemo` so we don't need to manually manage items state
    const items = useMemo<FilePreview[]>(() => {
        return files.map(f => ({
            id: f.id,
            name: f.name,
            fileType: f.fileType,
            size: f.size ?? 0,
        }));
    }, [files]);

    const nextIndexRef = useRef<number | "from-end" | null>(null);

    useEffect(() => {
        if (nextIndexRef.current !== null) {
            if (nextIndexRef.current === "from-end") {
                setIndex(files.length - 1);
            } else {
                setIndex(nextIndexRef.current);
            }
            nextIndexRef.current = null;
        }
    }, [files]);

    const previewFile = useCallback((id: number) => {
        const i = files.findIndex(i => i.id === id);
        if (i === -1) {
            setIndex(-1);
        } else {
            setIndex(i);
        }
    }, [files]);

    const changeIndex = (change: number) => {
        if (change === 0) return;

        const nextIndex = index + change;

        if (nextIndex < 0 && pagination.hasPrevious) {
            nextIndexRef.current = "from-end";
            changePage(page - 1);
        } else if (nextIndex >= files.length && pagination.hasNext) {
            nextIndexRef.current = nextIndex - files.length;
            changePage(page + 1);
        } else if (nextIndex >= 0 && nextIndex < items.length) {
            setIndex(nextIndex);
        }
    };

    return (
        <ItemPreviewContext.Provider
            value={{ previewFile, close: () => setIndex(-1) }}
        >
            {children}
            {index >= 0 && index < items.length &&
                <Previews
                    files={items}
                    pagination={pagination}
                    index={index}
                    changeIndex={changeIndex}
                    close={() => setIndex(-1)}
                />
            }
        </ItemPreviewContext.Provider>
    );
}

interface ItemPreviewProps {
    files: FilePreview[];
    pagination: PaginationInfo;
    index: number;
    changeIndex: (index: number) => void;
    close: () => void;
}

function Previews({ files, pagination, index, changeIndex, close }: ItemPreviewProps) {
    const node = useMemo(() => {
        const file = files[index];
        switch (file.fileType) {
            case "IMAGE":
                return <ImagePreview fileId={file.id} />;
            case "VIDEO":
                return <VideoPreview fileId={file.id} size={file.size} />;
            case "AUDIO":
                return <AudioPreview fileId={file.id} size={file.size} />;
            default:
                return <div className="text-white p-4">Unsupported file type</div>;
        }
    }, [files, index]);

    return (
        <div
            className="w-screen h-screen z-40 bg-zinc-900 bg-opacity-95 absolute top-0 left-0 flex justify-center items-center"
            onClick={(e) => {
                e.stopPropagation();
                close();
            }}
        >
            {(index > 0 || pagination.hasPrevious) && (
                <div className="absolute top-1/2 left-8">
                    <IconButton
                        sx={{ color: "white" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            changeIndex(-1);
                        }}
                    >
                        <ArrowBackIosIcon fontSize="large" />
                    </IconButton>
                </div>
            )}
            <div onClick={(e) => e.stopPropagation()}>
                {node}
            </div>
            {(index < files.length - 1 || pagination.hasNext) && (
                <div className="absolute top-1/2 right-8">
                    <IconButton
                        sx={{ color: "white" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            changeIndex(1);
                        }}
                    >
                        <ArrowForwardIosIcon fontSize="large" />
                    </IconButton>
                </div>
            )}
        </div>
    );
}

export default ItemPreviewProvider;