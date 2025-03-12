import {useColorScheme} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import {clsx} from "clsx";
import {lazy} from "react";

const Auth = lazy(() => import("./auth/AuthPage.tsx"));
const Home = lazy(() => import("./home/Layout.tsx"));
const Study = lazy(() => import("./animation/Layout.tsx"));

export default function MainLayout() {
    const { mode } = useColorScheme();

    return (
        <div className={clsx({"dark": mode === "dark"})}>
            <Routes>
                <Route index element={<Home />} />
                <Route path={"/auth"} element={<Auth />} />
                <Route path={"/study"} element={<Study />} />
            </Routes>
        </div>
    );
}