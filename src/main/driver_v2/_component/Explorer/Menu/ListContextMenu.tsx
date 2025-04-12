import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Menu from "@mui/material/Menu";
import useModals from "../../../_middleware/useModals/ModalsContext.ts";
import {ChangeEvent, useCallback, useRef} from "react";
import {useUploadApi} from "../../../_middleware/uploadApi2/UploadApiContext.ts";
import {usePagination} from "../../../_middleware/(Explorer)/Pagination/PaginationContext.ts";

export type MainContextMenuProps = {
    menuPosition: { y: number; x: number } | null;
    handleClose: () => void;
}

export default function ListContextMenu({menuPosition, handleClose} : MainContextMenuProps) {
    const { changeModal } = useModals();
    const { currentFolder } = usePagination();
    const { upload } = useUploadApi();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            upload({file: file, folder: currentFolder})
                .then(() => console.log('adding into queue'))
                .catch(console.error);
        }
        event.target.value = "";
    }, [currentFolder, upload]);


    return (
        <>
            <Menu
                sx={{'& .MuiPaper-root': {borderRadius: 3, width: 200}}}
                anchorReference="anchorPosition"
                anchorPosition={menuPosition ? {top: menuPosition.y, left: menuPosition.x} : undefined}
                open={Boolean(menuPosition)}
                onClose={handleClose}
            >
                <MenuList>
                    <MenuItem onClick={() => {
                        changeModal("create_folder");
                        handleClose();
                    }}>
                        <ListItemIcon>
                            <CreateNewFolderIcon/>
                        </ListItemIcon>
                        <ListItemText>
                            new folder
                        </ListItemText>
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={() => {
                        handleFileClick();
                        handleClose();
                    }}>
                        <ListItemIcon>
                            <UploadFileIcon/>
                        </ListItemIcon>
                        <ListItemText>
                            upload file
                        </ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
            <input type={"file"} className={"hidden"} ref={fileInputRef} onChange={handleFileChange}/>
        </>
    );
}