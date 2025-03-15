import {CardPage, ContentTyp, HeightContent} from "../HorizonPage.tsx";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import {motion} from "motion/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useState} from "react";

const stacks = [
    {
        title: "java",
        content:
            <>
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
            </>
    },
    {
        title: "Python",
        content:
            <>
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
            </>
    },
    {
        title: "Html + css + JavaScript",
        content:
            <>
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
            </>
    },
    {
        title: "TypeScript + React + Next.js",
        content:
            <>
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
            </>
    }
]

function MiddlePaper() {
    return (
        <Paper elevation={4} className={"p-4 hidden md:block"}
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
                    {
                        stacks.map((section) => (
                            <Grid size={6} key={section.title}>
                                <Typography variant="h6" component="div" fontFamily={"Sour gummy"} color={"secondary.main"}>
                                    - {section.title}
                                </Typography>
                                {section.content}
                            </Grid>
                        ))
                    }
                </Grid>
            </Stack>
        </Paper>
    );
}

function SmallPaper() {
    const [expanded, setExpanded] = useState<string | boolean>(false);

    const handleChange = (panel: string) => {
        setExpanded(panel === expanded ? false : panel);
    }
    return (
        <Paper elevation={4} className={"p-4 md:hidden max-w-sm flex justify-center items-center"}>
            {
                stacks.map((section) => (
                    <Accordion
                        key={section.title}
                        expanded={expanded === section.title}
                        onChange={() => handleChange(section.title)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${section.title}-panel-control`}
                            id={`${section.title}-panel-control`}
                        >
                            <Typography variant={"h4"} color={"primary.main"}>
                                {section.title}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {section.content}
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Paper>
    );
}

export default function TechStackCard() {
    return (
        <CardPage className={"flex justify-center items-center"}>
            <MiddlePaper />
            <SmallPaper />
        </CardPage>
    );
}