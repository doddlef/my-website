import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import useFolderContent from "../_hooks/useFolderContent.ts";
import useFolderTree, {FolderNode} from "../../_middleware/useFolderTree/useFolderTree.ts";

type FolderLink = FolderNode & {
    url: string;
}

const BreadcrumbsHeader = () => {
    const navigate = useNavigate();
    const { currentFolder } = useFolderContent();
    const { getPath } = useFolderTree();

    const [crumbs, setCrumbs] = useState<FolderLink[]>([]);

    useEffect(() => {
        getPath(currentFolder)
            .then(items => items.map(i => ({
                ...i,
                url: `/driver?folder=${i.id}`,
                name: i.folderId ? i.name : "My Driver",
            })))
            .then(setCrumbs)
    }, [currentFolder, getPath]);

    return (
        <Paper className={"flex-1 pl-4 p-2"} elevation={2} sx={{borderRadius: 4}}>
            <Breadcrumbs aria-label="breadcrumb">
                {crumbs.map((b) => (
                    <Link
                        key={b.id}
                        component="button"
                        onClick={() => {
                            if (b.id !== currentFolder) navigate(b.url);
                        }}
                        sx={{
                            color: b.id === currentFolder ? "text.primary" : "text.secondary",
                            textDecoration: "none",
                            cursor: b.id === currentFolder ? "default" : "pointer",
                            fontSize: "1rem",
                            "&:hover": {
                                textDecoration: b.id === currentFolder ?  "" : "underline",
                            }
                        }}
                    >
                        {b.name}
                    </Link>
                ))}
            </Breadcrumbs>
        </Paper>
    );
}

export default BreadcrumbsHeader;