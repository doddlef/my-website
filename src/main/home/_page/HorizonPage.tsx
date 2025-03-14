import {useRef} from "react";
import {useScroll, motion, useTransform} from "motion/react";
import IntroductionCard from "./_horizonCard/IntroductionCard";
import MovingBackground from "../_component/horizonBackground/MovingBackground";
import TechStackCard from "./_horizonCard/TechStackCard.tsx";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";

export default function HorizonPage() {
    const wrapperRef = useRef(null);

    const { scrollYProgress } = useScroll({
        container: wrapperRef,
    })

    const translateX = useTransform(
        scrollYProgress,
        [ 0, 0.15,   0.25,    0.4,    0.5,   0.65,   0.75],
        ['0', '0', '-25%', '-25%', '-50%', '-50%', '-75%']
    );

    return (
        <div ref={wrapperRef} className={"w-screen h-screen overflow-y-scroll overflow-x-hidden"}>
            <div className={"w-screen relative"} style={{height: "1000vh"}}>
                <div className={"h-screen sticky top-0"}>
                    <MovingBackground progress={scrollYProgress}/>
                    <motion.div
                        className={"absolute flex items-center w-fit z-20"}
                        style={{translateX: translateX}}
                        transition={{duration: 0.5}}
                    >
                        <IntroductionCard/>
                        <TechStackCard/>
                        <div className={"w-screen h-screen bg-blue-400 bg-opacity-30"}/>
                        <div className={"w-screen h-screen bg-yellow-400 bg-opacity-30"}/>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export const CardPage = styled(Box)((() => ({
    width: "100vw",
    height: "100vh",
})));