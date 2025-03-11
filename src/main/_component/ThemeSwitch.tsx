import {IconButton} from "@mui/material";
import {useColorScheme} from "@mui/material/styles";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ThemeSwitch() {
    const {mode, setMode} = useColorScheme();
    return (
        <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon /> }
        </IconButton>
    );
}