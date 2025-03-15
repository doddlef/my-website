import {ParallaxText} from "../_component/parallaxText/ParallaxText.tsx";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {ContentTyp, HeightContent} from "../_component/CustomType.tsx";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import EmailIcon from '@mui/icons-material/Email';
import IconButton from "@mui/material/IconButton";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Paper from "@mui/material/Paper";
import {getEmail, prepareEmail} from "../../../_hooks/useEmail.ts";

export default function EndingPage() {
    return (
        <div className={"w-screen h-screen overflow-hidden relative flex justify-center items-center"}>
            <div className={"absolute top-8 left-0 w-full"}>
                <ParallaxText speed={10}>
                    I wnat you
                </ParallaxText>
            </div>
            <div className={"absolute bottom-8 left-0 w-full"}>
                <ParallaxText speed={-10}>
                    melbourne
                </ParallaxText>
            </div>
            <div className={"flex items-center md:flex-row md:gap-6 flex-col gap-3"}>
                <Stack spacing={2} className={"md:max-w-lg max-w-sm"}>
                    <Typography variant={"h2"} color={"text.primary"} fontWeight={"bold"} fontFamily={"Sour gummy"}>
                        Contact me
                    </Typography>
                    <ContentTyp variant={"h6"}>
                        if you have any question, comment,
                        or <HeightContent sx={{color: "primary.main"}}>maybe you want to hire me</HeightContent>
                        , or you just want to say 'hi !', please feel free to contact with me !
                    </ContentTyp>
                    <Divider />
                    <Box className={"flex items-center justify-between pr-4"}>
                        <IconButton onClick={() => prepareEmail({})}>
                            <EmailIcon fontSize={"large"}/>
                        </IconButton>
                        <Typography align={"right"} variant={"h5"} fontFamily={"Sour gummy"} color={"secondary.main"}>
                            {getEmail()}
                        </Typography>
                    </Box>
                    <Box className={"flex items-center justify-between pr-4"}>
                        <IconButton>
                            <LinkedInIcon fontSize={"large"}/>
                        </IconButton>
                        <Typography align={"right"} variant={"h5"} fontFamily={"Sour gummy"} color={"secondary.main"}>
                            not register yet
                        </Typography>
                    </Box>
                </Stack>
                <Paper elevation={4} className={"p-4"}>
                    <Typography variant={"h4"} fontFamily={"Sour gummy"} color={"text.primary"}>
                        Under Construction
                    </Typography>
                </Paper>
            </div>
        </div>
    )
}