import Box from "@mui/material/Box";
import "../../_fonts/pacifico.css";
import "../../_fonts/sour_gummy.css";
import "../../_fonts/tektur.css";
import WelcomePage from "./_page/WelcomePage.tsx";
import HorizonPage from "./_page/HorizonPage.tsx";
import {ReactNode, useRef} from "react";
import {motion, useScroll, useSpring} from "motion/react";
import ThemeSwitch from "../_component/ThemeSwitch.tsx";
import Typography from "@mui/material/Typography";
import EndingPage from "./_page/EndingPage.tsx";
import ConstructionPage from "./_page/ConstructionPage.tsx";

type Section = {
    node: ReactNode,
    title: string,
    containClass?: string,
}

const catalogue:Section[] = [
    {node:<WelcomePage/>, title:"Welcome"},
    {node:<HorizonPage/>, title:"About me"},
    {node:<ConstructionPage/>, title: "construction"},
    // {node:<div className={"w-full h-screen bg-green-400 snap-start"}/>, title: "test 3"},
    {node:<EndingPage />, title: "ending 1"},
]

export default function Layout() {
    const wrapperRef = useRef(null);

    const {scrollYProgress} = useScroll({
        container: wrapperRef,
    })

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <Box
            ref={wrapperRef}
            component={"main"}
            className={"overflow-y-scroll overflow-x-hidden snap-mandatory snap-y w-screen h-screen relative"}
            sx={{bgcolor: "background.default"}}
        >
            <motion.div
                className={"w-screen h-1 top-0 left-0 fixed bg-green-400 z-50"}
                style={{scaleX, originX: 0}}
            />
            <header className={"w-screen fixed top-0 left-0 z-40 pt-2 pb-2 pr-4 flex items-center justify-end gap-2"}>
                <HeaderButton onClick={() => alert("not implement yet!")} selected>
                    <Typography variant={"h6"} sx={{color: "text.primary"}} fontFamily={"Sour gummy"}>
                        home
                    </Typography>
                </HeaderButton>
                <HeaderButton onClick={() => alert("not implement yet!")}>
                    <Typography variant={"h6"} sx={{color: "text.primary"}} fontFamily={"Sour gummy"}>
                        blog
                    </Typography>
                </HeaderButton>
                <HeaderButton onClick={() => alert("not implement yet!")}>
                    <Typography variant={"h6"} sx={{color: "text.primary"}} fontFamily={"Sour gummy"}>
                        driver
                    </Typography>
                </HeaderButton>
                <ThemeSwitch />
            </header>
            {catalogue.map((section, index) => (
                <div className={section.containClass ?? "md:snap-always md:snap-start"} key={index}>
                    {section.node}
                </div>
            ))}
        </Box>
    );
}

function HeaderButton({children, onClick, selected=false} : {children: ReactNode, onClick:() => void, selected?: boolean}) {
    if (selected) {
        return (
            <div className={"pl-2 pr-6 pt-1 pb-1 rounded-l flex items-center gap-2"}>
                <div className={"w-2 h-2 rounded-full block bg-green-400 dark:bg-green-600"} />
                {children}
            </div>
        )
    }
    return (
        <motion.div
            className={"pl-2 pr-6 pt-1 pb-1 rounded-l cursor-pointer flex items-center gap-2"}
            whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(225, 225, 225, 0.2)",
                boxShadow: "0 0 2px rgba(225, 225, 225, 0.2)",
            }}
            whileTap={{
                scale: 1.2,
            }}
            transition={{
                duration: 0.4,
            }}
            onClick={onClick}
        >
            <div className={"w-2 h-2 rounded-full block bg-transparent"} />
            {children}
        </motion.div>
    );
}