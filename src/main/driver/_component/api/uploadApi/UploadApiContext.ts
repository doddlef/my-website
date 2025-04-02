import { createContext, useContext } from "react";

export type UploadTaskStatus = "waiting" | "preparing" | "uploading" | "finished" | "cancelled" | "error";

export type UploadRequest = {
    file: File;
    folder: number;
    name: string;
    extension: string;
}

export type UploadTask = {
    id: string;
    file: File;
    folder: number;
    status: UploadTaskStatus;
    name: string;
    extension: string;
    progress: number;
    retries: number;
};

export type UploadApi = {
    upload: (request: UploadRequest) => Promise<void>;
    cancelTask: (taskId: string) => void;
    tasks: UploadTask[];
};

export const UploadApiContext = createContext<UploadApi | undefined>(undefined);

export const useUploadApi = () => {
    const context = useContext(UploadApiContext);
    if (!context) {
        throw new Error("useUploadApi must be used within UploadApiProvider");
    }
    return context;
};