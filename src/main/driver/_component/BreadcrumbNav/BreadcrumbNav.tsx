import {useEffect, useState} from "react";
import {ItemLabel} from "../../_lib/defitions.ts";
import {useNavigate} from "react-router-dom";
import {useContentCache} from "../api/driverCache/ContentCache.ts";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const BreadcrumbNav = () => {
    const [breadcrumbs, setBreadcrumbs] = useState<ItemLabel[]>([])
    const navigate = useNavigate();
    const { getPath, currentFolder } = useContentCache();

    useEffect(() => {
        getPath(currentFolder).then(setBreadcrumbs);

    }, [currentFolder, getPath]);

    return (
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
                        fontSize: "1.3rem"
                    }}
                >
                    {b.name}
                </Link>
            ))}
        </Breadcrumbs>
    );
};

export default BreadcrumbNav;