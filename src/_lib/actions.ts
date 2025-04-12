import {AccountBrief, R} from "./definitions.ts";

export function getUrl(url: string): string {
    return `${import.meta.env.VITE_APP_BASE_URL}${url}`;
}

export async function refreshRequest() {
    try {
        const response = await fetch(getUrl('/api/auth/refresh'), {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) return (await response.json() as R).code === 0;
        return false;
    } catch (e) {
        console.error('Refresh failed', e);
        return false;
    }
}

export async function refreshableRequest(url: string, init: RequestInit): Promise<R> {
    init.credentials = "include";

    try {
        const response = await fetch(getUrl(url), init);
        const data = await response.json() as R;
        if (response.ok || data.code != 4 || !await refreshRequest()) return data;
        return await (await fetch(getUrl(url), init)).json();
    } catch (error) {
        return {code: 1, message: (error as Error).message};
    }
}

export type AccountResponse = R & {
    fields?: {
        account: AccountBrief;
    }
}

export async function currentAccount(): Promise<AccountResponse> {
    try {
        const result = await refreshableRequest("/api/account/me", {method: "GET"});

        return result as AccountResponse;
    } catch (e) {
        console.error("fetch failed", e);
        return {code: 2, message: (e as Error).message}
    }
}

export async function logout() {
    await fetch(getUrl("/api/auth/logout"), {method: "POST", credentials: "include"});
}