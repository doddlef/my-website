import React, { createContext, useContext } from "react";
import {AccountBrief} from "../../_lib/definitions.ts";

interface AccountContextType {
    account: AccountBrief | null;
    setAccount: React.Dispatch<React.SetStateAction<AccountBrief | null>>;
    checked: boolean;
}

export const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = () => {
    const context = useContext(AccountContext);

    if (!context) {
        throw new Error("useAccount must be used within an AccountProvider");
    }

    return context;
};