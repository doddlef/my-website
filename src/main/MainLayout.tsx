import {useColorScheme} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import {clsx} from "clsx";
import {lazy, useMemo} from "react";

const Auth = lazy(() => import("./auth/AuthPage.tsx"));
const Home = lazy(() => import("./home/Layout.tsx"));
const Study = lazy(() => import("./animation/Layout.tsx"));

export default function MainLayout() {
    const { mode } = useColorScheme();
    const isLight = useMemo(() => mode === "light", [mode]);

    return (
        <div className={clsx(isLight ? '' : 'dark')}>
            <Routes>
                <Route index element={<Home />} />
                <Route path={"/auth"} element={<Auth />} />
                <Route path={"/study"} element={<Study />} />
            </Routes>
        </div>
    );
}