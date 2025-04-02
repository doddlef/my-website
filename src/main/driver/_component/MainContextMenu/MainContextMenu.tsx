import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Menu from "@mui/material/Menu";
import {useState} from "react";
import CreateFolderDialog from "../CreateFolderDialog/CreateFolderDialog.tsx";

export type MainContextMenuProps = {
    menuPosition: { y: number; x: number } | null;
    handleClose: () => void;
}

export default function MainContextMenu(props : MainContextMenuProps) {
    const {menuPosition, handleClose} = props;
    const [openCreateFolder, setOpenCreateFolder] = useState(false);
    return (
        <>
            <Menu
                sx={{'& .MuiPaper-root': {borderRadius: 3, width: 200}}}
                anchorReference="anchorPosition"
                anchorPosition={menuPosition ? { top: menuPosition.y, left: menuPosition.x } : undefined}
                open={Boolean(menuPosition)}
                onClose={handleClose}
            >
                <MenuList>
                    <MenuItem onClick={() => {
                        setOpenCreateFolder(true);
                        handleClose();
                    }}>
                        <ListItemIcon>
                            <CreateNewFolderIcon />
                        </ListItemIcon>
                        <ListItemText>
                            new folder
                        </ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => alert("upload file")} >
                        <ListItemIcon>
                            <UploadFileIcon />
                        </ListItemIcon>
                        <ListItemText>
                            upload file
                        </ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>

            <CreateFolderDialog open={openCreateFolder} handleClose={() => setOpenCreateFolder(false)} />
        </>
    );
}