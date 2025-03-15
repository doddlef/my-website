import {ReactNode, useRef} from "react";
import {useScroll, motion, useTransform} from "motion/react";
import MovingBackground from "../_component/horizonBackground/MovingBackground";
import IntroductionCard from "./_horizonCard/IntroductionCard";
import TechStackCard from "./_horizonCard/TechStackCard.tsx";
import DevelopCard from "./_horizonCard/DevelopCard.tsx";
import DailyCard from "./_horizonCard/DailyCard";
import {clsx} from "clsx";

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
        <>
            <div ref={wrapperRef} className={"hidden md:block w-screen h-screen overflow-y-scroll overflow-x-hidden"}>
                <div className={"w-screen relative"} style={{height: "1000vh"}}>
                    <div className={"h-screen sticky top-0"}>
                        <MovingBackground progress={scrollYProgress}/>
                        <motion.div
                            className={"absolute flex items-center w-fit z-20"}
                            style={{translateX: translateX}}
                            transition={{duration: 0.5}}
                        >
                            <IntroductionCard/>
                            <DailyCard/>
                            <TechStackCard/>
                            <DevelopCard/>
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className={"w-full flex flex-col gap-4 md:hidden"}>
                <IntroductionCard/>
                <DailyCard/>
                <TechStackCard/>
                <DevelopCard/>
            </div>
        </>
    );
}

export const CardPage = ({children, className}:{children: ReactNode,className?: string} ) => {
    return (
        <div className={clsx(className, "md:h-screen w-screen")}>
            {children}
        </div>
    )
}