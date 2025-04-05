import React, {useMemo, useState} from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {usePagination} from "../../_middleware/Pagination/PaginationContext.ts";
import {ItemView} from "../../definations.ts";
import {useNavigate} from "react-router-dom";
import ObjectIcon from "./ObjectIcon.tsx";
import ListContextMenu from "./Menu/ListContextMenu.tsx";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";

type ViewMethod = "grid" | "list";

export default function ItemList() {
    const { items } = usePagination();
    const folders = useMemo(() => items.filter(i => i.folder), [items]);
    const files = useMemo(() => items.filter(i => !i.folder), [items]);
    const navigate = useNavigate();

    const { clear } = useSelected();

    const [method, setMethod] = useState<ViewMethod>("grid");

    const [menuPosition, setMenuPosition] = useState<{x: number, y: number} | null>(null);
    const openContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        const { clientX, clientY } = event;

        const container = event.currentTarget.getBoundingClientRect();

        const menuX = Math.min(clientX, container.right - 200);
        const menuY = Math.min(clientY, container.bottom - 200);

        setMenuPosition({ x: menuX, y: menuY });
    }
    const closeContextMenu = () => {
        setMenuPosition(null);
    }

    const gridView = useMemo(() => (
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
                    <ObjectIcon item={folder} navigate={navigate} />
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
                    <ObjectIcon item={file} navigate={navigate} />
                </Grid>
            ))}
        </Grid>
    ), [folders, files, navigate]);

    const emptyView = useMemo(() => (
        <div className={"w-full h-full flex flex-col items-center gap-2"}>
            <img src={"/empty/empty.webp"} alt={""}/>
            <Typography variant={"h4"}>
                This folder is empty ...
            </Typography>
        </div>
    ), [])

    return (
        <Box
            className={"w-full h-full overflow-y-auto"}
            onClick={clear}
            onContextMenu={e => {
                e.preventDefault();
                openContextMenu(e);
            }}
        >
            { folders.length === 0 && files.length === 0 && emptyView }
            {/*{ method === "list" && listView }*/}
            { method === "grid" && gridView}
            <ListContextMenu menuPosition={menuPosition} handleClose={closeContextMenu} />
        </Box>
    );
}