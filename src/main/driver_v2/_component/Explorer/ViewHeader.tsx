import AppsIcon from '@mui/icons-material/Apps';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React, {useMemo} from "react";
import ToggleButton from "@mui/material/ToggleButton";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import useModals from "../../_middleware/useModals/ModalsContext.ts";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useViewState, { ViewMethod } from "../../_middleware/viewState/useViewState.ts";

export default function ViewHeader() {
    const { viewMethod, setViewMethod } = useViewState();
    const { selected, clear } = useSelected();
    const { changeModal } = useModals();

    const handleAlignment = (
        _: React.MouseEvent<HTMLElement>,
        newAlignment: ViewMethod | null
    ) => {
        if (newAlignment != null) setViewMethod(newAlignment);
    };

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
        <header className={"w-full flex items-center pl-4 pr-8 gap-16 h-12"}>
            <div className={"flex-1"}>
                {selected.length > 0 && editBar}
            </div>
            <ToggleButtonGroup
                value={viewMethod}
                exclusive
                onChange={handleAlignment}
                color={"primary"}
                size={"small"}
            >
                <ToggleButton value={"grid"}>
                    <AppsIcon />
                </ToggleButton>
                <ToggleButton value={"list"}>
                    <MenuIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </header>
    );
}