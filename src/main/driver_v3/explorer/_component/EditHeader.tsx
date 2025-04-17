import useSelected from "../../_middleware/useSelected/useSelected.ts";
import useModals from "../../_middleware/useModals/ModalsContext.ts";
import useFolderContent from "../_hooks/useFolderContent.ts";
import {useState} from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import {clsx} from "clsx";
import CachedIcon from "@mui/icons-material/Cached";
import useDriver from "../../_hooks/useDriver.ts";
import useFolderTree from "../../_middleware/useFolderTree/useFolderTree.ts";

function EditHeader() {
    const { selected, clear } = useSelected();
    const { changeModal } = useModals();

    const refreshFolderTree = useFolderTree().refresh;
    const refreshContent = useFolderContent().refresh;
    const refreshInfo = useDriver().refresh;
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        if (refreshing) return;
        setRefreshing(true)

        let count = 0;

        const onFinish = () => {
            count++;
            if (count == 3) setRefreshing(false);
        }

        refreshFolderTree().finally(onFinish);
        refreshContent().finally(onFinish);
        refreshInfo().finally(onFinish);
    }

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
                {selected.size} selected
            </Typography>
            <IconButton disabled={selected.size === 0}>
                <DownloadIcon fontSize={"small"}/>
            </IconButton>
            <IconButton
                disabled={selected.size === 0}
                onClick={() => changeModal("delete")}
            >
                <DeleteIcon fontSize={"small"} />
            </IconButton>
            <IconButton
                disabled={selected.size === 0}
                onClick={() => changeModal("move_item")}
            >
                <DriveFileMoveIcon fontSize={"small"}/>
            </IconButton>
            <IconButton
                disabled={refreshing}
                onClick={handleRefresh}
                className={clsx({"animate-spin": refreshing})}
            >
                <CachedIcon fontSize={"small"} />
            </IconButton>
        </Paper>
    );
}

export default EditHeader;