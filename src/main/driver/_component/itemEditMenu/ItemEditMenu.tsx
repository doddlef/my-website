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
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import RenameDialog from "../RenameDialog/RenameDialog.tsx";
import {useState} from "react";
import {useSelected} from "../api/selectProvider/SelectedContext.ts";

type ItemEditMenuProps = {
    open: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function ItemEditMenu(props: ItemEditMenuProps) {
    const [openRename, setOpenRename] = useState(false);
    const { selected } = useSelected();

    if (!selected) return null;

    return (
        <>
            <Menu
                aria-label={"item edit menu"}
                open={props.open}
                onClose={props.onClose}
                anchorEl={props.anchorEl}
                sx={{'& .MuiPaper-root': {width: 300}}}
            >
                <MenuList>
                    <MenuItem>
                        <ListItemIcon>
                            {selected.folder ? <FolderOpenIcon /> : <FileOpenIcon />}
                        </ListItemIcon>
                        <ListItemText>open</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => {
                        setOpenRename(true);
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