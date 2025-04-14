import React, {useCallback, useEffect, useMemo, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {usePagination} from "../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import {useNavigate} from "react-router-dom";
import ListContextMenu from "./Menu/ListContextMenu.tsx";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import ItemContextMenu from "./Menu/ItemContextMenu.tsx";
import GridView from "./ListView/GridView.tsx";
import LoadingHolder from "../Placeholder/LoadingHolder.tsx";

export default function ItemList() {
    const { folders, files, remove, currentFolder, loading } = usePagination();
    const navigate = useNavigate();
    const { clear } = useSelected();

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
    const itemMenu = useCallback((anchor: HTMLElement) => {
        setItemMenuEl(anchor);
    }, []);

    const emptyView = useMemo(() => (
        <div className={"p-4 overflow-x-hidden flex w-full justify-center items-center"}>
            <Typography color={"textSecondary"}>No items yet</Typography>
        </div>
    ), [])

    useEffect(() => {
        clear();
    }, [clear, currentFolder])

    return (
        <Box
            sx={{bgcolor: "background.default"}}
            className={"w-full min-h-full h-full overflow-y-auto border border-b-0 dark:border-slate-950 rounded-t-xl "}
            onClick={clear}
            onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
                clear();
                openContextMenu(e);
            }}
        >
            { folders.length === 0 && files.length === 0 && emptyView }
            {
                loading
                    ? <LoadingHolder />
                    : <GridView
                        folders={folders}
                        files={files}
                        navigate={navigate}
                        itemMenu={itemMenu}
                        remove={remove}
                    />
            }

            <ListContextMenu menuPosition={menuPosition} handleClose={closeContextMenu} />
            <ItemContextMenu open={itemMenuOpen} onClose={handleItemMenuClose} anchorEl={itemMenuEl} navigate={navigate} />
        </Box>
    );
}