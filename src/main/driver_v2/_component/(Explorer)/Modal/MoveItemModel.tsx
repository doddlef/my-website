import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useFolderTree, {FolderLabel} from "../../../_middleware/folderTree/useFolderTree.ts";
import useSelected from "../../../_middleware/Selected/SelectedContext.ts";
import {usePagination} from "../../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import React, {useEffect, useState} from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {contentApi, moveItems} from "../../../_api/CoreApi.ts";
import {ItemView} from "../../../definations.ts";
import {enqueueSnackbar} from "notistack";
import { FixedSizeList } from 'react-window';

interface MoveItemDialogProps {
    open: boolean;
    handleClose: () => void;
}

export default function MoveItemModel({open, handleClose}: MoveItemDialogProps) {
    const { currentFolder, refresh } = usePagination();
    const { getPath, update } = useFolderTree();
    const { selected, clear } = useSelected();

    const [chosenFolder, setChosenFolder] = useState<number | null>(null);
    const [path, setPath] = useState<FolderLabel[]>([]);

    const [items, setItems] = useState<ItemView[]>([]);

    useEffect(() => {
        if (open) setChosenFolder(currentFolder);
    }, [currentFolder, open]);

    useEffect(() => {
        if (!chosenFolder) return;

        getPath(chosenFolder).then(setPath);
        contentApi(chosenFolder, {pageNum: 1, pageSize: 100})
            .then(r => {
                if (r.code === 0) {
                    setItems(r.fields.list);
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                    setItems([]);
                }
            })
    }, [chosenFolder, getPath]);

    const handleMove = () => {
        const ids = selected.map(item => item.id);
        if (ids.length < 1 || !chosenFolder) return;

        moveItems(ids, chosenFolder)
            .then(r => {
                if (r.code === 0) {
                    enqueueSnackbar(r.message, {variant: "success"});
                    refresh().catch(console.error);
                    ids.forEach(id => update(id, {folderId: chosenFolder}));
                } else {
                    enqueueSnackbar(r.message, {variant: "error"});
                }
                clear();
                handleClose();
            });
    }

    return (
        <Dialog
            keepMounted={false}
            maxWidth={"md"}
            open={open} onClose={handleClose}
            sx={{"& .MuiPaper-root": {borderRadius: 4, padding: 4}}}
        >
            <DialogTitle variant={"h5"}>Move Item</DialogTitle>
            <DialogContent className={"flex flex-col gap-2"}>
                <Breadcrumbs className={"min-h-12"}>
                    {path.map((label) => (
                        label.id === chosenFolder
                            ? (
                                <Typography key={label.id}>
                                    {label.name}
                                </Typography>
                            )
                            : (
                                <Button
                                    key={label.id}
                                    variant={"text"}
                                    onClick={() => setChosenFolder(label.id)}
                                >
                                    {label.name}
                                </Button>
                            )
                    ))}
                </Breadcrumbs>
                <Box sx={{minWidth: 600}} className={"border rounded-l p-2"}>
                    <FixedSizeList
                        height={400}
                        width={"100%"}
                        itemSize={46}
                        itemCount={items.length}
                        overscanCount={5}
                    >
                        {({ index, style }) => (
                            <FolderRow
                                key={index}
                                style={style}
                                item={items[index]}
                                choose={setChosenFolder}
                            />
                        )}
                    </FixedSizeList>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>cancel</Button>
                <Button onClick={handleMove}>move</Button>
            </DialogActions>
        </Dialog>
    );
}

import FolderIcon from '@mui/icons-material/Folder';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogActions from "@mui/material/DialogActions";

function FolderRow({
                       style,
                       item,
                       choose,
                   }: {
    style: React.CSSProperties;
    item: ItemView;
    choose: (id: number) => void;
}) {
    return (
        <ListItem style={style} component="div" disablePadding>
            <ListItemButton onClick={() => choose(item.id)} disabled={!item.folder}>
                {item.folder && <FolderIcon sx={{ mr: 1 }} />}
                <ListItemText primary={item.name} className={"overflow-hidden whitespace-nowrap text-ellipsis"}/>
            </ListItemButton>
        </ListItem>
    );
}