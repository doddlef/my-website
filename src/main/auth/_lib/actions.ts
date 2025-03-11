import {getUrl} from "../../../_lib/actions.ts";
import {AccountBrief} from "../../../_lib/definitions.ts";

export type AuthResult = {
    code: number;
    message: string;
    fields?: {
        account: AccountBrief;
    }
}

export async function localLogin(email: string, password: string) {
    try {
        const response = await fetch(getUrl("/api/auth"), {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });

        return await response.json() as AuthResult;
    } catch (e) {
        console.error(e);
        throw e;
    }
}