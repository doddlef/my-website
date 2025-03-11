import { motion, AnimatePresence } from "motion/react";
import React from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export default function Section1() {
    const [opacity, setOpacity] = React.useState(1);
    const [visible, setVisible] = React.useState(true);

    return (
        <div className={"w-screen flex items-center flex-col p-4"}>
            <section className={"w-3/5 flex items-center flex-col gap-2"}>
                <motion.div
                    animate={{opacity: opacity}}
                    className={"p-2 border-amber-700 border-2 border-dashed rounded bg-green-400 bg-opacity-80 cursor-pointer"}
                    onClick={() => setOpacity(opacity == 1 ? 0.3 : 1)}
                >
                    test
                </motion.div>
                <motion.div
                    className={"p-2 border-amber-700 border-2 border-dashed rounded bg-green-400 bg-opacity-80 cursor-pointer"}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 1}}
                >
                    init
                </motion.div>
                <motion.div
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 2}}
                    className={"p-2 border-amber-700 border-2 border-dashed rounded bg-green-400 bg-opacity-80 cursor-pointer"}
                >
                    transforms
                </motion.div>
                <Button
                    variant='contained'
                    size="large"
                    component={motion.button}
                    whileHover={{
                        scale: 1.2,
                        transition: {duration: 0.3}
                    }}
                    whileTap={{scale: 0.9}}
                >
                    MUI
                </Button>
                <Paper
                    elevation={2}
                    className={"pl-2 pr-2 pt-1 pb-1"}
                    component={motion.div}
                    initial={{transform: "translateX(-100px)"}}
                    animate={{transform: "translateX(0px)"}}
                    transition={{type: "spring"}}
                >
                    type
                </Paper>
                <motion.div
                    // set the transform origin
                    style={{originX: 0.5}}
                    animate={{rotate: 40}}
                >
                    origin
                </motion.div>
                <motion.ul
                    initial={{'--rotate': '0deg'}}
                    animate={{'--rotate': '360deg'}}
                    transition={{duration: 2, repeat: Infinity}}
                >
                    <li style={{transform: 'rotate(var(--rotate))'}}>a</li>
                    <li style={{transform: 'rotate(var(--rotate))'}}>b</li>
                    <li style={{transform: 'rotate(var(--rotate))'}}>c</li>
                </motion.ul>
                <motion.svg
                    width={300}
                    height={300}
                    viewBox="0 0 300 300"
                    initial={"hidden"}
                    animate={"visible"}
                    style={{maxWidth: "80vw"}}
                >
                    <motion.circle
                        cx="150"
                        cy="150"
                        r="100"
                        stroke="#ff0088"
                        custom={1}
                        style={{
                            strokeWidth: 10,
                            strokeLinecap: "round",
                            fill: "transparent",
                        }}
                        initial={{pathLength: 0}}
                        transition={{
                            pathLength: {type: "spring", duration: 1.5, bounce: 0}
                        }}
                        animate={{pathLength: 1}}
                    />
                </motion.svg>
                <motion.div
                    initial={false}
                    animate={{backgroundColor: "red"}}
                    className={"w-10 h-10"}
                />
                <AnimatePresence initial={false}>
                    {visible && (
                        <Box
                            sx={{bgcolor: "primary.light", color: "primary.contrastText", borderRadius: 2}}
                            className={"p-2 text-center"}
                            component={motion.div}
                            initial={{opacity: 0, scale: 0}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0}}
                            key={"box"}
                        >
                            using AnimatePresence to provide an exit animation
                        </Box>
                    )}
                </AnimatePresence>
                <Button onClick={() => setVisible(!visible)} variant={"outlined"}>exit</Button>
                <motion.div
                    // using key frame
                    animate={{
                        scale: [1, 2, 2, 1, 1],
                        rotate: [0, 0, 180, 180, 0],
                        borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.5, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                    className={"w-24 h-24 mt-12 mb-12 rounded bg-green-400"}
                />
                <motion.div
                    className={"p-2 w-36 rounded bg-green-400"}
                    whileHover={{
                        scale: [null, 1.1, 1.0],
                        transition: {
                            duration: 0.5,
                            times: [0, 0.6, 1],
                            ease: ["easeIn", "easeOut"],
                        }
                    }}
                >
                    set keyframe to null =&gt; current state
                </motion.div>
                <Box
                    sx={{bgcolor: "primary.light", color: "primary.contrastText", borderRadius: 2}}
                    className={"p-2"}
                    component={motion.div}
                    whileInView={{
                        scale: [null, 1.2, 1.0],
                        transition: {
                            duration: 0.5,
                            times: [0, 0.6, 1],
                        }
                    }}
                >
                    whenInView
                </Box>
            </section>
        </div>
    );
}