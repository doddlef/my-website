import Page from "./Page.tsx";
import {useCallback, useEffect, useState} from "react";
import {DriverInfo} from "./_lib/defitions.ts";
import {useAccount} from "../../_component/accountProvider/AccountContext.tsx";
import {refreshableRequest} from "../../_lib/actions.ts";
import {R} from "../../_lib/definitions.ts";
import {DriverInfoContext} from "./_component/infoProvider/DriverInfoContext.ts";
import StructureApiProvider from "./_component/api/structureApi/StructureApiProvider.tsx";
import UploadApiProvider from "./_component/api/uploadApi2/UploadApiProvider.tsx";

type DriverInfoResponse = R & {
    fields: {
        info: DriverInfo;
    }
}

export default function Layout() {
    const [info, setInfo] = useState<DriverInfo | null>(null);
    const { account, checked } = useAccount();
    const [mounted, setMounted] = useState<boolean>(false);

    const refreshInfo = useCallback(async () => {
        const result = await refreshableRequest("/api/driver/info", {
            method: "GET",
        }) as DriverInfoResponse;

        if (result.code === 0) {
            setInfo(result.fields.info)
        }
    }, [])

    useEffect(() => {
        if(account && checked) {
            refreshInfo().finally(() => setMounted(true));
        }
    }, [account, checked, refreshInfo]);

    if (!mounted || !info) return (
        <div>
            Loading ...
        </div>
    )

    return (
        <DriverInfoContext.Provider value={{info, refreshInfo}}>
            <StructureApiProvider>
                <UploadApiProvider>
                    <Page />
                </UploadApiProvider>
            </StructureApiProvider>
        </DriverInfoContext.Provider>
    );
}