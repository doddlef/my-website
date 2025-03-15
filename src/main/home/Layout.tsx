import Box from "@mui/material/Box";
import "../../_fonts/pacifico.css";
import "../../_fonts/sour_gummy.css";
import "../../_fonts/tektur.css";
import WelcomePage from "./_page/WelcomePage.tsx";
import HorizonPage from "./_page/HorizonPage.tsx";
import {ReactNode, useEffect, useRef, useState} from "react";
import {motion, useScroll, useSpring, useTransform} from "motion/react";
import ThemeSwitch from "../_component/ThemeSwitch.tsx";
import Typography from "@mui/material/Typography";
import EndingPage from "./_page/EndingPage.tsx";
import ConstructionPage from "./_page/ConstructionPage.tsx";

export default function Layout() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        container: wrapperRef,
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Dynamic calculation of start and end
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(1);

    useEffect(() => {
        const updateScrollRange = () => {
            if (wrapperRef.current && innerRef.current) {
                const wrapper = wrapperRef.current;
                const inner = innerRef.current;

                const wrapperHeight = wrapper.scrollHeight;
                const startOffset = inner.offsetTop;
                const endOffset = startOffset + inner.offsetHeight;

                setStart(startOffset / wrapperHeight);
                setEnd(endOffset / wrapperHeight);
            }
        };

        updateScrollRange();
        window.addEventListener("resize", updateScrollRange);

        return () => {
            window.removeEventListener("resize", updateScrollRange);
        };
    }, []);

    // Use dynamically calculated start and end
    const xProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

    return (
        <Box
            ref={wrapperRef}
            component={"main"}
            className={"overflow-y-scroll overflow-x-hidden w-screen h-screen relative snap-y snap-proximity"}
            sx={{ bgcolor: "background.default" }}
        >
            <motion.div
                className={"w-screen h-1 top-0 left-0 fixed bg-green-400 z-50"}
                style={{ scaleX, originX: 0 }}
            />
            <header className={"w-screen fixed top-0 left-0 z-40 pt-2 pb-2 pr-4 flex items-center justify-end gap-2 bg-opacity-25 backdrop-blur-lg"}>
                <HeaderButton onClick={() => alert("not implement yet!")} selected>
                    <Typography variant={"h6"} sx={{ color: "text.primary" }} fontFamily={"Sour gummy"}>
                        home
                    </Typography>
                </HeaderButton>
                <HeaderButton onClick={() => alert("not implement yet!")}>
                    <Typography variant={"h6"} sx={{ color: "text.primary" }} fontFamily={"Sour gummy"}>
                        blog
                    </Typography>
                </HeaderButton>
                <HeaderButton onClick={() => alert("not implement yet!")}>
                    <Typography variant={"h6"} sx={{ color: "text.primary" }} fontFamily={"Sour gummy"}>
                        driver
                    </Typography>
                </HeaderButton>
                <ThemeSwitch />
            </header>

            <WelcomePage />
            {/* Wrap the target section with a ref */}
            <div ref={innerRef}>
                <HorizonPage progress={xProgress} />
            </div>
            <div className={"snap-always snap-center"}>
                <ConstructionPage />
            </div>
            <EndingPage />
        </Box>
    );
}

function HeaderButton({children, onClick, selected = false}: {
    children: ReactNode,
    onClick: () => void, selected?: boolean}) {
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