import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import {useMemo} from "react";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import useModals from "../../_middleware/useModals/ModalsContext.ts";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export default function ViewHeader() {
    const { selected, clear } = useSelected();
    const { changeModal } = useModals();

    const editBar = useMemo(() => (
        <Paper
            elevation={2}
            sx={{borderRadius: 4, padding: "4px 12px"}}
            className={"flex gap-2 items-center"}
        >
            <IconButton onClick={clear}>
                <CloseIcon fontSize={"small"}/>
            </IconButton>
            <Typography variant={"subtitle1"}>
                {selected.length} selected
            </Typography>
            <IconButton>
                <DownloadIcon fontSize={"small"}/>
            </IconButton>
            <IconButton onClick={() => changeModal("delete")}>
                <DeleteIcon fontSize={"small"} />
            </IconButton>
            <IconButton>
                <DriveFileMoveIcon fontSize={"small"}/>
            </IconButton>
        </Paper>
    ), [changeModal, clear, selected.length])

    return (
        <header className={"flex items-center pl-4 pr-8 gap-16 h-14 mb-3 mt-3"}>
            {selected.length > 0 && editBar}
        </header>
    );
}