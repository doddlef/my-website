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

export const itemApi = async (id: number): Promise<ItemApiResult> => {
    return await refreshableRequest(`/api/driver/item/${id}`, { method: "GET" }) as ItemApiResult;
};

export type ContentSearchParams = {
    offset?: number;
    limit?: number;
    sortBy?: "name" | "size" | "editedAt";
    direction?: "ASC" | "DESC";
};

type ContentApiResult = R & {
    fields: {
        list: ItemView[];
        hasNext: boolean;
    };
};

export const contentApi = async (
    id: number,
    params?: ContentSearchParams
): Promise<ContentApiResult> => {
    const searchParams = new URLSearchParams();

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });
    }

    const response = await refreshableRequest(`/api/driver/children/${id}?${searchParams}`, {
        method: "GET",
    });

    return response as ContentApiResult;
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

export const moveItems = async (items: number[], folder: number) => {
    return await refreshableRequest(`/api/driver/move`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({items, folder}),
    }) as R;
}