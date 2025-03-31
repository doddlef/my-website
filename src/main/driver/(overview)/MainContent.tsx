import {ItemLabel, ItemView} from "../_lib/defitions.ts";
import React, {useEffect, useMemo, useState} from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {ItemCard} from "../_component/itemCard/ItemCard.tsx";
import LabelCacheProvider from "../_component/driverCache/LabelCacheProvider.tsx";
import {useLabelCache} from "../_component/driverCache/LabelCache.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Breadcrumbs, Link} from "@mui/material";

export default function MainLayout() {
    return (
        <LabelCacheProvider>
            <MainContent />
        </LabelCacheProvider>
    );
}

function MainContent() {
    const [items, setItems] = useState<ItemView[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<ItemLabel[]>([])
    const { getContent, rootFolder, getPath } = useLabelCache();
    const [searchParams] = useSearchParams();

    const folderId = useMemo(() =>  Number(searchParams.get("folder")) || rootFolder,
        [searchParams, rootFolder])

    useEffect(() => {
        getContent(folderId).then(setItems);
        getPath(folderId).then(setBreadcrumbs);

    }, [folderId, getContent, getPath]);

    return (
        <Stack
            spacing={2}
            className={"w-full h-full overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-tl-3xl p-4"}
        >
            <BreadcrumbNav breadcrumbs={breadcrumbs} currentId={folderId} />
            <ItemTable items={items} />
        </Stack>
    );
}


const BreadcrumbNav: React.FC<{ breadcrumbs: ItemLabel[]; currentId: number }> = ({ breadcrumbs, currentId }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((b) => (
                <Link
                    key={b.id}
                    component="button"
                    onClick={() => {
                        if (b.id !== currentId) navigate(b.url);
                    }}
                    sx={{
                        color: b.id === currentId ? "text.primary" : "text.secondary",
                        textDecoration: "none",
                        cursor: b.id === currentId ? "default" : "pointer",
                        fontSize: "1.3rem"
                    }}
                >
                    {b.name}
                </Link>
            ))}
        </Breadcrumbs>
    );
};


function ItemTable({ items } : { items: ItemView[] } ) {
    const navigate = useNavigate();
    const folders = items.filter(f => f.folder);
    const files = items.filter(f => !f.folder);

    return (
        <Grid className={"pl-8 pr-8"} container spacing={3}>
            {folders.length > 0 && (
                <Grid size={12}>
                    <Typography variant={"subtitle2"} color={"textSecondary"}>
                        folders
                    </Typography>
                </Grid>
            )}
            {folders.map((folder: ItemView) => (
                <Grid size={3} key={folder.id}>
                    <ItemCard item={folder} navigate={navigate}/>
                </Grid>
            ))}
            {files.length > 0 && (
                <Grid size={12}>
                    <Typography variant={"subtitle2"} color={"textSecondary"}>
                        files
                    </Typography>
                </Grid>
            )}
            {files.map((file: ItemView) => (
                <Grid size={3} key={file.id}>
                    <ItemCard item={file} navigate={navigate}/>
                </Grid>
            ))}
            {folders.length === 0 && files.length === 0 && (
                <Grid size={12} className={"p-8"}>
                    <div className={"w-full flex flex-col items-center gap-2"}>
                        <img src={"/empty/empty.webp"} alt={""} />
                        <Typography variant={"h4"}>
                            This folder is empty ...
                        </Typography>
                    </div>
                </Grid>
            )}
        </Grid>
    );
}