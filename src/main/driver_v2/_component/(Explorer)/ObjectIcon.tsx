import { useSelected } from "../../_middleware/Selected/SelectedContext.ts";
import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { ItemView } from "../../definations.ts";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { NavigateFunction } from "react-router-dom";
import {
    formatFileSize,
    formatSmartDate,
    getViewPicture,
} from "../../_lib/utils.ts";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import { useItemPreview } from "../../_middleware/(Explorer)/ItemPreview/ItemPreviewContext.ts";
import Paper from "@mui/material/Paper";

type ObjectIconProps = {
    item: ItemView;
    navigate: NavigateFunction;
    itemMenu: (anchor: HTMLElement) => void;
};

export default function ObjectIcon({ item, navigate, itemMenu }: ObjectIconProps) {
    const { selected, select, add } = useSelected();
    const { previewFile } = useItemPreview();
    const isSelected = useMemo(() => selected.some(i => i.id === item.id), [item.id, selected]);

    const nameRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        if (el) {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        }
    }, [item.name]);

    // === Event Handlers ===

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) add(item);
        else select(item);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if(item.folder) navigate(`/driver?folder=${item.id}`)
        else previewFile(item.id);
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        select(item);
        itemMenu(e.currentTarget);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if(item.folder) navigate(`/driver?folder=${item.id}`)
            else previewFile(item.id);
        }
    };

    const handleMenuClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            select(item);
            itemMenu(e.currentTarget);
        },
        [item, select, itemMenu]
    );

    return (
        <Paper
            role="button"
            tabIndex={0}
            sx={{
                borderRadius: 2,
                bgcolor: "background.default",
                color: "text.primary",
                padding: 2,
                position: "relative",
                outline: "none",
                borderWidth: "1px",
                borderColor: "transparent",
                "&:focus": {borderColor: "primary.main"},
            }}
            className="cursor-pointer"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
            onKeyDown={handleKeyDown}
        >
            {/* Selected Icon */}
            <div className="absolute top-4 left-4">
                {isSelected && <CheckCircleOutlineIcon fontSize="medium" color="primary" />}
            </div>

            {/* Context Menu Icon */}
            <div className="absolute top-4 right-4">
                <IconButton
                    onClick={handleMenuClick}
                    disabled={selected.length > 0}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>

            {/* File Icon */}
            <div className="w-full p-4 flex justify-center items-center">
                <img
                    src={getViewPicture(item.fileType) ?? "/default-icon.png"}
                    alt={item.name}
                    className="h-24"
                    loading="lazy"
                />
            </div>

            {/* File Name (with optional Tooltip) */}
            <Tooltip title={item.name} disableHoverListener={!isTruncated}>
                <Typography
                    ref={nameRef}
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    variant="subtitle1"
                    align="center"
                >
                    {item.name}
                </Typography>
            </Tooltip>

            {/* Metadata */}
            <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary" }}
                align="center"
            >
                {formatSmartDate(item.editedAt)} {item.size && ` | ${formatFileSize(item.size)}`}
            </Typography>
        </Paper>
    );
}