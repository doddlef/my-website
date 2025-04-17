import {useCallback, useEffect, useState} from "react";
import {DriverInfo} from "./definitions.ts";
import {useAccount} from "../../_component/accountProvider/AccountContext.tsx";
import {getDriverInfo} from "./apis.ts";
import {DriverContext} from "./_hooks/useDriver.ts";
import FolderTreeProvider from "./_middleware/useFolderTree/FolderTreeProvider.tsx";
import Page from "./Page.tsx";
import UploadApiProvider from "./_middleware/uploadApi2/UploadApiProvider.tsx";
import FileCacheProvider from "./_middleware/fileCache/FileCacheProvider.tsx";
import ModalsProvider from "./_middleware/useModals/ModalsProvider.tsx";
import UseMenuProvider from "./_middleware/useMenu/UseMenuProvider.tsx";

function Layout() {
    const {account, checked} = useAccount();

    /***********************drive info part*********************************/
    const [info, setInfo] = useState<DriverInfo | null>(null);
    const refresh = useCallback(async () => {
        const result = await getDriverInfo();

        if (result.code === 0 && result.fields?.info) {
            setInfo(result.fields.info)
        } else {
            console.error(`fail to get driver info: ${result.message}`);
        }
    }, []);

    // auth fetch drive info
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        if (account && checked) refresh().finally(() => setMounted(true));
    }, [account, checked, refresh]);

    /***********************render part*********************************/
    if (!mounted) return <div>Loading ...</div>;
    if (!info) return <div>Cannot get driver usage, please ensure you have authority to use driver</div>

    return (
        <DriverContext.Provider value={{...info, refresh}}>
            <FolderTreeProvider>
                <Page />
            </FolderTreeProvider>
        </DriverContext.Provider>
    )
}

function Wrapper() {
    return (
        <FileCacheProvider>
            <UploadApiProvider>
                <ModalsProvider>
                    <UseMenuProvider>
                        <Layout />
                    </UseMenuProvider>
                </ModalsProvider>
            </UploadApiProvider>
        </FileCacheProvider>
    );
}

export default Wrapper;