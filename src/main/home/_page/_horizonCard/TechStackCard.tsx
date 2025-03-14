import {CardPage} from "../HorizonPage.tsx";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import {styled} from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import {motion} from "motion/react";

const ContentTyp = styled(Typography)(({theme}) => ({
    variant: theme.typography.body1,
    fontFamily: "Sour gummy",
    color: theme.palette.text.primary,
    component: "span",
}))

const HeightContent = styled(ContentTyp)(({theme}) => ({
    color: theme.palette.success.main,
    textDecorationLine: "underline",
    component: "span",
    display: "inline",
}));

export default function TechStackCard() {
    return (
        <CardPage className={"flex justify-center items-center"}>
            <Paper elevation={4} className={"p-4"}
                   component={motion.div}
                   initial={{
                       translateY: 40,
                       opacity: 0,
                   }}
                   whileInView={{
                       translateY: 0,
                       opacity: 1,
                       transition: {
                           duration: 0.8,
                       }
                   }}
            >
                <Stack spacing={1} sx={{maxWidth: "56rem"}}>
                    <Typography variant="h4" component="div" fontFamily={"Sour gummy"} color={"primary.main"}>
                        My Stack (most of them)
                    </Typography>
                    <Divider />
                    <Grid container spacing={4}>
                        <Grid size={6}>
                            <Typography variant="h6" component="div" fontFamily={"Sour gummy"} color={"secondary.main"}>
                                - Java
                            </Typography>
                            <ContentTyp>
                                Java is my favourite language ( regular and easy ),
                                and the first computer language I learnt.
                                Besides the <HeightContent>JavaSE</HeightContent> &nbsp;
                                (of course, and including Threads, Stream, socket),
                                I am also using <HeightContent>Java Spring</HeightContent>,
                                including <HeightContent>MVC, AI, JDBC, Security (jwt), and SpringBoot</HeightContent>
                                &nbsp;(my god).
                            </ContentTyp>
                            <br/>
                            <ContentTyp>
                                Moreover, I learnt about <HeightContent>mysql, MongoDb and javaFX</HeightContent>
                            </ContentTyp>
                            <br />
                            <ContentTyp>
                                Now I now using Caffeine as the cache,
                                but keep studying in <HeightContent>Redis</HeightContent>,
                                and queue like <HeightContent>Kafka</HeightContent>.
                            </ContentTyp>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h6" component="div" fontFamily={"Sour gummy"} color={"secondary.main"}>
                                - Python
                            </Typography>
                            <ContentTyp>
                                Python is not very my tea. When using python,
                                I always feel it is too unclear which parameters I should use or provide,
                                what is the return value of a function, and WHAT THE TYPE THE VARIABLE IS?
                                So I usually use it only in uni.
                            </ContentTyp>
                            <br/>
                            <ContentTyp>
                                I have learnt about Machine Learning and AI, so have some knowledge in
                                &nbsp;<HeightContent>pandas, NumPy, Matplotlib, NLTK, sklearn</HeightContent>&nbsp;
                                (well, I have used them to do a data process and recommendation system,
                                but cannot really say I have 'conquered' them)
                            </ContentTyp>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h6" component="div" fontFamily={"Sour gummy"} color={"secondary.main"}>
                                - Html + css + JavaScript
                            </Typography>
                            <ContentTyp>
                                Front development is really hard for me, who is lack of art
                                (I do my primary school drawing work with ruler), and always frustrated me after developed
                                the back end
                            </ContentTyp>
                            <br/>
                            <ContentTyp>
                                Man, what can I say ? Besides the basic&nbsp;
                                <HeightContent>HTML5, CSS, and js</HeightContent>
                                , I also using library like axios (not often recently,
                                in my mind fetch &gt; axios &gt; xml, why somebody still use something deprecated?),
                                but it has too much space to explore, and very need creative
                            </ContentTyp>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h6" component="div" fontFamily={"Sour gummy"} color={"secondary.main"}>
                                - TypeScript + React + Next.js
                            </Typography>
                            <ContentTyp>
                                Next.js is something really cool for me, and if I do not use Java+Spring, it definitely
                                will be the first one come into my mid. But this project is actually built up with
                                React + SpringBoot
                            </ContentTyp>
                            <br />
                            <ContentTyp>
                                I am used to using <HeightContent>MUI, TailwindCss</HeightContent> as the component
                                library (thanks!), <HeightContent>Framer motion</HeightContent> for some animation,
                                and some other library
                            </ContentTyp>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </CardPage>
    );
}