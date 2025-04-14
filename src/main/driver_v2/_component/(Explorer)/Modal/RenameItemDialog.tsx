import {useCallback, useState} from "react";
import {enqueueSnackbar} from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {renameItem} from "../../../_api/CoreApi.ts";
import useSelected from "../../../_middleware/Selected/SelectedContext.ts";
import {usePagination} from "../../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import useFolderTree from "../../../_middleware/folderTree/useFolderTree.ts";

type RenameDialogProps = {
    open: boolean;
    handleClose: () => void;
}

export default function RenameItemDialog({open, handleClose}: RenameDialogProps) {
    const [name, setName] = useState<string>("");
    const { firstItem } = useSelected();
    const { items, update } = usePagination();
    const updateFolderTree = useFolderTree().update;

    const onClose = useCallback(() => {
        setName("");
        handleClose();
    }, [handleClose])

    const handleRename = useCallback(() => {
        if (!firstItem) {
            console.error("select item is empty");
            return;
        }

        if (name === firstItem.name) {
            enqueueSnackbar("name not change", {
                variant: "error",
            });
            return;
        }

        if (items.find(i => i.name === name)) {
            enqueueSnackbar("item with same name already exists", {
                variant: "error",
            });
            return;
        }

        renameItem(firstItem.id, name)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar("rename successfully", {
                        variant: "success",
                    });
                    update(firstItem.id, {name: name});
                    if (firstItem.folder) updateFolderTree(firstItem.id, {name: name});
                    onClose();
                } else {
                    enqueueSnackbar(r.message, {
                        variant: "error",
                    });
                }
            })
    }, [firstItem, items, name, onClose, update, updateFolderTree])

    return (
        <Dialog open={open} onClose={onClose}
                sx={{"& .MuiPaper-root": {width: 320}}}
        >
            <DialogTitle>Rename</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    required
                    type="text"
                    label="name"
                    variant={"standard"}
                    margin="dense"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button disabled={name === ""} onClick={handleRename}>
                    ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}