import React, {useCallback, useEffect, useMemo, useState} from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {usePagination} from "../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import {ItemView} from "../../definations.ts";
import {useNavigate} from "react-router-dom";
import ObjectIcon from "./ObjectIcon.tsx";
import ListContextMenu from "./Menu/ListContextMenu.tsx";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import ItemContextMenu from "./Menu/ItemContextMenu.tsx";
import useViewState from "../../_middleware/viewState/useViewState.ts";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ObjectRow from "./ObjectRow.tsx";

export default function ItemList() {
    const { items, folders, files } = usePagination();
    const { viewMethod } = useViewState();

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
    }, [])

    const gridView = useMemo(() => (
        <Grid className={"p-4 overflow-x-hidden"} container spacing={3}>
            {folders.length > 0 && (
                <Grid size={12}>
                    <Typography variant={"subtitle1"} color={"textSecondary"}>
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
                    <Typography variant={"subtitle1"} color={"textSecondary"}>
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

    const listView = useMemo(() => (
        <TableContainer>
            <Table className={"min-w-full"} stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: "5%"}}/>
                        <TableCell sx={{ width: '5%' }}/>
                        <TableCell sx={{ width: '45%'}} align={"left"}>name</TableCell>
                        <TableCell sx={{ width: '10%' }}/>
                        <TableCell align={"left"} sx={{ width: '20%' }}>last edited</TableCell>
                        <TableCell align={"left"} sx={{ width: '15%' }}>size</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {folders.map((folder: ItemView) =>
                        <ObjectRow key={folder.id} item={folder} navigate={navigate} itemMenu={itemMenu} />
                    )}
                    {files.map((file: ItemView) =>
                        <ObjectRow key={file.id} item={file} navigate={navigate} itemMenu={itemMenu} />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    ), [files, folders, itemMenu, navigate])

    const emptyView = useMemo(() => (
        <div className={"p-4 overflow-x-hidden flex w-full justify-center items-center"}>
            <Typography color={"textSecondary"}>No items yet</Typography>
        </div>
    ), [])

    useEffect(() => {
        clear();
    }, [clear, items])

    return (
        <Box
            className={"w-full max-w-full flex-1 overflow-y-auto pb-20"}
            onClick={clear}
            onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
                clear();
                openContextMenu(e);
            }}
        >
            { folders.length === 0 && files.length === 0 && emptyView }
            { viewMethod === "list" && listView }
            { viewMethod === "grid" && gridView}
            <ListContextMenu menuPosition={menuPosition} handleClose={closeContextMenu} />
            <ItemContextMenu open={itemMenuOpen} onClose={handleItemMenuClose} anchorEl={itemMenuEl} navigate={navigate} />
        </Box>
    );
}