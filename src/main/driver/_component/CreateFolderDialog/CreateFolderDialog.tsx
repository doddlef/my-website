import Dialog from "@mui/material/Dialog";
import {useContentCache} from "../api/driverCache/ContentCache.ts";
import {useCallback, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useStructureApi} from "../api/structureApi/structureApiContext.ts";
import {enqueueSnackbar} from "notistack";

type CreateFolderDialogProps = {
    open: boolean;
    handleClose: () => void;
}

export default function CreateFolderDialog(props: CreateFolderDialogProps) {
    const { currentFolder, cachePut, refresh } = useContentCache();
    const { createFolder } = useStructureApi();
    const {open, handleClose} = props;
    const [folderName, setFolderName] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const onClose = useCallback(() => {
        setFolderName("");
        setError(false);
        handleClose();
    }, [handleClose]);

    const handleCreate = useCallback((folderName: string) => {
        createFolder(currentFolder, folderName)
            .then(r => {
                if (r.code === 0 && r.fields) {
                    cachePut({id: r.fields.id, folderId: currentFolder, type: "FOLDER", name: folderName, url: `/driver?folder=${r.fields.id}`});
                    enqueueSnackbar("create successfully.", {
                        variant: "success",
                    });
                    refresh();
                    onClose();
                } else {
                    enqueueSnackbar(r.message, {
                        variant: "error",
                    });
                    setError(true);
                }
            })
    }, [cachePut, createFolder, currentFolder, onClose, refresh]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Create a new folder
                </DialogContentText>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    error={error}
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