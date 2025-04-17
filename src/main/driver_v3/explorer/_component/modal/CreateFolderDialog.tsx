import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useCallback, useState} from "react";
import {enqueueSnackbar} from "notistack";
import Divider from "@mui/material/Divider";
import useFolderContent from "../../_hooks/useFolderContent.ts";
import {createFolder} from "../../../apis.ts";
import useFolderTree from "../../../_middleware/useFolderTree/useFolderTree.ts";

interface CreateFolderDialogProps {
    open: boolean;
    handleClose: () => void;
}

function CreateFolderDialog({open, handleClose}: CreateFolderDialogProps) {
    const [folderName, setFolderName] = useState<string>("");
    const { currentFolder, items, refresh } = useFolderContent();
    const { insert } = useFolderTree();

    const onClose = useCallback(() => {
        setFolderName("");
        handleClose();
    }, [handleClose])

    const [creating, setCreating] = useState(false);

    const handleCreate = useCallback((folderName: string) => {
        const name = folderName.trim();
        const parentFolder = currentFolder;

        if (!name || /[\\/]/.test(name)) {
            enqueueSnackbar("folder name cannot be empty, contains '\\' or '/'", {
                variant: "error",
            });
            return;
        }

        if (items.find(i => i.name === name)) {
            enqueueSnackbar("folder with same name already exists", {
                variant: "error",
            });
            return;
        }

        setCreating(true);
        createFolder(parentFolder, name)
            .then(r => {
                if (r.code === 0 && r.fields) {
                    enqueueSnackbar("create successfully.", {
                        variant: "success",
                    });
                    insert({id: r.fields.id, name: name, folderId: parentFolder})
                    refresh().catch(console.error);
                    onClose();
                } else {
                    enqueueSnackbar(r.message ?? "Failed to create folder", {
                        variant: "error",
                    });
                }
            })
            .finally(() => {
                setCreating(false);
            });
    }, [currentFolder, insert, items, onClose, refresh]);

    return (
        <Dialog
            keepMounted={false}
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !creating) handleCreate(folderName);
                    }}
                    disabled={folderName === "" || creating}
                    onClick={() => handleCreate(folderName)}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateFolderDialog;