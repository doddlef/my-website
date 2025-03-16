import {useColorScheme} from "@mui/material";
import {Route, Routes, useLocation} from "react-router-dom";
import {clsx} from "clsx";
import {lazy, useMemo} from "react";
import {AnimatePresence} from "motion/react";
import Transition from "../_component/transition/Transition.tsx";

const Auth = lazy(() => import("./auth/AuthPage.tsx"));
const Home = lazy(() => import("./home/Layout.tsx"));
const Study = lazy(() => import("./animation/Layout.tsx"));

export default function MainLayout() {
    const { mode } = useColorScheme();
    const isLight = useMemo(() => mode === "light", [mode]);
    const location = useLocation();

    return (
        <div className={clsx(isLight ? '' : 'dark')}>
            <AnimatePresence mode={"wait"}>
                <Routes location={location} key={location.pathname}>
                    <Route index element={
                        <Transition>
                            <Home />
                        </Transition>
                    } />
                    <Route path={"/auth"} element={
                        <Transition>
                            <Auth />
                        </Transition>
                    } />
                    <Route path={"/study"} element={
                        <Transition>
                            <Study />
                        </Transition>
                    } />
                </Routes>
            </AnimatePresence>
        </div>
    );
}