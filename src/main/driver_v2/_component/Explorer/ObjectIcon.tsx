import {useSelected} from "../../_middleware/Explorer/Selected/SelectedContext.ts";
import React, {useMemo} from "react";
import {ItemView} from "../../definations.ts";
import Box from "@mui/material/Box";
import {NavigateFunction} from "react-router-dom";
import {getViewPicture} from "../../_lib/utils.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { motion } from "motion/react";
import Tooltip from "@mui/material/Tooltip";
import {useItemPreview} from "../../_middleware/Explorer/ItemPreview/ItemPreviewContext.ts";

type ObjectIconProps = {
    item: ItemView;
    navigate: NavigateFunction;
    itemMenu: (e: React.MouseEvent<HTMLElement>) => void;
}

export default function ObjectIcon({item, navigate, itemMenu} : ObjectIconProps) {
    const { selected, select, add, deselect } = useSelected();
    const { previewFile } = useItemPreview();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    return (
        <Box
            sx={{borderRadius: 2, bgcolor: "background.default"}}
            className={"flex items-center p-4 gap-4 shadow hover:shadow-lg transition duration-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}
            onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                    deselect(item.id);
                } else if(e.ctrlKey || e.metaKey) {
                    add(item);
                } else {
                    select(item);
                }
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
                itemMenu(e);
            }}
        >
            {isSelected ? (
                <motion.div
                    initial={{
                        scale: 1.4,
                        opacity: 0.4,
                        y: -4
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.2,
                        style: "spring"
                    }}
                >
                    <RadioButtonCheckedIcon width={"1.5rem"} height={"1.5rem"} color={"primary"}/>
                </motion.div>
                ) :
                <img src={getViewPicture(item.fileType)} alt="" className={"w-6 h-6"}/>
            }
            <Tooltip title={item.name}>
                <Typography
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    variant={"subtitle1"}
                    className={"flex-1"}
                >
                    {item.name}
                </Typography>
            </Tooltip>
            <IconButton onClick={(e) => {
                e.stopPropagation();
                select(item);
                itemMenu(e);
            }}>
                <MoreVertIcon/>
            </IconButton>
        </Box>
    );
}