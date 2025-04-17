import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Usage from "./Usage.tsx";
import Stack from "@mui/material/Stack";
import FolderTree from "./FolderTree.tsx";

export default function NavSideBar() {
    return (
        <Stack
            spacing={1}
            sx={{width: 240, minWidth: 240}}
            className={"h-ful overflow-auto"}
            divider={<Divider />}
        >
            <div className={"w-full p-4 flex gap-1 items-center justify-around"}>
                <img src={"/icon/cloud.svg"} className={"h-12"} alt={""}/>
                <Typography variant={"h6"} color={"primary"}>
                    Cloud Drive(r)
                </Typography>
            </div>
            <div className={"w-full flex-1 overflow-auto"}>
                <FolderTree />
            </div>
            <Usage />
        </Stack>
    );
}