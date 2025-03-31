import Page from "./Page.tsx";
import {useEffect, useState} from "react";
import {DriverInfo} from "./_lib/defitions.ts";
import {useAccount} from "../../_component/accountProvider/AccountContext.tsx";
import {refreshableRequest} from "../../_lib/actions.ts";
import {R} from "../../_lib/definitions.ts";
import {DriverInfoContext} from "./_component/infoProvider/DriverInfoContext.ts";

type DriverInfoResponse = R & {
    fields: {
        info: DriverInfo;
    }
}

export default function Layout() {
    const [info, setInfo] = useState<DriverInfo | null>(null);
    const { account, checked } = useAccount();
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        const fetchInfo = async () => {
            const result = await refreshableRequest("/api/driver/info", {
                method: "GET",
            }) as DriverInfoResponse;

            if (result.code === 0) {
                setInfo(result.fields.info)
            }

            setMounted(true);
        }

        if(account && checked) fetchInfo();
    }, [account, checked]);

    if (!mounted) return (
        <div>
            Loading ...
        </div>
    )

    return (
        <DriverInfoContext.Provider value={info}>
            <Page />
        </DriverInfoContext.Provider>
    );
}