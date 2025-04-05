import {ItemView} from "../../_lib/defitions.ts";
import Box from "@mui/material/Box";
import {getViewPicture} from "../../_lib/utils.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {NavigateFunction} from "react-router-dom";
import React from "react";

export const ItemCard = (
    { item, navigate, openEdit }
    : { item: ItemView, navigate: NavigateFunction, openEdit: (event: React.MouseEvent<HTMLButtonElement>) => void}) => {

    return (
        <Box
            sx={{borderRadius: 4, bgcolor: "background.default"}}
            className={"flex items-center p-4 gap-4 shadow hover:shadow-lg transition duration-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}
            onClick={() => {
                if (item.fileType === "FOLDER") navigate(`/driver?folder=${item.id}`)
            }}
        >
            <img src={getViewPicture(item.fileType)} alt="" className={"w-6 h-6"}/>
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
            <IconButton
                onClick={event => {
                    event.stopPropagation();
                    openEdit(event);
                }}
            >
                <MoreVertIcon/>
            </IconButton>
        </Box>
    );
}

