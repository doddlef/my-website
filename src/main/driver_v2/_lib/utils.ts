import {FileType} from "../definations.ts";

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;

    const units = ["KB", "MB", "GB", "TB", "PB"];
    let unitIndex = -1;
    let size = bytes;

    do {
        size /= 1024;
        unitIndex++;
    } while (size >= 1024 && unitIndex < units.length - 1);

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

function getViewPictureName(type: FileType | null): string {
    switch (type) {
        case "FOLDER": return "folder"
        case "FILE": return "unknown"
        case "IMAGE": return "image"
        case "VIDEO": return "video"
        case "AUDIO": return "audio"
        case "ZIP": return "archive"
        case "WORD": return "word"
        case "PDF": return "pdf"
        default: return "unknown"
    }
}

export function getViewPicture(type: FileType | null): string {
    return `/file_icon/${getViewPictureName(type)}.svg`;
}

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(localizedFormat);

export function formatSmartDate(input: string): string {
    const date = dayjs(input);
    if (date.isToday()) {
        return `Today ${date.format("h:mm A")}`;
    }
    return date.format("MMM D, YYYY");
}