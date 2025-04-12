import {R} from "../../../_lib/definitions.ts";
import {DriverInfo, ItemView} from "../definations.ts";
import {refreshableRequest} from "../../../_lib/actions.ts";

type DriverInfoResponse = R & {
    fields: {
        info: DriverInfo;
    }
}

export const getDriverInfo = async () => {
    return await refreshableRequest("/api/driver/info", {
        method: "GET",
    }) as DriverInfoResponse;
}

type ItemApiResult = R & {
    fields: {
        item: ItemView;
    };
};

type ContentApiResult = R & {
    fields: {
        list: ItemView[];
    };
};

export const itemApi = async (id: number): Promise<ItemApiResult> => {
    return await refreshableRequest(`/api/driver/item/${id}`, { method: "GET" }) as ItemApiResult;
};

export const contentApi = async (id: number): Promise<ContentApiResult> => {
    return await refreshableRequest(`/api/driver/children/${id}`, { method: "GET" }) as ContentApiResult;
};

export const renameItem = async (id: number, name: string) => {
    return await refreshableRequest("/api/driver/rename", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id, name})
    }) as R;
}

export type CreateFolderResult = R & {
    fields?: {
        id: number;
    }
}

export const createFolder = async (folder: number, name: string) => {
    return await refreshableRequest("/api/driver/folder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({folder, name}),
    }) as CreateFolderResult;
}

export const deleteItems = async (ids: number[]): Promise<R> => {
    const params = new URLSearchParams();
    ids.forEach(id => params.append("id", id.toString()));
    return await refreshableRequest(`/api/driver/item?${params}`, { method: "DELETE" }) as R;
}