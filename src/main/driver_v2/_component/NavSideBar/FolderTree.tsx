import useFolderTree from "../../_middleware/folderTree/useFolderTree.ts";
import {useCallback, useMemo, useState} from "react";
import {buildFolderTree} from "./buildFolderTree.ts";
import Box from "@mui/material/Box";
import {RichTreeView} from "@mui/x-tree-view";
import {useNavigate} from "react-router-dom";

export default function FolderTree() {
    const { cache } = useFolderTree();

    const items = useMemo(() =>  buildFolderTree(cache), [cache]);

    const navigate = useNavigate();

    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = useCallback((_: unknown ,itemId: string | null) => {
        if (!itemId) return;
        const folder = cache.get(Number(itemId));
        if (!folder) return;

        if (folder.folderId) navigate(`/driver?folder=${folder.id}`);
        else navigate(`/driver`);

        setSelected(folder.name);
    }, [cache, navigate]);

    return (
        <Box className={"w-full"}>
            <RichTreeView
                selectedItems={selected}
                items={items}
                expansionTrigger={"iconContainer"}
                onItemClick={(_: unknown, itemId: string | null) => {
                    console.log("item clicked", itemId);
                }}
                onItemFocus={(_: unknown , itemId: string | null) => {
                    console.log("item focus", itemId);
                }}
                onSelectedItemsChange={(_: unknown ,itemId: string | null) => {
                    console.log("selectedItems changed", itemId);
                    setSelected(itemId);
                }}
            />
        </Box>
    );
}