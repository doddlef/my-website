import React, {useMemo, useState} from "react";
import {ItemView} from "../../_lib/defitions.ts";
import {useContentCache} from "../api/driverCache/ContentCache.ts";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import {ItemCard} from "../itemCard/ItemCard.tsx";
import MainContextMenu from "../MainContextMenu/MainContextMenu.tsx";
import ItemEditMenu from "../itemEditMenu/ItemEditMenu.tsx";
import {useSelected} from "../api/selectProvider/SelectedContext.ts";

function ItemTable() {
    const { items } = useContentCache();
    const { select } = useSelected();

    const navigate = useNavigate();
    const folders = useMemo(() => items.filter(f => f.folder), [items]);
    const files = useMemo(() => items.filter(f => !f.folder), [items]);

    const [menuPosition, setMenuPosition] = useState<{x: number, y: number} | null>(null);

    const [editMenuEl, setEditMenuEl] = useState<HTMLElement | null>(null);
    const [editItem, setEditItem] = useState<ItemView | null>(null);
    const editMenuOpen = useMemo(() => Boolean(editMenuEl), [editMenuEl]);
    const handleEditClose = () => {
        setEditMenuEl(null);
        setEditItem(null);
    }

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
                        <ItemCard
                            item={folder}
                            navigate={navigate}
                            openEdit={(event) => {
                                setEditMenuEl(event.currentTarget);
                                select(folder);
                            }}
                        />
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
                        <ItemCard
                            item={file}
                            navigate={navigate}
                            openEdit={(event) => {
                                setEditMenuEl(event.currentTarget);
                                select(file);
                            }}
                        />
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
            <ItemEditMenu open={editMenuOpen} onClose={handleEditClose} anchorEl={editMenuEl} />
            <MainContextMenu menuPosition={menuPosition} handleClose={handleClose} />
        </Box>
    );
}

export default ItemTable;