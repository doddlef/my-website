import {BinItemView} from "../../definations.ts";
import Paper from "@mui/material/Paper";
import useSelected from "../../_middleware/Selected/SelectedContext.ts";
import {useMemo} from "react";
import {formatFileSize, formatSmartDate, getViewPicture} from "../../_lib/utils.ts";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type ObjectIconProps = {
    item: BinItemView;
    itemMenu: (anchor: HTMLElement) => void;
}

export default function ObjectIcon({item, itemMenu} : ObjectIconProps) {
    const { select, selected, add } = useSelected();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 4,
                bgcolor: "background.default",
                color: "text.primary",
                padding: 2,
                position: "relative",
            }}
            className={"cursor-pointer"}

            onClick={(e) => {
                e.stopPropagation();
                if (e.ctrlKey || e.metaKey) add(item)
                else select(item);
            }}

            onContextMenu={(e) => {
                e.stopPropagation();
                e.preventDefault();
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
                    <MoreVertIcon/>
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
                    variant={"body1"}
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
                {formatSmartDate(item.deletedAt)} {item.size && ` | ${formatFileSize(item.size)}`}
            </Typography>
        </Paper>
    );
}