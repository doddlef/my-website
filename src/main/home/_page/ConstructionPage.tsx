import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ConstructionIcon from '@mui/icons-material/Construction';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export default function ConstructionPage() {
    return (
        <div className={"w-screen h-screen flex items-center justify-center"}>
            <Paper elevation={4} className={"p-4"}>
                <Stack spacing={2} alignItems={"center"}>
                    <ConstructionIcon sx={{color: "error.main", fontSize: 120}} />
                    <Typography variant={"h6"} fontFamily={"Sour gummy"}>
                        Sorry, this website is still under-construction, scroll down to the ending page.
                    </Typography>
                    <Box className={"flex justify-start items-center gap-8 w-full pl-4"}>
                        <CheckBoxOutlineBlankIcon sx={{color: "error.main", fontSize: 45}} />
                        <Typography variant={"h6"} fontFamily={"Sour gummy"}>
                            A blog system (under construction)
                        </Typography>
                    </Box>
                    <Box className={"flex justify-start items-center gap-8 w-full pl-4"}>
                        <CheckBoxOutlineBlankIcon sx={{color: "error.main", fontSize: 45}} />
                        <Typography variant={"h6"} fontFamily={"Sour gummy"}>
                            A cloud driver
                        </Typography>
                    </Box>
                    <Box className={"flex justify-start items-center gap-8 w-full pl-4"}>
                        <CheckBoxOutlineBlankIcon sx={{color: "error.main", fontSize: 45}} />
                        <Typography variant={"h6"} fontFamily={"Sour gummy"}>
                            A notice board
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </div>
    );
}