import useFolderTree, {FolderLabel} from "../../_middleware/folderTree/useFolderTree.ts";
import React from "react";
import Box from "@mui/material/Box";
import {Link, useLocation} from "react-router-dom";
import {RichTreeView} from "@mui/x-tree-view";
import { TreeItem2, TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import {TreeViewBaseItem} from "@mui/x-tree-view/models";
import {useTreeItem2Utils} from "@mui/x-tree-view/hooks";
import Typography from "@mui/material/Typography";
import {useDriverInfo} from "../../_middleware/driverInfo/DriverInfoContext.ts";

import DriveEtaIcon from '@mui/icons-material/DriveEta';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import {clsx} from "clsx";


type iconString = "home" | "bin" | "img" | "music" | "video";

type NavTreeItem = {
    id: string;
    label: string;
    icon?: iconString;
    url?: string;
}

const buildUpTree = (cache: Map<number, FolderLabel>): {roots: TreeViewBaseItem<NavTreeItem>[], idToNode: Map<number, TreeViewBaseItem<NavTreeItem>>} => {
    const idToNode = new Map<number, TreeViewBaseItem<NavTreeItem>>();
    const roots: TreeViewBaseItem<NavTreeItem>[] = [];

    cache.forEach(folder => {
        idToNode.set(folder.id, {
            id: folder.id.toString(),
            label: folder.name,
            url: folder.folderId ? `/driver?folder=${folder.id}` : `/driver`,
            children: [],
        });
    });

    cache.forEach(folder => {
        const node = idToNode.get(folder.id);
        if (!node) return;

        if (folder.folderId != null) {
            const parentNode = idToNode.get(folder.folderId);
            if (parentNode) {
                (parentNode.children as TreeViewBaseItem[]).push(node);
            } else {
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    });
    return {roots, idToNode};
}

interface CustomLabelProps {
    children: string;
    className: string;
    icon?: string;
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

            <Typography>{children}</Typography>
        </Box>
    );
}

const getIconFormIconString = (icon?: iconString) => {
    switch (icon) {
        case "home":
            return DriveEtaIcon;
        case "bin":
            return DeleteIcon;
        case "img":
            return ImageIcon;
        case "music":
            return LibraryMusicIcon;
        case "video":
            return VideoCameraBackIcon;
        default:
            return FolderIcon;
    }
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

export default function FolderTree() {
    const { cache } = useFolderTree();
    const { rootFolder } = useDriverInfo().info;
    const { roots } = React.useMemo(() => {
        const ret = buildUpTree(cache);
        ret.roots = ret.roots.map(r => ({...r, icon: "home" }));
        ret.roots = [...ret.roots, {
            id: "bin",
            label: "trash",
            url: "/driver/bin",
            icon: "bin",
        }];
        return ret;
    }, [cache]);

    const location = useLocation();
    const active = new URLSearchParams(location.search).get('folder') ?? rootFolder.toString();

    return (
        <Box className={"w-full"}>
            <RichTreeView
                items={roots}
                slots={{item: CustomTreeItem}}
                selectedItems={active}
            />
        </Box>
    );
}
