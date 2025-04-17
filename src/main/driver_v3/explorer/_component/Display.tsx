import Box from "@mui/material/Box";
import useFolderContent from "../_hooks/useFolderContent.ts";
import {useNavigate} from "react-router-dom";
import useSelected from "../../_middleware/useSelected/useSelected.ts";
import LoadingPlaceholder from "../../_component/skeleton/LoadingPlaceholder.tsx";
import GridView from "./view/GridView.tsx";
import ContextMenu from "./ContextMenu.tsx";
import {useEffect, useRef} from "react";
import useMenu from "../../_middleware/useMenu/useMenu.ts";

function Display() {
    const { folders, files, loading } = useFolderContent();
    const navigate = useNavigate();
    const { clear } = useSelected();


    /****************************context menu part*****************************/
    const x = useRef(0);
    const y = useRef(0);
    const { openMenu } = useMenu();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            x.current = e.clientX;
            y.current = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <Box
            sx={{bgcolor: "background.default"}}
            className={"w-full min-h-full h-full overflow-y-auto border border-b-0 dark:border-slate-950 rounded-t-xl"}
            onClick={clear}
            onContextMenu={e => {
                e.preventDefault();
                openMenu("empty");
            }}
        >
            {loading
                ? <LoadingPlaceholder />
                : <GridView
                    folders={folders}
                    files={files}
                    navigate={navigate}
                />
            }
            <ContextMenu menuPosition={{y: y.current, x: x.current}} />
        </Box>
    )
}

export default Display;