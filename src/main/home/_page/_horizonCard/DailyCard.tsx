import {CardPage} from "../HorizonPage.tsx";
import {ContentTyp} from "../../_component/CustomType.tsx";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {Tooltip} from "@mui/material";
import Stack from "@mui/material/Stack";
import {motion} from "motion/react";

export default function DailyCard() {
    return (
        <CardPage className={"flex justify-center items-center"}>
            <Paper elevation={4} className={"p-4 max-w-sm md:max-w-4xl overflow-y-scroll"}>
                <Grid container spacing={2}>
                    <Grid size={{sm: 12, md: 7}}>
                        <Stack spacing={1}>
                            <Typography variant={"h4"} color={"primary.main"} fontFamily={"Sour gummy"}>
                                Study
                            </Typography>
                            <Divider />
                            <ContentTyp>
                                Besides computer, I'm also interested in Mathematics and physics, (maybe I can say
                                good at it, but it was two years ago).
                            </ContentTyp>
                            <br/>
                            <ContentTyp>
                                Studying in another country is challenging, especially for me who are not good at social,
                                while I believe I have gotten used to it. Most courses is finished in satisfaction
                                (writing essay is really painful, and never choose Accounting as breadth), and the club
                                also provides great help and fun.
                            </ContentTyp>
                        </Stack>
                    </Grid>
                    <Grid
                        size={5}
                        className={"justify-center items-center gap-2 flex-col hidden md:flex"}
                        component={motion.div}
                        initial={{
                            x: 80,
                            opacity: 0,
                        }}
                        whileInView={{
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.6,
                            },
                        }}
                    >
                        <img src={"/project/speaker.jpg"} alt={""} className={"rounded"}/>
                        <Typography variant={"body2"} color={"text.secondary"} fontFamily={"Pacifico"}>
                            Speaker done on Engineering (not bad, huh?)
                        </Typography>
                    </Grid>
                    <Grid
                        size={5}
                        className={"md:flex justify-center items-center gap-2 flex-col hidden"}
                        component={motion.div}
                        initial={{
                            x: -80,
                            opacity: 0,
                        }}
                        whileInView={{
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.6,
                            },
                        }}
                    >
                        <img src={"/project/mountain.jpg"} alt={""} className={"rounded"}/>
                        <Tooltip title={"Gradle Mountain, Tasmania"} arrow>
                            <Typography variant={"body2"} color={"text.secondary"} fontFamily={"Pacifico"}>
                                Guess where is this ?
                            </Typography>
                        </Tooltip>
                    </Grid>
                    <Grid size={{sm: 12, md: 7}}>
                        <Stack spacing={1}>
                            <Typography variant={"h4"} color={"primary.main"} fontFamily={"Sour gummy"} align={"right"}>
                                Daily
                            </Typography>
                            <Divider />
                            <ContentTyp>
                                Studying on program and learning about computer science is a funny staff for me,
                                so sometimes I will take sometime read books and watch video about it. Except
                                CS, reading is still one of my hobbies. Living in australia, I usually read
                                science magazine and crime novel, and I just find reading newspaper is not bad.
                            </ContentTyp>
                            <br/>
                            <ContentTyp>
                                I have a part job at a bottle shop (Australian really like beer and wine), so most time
                                of weekend I will stay at shop. During spare time (if it is not too 'sunny' or 'freeze'),
                                cycling is my first sport choice. You can take train to the east, where is in the hills,
                                and ride down to city, so it will not be too hard, but can also enjoy the view.
                            </ContentTyp>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </CardPage>
    );
}