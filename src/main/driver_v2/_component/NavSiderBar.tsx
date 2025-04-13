import Box from "@mui/material/Box";
import {useDriverInfo} from "../_lib/driverInfo/DriverInfoContext.ts";
import {useMemo} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import {formatFileSize} from "../_lib/utils.ts";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ListItemText from "@mui/material/ListItemText";
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import {useLocation, useNavigate} from "react-router-dom";

const navs = [
    {icon: <DriveEtaIcon />, label: "driver", link: "/driver"},
    {icon: <FolderDeleteIcon />, label: "trash bin", link: "/driver/bin"},
]

export default function NavSideBar() {
    const { usedSpace, maxSpace } = useDriverInfo().info;
    const used = useMemo(() => formatFileSize(usedSpace), [usedSpace]);
    const max = useMemo(() => formatFileSize(maxSpace), [maxSpace]);
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Box
            sx={{width: 240, minWidth: 240}}
            className={"h-full flex flex-col"}
        >
            <div className={"w-full p-4 flex flex-col gap-1 items-center"}>
                <img src={"/icon/cloud.svg"} className={"w-1/2"} alt={""}/>
                <Typography variant={"h6"} color={"primary"}>
                    Cloud Drive(r)
                </Typography>
            </div>
            <Divider />
            <List className={"w-full p-2"}>
                {navs.map((nav) => (
                    <ListItemButton
                        key={`nav_${nav.link}`}
                        selected={location.pathname === nav.link}
                        onClick={() => navigate(nav.link)}
                    >
                        <ListItemIcon>{nav.icon}</ListItemIcon>
                        <ListItemText primary={nav.label} />
                    </ListItemButton>
                ))}
            </List>
            <div className={"flex-1"}/>
            <Divider />
            <div className={"pt-6 pb-6 pl-4 pr-4 w-full flex flex-col gap-2 items-center"}>
                <div className={"w-full"}>
                    <LinearProgress
                        variant={"determinate"}
                        value={usedSpace * 100 / maxSpace}
                        color={usedSpace / maxSpace > 0.7 ? "error" : "success"}
                    />
                </div>
                <Typography variant={"subtitle2"}>
                    {`${used} out of ${max} used`}
                </Typography>
            </div>
        </Box>
    );
}