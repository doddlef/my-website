import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ListItemText from "@mui/material/ListItemText";
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import {useLocation, useNavigate} from "react-router-dom";
import Usage from "./Usage.tsx";
import Stack from "@mui/material/Stack";
import FolderTree from "./FolderTree.tsx";

const navs = [
    {icon: <DriveEtaIcon />, label: "driver", link: "/driver"},
    {icon: <FolderDeleteIcon />, label: "trash bin", link: "/driver/bin"},
]

export default function NavSideBar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Stack
            spacing={1}
            sx={{width: 240, minWidth: 240}}
            className={"h-ful overflow-auto"}
            divider={<Divider />}
        >
            <div className={"w-full p-4 flex flex-col gap-1 items-center"}>
                <img src={"/icon/cloud.svg"} className={"w-1/2"} alt={""}/>
                <Typography variant={"h6"} color={"primary"}>
                    Cloud Drive(r)
                </Typography>
            </div>
            <FolderTree />
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
            <Usage />
        </Stack>
    );
}