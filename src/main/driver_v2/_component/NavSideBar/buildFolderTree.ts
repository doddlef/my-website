import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import {FolderLabel} from "../../_middleware/folderTree/useFolderTree.ts";

export function buildFolderTree(cache: Map<number, FolderLabel>): TreeViewBaseItem[] {
    const idToNode = new Map<number, TreeViewBaseItem>();
    const roots: TreeViewBaseItem[] = [];

    cache.forEach(folder => {
        idToNode.set(folder.id, {
            id: folder.id.toString(),
            label: folder.name,
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

    return roots;
}