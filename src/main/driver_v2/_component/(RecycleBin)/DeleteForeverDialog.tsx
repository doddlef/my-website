import useModals from "../../_middleware/useModals/ModalsContext.ts";
import {useCallback} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {deleteForever} from "../../_lib/RecycleApi.ts";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import useRecycleBin from "../../_middleware/(RecycleBin)/useRecycleBin/useRecycleBin.ts";
import {enqueueSnackbar} from "notistack";

export default function DeleteForeverDialog() {
    const { modal, changeModal } = useModals();
    const { selected, clear } = useSelected();
    const { removeItem } = useRecycleBin();

    const handleClose = useCallback(() => {
        changeModal(null);
    }, [changeModal]);

    const handleDeleteForever = useCallback(() => {
        const ids = selected.map(i => i.id);
        deleteForever(ids)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    clear();
                    removeItem(ids);
                    handleClose();
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                    handleClose();
                }
            })
            .catch(console.error);
    }, [clear, handleClose, removeItem, selected]);

    return (
        <Dialog
            open={modal === "delete_forever"}
            onClose={handleClose}
            sx={{"& .MuiPaper-root": {padding: 1}}}
        >
            <DialogTitle fontWeight={"bold"}>Delete Forever</DialogTitle>
            <DialogContent>
                <Typography>
                    This will delete these items forever, and release storage immediately.
                </Typography>
                <Typography color={"warning"}>
                    This action cannot be undo.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteForever} variant={"contained"} color={"warning"}>confirm</Button>
            </DialogActions>
        </Dialog>
    );
}