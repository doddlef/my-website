import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useCallback, useState} from "react";
import {usePagination} from "../../../_middleware/Pagination/PaginationContext.ts";
import {enqueueSnackbar} from "notistack";
import {createFolder} from "../../../_api/CoreApi.ts";
import Divider from "@mui/material/Divider";

interface CreateFolderDialogProps {
    open: boolean;
    handleClose: () => void;
}

export default function CreateFolderDialog({open, handleClose}: CreateFolderDialogProps) {
    const [folderName, setFolderName] = useState<string>("");
    const { currentFolder, items, refresh } = usePagination();

    const onClose = useCallback(() => {
        setFolderName("");
        handleClose();
    }, [handleClose])

    const handleCreate = useCallback((folderName: string) => {
        if (!folderName || /[\\/]/.test(folderName)) {
            enqueueSnackbar("folder name cannot be empty, contains '\\' or '/'", {
                variant: "error",
            });
            return;
        }

        if (items.find(i => i.name === folderName)) {
            enqueueSnackbar("folder with same name already exists", {
                variant: "error",
            });
            return;
        }

        createFolder(currentFolder, folderName)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar("create successfully.", {
                        variant: "success",
                    });
                    refresh();
                    onClose();
                } else {
                    enqueueSnackbar(r.message, {
                        variant: "error",
                    });
                }
            });
    }, [currentFolder, items, onClose, refresh]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{"& .MuiPaper-root": {width: 320}}}
        >
            <DialogTitle variant={"h5"}>Create Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    type={"text"}
                    label={"name"}
                    variant={"standard"}
                    margin="dense"
                    value={folderName}
                    onChange={e => setFolderName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Divider />
                <Button
                    disabled={folderName === ""}
                    onClick={() => handleCreate(folderName)}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}