import Dialog from "@mui/material/Dialog";
import {useContentCache} from "../api/driverCache/ContentCache.ts";
import {useStructureApi} from "../api/structureApi/structureApiContext.ts";
import {ItemView} from "../../_lib/defitions.ts";
import {useCallback, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {enqueueSnackbar} from "notistack";

type RenameDialogProps = {
    open: boolean;
    handleClose: () => void;
    item: ItemView;
}

export default function RenameDialog(props: RenameDialogProps) {
    const { items, refresh } = useContentCache();
    const { renameItem } = useStructureApi();
    const [name, setName] = useState<string>("");

    const onClose = useCallback(() => {
        setName("");
        props.handleClose();
    }, [props])

    const handleRename = () => {
        if (!name || /[\\/]/.test(name)) {
            enqueueSnackbar("name cannot be empty, contains '\\' or '/'", {
                variant: "error",
            });
            return;
        }

        if (name === props.item.name) {
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

        renameItem(props.item.id, name)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar("rename successfully", {
                        variant: "success",
                    });
                    refresh();
                    onClose();
                } else {
                    enqueueSnackbar(r.message, {
                        variant: "error",
                    });
                }
            })
    }

    return (
        <Dialog open={props.open} onClose={onClose}>
            <DialogTitle>Rename</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Rename {props.item.name} to
                </DialogContentText>
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
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
}