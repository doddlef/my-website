import {motion, MotionValue, useTransform} from "motion/react";
import {useColorScheme} from "@mui/material";
import {useMemo} from "react";
import {CardPage} from "../../_page/HorizonPage.tsx";

export default function Background({progress} : {progress: MotionValue<number>}) {
    const { mode } = useColorScheme();
    const isLight = useMemo(() => mode === "light", [mode]);

    return (
        <CardPage className={"absolute top-0 left-0"}>
            {
                Array(5).fill(0).map((_, i) => (
                    <BackgroundLayer progress={progress} index={i} isLight={isLight} key={i}/>
                ))
            }
        </CardPage>
    );
}

function BackgroundLayer(
    {progress, index, isLight=true}
    : {progress: MotionValue<number>, index:number, isLight?: boolean}) {

    const translateX = useTransform(progress, [0, 1], ['0', `-${80-index*10}%`]);
    const name = useMemo(
        () => `/city_background/${isLight?'light':'dark'}/${index+1}.png`, [index, isLight]
    );

    return (
        <motion.div
            className={"absolute top-0 left-0 flex h-full w-fit"}
            style={{translateX, zIndex: 1}}
        >
            <img src={name} alt={name} className={"h-full w-auto"} style={{zIndex: index+1}}/>
            <img src={name} alt={name} className={"h-full w-auto"} style={{zIndex: index+1}}/>
        </motion.div>
    );
}