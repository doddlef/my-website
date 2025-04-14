import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import useModals from "../../_middleware/useModals/ModalsContext.ts";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export default function ViewHeader() {
    const { selected, clear } = useSelected();
    const { changeModal } = useModals();

    return (
        <Paper
            elevation={2}
            sx={{borderRadius: 4, padding: "4px 12px"}}
            className={"flex justify-between items-center"}
        >
            <IconButton onClick={clear}>
                <CloseIcon fontSize={"small"}/>
            </IconButton>
            <Typography variant={"subtitle2"}>
                {selected.length} selected
            </Typography>
            <IconButton disabled={selected.length === 0}>
                <DownloadIcon fontSize={"small"}/>
            </IconButton>
            <IconButton
                disabled={selected.length === 0}
                onClick={() => changeModal("delete")}
            >
                <DeleteIcon fontSize={"small"} />
            </IconButton>
            <IconButton disabled={selected.length === 0}>
                <DriveFileMoveIcon fontSize={"small"}/>
            </IconButton>
        </Paper>
    );
}