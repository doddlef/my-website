import Paper from "@mui/material/Paper";
import {motion} from "motion/react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {CardPage} from "../HorizonPage";

const introductions: { h: string, c: string }[] = [
    {
        h: "Student",
        c: "I'm an undergraduate student at the University of Melbourne, majoring in Computer Science and passionate about software design. " +
            "I come from Suzhou, a city in eastern China, and moved to Australia after completing high school."
    },
    {
        h: "Study",
        c: "I find great joy in designing code and building software. During university, I focus on software design, " +
            "but I’m also interested in mathematics, AI, machine learning, game design, and algorithms (challenging but fun!)."
    },
    {
        h: "Future",
        c: "Studying computer science is exciting, but I sometimes feel uncertain about the future. " +
            "Should I pursue software development (can I find a job as it is too crowded?), AI (will it be too difficult?)"
    }
];

export default function IntroductionCard() {
    return (
        <CardPage className={"flex justify-center items-center"}>
            <Paper
                elevation={4}
                className={"p-6 flex items-center justify-center gap-3"}
                component={motion.div}
                initial={{
                    opacity: 0.1,
                    translateY: 40,
                }}
                whileInView={{
                    translateY: 0,
                    opacity: 1,
                    transition: {
                        duration: 0.8,
                    }
                }}
            >
                <Stack
                    spacing={1}
                    sx={{maxWidth: "30rem"}}
                >
                    <Typography variant={"h3"} sx={{color: "primary.main"}} fontFamily={"Sour Gummy"}>
                        Hi ! I'm Kevin Feng
                    </Typography>
                    {introductions.map((item, i) => (
                        <>
                            <Typography variant={"h5"} sx={{color: "secondary.main"}}
                                        key={`${i}_h`} fontFamily={"Sour Gummy"}>
                                {item.h}
                            </Typography>
                            <Typography variant={"body1"} sx={{color: "text.main"}}
                                        key={`${i}_c`} fontFamily={"Sour Gummy"}>
                                {item.c}
                            </Typography>
                        </>
                    ))}
                </Stack>
                <Stack className={"h-full"} spacing={1}>
                    <motion.img
                        src={"melbourne_central.JPEG"} alt={""}
                        className={"rounded"}
                        style={{width: "25rem", height: "auto"}}
                        whileHover={{
                            boxShadow: "0 0 4px rgba(32, 32, 32, 0.6)"
                        }}
                    />
                    <Typography variant={"body2"}
                                sx={{color: "text.secondary"}}
                                align={"center"}
                                fontFamily={"Pacifico"}
                    >
                        Melbourne central
                    </Typography>
                </Stack>
            </Paper>
        </CardPage>
    );
}