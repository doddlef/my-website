import {useRef} from "react";
import {useScroll, motion, useSpring, useTransform} from "motion/react";

export default function HorizonPage() {
    const wrapperRef = useRef(null);

    const { scrollYProgress } = useScroll({
        container: wrapperRef,
    })

    const springX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    })

    const translateX = useTransform(springX, [0, 0.25, 0.75, 1], ['0', '-25%', '-50%', '-75%']);

    return (
        <div ref={wrapperRef} className={"w-screen h-screen overflow-y-scroll overflow-x-hidden"}>
            <div className={"w-screen relative"} style={{height: "1000vh"}}>
                <div className={"h-screen sticky top-0"}>
                    <motion.div
                        className={"w-screen h-1 top-0 left-0 absolute bg-green-400 z-50"}
                        style={{scaleX: springX, originX: 0}}
                    />
                    <motion.div className={" flex items-center w-fit z-10"} style={{translateX: translateX}}>
                        <IntroductionCard />
                        <div className={"w-screen h-screen bg-red-400"}/>
                        <div className={"w-screen h-screen bg-blue-400"}/>
                        <div className={"w-screen h-screen bg-yellow-400"}/>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function IntroductionCard() {
    return (
        <div className={"w-screen h-screen"}>

        </div>
    );
}