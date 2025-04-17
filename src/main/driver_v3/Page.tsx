import Box from "@mui/material/Box";
import NavHeader from "./_component/NavHeader.tsx";
import {Route, Routes} from "react-router-dom";
import {lazy} from "react";

const Home = lazy(() => import("./explorer/Layout.tsx"));

export default function Page() {
    return (
        <Box
            sx={{color: "text.primary"}}
            className={"w-screen h-screen flex max-h-screen bg-gray-50 dark:bg-gray-800"}
        >
            <div>side bar</div>
            <Box className={"flex-1 h-screen flex flex-col"}>
                <NavHeader/>
                <div className={"w-full flex-1 p-4 pb-0 overflow-hidden"}>
                    <Routes>
                        <Route index element={<Home />} />
                    </Routes>
                </div>
            </Box>
        </Box>
);
}