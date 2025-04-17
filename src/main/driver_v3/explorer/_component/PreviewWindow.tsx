import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useFolderContent from "../_hooks/useFolderContent.ts";
import usePagination from "../../_hooks/usePagination.ts";
import {PreviewContext} from "../_hooks/usePreview.ts";
import {ItemView} from "../../definitions.ts";
import ImagePreview from "../../_component/preview/ImagePreview.tsx";
import VideoPreview from "../../_component/preview/VideoPreview.tsx";
import AudioPreview from "../../_component/preview/AudioPreview.tsx";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type ItemPreviewProviderProps = {
    children: React.ReactNode
}

function ItemPreviewProvider({ children } : ItemPreviewProviderProps) {
    const { page, hasNext, hasPrevious, changePage } = usePagination();
    const { files } = useFolderContent();

    const [index, setIndex] = useState<number>(-1);

    const nextIndexRef = useRef<number | "from-end" | null>(null);

    // handle page change
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

    const preview = useCallback((id: number) => {
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

        if (nextIndex < 0 && hasPrevious) {
            nextIndexRef.current = "from-end";
            changePage(page - 1);
        } else if (nextIndex >= files.length && hasNext) {
            nextIndexRef.current = nextIndex - files.length;
            changePage(page + 1);
        } else if (nextIndex >= 0 && nextIndex < files.length) {
            setIndex(nextIndex);
        }
    };

    return (
        <PreviewContext.Provider value={{preview, close: () => setIndex(-1)}}>
            {children}
            { index >= 0 && index < files.length && (
                <Preview
                    files={files}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    index={index}
                    changeIndex={changeIndex}
                    close={() => setIndex(-1)}
                />
            )}
        </PreviewContext.Provider>
    )
}

interface PreviewProps {
    files: ItemView[];
    hasPrevious: boolean;
    hasNext: boolean;
    index: number;
    changeIndex: (index: number) => void;
    close: () => void;
}

function Preview({files, hasPrevious, hasNext, index, changeIndex, close} : PreviewProps) {
    const node = useMemo(() => {
        const file = files[index];
        switch (file.fileType) {
            case "IMAGE": return <ImagePreview fileId={file.id} />
            case "VIDEO": return <VideoPreview fileId={file.id} />
            case "AUDIO": return <AudioPreview fileId={file.id} size={file.size} />
            default: return <div className="text-white p-4">Unsupported file type</div>;
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
            {(index > 0 || hasPrevious) && (
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
            {(index < files.length - 1 || hasNext) && (
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