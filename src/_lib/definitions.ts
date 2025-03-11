export type AccountState = "ACTIVE" | "LOCKED" | "DELETED";
export type AccountRole = "GUEST" | "ADMIN";

export type AccountBrief = {
    uid: number,
    nickname: string,
    avatar?: string,
    state: AccountState,
    role: AccountRole,
}

export type R = {
    code: number,
    message: string,
}