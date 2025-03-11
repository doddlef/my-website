import styles from "./AuthPage.module.css";
import {clsx} from "clsx";
import "../../_fonts/fleur_de_leah.css";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import LoginBox from "./_component/LoginBox.tsx";
import RegisterBox from "./_component/RegisterBox.tsx";
import {useAccount} from "../../_component/accountProvider/AccountContext.tsx";
import {useNavigate} from "react-router-dom";

export default function Page() {
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const {account, checked} = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (checked && account) navigate("/home");
    }, [account, navigate, checked])

    if (!checked) return <div>loading...</div>;

    return (
        <Box
            sx={{bgcolor: "background.default"}}
            className={"w-screen h-screen flex items-center gap-4 p-4 relative"}
        >
            <div className={"absolute top-4 right-5"}>
                <IconButton  onClick={() => alert("developing")}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={clsx("rounded-xl overflow-hidden flex-1 h-full mt-4 mb-4", styles.picture)}>
                <Stack className={clsx(styles.pictureText, "bg-gray-200 dark:bg-slate-600 bg-opacity-40 dark:bg-opacity-25 backdrop-blur")} spacing={2}>
                    <Typography variant={"h5"} sx={{color:"text.primary"}}>Placeholder</Typography>
                    <hr color={"white"}/>
                    <Typography variant={"body1"} sx={{color:"text.primary"}} flexWrap={"wrap"}>
                        Placeholder Placeholder Placeholder Placeholder Placeholder
                    </Typography>
                </Stack>
            </div>
            <Box sx={{width: "26rem", padding: "0 1rem"}}>
                {
                    isRegister
                        ? <RegisterBox login={() => setIsRegister(false)} />
                        : <LoginBox register={() => setIsRegister(true)} />
                }
            </Box>
        </Box>
    );
}