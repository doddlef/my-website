import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {SuccessListener, UploadApiContext, UploadHistory, UploadRequest} from "./UploadApiContext.ts";
import {enqueueSnackbar} from "notistack";
import {R} from "../../../../_lib/definitions.ts";
import {refreshableRequest} from "../../../../_lib/actions.ts";

const CHUNK_SIZE = 1024 * 1024 - 1;
const MAX_RETRIES = 3;

type UploadTask = {
    id: string;
    file: File;
    folder: number;
    name: string;
    extension: string;
}

type InitTaskResult = R & {
    fields: {
        lightening?: boolean;
        taskId?: string;
    }
}

class AbortedError extends Error {}

export default function Provider({children} : { children: ReactNode}) {
    const [tasks, setTasks] = useState<UploadHistory[]>([]);
    const [running, setRunning] = useState(false);

    const md5Worker = useRef<Worker | null>(null);
    const isProcessing = useRef<boolean>(false);
    const currentId = useRef<string>(null);
    const waitingQueue = useRef<UploadTask[]>([]);
    const aborted = useRef<boolean>(false);
    const successHandler = useRef<SuccessListener>(() => {});

    useEffect(() => {
        md5Worker.current = new Worker(new URL("./md5Worker.js", import.meta.url));
        return () => md5Worker.current?.terminate();
    }, []);

    async function calculateMd5(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!md5Worker.current) return reject("MD5 Worker is not initialized");

            const worker = md5Worker.current;

            const handleMessage = (e: MessageEvent) => {
                resolve(e.data);
                worker.removeEventListener("message", handleMessage);
                worker.removeEventListener("error", handleError);
            };

            const handleError = (err: Event) => {
                reject(err);
                worker.removeEventListener("message", handleMessage);
                worker.removeEventListener("error", handleError);
            };

            worker.addEventListener("message", handleMessage);
            worker.addEventListener("error", handleError);
            worker.postMessage(file);
        });
    }

    const updateHistory = useCallback((id: string, changes: Partial<UploadHistory>) => {
        setTasks((prev) => prev.map(h => h.id === id ? {...h, ...changes } : h));
    }, [])

    const directlyUpload = useCallback(async (task: UploadTask) => {
        updateHistory(task.id, { status: "preparing", progress: 0});
        const hash = await calculateMd5(task.file);

        updateHistory(task.id, { status: "uploading", progress: 0.25});

        const data = new FormData();
        data.append("name", task.name);
        data.append("extension", task.extension);
        data.append("folder", task.folder.toString());
        data.append("hash", hash);
        data.append("file", task.file);

        if (aborted.current) throw new AbortedError();

        const result = await refreshableRequest("/api/driver/direct-upload", {
            method: "POST",
            body: data
        });

        if (result.code !== 0) throw new Error(result.message);
    }, [updateHistory]);

    const uploadChunk = useCallback(async (task: UploadTask, chunkCount: number, chunkSize: number, taskId: string) => {
        updateHistory(task.id, {status: "uploading", progress: 1 / (chunkCount + 2)});

        let index;
        for (index = 0; index < chunkCount; index++) {
            let retries = 0;
            while (retries < MAX_RETRIES) {
                if (aborted.current) throw new AbortedError();

                try {
                    const chunk = task.file.slice(index * chunkSize, index * chunkSize + chunkSize);
                    const data = new FormData();
                    data.append("chunk", chunk);

                    const result = await refreshableRequest(`/api/driver/task/${taskId}/index/${index}`, {
                        method: "POST",
                        body: data,
                    });

                    if (result.code === 0) {
                        updateHistory(task.id, {status: "uploading", progress: (index + 2) / (chunkCount + 2)});
                        break;
                    } else {
                        console.error(`Chunk ${index} failed:`, result.message);
                        retries++;
                    }
                } catch (error) {
                    console.error(`Chunk ${index} error:`, error);
                    retries++;
                }

                if (retries >= MAX_RETRIES) throw new Error(`fail to upload chunk ${index}`);

            }
        }

    }, [updateHistory]);

    const uploadChunkFinish = useCallback(async (taskId: string) => {
        if (aborted.current) throw new AbortedError();
        const result = await refreshableRequest(`/api/driver/finish/task/${taskId}`, {
            method: "POST",
        });

        if (result.code !== 0) throw new Error(result.message);

    }, []);

    const chunkUpload = useCallback(async (task: UploadTask) => {
        updateHistory(task.id, {status: "preparing", progress: 0});
        const hash = await calculateMd5(task.file);
        const chunkCount = Math.ceil(task.file.size / CHUNK_SIZE);

        if (aborted.current) throw new AbortedError();

        const result = await refreshableRequest("/api/driver/init/task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: task.name,
                extension: task.extension,
                folder: task.folder,
                size: task.file.size,
                chunkCount,
                chunkSize: CHUNK_SIZE,
                hash
            })
        }) as InitTaskResult;

        if (result.code === 0) {
            if (result.fields.lightening) {
                return;
            }
            if (result.fields.taskId) {
                await uploadChunk(task, chunkCount, CHUNK_SIZE, result.fields.taskId);
                await uploadChunkFinish(result.fields.taskId);
                return;
            }
        }
        throw new Error(result.message);
    }, [updateHistory, uploadChunk, uploadChunkFinish]);

    const processNext = useCallback(async () => {
        console.log("process start");
        // if processing, waiting in queue
        if (isProcessing.current) return;
        isProcessing.current = true;
        setRunning(true);

        const process = async () => {
            // load current task, and initialize
            const task = waitingQueue.current.shift();

            // if current task not exist, all task has been finished, quit
            if (!task) return;
            aborted.current = false;
            currentId.current = task.id;

            try {
                if (task.file.size <= CHUNK_SIZE) {
                    await directlyUpload(task);
                } else {
                    await chunkUpload(task);
                }

                updateHistory(task.id, {status: "finished", progress: 1});
                enqueueSnackbar("one item uploaded successfully", {variant: "success"});
                successHandler.current(task.id, task.folder);
            } catch (e) {
                if (e instanceof AbortedError) {
                    updateHistory(task.id, {status: "cancelled", progress: 0});
                } if(e instanceof Error) {
                    updateHistory(task.id, {status: "error", progress: 0});
                    enqueueSnackbar(`upload error: ${e.message}`, {variant: "error"});
                } else {
                    updateHistory(task.id, {status: "error", progress: 0});
                    enqueueSnackbar(`failed to upload ${task.name}`, {variant: "error"});
                    console.error(e);
                }
            } finally {
                aborted.current = false;
                currentId.current = null;
            }

            await process();
        }

        await process();

        // after all task finished
        isProcessing.current = false;
        setRunning(false);
    }, [chunkUpload, directlyUpload, updateHistory]);

    const upload = useCallback(async (request: UploadRequest) => {
        const id = crypto.randomUUID();
        setTasks((prev) => [
            ...prev,
            {
                id,
                name: request.file.name,
                status: "waiting",
                progress: 0
            }
        ]);
        waitingQueue.current.push({
            id,
            ...request,
            ...getNameAndExtension(request.file),
        });
        if (!isProcessing.current) await processNext();
    }, [processNext]);

    const cancelTask = useCallback((id: string) => {
        if (id === currentId.current) aborted.current = true;
        waitingQueue.current = waitingQueue.current.filter((t) => t.id !== id);
        updateHistory(id, {status: "cancelled", progress: 0});
    }, [updateHistory]);

    const onSuccess = useCallback(
        (listener: SuccessListener) => successHandler.current = listener, []
    )

    return (
        <UploadApiContext.Provider value={{ upload, cancelTask, tasks, running, onSuccess }}>
            {children}
        </UploadApiContext.Provider>
    );
}

const getNameAndExtension = (file: File) => {
    const i = file.name.lastIndexOf(".");
    if (i < 0 ) return {name: file.name, extension: ''}
    return {name: file.name.substring(0, i), extension: file.name.substring(i + 1)}
}