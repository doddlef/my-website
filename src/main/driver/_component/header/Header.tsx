import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { motion } from "motion/react";
import ReorderRoundedIcon from "@mui/icons-material/ReorderRounded";
import InputBase from "@mui/material/InputBase";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./header.module.css";
import ThemeSwitch from "../../../_component/ThemeSwitch.tsx";
import {useAccount} from "../../../../_component/accountProvider/AccountContext.tsx";
import {Avatar} from "@mui/material";

export default function Header() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { account } = useAccount();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <Box
            component={"header"}
            className={"w-full h-16 flex items-center justify-start p-4 gap-6"}
        >
            <IconButton
                component={motion.div}
                whileTap={{
                    rotate: "360deg",
                    transition: { duration: 0.8, ease: "easeOut" },
                }}
            >
                <ReorderRoundedIcon />
            </IconButton>
            <div className={"flex-1 pl-2 pr-2"}>
                <div className={styles.searchContainer}>
                    <InputBase
                        inputRef={inputRef}
                        sx={{fontSize: "large" }}
                        type={"text"}
                        endAdornment={
                            <Box
                                className={"flex gap-0.5 items-center p-0.5 pr-1 rounded ml-1"}
                                sx={{ fontSize: "small", bgcolor: "black", color: "whitesmoke" }}
                            >
                                <KeyboardCommandKeyIcon fontSize={"small"} />
                                K
                            </Box>
                        }
                        startAdornment={<SearchIcon fontSize={"small"} className={"mr-1"} />}
                    />
                </div>
            </div>
            <div>

            </div>
            <ThemeSwitch />
            <Avatar>{account?.nickname.charAt(0).toUpperCase()}</Avatar>
        </Box>
    );
}