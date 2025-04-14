import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import useModals from "../../_middleware/useModals/ModalsContext.ts";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CachedIcon from '@mui/icons-material/Cached';
import {useState} from "react";
import {clsx} from "clsx";
import {usePagination} from "../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import useFolderTree from "../../_middleware/folderTree/useFolderTree.ts";
import {useDriverInfo} from "../../_lib/driverInfo/DriverInfoContext.ts";

export default function ViewHeader() {
    const { selected, clear } = useSelected();
    const { changeModal } = useModals();

    const pageRefresh = usePagination().refresh;
    const folderTreeRefresh = useFolderTree().refresh;
    const driverInfoRefresh = useDriverInfo().refreshInfo;
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        if (refreshing) return;
        setRefreshing(true)

        let count = 0;

        const onFinish = () => {
            count++;
            if (count == 3) setRefreshing(false);
        }

        pageRefresh().finally(onFinish);
        folderTreeRefresh().finally(onFinish);
        driverInfoRefresh().finally(onFinish);
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
            <IconButton
                disabled={selected.length === 0}
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