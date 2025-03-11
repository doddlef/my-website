import React, {useEffect, useState} from "react";
import { AccountContext } from "./AccountContext.tsx";
import {AccountBrief} from "../../_lib/definitions.ts";
import {currentAccount} from "../../_lib/actions.ts";

export const AccountProvider: React.FC<{ children: React.ReactNode, autoLogin?: boolean }> = ({ children, autoLogin=true }) => {
    const [account, setAccount] = useState<AccountBrief | null>(null);
    const [checked, setChecked] = useState<boolean>(!autoLogin);

    useEffect(() => {
        const fetchAccount = async () => {
            const result = await currentAccount();
            if (result.fields?.account) setAccount(result.fields.account);
            else setAccount(null);

            setChecked(true);
        }

        if(autoLogin) fetchAccount();
    }, [autoLogin]);

    return (
        <AccountContext.Provider value={{ account, setAccount, checked }}>
            {children}
        </AccountContext.Provider>
    );
};