import React, {useCallback, useMemo, useState} from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {usePagination} from "../../_middleware/Explorer/Pagination/PaginationContext.ts";
import {ItemView} from "../../definations.ts";
import {useNavigate} from "react-router-dom";
import ObjectIcon from "./ObjectIcon.tsx";
import ListContextMenu from "./Menu/ListContextMenu.tsx";
import useSelected from "../../_middleware/Explorer/Selected/SelectedContext.ts";
import ItemContextMenu from "./Menu/ItemContextMenu.tsx";

type ViewMethod = "grid" | "list";

export default function ItemList() {
    const { folders, files } = usePagination();

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

    const [itemMenuEl, setItemMenuEl] = useState<HTMLElement | null>(null);
    const itemMenuOpen = useMemo(() => Boolean(itemMenuEl), [itemMenuEl]);
    const handleItemMenuClose = useCallback(() => {
        setItemMenuEl(null);
    }, []);
    const itemMenu = useCallback((e: React.MouseEvent<HTMLElement>) => {
        setItemMenuEl(e.currentTarget);
    }, [])



    const gridView = useMemo(() => (
        <Grid className={"p-4 overflow-x-hidden pb-24"} container spacing={3}>
            {folders.length > 0 && (
                <Grid size={12}>
                    <Typography variant={"subtitle2"} color={"textSecondary"}>
                        folders
                    </Typography>
                </Grid>
            )}
            {folders.map((folder: ItemView) => (
                <Grid size={3} key={folder.id}>
                    <ObjectIcon item={folder} navigate={navigate} itemMenu={itemMenu} />
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
                    <ObjectIcon item={file} navigate={navigate} itemMenu={itemMenu} />
                </Grid>
            ))}
        </Grid>
    ), [folders, files, navigate, itemMenu]);

    const emptyView = useMemo(() => (
        <div className={"w-full h-full flex items-center justify-center overflow-hidden"}>
            
        </div>
    ), [])

    return (
        <Box
            className={"w-full max-w-full max-h-full p-4 overflow-y-auto"}
            onClick={clear}
            onContextMenu={e => {
                e.preventDefault();
                clear();
                openContextMenu(e);
            }}
        >
            { folders.length === 0 && files.length === 0 && emptyView }
            {/*{ method === "list" && listView }*/}
            { method === "grid" && gridView}
            <ListContextMenu menuPosition={menuPosition} handleClose={closeContextMenu} />
            <ItemContextMenu open={itemMenuOpen} onClose={handleItemMenuClose} anchorEl={itemMenuEl} navigate={navigate} />
        </Box>
    );
}