import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import {useCallback, useMemo} from "react";
import Paper from "@mui/material/Paper";
import {restoreFromTrash} from "../../_lib/RecycleApi.ts";
import {enqueueSnackbar} from "notistack";
import useRecycleBin from "../../_middleware/(RecycleBin)/useRecycleBin/useRecycleBin.ts";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useModals from "../../_middleware/useModals/ModalsContext.ts";

export default function RecycleHeader() {
    const { selected } = useSelected();
    const { removeItem } = useRecycleBin();
    const { changeModal } = useModals();

    const handleRestore = useCallback(() => {
        const ids = selected.map(item => item.id);
        restoreFromTrash(ids)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    removeItem(ids)
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
            });
    }, [removeItem, selected]);

    const handleDeleteForever = useCallback(() => {
        changeModal("delete_forever");
    }, [changeModal]);

    const normalHeader = useMemo(
        () => <Typography variant={"h5"} className={"flex-1"}>Recycle Bin</Typography>, []
    )

    const editHeader = useMemo(
        () => (
            <Paper
                elevation={2}
                className={"w-full pl-12 pt-1 pb-1 flex gap-2 items-center"}
                sx={{borderRadius: 3}}
            >
                <Typography variant={"body1"}>{`${selected.length} selected`}</Typography>
                <IconButton onClick={handleRestore}>
                    <RestoreIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDeleteForever}>
                    <DeleteForeverIcon fontSize="small" />
                </IconButton>
            </Paper>
        ), [handleDeleteForever, handleRestore, selected.length]);

    return (
        <Box className={"w-full pl-4 min-h-12"}>
            {selected.length === 0 ? normalHeader : editHeader}
        </Box>
    );
}