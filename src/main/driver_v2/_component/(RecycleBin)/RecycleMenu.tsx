import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ListItemIcon from "@mui/material/ListItemIcon";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import {restoreFromTrash} from "../../_lib/RecycleApi.ts";
import {enqueueSnackbar} from "notistack";
import useRecycleBin from "../../_middleware/(RecycleBin)/useRecycleBin/useRecycleBin.ts";
import useModals from "../../_middleware/useModals/ModalsContext.ts";

type RecycleMenuProps = {
    open: boolean;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

export default function RecycleMenu({open, onClose, anchorEl}: RecycleMenuProps) {
    const { selected, clear } = useSelected();
    const { removeItem } = useRecycleBin();
    const { changeModal } = useModals();

    const handleRestore = () => {
        const ids = selected.map(item => item.id);
        restoreFromTrash(ids)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    clear();
                    removeItem(ids)
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
            });

        onClose();
    }

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorEl={anchorEl}
            sx={{'& .MuiPaper-root': {width: 260}}}
        >
            <MenuList>
                <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleRestore();
                }}>
                    <ListItemIcon><RestoreIcon /></ListItemIcon>
                    <ListItemText>restore</ListItemText>
                </MenuItem>
                <MenuItem onClick={(e) => {
                    e.stopPropagation();
                    changeModal("delete_forever");
                    onClose();
                }}>
                    <ListItemIcon><DeleteForeverIcon /></ListItemIcon>
                    <ListItemText>delete forever</ListItemText>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}