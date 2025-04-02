import { createContext, useContext } from "react";

export type UploadTaskStatus = "waiting" | "preparing" | "uploading" | "finished" | "cancelled" | "error";

export type UploadRequest = {
    file: File;
    folder: number;
}

export type UploadHistory = {
    id: string;
    name: string;
    status: UploadTaskStatus;
    progress: number;
}

export type UploadApi = {
    upload: (request: UploadRequest) => Promise<void>;
    cancelTask: (taskId: string) => void;
    tasks: UploadHistory[];
    running: boolean;
};

export const UploadApiContext = createContext<UploadApi | undefined>(undefined);

export const useUploadApi = () => {
    const context = useContext(UploadApiContext);
    if (!context) {
        throw new Error("useUploadApi must be used within UploadApiProvider");
    }
    return context;
};