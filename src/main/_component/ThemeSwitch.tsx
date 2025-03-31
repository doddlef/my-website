import {IconButton} from "@mui/material";
import {useColorScheme} from "@mui/material/styles";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {useMemo} from "react";

export default function ThemeSwitch() {
    const { mode, setMode } = useColorScheme();
    const isLight = useMemo(() => mode === "light", [mode]);

    return (
        <IconButton onClick={() => setMode(isLight ? "dark" : "light")}>
            {isLight ? <LightModeIcon /> : <DarkModeIcon /> }
        </IconButton>
    );
}