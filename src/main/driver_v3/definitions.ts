export interface DriverInfo {
    ownerUid: number,
    rootFolder: number,
    maxSpace: number,
    usedSpace: number
}

export type FileType = "FOLDER" | "FILE" | "IMAGE" | "VIDEO" | "AUDIO" | "ZIP" | "WORD" | "PDF"

export type ItemView = {
    id: number,
    name: string,
    fileType: FileType,
    folderId: number,
    size: number | null;
    ownerUid: number,
    createdAt: string,
    editedAt: string,
    folder: boolean
}
