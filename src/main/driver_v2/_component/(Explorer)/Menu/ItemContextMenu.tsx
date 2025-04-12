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
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useSelected from "../../../_middleware/Selected/SelectedContext.ts";
import useModals from "../../../_middleware/useModals/ModalsContext.ts";
import {NavigateFunction} from "react-router-dom";
import {useItemPreview} from "../../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";

type ItemEditMenuProps = {
    open: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
    navigate: NavigateFunction;
}

export default function ItemContextMenu({open, onClose, anchorEl, navigate}: ItemEditMenuProps) {
    const { changeModal } = useModals();
    const { previewFile } = useItemPreview();
    const selectedItem = useSelected().firstItem;

    if (!selectedItem) return null;

    return (
        <>
            <Menu
                aria-label={"item edit menu"}
                open={open}
                onClose={onClose}
                anchorEl={anchorEl}
                sx={{'& .MuiPaper-root': {width: 300}}}
            >
                <MenuList>
                    <MenuItem
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (!selectedItem) return;
                            if (selectedItem.folder) navigate(`/driver?folder=${selectedItem.id}`);
                            else previewFile(selectedItem.id);
                            onClose();
                        }}
                    >
                        <ListItemIcon>
                            {selectedItem.folder ? <FolderOpenIcon /> : <FileOpenIcon />}
                        </ListItemIcon>
                        <ListItemText>{selectedItem.folder ? "Enter" : "Preview"}</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={(e) => {
                        e.stopPropagation();
                        changeModal("rename");
                        onClose();
                    }}>
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
                    <MenuItem onClick={e => {
                        e.stopPropagation();
                        changeModal("delete");
                        onClose();
                    }}>
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