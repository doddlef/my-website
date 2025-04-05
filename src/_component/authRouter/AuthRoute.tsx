import {ReactNode} from "react";
import {useAccount} from "../accountProvider/AccountContext.tsx";
import {Navigate} from "react-router-dom";

export default function AuthRoute({children} : {children: ReactNode}) {
    const { account, checked } = useAccount();

    if (!checked) return <div>Loading...</div>;
    if (!account) return <Navigate to={"/auth"} />
    return <>{children}</>;
}