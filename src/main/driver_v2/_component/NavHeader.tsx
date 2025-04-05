import {useAccount} from "../../../_component/accountProvider/AccountContext.tsx";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ReorderRoundedIcon from "@mui/icons-material/ReorderRounded";
import ThemeSwitch from "../../_component/ThemeSwitch.tsx";
import {Avatar} from "@mui/material";

export default function NavHeader() {
    const { account } = useAccount();

    return (
        <Box
            component={"header"}
            className={"w-full h-16 flex items-center justify-start p-4 gap-6"}
        >
            <IconButton>
                <ReorderRoundedIcon />
            </IconButton>
            <div className={"flex-1 pl-2 pr-2"}>

            </div>
            <ThemeSwitch />
            <Avatar>{account?.nickname.charAt(0).toUpperCase()}</Avatar>
        </Box>
    );
}