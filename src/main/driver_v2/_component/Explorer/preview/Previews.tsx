import {ReactNode, useCallback, useMemo, useState} from "react";
import {ItemPreviewContext} from "../../../_middleware/Explorer/ItemPreview/ItemPreviewContext.ts";
import {usePagination} from "../../../_middleware/Explorer/Pagination/PaginationContext.ts";
import {FileType} from "../../../definations.ts";
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
}

function ItemPreviewProvider({children} : {children: ReactNode}) {
    const { files } = usePagination();
    const [items, setItems] = useState<FilePreview[]>([])
    const [index, setIndex] = useState<number>(-1)

    const previewFile = useCallback((id: number) => {
        const i = files.findIndex(i => i.id === id);
        setIndex(i);

        if (i === -1) setItems([]);
        else setItems(() => files.map(f => ({id: f.id, name: f.name, fileType: f.fileType, size: f.size})));
    }, [files]);

    return (
        <ItemPreviewContext.Provider
            value={{previewFile, close: () => setIndex(-1)}}
        >
            {children}
            {index >= 0 && index < items.length && <Previews files={items} index={index} setIndex={setIndex}/>}
        </ItemPreviewContext.Provider>
    );
}

interface ItemPreviewProps {
    files: FilePreview[];
    index: number;
    setIndex: (index: number) => void;
}

function Previews({files, index, setIndex}: ItemPreviewProps) {
    const node = useMemo(() => {
        // if (files[index].size > 1024 * 1024 * 40) return <div>file too large, file over 40Mb is not supported yet</div>;
        switch (files[index].fileType) {
            case "IMAGE": return <ImagePreview fileId={files[index].id} />;
            case "VIDEO": return <VideoPreview fileId={files[index].id} size={files[index].size} />;
            case "AUDIO": return <AudioPreview fileId={files[index].id} size={files[index].size} />;
        }
    }, [files, index])

    return (
        <div
            className={"w-screen h-screen z-40 bg-zinc-900 bg-opacity-95 absolute top-0 left-0 flex justify-center items-center"}
            onClick={(e) => {
                e.stopPropagation();
                setIndex(-1);
            }}
        >
            {
                index > 0 &&
                <div className={"absolute top-1/2 left-12"}>
                    <IconButton sx={{color: "white"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIndex(index - 1);
                                }}
                    >
                        <ArrowBackIosIcon fontSize={"large"}/>
                    </IconButton>
                </div>
            }
            <div onClick={(e) => e.stopPropagation()}>
                {node}
            </div>
            {
                index < files.length - 1 &&
                <div className={"absolute top-1/2 right-12"}>
                    <IconButton sx={{color: "white"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIndex(index + 1);
                                }}
                    >
                        <ArrowForwardIosIcon fontSize={"large"}/>
                    </IconButton>
                </div>
            }
        </div>
    );
}


export default ItemPreviewProvider;