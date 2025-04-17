import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import clsx from "clsx";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";
import Typography from "@mui/material/Typography";
import React, {useMemo} from "react";
import {TreeItem2, TreeItem2Props} from "@mui/x-tree-view/TreeItem2";
import {useTreeItem2Utils} from "@mui/x-tree-view/hooks";
import useFolderTree, {FolderNode} from "../../_middleware/useFolderTree/useFolderTree.ts";
import {TreeViewBaseItem} from "@mui/x-tree-view/models";
import useDriver from "../../_hooks/useDriver.ts";
import {RichTreeView} from "@mui/x-tree-view/RichTreeView";

import "../../../../_fonts/jersey.css";

type iconString = "home" | "bin" | "img" | "music" | "video";

const getIconFormIconString = (icon?: iconString) => {
    switch (icon) {
        case "home":
            return DriveEtaOutlinedIcon;
        case "bin":
            return DeleteOutlinedIcon;
        case "img":
            return InsertPhotoOutlinedIcon;
        case "music":
            return MusicNoteOutlinedIcon;
        case "video":
            return VideoCameraBackOutlinedIcon;
        default:
            return FolderOutlinedIcon;
    }
}

interface CustomLabelProps {
    children: string;
    className: string;
    icon?: iconString;
    url?: string;
}

function CustomLabel({ children, className, icon, url }: CustomLabelProps) {
    return (
        <Box
            component={Link}
            className={clsx(className, "flex items-center gap-1")}
            to={url ?? ''}
        >
            <Box
                component={getIconFormIconString(icon)}
                className="labelIcon"
                color="inherit"
                sx={{ mr: 1, fontSize: '1.2rem' }}
            />

            <Typography fontFamily={"Jersey 15"}>{children}</Typography>
        </Box>
    );
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: TreeItem2Props,
    ref: React.Ref<HTMLLIElement>,
) {
    const { publicAPI } = useTreeItem2Utils({
        itemId: props.itemId,
        children: props.children,
    });

    const item = publicAPI.getItem(props.itemId);

    return (
        <TreeItem2
            {...props}
            ref={ref}
            slots={{
                label: CustomLabel,
            }}
            slotProps={{
                label: {url: item?.url || '', icon: item.icon } as CustomLabelProps,
            }}
        />
    );
});

type NavTreeItem = {
    id: string;
    label: string;
    icon?: iconString;
    url?: string;
}

const buildUpTree = (cache: Map<number, FolderNode>, rootFolder: number): TreeViewBaseItem<NavTreeItem>[] => {
    const idToNode = new Map<number, TreeViewBaseItem<NavTreeItem>>();
    const roots: TreeViewBaseItem<NavTreeItem>[] = [];

    cache.forEach(node => {
        idToNode.set(node.id, {
            id: `${node.id}`,
            label: node.name,
            url: `/driver?folder=${node.id}`,
            children: [],
        });
    });

    cache.forEach(folder => {
        if (folder.id === rootFolder) return;

        const node = idToNode.get(folder.id);
        if (!node) return;

        if (folder.folderId != null) {
            if (folder.folderId === rootFolder) roots.push(node);
            else {
                const parentNode = idToNode.get(folder.folderId);
                if (parentNode) {
                    (parentNode.children as TreeViewBaseItem[]).push(node);
                }
            }

        } else {
            roots.push(node);
        }
    });

    return roots;
}

const ROOT_NODE = [
    {
        id: "trash",
        label: "trash",
        icon: "bin",
        url: "/driver/bin",
    },
    {
        id: "video",
        label: "video",
        icon: "video",
    },
    {
        id: "music",
        label: "music",
        icon: "music",
    },
    {
        id: "image",
        label: "image",
        icon: "image",
    }
] as TreeViewBaseItem<NavTreeItem>[]

function TreeNav() {
    const { map } = useFolderTree();
    const { rootFolder } = useDriver();

    const roots = useMemo(() => {
        const primaryFolder = buildUpTree(map, rootFolder);

        const rootFolderNode = {
            id: `${rootFolder}`,
            label: "My Drive",
            url: `/driver?folder=${rootFolder}`,
            children: primaryFolder,
        } as TreeViewBaseItem<NavTreeItem>;

        return [rootFolderNode, ...ROOT_NODE];
    }, [map, rootFolder]);

    return (
        <Box className={"w-full"}>
            <RichTreeView
                items={roots}
                slots={{item: CustomTreeItem}}
            />
        </Box>
    );
}

export default TreeNav;
