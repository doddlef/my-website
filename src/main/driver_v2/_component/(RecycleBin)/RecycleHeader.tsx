import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import {useCallback} from "react";
import Paper from "@mui/material/Paper";
import {restoreFromTrash} from "../../_api/RecycleApi.ts";
import {enqueueSnackbar} from "notistack";
import useRecycleBin from "../../_middleware/(RecycleBin)/useRecycleBin/useRecycleBin.ts";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useModals from "../../_middleware/useModals/ModalsContext.ts";
import CloseIcon from "@mui/icons-material/Close";

export default function RecycleHeader() {
    const { selected, clear } = useSelected();
    const { removeItem } = useRecycleBin();
    const { changeModal } = useModals();

    const handleRestore = useCallback(() => {
        const ids = selected.map(item => item.id);
        restoreFromTrash(ids)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    removeItem(ids);
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
                clear();
            });
    }, [clear, removeItem, selected]);

    const handleDeleteForever = useCallback(() => {
        changeModal("delete_forever");
    }, [changeModal]);

    return (
        <Box className={"w-full pl-4 min-h-12"}>
            <Paper
                elevation={2}
                className={"w-full p-1 flex justify-around gap-2 items-center"}
                sx={{borderRadius: 3}}
            >
                <IconButton onClick={clear}>
                    <CloseIcon fontSize={"small"}/>
                </IconButton>
                <Typography variant={"body1"}>{`${selected.length} selected`}</Typography>
                <IconButton onClick={handleRestore} disabled={!selected.length}>
                    <RestoreIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDeleteForever} disabled={!selected.length}>
                    <DeleteForeverIcon fontSize="small" />
                </IconButton>
            </Paper>
        </Box>
    );
}