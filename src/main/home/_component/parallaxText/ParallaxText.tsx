import { motion, useMotionValue, useTransform, useAnimationFrame, wrap } from "framer-motion";
import { useRef } from "react";
import "../../../../_fonts/jersey.css";

interface ParallaxProps {
    children: string;
    speed?: number;
}

export function ParallaxText({ children, speed = 10 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const directionFactor = useRef<number>(1);

    useAnimationFrame((_, delta) => {
        const moveBy = directionFactor.current * speed * (delta / 1000);
        baseX.set(baseX.get() + moveBy);
    });

    // Ensure smooth infinite scrolling effect by wrapping values
    const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

    return (
        <div className={"w-full overflow-x-hidden"}>
            <motion.div
                className={"w-fit font-bold uppercase text-8xl flex whitespace-nowrap flex-nowrap"}
                style={{ x }}>
                {
                    Array(8).fill(0).map((_, i) => (
                        <span key={i} className={"block mr-8 dark:text-white text-slate-900 jersey"}>
                            {children}
                        </span>
                    ))
                }
            </motion.div>
        </div>
    );
}