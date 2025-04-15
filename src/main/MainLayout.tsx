import {useColorScheme} from "@mui/material";
import {Route, Routes, useLocation} from "react-router-dom";
import {clsx} from "clsx";
import {lazy, useMemo} from "react";
import {AnimatePresence} from "motion/react";
import Transition from "../_component/transition/Transition.tsx";
import Box from "@mui/material/Box";
import AuthRoute from "../_component/authRouter/AuthRoute.tsx";
import DriverWrapper from "./driver_v2/DriverWrapper.tsx";

const Auth = lazy(() => import("./auth/AuthPage.tsx"));
const Blog = lazy(() => import("./blog/Layout.tsx"));
const Home = lazy(() => import("./home/Layout.tsx"));
const Study = lazy(() => import("./animation/Layout.tsx"));

export default function MainLayout() {
    const { mode } = useColorScheme();
    const isLight = useMemo(() => mode === "light", [mode]);
    const location = useLocation();

    return (
        <Box className={clsx(isLight ? '' : 'dark')} sx={{bgcolor: "background.default"}}>
            <AnimatePresence mode={"wait"}>
                <Routes location={location}>
                    <Route index element={
                        <Transition>
                            <Home />
                        </Transition>
                    } />
                    <Route path={"/auth/*"} element={
                        <Transition>
                            <Auth />
                        </Transition>
                    } />
                    <Route path={"/study/*"} element={
                        <Transition>
                            <Study />
                        </Transition>
                    } />
                    <Route path={"/blog/*"} element={
                        <Transition>
                            <Blog />
                        </Transition>
                    } />
                    <Route path={"/driver/*"} element={
                        <AuthRoute>
                            <Transition>
                                <DriverWrapper />
                            </Transition>
                        </AuthRoute>
                    } />
                </Routes>
            </AnimatePresence>
        </Box>
    );
}