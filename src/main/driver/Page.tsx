import {useDriverInfo} from "./_component/infoProvider/DriverInfoContext.ts";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useMemo} from "react";
import {formatFileSize} from "./_lib/utils.ts";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MainContent from "./(overview)/ContentPage.tsx";
import Header from "./_component/header/Header.tsx";

export default function Page() {
    return (
        <Box
            component={"main"}
            sx={{bgcolor: "background.default", color: "text.primary"}}
            className={"flex w-screen h-screen"}
        >
            <Box
                sx={{width: 240}}
                className={"h-full flex flex-col"}
            >
                <Icon />
                <SideList />
                <Usage />
            </Box>
            <Box
                className={"flex-1 h-screen flex flex-col"}
            >
                <Header />
                <MainContent />
            </Box>
        </Box>
    );
}

function Icon() {
    return (
        <div className={"w-full flex justify-start-center items-center h-16 pl-4 gap-4"}>
            <img src={"/icon/cloud.svg"} alt={""} className={"w-10 h-10"}/>
            <Typography variant={"h5"} color={"primary"}>
                Driver
            </Typography>
        </div>
    );
}

function SideList() {
    return (
        <nav className={"flex-1 w-full"}>
            <List>
                <ListItem>
                    <ListItemButton sx={{borderRadius: 2}}>
                        <ListItemIcon>
                            <HomeRoundedIcon />
                        </ListItemIcon>
                        <ListItemText>
                            Home
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </nav>
    );
}

function Usage() {
    const { usedSpace, maxSpace } = useDriverInfo();
    const used = useMemo(() => formatFileSize(usedSpace), [usedSpace]);
    const max = useMemo(() => formatFileSize(maxSpace), [maxSpace]);

    return (
        <div className={"pt-6 pb-6 pl-4 pr-4 w-full flex flex-col gap-2 items-center"}>
            <div className={"w-full"}>
                <LinearProgress variant={"determinate"} value={usedSpace * 100 / maxSpace} />
            </div>
            <Typography variant={"subtitle2"}>
                {`${used} out of ${max} used`}
            </Typography>
        </div>
    )
}