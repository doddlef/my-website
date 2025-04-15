import {useCallback, useEffect, useState} from "react";
import {DriverInfo} from "./definations.ts";
import {useAccount} from "../../_component/accountProvider/AccountContext.tsx";
import {getDriverInfo} from "./_api/CoreApi.ts";
import {DriverInfoContext} from "./_middleware/driverInfo/DriverInfoContext.ts";
import FolderTreeProvider from "./_middleware/folderTree/FolderTreeProvider2.tsx";
import Page from "./Page.tsx";

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

    useEffect(() => {
        console.log("layout");
    }, []);

    if (!mounted) {
        return <div>Loading ...</div>
    }

    if (!info) {
        return <div>Cannot get driver usage, please ensure you have authority to use driver</div>
    }

    return (
        <DriverInfoContext.Provider value={{ info, refreshInfo }}>
            <FolderTreeProvider>
                <Page />
            </FolderTreeProvider>
        </DriverInfoContext.Provider>
    )
}