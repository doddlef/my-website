import Clock from "../_component/clock/Clock.tsx";
import {motion} from "motion/react";
import Box from "@mui/material/Box";
import {Avatar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {TypeAnimation} from "react-type-animation";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCommentIcon from '@mui/icons-material/AddComment';
import {prepareEmail} from "../../../_hooks/useEmail.ts";

export default function WelcomePage() {
    return (
        <div className={"flex items-center w-screen h-screen p-4 relative"}>
            <div className={"w-full md:w-1/2 flex items-center justify-center h-full z-10"}>
                <SelfIntroduction />
            </div>

            <div className={"hidden md:flex items-center justify-center w-1/2 h-full z-10"}>
                <Clock />
            </div>

            <Background />
        </div>
    );
}

function Background() {
    return (
        <div className={"absolute w-full h-full top-0 left-0 z-0 flex justify-center items-center overflow-hidden"}>
            <div
                className={"relative w-96 h-96"}
                // loss frame heavily on safari
                // animate={{
                //     rotate: [null, 360],
                // }}
                // transition={{duration: 40, repeat: Infinity}}
            >
                <FallBalls x={"50%"} y={"50%"} color={"lightblue"} scale={1.2} />
                <FallBalls x={"-20%"} y={"-25%"} color={"red"} scale={1.6} />
                <FallBalls x={"45%"} y={"-20%"} color={"green"} />
                <FallBalls x={"-15%"} y={"40%"} color={"yellow"} scale={1.4}/>
            </div>
        </div>
    );
}

function FallBalls(
    {x, y, color, scale=1}:
    {x: number | string; y: number | string, color: string, scale?: number})
{
    return (
        <div
            className={"md:w-96 md:h-96 w-48 h-48 rounded-full absolute"}
            style={{
                background: `radial-gradient(circle, ${color} 40%, transparent 90%)`,
                filter: "blur(22px)",
                transform: `translate(${x}, ${y}) scale(${scale})`,
                opacity: 0.5,
            }}
        />
    );
}

function SelfIntroduction() {
    return (
        <Box
            style={{padding: 2, minWidth: 112}}
            component={motion.div}
            initial={{opacity: 0, x: -100}}
            animate={{opacity: 1, x: 0}}
            transition={{
                type: "easeOut",
                opacity: {
                    duration: 1
                },
                x: {
                    duration: 0.5
                }
            }}
        >
            <Box
                className={"flex items-center gap-4"}
                component={motion.div}
                initial={{y: -50}}
                animate={{y: 0}}
                transition={{
                    type: "spring",
                    duration: 0.5
                }}
            >
                <motion.div
                    whileHover={{
                        scale: 1.2,
                        type: "spring",
                    }}
                >
                    <Avatar alt={""} src={"/avatar.png"} sx={{height: 56, width: 56}}/>
                </motion.div>
                <Typography
                    sx={{color: "primary.main", fontWeight: "bold", fontFamily: "Pacifico"}}
                    variant={"h3"}
                >
                    Welcome ! I'm Kevin
                </Typography>
            </Box>
            <div>
                <Typography variant={"h6"} color={"secondary.main"} fontFamily={"Sour Gummy"} gutterBottom>
                    study in University of Melbourne, focus on Computer Science
                </Typography>
                    <TypeAnimation
                        sequence={[
                            '> Undergraduate Student',
                            1000,
                            '> Like e-game but Macbook',
                            1000,
                            '> Full stack developer ?',
                            1000,
                            '> Looking for internship',
                            1000,
                            '> Switch game recommend ?',
                            1000,
                        ]}
                        cursor={false}
                        repeat={Infinity}
                        deletionSpeed={80}
                        className={"text-slate-900 dark:text-gray-200 font-bold font-[Tektur] text-xl md:text-2xl"}
                    />
                <Typography variant={"h6"} color={"success.light"} fontFamily={"Pacifico"}>
                    - focus on Java Spring + React.js
                </Typography>
                <Typography variant={"h6"} color={"text.primary"} fontFamily={"Sour Gummy"}>
                    -
                    <Typography
                        className={"pl-1 pr-1"}
                        variant={"h6"} color={"primary.main"} component={"span"} fontFamily={"Sour Gummy"}
                    >
                        Software Develop ?
                    </Typography>
                    Machine Learning ?
                    AI ?
                    Game ?
                </Typography>
                <Typography variant={"body1"} color={"error.main"} fontFamily={"Tektur"} fontWeight={"bold"}
                            className={"cursor-pointer"}
                            component={motion.div}
                            whileHover={{
                                scale: 1.2,
                                transition: {
                                    duration: 4,
                                    type: "spring",
                                },
                            }}
                >
                    RED TEXT ! RED TEXT ! RED TEXT ! RED TEXT ! RED TEXT !
                </Typography>
            </div>
            <motion.div
                initial={{y: 50}}
                animate={{y: 0}}
                transition={{
                    type: "spring",
                    duration: 0.5
                }}
                className={"flex gap-2 items-center justify-start mt-4"}
            >
                <IconButton onClick={() => prepareEmail({})}><EmailIcon /></IconButton>
                <IconButton><AddCommentIcon /></IconButton>
                <IconButton><FavoriteIcon className={"text-red-400 dark:text-red-500"}/></IconButton>
            </motion.div>
        </Box>
    );
}