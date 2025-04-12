import {R} from "../../../_lib/definitions.ts";
import {BinItemView} from "../definations.ts";
import {refreshableRequest} from "../../../_lib/actions.ts";

type BinContentResult = R & {
    fields: {
        list: BinItemView[];
    }
}

export const binContent = async () => {
    return await refreshableRequest("/api/driver/bin", { method: 'GET' }) as BinContentResult;
}

export const restoreFromTrash = async (ids: number[]) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", id.toString()));

    return await refreshableRequest(`/api/driver/restore?${params}`, {method: "PUT"}) as R;
}

export const deleteForever = async (ids: number[]) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", id.toString()));
    return await refreshableRequest(`/api/driver/item/forever?${params}`, {method: "DELETE"}) as R;
}