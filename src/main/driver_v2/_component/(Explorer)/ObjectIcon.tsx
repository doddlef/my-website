import {useSelected} from "../../_middleware/Selected/SelectedContext.ts";
import {useMemo} from "react";
import {ItemView} from "../../definations.ts";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {NavigateFunction} from "react-router-dom";
import {formatFileSize, formatSmartDate, getViewPicture} from "../../_lib/utils.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import {useItemPreview} from "../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";
import Paper from "@mui/material/Paper";

type ObjectIconProps = {
    item: ItemView;
    navigate: NavigateFunction;
    itemMenu: (anchor: HTMLElement) => void;
}

export default function ObjectIcon({item, navigate, itemMenu} : ObjectIconProps) {
    const { selected, select, add } = useSelected();
    const { previewFile } = useItemPreview();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    return (
        <Paper
            sx={{borderRadius: 2, bgcolor: "background.default", color: "text.primary", padding: 2, position: "relative"}}
            className={"cursor-pointer"}
            onClick={(e) => {
                e.stopPropagation();

                if (e.ctrlKey || e.metaKey) add(item);
                else select(item);
            }}

            onDoubleClick={(e) => {
                e.preventDefault();
                if (item.folder) navigate(`/driver?folder=${item.id}`);
                else previewFile(item.id);
            }}

            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation()
                select(item);
                itemMenu(e.currentTarget);
            }}
        >
            <div className={"absolute top-4 left-4"}>
                {isSelected && <CheckCircleOutlineIcon fontSize={"medium"} color={"primary"}/>}
            </div>
            <div className={"absolute top-4 right-4"}>
                <IconButton
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation()
                        select(item);
                        itemMenu(e.currentTarget);
                    }}
                    disabled={isSelected}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>
            <div className={"w-full p-4 flex justify-center items-center"}>
                <img src={getViewPicture(item.fileType)} alt={""} className={"h-24"}/>
            </div>
            <Tooltip title={item.name}>
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    variant={"subtitle1"}
                    align={"center"}
                >
                    {item.name}
                </Typography>
            </Tooltip>
            <Typography
                variant={"subtitle2"}
                sx={{color: "text.secondary"}}
                align={"center"}
            >
                {formatSmartDate(item.editedAt)} {item.size && ` | ${formatFileSize(item.size)}`}
            </Typography>
        </Paper>
    );
}