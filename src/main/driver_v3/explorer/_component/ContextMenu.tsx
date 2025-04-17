import useModals from "../../_middleware/useModals/ModalsContext.ts";
import Menu from "@mui/material/Menu";
import useMenu from "../../_middleware/useMenu/useMenu.ts";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {ChangeEvent, useCallback, useRef} from "react";
import {enqueueSnackbar} from "notistack";
import useFolderContent from "../_hooks/useFolderContent.ts";
import {useUploadApi} from "../../_middleware/uploadApi2/UploadApiContext.ts";

interface ContextMenuProps {
    menuPosition: { y: number; x: number } | null;
}

function ContextMenu({menuPosition}: ContextMenuProps) {
    const { open, state, closeMenu } = useMenu();
    const { currentFolder } = useFolderContent();
    const { upload } = useUploadApi();
    const { changeModal } = useModals();

    const handleClose = useCallback(() => {
        closeMenu();
    }, [closeMenu]);

    /*****************************empty part***************************************/

    const handleCreateFolder = useCallback(() => {
        changeModal("create_folder");
        handleClose();
    }, [changeModal, handleClose]);

    /*****************************upload part***************************************/

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileClick = useCallback(() => {
        fileInputRef.current?.click();
        closeMenu();
    }, []);
    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files?.length && currentFolder) {
            Array.from(files).forEach(file => {
                upload({ file, folder: currentFolder }).then(() => console.log(`Added ${file.name} to queue`));
            });
        } else {
            enqueueSnackbar("Must specify a folder", { variant: "error" });
        }
        event.target.value = "";
    }, [currentFolder, upload]);

    return (
        <>
            <Menu
                sx={{'& .MuiPaper-root': {borderRadius: 2, width: 200}}}
                open={open}
                onClose={handleClose}

                anchorReference="anchorPosition"
                anchorPosition={menuPosition ? {top: menuPosition.y, left: menuPosition.x} : undefined}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                {state === "empty" && (
                    <MenuList>
                        <MenuItem onClick={handleCreateFolder}>
                            <ListItemIcon>
                                <CreateNewFolderIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                new folder
                            </ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleFileClick}>
                            <ListItemIcon>
                                <UploadFileIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                upload file
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                )}
            </Menu>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
            />
        </>
    )
}

export default ContextMenu;