import React, {useMemo, useState} from "react";
import {ItemView} from "../../_lib/defitions.ts";
import {useContentCache} from "../api/driverCache/ContentCache.ts";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {ItemCard} from "../itemCard/ItemCard.tsx";
import MainContextMenu from "../MainContextMenu/MainContextMenu.tsx";
import {useUploadApi} from "../api/uploadApi2/UploadApiContext.ts";

function ItemTable() {
    const { items } = useContentCache();

    const navigate = useNavigate();
    const folders = useMemo(() => items.filter(f => f.folder), [items]);
    const files = useMemo(() => items.filter(f => !f.folder), [items]);

    const [menuPosition, setMenuPosition] = useState<{x: number, y: number} | null>(null);

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const { clientX, clientY } = event;

        const container = event.currentTarget.getBoundingClientRect();

        const menuX = Math.min(clientX, container.right - 200);  // Assume menu width is ~200px
        const menuY = Math.min(clientY, container.bottom - 200); // Assume menu height is ~200px

        setMenuPosition({ x: menuX, y: menuY });
    };

    const handleClose = () => {
        setMenuPosition(null);
    };

    return (
        <Box
            className={"w-full h-full overflow-y-auto"}
            onContextMenu={handleContextMenu}
        >
            <Grid className={"pl-8 pr-8"} container spacing={3}>
                {folders.length > 0 && (
                    <Grid size={12}>
                        <Typography variant={"subtitle2"} color={"textSecondary"}>
                            folders
                        </Typography>
                    </Grid>
                )}
                {folders.map((folder: ItemView) => (
                    <Grid size={3} key={folder.id}>
                        <ItemCard item={folder} navigate={navigate}/>
                    </Grid>
                ))}
                {files.length > 0 && (
                    <Grid size={12}>
                        <Typography variant={"subtitle2"} color={"textSecondary"}>
                            files
                        </Typography>
                    </Grid>
                )}
                {files.map((file: ItemView) => (
                    <Grid size={3} key={file.id}>
                        <ItemCard item={file} navigate={navigate}/>
                    </Grid>
                ))}
                {folders.length === 0 && files.length === 0 && (
                    <Grid size={12} className={"p-8"}>
                        <div className={"w-full flex flex-col items-center gap-2"}>
                            <img src={"/empty/empty.webp"} alt={""} />
                            <Typography variant={"h4"}>
                                This folder is empty ...
                            </Typography>
                        </div>
                    </Grid>
                )}
            </Grid>
            <TestUpload />
            <MainContextMenu menuPosition={menuPosition} handleClose={handleClose} />
        </Box>
    );
}

function TestUpload() {
    const { currentFolder } = useContentCache();
    const { upload, tasks, running } = useUploadApi();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (selectedFile && currentFolder) {
            try {
                const n = getNameAndExtension(selectedFile);
                await upload({ file: selectedFile, folder: currentFolder, ...n });
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("No file selected or current folder missing");
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                accept="*/*"
            />
            <button onClick={handleUpload} disabled={!selectedFile}>
                Upload File
            </button>
            <div>{running ? "running" : "idle"}</div>
            <div className={"flex gap-2"}>
                {tasks.map((task) => (
                    <div key={task.id}>{task.name}: {task.status}: {task.progress}</div>
                ))}
            </div>
        </div>
    );
}

const getNameAndExtension = (file: File) => {
    const i = file.name.lastIndexOf(".");
    if (i < 0 ) return {name: file.name, extension: ''}
    return {name: file.name.substring(0, i), extension: file.name.substring(i + 1)}
}

export default ItemTable;