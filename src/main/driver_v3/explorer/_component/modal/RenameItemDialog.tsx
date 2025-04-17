import {useCallback, useEffect, useMemo, useState} from "react";
import {enqueueSnackbar} from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import useSelected from "../../../_middleware/useSelected/useSelected.ts";
import {ItemView} from "../../../definitions.ts";
import useFolderContent from "../../_hooks/useFolderContent.ts";
import {renameItem} from "../../../apis.ts";
import useFolderTree from "../../../_middleware/useFolderTree/useFolderTree.ts";

type RenameDialogProps = {
    item: ItemView;
    open: boolean;
    handleClose: () => void;
}

function RenameItemDialog({item, open, handleClose}: RenameDialogProps) {
    const [name, setName] = useState<string>("");
    const { items, update } = useFolderContent();
    const { update: updateFolderTree } = useFolderTree();

    useEffect(() => {
        if (open) setName(item.name);
    }, [item.name, open]);

    const onClose = useCallback(() => {
        setName("");
        handleClose();
    }, [handleClose])

    const handleRename = () => {
        const trimmed = name.trim();
        if (trimmed === item.name) {
            enqueueSnackbar("name not change", {
                variant: "error",
            });
            return;
        }

        if (items.find(i => i.name === trimmed)) {
            enqueueSnackbar("item with same name already exists", {
                variant: "error",
            });
            return;
        }

        renameItem(item.id, trimmed)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar("rename successfully", {
                        variant: "success",
                    });

                    update(item.id, {name: trimmed});
                    if (item.folder) updateFolderTree(item.id, {name: trimmed});

                    onClose();
                } else {
                    enqueueSnackbar(r.message, {
                        variant: "error",
                    });
                }
            })
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            keepMounted={false}
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
                <Button disabled={name === "" || name === item.name} onClick={handleRename}>
                    ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function Wrapper(props : Omit<RenameDialogProps, "item">) {
    const { selected } = useSelected();
    const { items } = useFolderContent();

    const item = useMemo(() => {
        const itemId = selected.size === 1 ? Array.from(selected)[0] : null;
        return items.find(i => i.id === itemId);
    }, [items, selected]);

    if (!item) return null;

    return <RenameItemDialog item={item} {...props} />;
}

export default Wrapper;