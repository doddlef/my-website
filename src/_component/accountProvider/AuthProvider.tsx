import React, {useEffect, useState} from "react";
import { AccountContext } from "./AccountContext.tsx";
import {AccountBrief} from "../../_lib/definitions.ts";
import {currentAccount, refreshableRequest} from "../../_lib/actions.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode, autoLogin?: boolean }> = ({ children, autoLogin=true }) => {
    const [account, setAccount] = useState<AccountBrief | null>(null);
    const [checked, setChecked] = useState<boolean>(!autoLogin);

    useEffect(() => {
        const fetchAccount = async () => {
            const result = await currentAccount();
            if (result.code === 0 && result.fields?.account) setAccount(result.fields.account);
            else setAccount(null);

            setChecked(true);
        }

        if(autoLogin) fetchAccount().catch(e => console.error(e));
    }, [autoLogin]);

    useEffect(() => {
        const autoRefresh = setInterval(() => {
            refreshableRequest("/api/s", {method: "GET"}).catch(e => console.error(e));
        }, 5 * 60 * 1000);

        return () => clearInterval(autoRefresh);
    }, []);

    return (
        <AccountContext.Provider value={{ account, setAccount, checked }}>
            {children}
        </AccountContext.Provider>
    );
};