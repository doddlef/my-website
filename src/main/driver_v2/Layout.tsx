import {lazy, useCallback, useEffect, useState} from "react";
import {DriverInfo} from "./definations.ts";
import {useAccount} from "../../_component/accountProvider/AccountContext.tsx";
import {getDriverInfo} from "./_api/CoreApi.ts";
import {DriverInfoContext} from "./_lib/driverInfo/DriverInfoContext.ts";
import Box from "@mui/material/Box";
import NavHeader from "./_component/NavHeader.tsx";
import NavSideBar from "./_component/NavSiderBar.tsx";
import {Route, Routes} from "react-router-dom";
import ContentCacheProvider from "./_middleware/ContentCache/ContentCacheProvider.tsx";
import UploadApiProvider from "./_middleware/uploadApi2/UploadApiProvider.tsx";

const Explorer = lazy(() => import("./explorer/Layout.tsx"));

export default function Layout() {
    const [info, setInfo] = useState<DriverInfo | null>(null);
    const { account, checked } = useAccount();
    const [mounted, setMounted] = useState(false);

    const refreshInfo = useCallback(async () => {
        const result = await getDriverInfo();

        if (result.code === 0) {
            setInfo(result.fields.info)
        } else {
            console.error(`fail to get driver info: ${result.message}`);
        }
    }, [])

    useEffect(() => {
        if (account && checked) {
            refreshInfo().finally(() => setMounted(true));
        }
    }, [account, checked, refreshInfo]);

    if (!mounted) {
        return <div>Loading ...</div>
    }

    if (!info) {
        return <div>Cannot get driver usage, please ensure you have authority to use driver</div>
    }

    return (
        <DriverInfoContext.Provider value={{ info, refreshInfo }}>
            <ContentCacheProvider>
                <UploadApiProvider>
                    <Box
                        sx={{bgcolor: "background.default", color: "text.primary"}}
                        className={"w-screen h-screen overflow-hidden flex"}
                    >
                        <NavSideBar />
                        <Box className={"flex-1 h-screen"}>
                            <NavHeader />
                            <Routes>
                                <Route index element={<Explorer/>} />
                            </Routes>
                        </Box>
                    </Box>
                </UploadApiProvider>
            </ContentCacheProvider>
        </DriverInfoContext.Provider>
    )
}