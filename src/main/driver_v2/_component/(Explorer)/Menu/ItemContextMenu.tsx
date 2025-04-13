import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ListItemText from "@mui/material/ListItemText";
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import IosShareIcon from '@mui/icons-material/IosShare';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useSelected from "../../../_middleware/Selected/SelectedContext.ts";
import useModals from "../../../_middleware/useModals/ModalsContext.ts";
import {NavigateFunction} from "react-router-dom";
import {useItemPreview} from "../../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";
import {moveItems} from "../../../_api/CoreApi.ts";
import {enqueueSnackbar} from "notistack";
import React from "react";
import {useContentCache} from "../../../_middleware/ContentCache/ContentCache.ts";
import {usePagination} from "../../../_middleware/(Explorer)/Pagination/PaginationContext.ts";

type ItemEditMenuProps = {
    open: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
    navigate: NavigateFunction;
}

export default function ItemContextMenu({open, onClose, anchorEl, navigate}: ItemEditMenuProps) {
    const { changeModal } = useModals();
    const { previewFile } = useItemPreview();
    const { clear, firstItem } = useSelected();
    const { getLabel } = useContentCache();
    const { remove } = usePagination();

    const handleMoveToParent = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!firstItem) return;

        const currentFolder = await getLabel(firstItem.folderId);
        if (!currentFolder) return;

        moveItems([firstItem.id], currentFolder.folderId)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    remove(firstItem.id);
                }
                else enqueueSnackbar(r.message, {variant: "error"});
            })
            .finally(() => {
                clear();
                onClose();
            })
    }

    const handleEnterOrPreview = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!firstItem) return;

        if (firstItem.folder) navigate(`/driver?folder=${firstItem.id}`);
        else previewFile(firstItem.id);

        clear();
        onClose();
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        changeModal("delete");
        onClose();
    }

    const handleRename = (e: React.MouseEvent) => {
        e.stopPropagation();
        changeModal("rename");
        onClose();
    }

    if (!firstItem) return null;

    return (
        <>
            <Menu
                aria-label={"item edit menu"}
                open={open && Boolean(firstItem)}
                onClose={onClose}
                anchorEl={anchorEl}
                sx={{'& .MuiPaper-root': {width: 300}}}
            >
                <MenuList>
                    <MenuItem onClick={handleEnterOrPreview}>
                        <ListItemIcon>
                            {firstItem.folder ? <FolderOpenIcon /> : <FileOpenIcon />}
                        </ListItemIcon>
                        <ListItemText>{firstItem.folder ? "Enter" : "Preview"}</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleRename}>
                        <ListItemIcon>
                            <DriveFileRenameOutlineIcon />
                        </ListItemIcon>
                        <ListItemText>rename</ListItemText>
                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                            abc
                        </Typography>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <DriveFileMoveIcon />
                        </ListItemIcon>
                        <ListItemText>move</ListItemText>
                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                            cba
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleMoveToParent}>
                        <ListItemIcon><ArrowCircleUpIcon /></ListItemIcon>
                        <ListItemText>move to parent</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText>delete</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <CloudDownloadIcon />
                        </ListItemIcon>
                        <ListItemText>download</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <IosShareIcon />
                        </ListItemIcon>
                        <ListItemText>share</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}