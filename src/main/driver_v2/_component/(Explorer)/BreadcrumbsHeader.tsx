import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ItemLabel} from "../../definations.ts";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {usePagination} from "../../_middleware/(Explorer)/Pagination/PaginationContext.ts";
import Paper from "@mui/material/Paper";
import useFolderTree from "../../_middleware/folderTree/useFolderTree.ts";
import {useDriverInfo} from "../../_middleware/driverInfo/DriverInfoContext.ts";

const BreadcrumbsHeader = () => {
    const [breadcrumbs, setBreadcrumbs] = useState<ItemLabel[]>([])
    const navigate = useNavigate();
    const { rootFolder } = useDriverInfo().info;
    const { currentFolder } = usePagination();
    const { getPath, mounted } = useFolderTree();

    useEffect(() => {
        if (mounted) {
            getPath(currentFolder)
                .then(folders =>
                    folders.map(folder => ({
                        id: folder.id,
                        name: folder.name,
                        url: folder.id === rootFolder ? "/driver" : `/driver?folder=${folder.id}`,
                        type: "FOLDER",
                        folderId: folder.folderId,
                    } as ItemLabel)))
                .then(setBreadcrumbs)
        }
    }, [currentFolder, getPath, rootFolder, mounted]);

    return (
        <Paper className={"flex-1 pl-4 p-2"} elevation={2} sx={{borderRadius: 4}}>
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbs.map((b) => (
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