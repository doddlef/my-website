import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatFileSize, formatSmartDate, getViewPicture } from "../_lib/utils.ts";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Paper, {PaperProps} from "@mui/material/Paper";
import React, { useEffect, useRef, useState } from "react";
import {FileType} from "../definations.ts";

type ObjectIconProps = {
    handleClick?: (e: React.MouseEvent<HTMLElement>) => void;
    handleDoubleClick?: (e: React.MouseEvent<HTMLElement>) => void;
    handleContextMenu?: (e: React.MouseEvent<HTMLElement>) => void;
    handleKeyDown?: (e: React.KeyboardEvent) => void;
    handleMenuClick?: (e: React.MouseEvent<HTMLElement>) => void;

    fileType: FileType;
    name: string;
    size?: number | null;
    time?: string | null;

    isSelected?: boolean;
    disableEditIcon?: boolean;
} & Omit<PaperProps, "children">;

export default function ObjectIcon({
                                        handleClick=()=>{},
                                        handleDoubleClick=()=>{},
                                        handleContextMenu=()=>{},
                                        handleKeyDown=()=>{},
                                        handleMenuClick=()=>{},
                                        name,
                                        fileType,
                                        size,
                                        time,
                                        isSelected,
                                        disableEditIcon,
                                        ...paperProps
                                   }: ObjectIconProps) {
    const nameRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        }
    }, [name]);

    return (
        <Paper
            component="div"
            tabIndex={0}
            role="button"
            sx={{
                borderRadius: 2,
                bgcolor: "background.default",
                color: "text.primary",
                padding: 2,
                position: "relative",
                outline: "none",
                border: "1px solid transparent",
                textAlign: "center",
                "&:focus": { borderColor: "primary.main" },
                "&:hover": { borderColor: "primary.main" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                height: "100%",
                width: "100%",
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
            onKeyDown={handleKeyDown}
            className="cursor-pointer"

            {...paperProps}
        >
            {/* Selected Icon */}
            {isSelected && (
                <div className="absolute top-2 left-2">
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                </div>
            )}

            {/* Menu */}
            <div className="absolute top-2 right-2">
                <IconButton size="small" onClick={handleMenuClick} disabled={disableEditIcon} tabIndex={-1}>
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            </div>

            {/* File Icon */}
            <img
                src={getViewPicture(fileType)}
                alt={name}
                className="h-20 my-2"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.src = "/default-icon.png";
                }}
            />

            {/* File Name */}
            <Tooltip title={name} disableHoverListener={!isTruncated}>
                <Typography
                    ref={nameRef}
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                        fontWeight: 500,
                    }}
                    variant="subtitle1"
                >
                    {name}
                </Typography>
            </Tooltip>

            {/* Meta */}
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {time ? formatSmartDate(time) : "Unknown"}
                {size && ` · ${formatFileSize(size)}`}
            </Typography>
        </Paper>
    );
}