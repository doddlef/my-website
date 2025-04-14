import useFolderTree from "../../_middleware/folderTree/useFolderTree.ts";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {buildFolderTree} from "./buildFolderTree.ts";
import Box from "@mui/material/Box";
import {RichTreeView} from "@mui/x-tree-view";
import {useNavigate} from "react-router-dom";
import {useDriverInfo} from "../../_lib/driverInfo/DriverInfoContext.ts";

export default function FolderTree() {
    const { rootFolder } = useDriverInfo().info;
    const { cache } = useFolderTree();
    const items = useMemo(() => buildFolderTree(cache), [cache]);
    const navigate = useNavigate();

    const [selected, setSelected] = useState<string>('');

    useEffect(() => {
        if(rootFolder) setSelected(rootFolder.toString());
    }, [rootFolder]);

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
                onSelectedItemsChange={handleSelect}
            />
        </Box>
    );
}