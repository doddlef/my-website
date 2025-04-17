import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import useSelected from "../../../_middleware/Selected/SelectedContext.ts";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {deleteItems} from "../../../_api/CoreApi.ts";
import {enqueueSnackbar} from "notistack";
import {usePagination} from "../../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import {useDriverInfo} from "../../../_middleware/driverInfo/DriverInfoContext.ts";
import useFolderTree from "../../../_middleware/folderTree/useFolderTree.ts";

type DeleteDialogProps = {
    open: boolean;
    handleClose: () => void;
}

export default function DeleteItemDialog({open, handleClose}: DeleteDialogProps) {
    const { selected, clear } = useSelected();
    const { refresh, currentFolder } = usePagination();
    const { refreshInfo } = useDriverInfo();
    const { remove } = useFolderTree();

    const handleDelete = () => {
        const ids = selected.map(i => i.id);
        deleteItems(ids)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    clear(); // clear selected

                    if (selected.some(i => i.folderId === currentFolder)) {
                        refresh().catch(console.error);
                        selected.forEach(i => remove(i.id));
                    }

                    refreshInfo().catch(console.error);
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
                handleClose();
            })
            .catch(console.error);
    }

    return (
        <Dialog
            keepMounted={false}
            open={open} onClose={handleClose}
            sx={{"& .MuiPaper-root": {padding: 1}}}
        >
            <DialogTitle fontWeight={"bold"}>Delete</DialogTitle>
            <DialogContent>
                <Typography>
                    move item into trash? You can restore them at anytime
                </Typography>
                <Typography color={"warning"}>
                    This will not release storage immediately
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete} variant={"contained"}>confirm</Button>
            </DialogActions>
        </Dialog>
    )
}